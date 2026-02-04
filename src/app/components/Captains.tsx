
import React, { useState } from 'react';
import { Captain, Member } from '../App';
import { Plus, Trash2, Award, Briefcase } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface CaptainsProps {
  captains: Captain[];
  setCaptains: React.Dispatch<React.SetStateAction<Captain[]>>;
  members: Member[];
}

export function Captains({ captains, setCaptains, members }: CaptainsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Omit<Captain, 'id'>>();

  const onSubmit = (data: Omit<Captain, 'id'>) => {
    const newCaptain = {
      ...data,
      id: `c${Date.now()}`
    };
    setCaptains([...captains, newCaptain]);
    reset();
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    // Constraint check: Prevent deleting captains assigned to members
    const assignedMembers = members.filter(m => m.captainId === id);
    if (assignedMembers.length > 0) {
      alert(`Cannot delete captain. They are currently assigned to ${assignedMembers.length} members.`);
      return;
    }

    if (window.confirm('Are you sure you want to delete this captain?')) {
      setCaptains(captains.filter(c => c.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={18} />
          Add Captain
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {captains.map(captain => {
          const assignedMembersCount = members.filter(m => m.captainId === captain.id).length;
          
          return (
            <div key={captain.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-lg">
                  {captain.name.charAt(0)}
                </div>
                <button 
                  onClick={() => handleDelete(captain.id)}
                  className="text-slate-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              
              <h3 className="text-lg font-bold text-slate-800">{captain.name}</h3>
              
              <div className="mt-4 space-y-2 flex-1">
                <div className="flex items-center gap-2 text-slate-600 text-sm">
                  <Award size={16} className="text-purple-500" />
                  <span>{captain.specialization}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 text-sm">
                  <Briefcase size={16} className="text-blue-500" />
                  <span>{captain.experience}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Assigned Members</span>
                  <span className="font-semibold bg-slate-100 px-2 py-1 rounded-md">{assignedMembersCount}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Captain Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">Add New Captain</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input 
                  {...register('name', { required: true })} 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                {errors.name && <span className="text-red-500 text-xs mt-1">Name is required</span>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Specialization</label>
                <input 
                  {...register('specialization', { required: true })} 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. HIIT, Yoga, Strength"
                />
                {errors.specialization && <span className="text-red-500 text-xs mt-1">Specialization is required</span>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Experience</label>
                <input 
                  {...register('experience', { required: true })} 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. 5 years"
                />
                {errors.experience && <span className="text-red-500 text-xs mt-1">Experience is required</span>}
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
                  Add Captain
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
