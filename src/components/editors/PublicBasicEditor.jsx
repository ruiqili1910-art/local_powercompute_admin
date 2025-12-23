import { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, Clock, Construction, Award, ChevronLeft, ChevronRight, Image } from 'lucide-react';
import { FormItem, Input, TextArea, Button, Modal, EditorLayout, ImageSelector, PageBanner, FloatingActionBar, UnifiedHistoryModal } from '../ui';
import { CertPicker } from '../common';

const PublicBasicEditor = ({ data, onChange, certLib = {}, imageLib = [] }) => {
  const [activeTab, setActiveTab] = useState('business');
  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);
  const [isCertGroupModalOpen, setIsCertGroupModalOpen] = useState(false);
  const [editingTimeline, setEditingTimeline] = useState(null);
  const [editingCertGroup, setEditingCertGroup] = useState(null);
  const [timelineForm, setTimelineForm] = useState({ year: '', title: '', content: '' });
  const [certGroupForm, setCertGroupForm] = useState({ title: '', count: '', unit: '个', images: [], selectedCertIds: [] });
  
  // 为每个tab创建独立的状态管理
  const tabSavedDataRefs = useRef({});
  const tabHasUnsavedChanges = useRef({});
  const tabHasPendingChanges = useRef({});
  const tabLastPublishedTime = useRef({});
  const tabLastPublishedDate = useRef({});
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  
  // 初始化每个tab的状态
  useEffect(() => {
    tabs.forEach(tab => {
      const tabData = getTabData(tab.id);
      if (!tabSavedDataRefs.current[tab.id]) {
        tabSavedDataRefs.current[tab.id] = JSON.stringify(tabData);
        tabHasUnsavedChanges.current[tab.id] = false;
        tabHasPendingChanges.current[tab.id] = false;
        const saved = localStorage.getItem(`cms_editor_public_basic_${tab.id}_publishTime`);
        if (saved) {
          const date = new Date(saved);
          tabLastPublishedTime.current[tab.id] = date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
          tabLastPublishedDate.current[tab.id] = date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-') 
            + ' ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
        } else {
          const now = new Date();
          now.setMinutes(now.getMinutes() - 15);
          tabLastPublishedTime.current[tab.id] = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
          tabLastPublishedDate.current[tab.id] = now.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-') 
            + ' ' + now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
        }
      }
    });
  }, []);
  
  // 获取当前tab的数据
  const getTabData = (tabId) => {
    switch(tabId) {
      case 'business': return data.registration || {};
      case 'qualification': return { certGroups: data.certGroups || [] };
      case 'strategy': return { strategyTimeline: data.strategyTimeline || [] };
      default: return {};
    }
  };
  
  // 监听当前tab的数据变化
  useEffect(() => {
    const tabData = getTabData(activeTab);
    const currentDataStr = JSON.stringify(tabData);
    const savedDataStr = tabSavedDataRefs.current[activeTab] || '';
    tabHasUnsavedChanges.current[activeTab] = currentDataStr !== savedDataStr;
  }, [data, activeTab]);
  
  // 从localStorage读取待发布状态
  useEffect(() => {
    tabs.forEach(tab => {
      const saved = localStorage.getItem(`cms_editor_public_basic_${tab.id}_pending`);
      if (saved !== null) {
        tabHasPendingChanges.current[tab.id] = saved === 'true';
      }
    });
  }, []);

  const tabs = [
    { id: 'business', label: '工商注册' },
    { id: 'qualification', label: '企业资质' },
    { id: 'strategy', label: '发展战略' },
    { id: 'distribution', label: '业务分布' },
    { id: 'performance', label: '工程业绩' }
  ];

  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    const tabData = getTabData(activeTab);
    tabSavedDataRefs.current[activeTab] = JSON.stringify(tabData);
    tabHasUnsavedChanges.current[activeTab] = false;
    tabHasPendingChanges.current[activeTab] = true;
    localStorage.setItem(`cms_editor_public_basic_${activeTab}_pending`, 'true');
    setIsSaving(false);
    console.log(`基本信息-${tabs.find(t => t.id === activeTab)?.label}配置已保存`);
  };

  const handleSave = async () => {
    setIsPublishing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const tabData = getTabData(activeTab);
    tabSavedDataRefs.current[activeTab] = JSON.stringify(tabData);
    tabHasUnsavedChanges.current[activeTab] = false;
    tabHasPendingChanges.current[activeTab] = false;
    
    const now = new Date();
    const timeStr = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-') 
      + ' ' + now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    
    tabLastPublishedTime.current[activeTab] = timeStr;
    tabLastPublishedDate.current[activeTab] = dateStr;
    
    localStorage.setItem(`cms_editor_public_basic_${activeTab}_publishTime`, now.toISOString());
    localStorage.setItem(`cms_editor_public_basic_${activeTab}_pending`, 'false');
    setIsPublishing(false);
    console.log(`基本信息-${tabs.find(t => t.id === activeTab)?.label}配置已发布`);
  };
  
  // 获取当前tab的显示状态
  const getDisplayStatus = () => {
    if (isPublishing) return 'publishing';
    if (isSaving) return 'saving';
    if (tabHasUnsavedChanges.current[activeTab]) return 'unsaved';
    if (tabHasPendingChanges.current[activeTab]) return 'pending';
    return 'published';
  };
  
  // 判断是否需要显示悬浮栏和历史记录
  const shouldShowFloatingBar = activeTab !== 'distribution' && activeTab !== 'performance';
  const shouldShowHistory = activeTab !== 'distribution' && activeTab !== 'performance';
  
  // 生成历史记录数据（模拟）
  const generateHistoryData = () => {
    return [
      { id: '1', time: '2025-12-11 10:30', operator: 'admin', action: '发布', changes: '发布基本信息配置' },
      { id: '2', time: '2025-12-10 15:20', operator: 'admin', action: '保存', changes: '保存基本信息配置' },
      { id: '3', time: '2025-12-09 09:15', operator: 'editor', action: '编辑', changes: '修改企业资质展示' },
    ];
  };

  // ================== 企业资质展示组管理 ==================
  const certGroups = data.certGroups || [];

  const handleAddCertGroup = () => {
    setEditingCertGroup(null);
    setCertGroupForm({ title: '', count: '', unit: '个', images: [], selectedCertIds: [] });
    setIsCertGroupModalOpen(true);
  };

  const handleEditCertGroup = (group, index) => {
    setEditingCertGroup(index);
    setCertGroupForm({ 
      title: group.title, 
      count: group.count, 
      unit: group.unit || '个', 
      images: group.images || [],
      selectedCertIds: group.selectedCertIds || []
    });
    setIsCertGroupModalOpen(true);
  };
  
  // 从资质库选择资质后，转换为图片数组
  const handleCertSelect = (certIds) => {
    const selectedCerts = certLib.certDetails?.filter(cert => certIds.includes(cert.id)) || [];
    const images = selectedCerts.map(cert => ({
      id: cert.id,
      url: cert.image || '',
      title: cert.title
    })).filter(img => img.url); // 只保留有图片的
    
    setCertGroupForm({
      ...certGroupForm,
      selectedCertIds: certIds,
      images: images
    });
  };

  const handleSaveCertGroup = () => {
    if (!certGroupForm.title || !certGroupForm.count) {
      alert('请填写标题和数量');
      return;
    }
    // 保存时，只保存selectedCertIds和images，不保存其他临时状态
    const groupToSave = {
      title: certGroupForm.title,
      count: certGroupForm.count,
      unit: certGroupForm.unit,
      images: certGroupForm.images,
      selectedCertIds: certGroupForm.selectedCertIds
    };
    
    const newGroups = editingCertGroup !== null
      ? certGroups.map((g, idx) => idx === editingCertGroup ? { ...groupToSave, id: g.id } : g)
      : [...certGroups, { id: `certgroup_${Date.now()}`, ...groupToSave }];
    
    handleChange('certGroups', newGroups);
    setIsCertGroupModalOpen(false);
  };

  const handleDeleteCertGroup = (index) => {
    if (confirm('确定删除此资质展示组吗？')) {
      handleChange('certGroups', certGroups.filter((_, idx) => idx !== index));
    }
  };

  const handleRemoveImageFromCertGroup = (imgId) => {
    const newSelectedIds = certGroupForm.selectedCertIds.filter(id => id !== imgId);
    const newImages = certGroupForm.images.filter(img => img.id !== imgId);
    setCertGroupForm({
      ...certGroupForm,
      selectedCertIds: newSelectedIds,
      images: newImages
    });
  };

  // ================== 发展战略时间线 ==================
  const strategyTimeline = data.strategyTimeline || [];

  const handleAddTimeline = () => {
    setEditingTimeline(null);
    setTimelineForm({ year: '', title: '', content: '' });
    setIsTimelineModalOpen(true);
  };

  const handleEditTimeline = (item, index) => {
    setEditingTimeline(index);
    setTimelineForm({ year: item.year, title: item.title, content: item.content });
    setIsTimelineModalOpen(true);
  };

  const handleSaveTimeline = () => {
    if (!timelineForm.year || !timelineForm.title) {
      alert('请填写年份和标题');
      return;
    }
    const newTimeline = editingTimeline !== null
      ? strategyTimeline.map((item, idx) => idx === editingTimeline ? { ...timelineForm, id: item.id } : item)
      : [...strategyTimeline, { id: `timeline_${Date.now()}`, ...timelineForm }];
    
    newTimeline.sort((a, b) => b.year.localeCompare(a.year));
    handleChange('strategyTimeline', newTimeline);
    setIsTimelineModalOpen(false);
  };

  const handleDeleteTimeline = (index) => {
    if (confirm('确定删除此时间节点吗？')) {
      handleChange('strategyTimeline', strategyTimeline.filter((_, idx) => idx !== index));
    }
  };

  // 资质展示组的图片轮播组件
  const CertGroupCard = ({ group, onEdit, onDelete }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const images = group.images || [];
    
    const prevImage = () => {
      setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
    };
    
    const nextImage = () => {
      setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
    };

    return (
      <div className="bg-white rounded-xl border border-gray-4 overflow-hidden group">
        {/* 标题 */}
        <div className="p-md border-b border-gray-4 flex items-center justify-between">
          <div className="flex items-center gap-sm">
            <Award className="w-5 h-5 text-brand" />
            <span className="text-body font-semibold text-gray-8">{group.title}</span>
            <span className="text-title text-brand font-bold ml-xs">{group.count}</span>
            <span className="text-caption text-gray-6">{group.unit || '个'}</span>
          </div>
          <div className="flex gap-xxs opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={onEdit} className="px-sm py-xxs text-caption text-brand hover:bg-brand-light rounded">
              编辑
            </button>
            <button onClick={onDelete} className="px-sm py-xxs text-caption text-error hover:bg-red-50 rounded">
              删除
            </button>
          </div>
        </div>
        
        {/* 图片轮播 */}
        <div className="relative bg-gray-2">
          {images.length > 0 ? (
            <>
              <div className="flex items-center justify-center p-lg" style={{ minHeight: '240px' }}>
                <img 
                  src={images[currentIndex]?.url} 
                  alt={group.title}
                  className="max-h-[200px] w-auto object-contain rounded-lg shadow-md"
                />
              </div>
              
              {/* 轮播控制 */}
              {images.length > 1 && (
                <>
                  <button 
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-6" />
                  </button>
                  <button 
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-6" />
                  </button>
                  
                  {/* 指示器 */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
                    {images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-6 h-1 rounded-full transition-colors ${
                          idx === currentIndex ? 'bg-brand' : 'bg-gray-4'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center p-lg text-gray-5" style={{ minHeight: '240px' }}>
              <Image className="w-12 h-12 mb-sm" />
              <span className="text-caption">暂无图片</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  // 发展战略tab的添加节点功能
  const handleAddStrategyNode = () => {
    const n = [{ id: Date.now(), year: "2024", title: "新事件", desc: "", img: null }, ...(data.strategyTimeline || [])];
    handleChange('strategyTimeline', n);
  };

  return (
    <>
    <div className="bg-white rounded-xl border border-gray-4 overflow-hidden">
      <PageBanner 
        title="基本信息"
        description="管理企业公开信息，包括工商注册、企业资质、发展战略等。"
      />
      
      {/* Tab 切换 - 按钮风格 */}
      <div className="px-xl py-md border-t border-gray-4">
        <div className="flex gap-1 flex-wrap items-center justify-between">
          <div className="flex gap-1 flex-wrap items-center">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-md py-xs rounded-sm text-body font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-brand-light text-brand'
                    : 'text-gray-7 hover:text-gray-8 hover:bg-gray-3'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {/* 历史记录按钮 - 与tab水平，靠右 */}
          {shouldShowHistory && (
            <button
              onClick={() => setShowHistoryModal(true)}
              className="flex items-center gap-1 px-2 py-1.5 text-gray-6 text-caption hover:bg-gray-3 hover:text-gray-7 rounded transition-colors"
              title="查看历史记录"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>历史记录</span>
            </button>
          )}
        </div>
      </div>
      
      {/* 内容区域 */}
      <div className="px-xl py-lg border-t border-gray-4">
          {/* ================== 工商注册 ================== */}
          {activeTab === 'business' && (
            <div className="space-y-md">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-md">
                <FormItem label="公司名称">
                  <Input value={data.registration?.companyName || ''} onChange={e => handleChange('registration', {...data.registration, companyName: e.target.value})} />
                </FormItem>
                <FormItem label="统一社会信用代码">
                  <Input value={data.registration?.unifiedSocialCreditCode || ''} onChange={e => handleChange('registration', {...data.registration, unifiedSocialCreditCode: e.target.value})} />
                </FormItem>
                <FormItem label="注册类型">
                  <Input value={data.registration?.registrationType || ''} onChange={e => handleChange('registration', {...data.registration, registrationType: e.target.value})} />
                </FormItem>
                <FormItem label="法定代表人">
                  <Input value={data.registration?.legalRepresentative || ''} onChange={e => handleChange('registration', {...data.registration, legalRepresentative: e.target.value})} />
                </FormItem>
                <FormItem label="注册资本">
                  <Input value={data.registration?.registeredCapital || ''} onChange={e => handleChange('registration', {...data.registration, registeredCapital: e.target.value})} />
                </FormItem>
                <FormItem label="成立日期">
                  <Input type="date" value={data.registration?.establishDate || ''} onChange={e => handleChange('registration', {...data.registration, establishDate: e.target.value})} />
                </FormItem>
              </div>
              <FormItem label="注册地址">
                <Input value={data.registration?.registrationAddress || ''} onChange={e => handleChange('registration', {...data.registration, registrationAddress: e.target.value})} />
              </FormItem>
              <FormItem label="经营范围">
                <TextArea value={data.registration?.businessScope || ''} onChange={e => handleChange('registration', {...data.registration, businessScope: e.target.value})} rows={4} />
              </FormItem>
            </div>
          )}

          {/* ================== 企业资质（数据+图片） ================== */}
          {activeTab === 'qualification' && (
            <div className="space-y-lg">
              <div className="flex items-center justify-between">
                <p className="text-caption text-gray-6">每个资质展示组包含：标题、数量、证书图片轮播。</p>
                <Button variant="add" onClick={handleAddCertGroup}>
                  <Plus className="w-4 h-4" />
                  添加资质展示
                </Button>
              </div>

              {/* 资质展示组列表 */}
              {certGroups.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
                  {certGroups.map((group, index) => (
                    <CertGroupCard 
                      key={group.id || index}
                      group={group}
                      onEdit={() => handleEditCertGroup(group, index)}
                      onDelete={() => handleDeleteCertGroup(index)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-xl text-gray-6">
                  <Award className="w-12 h-12 mx-auto mb-md text-gray-4" />
                  <p className="text-body">暂无企业资质展示</p>
                  <p className="text-caption">点击"添加资质展示"开始创建</p>
                </div>
              )}
            </div>
          )}

          {/* ================== 发展战略（时间线）- 与关于我们-发展历程完全一样 ================== */}
          {activeTab === 'strategy' && (
            <div className="space-y-lg">
              <div className="flex items-center justify-between">
                <p className="text-caption text-gray-6">管理发展战略时间线节点。</p>
                <Button variant="add" onClick={handleAddStrategyNode}>
                  <Plus className="w-4 h-4" />
                  添加节点
                </Button>
              </div>
              <div className="space-y-8 pl-4">
              {strategyTimeline.length > 0 ? (
                strategyTimeline.map((item, idx) => (
                  <div key={item.id || idx} className="relative pl-8 border-l-2 border-[#E6F1FF] hover:border-[#5EA8FF] transition-colors pb-8 last:pb-0">
                    <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-white border-4 border-[#2B7FFF] shadow-[0_0_0_4px_rgba(22,119,255,0.1)]"></div>
                    <div className="flex gap-8 items-start">
                      <div className="w-32 flex-shrink-0 pt-2">
                        <input 
                          value={item.year} 
                          onChange={e => {
                            const n = [...strategyTimeline];
                            n[idx].year = e.target.value;
                            handleChange('strategyTimeline', n);
                          }} 
                          className="w-full text-center text-2xl font-bold text-[#2B7FFF] bg-transparent border-b-2 border-transparent hover:border-[#E6E8EB] focus:border-[#2B7FFF] outline-none transition-colors font-mono"
                        />
                      </div>
                      <div className="flex-1 space-y-4 bg-[#FAFAFA] p-6 rounded-xl border border-[#F0F0F0] hover:shadow-sm hover:bg-white transition-all">
                        <div className="flex justify-between items-start">
                          <div className="flex-1 mr-4">
                            <FormItem label="事件标题">
                              <Input 
                                value={item.title} 
                                onChange={e => {
                                  const n = [...strategyTimeline];
                                  n[idx].title = e.target.value;
                                  handleChange('strategyTimeline', n);
                                }} 
                                className="font-bold"
                              />
                            </FormItem>
                          </div>
                          <button 
                            onClick={() => {
                              const n = strategyTimeline.filter(x => (x.id || idx) !== (item.id || idx));
                              handleChange('strategyTimeline', n);
                            }} 
                            className="text-[#8A9099] hover:text-[#FF4D4F] p-2 hover:bg-[#FFECEC] rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4"/>
                          </button>
                        </div>
                        <FormItem label="详细描述">
                          <TextArea 
                            value={item.desc || item.content || ''} 
                            onChange={e => {
                              const n = [...strategyTimeline];
                              n[idx].desc = e.target.value;
                              n[idx].content = e.target.value; // 兼容两种字段名
                              handleChange('strategyTimeline', n);
                            }} 
                            className="h-24 text-sm"
                          />
                        </FormItem>
                        <ImageSelector 
                          label="节点配图 (可选)" 
                          value={item.img} 
                          onChange={img => {
                            const n = [...strategyTimeline];
                            n[idx].img = img;
                            handleChange('strategyTimeline', n);
                          }} 
                          library={imageLib} 
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-xl text-gray-6">
                  <Clock className="w-12 h-12 mx-auto mb-md text-gray-4" />
                  <p className="text-body">暂无发展战略时间线</p>
                  <p className="text-caption">点击"添加节点"开始创建</p>
                </div>
              )}
              </div>
            </div>
          )}

          {/* ================== 业务分布（过渡页面） ================== */}
          {activeTab === 'distribution' && (
            <div className="flex flex-col items-center justify-center py-xxl text-center">
              <div className="w-20 h-20 rounded-full bg-gray-2 flex items-center justify-center mb-lg">
                <Construction className="w-10 h-10 text-gray-5" />
              </div>
              <h3 className="text-section font-semibold text-gray-8 mb-xs">业务分布</h3>
              <p className="text-body text-gray-6 mb-md">该模块正在建设中，敬请期待...</p>
              <div className="px-md py-xs bg-gray-2 rounded-full text-caption text-gray-6">
                Coming Soon
              </div>
            </div>
          )}

          {/* ================== 工程业绩（过渡页面） ================== */}
          {activeTab === 'performance' && (
            <div className="flex flex-col items-center justify-center py-xxl text-center">
              <div className="w-20 h-20 rounded-full bg-gray-2 flex items-center justify-center mb-lg">
                <Construction className="w-10 h-10 text-gray-5" />
              </div>
              <h3 className="text-section font-semibold text-gray-8 mb-xs">工程业绩</h3>
              <p className="text-body text-gray-6 mb-md">该模块正在建设中，敬请期待...</p>
              <div className="px-md py-xs bg-gray-2 rounded-full text-caption text-gray-6">
                Coming Soon
              </div>
            </div>
          )}
      </div>
      
      {/* 底部占位块 - 仅当需要显示悬浮栏时 */}
      {shouldShowFloatingBar && <div className="h-20" aria-hidden="true" />}
      
      {/* 底部悬浮操作栏 - 仅当需要显示时 */}
      {shouldShowFloatingBar && (
        <FloatingActionBar
          status={getDisplayStatus()}
          scene="config"
          lastPublishedTime={tabLastPublishedTime.current[activeTab] || '10:30'}
          lastPublishedDate={tabLastPublishedDate.current[activeTab] || '2025-12-11 10:30'}
          onSave={handleSave}
          onSaveDraft={handleSaveDraft}
          saveText="发布更新"
          saveDraftText="保存配置"
          showDraftButton={true}
        />
      )}
      
      {/* 历史记录弹窗 */}
      <UnifiedHistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        title={`基本信息-${tabs.find(t => t.id === activeTab)?.label} - 历史记录`}
        mode="editor"
        records={generateHistoryData()}
        onRestore={(record) => {
          console.log('恢复版本:', record);
          setShowHistoryModal(false);
        }}
      />
    </div>

    {/* 时间线编辑弹窗 - 发展战略不再使用此弹窗，改为内联编辑（保留用于其他可能的用途） */}

    {/* 资质展示组编辑弹窗 */}
      <Modal 
        isOpen={isCertGroupModalOpen} 
        onClose={() => setIsCertGroupModalOpen(false)} 
        title={editingCertGroup !== null ? '编辑资质展示' : '添加资质展示'}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsCertGroupModalOpen(false)}>取消</Button>
            <Button onClick={handleSaveCertGroup}>确认</Button>
          </>
        }
      >
        <div className="space-y-md">
          <div className="grid grid-cols-2 gap-md">
            <FormItem label="资质名称" required>
              <Input 
                value={certGroupForm.title} 
                onChange={e => setCertGroupForm({...certGroupForm, title: e.target.value})} 
                placeholder="如：工程设计综合甲级资质"
              />
            </FormItem>
            <div className="grid grid-cols-2 gap-sm">
              <FormItem label="数量" required>
                <Input 
                  value={certGroupForm.count} 
                  onChange={e => setCertGroupForm({...certGroupForm, count: e.target.value})} 
                  placeholder="如：6"
                />
              </FormItem>
              <FormItem label="单位">
                <div className="flex gap-xs">
                  {['个', '项', '+'].map(unit => (
                    <button
                      key={unit}
                      onClick={() => setCertGroupForm({...certGroupForm, unit})}
                      className={`flex-1 px-sm py-xs rounded-sm border text-caption transition-colors ${
                        certGroupForm.unit === unit
                          ? 'bg-brand-light text-brand border-brand'
                          : 'bg-white text-gray-7 border-gray-4 hover:border-brand'
                      }`}
                    >
                      {unit}
                    </button>
                  ))}
                </div>
              </FormItem>
            </div>
          </div>

          {/* 从资质库选择资质 */}
          <div>
            <h4 className="text-body font-semibold text-gray-8 mb-sm">选择资质证书</h4>
            <p className="text-caption text-gray-6 mb-md">从资质库中选择资质，系统将自动使用资质证书的图片</p>
            <CertPicker 
              title="选择资质"
              category="qualification"
              selected={certGroupForm.selectedCertIds || []}
              onSelect={handleCertSelect}
              certLib={certLib}
              showAsCards={true}
            />
            
            {/* 已选择的资质图片预览 */}
            {certGroupForm.images.length > 0 && (
              <div className="mt-md">
                <h4 className="text-body font-semibold text-gray-8 mb-sm">已选择的资质证书图片</h4>
                <div className="grid grid-cols-4 gap-sm">
                  {certGroupForm.images.map(img => (
                    <div key={img.id} className="relative group aspect-[3/4]">
                      <img 
                        src={img.url} 
                        alt={img.title || '证书'} 
                        className="w-full h-full object-cover rounded-md border border-gray-4"
                      />
                      <button 
                        onClick={() => handleRemoveImageFromCertGroup(img.id)}
                        className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity text-error"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                      {img.title && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 truncate">
                          {img.title}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default PublicBasicEditor;
