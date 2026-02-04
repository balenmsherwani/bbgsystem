
import React, { useState } from 'react';
import { Payment, Member } from '../App';
import { Plus, Search, CreditCard, Calendar, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface PaymentsProps {
  payments: Payment[];
  setPayments: React.Dispatch<React.SetStateAction<Payment[]>>;
  members: Member[];
  currentUserRole: 'admin' | 'captain' | 'member';
}

export function Payments({ payments, setPayments, members, currentUserRole }: PaymentsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<Omit<Payment, 'id' | 'status'>>();
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate end date based on plan
  const planType = watch('planType');
  const startDate = watch('startDate');

  React.useEffect(() => {
    if (planType && startDate) {
      const start = new Date(startDate);
      let end = new Date(start);
      if (planType === 'Monthly') {
        end.setMonth(end.getMonth() + 1);
      } else if (planType === 'Yearly') {
        end.setFullYear(end.getFullYear() + 1);
      } else if (planType === 'Quarterly') {
        end.setMonth(end.getMonth() + 3);
      }
      setValue('endDate', end.toISOString().split('T')[0]);
    }
  }, [planType, startDate, setValue]);

  const filteredPayments = payments.filter(p => {
    const member = members.find(m => m.id === p.memberId);
    const searchString = searchTerm.toLowerCase();
    return (
      member?.name.toLowerCase().includes(searchString) ||
      p.planType.toLowerCase().includes(searchString)
    );
  });

  const onSubmit = (data: Omit<Payment, 'id' | 'status'>) => {
    const newPayment: Payment = {
      ...data,
      id: `p${Date.now()}`,
      amount: Number(data.amount),
      status: 'Active' // Default to active for new payments
    };
    setPayments([newPayment, ...payments]);
    reset();
    setIsModalOpen(false);
  };

  const getStatusColor = (endDateStr: string) => {
    const end = new Date(endDateStr);
    const now = new Date();
    // Reset time for accurate date comparison
    now.setHours(0,0,0,0);
    
    if (end < now) return 'bg-gray-100 text-gray-500 border-gray-200'; // Expired
    
    const daysUntilExpire = Math.ceil((end.getTime() - now.getTime()) / (1000 * 3600 * 24));
    if (daysUntilExpire <= 7) return 'bg-amber-50 text-amber-700 border-amber-200'; // Expiring soon
    
    return 'bg-emerald-50 text-emerald-700 border-emerald-200'; // Active
  };

  const getStatusText = (endDateStr: string) => {
    const end = new Date(endDateStr);
    const now = new Date();
    now.setHours(0,0,0,0);

    if (end < now) return 'Expired';
    return 'Active';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search payments..." 
            className="pl-10 pr-4 py-2 w-full border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {currentUserRole === 'admin' && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={18} />
            New Subscription
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-semibold">Member</th>
              <th className="px-6 py-4 font-semibold">Plan</th>
              <th className="px-6 py-4 font-semibold">Duration</th>
              <th className="px-6 py-4 font-semibold">Amount</th>
              <th className="px-6 py-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredPayments.map(payment => {
              const member = members.find(m => m.id === payment.memberId);
              const statusClass = getStatusColor(payment.endDate);
              const statusText = getStatusText(payment.endDate);

              return (
                <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                        <CreditCard size={16} />
                      </div>
                      <span className="font-medium text-slate-900">{member?.name || 'Unknown Member'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-slate-700">{payment.planType}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    <div className="flex flex-col text-xs">
                      <span className="flex items-center gap-1">
                        <span className="w-12 text-slate-400">Start:</span> {payment.startDate}
                      </span>
                      <span className="flex items-center gap-1 font-medium text-slate-700">
                        <span className="w-12 text-slate-400 font-normal">End:</span> {payment.endDate}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">
                    ${payment.amount}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusClass}`}>
                      {statusText === 'Active' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                      {statusText}
                    </span>
                  </td>
                </tr>
              );
            })}
            {filteredPayments.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                  No payment records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* New Subscription Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">New Subscription Payment</h3>
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
                <label className="block text-sm font-medium text-slate-700 mb-1">Plan Type</label>
                <select 
                  {...register('planType', { required: true })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Select Plan...</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Yearly">Yearly</option>
                </select>
                {errors.planType && <span className="text-red-500 text-xs mt-1">Plan is required</span>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Amount ($)</label>
                    <input 
                      type="number"
                      {...register('amount', { required: true, min: 0 })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="0.00"
                    />
                    {errors.amount && <span className="text-red-500 text-xs mt-1">Required</span>}
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                    <input 
                      type="date"
                      defaultValue={new Date().toISOString().split('T')[0]}
                      {...register('startDate', { required: true })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">End Date (Auto-calculated)</label>
                <input 
                  type="date"
                  {...register('endDate', { required: true })}
                  readOnly
                  className="w-full px-3 py-2 border border-slate-200 bg-slate-50 text-slate-500 rounded-lg focus:outline-none cursor-not-allowed"
                />
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
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
