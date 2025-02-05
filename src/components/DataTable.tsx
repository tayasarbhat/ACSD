import React from 'react';
import { 
  BadgeIndianRupee, 
  User, 
  UserCircle, 
  CircleDollarSign, 
  Award, 
  Crown, 
  Shield, 
  Target, 
  TrendingUp, 
  ArrowDownToLine,
  Calculator
} from 'lucide-react';

interface DataTableProps {
  data: any[];
  columns: { key: string; label: string }[];
}

const getColumnIcon = (key: string) => {
  const icons = {
    empId: <User className="h-4 w-4" />,
    agentName: <UserCircle className="h-4 w-4" />,
    silver: <CircleDollarSign className="h-4 w-4" />,
    gold: <Award className="h-4 w-4" />,
    platinum: <Crown className="h-4 w-4" />,
    standard: <Shield className="h-4 w-4" />,
    target: <Target className="h-4 w-4" />,
    achieved: <TrendingUp className="h-4 w-4" />,
    remaining: <ArrowDownToLine className="h-4 w-4" />,
    total: <Calculator className="h-4 w-4" />
  };
  return icons[key as keyof typeof icons] || <BadgeIndianRupee className="h-4 w-4" />;
};

const getColumnColor = (key: string) => {
  const colors = {
    agentName: 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white',
    silver: 'bg-gradient-to-r from-gray-400/20 to-gray-300/20 text-gray-200',
    gold: 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-200',
    platinum: 'bg-gradient-to-r from-indigo-500/20 to-violet-500/20 text-indigo-200',
    standard: 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-200',
    target: 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-200',
    achieved: 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-200',
    remaining: 'bg-gradient-to-r from-red-500/20 to-rose-500/20 text-red-200'
  };
  return colors[key as keyof typeof colors] || '';
};

const getHeaderColor = (key: string) => {
  const colors = {
    agentName: 'text-blue-200',
    silver: 'text-gray-200',
    gold: 'text-yellow-200',
    platinum: 'text-indigo-200',
    standard: 'text-emerald-200',
    target: 'text-blue-200',
    achieved: 'text-green-200',
    remaining: 'text-red-200'
  };
  return colors[key as keyof typeof colors] || 'text-white/80';
};

export function DataTable({ data, columns }: DataTableProps) {
  const calculateColumnTotal = (key: string) => {
    if (['empId', 'agentName'].includes(key)) return '';
    return data.reduce((sum, row) => sum + (Number(row[key]) || 0), 0).toLocaleString();
  };

  return (
    <div className="overflow-x-auto rounded-xl">
      <table className="min-w-full divide-y divide-white/10">
        <thead>
          <tr className="bg-white/5">
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${getHeaderColor(column.key)}`}
              >
                <div className="flex items-center gap-2">
                  {getColumnIcon(column.key)}
                  {column.label}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {data.map((row, index) => (
            <tr key={index} className="transition-colors hover:bg-white/5">
              {columns.map((column) => (
                <td 
                  key={column.key} 
                  className={`px-6 py-4 whitespace-nowrap text-sm ${getColumnColor(column.key)}`}
                >
                  {typeof row[column.key] === 'number' 
                    ? row[column.key].toLocaleString()
                    : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
          {/* Totals Row */}
          <tr className="bg-white/10 font-semibold">
            {columns.map((column) => (
              <td
                key={`total-${column.key}`}
                className={`px-6 py-4 whitespace-nowrap text-sm ${getHeaderColor(column.key)}`}
              >
                {column.key === 'empId' ? (
                  <div className="flex items-center gap-2">
                    <Calculator className="h-4 w-4" />
                    Totals
                  </div>
                ) : calculateColumnTotal(column.key)}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}