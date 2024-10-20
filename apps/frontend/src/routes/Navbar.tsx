// Navbar.tsx
import { useContext } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';
import { AuthContext } from '../context/AuthContextApi';
import Logout from '../components/Logout';
import SignupButton from '../components/SignupButton';
import { useDarkMode } from '../components/theme-provider';
import { useNavigate } from 'react-router-dom';
import { LoadSidebar } from '../components/LoadSidebar';
import { Spinner } from '../components/Spinner';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('AuthContext must be used within an AuthProvider.');
  }

  const { user, loading } = authContext;
  const { isDarkMode, toggleTheme } = useDarkMode();
  const navigate = useNavigate();

  return (
    <nav
      className={`fixed top-0 left-0 w-full h-20  ${
        isDarkMode ? 'bg-gray-900' : 'bg-white'
      } shadow-md z-20 border-b ${
        isDarkMode ? 'border-gray-700' : 'border-white/20'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* left side icons  */}
          <div className="flex items-center gap-4">
            {/* sidebar btn */}
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md focus:outline-none"
            >
              <LoadSidebar/>
              
            </button>
            {/* title & logo  */}
            <div className="flex flex-row items-center">
              <div className="b-2 p-2 rounded-full overflow-hidden"> <img className="hover:cursor-pointer" onClick={()=> navigate("/home")} src="../../assets/logo.webp" alt="" height={35} width={35} /> </div>
              <span
                className=" font-semibold cursor-pointer text-gray-800 dark:text-white"
                onClick={() => navigate('/home')}
              >
                TalentGallery
              </span>
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-200/40 dark:bg-gray-700/40 hover:bg-gray-200/60 dark:hover:bg-gray-700/60 focus:outline-none transition"
            >
              {isDarkMode ? (
                <SunIcon className="h-6 w-6 text-yellow-500" />
              ) : (
                <MoonIcon className="h-6 w-6 text-gray-800 dark:text-gray-200" />
              )}
            </button>

            {!loading ? (
              <>
                {!user ? (
                  <>
                    <SignupButton />
                  </>
                ) : (
                  <Logout />
                )}
              </>
            ) : (
              <Spinner/>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;