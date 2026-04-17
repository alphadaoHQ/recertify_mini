const defaultAvatar =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=320&q=80";

export const seedData = {
  appName: "Recertify Mini",
  user: {
    id: "guest-demo",
    walletAddress: null,
    name: "Guest Explorer",
    level: 1,
    title: "Wallet Not Connected",
    xp: 0,
    nextRank: "Builder",
    xpToNextRank: 500,
    weeklyXp: 0,
    streakXp: 0,
    rank: null,
    avatar: defaultAvatar,
  },
  modules: [
    {
      id: "ethereum-core",
      title: "Ethereum",
      subtitle: "L1 Fundamentals",
      icon: "diamond",
      image:
        "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=900&q=80",
      missionTitle: "The Decentralized Consensus Protocol",
      missionLabel: "Project Mission",
      missionCopy: [
        "Ethereum exists to provide a neutral programmable base layer for applications that run without centralized control, censorship, or downtime.",
        "Its distributed validator and node network keeps execution transparent while giving users ownership over assets and identity.",
      ],
      step: 1,
      totalSteps: 5,
      rewardXp: 240,
      nftReward: {
        id: "nft-ethereum-core",
        title: "Ethereum Core Certified",
        rarity: "Rare #042",
        image:
          "https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?auto=format&fit=crop&w=800&q=80",
      },
      question: "What is the core objective of the Ethereum decentralized protocol?",
      answers: [
        { id: "a", text: "To ensure censorship-resistant applications", correct: true },
        { id: "b", text: "To centralize cloud storage solutions", correct: false },
        { id: "c", text: "To replace all government entities", correct: false },
      ],
    },
    {
      id: "polygon-scaling",
      title: "Polygon",
      subtitle: "Scaling Solutions",
      icon: "hexagon",
      image:
        "https://images.unsplash.com/photo-1642104704074-907c0698cbd9?auto=format&fit=crop&w=900&q=80",
      missionTitle: "Layer 2 Throughput and Low Fees",
      missionLabel: "Project Mission",
      missionCopy: [
        "Polygon helps Ethereum scale by making transactions faster and cheaper while still benefiting from Ethereum's broader ecosystem.",
        "Its role is to improve usability so more applications and users can interact on-chain without prohibitive gas costs.",
      ],
      step: 1,
      totalSteps: 5,
      rewardXp: 180,
      nftReward: {
        id: "nft-polygon-scaling",
        title: "Polygon Scaling Explorer",
        rarity: "Epic #112",
        image:
          "https://images.unsplash.com/photo-1639762681297-3d1c7c4ba738?auto=format&fit=crop&w=800&q=80",
      },
      question: "Why do users choose Polygon for many blockchain applications?",
      answers: [
        { id: "a", text: "It improves throughput and lowers transaction costs", correct: true },
        { id: "b", text: "It removes the need for wallets entirely", correct: false },
        { id: "c", text: "It stores all blockchain data off the internet", correct: false },
      ],
    },
    {
      id: "chainlink-oracles",
      title: "Chainlink",
      subtitle: "Oracle Networks",
      icon: "chain",
      image:
        "https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&w=900&q=80",
      missionTitle: "Reliable Data for Smart Contracts",
      missionLabel: "Project Mission",
      missionCopy: [
        "Chainlink connects blockchains with trusted off-chain data so smart contracts can react to prices, events, and external conditions.",
        "Without oracle networks, on-chain applications would have no reliable way to consume real-world information.",
      ],
      step: 1,
      totalSteps: 5,
      rewardXp: 210,
      nftReward: {
        id: "nft-chainlink-oracles",
        title: "Oracle Network Strategist",
        rarity: "Gold #009",
        image:
          "https://images.unsplash.com/photo-1642104704074-907c0698cbd9?auto=format&fit=crop&w=800&q=80",
      },
      question: "What problem does Chainlink primarily solve?",
      answers: [
        { id: "a", text: "Supplying trusted external data to smart contracts", correct: true },
        { id: "b", text: "Replacing every blockchain consensus mechanism", correct: false },
        { id: "c", text: "Minting NFTs without wallets", correct: false },
      ],
    },
    {
      id: "uniswap-liquidity",
      title: "Uniswap",
      subtitle: "DEX Liquidity",
      icon: "sparkles",
      image:
        "https://images.unsplash.com/photo-1640161704729-cbe966a08476?auto=format&fit=crop&w=900&q=80",
      missionTitle: "Automated Market Liquidity",
      missionLabel: "Project Mission",
      missionCopy: [
        "Uniswap enables token swaps through automated market makers rather than traditional centralized order books.",
        "Liquidity providers supply assets to pools so traders can swap anytime, while providers earn fees in return.",
      ],
      step: 1,
      totalSteps: 5,
      rewardXp: 220,
      nftReward: {
        id: "nft-uniswap-liquidity",
        title: "DEX Liquidity Analyst",
        rarity: "Legendary #001",
        image:
          "https://images.unsplash.com/photo-1639762681057-408e52192e55?auto=format&fit=crop&w=800&q=80",
      },
      question: "How does Uniswap let users trade assets without a centralized order book?",
      answers: [
        { id: "a", text: "By using liquidity pools and automated market makers", correct: true },
        { id: "b", text: "By requiring banks to process every swap", correct: false },
        { id: "c", text: "By freezing prices until administrators approve trades", correct: false },
      ],
    },
  ],
  tasks: [
    {
      id: "follow-x",
      title: "Follow on X",
      reward: "+50 XP",
      rewardXp: 50,
      status: "Instant",
      icon: "send",
      description: "Follow the project account to unlock your social engagement reward.",
    },
    {
      id: "join-discord",
      title: "Join Discord",
      reward: "+100 XP",
      rewardXp: 100,
      status: "Verify in 24h",
      icon: "groups",
      description: "Join the community Discord and confirm your wallet-linked participation.",
    },
    {
      id: "write-review",
      title: "Write a Review",
      reward: "+200 XP",
      rewardXp: 200,
      status: "On-chain Proof",
      icon: "edit",
      description: "Submit a thoughtful learning review and claim your proof-backed reward.",
    },
  ],
  specialQuest: {
    id: "ambassador-quest",
    title: "Become an Ambassador",
    copy:
      "Join the elite circle of builders. Complete core actions and learning milestones to qualify for a high-value bonus reward.",
    reward: "500 XP",
    rewardXp: 500,
    bonus: "Limited NFT",
    requirements: ["Complete 2 daily tasks", "Finish at least 1 course module"],
    image:
      "https://images.unsplash.com/photo-1639762681057-408e52192e55?auto=format&fit=crop&w=1000&q=80",
    nftReward: {
      id: "nft-ambassador",
      title: "Community Ambassador",
      rarity: "Limited Edition",
      image:
        "https://images.unsplash.com/photo-1639762681297-3d1c7c4ba738?auto=format&fit=crop&w=800&q=80",
    },
  },
  defaultLeaderboard: [
    {
      id: "seed-1",
      walletAddress: "0xseed1",
      name: "Marcus V.",
      xp: 5410,
      level: 27,
      badge: "1ST",
      accent: "gold",
      avatar:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80",
    },
    {
      id: "seed-2",
      walletAddress: "0xseed2",
      name: "Sarah J.",
      xp: 4820,
      level: 25,
      badge: "2",
      accent: "silver",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
    },
    {
      id: "seed-3",
      walletAddress: "0xseed3",
      name: "Elena R.",
      xp: 4650,
      level: 24,
      badge: "3",
      accent: "bronze",
      avatar:
        "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=300&q=80",
    },
    {
      id: "seed-4",
      walletAddress: "0xseed4",
      name: "Julian Moore",
      xp: 4120,
      level: 24,
      badge: "4",
      accent: "default",
      avatar:
        "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=300&q=80",
    },
    {
      id: "seed-5",
      walletAddress: "0xseed5",
      name: "Anna Weber",
      xp: 3980,
      level: 19,
      badge: "5",
      accent: "default",
      avatar:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
    },
    {
      id: "seed-6",
      walletAddress: "0xseed6",
      name: "Kofi Mensah",
      xp: 3745,
      level: 18,
      badge: "6",
      accent: "default",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    },
  ],
};

export const levelMap = [
  { level: 1, maxXp: 499, title: "New Explorer", nextRank: "Builder" },
  { level: 8, maxXp: 1199, title: "Builder", nextRank: "Strategist" },
  { level: 16, maxXp: 2499, title: "Strategist", nextRank: "Contributor" },
  { level: 24, maxXp: 4999, title: "Elite Contributor", nextRank: "Master" },
  { level: 32, maxXp: Number.POSITIVE_INFINITY, title: "Master", nextRank: "Max Rank" },
];

export function getLevelMeta(xp) {
  const current = levelMap.find((entry) => xp <= entry.maxXp) || levelMap[levelMap.length - 1];
  const previousMax = levelMap[levelMap.indexOf(current) - 1]?.maxXp ?? 0;
  const xpToNextRank = Number.isFinite(current.maxXp) ? Math.max(current.maxXp - xp + 1, 0) : 0;

  return {
    level: current.level,
    nextRank: current.nextRank,
    progressMin: previousMax,
    progressMax: current.maxXp,
    title: current.title,
    xpToNextRank,
  };
}

export function createGuestUser() {
  return { ...seedData.user };
}

export function createWalletProfile(walletAddress, name) {
  return {
    id: walletAddress,
    walletAddress,
    name,
    avatar: `https://api.dicebear.com/9.x/identicon/svg?seed=${walletAddress}`,
    xp: 0,
    weeklyXp: 0,
    streakXp: 0,
    rank: null,
    ...getLevelMeta(0),
  };
}
