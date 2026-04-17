import { createGuestUser, createWalletProfile, getLevelMeta, seedData } from "../data/mockData";
import { getWalletState, setWalletState } from "./localState";
import { supabase } from "./supabase";

const PROFILE_TABLE = "profiles";
const COURSE_PROGRESS_TABLE = "course_progress";
const TASK_CLAIMS_TABLE = "task_claims";
const REWARDS_TABLE = "reward_claims";

function buildUserProfile(profile) {
  const base = profile ?? createGuestUser();
  return {
    ...base,
    ...getLevelMeta(base.xp ?? 0),
  };
}

function buildRecentMint(rewards) {
  const latestReward = [...rewards]
    .filter((reward) => reward.reward_type === "module" || reward.reward_type === "special_quest")
    .sort((a, b) => new Date(b.claimed_at).getTime() - new Date(a.claimed_at).getTime())[0];

  if (!latestReward) {
    return {
      title: "No rewards claimed yet",
      completedAt: "Finish a course module to mint your first artifact.",
    };
  }

  return {
    title: latestReward.title,
    completedAt: `Claimed ${new Date(latestReward.claimed_at).toLocaleDateString()}`,
  };
}

function buildProgress(modules, courseProgressMap) {
  return modules.map((module) => {
    const progress = courseProgressMap[module.id];
    const percent = progress?.completed ? 100 : progress?.selected_answer ? 60 : 0;
    const detail = progress?.completed
      ? "Module Complete"
      : progress?.selected_answer
        ? "Checkpoint Answered"
        : "Not Started";

    return {
      id: module.id,
      title: module.title,
      detail,
      percent,
      color: module.id === "polygon-scaling" ? "stroke-brand-secondary" : "stroke-brand-primary",
      icon: module.icon,
    };
  });
}

function buildNfts(moduleRewards, modules) {
  const rewardMap = new Map(moduleRewards.map((reward) => [reward.reward_id, reward]));

  return modules.map((module) => {
    const reward = rewardMap.get(module.nftReward.id);

    return reward
      ? {
          id: reward.reward_id,
          title: reward.title,
          rarity: reward.rarity,
          date: `Minted ${new Date(reward.claimed_at).toLocaleDateString()}`,
          image: reward.image,
        }
      : {
          id: module.nftReward.id,
          title: module.nftReward.title,
          rarity: "Locked Reward",
          date: "In Progress",
          locked: true,
        };
  });
}

function buildTasks(taskDefinitions, taskClaimsMap) {
  return taskDefinitions.map((task) => {
    const claim = taskClaimsMap[task.id];
    return {
      ...task,
      claimed: Boolean(claim?.claimed),
      claimedAt: claim?.claimed_at ?? null,
      ctaLabel: claim?.claimed ? "Claimed" : "Claim reward",
    };
  });
}

function buildLeaderboard(profiles, walletAddress) {
  const ranked = [...profiles]
    .sort((a, b) => (b.xp ?? 0) - (a.xp ?? 0))
    .map((entry, index) => ({
      ...entry,
      badge: index === 0 ? "1ST" : `${index + 1}`,
      accent: index === 0 ? "gold" : index === 1 ? "silver" : index === 2 ? "bronze" : "default",
      rank: index + 1,
    }));

  const currentUser = walletAddress ? ranked.find((entry) => entry.walletAddress === walletAddress) : null;
  return {
    currentUserRank: currentUser?.rank ?? null,
    leaderboard: ranked.slice(0, 6),
  };
}

function createEmptyWalletState(walletAddress, name) {
  return {
    profile: createWalletProfile(walletAddress, name),
    courseProgress: {},
    rewards: [],
    specialQuestClaimed: false,
    taskClaims: {},
  };
}

async function readSupabaseWalletState(walletAddress, fallbackName) {
  const [profileResult, courseProgressResult, taskClaimsResult, rewardsResult] = await Promise.all([
    supabase.from(PROFILE_TABLE).select("*").eq("wallet_address", walletAddress).maybeSingle(),
    supabase.from(COURSE_PROGRESS_TABLE).select("*").eq("wallet_address", walletAddress),
    supabase.from(TASK_CLAIMS_TABLE).select("*").eq("wallet_address", walletAddress),
    supabase.from(REWARDS_TABLE).select("*").eq("wallet_address", walletAddress),
  ]);

  const profile = profileResult.data
    ? {
        id: profileResult.data.wallet_address,
        walletAddress: profileResult.data.wallet_address,
        name: profileResult.data.name,
        avatar: profileResult.data.avatar,
        xp: profileResult.data.xp,
        weeklyXp: profileResult.data.weekly_xp,
        streakXp: profileResult.data.streak_xp,
      }
    : createWalletProfile(walletAddress, fallbackName);

  return {
    profile,
    courseProgress: Object.fromEntries(
      (courseProgressResult.data ?? []).map((item) => [
        item.module_id,
        {
          module_id: item.module_id,
          completed: item.completed,
          reward_claimed: item.reward_claimed,
          selected_answer: item.selected_answer,
          xp_earned: item.xp_earned,
          completed_at: item.completed_at,
        },
      ]),
    ),
    rewards: rewardsResult.data ?? [],
    specialQuestClaimed: (rewardsResult.data ?? []).some((reward) => reward.reward_type === "special_quest"),
    taskClaims: Object.fromEntries(
      (taskClaimsResult.data ?? []).map((item) => [
        item.task_id,
        {
          task_id: item.task_id,
          claimed: item.claimed,
          claimed_at: item.claimed_at,
          xp_earned: item.xp_earned,
        },
      ]),
    ),
  };
}

async function writeSupabaseWalletState(walletState) {
  const profile = buildUserProfile(walletState.profile);

  await supabase.from(PROFILE_TABLE).upsert({
    wallet_address: profile.walletAddress,
    name: profile.name,
    avatar: profile.avatar,
    xp: profile.xp,
    weekly_xp: profile.weeklyXp,
    streak_xp: profile.streakXp,
    level: profile.level,
    title: profile.title,
    next_rank: profile.nextRank,
    xp_to_next_rank: profile.xpToNextRank,
  });

  await Promise.all([
    ...Object.values(walletState.courseProgress).map((item) =>
      supabase.from(COURSE_PROGRESS_TABLE).upsert({
        wallet_address: profile.walletAddress,
        module_id: item.module_id,
        completed: item.completed,
        reward_claimed: item.reward_claimed,
        selected_answer: item.selected_answer,
        xp_earned: item.xp_earned,
        completed_at: item.completed_at,
      }),
    ),
    ...Object.values(walletState.taskClaims).map((item) =>
      supabase.from(TASK_CLAIMS_TABLE).upsert({
        wallet_address: profile.walletAddress,
        task_id: item.task_id,
        claimed: item.claimed,
        claimed_at: item.claimed_at,
        xp_earned: item.xp_earned,
      }),
    ),
    ...walletState.rewards.map((item) =>
      supabase.from(REWARDS_TABLE).upsert({
        wallet_address: profile.walletAddress,
        reward_id: item.reward_id,
        reward_type: item.reward_type,
        title: item.title,
        rarity: item.rarity,
        image: item.image,
        module_id: item.module_id,
        xp_earned: item.xp_earned,
        claimed_at: item.claimed_at,
      }),
    ),
  ]);
}

export async function loadWalletState(walletAddress, fallbackName) {
  if (!walletAddress) {
    return {
      profile: createGuestUser(),
      courseProgress: {},
      rewards: [],
      specialQuestClaimed: false,
      taskClaims: {},
    };
  }

  if (supabase) {
    return readSupabaseWalletState(walletAddress, fallbackName);
  }

  return getWalletState(walletAddress) ?? createEmptyWalletState(walletAddress, fallbackName);
}

export async function saveWalletState(walletState) {
  if (!walletState.profile?.walletAddress) {
    return;
  }

  if (supabase) {
    await writeSupabaseWalletState(walletState);
  } else {
    setWalletState(walletState.profile.walletAddress, walletState);
  }
}

export async function loadLeaderboard(walletState) {
  if (supabase) {
    const profileResult = await supabase.from(PROFILE_TABLE).select("*").order("xp", { ascending: false }).limit(50);
    const profiles = (profileResult.data ?? []).map((item) => ({
      id: item.wallet_address,
      walletAddress: item.wallet_address,
      name: item.name,
      avatar: item.avatar,
      xp: item.xp,
      level: item.level,
    }));

    return buildLeaderboard(profiles, walletState.profile.walletAddress);
  }

  const fallbackProfiles = seedData.defaultLeaderboard.map((entry) => ({
    ...entry,
  }));

  const currentProfile = walletState.profile.walletAddress
    ? {
        id: walletState.profile.walletAddress,
        walletAddress: walletState.profile.walletAddress,
        name: walletState.profile.name,
        avatar: walletState.profile.avatar,
        xp: walletState.profile.xp,
        level: buildUserProfile(walletState.profile).level,
      }
    : null;

  const profiles = currentProfile ? [currentProfile, ...fallbackProfiles] : fallbackProfiles;
  return buildLeaderboard(profiles, walletState.profile.walletAddress);
}

export function createAppViewModel(walletState, leaderboardState) {
  const user = {
    ...buildUserProfile(walletState.profile),
    rank: leaderboardState.currentUserRank,
  };

  return {
    user,
    tasks: buildTasks(seedData.tasks, walletState.taskClaims),
    modules: seedData.modules.map((module) => ({
      ...module,
      progress: walletState.courseProgress[module.id] ?? null,
    })),
    recentMint: buildRecentMint(walletState.rewards),
    progress: buildProgress(seedData.modules, walletState.courseProgress),
    nfts: buildNfts(walletState.rewards, seedData.modules).concat(
      walletState.specialQuestClaimed
        ? [
            {
              id: seedData.specialQuest.nftReward.id,
              title: seedData.specialQuest.nftReward.title,
              rarity: seedData.specialQuest.nftReward.rarity,
              date: walletState.rewards.find((item) => item.reward_id === seedData.specialQuest.nftReward.id)
                ?.claimed_at
                ? `Minted ${new Date(
                    walletState.rewards.find((item) => item.reward_id === seedData.specialQuest.nftReward.id).claimed_at,
                  ).toLocaleDateString()}`
                : "Minted",
              image: seedData.specialQuest.nftReward.image,
            },
          ]
        : [],
    ),
    leaderboard: leaderboardState.leaderboard,
    specialQuest: {
      ...seedData.specialQuest,
      claimed: walletState.specialQuestClaimed,
    },
  };
}
