import { supabase } from "./supabase";
import { seedData } from "../data/mockData";

const COURSES_TABLE = "courses";
const TASKS_TABLE = "tasks";
const PROFILE_TABLE = "profiles";
const WHITELIST_TABLE = "whitelist";

// ---------------------------------------------------------------------------
// Admin credentials (client-side gate — acceptable since RLS is open anyway)
// ---------------------------------------------------------------------------
const ADMIN_USERS = [
  { email: "japhetdamassoh@gmail.com", password: "Japhetaline" },
  { email: "admin@recertify.io", password: "RecertifyAdmin2026" },
];

export function authenticateAdmin(email, password) {
  return ADMIN_USERS.some(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
  );
}

// ---------------------------------------------------------------------------
// Courses — mappers
// ---------------------------------------------------------------------------
function mapCourseFromDb(row) {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    icon: row.icon,
    image: row.image,
    missionTitle: row.mission_title,
    missionLabel: row.mission_label,
    missionCopy: row.mission_copy || [],
    step: row.step,
    totalSteps: row.total_steps,
    rewardXp: row.reward_xp,
    nftReward: {
      id: row.nft_reward_id,
      title: row.nft_reward_title,
      rarity: row.nft_reward_rarity,
      image: row.nft_reward_image,
    },
    question: row.question,
    answers: row.answers || [],
    sortOrder: row.sort_order,
    is_active: row.is_active,
  };
}

function mapCourseToDb(course) {
  return {
    id: course.id,
    title: course.title,
    subtitle: course.subtitle || null,
    icon: course.icon || "sparkles",
    image: course.image || null,
    mission_title: course.missionTitle || null,
    mission_label: course.missionLabel || "Project Mission",
    mission_copy: course.missionCopy || [],
    step: course.step || 1,
    total_steps: course.totalSteps || 5,
    reward_xp: course.rewardXp || 100,
    nft_reward_id: course.nftReward?.id || null,
    nft_reward_title: course.nftReward?.title || null,
    nft_reward_rarity: course.nftReward?.rarity || null,
    nft_reward_image: course.nftReward?.image || null,
    question: course.question || null,
    answers: course.answers || [],
    sort_order: course.sortOrder ?? 0,
    is_active: course.is_active !== false,
  };
}

// ---------------------------------------------------------------------------
// Courses — CRUD
// ---------------------------------------------------------------------------
export async function fetchAllCourses() {
  if (!supabase) return seedData.modules.map((m) => ({ ...m, is_active: true }));

  const { data, error } = await supabase
    .from(COURSES_TABLE)
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data || data.length === 0)
    return seedData.modules.map((m) => ({ ...m, is_active: true }));

  return data.map(mapCourseFromDb);
}

export async function createCourse(course) {
  if (!supabase) throw new Error("Supabase not configured");
  const { error } = await supabase.from(COURSES_TABLE).insert(mapCourseToDb(course));
  if (error) throw new Error(error.message);
}

export async function updateCourse(id, course) {
  if (!supabase) throw new Error("Supabase not configured");
  const row = mapCourseToDb(course);
  delete row.id;
  row.updated_at = new Date().toISOString();
  const { error } = await supabase.from(COURSES_TABLE).update(row).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteCourse(id) {
  if (!supabase) throw new Error("Supabase not configured");
  const { error } = await supabase.from(COURSES_TABLE).delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function seedCoursesFromMockData() {
  if (!supabase) throw new Error("Supabase not configured");
  const rows = seedData.modules.map((m, i) => mapCourseToDb({ ...m, sortOrder: i }));
  const { error } = await supabase.from(COURSES_TABLE).upsert(rows);
  if (error) throw new Error(error.message);
}

// ---------------------------------------------------------------------------
// Tasks — mappers
// ---------------------------------------------------------------------------
function mapTaskFromDb(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    rewardXp: row.reward_xp,
    reward: `+${row.reward_xp} XP`,
    status: row.status,
    icon: row.icon,
    sortOrder: row.sort_order,
    is_active: row.is_active,
  };
}

function mapTaskToDb(task) {
  return {
    id: task.id,
    title: task.title,
    description: task.description || null,
    reward_xp: task.rewardXp || 50,
    reward_label: task.reward || `+${task.rewardXp || 50} XP`,
    status: task.status || "Instant",
    icon: task.icon || "send",
    sort_order: task.sortOrder ?? 0,
    is_active: task.is_active !== false,
  };
}

// ---------------------------------------------------------------------------
// Tasks — CRUD
// ---------------------------------------------------------------------------
export async function fetchAllTasks() {
  if (!supabase) return seedData.tasks.map((t) => ({ ...t, is_active: true }));

  const { data, error } = await supabase
    .from(TASKS_TABLE)
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data || data.length === 0)
    return seedData.tasks.map((t) => ({ ...t, is_active: true }));

  return data.map(mapTaskFromDb);
}

export async function createTask(task) {
  if (!supabase) throw new Error("Supabase not configured");
  const { error } = await supabase.from(TASKS_TABLE).insert(mapTaskToDb(task));
  if (error) throw new Error(error.message);
}

export async function updateTask(id, task) {
  if (!supabase) throw new Error("Supabase not configured");
  const row = mapTaskToDb(task);
  delete row.id;
  row.updated_at = new Date().toISOString();
  const { error } = await supabase.from(TASKS_TABLE).update(row).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteTask(id) {
  if (!supabase) throw new Error("Supabase not configured");
  const { error } = await supabase.from(TASKS_TABLE).delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function seedTasksFromMockData() {
  if (!supabase) throw new Error("Supabase not configured");
  const rows = seedData.tasks.map((t, i) => mapTaskToDb({ ...t, sortOrder: i }));
  const { error } = await supabase.from(TASKS_TABLE).upsert(rows);
  if (error) throw new Error(error.message);
}

// ---------------------------------------------------------------------------
// Dashboard stats
// ---------------------------------------------------------------------------
export async function fetchDashboardStats() {
  if (!supabase) {
    return { totalUsers: 0, totalCourses: seedData.modules.length, totalTasks: seedData.tasks.length, whitelistCount: 0, totalXpDistributed: 0 };
  }

  const [profilesRes, coursesRes, tasksRes, whitelistRes] = await Promise.all([
    supabase.from(PROFILE_TABLE).select("xp", { count: "exact" }),
    supabase.from(COURSES_TABLE).select("id", { count: "exact" }).eq("is_active", true),
    supabase.from(TASKS_TABLE).select("id", { count: "exact" }).eq("is_active", true),
    supabase.from(WHITELIST_TABLE).select("wallet_address", { count: "exact" }),
  ]);

  const totalXp = (profilesRes.data || []).reduce((sum, p) => sum + (p.xp || 0), 0);

  return {
    totalUsers: profilesRes.count || 0,
    totalCourses: coursesRes.count || seedData.modules.length,
    totalTasks: tasksRes.count || seedData.tasks.length,
    whitelistCount: whitelistRes.count || 0,
    totalXpDistributed: totalXp,
  };
}

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------
export async function fetchAllProfiles() {
  if (!supabase) return [];
  const { data, error } = await supabase.from(PROFILE_TABLE).select("*").order("xp", { ascending: false });
  if (error) throw new Error(error.message);
  return data || [];
}

export async function updateProfileXp(walletAddress, xp) {
  if (!supabase) throw new Error("Supabase not configured");
  const { error } = await supabase.from(PROFILE_TABLE).update({ xp, updated_at: new Date().toISOString() }).eq("wallet_address", walletAddress);
  if (error) throw new Error(error.message);
}

export async function deleteProfile(walletAddress) {
  if (!supabase) throw new Error("Supabase not configured");
  const { error } = await supabase.from(PROFILE_TABLE).delete().eq("wallet_address", walletAddress);
  if (error) throw new Error(error.message);
}

// ---------------------------------------------------------------------------
// Whitelist
// ---------------------------------------------------------------------------
export async function fetchWhitelistUsers() {
  if (!supabase) return [];
  const { data, error } = await supabase.from(WHITELIST_TABLE).select("*").order("total_xp", { ascending: false });
  if (error) throw new Error(error.message);
  return data || [];
}

export function exportWhitelistCSV(users) {
  const headers = ["Wallet Address", "Username", "Rank", "Total XP", "Tasks Completed", "Modules Completed", "Status", "Eligible At"];
  const rows = users.map((u) => [u.wallet_address, u.username || "", u.rank, u.total_xp, u.tasks_completed, u.modules_completed, u.status, u.eligible_at || ""]);
  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `whitelist-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ---------------------------------------------------------------------------
// Dynamic data for the main app (active courses/tasks only)
// ---------------------------------------------------------------------------
export async function fetchActiveCourses() {
  if (!supabase) return null; // caller falls back to seedData

  const { data, error } = await supabase
    .from(COURSES_TABLE)
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error || !data || data.length === 0) return null;
  return data.map(mapCourseFromDb);
}

export async function fetchActiveTasks() {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from(TASKS_TABLE)
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error || !data || data.length === 0) return null;
  return data.map(mapTaskFromDb);
}
