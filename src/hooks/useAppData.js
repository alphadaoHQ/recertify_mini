import { useEffect, useMemo, useState } from "react";
import { useTonAddress, useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import { createAppViewModel, loadLeaderboard, loadWalletState, loadWhitelistStatus, saveUsername, saveWalletState } from "../lib/appData";
import { fetchActiveCourses, fetchActiveTasks } from "../lib/adminData";
import { formatWalletAddress } from "../lib/wallet";
import { getTelegramContext, initializeTelegramApp } from "../lib/telegram";
import { seedData } from "../data/mockData";

function getWalletDisplayName(telegram, walletAddress) {
  if (telegram?.user?.first_name) {
    return `${telegram.user.first_name}${telegram.user.last_name ? ` ${telegram.user.last_name}` : ""}`;
  }

  return formatWalletAddress(walletAddress);
}

export function useAppData() {
  const telegram = getTelegramContext();
  const tonAddress = useTonAddress();
  const tonWallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();

  const walletAddress = tonAddress || null;
  const isWalletConnected = Boolean(tonWallet);

  const [isTelegramReady, setIsTelegramReady] = useState(false);
  const [isWalletConnecting, setIsWalletConnecting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [walletState, setWalletState] = useState({
    profile: seedData.user,
    courseProgress: {},
    rewards: [],
    specialQuestClaimed: false,
    taskClaims: {},
  });
  const [leaderboardState, setLeaderboardState] = useState({
    currentUserRank: null,
    leaderboard: seedData.defaultLeaderboard,
  });
  const [whitelistStatus, setWhitelistStatus] = useState(null);
  const [dynamicModules, setDynamicModules] = useState(null);
  const [dynamicTasks, setDynamicTasks] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const telegramReady = initializeTelegramApp();
    setIsTelegramReady(telegramReady);

    // Load admin-managed courses and tasks from Supabase (falls back to seedData)
    (async () => {
      try {
        const [courses, tasks] = await Promise.all([fetchActiveCourses(), fetchActiveTasks()]);
        if (courses) setDynamicModules(courses);
        if (tasks) setDynamicTasks(tasks);
      } catch {
        // Supabase tables may not exist yet — seedData will be used
      }
    })();
  }, []);

  const refreshState = async (address) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const nextWalletState = await loadWalletState(address, getWalletDisplayName(telegram, address));
      const nextLeaderboardState = await loadLeaderboard(nextWalletState);
      const nextWhitelistStatus = await loadWhitelistStatus(address, nextWalletState);
      setWalletState(nextWalletState);
      setLeaderboardState(nextLeaderboardState);
      setWhitelistStatus(nextWhitelistStatus);
    } catch (error) {
      setErrorMessage(error.message || "Unable to load your app data.");
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh state whenever the TON wallet address changes
  useEffect(() => {
    refreshState(walletAddress);
  }, [walletAddress]);

  const persistWalletState = async (updater, successMessage) => {
    if (!walletAddress) {
      setErrorMessage("Connect your wallet to save progress and claim rewards.");
      return false;
    }

    try {
      const nextWalletState = updater(walletState);
      await saveWalletState(nextWalletState);
      const nextLeaderboardState = await loadLeaderboard(nextWalletState);
      const nextWhitelistStatus = await loadWhitelistStatus(walletAddress, nextWalletState);
      setWalletState(nextWalletState);
      setLeaderboardState(nextLeaderboardState);
      setWhitelistStatus(nextWhitelistStatus);
      setStatusMessage(successMessage);
      setErrorMessage("");
      return true;
    } catch (error) {
      setErrorMessage(error.message || "We could not save this action.");
      return false;
    }
  };

  const connectWallet = async () => {
    setIsWalletConnecting(true);
    setErrorMessage("");

    try {
      await tonConnectUI.openModal();
    } catch (error) {
      setErrorMessage(error.message || "Wallet connection failed.");
    } finally {
      setIsWalletConnecting(false);
    }
  };

  const disconnectWalletHandler = async () => {
    try {
      await tonConnectUI.disconnect();
      setStatusMessage("Wallet disconnected.");
    } catch (error) {
      setErrorMessage(error.message || "Failed to disconnect wallet.");
    }
  };

  const completeModule = async (moduleId, selectedAnswerId) => {
    const modules = dynamicModules || seedData.modules;
    const module = modules.find((entry) => entry.id === moduleId);
    if (!module) {
      setErrorMessage("This course module could not be found.");
      return { completed: false };
    }

    const correctAnswer = module.answers.find((answer) => answer.correct);
    if (!selectedAnswerId) {
      setErrorMessage("Select an answer before completing the module.");
      return { completed: false };
    }

    if (selectedAnswerId !== correctAnswer.id) {
      await persistWalletState(
        (current) => ({
          ...current,
          courseProgress: {
            ...current.courseProgress,
            [moduleId]: {
              module_id: moduleId,
              completed: false,
              reward_claimed: false,
              selected_answer: selectedAnswerId,
              xp_earned: 0,
              completed_at: null,
            },
          },
        }),
        "Answer saved. Try again to unlock the reward.",
      );

      setErrorMessage("That answer is incorrect. Review the mission and try again.");
      return { completed: false, incorrect: true };
    }

    if (walletState.courseProgress[moduleId]?.reward_claimed) {
      setStatusMessage("Reward already claimed for this module.");
      return { completed: true, alreadyClaimed: true };
    }

    const claimedAt = new Date().toISOString();
    const reward = {
      reward_id: module.nftReward.id,
      reward_type: "module",
      title: module.nftReward.title,
      rarity: module.nftReward.rarity,
      image: module.nftReward.image,
      module_id: module.id,
      xp_earned: module.rewardXp,
      claimed_at: claimedAt,
    };

    const success = await persistWalletState(
      (current) => ({
        ...current,
        profile: {
          ...current.profile,
          xp: (current.profile.xp ?? 0) + module.rewardXp,
          weeklyXp: (current.profile.weeklyXp ?? 0) + module.rewardXp,
          streakXp: (current.profile.streakXp ?? 0) + module.rewardXp,
        },
        courseProgress: {
          ...current.courseProgress,
          [moduleId]: {
            module_id: moduleId,
            completed: true,
            reward_claimed: true,
            selected_answer: selectedAnswerId,
            xp_earned: module.rewardXp,
            completed_at: claimedAt,
          },
        },
        rewards: current.rewards.some((item) => item.reward_id === reward.reward_id)
          ? current.rewards
          : [reward, ...current.rewards],
      }),
      `${module.title} completed. ${module.rewardXp} XP and NFT reward claimed.`,
    );

    return { completed: success };
  };

  const claimTask = async (taskId) => {
    const tasks = dynamicTasks || seedData.tasks;
    const task = tasks.find((entry) => entry.id === taskId);
    if (!task) {
      setErrorMessage("This task could not be found.");
      return;
    }

    if (walletState.taskClaims[taskId]?.claimed) {
      setStatusMessage("Task reward already claimed.");
      return;
    }

    const claimedAt = new Date().toISOString();
    await persistWalletState(
      (current) => ({
        ...current,
        profile: {
          ...current.profile,
          xp: (current.profile.xp ?? 0) + task.rewardXp,
          weeklyXp: (current.profile.weeklyXp ?? 0) + task.rewardXp,
        },
        taskClaims: {
          ...current.taskClaims,
          [taskId]: {
            task_id: taskId,
            claimed: true,
            claimed_at: claimedAt,
            xp_earned: task.rewardXp,
          },
        },
      }),
      `${task.title} claimed for ${task.rewardXp} XP.`,
    );
  };

  const claimSpecialQuest = async () => {
    const claimedTaskCount = Object.values(walletState.taskClaims).filter((item) => item.claimed).length;
    const completedModuleCount = Object.values(walletState.courseProgress).filter((item) => item.completed).length;

    if (walletState.specialQuestClaimed) {
      setStatusMessage("Special quest reward already claimed.");
      return;
    }

    if (claimedTaskCount < 2 || completedModuleCount < 1) {
      setErrorMessage("Complete at least 2 daily tasks and 1 module before claiming this quest.");
      return;
    }

    const claimedAt = new Date().toISOString();
    const reward = {
      reward_id: seedData.specialQuest.nftReward.id,
      reward_type: "special_quest",
      title: seedData.specialQuest.nftReward.title,
      rarity: seedData.specialQuest.nftReward.rarity,
      image: seedData.specialQuest.nftReward.image,
      module_id: null,
      xp_earned: seedData.specialQuest.rewardXp,
      claimed_at: claimedAt,
    };

    await persistWalletState(
      (current) => ({
        ...current,
        profile: {
          ...current.profile,
          xp: (current.profile.xp ?? 0) + seedData.specialQuest.rewardXp,
          weeklyXp: (current.profile.weeklyXp ?? 0) + seedData.specialQuest.rewardXp,
        },
        rewards: current.rewards.some((item) => item.reward_id === reward.reward_id)
          ? current.rewards
          : [reward, ...current.rewards],
        specialQuestClaimed: true,
      }),
      `Special quest claimed for ${seedData.specialQuest.rewardXp} XP and a limited NFT.`,
    );
  };

  const setUserUsername = async (username) => {
    if (!walletAddress) {
      setErrorMessage("Connect your wallet to set a username.");
      return { success: false };
    }

    try {
      const savedUsername = await saveUsername(walletAddress, username);
      setWalletState((current) => ({
        ...current,
        profile: {
          ...current.profile,
          username: savedUsername,
        },
      }));
      setErrorMessage("");
      return { success: true, username: savedUsername };
    } catch (error) {
      setErrorMessage(error.message || "Failed to set username.");
      return { success: false };
    }
  };

  const appViewModel = useMemo(
    () => createAppViewModel(walletState, leaderboardState, whitelistStatus, dynamicModules, dynamicTasks),
    [walletState, leaderboardState, whitelistStatus, dynamicModules, dynamicTasks],
  );

  return {
    ...appViewModel,
    appName: seedData.appName,
    connectWallet,
    disconnectWallet: disconnectWalletHandler,
    completeModule,
    errorMessage,
    isLoading,
    isTelegramReady,
    isWalletConnected,
    isWalletConnecting,
    statusMessage,
    walletAddress,
    walletLabel: formatWalletAddress(walletAddress),
    claimSpecialQuest,
    claimTask,
    setUsername: setUserUsername,
  };
}
