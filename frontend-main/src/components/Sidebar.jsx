import { ChevronFirst, ChevronLast, MoreVertical } from "lucide-react";
import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const SidebarContext = createContext();

export default function Sidebar({ children, open, setOpen }) {
  const [internalOpen, setInternalOpen] = useState(true);
  const isControlled = open !== undefined;
  const expanded = isControlled ? open : internalOpen;
  const setExpanded = isControlled ? setOpen : setInternalOpen;

  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <aside className={`fixed top-0 left-0 h-screen z-40 bg-white border-r border-gray-200 shadow-sm transition-all duration-300
        ${expanded ? "w-64" : "w-20"}
        ${isMobile ? (expanded ? "translate-x-0 shadow-2xl" : "-translate-x-full") : "translate-x-0"}
      `}>
        <nav className="h-full flex flex-col bg-white">
          {/* Header */}
          <div className="p-4 pb-2 flex justify-between items-center">
            <h1
              onClick={() => navigate('/')}
              className={`text-[30px] font-bold text-blue-600 transition-all overflow-hidden cursor-pointer hover:text-blue-700 whitespace-nowrap ${expanded ? "w-32 opacity-100" : "w-0 opacity-0"
                }`}
            >
              Learnify
            </h1>
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1.5 rounded-md bg-gray-50 hover:bg-gray-100 transition text-gray-700"
            >
              {expanded ? <ChevronFirst /> : <ChevronLast />}
            </button>
          </div>

          {/* Items */}
          <SidebarContext.Provider value={{ expanded }}>
            <ul className="flex-1 px-3 space-y-2">{children}</ul>
          </SidebarContext.Provider>

          {/* Footer */}
          <div className="border-t border-gray-200 p-3">
            <div
              className={`flex items-center justify-between overflow-hidden transition-all ${expanded ? "w-52 opacity-100" : "w-0 opacity-0"
                }`}
            >
              <div className="leading-4">
                <h4 className="font-semibold text-gray-900">Learnify</h4>
                <span className="text-xs text-gray-500">learnify@gmail.com</span>
              </div>
              <MoreVertical size={20} className="text-gray-600" />
            </div>
          </div>
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {isMobile && expanded && (
        <div
          className="fixed inset-0 bg-black/50 z-30 backdrop-blur-sm"
          onClick={() => setExpanded(false)}
        />
      )}
    </>
  );
}

export function SidebarItem({ icon, text, active, alert, onClick }) {
  const { expanded } = useContext(SidebarContext);

  return (
    <li
      className={`relative flex items-center py-3 px-3 my-2 font-medium rounded-xl cursor-pointer transition-all duration-300 group
        ${active
          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200"
          : "hover:bg-blue-50 text-gray-600 hover:text-blue-600"
        }`}
      onClick={onClick}
    >
      <span className={`text-xl transition-transform duration-300 ${!expanded && "mx-auto"}`}>{icon}</span>

      <span
        className={`overflow-hidden transition-all duration-300 ${expanded ? "ml-3 w-52 opacity-100" : "w-0 opacity-0"
          }`}
      >
        {text}
      </span>

      {alert && (
        <div
          className={`absolute rounded-full bg-red-500 ring-2 ring-white
            ${expanded ? "right-2 w-2 h-2" : "top-2 right-2 w-2 h-2"}`}
        />
      )}

      {!expanded && (
        <div
          className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-gray-900 text-white text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 z-50 whitespace-nowrap`}
        >
          {text}
        </div>
      )}
    </li>
  );
}
