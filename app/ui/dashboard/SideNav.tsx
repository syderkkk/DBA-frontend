'use client';

import { useState } from 'react';

type MenuItem = {
  key: string;
  icon: string;
  label: string;
  submenu: string[];
};

const menuItems: MenuItem[] = [
  { key: 'students', icon: '🎓', label: 'Students', submenu: ['Student 1', 'Student 2', 'Student 3'] },
  { key: 'teams', icon: '👥', label: 'Teams', submenu: ['Team 1', 'Team 2'] },
  { key: 'class', icon: '🏫', label: 'Classes', submenu: ['Class 1', 'Class 2'] },
];

export default function SideNav() {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const toggleMenu = (menu: string) => {
    setActiveMenu((prev) => (prev === menu ? null : menu));
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-md shadow-md md:hidden"
        onClick={() => setIsSideNavOpen(!isSideNavOpen)}
        aria-label="Toggle sidebar"
      >
        ☰
      </button>

      {/* Overlay */}
      {isSideNavOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsSideNavOpen(false)}
          aria-hidden
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-16 bg-gradient-to-b from-blue-600 to-blue-800 shadow-xl transform transition-transform duration-300 z-40 ${
          isSideNavOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="flex flex-col items-center py-6 space-y-8">
          {/* Logo */}
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform duration-200">
            <span className="text-blue-600 text-2xl font-extrabold">L</span>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col space-y-6 w-full items-center">
            {menuItems.map(({ key, icon, submenu }) => (
              <div key={key} className="relative group">
                <button
                  onClick={() => toggleMenu(key)}
                  className={`text-white text-2xl hover:text-yellow-400 transition-transform duration-200 ${
                    activeMenu === key ? 'scale-125 text-yellow-300' : ''
                  }`}
                  aria-haspopup="true"
                  aria-expanded={activeMenu === key}
                >
                  {icon}
                </button>

                {/* Submenu */}
                {activeMenu === key && (
                  <div className="absolute left-16 top-1 bg-white rounded-md shadow-lg p-4 flex flex-col gap-2 w-40 animate-slide-in z-50">
                    {submenu.map((item, idx) => (
                      <button
                        key={idx}
                        className="text-gray-700 text-left hover:text-blue-600 hover:translate-x-1 transition-all duration-200"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* Custom animation */}
      <style jsx>{`
        .animate-slide-in {
          animation: slideIn 0.2s ease-out forwards;
        }
        @keyframes slideIn {
          0% {
            opacity: 0;
            transform: translateX(-10px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
      `}</style>
    </>
  );
}
