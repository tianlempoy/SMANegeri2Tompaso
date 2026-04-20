
import React, { useState, useEffect } from 'react';
import { Page } from './types.js';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ContactSection from './components/ContactSection';
import TeachersSection from './components/TeachersSection';
import AdminDashboard from './components/AdminDashboard';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import TeacherLogin from './components/TeacherLogin';
import TeacherDashboard from './components/TeacherDashboard';
import AdmissionHub from './components/AdmissionHub';
import NewsSection from './components/NewsSection';
import StudentGallery from './components/StudentGallery';
import SchoolHistory from './components/SchoolHistory';
import AICreativeLab from './components/AICreativeLab';
import AIScholar from './components/AIScholar';
import PPDBRegistrationComponent from './components/PPDBRegistration';
import PPDBStatus from './components/PPDBStatus';
import AlumniNetwork from './components/AlumniNetwork';
import LibraryPortal from './components/LibraryPortal';
import SchoolProfile from './components/SchoolProfile';
import ActivitiesSection from './components/ActivitiesSection';
import AchievementsShowcase from './components/AchievementsShowcase';
import FeaturedPrograms from './components/FeaturedPrograms';
import DigitalHeritage from './components/DigitalHeritage';
import SchoolSchedule from './components/SchoolSchedule';
import Hero from './components/Hero';
import MottoDeepDive from './components/MottoDeepDive';
import PrincipalWelcome from './components/PrincipalWelcome';
import InstitutionalFramework from './components/InstitutionalFramework';
import VirtualTour from './components/VirtualTour';
import { StatsSection, CareerPathExplorer } from './components/EliteSections';
import DeveloperSection from './components/DeveloperSection';
import { getSavedUser, clearToken } from './lib/actions';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>(Page.HOME);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Check if user already logged in via saved token
    const checkAuth = async () => {
      const user = await getSavedUser();
      setCurrentUser(user);
      setAuthChecked(true);
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
      });
    }, { 
      threshold: 0.01,
      rootMargin: '0px 0px -50px 0px'
    });
    const elements = document.querySelectorAll('.reveal');
    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [activePage]);

  const handleLoginSuccess = async () => {
    const user = await getSavedUser();
    setCurrentUser(user);
    if (user) {
      // Redirect berdasarkan role
      if (user.role === 'admin') {
        setActivePage(Page.ADMIN);
      } else {
        setActivePage(Page.GURU_PORTAL);
      }
    }
  };

  const handleLogout = () => {
    clearToken();
    setCurrentUser(null);
    setActivePage(Page.HOME);
  };

  const isInDashboard = activePage === Page.ADMIN || activePage === Page.GURU_PORTAL;

  const renderDashboard = () => {
    if (!currentUser) {
      return (
        <TeacherLogin onSuccess={handleLoginSuccess} />
      );
    }

    const role = currentUser.role;

    // Admin: Full super admin dashboard (dark theme, user management)
    if (role === 'admin') {
      return <AdminDashboard onLogout={handleLogout} />;
    }

    // Semua role lain (kepala_sekolah, tata_usaha, guru): TeacherDashboard
    return (
      <TeacherDashboard
        onLogout={handleLogout}
        teacherInfo={currentUser}
      />
    );
  };

  const renderContent = () => {
    try {
      switch (activePage) {
        case Page.HOME:
          return (
            <div className="bg-white min-h-screen relative overflow-hidden">
              <Hero onAdmissionClick={() => setActivePage(Page.PPDB)} />
              <StatsSection />
              <MottoDeepDive />
              <PrincipalWelcome />
              <InstitutionalFramework />
              <VirtualTour />
              <AchievementsShowcase />
              <FeaturedPrograms />
              <CareerPathExplorer />
              <DigitalHeritage />
              <div id="schedule" className="reveal"><SchoolSchedule /></div>
              <NewsSection />
              <ContactSection />
            </div>
          );
        case Page.PROFIL: return <SchoolProfile />;
        case Page.GURU: return <TeachersSection />;
        case Page.KEGIATAN: return <ActivitiesSection />;
        case Page.PRESTASI: return <AchievementsShowcase />;
        case Page.BERITA: return <NewsSection isFullPage={true} />;
        case Page.GALERI: return <StudentGallery />;
        case Page.PPDB: return <PPDBRegistrationComponent />;
        case Page.PPDB_STATUS: return <PPDBStatus />;
        case Page.LIBRARY: return <LibraryPortal />;
        case Page.ALUMNI: return <AlumniNetwork />;
        case Page.AI_HUB: return <AICreativeLab />;
        case Page.SCHOLAR: return <AIScholar />;
        case Page.DEVELOPER: return <DeveloperSection />;
        case Page.ADMIN:
        case Page.GURU_PORTAL:
          return renderDashboard();
        default: return <Hero />;
      }
    } catch (err) {
      console.error('Render error in App:', err);
      return (
        <div className="p-8 text-red-700 bg-white">
          <h2 className="text-2xl font-bold mb-2">Terjadi kesalahan saat menampilkan halaman</h2>
          <pre className="whitespace-pre-wrap text-sm">{String(err)}</pre>
        </div>
      );
    }
  };

  if (!authChecked) return null;

  return (
    <div className="min-h-screen flex flex-col bg-white selection:bg-[#D4AF37] selection:text-primary">
      {!isInDashboard && <Navbar activePage={activePage} setActivePage={setActivePage} />}
      <main className="flex-grow">{renderContent()}</main>
      {!isInDashboard && (
        <>
          <Footer 
            onAdminClick={() => {
              if (currentUser) {
                setActivePage(currentUser.role === 'admin' ? Page.ADMIN : Page.GURU_PORTAL);
              } else {
                setActivePage(Page.ADMIN);
              }
            }} 
            onDeveloperClick={() => setActivePage(Page.DEVELOPER)}
          />
        </>
      )}
    </div>
  );
};

export default App;
