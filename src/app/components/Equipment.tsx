
import React, { useState } from 'react';
import { EquipmentItem, Workout } from '../App';
import { Plus, Trash2, Activity, Box } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface EquipmentProps {
  equipment: EquipmentItem[];
  setEquipment: React.Dispatch<React.SetStateAction<EquipmentItem[]>>;
  workouts: Workout[];
}

export function Equipment({ equipment, setEquipment, workouts }: EquipmentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Omit<EquipmentItem, 'id'>>();

  const onSubmit = (data: Omit<EquipmentItem, 'id'>) => {
    const newItem = {
      ...data,
      id: `e${Date.now()}`,
      quantity: Number(data.quantity)
    };
    setEquipment([...equipment, newItem]);
    reset();
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    // Constraint: Prevent deleting equipment used in workouts (or warn)
    // For simplicity, we'll warn. Real database would restrict.
    const isUsed = workouts.some(w => w.equipmentId === id);
    if (isUsed) {
        alert('Cannot delete this equipment because it is referenced in past workouts.');
        return;
    }

    if (window.confirm('Are you sure you want to delete this equipment?')) {
      setEquipment(equipment.filter(e => e.id !== id));
    }
  };

  const getConditionColor = (condition: string) => {
    switch(condition) {
      case 'Good': return 'bg-emerald-100 text-emerald-700';
      case 'Fair': return 'bg-yellow-100 text-yellow-700';
      case 'Poor': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
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
          Register Equipment
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-semibold">Equipment Name</th>
              <th className="px-6 py-4 font-semibold">Type</th>
              <th className="px-6 py-4 font-semibold">Quantity</th>
              <th className="px-6 py-4 font-semibold">Condition</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {equipment.map(item => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{item.name}</td>
                <td className="px-6 py-4 text-slate-600">{item.type}</td>
                <td className="px-6 py-4 text-slate-600">{item.quantity}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(item.condition)}`}>
                    {item.condition}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {equipment.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                  No equipment registered.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Equipment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">Register Equipment</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Equipment Name</label>
                <input 
                  {...register('name', { required: true })} 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                {errors.name && <span className="text-red-500 text-xs mt-1">Name is required</span>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                <select 
                  {...register('type', { required: true })} 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Select Type...</option>
                  <option value="Cardio">Cardio</option>
                  <option value="Weights">Weights</option>
                  <option value="Machine">Machine</option>
                  <option value="Accessory">Accessory</option>
                </select>
                {errors.type && <span className="text-red-500 text-xs mt-1">Type is required</span>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
                <input 
                  type="number"
                  {...register('quantity', { required: true, min: 1 })} 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                {errors.quantity && <span className="text-red-500 text-xs mt-1">Quantity is required</span>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Condition</label>
                <select 
                  {...register('condition', { required: true })} 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </select>
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
                  Save Equipment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
