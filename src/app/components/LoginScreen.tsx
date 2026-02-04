
import React from 'react';
import { User as UserIcon, Shield, Trophy, Users } from 'lucide-react';
import { Member, Captain } from '../App';
import logoImg from 'figma:asset/4ca047455aa433a7035e03f5635c40fb0aedd65d.png';

interface User {
  id: string;
  name: string;
  role: 'admin' | 'captain' | 'member';
  email?: string;
}

interface LoginScreenProps {
  members: Member[];
  captains: Captain[];
  onLogin: (user: User) => void;
}

export function LoginScreen({ members, captains, onLogin }: LoginScreenProps) {
  const adminUser: User = { id: 'admin', name: 'System Administrator', role: 'admin', email: 'admin@bbg.com' };

  const handleMemberLogin = (member: Member) => {
    onLogin({
      id: member.id,
      name: member.name,
      role: 'member',
      email: member.email
    });
  };

  const handleCaptainLogin = (captain: Captain) => {
    onLogin({
      id: captain.id,
      name: captain.name,
      role: 'captain',
      email: `${captain.name.toLowerCase().replace(' ', '.')}@bbg.com`
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side - Brand */}
        <div className="bg-slate-800 text-white p-12 md:w-2/5 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-emerald-500 blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-blue-500 blur-3xl"></div>
          </div>
          
          <div className="z-10">
            <div className="flex items-center gap-3 mb-6">
               <img 
                src={logoImg} 
                alt="BBG Logo" 
                className="h-12 w-12 rounded-full object-cover border-2 border-emerald-400"
              />
              <h1 className="text-2xl font-bold tracking-tight text-emerald-400">BBG System</h1>
            </div>
            <p className="text-slate-300 text-lg leading-relaxed">
              Welcome to the Build Your Body at Gym management portal. Please select your account to continue.
            </p>
          </div>
          
          <div className="z-10 text-xs text-slate-500 mt-8">
            &copy; 2026 BBG Systems. All rights reserved.
          </div>
        </div>

        {/* Right Side - Login Options */}
        <div className="p-8 md:p-12 md:w-3/5 bg-gray-50 overflow-y-auto max-h-[80vh]">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Select Account</h2>
          
          <div className="space-y-8">
            
            {/* Admin Section */}
            <section>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Shield size={14} /> Administration
              </h3>
              <button 
                onClick={() => onLogin(adminUser)}
                className="w-full bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all flex items-center gap-4 group"
              >
                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                  <Shield size={20} />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-slate-800">Administrator</div>
                  <div className="text-xs text-slate-500">Full System Access</div>
                </div>
              </button>
            </section>

            {/* Members Section */}
            <section>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Users size={14} /> Members
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {members.map(member => (
                  <button 
                    key={member.id}
                    onClick={() => handleMemberLogin(member)}
                    className="w-full bg-white p-3 rounded-xl shadow-sm border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all flex items-center gap-4 group"
                  >
                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                      <UserIcon size={20} />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-slate-800">{member.name}</div>
                      <div className="text-xs text-slate-500">{member.email}</div>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Captains Section */}
            <section>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Trophy size={14} /> Captains
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {captains.map(captain => (
                  <button 
                    key={captain.id}
                    onClick={() => handleCaptainLogin(captain)}
                    className="w-full bg-white p-3 rounded-xl shadow-sm border border-slate-200 hover:border-purple-500 hover:shadow-md transition-all flex items-center gap-4 group"
                  >
                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-purple-100 group-hover:text-purple-600 transition-colors">
                      <Trophy size={20} />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-slate-800">{captain.name}</div>
                      <div className="text-xs text-slate-500">{captain.specialization}</div>
                    </div>
                  </button>
                ))}
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
