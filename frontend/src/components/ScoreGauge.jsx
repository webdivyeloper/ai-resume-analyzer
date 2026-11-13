import React from 'react';

const ScoreGauge = ({ score = 0, size = 160 }) => {
  const normalizedScore = Math.min(100, Math.max(0, Math.round(score)));
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  let strokeColor = '#b91c1c'; // red-700
  let label = 'Low Alignment';
  let badgeStyle = 'text-rose-700 bg-rose-50 border-rose-200';

  if (normalizedScore >= 75) {
    strokeColor = '#15803d'; // green-700
    label = 'Strong ATS Match';
    badgeStyle = 'text-emerald-800 bg-emerald-50 border-emerald-200';
  } else if (normalizedScore >= 55) {
    strokeColor = '#b45309'; // amber-700
    label = 'Moderate Match';
    badgeStyle = 'text-amber-800 bg-amber-50 border-amber-200';
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="butt"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-bold font-mono text-slate-900 tracking-tight">
            {normalizedScore}
            <span className="text-sm font-normal text-slate-500">%</span>
          </span>
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
            ATS Score
          </span>
        </div>
      </div>

      <div className={`mt-3 px-2.5 py-0.5 rounded text-[11px] font-medium border ${badgeStyle}`}>
        {label}
      </div>
    </div>
  );
};

export default ScoreGauge;
