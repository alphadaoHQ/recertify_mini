import { useCallback, useEffect, useState } from "react";
import * as adminApi from "../lib/adminData";

export function useAdminData() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem("recertify-admin-auth") === "true",
  );
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [whitelistUsers, setWhitelistUsers] = useState([]);

  // Auth
  const login = useCallback((email, password) => {
    const ok = adminApi.authenticateAdmin(email, password);
    if (ok) {
      setIsAuthenticated(true);
      sessionStorage.setItem("recertify-admin-auth", "true");
      setError("");
    } else {
      setError("Invalid email or password.");
    }
    return ok;
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("recertify-admin-auth");
  }, []);

  // Load tab data
  const loadTab = useCallback(async (tab) => {
    setIsLoading(true);
    setError("");
    try {
      if (tab === "dashboard") setStats(await adminApi.fetchDashboardStats());
      if (tab === "courses") setCourses(await adminApi.fetchAllCourses());
      if (tab === "tasks") setTasks(await adminApi.fetchAllTasks());
      if (tab === "users") setUsers(await adminApi.fetchAllProfiles());
      if (tab === "whitelist") setWhitelistUsers(await adminApi.fetchWhitelistUsers());
    } catch (err) {
      setError(err.message || "Failed to load data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) loadTab(activeTab);
  }, [isAuthenticated, activeTab, loadTab]);

  const switchTab = useCallback((tab) => {
    setActiveTab(tab);
    setSuccess("");
    setError("");
  }, []);

  const refreshTab = useCallback(() => loadTab(activeTab), [activeTab, loadTab]);

  // Courses
  const addCourse = useCallback(async (c) => {
    setIsLoading(true);
    try { await adminApi.createCourse(c); setCourses(await adminApi.fetchAllCourses()); setSuccess("Course created."); }
    catch (e) { setError(e.message); } finally { setIsLoading(false); }
  }, []);

  const editCourse = useCallback(async (id, c) => {
    setIsLoading(true);
    try { await adminApi.updateCourse(id, c); setCourses(await adminApi.fetchAllCourses()); setSuccess("Course updated."); }
    catch (e) { setError(e.message); } finally { setIsLoading(false); }
  }, []);

  const removeCourse = useCallback(async (id) => {
    setIsLoading(true);
    try { await adminApi.deleteCourse(id); setCourses(await adminApi.fetchAllCourses()); setSuccess("Course deleted."); }
    catch (e) { setError(e.message); } finally { setIsLoading(false); }
  }, []);

  const seedCourses = useCallback(async () => {
    setIsLoading(true);
    try { await adminApi.seedCoursesFromMockData(); setCourses(await adminApi.fetchAllCourses()); setSuccess("Courses seeded from defaults."); }
    catch (e) { setError(e.message); } finally { setIsLoading(false); }
  }, []);

  // Tasks
  const addTask = useCallback(async (t) => {
    setIsLoading(true);
    try { await adminApi.createTask(t); setTasks(await adminApi.fetchAllTasks()); setSuccess("Task created."); }
    catch (e) { setError(e.message); } finally { setIsLoading(false); }
  }, []);

  const editTask = useCallback(async (id, t) => {
    setIsLoading(true);
    try { await adminApi.updateTask(id, t); setTasks(await adminApi.fetchAllTasks()); setSuccess("Task updated."); }
    catch (e) { setError(e.message); } finally { setIsLoading(false); }
  }, []);

  const removeTask = useCallback(async (id) => {
    setIsLoading(true);
    try { await adminApi.deleteTask(id); setTasks(await adminApi.fetchAllTasks()); setSuccess("Task deleted."); }
    catch (e) { setError(e.message); } finally { setIsLoading(false); }
  }, []);

  const seedTasks = useCallback(async () => {
    setIsLoading(true);
    try { await adminApi.seedTasksFromMockData(); setTasks(await adminApi.fetchAllTasks()); setSuccess("Tasks seeded from defaults."); }
    catch (e) { setError(e.message); } finally { setIsLoading(false); }
  }, []);

  // Users
  const adjustUserXp = useCallback(async (wallet, xp) => {
    setIsLoading(true);
    try { await adminApi.updateProfileXp(wallet, xp); setUsers(await adminApi.fetchAllProfiles()); setSuccess("User XP updated."); }
    catch (e) { setError(e.message); } finally { setIsLoading(false); }
  }, []);

  const removeUser = useCallback(async (wallet) => {
    setIsLoading(true);
    try { await adminApi.deleteProfile(wallet); setUsers(await adminApi.fetchAllProfiles()); setSuccess("User deleted."); }
    catch (e) { setError(e.message); } finally { setIsLoading(false); }
  }, []);

  // Whitelist
  const exportWhitelist = useCallback(() => {
    adminApi.exportWhitelistCSV(whitelistUsers);
    setSuccess("CSV downloaded.");
  }, [whitelistUsers]);

  return {
    isAuthenticated, activeTab, isLoading, error, success,
    stats, courses, tasks, users, whitelistUsers,
    login, logout, switchTab, refreshTab,
    addCourse, editCourse, removeCourse, seedCourses,
    addTask, editTask, removeTask, seedTasks,
    adjustUserXp, removeUser, exportWhitelist,
  };
}
