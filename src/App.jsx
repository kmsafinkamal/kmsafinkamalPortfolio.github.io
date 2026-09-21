import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import ResearchHubView from './components/ResearchHubView';
import PublicationsView from './components/PublicationsView';
import ProjectsView from './components/ProjectsView';
import TeachingView from './components/TeachingView';
import CVView from './components/CVView';
import AboutView from './components/AboutView';
import ContactView from './components/ContactView';
import AdminPanel from './components/AdminPanel';
import CiteModal from './components/CiteModal';
import CommandPalette from './components/CommandPalette';
import Toast from './components/Toast';

import initialPublicationsData from './data/publications.json';
import initialProfileData from './data/profile.json';

export default function App() {
  const [activeTab, setActiveTab] = useState('research');
  const [citePaper, setCitePaper] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'info', icon = null) => {
    setToast({ message, type, icon });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 3500);
  }, []);

  // Global Ctrl+K / Cmd+K Search Palette Shortcut
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Dark Mode Theme State with system & localStorage persistence
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // Live State backed by SQLite DB with localStorage cache & static fallback
  const [profile, setProfile] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('portfolio_profile');
        if (cached) {
          const parsed = JSON.parse(cached);
          return { ...initialProfileData, ...parsed };
        }
      } catch (e) {}
    }
    return initialProfileData;
  });
  const [publications, setPublications] = useState(initialPublicationsData);

  // Inquiries State with SQLite DB sync & localStorage backup
  const [inquiries, setInquiries] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('portfolio_inquiries');
        if (saved) return JSON.parse(saved);
      } catch (e) {}
    }
    return [];
  });

  const unreadInquiriesCount = inquiries.filter((i) => i.status === 'unread').length;

  const handleAddInquiry = async (newInquiry) => {
    setInquiries((prev) => {
      const updated = [newInquiry, ...prev];
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('portfolio_inquiries', JSON.stringify(updated));
        } catch (e) {}
      }
      return updated;
    });

    try {
      await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newInquiry)
      });
    } catch (err) {
      console.log('Saved inquiry locally:', err.message);
    }
  };

  const handleUpdateInquiryStatus = async (id, newStatus) => {
    setInquiries((prev) => {
      const updated = prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item));
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('portfolio_inquiries', JSON.stringify(updated));
        } catch (e) {}
      }
      return updated;
    });

    try {
      await fetch(`/api/inquiries/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (err) {
      console.log('Updated inquiry status locally:', err.message);
    }
  };

  const handleDeleteInquiry = async (id) => {
    setInquiries((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('portfolio_inquiries', JSON.stringify(updated));
        } catch (e) {}
      }
      return updated;
    });

    try {
      await fetch(`/api/inquiries/${id}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.log('Deleted inquiry locally:', err.message);
    }
  };

  const handleProfileUpdate = (updatedProfile) => {
    setProfile(updatedProfile);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('portfolio_profile', JSON.stringify(updatedProfile));
      } catch (e) {}
    }
  };

  // Fetch live from SQLite API on mount
  useEffect(() => {
    fetch('/api/profile')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setProfile(data);
          try {
            localStorage.setItem('portfolio_profile', JSON.stringify(data));
          } catch (e) {}
        }
      })
      .catch((err) => console.log('Serving from bundled profile cache:', err.message));

    fetch('/api/publications')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data) && data.length > 0) {
          setPublications(data);
        }
      })
      .catch((err) => console.log('Serving from bundled publications cache:', err.message));

    fetch('/api/inquiries')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data)) {
          setInquiries(data);
          try {
            localStorage.setItem('portfolio_inquiries', JSON.stringify(data));
          } catch (e) {}
        }
      })
      .catch((err) => console.log('Serving inquiries from cache:', err.message));
  }, []);

  const handleCiteClick = (paper) => {
    setCitePaper(paper);
  };

  const handleCloseCiteModal = () => {
    setCitePaper(null);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        publicationsCount={publications.length}
        profile={profile}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        onOpenSearch={() => setIsSearchOpen(true)}
        unreadInquiriesCount={unreadInquiriesCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-6 pb-24 md:pb-16">
        {activeTab === 'research' && (
          <ResearchHubView
            profile={profile}
            publications={publications}
            onNavigate={setActiveTab}
            onCiteClick={handleCiteClick}
          />
        )}

        {activeTab === 'publications' && (
          <PublicationsView
            publications={publications}
            profile={profile}
            onCiteClick={handleCiteClick}
            onNotify={showToast}
          />
        )}

        {activeTab === 'projects' && (
          <ProjectsView
            profile={profile}
            publications={publications}
            onNavigate={setActiveTab}
            onCiteClick={handleCiteClick}
          />
        )}

        {activeTab === 'teaching' && (
          <TeachingView
            profile={profile}
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'cv' && (
          <CVView
            profile={profile}
            publications={publications}
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'about' && (
          <AboutView
            profile={profile}
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'contact' && (
          <ContactView
            profile={profile}
            onNotify={showToast}
            onAddInquiry={handleAddInquiry}
          />
        )}

        {activeTab === 'admin' && (
          <AdminPanel
            profile={profile}
            onProfileUpdate={handleProfileUpdate}
            publications={publications}
            onPublicationsUpdate={setPublications}
            onClose={() => setActiveTab('research')}
            inquiries={inquiries}
            onUpdateInquiryStatus={handleUpdateInquiryStatus}
            onDeleteInquiry={handleDeleteInquiry}
          />
        )}
      </main>

      {/* Comprehensive Academic Footer */}
      <footer className="border-t border-outline bg-surface-container-lowest py-12 text-body-sm text-on-surface-variant no-print">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Col 1: Identity */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="font-bold text-title-md text-on-surface">{profile.name}</span>
                <span className="material-symbols-outlined text-secondary text-[16px]">verified</span>
              </div>
              <p className="text-secondary text-body-sm font-medium">{profile.title}</p>
              <p className="text-[12px] text-on-surface-variant leading-relaxed">
                {profile.department} • {profile.affiliation}
              </p>
              <p className="text-[11px] text-on-surface-variant/80 italic mt-1">
                Advancing explainable deep learning, clinical AI diagnostics, and efficient cloud/edge computing.
              </p>
            </div>

            {/* Col 2: Academic Sections */}
            <div className="flex flex-col gap-2.5">
              <span className="text-label-sm font-bold uppercase tracking-wider text-on-surface">
                Academic Sections
              </span>
              <ul className="flex flex-col gap-1.5 text-label-md">
                <li>
                  <button onClick={() => setActiveTab('research')} className="hover:text-secondary transition-colors text-left">
                    Research Overview & Hub
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('publications')} className="hover:text-secondary transition-colors text-left flex items-center gap-1.5">
                    <span>Publications & Preprints</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-surface-container text-on-surface-variant font-bold">
                      {publications.length}
                    </span>
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('projects')} className="hover:text-secondary transition-colors text-left">
                    Research Projects & Labs
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('teaching')} className="hover:text-secondary transition-colors text-left">
                    Teaching & Student Mentorship
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('cv')} className="hover:text-secondary transition-colors text-left flex items-center gap-1">
                    <span>Curriculum Vitae</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200 font-bold">
                      PDF
                    </span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Scholarly Profiles */}
            <div className="flex flex-col gap-2.5">
              <span className="text-label-sm font-bold uppercase tracking-wider text-on-surface">
                Scholarly Profiles
              </span>
              <ul className="flex flex-col gap-2 text-label-md">
                <li>
                  <a
                    href="https://scholar.google.com/citations?user=gpR1AC8AAAAJ&hl=en"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-secondary transition-colors inline-flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px] text-secondary">school</span>
                    <span>Google Scholar</span>
                    <span className="material-symbols-outlined text-[12px] text-on-surface-variant">open_in_new</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.researchgate.net/profile/K-M-Safin-Kamal"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-secondary transition-colors inline-flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px] text-secondary">hub</span>
                    <span>ResearchGate</span>
                    <span className="material-symbols-outlined text-[12px] text-on-surface-variant">open_in_new</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://orcid.org/0009-0004-9844-3151"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-secondary transition-colors inline-flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px] text-emerald-600">verified_user</span>
                    <span>ORCID (0009-0004-9844-3151)</span>
                    <span className="material-symbols-outlined text-[12px] text-on-surface-variant">open_in_new</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/SafinKamal"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-secondary transition-colors inline-flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px] text-secondary">code</span>
                    <span>GitHub Repositories</span>
                    <span className="material-symbols-outlined text-[12px] text-on-surface-variant">open_in_new</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 4: Portals & Preferences */}
            <div className="flex flex-col gap-3">
              <span className="text-label-sm font-bold uppercase tracking-wider text-on-surface">
                Portals & Settings
              </span>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={toggleDarkMode}
                  className="inline-flex items-center justify-start gap-2 px-3 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container border border-outline text-on-surface text-label-md font-medium transition-colors"
                >
                  <span className="material-symbols-outlined text-[17px] text-secondary">
                    {darkMode ? 'light_mode' : 'dark_mode'}
                  </span>
                  <span>{darkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}</span>
                </button>

                <button
                  onClick={() => setActiveTab('admin')}
                  className="inline-flex items-center justify-start gap-2 px-3 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container border border-outline text-on-surface text-label-md font-medium transition-colors"
                >
                  <span className="material-symbols-outlined text-[17px] text-secondary">
                    admin_panel_settings
                  </span>
                  <span>Admin & Scholar Sync</span>
                </button>

                <button
                  onClick={() => setActiveTab('cv')}
                  className="inline-flex items-center justify-start gap-2 px-3 py-2 rounded-xl bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/30 text-label-md font-semibold transition-colors"
                >
                  <span className="material-symbols-outlined text-[17px]">print</span>
                  <span>Print / Save CV as PDF</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom copyright & attribution bar */}
          <div className="pt-6 border-t border-outline/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-on-surface-variant">
            <div>
              © {new Date().getFullYear()} {profile.name} • Department of Computer Science & Engineering, East West University.
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="hover:text-secondary flex items-center gap-1 transition-colors"
              >
                <span>Back to top</span>
                <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky Bottom Nav */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        onOpenSearch={() => setIsSearchOpen(true)}
        unreadInquiriesCount={unreadInquiriesCount}
      />

      {/* Citation Export Modal */}
      {citePaper && (
        <CiteModal
          paper={citePaper}
          onClose={handleCloseCiteModal}
          onNotify={showToast}
        />
      )}

      {/* Global Academic Omnibar / Command Palette */}
      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={setActiveTab}
        publications={publications}
        profile={profile}
        onCiteClick={handleCiteClick}
      />

      {/* Floating Micro-interaction Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
