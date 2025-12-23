const TextArea = (props) => (
  <textarea 
    {...props} 
    className={`w-full px-4 py-3 bg-white border border-[#E6E8EB] rounded-lg text-sm text-[#1C1F23] placeholder-[#8A9099] 
    focus:outline-none focus:border-[#2B7FFF] focus:ring-4 focus:ring-[#2B7FFF]/10 transition-all hover:border-[#2B7FFF]/60 resize-none ${props.className || ''}`} 
  />
);

export default TextArea;



