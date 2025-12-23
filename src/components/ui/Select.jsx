const Select = ({ children, className = '', ...props }) => (
  <select 
    {...props} 
    className={`w-full px-4 py-2.5 bg-white border border-[#E6E8EB] rounded-lg text-sm text-[#1C1F23] 
    focus:outline-none focus:border-[#2B7FFF] focus:ring-4 focus:ring-[#2B7FFF]/10 transition-all 
    hover:border-[#2B7FFF]/60 cursor-pointer appearance-none
    [&>option]:bg-white [&>option]:text-[#1C1F23] ${className}`}
  >
    {children}
  </select>
);

export default Select;

