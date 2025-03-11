'use client';

import React from 'react';

const AutomataBanner = ({ isDark = false, customThemeColor = '#70D9C2' }) => {
  const themeColor = customThemeColor;

  return (
    <div className={`relative rounded-xl overflow-hidden shadow-xl ${
      isDark ? 'bg-gray-800' : 'bg-white'
    } p-4 w-full`}>
      {/* Automata State Diagram Visualization */}
      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.03); opacity: 0.9; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes dash {
          to { stroke-dashoffset: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes glow {
          0% { filter: drop-shadow(0 0 2px rgba(112, 217, 194, 0.3)); }
          50% { filter: drop-shadow(0 0 5px rgba(112, 217, 194, 0.5)); }
          100% { filter: drop-shadow(0 0 2px rgba(112, 217, 194, 0.3)); }
        }
        .animate-pulse-slow {
          animation: pulse 3s infinite ease-in-out;
        }
        .animate-dash {
          animation: dash 1.5s ease-in-out forwards;
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
        }
        .animate-glow {
          animation: glow 3s infinite ease-in-out;
        }
        .svg-container {
          transform: translateZ(0);
          backface-visibility: hidden;
        }
      `}</style>
      <div className="svg-container">
        <svg viewBox="0 0 600 400" className="w-full h-auto">
          {/* Background Grid */}
          <defs>
            <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke={isDark ? "#2a374a" : "#f0f0f0"} strokeWidth="1"/>
            </pattern>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <linearGradient id="stateGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isDark ? "#2d3748" : "#ffffff"} />
              <stop offset="100%" stopColor={isDark ? "#1a202c" : "#f9fafb"} />
            </linearGradient>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill={themeColor} />
            </marker>
            <marker id="startArrow" markerWidth="12" markerHeight="12" refX="6" refY="6" orient="auto">
              <circle cx="6" cy="6" r="2" fill={themeColor} />
              <path d="M 6 2 L 10 6 L 6 10" fill="none" stroke={themeColor} strokeWidth="2" />
            </marker>
          </defs>
          
          {/* Background */}
          <rect width="100%" height="100%" fill={`url(#grid)`} className="animate-fade-in" style={{ animationDelay: '0.2s' }} />
          
          {/* State Circles */}
          <g className="animate-pulse-slow" style={{ animationDelay: '0.2s' }}>
            {/* Start State q0 */}
            <circle cx="150" cy="200" r="40" fill="url(#stateGradient)" stroke={themeColor} strokeWidth="3" />
            <text x="150" y="200" fontSize="18" fontWeight="bold" fill={isDark ? "#fff" : "#000"} textAnchor="middle" dominantBaseline="middle">q₀</text>
            <circle cx="150" cy="200" r="46" fill="none" stroke={themeColor} strokeWidth="2" strokeDasharray="5,5" className="animate-glow" />
          </g>
          
          <g className="animate-pulse-slow" style={{ animationDelay: '0.5s' }}>
            {/* Middle State q1 */}
            <circle cx="300" cy="200" r="40" fill="url(#stateGradient)" stroke={themeColor} strokeWidth="3" />
            <text x="300" y="200" fontSize="18" fontWeight="bold" fill={isDark ? "#fff" : "#000"} textAnchor="middle" dominantBaseline="middle">q₁</text>
          </g>
          
          <g className="animate-pulse-slow" style={{ animationDelay: '0.8s' }}>
            {/* Accept State q2 */}
            <circle cx="450" cy="200" r="40" fill="url(#stateGradient)" stroke={themeColor} strokeWidth="3" />
            <circle cx="450" cy="200" r="34" fill="none" stroke={themeColor} strokeWidth="2" className="animate-glow" />
            <text x="450" y="200" fontSize="18" fontWeight="bold" fill={isDark ? "#fff" : "#000"} textAnchor="middle" dominantBaseline="middle">q₂</text>
          </g>
          
          {/* Start Arrow */}
          <path 
            d="M 80 200 L 100 200" 
            stroke={themeColor} 
            strokeWidth="2.5"
            markerEnd="url(#arrowhead)"
            className="animate-dash"
            style={{ strokeDasharray: 40, strokeDashoffset: 40, animationDelay: '0.3s' }}
          />
          <text x="80" y="190" fontSize="14" fill={isDark ? "#fff" : "#000"} textAnchor="middle" className="animate-fade-in" style={{ animationDelay: '0.9s' }}>start</text>
          
          {/* Transition: q0 to q1 with '0' */}
          <path 
            d="M 190 200 L 250 200" 
            stroke={themeColor} 
            strokeWidth="2.5" 
            markerEnd="url(#arrowhead)"
            className="animate-dash"
            style={{ strokeDasharray: 60, strokeDashoffset: 60, animationDelay: '1s' }}
          />
          <text x="220" y="190" fontSize="16" fill={isDark ? "#fff" : "#000"} textAnchor="middle" className="animate-fade-in" style={{ animationDelay: '1.4s' }}>0</text>
          
          {/* Transition: q1 to q2 with '1' */}
          <path 
            d="M 340 200 L 400 200" 
            stroke={themeColor} 
            strokeWidth="2.5" 
            markerEnd="url(#arrowhead)"
            className="animate-dash"
            style={{ strokeDasharray: 60, strokeDashoffset: 60, animationDelay: '1.3s' }}
          />
          <text x="370" y="190" fontSize="16" fill={isDark ? "#fff" : "#000"} textAnchor="middle" className="animate-fade-in" style={{ animationDelay: '1.6s' }}>1</text>
          
          {/* Loop transitions */}
          {/* q0 to q1 with '1' - Curved Bottom */}
          <path 
            d="M 150 240 Q 150 300 230 300 Q 310 300 300 240" 
            stroke={themeColor} 
            strokeWidth="2.5" 
            markerEnd="url(#arrowhead)"
            fill="none"
            className="animate-dash"
            style={{ strokeDasharray: 250, strokeDashoffset: 250, animationDelay: '1.6s' }}
          />
          <text x="230" y="320" fontSize="16" fill={isDark ? "#fff" : "#000"} textAnchor="middle" className="animate-fade-in" style={{ animationDelay: '2.1s' }}>1</text>
          
          {/* q1 to q0 with '0' - Curved Top */}
          <path 
            d="M 300 160 Q 300 100 220 100 Q 140 100 150 160" 
            stroke={themeColor} 
            strokeWidth="2.5" 
            markerEnd="url(#arrowhead)"
            fill="none"
            className="animate-dash"
            style={{ strokeDasharray: 250, strokeDashoffset: 250, animationDelay: '1.9s' }}
          />
          <text x="230" y="80" fontSize="16" fill={isDark ? "#fff" : "#000"} textAnchor="middle" className="animate-fade-in" style={{ animationDelay: '2.4s' }}>0</text>
          
          {/* q2 self-loop with '0,1' */}
          <path 
            d="M 480 180 C 530 180 530 220 480 220" 
            stroke={themeColor} 
            strokeWidth="2.5" 
            markerEnd="url(#arrowhead)"
            fill="none"
            className="animate-dash"
            style={{ strokeDasharray: 120, strokeDashoffset: 120, animationDelay: '2.2s' }}
          />
          <text x="520" y="200" fontSize="16" fill={isDark ? "#fff" : "#000"} textAnchor="middle" className="animate-fade-in" style={{ animationDelay: '2.8s' }}>0,1</text>
          
          {/* Animated elements showing automata types */}
          <g className="animate-fade-in" style={{ animationDelay: '3s', opacity: 0 }}>
            {/* Stack visualization for PDA */}
            <rect x="520" y="240" width="30" height="80" fill="none" stroke={themeColor} strokeWidth="1.5" strokeDasharray="4,4" rx="2" />
            <rect x="525" y="290" width="20" height="15" fill={isDark ? 'rgba(112, 217, 194, 0.3)' : 'rgba(112, 217, 194, 0.2)'} stroke={themeColor} strokeWidth="1" rx="1" />
            <rect x="525" y="275" width="20" height="15" fill={isDark ? 'rgba(112, 217, 194, 0.3)' : 'rgba(112, 217, 194, 0.2)'} stroke={themeColor} strokeWidth="1" rx="1" />
            <rect x="525" y="260" width="20" height="15" fill={isDark ? 'rgba(112, 217, 194, 0.3)' : 'rgba(112, 217, 194, 0.2)'} stroke={themeColor} strokeWidth="1" rx="1" />
            <text x="535" y="235" fontSize="10" fill={isDark ? "#fff" : "#000"} textAnchor="middle" className="animate-fade-in" style={{ animationDelay: '3.2s' }}>Stack</text>
          </g>
          
          <g className="animate-fade-in" style={{ animationDelay: '3.3s', opacity: 0 }}>
            {/* Tape visualization for Turing Machine */}
            <rect x="70" y="310" width="200" height="30" fill="none" stroke={themeColor} strokeWidth="1.5" rx="2" />
            <line x1="100" y1="310" x2="100" y2="340" stroke={themeColor} strokeWidth="1" />
            <line x1="130" y1="310" x2="130" y2="340" stroke={themeColor} strokeWidth="1" />
            <line x1="160" y1="310" x2="160" y2="340" stroke={themeColor} strokeWidth="1" />
            <line x1="190" y1="310" x2="190" y2="340" stroke={themeColor} strokeWidth="1" />
            <line x1="220" y1="310" x2="220" y2="340" stroke={themeColor} strokeWidth="1" />
            <line x1="250" y1="310" x2="250" y2="340" stroke={themeColor} strokeWidth="1" />
            <text x="85" y="328" fontSize="12" fill={isDark ? "#fff" : "#000"} textAnchor="middle">0</text>
            <text x="115" y="328" fontSize="12" fill={isDark ? "#fff" : "#000"} textAnchor="middle">1</text>
            <text x="145" y="328" fontSize="12" fill={isDark ? "#fff" : "#000"} textAnchor="middle">0</text>
            <text x="175" y="328" fontSize="12" fill={isDark ? "#fff" : "#000"} textAnchor="middle">1</text>
            <text x="205" y="328" fontSize="12" fill={isDark ? "#fff" : "#000"} textAnchor="middle">_</text>
            <text x="235" y="328" fontSize="12" fill={isDark ? "#fff" : "#000"} textAnchor="middle">_</text>
            <polygon points="145,300 160,310 145,320" fill={themeColor} className="animate-pulse-slow" />
            <text x="170" y="300" fontSize="10" fill={isDark ? "#fff" : "#000"} textAnchor="middle" className="animate-fade-in" style={{ animationDelay: '3.5s' }}>Tape</text>
          </g>
          
          {/* Type of Automaton Labels */}
          <g className="animate-fade-in" style={{ animationDelay: '3.7s', opacity: 0 }}>
            <rect x="300" y="80" width="100" height="25" rx="12.5" fill={isDark ? 'rgba(112, 217, 194, 0.2)' : 'rgba(112, 217, 194, 0.2)'} stroke={themeColor} strokeWidth="1" />
            <text x="350" y="97" fontSize="12" fill={isDark ? "#fff" : "#000"} textAnchor="middle">DFA</text>
            
            <rect x="300" y="110" width="100" height="25" rx="12.5" fill="none" stroke={themeColor} strokeWidth="1" strokeDasharray="3,3" />
            <text x="350" y="127" fontSize="12" fill={isDark ? "#fff" : "#000"} textAnchor="middle" opacity="0.7">NFA</text>
            
            <rect x="410" y="80" width="100" height="25" rx="12.5" fill="none" stroke={themeColor} strokeWidth="1" strokeDasharray="3,3" />
            <text x="460" y="97" fontSize="12" fill={isDark ? "#fff" : "#000"} textAnchor="middle" opacity="0.7">PDA</text>
            
            <rect x="410" y="110" width="100" height="25" rx="12.5" fill="none" stroke={themeColor} strokeWidth="1" strokeDasharray="3,3" />
            <text x="460" y="127" fontSize="12" fill={isDark ? "#fff" : "#000"} textAnchor="middle" opacity="0.7">TM</text>
          </g>
        </svg>
      </div>
      <div className={`mt-4 p-3 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
        <p className="text-sm font-mono">DFA that accepts binary strings ending with &quot;01&quot;</p>
      </div>
    </div>
  );
};

export default AutomataBanner;