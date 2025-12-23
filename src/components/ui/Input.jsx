const Input = (props) => (
  <input 
    {...props} 
    className={`w-full px-sm py-xs bg-white border border-gray-4 rounded-sm 
    text-body text-text-primary placeholder:text-text-placeholder
    focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 
    transition-all hover:border-brand/60 
    disabled:bg-gray-2 disabled:text-text-disabled disabled:cursor-not-allowed
    ${props.className || ''}`} 
  />
);

export default Input;
