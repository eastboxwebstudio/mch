import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { SeafarerDashboard } from './components/SeafarerDashboard';
import { AgentDashboard } from './components/AgentDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { UserRole, Profile } from './types';
import { LoginPage } from './components/LoginPage';

const App: React.FC = () => {
  const [user, setUser] = useState<Profile | null>(null);

  const handleLogin = (loggedInUser: Profile) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  // Determine which dashboard to show based on the logged-in user's role
  const renderDashboard = () => {
    if (!user) return null;

    switch (user.role) {
      case UserRole.SEAFARER:
        return <SeafarerDashboard userId={user.id} />;
      case UserRole.AGENT:
        return <AgentDashboard userId={user.id} />;
      case UserRole.ADMIN:
        return <AdminDashboard />;
      default:
        return <div className="p-10 text-center">Role not recognized</div>;
    }
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <Layout 
      user={user} 
      onLogout={handleLogout}
    >
      {renderDashboard()}
    </Layout>
  );
};

export default App;