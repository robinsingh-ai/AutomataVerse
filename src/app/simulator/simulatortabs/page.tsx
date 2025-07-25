"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import DfaSimulator from "../../../simulators/dfa/AutomataSimulator";
import NfaSimulator from "../../../simulators/nfa/AutomataSimulator";
import PdaSimulator from "../../../simulators/pda/AutomataSimulator";
import FsmSimulator from "../../../simulators/fsm/AutomataSimulator";
import TMSimulator from "../../../simulators/tm/AutomataSimulator";

// Loading component for Suspense fallback
const TabsLoading = () => (
  <div className="flex flex-col h-full w-full bg-white dark:bg-slate-900">
    <div className="relative bg-slate-800 border-b border-slate-700">
      <div className="h-10 bg-gradient-to-b from-white to-white dark:from-slate-800 dark:to-slate-800 relative overflow-hidden">
        <div className="flex h-full relative">
          {["DFA", "NFA", "PDA", "FSM", "TM"].map((tab) => (
            <div key={tab} className="relative group" style={{ zIndex: 5 }}>
              <div className="relative h-full flex items-center justify-center transition-all duration-200 ease-out border-l border-r border-slate-600/50 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300" style={{ minWidth: '120px' }}>
                <div className="w-3 h-3 rounded-full bg-gray-400 mr-3 shadow-sm animate-pulse" />
                <span className="font-medium text-sm tracking-wide">{tab}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent" />
    </div>
    <div className="flex-grow bg-white dark:bg-slate-900 relative overflow-hidden flex items-center justify-center">
      <div className="text-gray-500 dark:text-slate-400 animate-pulse">Loading simulator...</div>
    </div>
  </div>
);

const SimulatorTabsContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialTab =
    (searchParams.get("tab")?.toUpperCase() as "DFA" | "NFA" | "PDA" | "FSM" | "TM") ||
    "DFA";

  const [activeTab, setActiveTab] = useState<"DFA" | "NFA" | "PDA" | "FSM" | "TM">(
    initialTab
  );

  // Update URL when tab changes
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("tab", activeTab.toLowerCase());
    router.replace(`?${params.toString()}`);
  }, [activeTab, router]);

  const tabs = [
    { id: "DFA", label: "DFA", color: "bg-green-500" },
    { id: "NFA", label: "NFA", color: "bg-purple-500" },
    { id: "PDA", label: "PDA", color: "bg-orange-500" },
    { id: "FSM", label: "FSM", color: "bg-amber-600" },
    { id: "TM", label: "TM", color: "bg-blue-500" },
  ];

  const renderSimulator = () => {
    switch (activeTab) {
      case "DFA":
        return <DfaSimulator />;
      case "NFA":
        return <NfaSimulator />;
      case "PDA":
        return <PdaSimulator />;
      case "FSM":
        return <FsmSimulator />;
      case "TM":
        return <TMSimulator />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-slate-900">
      {/* Chrome-style Tabs Container */}
      <div className="relative bg-slate-800 border-b border-slate-700">
        {/* Tab Strip Background */}
        <div className="h-10 bg-gradient-to-b from-white to-white dark:from-slate-800 dark:to-slate-800 relative overflow-hidden">
          {/* Chrome-style tab shapes */}
                 <div className="flex h-full relative">
            {tabs.map((tab, index) => {
              const isActive = activeTab === tab.id;
              const isNext = tabs[tabs.findIndex(t => t.id === activeTab) + 1]?.id === tab.id;
              const isPrev = tabs[tabs.findIndex(t => t.id === activeTab) - 1]?.id === tab.id;
              
              return (
                <div
                  key={tab.id}
                  className="relative group"
                  style={{ zIndex: isActive ? 10 : 5 }}
                >
                  {/* Tab Button */}
                  <motion.button
                    className={`
                      relative h-full flex items-center justify-center
                      transition-all duration-200 ease-out border-l border-r border-slate-600/50
                      ${isActive 
                        ? 'bg-white dark:bg-slate-900 text-gray-700 dark:text-white shadow-lg border-slate-500/70' 
                        : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-750 hover:border-slate-400/70'
                      }
                    `}
                    onClick={() => setActiveTab(tab.id as any)}
                    whileHover={{ y: isActive ? 0 : -1 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      minWidth: '120px',
                    }}
                  >
                    {/* Color indicator */}
                    <div className={`w-3 h-3 rounded-full ${tab.color} mr-3 shadow-sm`} />
                    
                    {/* Tab label */}
                    <span className="font-medium text-sm tracking-wide">
                      {tab.label}
                    </span>

                    {/* Active tab indicator line */}
                    {isActive && (
                      <motion.div
                        className={`absolute bottom-0 left-0 right-0 h-0.5 ${tab.color}`}
                        layoutId="activeTabIndicator"
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30
                        }}
                      />
                    )}

                    {/* Hover glow effect */}
                    {!isActive && (
                      <div className="absolute inset-0 bg-gradient-to-t from-transparent to-slate-700/10 dark:to-slate-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    )}
                  </motion.button>
                </div>
              );
            })}
          </div>

        </div>

        {/* Bottom border with gradient */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent" />
      </div>

      {/* Content Area with smooth transitions */}
      <div className="flex-grow bg-white dark:bg-slate-900 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{
              duration: 0.3,
              ease: [0.4, 0.0, 0.2, 1]
            }}
            className="h-full w-full"
          >
            {renderSimulator()}
          </motion.div>
        </AnimatePresence>

        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
          <div className="w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_70%)]" />
        </div>
      </div>
    </div>
  );
};

// Main page component with Suspense boundary
const SimulatorTabsPage = () => {
  return (
    <Suspense fallback={<TabsLoading />}>
      <SimulatorTabsContent />
    </Suspense>
  );
};

export default SimulatorTabsPage;
