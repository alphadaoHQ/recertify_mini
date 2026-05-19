import { useAdminData } from "../../hooks/useAdminData";
import { AdminLogin } from "./AdminLogin";
import { AdminLayout } from "./AdminLayout";
import { DashboardTab } from "./DashboardTab";
import { CoursesTab } from "./CoursesTab";
import { TasksTab } from "./TasksTab";
import { UsersTab } from "./UsersTab";
import { WhitelistTab } from "./WhitelistTab";

export function AdminPage() {
  const admin = useAdminData();

  if (!admin.isAuthenticated) {
    return <AdminLogin onLogin={admin.login} error={admin.error} />;
  }

  return (
    <AdminLayout activeTab={admin.activeTab} onSwitchTab={admin.switchTab} onLogout={admin.logout}>
      {/* Feedback banners */}
      {admin.error && (
        <div className="mb-4 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{admin.error}</div>
      )}
      {admin.success && (
        <div className="mb-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">{admin.success}</div>
      )}

      {admin.activeTab === "dashboard" && <DashboardTab stats={admin.stats} isLoading={admin.isLoading} />}
      {admin.activeTab === "courses" && (
        <CoursesTab courses={admin.courses} isLoading={admin.isLoading}
          onAdd={admin.addCourse} onEdit={admin.editCourse} onDelete={admin.removeCourse} onSeed={admin.seedCourses} />
      )}
      {admin.activeTab === "tasks" && (
        <TasksTab tasks={admin.tasks} isLoading={admin.isLoading}
          onAdd={admin.addTask} onEdit={admin.editTask} onDelete={admin.removeTask} onSeed={admin.seedTasks} />
      )}
      {admin.activeTab === "users" && (
        <UsersTab users={admin.users} isLoading={admin.isLoading} onAdjustXp={admin.adjustUserXp} onDelete={admin.removeUser} />
      )}
      {admin.activeTab === "whitelist" && (
        <WhitelistTab whitelistUsers={admin.whitelistUsers} isLoading={admin.isLoading} onExport={admin.exportWhitelist} />
      )}
    </AdminLayout>
  );
}
