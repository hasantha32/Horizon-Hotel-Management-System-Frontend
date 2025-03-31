const PriorityColor = (status: string) => {
  let statusColor = '';
  if (status?.toLowerCase() === 'high') {
    statusColor = 'bg-[#61A0FF]/10 text-[#61A0FF]';
  } else if (status?.toLowerCase() === 'medium') {
    statusColor = 'bg-[#FFAA2C]/10 text-[#f69e1a]';
  } else {
    statusColor = 'bg-[#FFD361]/10 text-yellow-500';
  }

  return statusColor;
};

export default PriorityColor;
