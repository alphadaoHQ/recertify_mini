import { useEffect, useMemo, useState } from "react";
import { createAppViewModel, loadLeaderboard, loadWalletState, saveWalletState } from "../lib/appData";
import { getConnectedWalletAddress, connectWalletAddress, formatWalletAddress } from "../lib/wallet";
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
  const [walletAddress, setWalletAddress] = useState(null);
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
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const telegramReady = initializeTelegramApp();
    setIsTelegramReady(telegramReady);
  }, []);

  const refreshState = async (address) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const nextWalletState = await loadWalletState(address, getWalletDisplayName(telegram, address));
      const nextLeaderboardState = await loadLeaderboard(nextWalletState);
      setWalletState(nextWalletState);
      setLeaderboardState(nextLeaderboardState);
    } catch (error) {
      setErrorMessage(error.message || "Unable to load your app data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getConnectedWalletAddress()
      .then((address) => {
        setWalletAddress(address ?? null);
        return refreshState(address ?? null);
      })
      .catch(() => refreshState(null));
  }, []);

  useEffect(() => {
    const provider = window?.ethereum;
    if (!provider?.on) {
      return undefined;
    }

    const handleAccountsChanged = async (accounts) => {
      const nextAddress = accounts?.[0] ?? null;
      setWalletAddress(nextAddress);
      await refreshState(nextAddress);
    };

    provider.on("accountsChanged", handleAccountsChanged);
    return () => provider.removeListener("accountsChanged", handleAccountsChanged);
  }, []);

  const persistWalletState = async (updater, successMessage) => {
    if (!walletAddress) {
      setErrorMessage("Connect your wallet to save progress and claim rewards.");
      return false;
    }

    try {
      const nextWalletState = updater(walletState);
      await saveWalletState(nextWalletState);
      const nextLeaderboardState = await loadLeaderboard(nextWalletState);
      setWalletState(nextWalletState);
      setLeaderboardState(nextLeaderboardState);
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
      const address = await connectWalletAddress();
      setWalletAddress(address);
      await refreshState(address);
      setStatusMessage(`Wallet connected: ${formatWalletAddress(address)}`);
    } catch (error) {
      setErrorMessage(error.message || "Wallet connection failed.");
    } finally {
      setIsWalletConnecting(false);
    }
  };

  const completeModule = async (moduleId, selectedAnswerId) => {
    const module = seedData.modules.find((entry) => entry.id === moduleId);
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
    const task = seedData.tasks.find((entry) => entry.id === taskId);
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

  const appViewModel = useMemo(
    () => createAppViewModel(walletState, leaderboardState),
    [walletState, leaderboardState],
  );

  return {
    ...appViewModel,
    appName: seedData.appName,
    connectWallet,
    completeModule,
    errorMessage,
    isLoading,
    isTelegramReady,
    isWalletConnected: Boolean(walletAddress),
    isWalletConnecting,
    statusMessage,
    walletAddress,
    walletLabel: formatWalletAddress(walletAddress),
    claimSpecialQuest,
    claimTask,
  };
}
