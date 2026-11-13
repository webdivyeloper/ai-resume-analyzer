import React from 'react';

const ScoreGauge = ({ score = 0, size = 180 }) => {
  const normalizedScore = Math.min(100, Math.max(0, Math.round(score)));
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  let color = '#ef4444'; // red
  let bgColor = 'text-red-500';
  let badgeText = 'Needs Work';
  let badgeBg = 'bg-red-50 text-red-700 border-red-200';

  if (normalizedScore >= 80) {
    color = '#10b981'; // emerald
    bgColor = 'text-emerald-500';
    badgeText = 'Strong Match';
    badgeBg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  } else if (normalizedScore >= 60) {
    color = '#f59e0b'; // amber
    bgColor = 'text-amber-500';
    badgeText = 'Moderate Match';
    badgeBg = 'bg-amber-50 text-amber-700 border-amber-200';
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center score readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-black tracking-tight text-slate-800">
            {normalizedScore}
            <span className="text-xl font-normal text-slate-400">%</span>
          </span>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
            ATS Score
          </span>
        </div>
      </div>

      <div className={`mt-3 px-3 py-1 rounded-full text-xs font-semibold border ${badgeBg}`}>
        {badgeText}
      </div>
    </div>
  );
};

export default ScoreGauge;
