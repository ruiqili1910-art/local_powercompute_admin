const FormItem = ({ label, required, hint, children }) => (
  <div className="flex flex-col gap-xs">
    {label && (
      <label className="text-body font-medium text-text-primary flex items-center gap-xxs">
        {label}
        {required && <span className="text-error">*</span>}
      </label>
    )}
    {children}
    {hint && <p className="text-caption text-text-placeholder">{hint}</p>}
  </div>
);

export default FormItem;
