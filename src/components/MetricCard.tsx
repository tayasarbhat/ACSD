import React from 'react';

interface MetricCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend?: number;
  color?: string;
}

export function MetricCard({ title, value, icon, trend, color = 'from-indigo-500 to-indigo-600' }: MetricCardProps) {
  return (
    <div className={`rounded-xl shadow-lg p-6 flex flex-col bg-gradient-to-br ${color} border-2 border-white/20 backdrop-blur-sm`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white/90 text-sm font-medium">{title}</h3>
        <span className="text-white/80">{icon}</span>
      </div>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-bold text-white">{value.toLocaleString()}</p>
        {trend && (
          <span className={`text-sm ${trend > 0 ? 'text-green-200' : 'text-red-200'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
    </div>
  );
}