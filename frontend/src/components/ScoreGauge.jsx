import React from 'react';

const ScoreGauge = ({ score = 0, size = 180 }) => {
  const normalizedScore = Math.min(100, Math.max(0, Math.round(score)));
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  let gradientId = 'grad-emerald';
  let startColor = '#10b981';
  let endColor = '#059669';
  let badgeLabel = 'Strong ATS Match';
  let badgeStyle = 'bg-emerald-50 text-emerald-800 border-emerald-200';
  let scoreTextColor = 'text-emerald-700';

  if (normalizedScore < 60) {
    gradientId = 'grad-rose';
    startColor = '#f43f5e';
    endColor = '#e11d48';
    badgeLabel = 'Needs Revision';
    badgeStyle = 'bg-rose-50 text-rose-800 border-rose-200';
    scoreTextColor = 'text-rose-700';
  } else if (normalizedScore < 80) {
    gradientId = 'grad-amber';
    startColor = '#f59e0b';
    endColor = '#d97706';
    badgeLabel = 'Moderate Match';
    badgeStyle = 'bg-amber-50 text-amber-800 border-amber-200';
    scoreTextColor = 'text-amber-700';
  }

  return (
    <div className="flex flex-col items-center justify-center select-none">
      <div className="relative group cursor-pointer" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={startColor} />
              <stop offset="100%" stopColor={endColor} />
            </linearGradient>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
            </filter>
          </defs>

          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          {/* Animated Gauge Value */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            filter="url(#shadow)"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`text-4xl font-extrabold tracking-tight font-mono ${scoreTextColor}`}>
            {normalizedScore}
            <span className="text-xl font-medium text-slate-400">%</span>
          </span>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
            ATS Score
          </span>
        </div>
      </div>

      <div className={`mt-3 px-3 py-1 rounded-full text-xs font-semibold border ${badgeStyle} shadow-xs`}>
        {badgeLabel}
      </div>
    </div>
  );
};

export default ScoreGauge;
