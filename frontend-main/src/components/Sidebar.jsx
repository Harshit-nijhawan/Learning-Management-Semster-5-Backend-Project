import { ChevronFirst, ChevronLast, MoreVertical } from "lucide-react";
import React, { createContext, useContext, useState } from "react";

const SidebarContext = createContext();

export default function Sidebar({ children }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <aside className="fixed top-0 left-0 h-screen z-30">
      <nav className="h-full flex flex-col bg-white border-r border-gray-200 shadow-sm">
        {/* Header */}
        <div className="p-4 pb-2 flex justify-between items-center">
          <h1
            className={`text-[30px] font-bold text-blue-600 transition-all overflow-hidden ${
              expanded ? "w-32 opacity-100" : "w-0 opacity-0"
            }`}
          >
            Learnify
          </h1>
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-md bg-gray-50 hover:bg-gray-100 transition"
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
            className={`flex items-center justify-between overflow-hidden transition-all ${
              expanded ? "w-52 opacity-100" : "w-0 opacity-0"
            }`}
          >
            <div className="leading-4">
              <h4 className="font-semibold">Learnify</h4>
              <span className="text-xs text-gray-500">learnify@gmail.com</span>
            </div>
            <MoreVertical size={20} className="text-gray-600" />
          </div>
        </div>
      </nav>
    </aside>
  );
}

export function SidebarItem({ icon, text, active, alert, onClick }) {
  const { expanded } = useContext(SidebarContext);

  return (
    <li
      className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group
        ${
          active
            ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-700 font-semibold shadow-md"
            : "hover:bg-indigo-50 text-gray-600"
        }`}
      onClick={onClick}
    >
      <span className="text-xl">{icon}</span>

      {/* Text only shows when expanded */}
      <span
        className={`transition-all overflow-hidden ${
          expanded ? "ml-3 w-40 opacity-100" : "w-0 opacity-0"
        }`}
      >
        {text}
      </span>

      {/* Alert dot */}
      {alert && (
        <div
          className={`absolute rounded-full bg-red-500 animate-pulse 
            ${expanded ? "right-3 top-2 w-2 h-2" : "right-2 top-2 w-2 h-2"}`}
        ></div>
      )}

      {!expanded && (
        <div
          className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-indigo-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}
        >
          {text}
        </div>
      )}
    </li>
  );
}
