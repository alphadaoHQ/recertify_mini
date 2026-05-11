import { useMemo, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { useAppData } from "./hooks/useAppData";
import { useTheme } from "./hooks/useTheme";
import { CourseModulePage } from "./pages/CourseModulePage";
import { LearningHubPage } from "./pages/LearningHubPage";
import { ProfilePage } from "./pages/ProfilePage";
import { RanksPage } from "./pages/RanksPage";
import { TasksPage } from "./pages/TasksPage";

const TAB_ROUTES = {
  learning: "/learning",
  tasks: "/tasks",
  ranks: "/ranks",
  profile: "/profile",
};

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const appData = useAppData();

  const activeTab = useMemo(() => {
    if (location.pathname.startsWith("/tasks")) return "tasks";
    if (location.pathname.startsWith("/ranks")) return "ranks";
    if (location.pathname.startsWith("/profile")) return "profile";
    return "learning";
  }, [location.pathname]);

  const handleSelectAnswer = (moduleId, answerId) => {
    setSelectedAnswers((current) => ({
      ...current,
      [moduleId]: answerId,
    }));
  };

  return (
    <AppShell
      activeTab={activeTab}
      appName={appData.appName}
      errorMessage={appData.errorMessage}
      isDark={isDark}
      isTelegramReady={appData.isTelegramReady}
      isWalletConnected={appData.isWalletConnected}
      isWalletConnecting={appData.isWalletConnecting}
      onCloseWalletModal={appData.closeWalletModal}
      onConnectManualWallet={appData.connectManualWallet}
      onConnectWallet={appData.connectWallet}
      onDisconnectWallet={appData.disconnectWallet}
      onTabChange={(tab) => navigate(TAB_ROUTES[tab])}
      onToggleTheme={toggleTheme}
      showWalletModal={appData.showWalletModal}
      statusMessage={appData.statusMessage}
      user={appData.user}
      walletLabel={appData.walletLabel}
    >
      <Routes>
        <Route path="/" element={<Navigate to="/learning" replace />} />
        <Route
          path="/learning"
          element={
            <LearningHubPage
              isLoading={appData.isLoading}
              isWalletConnected={appData.isWalletConnected}
              modules={appData.modules}
              recentMint={appData.recentMint}
              user={appData.user}
              onOpenModule={(moduleId) => navigate(`/learning/${moduleId}`)}
            />
          }
        />
        <Route
          path="/learning/:moduleId"
          element={
            <CourseModulePage
              isWalletConnected={appData.isWalletConnected}
              modules={appData.modules}
              onCompleteModule={appData.completeModule}
              onContinue={() => navigate("/tasks")}
              onSelectAnswer={handleSelectAnswer}
              selectedAnswers={selectedAnswers}
            />
          }
        />
        <Route
          path="/tasks"
          element={
            <TasksPage
              isWalletConnected={appData.isWalletConnected}
              onClaimSpecialQuest={appData.claimSpecialQuest}
              onClaimTask={appData.claimTask}
              specialQuest={appData.specialQuest}
              tasks={appData.tasks}
              whitelistStatus={appData.whitelistStatus}
            />
          }
        />
        <Route
          path="/ranks"
          element={
            <RanksPage
              isWalletConnected={appData.isWalletConnected}
              leaderboard={appData.leaderboard}
              user={appData.user}
              whitelistStatus={appData.whitelistStatus}
            />
          }
        />
        <Route
          path="/profile"
          element={
            <ProfilePage
              isWalletConnected={appData.isWalletConnected}
              nfts={appData.nfts}
              onSetUsername={appData.setUsername}
              progress={appData.progress}
              tasks={appData.tasks}
              user={appData.user}
              walletAddress={appData.walletAddress}
              whitelistStatus={appData.whitelistStatus}
            />
          }
        />
      </Routes>
    </AppShell>
  );
}
