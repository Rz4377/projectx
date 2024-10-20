import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useDarkMode } from '../components/theme-provider';
import { useState, useEffect } from 'react';

export default function MainLayout() {
  const { isDarkMode } = useDarkMode();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    const updateSidebarWidth = () => {
      const root = document.documentElement;
      if (window.innerWidth >= 768) {
        root.style.setProperty('--sidebar-width', isSidebarOpen ? '16rem' : '0rem');
      } else {
        root.style.setProperty('--sidebar-width', isSidebarOpen ? '4rem' : '0rem');
      }
    };

    updateSidebarWidth(); // Set initial value
    window.addEventListener('resize', updateSidebarWidth);
    return () => window.removeEventListener('resize', updateSidebarWidth);
  }, [isSidebarOpen]);

  return (
    <div className={`${isDarkMode ? 'dark' : ''}`}>
      <Navbar toggleSidebar={toggleSidebar} />

      <div className="flex min-h-screen overflow-x-hidden">
        {isSidebarOpen && <Sidebar />}
        <div
          className="flex-grow mt-20 transition-all duration-300"
          style={{ marginLeft: isSidebarOpen ? 'var(--sidebar-width)' : '0' }}
        >                                                                            
          {/* Pass the toggleSidebar function as context */}
          <Outlet context={{ toggleSidebar }} />
        </div>
      </div>
    </div>
  );
}