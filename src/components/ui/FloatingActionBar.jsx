import { useState } from 'react';
import { Save, Upload, Loader2, AlertCircle } from 'lucide-react';

// ==================== 状态配置 ====================
// 统一的状态配置，供 FloatingActionBar 和 StatusChip 复用
const STATUS_CONFIG = {
  // 🟡 未上线态 - 草稿（仅文章页面使用）
  draft: {
    label: '未上线',
    chipClass: 'bg-[#FEF9C3] text-[#CA8A04]',
    dotClass: 'bg-warning',
    helpText: '内容尚未发布',
    helpClass: 'text-warning',
    saveDisabled: false,
    publishDisabled: false,
    saveHighlight: false,
    publishHighlight: true,
    tooltip: {
      article: '当前内容尚未发布至官网，请在编辑完成后点击"发布"',
      config: null
    }
  },
  // 🟢 完美同步态 - 已上线/已发布
  published: {
    label: '已上线',
    chipClass: 'bg-[#DCFCE7] text-[#16A34A]',
    dotClass: 'bg-success',
    helpText: '当前版本已上线',
    helpClass: 'text-gray-5',
    saveDisabled: false,
    publishDisabled: true,
    saveHighlight: false,
    publishHighlight: false,
    tooltip: null
  },
  // 🔵 待更新/待同步态 - 有未发布的修改（蓝色）
  pending: {
    label: {
      article: '待更新',  // 文章页显示"待更新"
      config: '待同步'    // 配置页显示"待同步"
    },
    chipClass: 'bg-[#DBEAFE] text-[#2563EB]',
    dotClass: 'bg-brand',
    helpText: '有未发布变更',
    helpClass: 'text-brand',
    saveDisabled: true,
    publishDisabled: false,
    saveHighlight: false,
    publishHighlight: true,
    tooltip: {
      article: '本地有未发布的修改，请点击"更新"以同步至官网',
      config: '本地配置已保存，请点击"发布更新"以生效至官网'
    }
  },
  // 🟡 未保存态 - 正在编辑中（黄色）
  unsaved: {
    label: '有未保存修改',
    chipClass: 'bg-warning/15 text-warning',
    dotClass: 'bg-warning',
    helpText: '请保存以免丢失',
    helpClass: 'text-warning',
    saveDisabled: false,
    publishDisabled: true,
    saveHighlight: true,
    publishHighlight: false,
    tooltip: {
      article: '检测到您有新的编辑内容尚未保存。\n注意：此时刷新页面或关闭浏览器将导致修改丢失。',
      config: '检测到您有新的编辑内容尚未保存。\n注意：此时刷新页面或关闭浏览器将导致修改丢失。'
    }
  },
  // 保存中
  saving: {
    label: '保存中',
    chipClass: 'bg-gray-4 text-gray-6',
    dotClass: 'bg-gray-5',
    helpText: null,
    saveDisabled: true,
    publishDisabled: true,
    saveHighlight: false,
    publishHighlight: false,
    tooltip: null
  },
  // 发布中
  publishing: {
    label: '发布中',
    chipClass: 'bg-gray-4 text-gray-6',
    dotClass: 'bg-gray-5',
    helpText: null,
    saveDisabled: true,
    publishDisabled: true,
    saveHighlight: false,
    publishHighlight: false,
    tooltip: null
  }
};

// ==================== StatusChip 组件 ====================
/**
 * 状态胶囊标签组件 - 可独立使用（如表格中）
 * 
 * @param {string} status - 状态: 'draft' | 'published' | 'pending' | 'unsaved' | 'saving' | 'publishing'
 * @param {boolean} showDot - 是否显示圆点，默认 true
 * @param {boolean} showTooltip - 是否显示 Tooltip，默认 false
 * @param {string} scene - 场景: 'article' | 'config'，影响 label 和 tooltip 文案
 */
export const StatusChip = ({ 
  status = 'published', 
  showDot = true,
  showTooltip = false,
  scene = 'config'
}) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.published;
  
  // 获取 label 文本（支持按 scene 区分）
  const getLabelText = () => {
    if (!config.label) return '';
    if (typeof config.label === 'string') return config.label;
    return config.label[scene] || config.label.config || config.label.article;
  };
  
  // 获取 tooltip 文本
  const getTooltipText = () => {
    if (!config.tooltip) return null;
    if (typeof config.tooltip === 'string') return config.tooltip;
    return config.tooltip[scene] || config.tooltip.config;
  };
  
  const labelText = getLabelText();
  const tooltipText = getTooltipText();
  const hasTooltip = showTooltip && tooltipText;

  return (
    <div 
      className="relative inline-flex group/status"
      onMouseEnter={() => hasTooltip && setIsTooltipVisible(true)}
      onMouseLeave={() => hasTooltip && setIsTooltipVisible(false)}
    >
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${config.chipClass}`}>
        {showDot && (
          <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`} />
        )}
        {labelText}
      </span>
      
      {/* Tooltip - 向上弹出 */}
      {hasTooltip && isTooltipVisible && (
        <div className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-2 pointer-events-none">
          <div className="bg-gray-8 text-white text-xs rounded-lg px-3 py-2 shadow-xl whitespace-pre-line min-w-[200px] max-w-[280px] leading-relaxed">
            {tooltipText}
          </div>
          {/* 小箭头指向下方 */}
          <div className="absolute left-1/2 -translate-x-1/2 top-full border-6 border-transparent border-t-gray-8"></div>
        </div>
      )}
    </div>
  );
};

// ==================== FloatingActionBar 组件 ====================
/**
 * 底部悬浮操作栏组件 (Sticky Footer)
 * 
 * 状态逻辑：
 * 
 * 1. 完美同步态 🟢 已上线
 *    - 触发：刚进页面，或发布成功后
 *    - 保存按钮：默认态 | 发布按钮：禁用
 * 
 * 2. 待同步态 🔵 待同步
 *    - 触发：点了保存，但没点发布
 *    - 保存按钮：禁用 | 发布按钮：高亮
 * 
 * 3. 未保存态 🟡 有未保存修改
 *    - 触发：正在编辑中
 *    - 保存按钮：高亮 | 发布按钮：禁用
 * 
 * 4. 未上线态 🟡 未上线（仅文章页面）
 *    - 触发：草稿状态的文章
 *    - 保存按钮：默认态 | 发布按钮：高亮
 * 
 * @param {string} status - 状态: 'draft' | 'published' | 'pending' | 'unsaved' | 'saving' | 'publishing'
 * @param {string} scene - 场景: 'article' | 'config'，影响 tooltip 文案和按钮文字
 * @param {string} lastPublishedTime - 上次发布时间，如 "10:42"
 * @param {string} lastPublishedDate - 上次发布日期，如 "2025-12-08 10:00"
 * @param {function} onSave - 发布按钮点击事件
 * @param {function} onSaveDraft - 保存配置按钮点击事件
 * @param {string} saveText - 发布按钮文字，不传则根据 scene 和 status 自动判断
 * @param {string} saveDraftText - 保存按钮文字，默认 "保存配置"（文章页面为"保存草稿"）
 * @param {boolean} showDraftButton - 是否显示保存按钮，默认 true
 * @param {boolean} disabled - 是否禁用所有按钮
 * @param {boolean} isModal - 是否在弹窗内使用（影响样式：非固定定位）
 */
const FloatingActionBar = ({
  status = 'published',
  scene = 'config',
  lastPublishedTime,
  lastPublishedDate,
  onSave,
  onSaveDraft,
  saveText,
  saveDraftText,
  showDraftButton = true,
  disabled = false,
  isModal = false,
}) => {
  // Tooltip 显示状态
  const [showTooltip, setShowTooltip] = useState(false);

  // 获取当前状态配置
  const currentChip = STATUS_CONFIG[status] || STATUS_CONFIG.published;
  
  // 自动判断发布按钮文字
  const getPublishButtonText = () => {
    if (saveText) return saveText;
    if (scene === 'article') {
      // 文章页面：未上线时显示"发布上线"，其他时候显示"发布更新"
      return status === 'draft' ? '发布上线' : '发布更新';
    }
    // 配置页面：统一显示"发布更新"
    return '发布更新';
  };
  
  // 自动判断保存按钮文字
  const getDraftButtonText = () => {
    if (saveDraftText) return saveDraftText;
    return scene === 'article' ? '保存草稿' : '保存配置';
  };
  
  // 获取 label 文本（支持按 scene 区分）
  const getLabelText = () => {
    if (!currentChip.label) return '';
    if (typeof currentChip.label === 'string') return currentChip.label;
    return currentChip.label[scene] || currentChip.label.config || currentChip.label.article;
  };
  
  // 获取 tooltip 文本
  const getTooltipText = () => {
    if (!currentChip.tooltip) return null;
    if (typeof currentChip.tooltip === 'string') return currentChip.tooltip;
    return currentChip.tooltip[scene] || currentChip.tooltip.config;
  };
  
  const labelText = getLabelText();
  const tooltipText = getTooltipText();

  // 按钮禁用状态
  const isSaveDisabled = disabled || status === 'saving' || status === 'publishing' || currentChip.saveDisabled;
  const isPublishDisabled = disabled || status === 'saving' || status === 'publishing' || currentChip.publishDisabled;

  // 容器样式：弹窗内使用普通布局，页面内使用固定定位
  const containerClass = isModal
    ? 'flex-shrink-0 mt-4 pt-4 border-t border-gray-3'
    : `fixed bottom-0 left-0 lg:left-[204px] right-0 z-40 
       bg-white/90 backdrop-blur-sm 
       border-t border-gray-4
       shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)]`;

  return (
    <div className={containerClass}>
      {/* 内部布局容器 */}
      <div className={`flex items-center justify-between ${isModal ? '' : 'px-8 py-4'}`}>
        {/* 左侧：状态标签 + 辅助信息 + 感叹号提示 */}
        <div className="flex items-center gap-3">
          {/* 状态标签 (Status Chip) - 胶囊形 */}
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${currentChip.chipClass}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${currentChip.dotClass} ${(status === 'saving' || status === 'publishing') ? 'animate-pulse' : ''}`} />
            {labelText}
          </span>
          
          {/* 辅助信息 */}
          {(status === 'saving' || status === 'publishing') ? null : (
            status === 'published' && lastPublishedTime ? (
              <span className="text-xs text-gray-5">
                当前版本已于 {lastPublishedTime} 上线
              </span>
            ) : currentChip.helpText ? (
              <span className={`text-xs ${currentChip.helpClass || 'text-gray-5'}`}>
                {currentChip.helpText}
              </span>
            ) : null
          )}

          {/* 感叹号提示图标 + Tooltip */}
          {tooltipText && (
            <div className="relative">
              <button
                type="button"
                className={`p-1 rounded-full hover:bg-gray-3 transition-colors ${
                  status === 'unsaved' || status === 'draft' ? 'text-warning' : 'text-brand'
                }`}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onClick={() => setShowTooltip(!showTooltip)}
              >
                <AlertCircle className="w-4 h-4" />
              </button>
              
              {/* Tooltip 弹出层 */}
              {showTooltip && (
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2.5 z-50">
                  <div className="bg-gray-8 text-white text-sm rounded-xl px-4 py-3 shadow-xl whitespace-pre-line min-w-[280px] max-w-sm leading-relaxed">
                    {tooltipText}
                  </div>
                  {/* 小三角 */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-gray-8" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* 右侧按钮组 - 间距 12px */}
        <div className="flex items-center gap-3">
          {/* 保存配置/草稿按钮 */}
          {showDraftButton && onSaveDraft && (
            <button
              onClick={onSaveDraft}
              disabled={isSaveDisabled}
              className={`flex items-center gap-xs px-md py-xs rounded-sm transition-colors ${
                isSaveDisabled
                  ? 'bg-gray-3 border border-gray-4 text-gray-5 cursor-not-allowed'
                  : currentChip.saveHighlight
                    ? 'bg-brand hover:bg-brand-active text-white animate-breathe'
                    : 'bg-white border border-gray-5 text-gray-7 hover:text-brand hover:border-brand'
              }`}
            >
              {status === 'saving' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span className="text-body font-medium">{getDraftButtonText()}</span>
            </button>
          )}

          {/* 发布按钮 */}
          <button
            onClick={onSave}
            disabled={isPublishDisabled}
            className={`flex items-center gap-xs px-md py-xs rounded-sm transition-colors ${
              isPublishDisabled
                ? 'bg-gray-3 border border-gray-4 text-gray-5 cursor-not-allowed'
                : 'bg-brand hover:bg-brand-active text-white'
            }`}
          >
            {status === 'publishing' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            <span className="text-body font-medium">{getPublishButtonText()}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FloatingActionBar;
