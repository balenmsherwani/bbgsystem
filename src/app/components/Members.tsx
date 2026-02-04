
import React, { useState } from 'react';
import { Member, Captain, Workout } from '../App';
import { Plus, Search, Trash2, Edit2, User, UserCheck } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface MembersProps {
  members: Member[];
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
  captains: Captain[];
  workouts: Workout[];
  setWorkouts: React.Dispatch<React.SetStateAction<Workout[]>>;
}

export function Members({ members, setMembers, captains, workouts, setWorkouts }: MembersProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Omit<Member, 'id'>>();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onSubmit = (data: Omit<Member, 'id'>) => {
    const newMember = {
      ...data,
      id: `m${Date.now()}`
    };
    setMembers([...members, newMember]);
    reset();
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this member? This will also delete their workout history.')) {
      setMembers(members.filter(m => m.id !== id));
      // Cascade delete workouts
      setWorkouts(workouts.filter(w => w.memberId !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search members..." 
            className="pl-10 pr-4 py-2 w-full border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={18} />
          Add Member
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-semibold">Member</th>
              <th className="px-6 py-4 font-semibold">Join Date</th>
              <th className="px-6 py-4 font-semibold">Assigned Captain</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredMembers.map(member => {
              const captain = captains.find(c => c.id === member.captainId);
              return (
                <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                        <User size={20} />
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{member.name}</div>
                        <div className="text-slate-500 text-xs">{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{member.joinDate}</td>
                  <td className="px-6 py-4">
                    {captain ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        <UserCheck size={12} />
                        {captain.name}
                      </span>
                    ) : (
                      <span className="text-red-500 text-xs">Unassigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDelete(member.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-2"
                      title="Delete Member"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
            {filteredMembers.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                  No members found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Member Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">Register New Member</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input 
                  {...register('name', { required: true })} 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. Jane Doe"
                />
                {errors.name && <span className="text-red-500 text-xs mt-1">Name is required</span>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  {...register('email', { required: true })} 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="jane@example.com"
                />
                {errors.email && <span className="text-red-500 text-xs mt-1">Email is required</span>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Join Date</label>
                <input 
                  type="date" 
                  {...register('joinDate', { required: true })} 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                {errors.joinDate && <span className="text-red-500 text-xs mt-1">Date is required</span>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Assign Captain</label>
                <select 
                  {...register('captainId', { required: true })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Select a captain...</option>
                  {captains.map(captain => (
                    <option key={captain.id} value={captain.id}>{captain.name} ({captain.specialization})</option>
                  ))}
                </select>
                {errors.captainId && <span className="text-red-500 text-xs mt-1">Captain is required (Constraint)</span>}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  Register Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
