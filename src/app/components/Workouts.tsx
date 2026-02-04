
import React, { useState } from 'react';
import { Workout, Member, EquipmentItem } from '../App';
import { Plus, Trash2, Calendar, Timer, Dumbbell } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface WorkoutsProps {
  workouts: Workout[];
  setWorkouts: React.Dispatch<React.SetStateAction<Workout[]>>;
  members: Member[];
  equipment: EquipmentItem[];
}

export function Workouts({ workouts, setWorkouts, members, equipment }: WorkoutsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Omit<Workout, 'id'>>();

  const onSubmit = (data: Omit<Workout, 'id'>) => {
    const newWorkout = {
      ...data,
      id: `w${Date.now()}`,
      sets: Number(data.sets),
      reps: Number(data.reps),
      weight: Number(data.weight),
      duration: Number(data.duration)
    };
    setWorkouts([newWorkout, ...workouts]);
    reset();
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this workout record?')) {
      setWorkouts(workouts.filter(w => w.id !== id));
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
          Record Workout
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <h3 className="font-semibold text-slate-700">Recent Workouts</h3>
            <span className="text-xs text-slate-500">{workouts.length} Records</span>
        </div>
        <div className="divide-y divide-slate-100">
            {workouts.map(workout => {
                const member = members.find(m => m.id === workout.memberId);
                const equip = equipment.find(e => e.id === workout.equipmentId);
                
                return (
                    <div key={workout.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-slate-900">{member?.name || 'Unknown Member'}</span>
                                <span className="text-slate-400 text-xs">•</span>
                                <span className="text-sm text-slate-600">{workout.date}</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-500">
                                <div className="flex items-center gap-1.5">
                                    <Dumbbell size={14} className="text-emerald-500"/>
                                    <span>{equip?.name || 'Unknown Equipment'}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Timer size={14} className="text-blue-500"/>
                                    <span>{workout.duration} min</span>
                                </div>
                                <div>
                                    <span className="font-medium text-slate-700">{workout.sets}</span> sets × <span className="font-medium text-slate-700">{workout.reps}</span> reps @ <span className="font-medium text-slate-700">{workout.weight}kg</span>
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={() => handleDelete(workout.id)}
                            className="text-slate-300 hover:text-red-500 transition-colors p-2"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                );
            })}
            {workouts.length === 0 && (
                <div className="p-12 text-center text-slate-400">
                    No workout records found. Start recording workouts!
                </div>
            )}
        </div>
      </div>

      {/* Record Workout Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Record Workout Session</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Member</label>
                <select 
                  {...register('memberId', { required: true })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Select Member...</option>
                  {members.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
                {errors.memberId && <span className="text-red-500 text-xs mt-1">Member is required</span>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Equipment Used</label>
                <select 
                  {...register('equipmentId', { required: true })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Select Equipment...</option>
                  {equipment.map(e => (
                    <option key={e.id} value={e.id}>{e.name} ({e.type})</option>
                  ))}
                </select>
                {errors.equipmentId && <span className="text-red-500 text-xs mt-1">Equipment is required</span>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                <input 
                  type="date"
                  defaultValue={new Date().toISOString().split('T')[0]}
                  {...register('date', { required: true })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Sets</label>
                    <input 
                      type="number"
                      {...register('sets', { required: true, min: 1 })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Reps</label>
                    <input 
                      type="number"
                      {...register('reps', { required: true, min: 1 })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Weight (kg)</label>
                    <input 
                      type="number"
                      {...register('weight', { required: true, min: 0 })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Duration (min)</label>
                    <input 
                      type="number"
                      {...register('duration', { required: true, min: 1 })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
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
                  Record Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
