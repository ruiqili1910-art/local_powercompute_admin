import { Save, Plus, History, Clock } from 'lucide-react';

/**
 * 统一的页面 Banner 组件
 * 
 * 使用规则：
 * - 列表管理页/资源库页：使用 buttonIcon="add"，右侧显示"新增"按钮
 * - 配置页面：不显示主按钮，通过 onHistoryClick 显示历史记录入口
 * - 所有页面都可以通过 onHistoryClick 添加历史记录入口
 * 
 * @param {string} title - 页面标题
 * @param {string} description - 页面描述（单行）
 * @param {string} buttonText - 按钮文字
 * @param {function} onButtonClick - 按钮点击事件
 * @param {string} buttonIcon - 按钮图标类型: 'save' | 'add' | 'history'
 * @param {string} buttonVariant - 按钮样式: 'primary' | 'secondary'
 * @param {function} onHistoryClick - 点击历史记录的回调
 */
const PageBanner = ({ 
  title, 
  description, 
  buttonText, 
  onButtonClick,
  buttonIcon = 'add',
  buttonVariant = 'secondary',
  onHistoryClick,
}) => {
  // 根据图标类型设置默认按钮文字和图标
  const getIconComponent = () => {
    switch (buttonIcon) {
      case 'add': return Plus;
      case 'history': return History;
      case 'save': return Save;
      default: return Plus;
    }
  };

  const getDefaultButtonText = () => {
    switch (buttonIcon) {
      case 'add': return '新增';
      case 'history': return '查看历史';
      case 'save': return '保存配置';
      default: return '操作';
    }
  };

  const IconComponent = getIconComponent();
  const displayButtonText = buttonText || getDefaultButtonText();

  // 按钮样式
  const buttonStyles = {
    primary: 'bg-brand hover:bg-brand-active text-white',
    secondary: 'bg-white border border-brand text-brand hover:bg-brand-light'
  };

  return (
    <div className="px-xl py-lg sm:py-0 sm:h-[100px] lg:h-[120px] flex flex-col sm:flex-row sm:items-center relative overflow-hidden gap-sm sm:gap-0">
      {/* 装饰性渐变圆形 - Layer Blur 60px 弥散效果 */}
      <div 
        className="absolute pointer-events-none hidden sm:block"
        style={{
          left: '-29px',
          top: '-123px',
          width: '403px',
          height: '373px',
          borderRadius: '50%',
          background: 'linear-gradient(to bottom right, rgba(91, 143, 255, 0.25), transparent)',
          filter: 'blur(60px)',
        }}
      />
      <div 
        className="absolute pointer-events-none hidden sm:block"
        style={{
          left: '207px',
          top: '-120px',
          width: '333px',
          height: '308px',
          borderRadius: '50%',
          background: 'linear-gradient(to bottom right, rgba(94, 168, 255, 0.25), transparent)',
          filter: 'blur(60px)',
        }}
      />
      
      {/* 内容区域 */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between w-full gap-sm sm:gap-md">
        {/* 左侧文字区域 */}
        <div className="flex-1 min-w-0">
          <h1 className="text-title text-gray-8 truncate sm:whitespace-normal">
            {title}
          </h1>
          <p className="mt-xs text-body text-gray-7 line-clamp-2 sm:whitespace-nowrap sm:truncate">
            {description}
          </p>
        </div>
        
        {/* 右侧操作区 */}
        <div className="flex items-center gap-sm flex-shrink-0 w-full sm:w-auto">
          {/* 历史记录入口 */}
          {onHistoryClick && (
            <button
              onClick={onHistoryClick}
              className="flex items-center gap-1 px-2 py-1.5 text-gray-6 text-caption hover:bg-gray-3 hover:text-gray-7 rounded transition-colors"
              title="查看历史记录"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>历史记录</span>
            </button>
          )}

          {/* 主按钮 */}
          {onButtonClick && (
            <button 
              onClick={onButtonClick}
              className={`flex items-center justify-center gap-xs px-md py-xs rounded-sm transition-colors flex-1 sm:flex-initial ${buttonStyles[buttonVariant]}`}
            >
              <IconComponent className="w-4 h-4" />
              <span className="text-body font-medium">
                {displayButtonText}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageBanner;
