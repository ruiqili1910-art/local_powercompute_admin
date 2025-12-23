import { useState, useCallback, useRef, useEffect } from 'react';
import { Plus, Trash2, Upload } from 'lucide-react';
import { FormItem, Input, TextArea, ImageSelector, PageBanner, FloatingActionBar, UnifiedHistoryModal, Button } from '../ui';
import { useUnsavedChanges } from '../../contexts/UnsavedChangesContext';

const STORAGE_KEY_PENDING = 'cms_editor_history_pending';
const STORAGE_KEY_PUBLISH_TIME = 'cms_editor_history_publishTime';

const HistoryEditor = ({ data, onChange, imageLib }) => {
  // 记录上次保存的数据快照，用于比较是否有未保存的修改
  const savedDataRef = useRef(JSON.stringify(data));
  
  // 状态管理 - 配置页初始为"已发布"
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // 从 localStorage 读取待发布状态
  const [hasPendingChanges, setHasPendingChanges] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_PENDING) === 'true';
  });
  
  // 发布时间 - 从 localStorage 读取
  const [lastPublishedTime, setLastPublishedTime] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PUBLISH_TIME);
    if (saved) {
      const date = new Date(saved);
      return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    }
    const now = new Date();
    now.setMinutes(now.getMinutes() - 15);
    return now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  });
  
  const [lastPublishedDate, setLastPublishedDate] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PUBLISH_TIME);
    if (saved) {
      const date = new Date(saved);
      return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-') 
        + ' ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    }
    const now = new Date();
    now.setMinutes(now.getMinutes() - 15);
    return now.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-') 
      + ' ' + now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  });
  
  // 弹窗状态
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);
  
  // 模拟历史记录数据
  // 注意：发布/更新状态的描述会被自动替换为"发布/更新了[XXX时间]保存的版本"格式
  // 所以这里的description主要用于找不到对应draft记录时的fallback
  const historyData = [
    { id: 'h1', time: '2024-03-20 14:30', description: '更新了发展历程节点配置', operator: 'admin', status: 'published' },
    { id: 'h2', time: '2024-03-20 14:25', description: '修改了发展历程时间线', operator: 'admin', status: 'draft' },
    { id: 'h3', time: '2024-03-18 10:00', description: '添加了新的发展历程节点', operator: 'admin', status: 'published' },
    { id: 'h3_draft', time: '2024-03-18 09:45', description: '编辑了"节点内容"', operator: 'admin', status: 'draft' },
    { id: 'h4', time: '2024-03-15 16:20', description: '更新了发展历程内容', operator: 'admin', status: 'published' },
    { id: 'h4_draft', time: '2024-03-15 16:00', description: '编辑了"时间线"内容', operator: 'admin', status: 'draft' },
    { id: 'h5', time: '2024-03-10 09:00', description: '首次发布发展历程配置', operator: 'admin', status: 'published' },
  ];
  
  // 处理恢复历史版本
  const handleRestoreHistory = (record) => {
    console.log('恢复版本:', record);
    // 实际项目中这里会恢复历史版本
    setShowHistoryModal(false);
  };

  // 监听数据变化，判断是否有未保存的修改
  useEffect(() => {
    const currentData = JSON.stringify(data);
    setHasUnsavedChanges(currentData !== savedDataRef.current);
  }, [data]);

  // 同步本地未保存状态到全局上下文（用于导航拦截）
  const { setHasUnsavedChanges: setGlobalUnsavedChanges } = useUnsavedChanges();
  
  useEffect(() => {
    setGlobalUnsavedChanges(hasUnsavedChanges);
    return () => setGlobalUnsavedChanges(false);
  }, [hasUnsavedChanges, setGlobalUnsavedChanges]);

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
    localStorage.setItem(STORAGE_KEY_PENDING, hasPendingChanges.toString());
  }, [hasPendingChanges]);

  // 获取当前时间
  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  };

  // 添加节点
  const handleAdd = () => {
    const n = [{ id: Date.now(), year: "2024", title: "新事件", desc: "" }, ...data.timeline];
    onChange({...data, timeline: n});
  };

  // 保存配置
  const handleSaveDraft = useCallback(async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('发展历程配置已保存:', data);
    // 保存成功后更新快照
    savedDataRef.current = JSON.stringify(data);
    setHasUnsavedChanges(false);
    setHasPendingChanges(true); // 保存后变为"待发布"
    setIsSaving(false);
  }, [data]);

  // 发布上线
  const handlePublishClick = () => setShowPublishConfirm(true);
  
  const handleConfirmPublish = useCallback(async () => {
    setShowPublishConfirm(false);
    setIsPublishing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('发展历程已发布:', data);
    // 发布成功后更新快照
    savedDataRef.current = JSON.stringify(data);
    setHasPendingChanges(false);
    setHasUnsavedChanges(false);
    
    const now = new Date();
    const timeStr = getCurrentTime();
    const dateStr = now.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-') 
      + ' ' + now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    
    setLastPublishedTime(timeStr);
    setLastPublishedDate(dateStr);
    
    // 持久化发布时间
    localStorage.setItem(STORAGE_KEY_PUBLISH_TIME, now.toISOString());
    localStorage.setItem(STORAGE_KEY_PENDING, 'false');
    
    setIsPublishing(false);
  }, [data]);

  // 计算底部状态栏显示状态
  // 优先级：publishing > saving > unsaved > pending > published
  const getDisplayStatus = () => {
    if (isPublishing) return 'publishing';
    if (isSaving) return 'saving';
    if (hasUnsavedChanges) return 'unsaved';
    if (hasPendingChanges) return 'pending';
    return 'published';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-4 overflow-hidden">
      {/* PageBanner - 右侧：历史记录小图标 + 添加节点按钮 */}
      <PageBanner 
        title="发展历程"
        description="维护公司发展历程节点，展示企业成长轨迹和重要里程碑。"
        buttonText="添加节点"
        buttonIcon="add"
        onButtonClick={handleAdd}
        onHistoryClick={() => setShowHistoryModal(true)}
      />

      {/* 内容区域 */}
      <div className="px-xl py-lg border-t border-gray-4">
        <div className="space-y-8 pl-4">
          {data.timeline.map((item, idx) => (
            <div key={item.id} className="relative pl-8 border-l-2 border-[#E6F1FF] hover:border-[#5EA8FF] transition-colors pb-8 last:pb-0">
               <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-white border-4 border-[#2B7FFF] shadow-[0_0_0_4px_rgba(22,119,255,0.1)]"></div>
               <div className="flex gap-8 items-start">
                  <div className="w-32 flex-shrink-0 pt-2">
                    <input value={item.year} onChange={e=>{const n=[...data.timeline];n[idx].year=e.target.value;onChange({...data, timeline:n})}} className="w-full text-center text-2xl font-bold text-[#2B7FFF] bg-transparent border-b-2 border-transparent hover:border-[#E6E8EB] focus:border-[#2B7FFF] outline-none transition-colors font-mono"/>
                  </div>
                  <div className="flex-1 space-y-4 bg-[#FAFAFA] p-6 rounded-xl border border-[#F0F0F0] hover:shadow-sm hover:bg-white transition-all">
                     <div className="flex justify-between items-start">
                        <div className="flex-1 mr-4">
                          <FormItem label="事件标题">
                            <Input value={item.title} onChange={e=>{const n=[...data.timeline];n[idx].title=e.target.value;onChange({...data, timeline:n})}} className="font-bold"/>
                          </FormItem>
                        </div>
                        <button onClick={() => {const n=data.timeline.filter(x=>x.id!==item.id);onChange({...data, timeline:n})}} className="text-[#8A9099] hover:text-[#FF4D4F] p-2 hover:bg-[#FFECEC] rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4"/>
                        </button>
                     </div>
                     <FormItem label="详细描述">
                       <TextArea value={item.desc} onChange={e=>{const n=[...data.timeline];n[idx].desc=e.target.value;onChange({...data, timeline:n})}} className="h-24 text-sm"/>
                     </FormItem>
                     <ImageSelector label="节点配图 (可选)" value={item.img} onChange={img => {const n=[...data.timeline];n[idx].img=img;onChange({...data, timeline:n})}} library={imageLib} />
                  </div>
               </div>
            </div>
          ))}
        </div>
      </div>

      {/* 底部占位块 */}
      <div className="h-20" aria-hidden="true" />

      {/* 底部悬浮操作栏 */}
      <FloatingActionBar
        status={getDisplayStatus()}
        lastPublishedTime={lastPublishedTime}
        lastPublishedDate={lastPublishedDate}
        onSave={handlePublishClick}
        onSaveDraft={handleSaveDraft}
        saveText="发布更新"
        saveDraftText="保存配置"
        showDraftButton={true}
      />

      {/* 历史记录弹窗 */}
      <UnifiedHistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        title="发展历程 - 历史记录"
        mode="editor"
        records={historyData}
        onRestore={handleRestoreHistory}
      />

      {/* 发布确认弹窗 */}
      {showPublishConfirm && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-md">
          <div className="absolute inset-0 bg-gray-8/40 backdrop-blur-sm" onClick={() => setShowPublishConfirm(false)} />
          <div className="relative bg-white rounded-xl shadow-strong w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-gray-4">
            <div className="p-lg text-center">
              <div className="w-16 h-16 mx-auto mb-md rounded-full bg-brand-light flex items-center justify-center">
                <Upload className="w-8 h-8 text-brand" />
              </div>
              <h3 className="text-section text-gray-8 mb-xs">确认发布至官网？</h3>
              <p className="text-body text-gray-6">发布后内容将立即在官网上展示给所有访问者</p>
            </div>
            <div className="px-lg pb-lg flex items-center justify-center gap-sm">
              <Button variant="secondary" onClick={() => setShowPublishConfirm(false)}>取消</Button>
              <Button onClick={handleConfirmPublish}>
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

export default HistoryEditor;
