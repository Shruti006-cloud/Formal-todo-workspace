export const getPriorityBadgeStyles = (priority) => {
  switch (priority) {
    case 'High':
      return 'bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]';
    case 'Medium':
      return 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]';
    case 'Low':
      return 'bg-[#DBEAFE] text-[#1E40AF] border-[#BFDBFE]';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
};

export const formatDate = (dateString) => {
  if (!dateString) return 'No due date';
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};