import { AlertTriangle } from 'lucide-react';
import Button from './Button';

/**
 * 未保存修改确认弹窗
 * 当用户尝试离开有未保存修改的页面时显示
 */
const UnsavedChangesModal = ({ isOpen, onStay, onLeave }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-md">
      {/* 遮罩层 */}
      <div 
        className="absolute inset-0 bg-gray-8/50 backdrop-blur-sm" 
        onClick={onStay} 
      />
      
      {/* 弹窗内容 */}
      <div className="relative bg-white rounded-xl shadow-strong w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-gray-4">
        <div className="p-lg text-center">
          {/* 警告图标 */}
          <div className="w-16 h-16 mx-auto mb-md rounded-full bg-warning/10 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-warning" />
          </div>
          
          {/* 标题 */}
          <h3 className="text-section text-gray-8 mb-xs">确认离开？</h3>
          
          {/* 描述 */}
          <p className="text-body text-gray-6">
            您有未保存的修改，离开后修改将丢失。
          </p>
        </div>
        
        {/* 按钮组 */}
        <div className="px-lg pb-lg flex items-center justify-center gap-sm">
          <Button 
            variant="secondary" 
            onClick={onLeave}
          >
            离开
          </Button>
          <Button 
            onClick={onStay}
          >
            留在此页
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UnsavedChangesModal;

