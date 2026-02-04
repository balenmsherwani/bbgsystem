
import React from 'react';
import { Users, UserCheck, Dumbbell, Activity, TrendingUp } from 'lucide-react';
import { Member, Captain, EquipmentItem, Workout } from '../App';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DashboardProps {
  members: Member[];
  captains: Captain[];
  equipment: EquipmentItem[];
  workouts: Workout[];
}

export function Dashboard({ members, captains, equipment, workouts }: DashboardProps) {
  // Stats
  const stats = [
    { label: 'Total Members', value: members.length, icon: <Users className="text-blue-500" />, color: 'bg-blue-50' },
    { label: 'Active Captains', value: captains.length, icon: <UserCheck className="text-purple-500" />, color: 'bg-purple-50' },
    { label: 'Equipment Count', value: equipment.reduce((acc, curr) => acc + curr.quantity, 0), icon: <Dumbbell className="text-orange-500" />, color: 'bg-orange-50' },
    { label: 'Total Workouts', value: workouts.length, icon: <Activity className="text-emerald-500" />, color: 'bg-emerald-50' },
  ];

  // Chart Data
  const workoutsByDate = workouts.reduce((acc: any, workout) => {
    const date = workout.date;
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const barChartData = Object.keys(workoutsByDate).map(date => ({
    name: date,
    workouts: workoutsByDate[date]
  }));

  const equipmentStatus = equipment.reduce((acc: any, item) => {
    acc[item.condition] = (acc[item.condition] || 0) + 1;
    return acc;
  }, {});

  const pieChartData = Object.keys(equipmentStatus).map(status => ({
    name: status,
    value: equipmentStatus[status]
  }));

  const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-1">{stat.value}</h3>
            </div>
            <div className={`p-3 rounded-lg ${stat.color}`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <TrendingUp size={20} className="text-emerald-500" />
            Workout Activity
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                />
                <Bar dataKey="workouts" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Equipment Condition</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2">
              {pieChartData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  {entry.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
