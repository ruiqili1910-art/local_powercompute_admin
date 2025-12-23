import { Save, Clock, AlertCircle } from 'lucide-react';

/**
 * 编辑状态监测栏 - 公共组件
 * 用于编辑类页面（弹窗）的底部状态栏
 * 
 * @param {boolean} isSaving - 是否正在保存
 * @param {boolean} hasLocalChanges - 是否有未保存的修改
 * @param {string} lastSavedTime - 上次保存时间（格式：HH:MM）
 * @param {function} onSave - 保存按钮点击回调
 * @param {function} onHistoryClick - 历史记录按钮点击回调
 * @param {boolean} showHistory - 是否显示历史记录按钮（编辑已有项目时显示）
 * @param {string} saveButtonText - 保存按钮文字，默认 "保存"
 */
const EditorStatusBar = ({
  isSaving = false,
  hasLocalChanges = false,
  lastSavedTime = null,
  onSave,
  onHistoryClick,
  showHistory = false,
  saveButtonText = '保存',
}) => {
  return (
    <div className="flex-shrink-0 mt-4 pt-4 border-t border-gray-3 flex items-center justify-between">
      {/* 左侧：保存状态 */}
      <div className="flex items-center gap-2">
        {isSaving ? (
          <span className="text-sm text-gray-5">保存中...</span>
        ) : hasLocalChanges ? (
          <div className="flex items-center gap-1.5 group/status relative">
            <span className="text-sm text-gray-7">有未保存修改</span>
            <AlertCircle className="w-3.5 h-3.5 text-gray-5" />
            {/* Tooltip */}
            <div className="absolute z-50 left-0 bottom-full mb-2 opacity-0 group-hover/status:opacity-100 pointer-events-none transition-opacity">
              <div className="bg-gray-8 text-white text-xs rounded-lg px-3 py-2 shadow-xl whitespace-pre-line min-w-[200px] leading-relaxed">
                检测到您有新的编辑内容尚未保存。{'\n'}注意：关闭页面将导致修改丢失。
              </div>
              <div className="absolute left-4 top-full border-6 border-transparent border-t-gray-8"></div>
            </div>
          </div>
        ) : lastSavedTime ? (
          <span className="text-sm text-gray-5">已保存于 {lastSavedTime}</span>
        ) : (
          <span className="text-sm text-gray-5">新内容</span>
        )}
      </div>
      
      {/* 右侧：历史记录 + 保存按钮 */}
      <div className="flex items-center gap-2">
        {/* 历史记录按钮 */}
        {showHistory && onHistoryClick && (
          <button
            onClick={onHistoryClick}
            className="flex items-center gap-1.5 px-3 py-2 text-gray-6 hover:text-gray-7 hover:bg-gray-2 rounded-lg text-sm transition-colors"
            title="查看版本历史"
          >
            <Clock className="w-4 h-4" />
            历史记录
          </button>
        )}
        
        {/* 保存按钮 */}
        <button
          onClick={onSave}
          disabled={isSaving || !hasLocalChanges}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            isSaving 
              ? 'bg-gray-3 text-gray-5 cursor-not-allowed'
              : hasLocalChanges
                ? 'bg-brand text-white hover:bg-brand-active animate-breathe'
                : 'bg-gray-3 text-gray-5 cursor-not-allowed'
          }`}
        >
          <Save className="w-4 h-4" />
          {isSaving ? '保存中...' : saveButtonText}
        </button>
      </div>
    </div>
  );
};

export default EditorStatusBar;








