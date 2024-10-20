import { FaHome, FaPen, FaBook, FaUserAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const navigate = useNavigate();
  const list = [
    { icon: FaHome, label: 'Home', route: '/home' },
    { icon: FaBook, label: 'Posts', route: '/feed' },
    { icon: FaPen, label: 'Create Posts', route: '/createPosts' },
    { icon: FaUserAlt, label: 'My Posts', route: '/myposts' },
  ];

  return (
    <div
      className={`fixed top-20 left-0 h-[calc(100vh-5rem)] bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200 border-r dark:border-gray-700 transition-all duration-300 overflow-hidden z-10`}
      style={{
        width: 'var(--sidebar-width)',
      }}
    >
      <div className="p-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold hidden md:block">Dashboard</h1>
        </div>
        <ul>
          {list.map((item) => (
            <li
              key={item.label}
              className="mb-6 flex items-center space-x-2 hover:text-green-500 dark:hover:text-green-300 cursor-pointer"
              onClick={() => navigate(item.route)}
            >
              <item.icon className="h-6 w-6" />
              <span className="hidden md:inline">{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}