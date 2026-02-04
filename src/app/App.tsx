
import React, { useState } from 'react';
import { Users, Dumbbell, Activity, Calendar, LayoutDashboard, UserCheck, Plus, Trash2, Search, LogOut, CreditCard } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { Members } from './components/Members';
import { Captains } from './components/Captains';
import { Equipment } from './components/Equipment';
import { Workouts } from './components/Workouts';
import { Payments } from './components/Payments';
import { LoginScreen } from './components/LoginScreen';
import logoImg from 'figma:asset/4ca047455aa433a7035e03f5635c40fb0aedd65d.png';

// Types
export type UserRole = 'admin' | 'captain' | 'member';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email?: string;
}

export type Captain = {
  id: string;
  name: string;
  specialization: string;
  experience: string;
  avatarUrl?: string;
};

export type Member = {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  captainId: string;
};

export type EquipmentItem = {
  id: string;
  name: string;
  type: string;
  condition: 'Good' | 'Fair' | 'Poor';
  quantity: number;
};

export type Workout = {
  id: string;
  memberId: string;
  equipmentId: string;
  date: string;
  sets: number;
  reps: number;
  weight: number;
  duration: number; // minutes
};

export type Payment = {
  id: string;
  memberId: string;
  amount: number;
  startDate: string;
  endDate: string;
  planType: 'Monthly' | 'Quarterly' | 'Yearly';
  status: 'Active' | 'Expired';
};

// Mock Data
const initialCaptains: Captain[] = [
  { id: 'c1', name: 'John Doe', specialization: 'Strength Training', experience: '5 years' },
  { id: 'c2', name: 'Sarah Smith', specialization: 'Cardio & HIIT', experience: '3 years' },
  { id: 'c3', name: 'Mike Johnson', specialization: 'Rehabilitation', experience: '8 years' },
];

const initialMembers: Member[] = [
  { id: 'm1', name: 'Alice Brown', email: 'alice@example.com', joinDate: '2024-01-15', captainId: 'c1' },
  { id: 'm2', name: 'Bob Wilson', email: 'bob@example.com', joinDate: '2024-02-01', captainId: 'c2' },
];

const initialEquipment: EquipmentItem[] = [
  { id: 'e1', name: 'Treadmill 3000', type: 'Cardio', condition: 'Good', quantity: 5 },
  { id: 'e2', name: 'Dumbbell Set', type: 'Weights', condition: 'Good', quantity: 10 },
  { id: 'e3', name: 'Leg Press Machine', type: 'Machine', condition: 'Fair', quantity: 2 },
];

const initialWorkouts: Workout[] = [
  { id: 'w1', memberId: 'm1', equipmentId: 'e2', date: '2024-03-10', sets: 3, reps: 12, weight: 15, duration: 45 },
  { id: 'w2', memberId: 'm2', equipmentId: 'e1', date: '2024-03-11', sets: 1, reps: 1, weight: 0, duration: 30 },
  { id: 'w3', memberId: 'm1', equipmentId: 'e1', date: '2024-03-12', sets: 1, reps: 20, weight: 0, duration: 20 },
  { id: 'w4', memberId: 'm2', equipmentId: 'e3', date: '2024-03-12', sets: 4, reps: 10, weight: 120, duration: 50 },
];

const initialPayments: Payment[] = [
  { id: 'p1', memberId: 'm1', amount: 50, startDate: '2024-03-01', endDate: '2024-04-01', planType: 'Monthly', status: 'Active' },
  { id: 'p2', memberId: 'm2', amount: 500, startDate: '2024-01-01', endDate: '2025-01-01', planType: 'Yearly', status: 'Active' },
];

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'members' | 'captains' | 'equipment' | 'workouts' | 'payments'>('dashboard');
  
  // State for data
  const [captains, setCaptains] = useState<Captain[]>(initialCaptains);
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [equipment, setEquipment] = useState<EquipmentItem[]>(initialEquipment);
  const [workouts, setWorkouts] = useState<Workout[]>(initialWorkouts);
  const [payments, setPayments] = useState<Payment[]>(initialPayments);

  // Filter Data based on Role
  const getVisibleWorkouts = () => {
    if (!currentUser) return [];
    if (currentUser.role === 'admin') return workouts;
    if (currentUser.role === 'member') return workouts.filter(w => w.memberId === currentUser.id);
    if (currentUser.role === 'captain') {
      const myMemberIds = members.filter(m => m.captainId === currentUser.id).map(m => m.id);
      return workouts.filter(w => myMemberIds.includes(w.memberId));
    }
    return [];
  };

  const getVisibleMembers = () => {
    if (!currentUser) return [];
    if (currentUser.role === 'admin') return members;
    if (currentUser.role === 'captain') return members.filter(m => m.captainId === currentUser.id);
    if (currentUser.role === 'member') return members.filter(m => m.id === currentUser.id); 
    return [];
  };

  const getVisiblePayments = () => {
    if (!currentUser) return [];
    if (currentUser.role === 'admin') return payments;
    if (currentUser.role === 'member') return payments.filter(p => p.memberId === currentUser.id);
    // Captains usually don't see payments, but let's allow it for their members if needed, or hide it.
    // For now, let's say Captains can see payments of their members? Or just hide. 
    // Prompt says "Payment list for the members".
    if (currentUser.role === 'captain') return []; // Captains don't manage payments in this scenario
    return [];
  };

  const renderContent = () => {
    const visibleWorkouts = getVisibleWorkouts();
    const visibleMembers = getVisibleMembers();
    const visiblePayments = getVisiblePayments();

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard 
          members={currentUser?.role === 'member' ? visibleMembers : members}
          captains={captains} 
          equipment={equipment} 
          workouts={visibleWorkouts} 
        />;
      case 'members':
        return <Members 
          members={visibleMembers} 
          setMembers={setMembers} 
          captains={captains} 
          workouts={workouts}
          setWorkouts={setWorkouts}
        />;
      case 'captains':
        return <Captains 
          captains={captains} 
          setCaptains={setCaptains} 
          members={members}
        />;
      case 'equipment':
        return <Equipment 
          equipment={equipment} 
          setEquipment={setEquipment} 
          workouts={workouts}
        />;
      case 'workouts':
        return <Workouts 
          workouts={visibleWorkouts} 
          setWorkouts={setWorkouts} 
          members={members} 
          equipment={equipment} 
        />;
      case 'payments':
        return <Payments
          payments={visiblePayments}
          setPayments={setPayments}
          members={members} // Pass all members so Admin can assign any member. For Member role, they can't add payments anyway.
          currentUserRole={currentUser.role}
        />;
      default:
        return <Dashboard members={members} captains={captains} equipment={equipment} workouts={visibleWorkouts} />;
    }
  };

  if (!currentUser) {
    return <LoginScreen members={members} captains={captains} onLogin={setCurrentUser} />;
  }

  const showAdminTabs = currentUser.role === 'admin';
  const showMemberTabs = currentUser.role === 'member';

  return (
    <div className="flex h-screen bg-gray-50 text-slate-900 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <img 
            src={logoImg} 
            alt="BBG Logo" 
            className="h-12 w-12 rounded-full object-cover border-2 border-emerald-400"
          />
          <div>
            <h1 className="text-xl font-bold tracking-tight text-emerald-400 leading-tight">BBG System</h1>
            <p className="text-[10px] text-slate-400">Build Your Body at Gym</p>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <SidebarItem 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
          />
          
          {(showAdminTabs || currentUser.role === 'captain') && (
            <SidebarItem 
              icon={<Users size={20} />} 
              label={currentUser.role === 'captain' ? "My Members" : "Members"} 
              active={activeTab === 'members'} 
              onClick={() => setActiveTab('members')} 
            />
          )}

          {showAdminTabs && (
             <SidebarItem 
              icon={<UserCheck size={20} />} 
              label="Captains" 
              active={activeTab === 'captains'} 
              onClick={() => setActiveTab('captains')} 
            />
          )}
          
          <SidebarItem 
            icon={<Dumbbell size={20} />} 
            label="Equipment" 
            active={activeTab === 'equipment'} 
            onClick={() => setActiveTab('equipment')} 
          />
          
          <SidebarItem 
            icon={<Activity size={20} />} 
            label={currentUser.role === 'member' ? "My Workouts" : "Workouts"} 
            active={activeTab === 'workouts'} 
            onClick={() => setActiveTab('workouts')} 
          />

          {(showAdminTabs || showMemberTabs) && (
            <SidebarItem 
              icon={<CreditCard size={20} />} 
              label={showMemberTabs ? "My Subscription" : "Payments"} 
              active={activeTab === 'payments'} 
              onClick={() => setActiveTab('payments')} 
            />
          )}
        </nav>

        <div className="p-4 border-t border-slate-800">
           <div className="flex items-center gap-3 mb-4">
              <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold border border-emerald-200">
                {currentUser.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium truncate">{currentUser.name}</p>
                <p className="text-xs text-slate-400 capitalize">{currentUser.role}</p>
              </div>
           </div>
           
           <button 
            onClick={() => setCurrentUser(null)}
            className="w-full flex items-center gap-2 text-slate-400 hover:text-white text-xs hover:bg-slate-800 p-2 rounded transition-colors"
           >
             <LogOut size={14} />
             Sign Out
           </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white border-b px-8 py-5 flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-2xl font-semibold capitalize text-slate-800">{activeTab}</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">Wednesday, February 4, 2026</span>
          </div>
        </header>
        
        <main className="p-8 max-w-7xl mx-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        active 
          ? 'bg-emerald-600 text-white shadow-md' 
          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}
