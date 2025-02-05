import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, Users, Calendar, ChevronLeft, Search } from 'lucide-react';
import { MetricCard } from './components/MetricCard';
import { DataTable } from './components/DataTable';
import { fetchMonthData } from './utils/api';
import type { MonthData } from './types';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function App() {
  const [currentMonth, setCurrentMonth] = useState(months[new Date().getMonth()]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [data, setData] = useState<MonthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const monthData = await fetchMonthData(currentMonth);
        setData(monthData);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentMonth]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-white"></div>
      </div>
    );
  }

  const monthlyColumns = [
    { key: 'empId', label: 'Emp ID' },
    { key: 'agentName', label: 'Agent Name' },
    { key: 'silver', label: 'Silver' },
    { key: 'gold', label: 'Gold' },
    { key: 'platinum', label: 'Platinum' },
    { key: 'standard', label: 'Standard' },
    { key: 'target', label: 'Target' },
    { key: 'achieved', label: 'Achieved' },
    { key: 'remaining', label: 'Remaining' },
  ];

  const dailyColumns = [
    { key: 'empId', label: 'Emp ID' },
    { key: 'agentName', label: 'Agent Name' },
    { key: 'silver', label: 'Silver' },
    { key: 'gold', label: 'Gold' },
    { key: 'platinum', label: 'Platinum' },
    { key: 'standard', label: 'Standard' },
    { key: 'total', label: 'Total' },
  ];

  const availableDates = data ? Object.keys(data.daily).sort() : [];

  const filteredMonthlyData = data?.monthly.filter(agent => 
    agent.agentName.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Activation Dashboard</h1>
          <div className="flex flex-wrap gap-4 items-center">
            <select
              value={currentMonth}
              onChange={(e) => {
                setCurrentMonth(e.target.value);
                setSelectedDate(null);
              }}
              className="px-4 py-2 rounded-lg border-2 border-white/20 bg-white/10 text-white backdrop-blur-sm focus:border-white/40 focus:outline-none"
            >
              {months.map((month) => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
            
            {!selectedDate && (
              <>
                <select
                  value={selectedDate || ''}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-4 py-2 rounded-lg border-2 border-white/20 bg-white/10 text-white backdrop-blur-sm focus:border-white/40 focus:outline-none"
                >
                  <option value="">Select Date</option>
                  {availableDates.map((date) => (
                    <option key={date} value={date}>{date}</option>
                  ))}
                </select>

                <div className="relative flex-1 max-w-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-white/60" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by agent name..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-white/20 bg-white/10 text-white placeholder-white/60 backdrop-blur-sm focus:border-white/40 focus:outline-none"
                  />
                </div>
              </>
            )}

            {selectedDate && (
              <button
                onClick={() => setSelectedDate(null)}
                className="px-4 py-2 flex items-center gap-2 rounded-lg bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm border-2 border-white/20"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to Monthly View
              </button>
            )}
          </div>
        </div>

        {data && !selectedDate && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <MetricCard
                title="Total Target"
                value={filteredMonthlyData.reduce((sum, item) => sum + item.target, 0)}
                icon={<Target className="h-6 w-6" />}
                color="from-blue-500 to-blue-600"
              />
              <MetricCard
                title="Total Achieved"
                value={filteredMonthlyData.reduce((sum, item) => sum + item.achieved, 0)}
                icon={<TrendingUp className="h-6 w-6" />}
                color="from-green-500 to-green-600"
              />
              <MetricCard
                title="Total Remaining"
                value={filteredMonthlyData.reduce((sum, item) => sum + item.remaining, 0)}
                icon={<Calendar className="h-6 w-6" />}
                color="from-amber-500 to-amber-600"
              />
              <MetricCard
                title="Total Agents"
                value={filteredMonthlyData.length}
                icon={<Users className="h-6 w-6" />}
                color="from-purple-500 to-purple-600"
              />
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-lg p-6 border-2 border-white/20">
              <h2 className="text-xl font-semibold mb-4 text-white">Monthly Overview</h2>
              <DataTable
                data={filteredMonthlyData}
                columns={monthlyColumns}
              />
            </div>
          </>
        )}

        {data && selectedDate && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-lg p-6 border-2 border-white/20">
            <h2 className="text-xl font-semibold mb-4 text-white">Daily Data: {selectedDate}</h2>
            <DataTable
              data={data.daily[selectedDate] || []}
              columns={dailyColumns}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;