import { X, Monitor } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, footer, fullScreen = false, size = 'md' }) => {
  if (!isOpen) return null;
  
  // 尺寸映射
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl',
    '2xl': 'max-w-6xl',
    '4xl': 'max-w-[1100px]'
  };
  
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="px-xl py-md border-b border-gray-4 flex justify-between items-center bg-white sticky top-0 z-10 shadow-light">
          <h3 className="text-section text-text-primary flex items-center gap-xs">
            <Monitor className="w-5 h-5 text-brand"/> 
            <span className="truncate">{title}</span>
          </h3>
          <div className="flex items-center gap-sm">
             <span className="hidden sm:inline text-caption text-text-placeholder mr-md">按 Esc 退出预览</span>
             <button onClick={onClose} className="p-xs rounded-full hover:bg-gray-3 text-text-secondary transition-colors border border-gray-4">
               <X className="w-5 h-5" />
             </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-gray-3">
           {children}
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-xs sm:p-md">
      <div className="absolute inset-0 bg-gray-8/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className={`relative bg-white rounded-lg sm:rounded-xl shadow-strong w-full max-w-[95vw] sm:${sizeClasses[size] || sizeClasses.md} overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[95vh] sm:max-h-[90vh] border border-gray-4`}>
        <div className="px-lg py-md border-b border-gray-4 flex justify-between items-center bg-white sticky top-0 z-10">
          <h3 className="text-section text-text-primary truncate pr-md">{title}</h3>
          <button onClick={onClose} className="p-xs rounded-md hover:bg-gray-3 text-text-secondary hover:text-text-primary transition-colors flex-shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-lg overflow-y-auto custom-scrollbar">{children}</div>
        {footer && (
          <div className="bg-gray-2 px-lg py-md flex flex-col sm:flex-row justify-end gap-xs sm:gap-sm border-t border-gray-4 sticky bottom-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
