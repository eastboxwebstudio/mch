import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { SeafarerDashboard } from './components/SeafarerDashboard';
import { AgentDashboard } from './components/AgentDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { UserRole, Profile } from './types';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { supabase } from './lib/supabase';
import { MockService } from './services/mockService';

type ViewState = 'login' | 'register' | 'dashboard' | 'loading';

const App: React.FC = () => {
  const [user, setUser] = useState<Profile | null>(null);
  const [view, setView] = useState<ViewState>('loading');

  useEffect(() => {
    if (!supabase) {
      setView('login');
      return;
    }

    // Immediately check for an existing session
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        if (session) {
          MockService.getProfileById(session.user.id).then(profile => {
            if (profile) {
              setUser(profile);
              setView('dashboard');
            } else {
              setView('login'); // Profile not found
            }
          });
        } else {
          setView('login');
        }
      })
      .catch((error) => {
        console.error("Error getting session:", error);
        setView('login'); // Fallback to login page on error
      });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const profile = await MockService.getProfileById(session.user.id);
        setUser(profile || null);
        if (profile) {
          setView('dashboard');
        }
      } else {
        setUser(null);
        setView('login');
      }
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogin = (loggedInUser: Profile) => {
    setUser(loggedInUser);
    setView('dashboard');
  };

  const handleLogout = async () => {
    if(supabase) await supabase.auth.signOut();
    setUser(null);
    setView('login');
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

  if (view === 'loading') {
    return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>;
  }

  if (view === 'login') {
    return <LoginPage onLogin={handleLogin} onNavigateRegister={() => setView('register')} />;
  }

  if (view === 'register') {
    return <RegisterPage onRegister={handleLogin} onNavigateLogin={() => setView('login')} />;
  }

  return (
    <Layout 
      user={user!} 
      onLogout={handleLogout}
    >
      {renderDashboard()}
    </Layout>
  );
};

export default App;