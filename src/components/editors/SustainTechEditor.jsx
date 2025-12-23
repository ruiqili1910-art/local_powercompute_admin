import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Edit, Award, Lightbulb, ChevronUp, ChevronDown, Check, Search, GripVertical } from 'lucide-react';
import { Button, Input, FormItem, TextArea, ImageSelector, Modal, PageBanner, EditorStatusBar, UnifiedHistoryModal, EditorLayout } from '../ui';

// 初始数据
const INITIAL_STATS = [
  { id: 's1', value: '235', unit: '项', label: '国家授权专利' },
  { id: 's2', value: '32', unit: '项', label: '发明专利' },
  { id: 's3', value: '73', unit: '项', label: '国家级工法' },
  { id: 's4', value: '22', unit: '项', label: '科技进步奖' },
  { id: 's5', value: '34', unit: '项', label: '软件著作权' },
  { id: 's6', value: '200+', unit: '', label: '成熟工程技术' },
  { id: 's7', value: '4000+', unit: '', label: '先进施工机械' },
  { id: 's8', value: '600+', unit: '', label: '成功工程项目' },
];

// 初始模块数据（类似实业投资）
const INITIAL_MODULES = [
  {
    id: 'mod_1',
    title: '持续创新 推动高质量发展',
    content: '公司不断提高知识产权的创造、运用和保护能力，在公司主营业务相关的重点领域形成了一批核心专利技术和专有技术，通过自主研发、集成创新等方式形成的技术和工程成果荣获诸多奖励。',
    highlights: ['公司先后获评四川企业技术创新发展能力100强企业', '四川企业技术创新发展质量20强企业', '并多次荣获行业科技创新先进单位等荣誉'],
    image: '',
    imagePosition: 'right'
  },
  {
    id: 'mod_2',
    title: '领先技术 支撑重大项目实施',
    content: '公司拥有系列的成熟工程技术和施工工艺200余项，各类先进施工机械4000余台（套），具备3000吨以上单体设备的吊装能力。',
    highlights: ['在超大型装设备的运输和吊装领域具有显著技术优势', '掌握特殊材质焊接、压力容器现场组焊和热处理核心技术', '具备大型工业炉安装、超高轻钢结构滑移施工能力', '拥有大型化工装置整体建设及试车一体化解决方案', '在国内外成功执行各类型工程项目600余个', '具备执行千亿级超大型一体化工程项目的成功经验'],
    image: '',
    imagePosition: 'left'
  },
];

const SustainTechEditor = ({ data = {}, onChange, imageLib = [], certLib = {} }) => {
  const [stats, setStats] = useState(data.stats || INITIAL_STATS);
  const [modules, setModules] = useState(data.modules || INITIAL_MODULES);
  const [selectedHonorIds, setSelectedHonorIds] = useState(data.selectedHonorIds || []);
  
  // 弹窗状态
  const [isStatModalOpen, setIsStatModalOpen] = useState(false);
  const [isHonorPickerOpen, setIsHonorPickerOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [statForm, setStatForm] = useState({ value: '', unit: '项', label: '' });
  const [searchKeyword, setSearchKeyword] = useState('');

  // 从全局资质库获取荣誉信息
  const allHonors = certLib.honorDetails || [];
  const selectedHonors = allHonors.filter(h => selectedHonorIds.includes(h.id));

  // EditorLayout 状态管理
  const savedDataRef = useRef(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastPublishedTime, setLastPublishedTime] = useState(null);
  const [lastPublishedDate, setLastPublishedDate] = useState(null);

  // 初始化保存的数据引用
  useEffect(() => {
    savedDataRef.current = JSON.stringify({ stats, modules, selectedHonorIds });
    const saved = localStorage.getItem('sus_tech_lastPublished');
    if (saved) {
      const parsed = JSON.parse(saved);
      setLastPublishedTime(parsed.time || '10:30');
      setLastPublishedDate(parsed.date || '2025-12-11 10:30');
    }
  }, []);

  // 检测未保存的更改
  useEffect(() => {
    const current = JSON.stringify({ stats, modules, selectedHonorIds });
    setHasUnsavedChanges(current !== savedDataRef.current);
  }, [stats, modules, selectedHonorIds]);

  const updateData = (newStats, newModules, newSelectedIds) => {
    onChange && onChange({ stats: newStats, modules: newModules, selectedHonorIds: newSelectedIds });
  };

  const handleSaveDraft = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    savedDataRef.current = JSON.stringify({ stats, modules, selectedHonorIds });
    setHasUnsavedChanges(false);
    alert('配置已保存');
  };

  const handleSave = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    savedDataRef.current = JSON.stringify({ stats, modules, selectedHonorIds });
    setHasUnsavedChanges(false);
    const now = new Date();
    const time = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    const date = now.toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    setLastPublishedTime(time);
    setLastPublishedDate(date);
    localStorage.setItem('sus_tech_lastPublished', JSON.stringify({ time, date }));
    alert('配置已发布');
  };

  const generateHistory = () => {
    return [
      { id: 'v1', time: '2025-12-11 10:30', description: '更新了科技创新配置', operator: 'admin', status: 'published' },
      { id: 'v2', time: '2025-12-10 14:25', description: '编辑了科技创新', operator: 'admin', status: 'draft' },
      { id: 'v3', time: '2025-12-09 10:00', description: '首次创建科技创新', operator: 'admin', status: 'published' },
    ];
  };

  // ================== 数据展示管理 ==================
  const handleAddStat = () => {
    setEditingIndex(null);
    setStatForm({ value: '', unit: '项', label: '' });
    setIsStatModalOpen(true);
  };

  const handleEditStat = (stat, index) => {
    setEditingIndex(index);
    setStatForm({ value: stat.value, unit: stat.unit, label: stat.label });
    setIsStatModalOpen(true);
  };

  const handleSaveStat = () => {
    if (!statForm.value || !statForm.label) return alert('请填写完整');
    const newStats = editingIndex !== null
      ? stats.map((s, i) => i === editingIndex ? { ...s, ...statForm } : s)
      : [...stats, { id: `s${Date.now()}`, ...statForm }];
    setStats(newStats);
    updateData(newStats, modules, selectedHonorIds);
    setIsStatModalOpen(false);
  };

  const handleDeleteStat = (index) => {
    if (confirm('确定删除？')) {
      const newStats = stats.filter((_, i) => i !== index);
      setStats(newStats);
      updateData(newStats, modules, selectedHonorIds);
    }
  };

  // ================== 模块管理（与业务领域业务模块完全一样） ==================
  const [editingModule, setEditingModule] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [initialModule, setInitialModule] = useState(null);
  const [isSavingModule, setIsSavingModule] = useState(false);
  const [hasLocalChanges, setHasLocalChanges] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState(null);
  const [showModuleHistoryModal, setShowModuleHistoryModal] = useState(false);
  
  // 添加模块
  const handleAddModule = () => {
    const newModule = {
      id: `mod_${Date.now()}`,
      title: '新模块标题',
      content: '请输入模块内容描述...',
      highlights: ['亮点1', '亮点2'],
      image: '',
      imagePosition: modules.length % 2 === 0 ? 'left' : 'right'
    };
    setEditingModule(newModule);
    setInitialModule(newModule);
    setHasLocalChanges(true);
    setIsSavingModule(false);
    setLastSavedTime(null);
    setIsModalOpen(true);
  };

  // 编辑模块
  const handleEditModule = (mod) => {
    const moduleData = { ...mod };
    setEditingModule(moduleData);
    setInitialModule(moduleData);
    setHasLocalChanges(false);
    setIsSavingModule(false);
    setLastSavedTime(new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }));
    setIsModalOpen(true);
  };
  
  // 监听用户编辑
  useEffect(() => {
    if (editingModule && initialModule) {
      const hasChanges = JSON.stringify(editingModule) !== JSON.stringify(initialModule);
      setHasLocalChanges(hasChanges);
    }
  }, [editingModule, initialModule]);
  
  // 更新编辑中的模块
  const updateEditingModule = (updater) => {
    setEditingModule(prev => {
      const updated = typeof updater === 'function' ? updater(prev) : updater;
      return updated;
    });
  };
  
  // 保存模块
  const handleSaveModule = async () => {
    if (!editingModule.title) {
      alert('请填写模块标题');
      return;
    }
    
    setIsSavingModule(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const exists = modules.find(m => m.id === editingModule.id);
    const newModules = exists
      ? modules.map(m => m.id === editingModule.id ? editingModule : m)
      : [...modules, editingModule];
    
    setModules(newModules);
    updateData(stats, newModules, selectedHonorIds);
    
    setIsSavingModule(false);
    setHasLocalChanges(false);
    setLastSavedTime(new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }));
    setIsModalOpen(false);
    setEditingModule(null);
    setInitialModule(null);
  };
  
  // 关闭编辑弹窗
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingModule(null);
    setInitialModule(null);
    setHasLocalChanges(false);
    setIsSavingModule(false);
    setLastSavedTime(null);
  };
  
  // 生成模块历史记录
  const generateModuleHistory = (moduleTitle) => [
    { id: 'v1', time: '2024-03-20 14:30', description: `更新了《${moduleTitle}》的内容`, operator: 'admin', status: 'published' },
    { id: 'v2', time: '2024-03-20 14:25', description: `编辑了《${moduleTitle}》`, operator: 'admin', status: 'draft' },
    { id: 'v3', time: '2024-03-15 10:00', description: `首次创建《${moduleTitle}》`, operator: 'admin', status: 'published' },
  ];

  // 删除模块
  const handleDeleteModule = (id) => {
    if (confirm('确定删除此模块吗？')) {
      const newModules = modules.filter(m => m.id !== id);
      setModules(newModules);
      updateData(stats, newModules, selectedHonorIds);
    }
  };

  // 移动模块
  const handleMoveModule = (index, direction) => {
    const newModules = [...modules];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= modules.length) return;
    [newModules[index], newModules[targetIndex]] = [newModules[targetIndex], newModules[index]];
    setModules(newModules);
    updateData(stats, newModules, selectedHonorIds);
  };

  // 拖拽排序
  const handleDragStart = (index) => setDraggedIndex(index);
  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) setDragOverIndex(index);
  };
  const handleDrop = (index) => {
    if (draggedIndex !== null && draggedIndex !== index) {
      const newModules = [...modules];
      const [dragged] = newModules.splice(draggedIndex, 1);
      newModules.splice(index, 0, dragged);
      setModules(newModules);
      updateData(stats, newModules, selectedHonorIds);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };
  const handleDragEnd = () => { setDraggedIndex(null); setDragOverIndex(null); };

  // ================== 荣誉选择管理 ==================
  const toggleHonorSelection = (id) => {
    const newIds = selectedHonorIds.includes(id)
      ? selectedHonorIds.filter(i => i !== id)
      : [...selectedHonorIds, id];
    setSelectedHonorIds(newIds);
  };

  const handleConfirmHonorSelection = () => {
    updateData(stats, modules, selectedHonorIds);
    setIsHonorPickerOpen(false);
  };

  const removeSelectedHonor = (id) => {
    const newIds = selectedHonorIds.filter(i => i !== id);
    setSelectedHonorIds(newIds);
    updateData(stats, modules, newIds);
  };

  const filteredHonors = allHonors.filter(h => 
    !searchKeyword || (h.title || h.name || '').toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <>
      <EditorLayout
        title="科技创新"
        description="管理科技创新页面内容，包括核心成果数据、图文模块和荣誉资质展示。"
        pageKey="sus_tech"
        onSave={handleSave}
        onSaveDraft={handleSaveDraft}
        historyData={generateHistory()}
        hasUnsavedChanges={hasUnsavedChanges}
        saveText="发布更新"
        draftText="保存配置"
      >
        <div className="space-y-xl">
          {/* ================== 核心科技成果概览 ================== */}
          <div className="space-y-md">
            <div className="flex items-center justify-between">
              <h3 className="text-body font-semibold text-gray-8">核心科技成果概览</h3>
              <Button variant="add" onClick={handleAddStat}>
                <Plus className="w-4 h-4" /> 添加数据
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
              {stats.map((stat, index) => (
                <div key={stat.id} className="bg-gray-2 rounded-lg p-md text-center group relative">
                  <div className="w-10 h-10 mx-auto mb-sm rounded-full bg-brand-light flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-brand" />
                  </div>
                  <div className="flex items-baseline justify-center gap-xxs">
                    <span className="text-title font-bold text-brand">{stat.value}</span>
                    <span className="text-caption text-gray-6">{stat.unit}</span>
                  </div>
                  <div className="text-caption text-gray-6 mt-xxs">{stat.label}</div>
                  <div className="absolute top-2 right-2 flex gap-xxs opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEditStat(stat, index)} className="p-1 text-gray-6 hover:text-brand"><Edit className="w-3 h-3" /></button>
                    <button onClick={() => handleDeleteStat(index)} className="p-1 text-gray-6 hover:text-error"><Trash2 className="w-3 h-3" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-4" />

          {/* ================== 科技创新成果模块（与业务领域业务模块完全一样） ================== */}
          <div className="space-y-md border-t border-gray-4 pt-lg">
            <div className="flex items-center justify-between mb-lg">
              <div>
                <h3 className="text-section font-semibold text-gray-8">科技创新成果</h3>
                <p className="text-caption text-gray-6 mt-xxs">管理科技创新成果模块，可拖拽排序</p>
              </div>
            </div>

            <div className="space-y-md">
              {modules.map((mod, index) => (
                <div 
                  key={mod.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={() => handleDrop(index)}
                  onDragEnd={handleDragEnd}
                  className={`group bg-gray-2 rounded-md border transition-all ${
                    draggedIndex === index ? 'opacity-50 border-brand' : 
                    dragOverIndex === index ? 'border-brand' : 'border-gray-4 hover:border-gray-5'
                  }`}
                >
                  <div className="flex items-start gap-md p-md">
                    {/* 拖拽手柄 */}
                    <div className="flex flex-col items-center gap-xxs pt-1 cursor-move opacity-50 group-hover:opacity-100">
                      <GripVertical className="w-5 h-5 text-gray-5" />
                      <span className="text-caption text-gray-5 font-medium">{index + 1}</span>
                    </div>

                    {/* 模块预览图 */}
                    <div 
                      className="w-32 h-20 rounded-sm bg-gray-3 bg-cover bg-center flex-shrink-0"
                      style={{ backgroundImage: mod.image ? `url(${mod.image})` : undefined }}
                    />

                    {/* 模块信息 */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-body font-medium text-gray-8 line-clamp-1">{mod.title}</h4>
                      <p className="text-caption text-gray-6 mt-xxs line-clamp-2">{mod.content}</p>
                      <div className="flex items-center gap-xs mt-xs flex-wrap">
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-normal ${
                          mod.imagePosition === 'left' ? 'bg-[#EFF6FF] text-[#155DFC]' : 'bg-[#FEF3C7] text-[#D97706]'
                        }`}>
                          图片{mod.imagePosition === 'left' ? '左侧' : '右侧'}
                        </span>
                        <span className="text-caption text-gray-5">{mod.highlights?.length || 0} 个亮点</span>
                      </div>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex items-center gap-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleMoveModule(index, 'up')} 
                        disabled={index === 0}
                        className="p-xs rounded-sm text-gray-6 hover:text-brand hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleMoveModule(index, 'down')} 
                        disabled={index === modules.length - 1}
                        className="p-xs rounded-sm text-gray-6 hover:text-brand hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEditModule(mod)}
                        className="px-sm py-xs rounded-sm text-caption font-medium text-brand bg-white hover:bg-brand-light"
                      >
                        编辑
                      </button>
                      <button 
                        onClick={() => handleDeleteModule(mod.id)}
                        className="p-xs rounded-sm text-gray-6 hover:text-error hover:bg-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 添加模块按钮 */}
            <Button 
              variant="add"
              onClick={handleAddModule}
              className="w-full mt-lg"
            >
              <Plus className="w-4 h-4" />
              添加模块
            </Button>
          </div>
          
          {/* 模块编辑弹窗 */}
          <Modal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            title={modules.find(m => m.id === editingModule?.id) ? '编辑模块' : '新增模块'}
            size="xl"
            footer={null}
          >
            {editingModule && (
              <div className="flex flex-col h-[75vh]">
                <div className="flex-1 overflow-y-auto pr-2">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
                    {/* 左侧：基本信息 */}
                    <div className="space-y-md">
                      <FormItem label="模块标题" required>
                        <Input 
                          value={editingModule.title || ''} 
                          onChange={e => updateEditingModule({...editingModule, title: e.target.value})} 
                          placeholder="如：持续创新 推动高质量发展"
                        />
                      </FormItem>
                      
                      <FormItem label="模块内容">
                        <TextArea 
                          value={editingModule.content || ''} 
                          onChange={e => updateEditingModule({...editingModule, content: e.target.value})} 
                          rows={6}
                          placeholder="请输入模块详细描述..."
                        />
                      </FormItem>

                      {/* 亮点列表 */}
                      <FormItem label="亮点列表">
                        <div className="space-y-xs">
                          {(editingModule.highlights || []).map((hl, idx) => (
                            <div key={idx} className="flex items-center gap-xs">
                              <span className="w-5 h-5 rounded-full bg-brand text-white text-[10px] flex items-center justify-center flex-shrink-0">•</span>
                              <Input 
                                value={hl} 
                                onChange={e => {
                                  const newHighlights = [...(editingModule.highlights || [])];
                                  newHighlights[idx] = e.target.value;
                                  updateEditingModule({...editingModule, highlights: newHighlights});
                                }}
                                className="flex-1"
                              />
                              <button 
                                onClick={() => {
                                  const newHighlights = [...(editingModule.highlights || [])];
                                  newHighlights.splice(idx, 1);
                                  updateEditingModule({...editingModule, highlights: newHighlights});
                                }}
                                className="p-xs text-gray-5 hover:text-error"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          <button 
                            onClick={() => updateEditingModule({...editingModule, highlights: [...(editingModule.highlights || []), '新亮点']})}
                            className="w-full py-xs border border-dashed border-gray-4 rounded-sm text-caption text-gray-6 hover:text-brand hover:border-brand"
                          >
                            + 添加亮点
                          </button>
                        </div>
                      </FormItem>
                    </div>

                    {/* 右侧：配图设置 */}
                    <div className="space-y-md">
                      <ImageSelector
                        label="模块配图"
                        value={editingModule.image ? { url: editingModule.image } : null}
                        onChange={img => updateEditingModule({...editingModule, image: img?.url || ''})}
                        library={imageLib}
                      />

                      <FormItem label="图片位置">
                        <div className="flex gap-md">
                          <label className={`flex-1 flex items-center gap-sm p-md rounded-md cursor-pointer transition-all ${
                            editingModule.imagePosition === 'left' ? 'bg-brand-light border border-brand' : 'bg-gray-2 border border-gray-4 hover:bg-gray-3'
                          }`}>
                            <input 
                              type="radio" 
                              checked={editingModule.imagePosition === 'left'} 
                              onChange={() => updateEditingModule({...editingModule, imagePosition: 'left'})} 
                              className="w-4 h-4" 
                            />
                            <span className={`text-body ${editingModule.imagePosition === 'left' ? 'text-brand' : 'text-gray-8'}`}>图片在左</span>
                          </label>
                          <label className={`flex-1 flex items-center gap-sm p-md rounded-md cursor-pointer transition-all ${
                            editingModule.imagePosition === 'right' ? 'bg-brand-light border border-brand' : 'bg-gray-2 border border-gray-4 hover:bg-gray-3'
                          }`}>
                            <input 
                              type="radio" 
                              checked={editingModule.imagePosition === 'right'} 
                              onChange={() => updateEditingModule({...editingModule, imagePosition: 'right'})} 
                              className="w-4 h-4" 
                            />
                            <span className={`text-body ${editingModule.imagePosition === 'right' ? 'text-brand' : 'text-gray-8'}`}>图片在右</span>
                          </label>
                        </div>
                      </FormItem>

                      {/* 预览 */}
                      <div className="p-md bg-gray-2 rounded-md">
                        <p className="text-caption text-gray-6 mb-sm">布局预览</p>
                        <div className={`flex gap-sm ${editingModule.imagePosition === 'right' ? 'flex-row-reverse' : ''}`}>
                          <div 
                            className="w-24 h-16 rounded-xs bg-gray-3 bg-cover bg-center flex-shrink-0"
                            style={{ backgroundImage: editingModule.image ? `url(${editingModule.image})` : undefined }}
                          />
                          <div className="flex-1">
                            <div className="h-3 bg-gray-4 rounded w-3/4 mb-xs"></div>
                            <div className="h-2 bg-gray-4 rounded w-full mb-xxs"></div>
                            <div className="h-2 bg-gray-4 rounded w-5/6"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* 底部状态栏 */}
                <EditorStatusBar
                  isSaving={isSavingModule}
                  hasLocalChanges={hasLocalChanges}
                  lastSavedTime={lastSavedTime}
                  onSave={handleSaveModule}
                  onHistoryClick={() => setShowModuleHistoryModal(true)}
                  showHistory={editingModule.id && modules.find(m => m.id === editingModule.id) ? true : false}
                  saveButtonText="保存模块"
                />
              </div>
            )}
          </Modal>
          
          {/* 模块版本历史弹窗 */}
          <UnifiedHistoryModal
            isOpen={showModuleHistoryModal}
            onClose={() => setShowModuleHistoryModal(false)}
            title={editingModule ? `《${editingModule.title}》 - 版本历史` : '版本历史'}
            mode="editor"
            records={editingModule ? generateModuleHistory(editingModule.title) : []}
            onRestore={(record) => {
              console.log('恢复版本:', record);
              setShowModuleHistoryModal(false);
            }}
          />

          <div className="border-t border-gray-4" />

          {/* ================== 荣誉资质展示（可选择） ================== */}
          <div className="space-y-md">
            <div className="flex items-center justify-between">
              <h3 className="text-body font-semibold text-gray-8">荣誉资质展示</h3>
              <Button variant="secondary" onClick={() => setIsHonorPickerOpen(true)}>
                <Plus className="w-4 h-4" /> 选择荣誉
              </Button>
            </div>
            {selectedHonors.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-md">
                {selectedHonors.map((honor) => (
                  <div key={honor.id} className="bg-gray-2 rounded-lg overflow-hidden group relative">
                    <div className="aspect-square bg-yellow-50 flex items-center justify-center p-md">
                      {(honor.image || honor.img) ? (
                        <img src={honor.image || honor.img} alt="" className="w-full h-full object-contain" />
                      ) : (
                        <Award className="w-16 h-16 text-yellow-300" />
                      )}
                    </div>
                    <div className="p-sm text-center">
                      <div className="text-body font-semibold text-gray-8 line-clamp-2">{honor.title || honor.name || ''}</div>
                      {(honor.issuer || honor.issuingAuthority) && <div className="text-caption text-gray-6">{honor.issuer || honor.issuingAuthority}</div>}
                    </div>
                    <button 
                      onClick={() => removeSelectedHonor(honor.id)}
                      className="absolute top-2 right-2 p-1.5 bg-white rounded shadow text-gray-6 hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-lg text-gray-6 bg-gray-2 rounded-lg">
                <Award className="w-12 h-12 mx-auto mb-sm text-gray-4" />
                <p className="text-body">暂无展示的荣誉</p>
                <p className="text-caption mb-md">点击「选择荣誉」从全局资质荣誉库中选取</p>
              </div>
            )}
          </div>
        </div>
      </EditorLayout>

      {/* 数据弹窗 */}
      <Modal isOpen={isStatModalOpen} onClose={() => setIsStatModalOpen(false)} title={editingIndex !== null ? '编辑数据' : '添加数据'}
        footer={<><Button variant="secondary" onClick={() => setIsStatModalOpen(false)}>取消</Button><Button onClick={handleSaveStat}>确认</Button></>}>
        <div className="space-y-md">
          <div className="grid grid-cols-2 gap-sm">
            <FormItem label="数值" required><Input value={statForm.value} onChange={e => setStatForm({...statForm, value: e.target.value})} placeholder="如：235" /></FormItem>
            <FormItem label="单位"><Input value={statForm.unit} onChange={e => setStatForm({...statForm, unit: e.target.value})} placeholder="如：项" /></FormItem>
          </div>
          <FormItem label="标签" required><Input value={statForm.label} onChange={e => setStatForm({...statForm, label: e.target.value})} placeholder="如：国家授权专利" /></FormItem>
        </div>
      </Modal>


      {/* 荣誉选择弹窗 */}
      <Modal isOpen={isHonorPickerOpen} onClose={() => setIsHonorPickerOpen(false)} title="选择要展示的荣誉" size="lg"
        footer={<><Button variant="secondary" onClick={() => setIsHonorPickerOpen(false)}>取消</Button><Button onClick={handleConfirmHonorSelection}>确认选择 ({selectedHonorIds.length})</Button></>}>
        <div className="space-y-md">
          {/* 搜索 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-5" />
            <Input 
              value={searchKeyword} 
              onChange={e => setSearchKeyword(e.target.value)} 
              placeholder="搜索荣誉名称..." 
              className="pl-9"
            />
          </div>
          
          {/* 荣誉列表 */}
          {filteredHonors.length > 0 ? (
            <div className="grid grid-cols-2 gap-sm max-h-[400px] overflow-y-auto">
              {filteredHonors.map((honor) => {
                const isSelected = selectedHonorIds.includes(honor.id);
                return (
                  <div 
                    key={honor.id}
                    onClick={() => toggleHonorSelection(honor.id)}
                    className={`flex items-center gap-sm p-sm rounded-lg border cursor-pointer transition-all ${
                      isSelected ? 'border-brand bg-brand-light' : 'border-gray-4 hover:border-brand'
                    }`}
                  >
                    <div className="w-12 h-12 bg-yellow-50 rounded flex items-center justify-center flex-shrink-0">
                      {(honor.image || honor.img) ? (
                        <img src={honor.image || honor.img} alt="" className="w-full h-full object-contain" />
                      ) : (
                        <Award className="w-6 h-6 text-yellow-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-body font-medium text-gray-8 truncate">{honor.title || honor.name || ''}</div>
                      {(honor.issuer || honor.issuingAuthority) && <div className="text-caption text-gray-6 truncate">{honor.issuer || honor.issuingAuthority}</div>}
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      isSelected ? 'border-brand bg-brand' : 'border-gray-4'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-lg text-gray-6">
              <Award className="w-12 h-12 mx-auto mb-sm text-gray-4" />
              <p>暂无荣誉数据</p>
              <p className="text-caption">请先在「全局资源库 - 资质荣誉库」中添加荣誉</p>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default SustainTechEditor;
