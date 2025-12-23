import { useState, useCallback, useEffect } from 'react';
import { Upload } from 'lucide-react';
import PageBanner from './PageBanner';
import FloatingActionBar from './FloatingActionBar';
import UnifiedHistoryModal from './UnifiedHistoryModal';
import Button from './Button';
import { useUnsavedChanges } from '../../contexts/UnsavedChangesContext';

/**
 * 编辑器页面统一布局组件
 * 用于单一配置页面（内容始终存在的成熟页面），自动包含：
 * - PageBanner（右侧显示"历史记录"入口）
 * - 底部悬浮操作栏（状态标签 + 保存配置 + 发布上线）
 * - 历史记录弹窗
 * - 离开拦截（未保存时警告）
 * - 待发布状态持久化
 * 
 * 状态逻辑（三种状态）：
 * - 🟢 已发布 (published): 完全同步，发布按钮置灰
 * - 🔵 待发布 (pending): 已保存但未发布，发布按钮高亮
 * - 🟡 有未保存修改 (unsaved): 内容已修改但未保存，保存按钮高亮
 * 
 * @param {string} title - 页面标题
 * @param {string} description - 页面描述
 * @param {string} pageKey - 页面唯一标识，用于持久化状态（如 'intro', 'banner'）
 * @param {function} onSave - 发布回调函数
 * @param {function} onSaveDraft - 保存配置回调函数（可选）
 * @param {function} onRestoreHistory - 恢复历史版本回调函数（可选）
 * @param {Array} historyData - 历史记录数据（可选）
 * @param {string} saveText - 发布按钮文字，默认 "发布上线"
 * @param {string} draftText - 保存按钮文字，默认 "保存配置"
 * @param {boolean} showDraftButton - 是否显示保存按钮，默认 true
 * @param {boolean} hasUnsavedChanges - 是否有未保存的修改（由父组件控制）
 * @param {React.ReactNode} children - 编辑器内容
 */
const EditorLayout = ({
  title,
  description,
  pageKey,
  onSave,
  onSaveDraft,
  onRestoreHistory,
  historyData,
  saveText = '发布更新',
  draftText = '保存配置',
  showDraftButton = true,
  hasUnsavedChanges = false, // 由父组件传入：内容是否有未保存的修改
  children,
}) => {
  // 生成存储 key
  const storageKey = pageKey ? `cms_editor_${pageKey}_pending` : null;
  const publishTimeKey = pageKey ? `cms_editor_${pageKey}_publishTime` : null;

  // 状态管理
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  
  // 从 localStorage 读取待发布状态
  const [hasPendingChanges, setHasPendingChanges] = useState(() => {
    if (storageKey) {
      return localStorage.getItem(storageKey) === 'true';
    }
    return false;
  });
  
  // 发布时间 - 从 localStorage 读取
  const [lastPublishedTime, setLastPublishedTime] = useState(() => {
    if (publishTimeKey) {
      const saved = localStorage.getItem(publishTimeKey);
      if (saved) {
        const date = new Date(saved);
        return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
      }
    }
    const now = new Date();
    now.setMinutes(now.getMinutes() - 15);
    return now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  });
  
  const [lastPublishedDate, setLastPublishedDate] = useState(() => {
    if (publishTimeKey) {
      const saved = localStorage.getItem(publishTimeKey);
      if (saved) {
        const date = new Date(saved);
        return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-') 
          + ' ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
      }
    }
    const now = new Date();
    now.setMinutes(now.getMinutes() - 15);
    return now.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-') 
      + ' ' + now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  });

  // ==========================================
  // 离开拦截功能
  // ==========================================
  
  // 监听浏览器关闭/刷新
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '您有未保存的修改，确定要离开吗？';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // 持久化待发布状态到 localStorage
  useEffect(() => {
    if (storageKey) {
      localStorage.setItem(storageKey, hasPendingChanges.toString());
    }
  }, [hasPendingChanges, storageKey]);

  // 同步本地未保存状态到全局上下文（用于导航拦截）
  const { setHasUnsavedChanges: setGlobalUnsavedChanges } = useUnsavedChanges();
  
  useEffect(() => {
    setGlobalUnsavedChanges(hasUnsavedChanges);
    // 组件卸载时清除全局状态
    return () => setGlobalUnsavedChanges(false);
  }, [hasUnsavedChanges, setGlobalUnsavedChanges]);
  
  // 历史弹窗状态
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  
  // 发布确认弹窗状态
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);

  // 获取当前时间字符串 (HH:MM)
  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  };

  // 处理发布上线按钮点击 - 先弹窗确认
  const handlePublishClick = useCallback(() => {
    setShowPublishConfirm(true);
  }, []);

  // 确认发布
  const handleConfirmPublish = useCallback(async () => {
    setShowPublishConfirm(false);
    setIsPublishing(true);
    
    try {
      if (onSave) {
        await onSave();
      } else {
        // 默认行为：模拟发布
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('已发布上线');
      }
      // 发布后清除待发布标记 → 回到"已发布"状态
      setHasPendingChanges(false);
      
      // 更新发布时间
      const now = new Date();
      const timeStr = getCurrentTime();
      const dateStr = now.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-') 
        + ' ' + now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
      
      setLastPublishedTime(timeStr);
      setLastPublishedDate(dateStr);
      
      // 持久化发布时间
      if (publishTimeKey) {
        localStorage.setItem(publishTimeKey, now.toISOString());
      }
      // 清除待发布状态
      if (storageKey) {
        localStorage.setItem(storageKey, 'false');
      }
    } catch (error) {
      console.error('发布失败:', error);
    } finally {
      setIsPublishing(false);
    }
  }, [onSave, publishTimeKey, storageKey]);

  // 处理保存配置
  const handleSaveDraft = useCallback(async () => {
    setIsSaving(true);
    
    try {
      if (onSaveDraft) {
        await onSaveDraft();
      } else {
        // 默认行为：模拟保存配置
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log('配置已保存');
      }
      // 保存成功后标记为"待发布"
      // 注意：hasUnsavedChanges 由父组件在 onSaveDraft 回调中重置
      setHasPendingChanges(true);
    } catch (error) {
      console.error('保存失败:', error);
    } finally {
      setIsSaving(false);
    }
  }, [onSaveDraft]);

  // 处理查看历史
  const handleViewHistory = useCallback(() => {
    setShowHistoryModal(true);
  }, []);

  // 处理恢复历史版本
  const handleRestoreHistory = useCallback((record) => {
    if (onRestoreHistory) {
      onRestoreHistory(record);
      setShowHistoryModal(false);
    } else {
      // 默认行为：确认提示
      if (confirm(`确定要恢复到 ${record.time} 的版本吗？\n\n${record.description}`)) {
        console.log('恢复版本:', record);
        setShowHistoryModal(false);
      }
    }
  }, [onRestoreHistory]);

  // 计算底部状态栏显示状态
  // 优先级：publishing > saving > unsaved > pending > published
  const getDisplayStatus = () => {
    if (isPublishing) return 'publishing'; // 发布中
    if (isSaving) return 'saving'; // 保存中
    if (hasUnsavedChanges) return 'unsaved'; // 🔴 有未保存修改
    if (hasPendingChanges) return 'pending'; // 🟡 待发布
    return 'published'; // 🟢 已发布
  };
  
  const displayStatus = getDisplayStatus();

  return (
    <div className="bg-white rounded-xl border border-gray-4 overflow-hidden">
      {/* PageBanner - 右侧显示历史记录入口 */}
      <PageBanner 
        title={title}
        description={description}
        onHistoryClick={handleViewHistory}
      />

      {/* 编辑器内容区域 */}
      <div className="px-xl py-lg border-t border-gray-4">
        {children}
      </div>

      {/* 底部占位块 - 防止内容被悬浮栏遮挡，高度 80px */}
      <div className="h-20" aria-hidden="true" />

      {/* 底部悬浮操作栏 - 保存配置 + 发布更新 */}
      <FloatingActionBar
        status={displayStatus}
        scene="config"
        lastPublishedTime={lastPublishedTime}
        lastPublishedDate={lastPublishedDate}
        onSave={handlePublishClick}
        onSaveDraft={handleSaveDraft}
        saveText={saveText}
        saveDraftText={draftText}
        showDraftButton={showDraftButton}
      />

      {/* 历史记录弹窗 */}
      <UnifiedHistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        title={`${title} - 历史记录`}
        mode="editor"
        records={historyData}
        onRestore={handleRestoreHistory}
      />

      {/* 发布确认弹窗 */}
      {showPublishConfirm && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-md">
          <div className="absolute inset-0 bg-gray-8/40 backdrop-blur-sm" onClick={() => setShowPublishConfirm(false)} />
          <div className="relative bg-white rounded-xl shadow-strong w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-gray-4">
            {/* 弹窗内容 */}
            <div className="p-lg text-center">
              <div className="w-16 h-16 mx-auto mb-md rounded-full bg-brand-light flex items-center justify-center">
                <Upload className="w-8 h-8 text-brand" />
              </div>
              <h3 className="text-section text-gray-8 mb-xs">确认发布至官网？</h3>
              <p className="text-body text-gray-6">发布后内容将立即在官网上展示给所有访问者</p>
            </div>
            {/* 按钮组 */}
            <div className="px-lg pb-lg flex items-center justify-center gap-sm">
              <Button 
                variant="secondary" 
                onClick={() => setShowPublishConfirm(false)}
              >
                取消
              </Button>
              <Button 
                onClick={handleConfirmPublish}
              >
                <Upload className="w-4 h-4" />
                确认发布
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditorLayout;
