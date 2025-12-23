const Button = ({ children, variant = 'primary', size = 'md', className, ...props }) => {
  const baseStyle = "font-medium rounded-sm transition-all shadow-sm flex items-center justify-center gap-xs active:scale-95";
  
  const sizes = {
    sm: "px-sm py-xxs text-caption",
    md: "px-md py-xs text-body",
    lg: "px-lg py-sm text-section"
  };

  const variants = {
    primary: "bg-brand text-white hover:bg-brand-hover shadow-[0_2px_0_rgba(43,127,255,0.1)]",
    secondary: "bg-white border border-gray-5 text-text-primary hover:text-brand hover:border-brand",
    add: "bg-white border border-brand text-brand hover:bg-brand-light",
    dashed: "border border-dashed border-gray-5 text-text-secondary hover:text-brand hover:border-brand bg-transparent hover:bg-brand-light",
    danger: "text-error bg-transparent hover:bg-error-light hover:text-error",
    link: "text-text-link bg-transparent hover:text-brand-hover shadow-none p-0"
  };

  return (
    <button 
      className={`${baseStyle} ${sizes[size]} ${variants[variant]} ${className || ''}`} 
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
