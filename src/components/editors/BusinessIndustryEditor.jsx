import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, GripVertical, ChevronUp, ChevronDown } from 'lucide-react';
import { FormItem, Input, TextArea, ImageSelector, EditorLayout, Button, Modal, RichTextEditor, EditorStatusBar, UnifiedHistoryModal } from '../ui';

// 初始模块数据
const INITIAL_MODULES = [
  {
    id: 'mod_1',
    title: '聚焦资源保障的高端化学品',
    content: '我们致力于高端无机精细化学品的自主研发与生产，以突破关键材料进口依赖为核心使命，打造资源高效、工艺领先、绿色可持续的功能材料解决方案。通过水滑石功能材料的全链条布局，构建国内领先、安全自主的精细化学品供应体系，为提升国家产业链稳定性和竞争力贡献力量。',
    highlights: ['国际领先工艺应用与产业化转化', '五大类高性能助剂自主可控供应', '产学研协同与技术源头布局', '全品类水滑石材料生产高地建设'],
    image: '/images/industry/chemistry.jpg',
    imagePosition: 'left'
  },
  {
    id: 'mod_2',
    title: '聚焦以先进环保科技为引领的循环经济',
    content: '我们致力于发展先进的循环经济业务，以"固废减量化、资源化、无害化"为核心目标，打造覆盖废弃物全生命周期的资源循环解决方案。通过构建CC7MART科技平台与品牌体系，整合国际领先的固废处理与化学回收技术，我们助力客户实现从废弃塑料回收、高效分拣、化学再生到高值利用的完整闭环，推动产业绿色低碳转型，为"无废城市"建设提供关键支撑。',
    highlights: ['CC7MART一体化资源循环平台建设', '重点区域循环经济产业布局', '重庆潼南化学回收示范项目推进', '塑料污染系统解决方案创新'],
    image: '/images/industry/recycle.jpg',
    imagePosition: 'right'
  },
  {
    id: 'mod_3',
    title: '聚焦以前沿科技创新为引擎的绿色能源',
    content: '我们致力于成为绿色能源变革的引领者，以科技创新为核心驱动力，积极构建多元化、高质量的清洁能源资产组合。通过链接全球领先的技术与产业资源，我们战略布局风能、太阳能、储能及绿色燃料等关键领域，致力于提供高效、可靠的清洁能源解决方案，推动全球能源结构向绿色低碳转型，践行可持续发展的坚定承诺。',
    highlights: ['多元化清洁能源资产组合构建', '全球先进技术与合作资源链接', '全周期运营效率与价值提升', '绿色燃料创新应用与产业拓展'],
    image: '/images/industry/energy.jpg',
    imagePosition: 'left'
  }
];

// 默认页面标题内容（Markdown格式）
const DEFAULT_PAGE_TITLE = `坚持实业兴企战略，以<span style="color:#155DFC">**"T+产业"**</span>为引领
积极围绕 <span style="color:#D4A017">**"三个聚焦"**</span>进行业务布局`;

const BusinessIndustryEditor = ({ data, onChange, imageLib }) => {
  // 页面标题状态（富文本）
  const [pageTitle, setPageTitle] = useState(data?.pageTitle || DEFAULT_PAGE_TITLE);
  
  // 模块列表状态
  const [modules, setModules] = useState(data?.modules || INITIAL_MODULES);
  
  // 编辑弹窗状态
  const [editingModule, setEditingModule] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 拖拽状态
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  
  // ==================== 配置类页面状态管理 ====================
  const savedDataRef = useRef(JSON.stringify({ pageTitle, modules }));
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  useEffect(() => {
    setHasUnsavedChanges(JSON.stringify({ pageTitle, modules }) !== savedDataRef.current);
  }, [pageTitle, modules]);
  
  // 保存配置（草稿）
  const handleSaveDraft = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    onChange({ ...data, pageTitle, modules });
    savedDataRef.current = JSON.stringify({ pageTitle, modules });
    setHasUnsavedChanges(false);
    console.log('实业投资配置已保存:', { pageTitle, modules });
  };
  
  // 发布上线
  const handleSave = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    onChange({ ...data, pageTitle, modules });
    savedDataRef.current = JSON.stringify({ pageTitle, modules });
    setHasUnsavedChanges(false);
    console.log('实业投资配置已发布:', { pageTitle, modules });
  };
  
  // ==================== 编辑弹窗状态管理 ====================
  const [initialModule, setInitialModule] = useState(null);  // 初始值，用于对比是否有修改
  const [isSavingModule, setIsSavingModule] = useState(false);       // 保存中
  const [hasLocalChanges, setHasLocalChanges] = useState(false); // 用户是否有未保存的修改
  const [lastSavedTime, setLastSavedTime] = useState(null); // 上次保存时间
  const [showModuleHistoryModal, setShowModuleHistoryModal] = useState(false); // 模块历史记录

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
    setInitialModule(newModule);  // 保存初始值用于对比
    setHasLocalChanges(true); // 新模块默认为未保存状态
    setIsSavingModule(false);
    setLastSavedTime(null);   // 新模块没有保存时间
    setIsModalOpen(true);
  };

  // 编辑模块
  const handleEditModule = (mod) => {
    const moduleData = { ...mod };
    setEditingModule(moduleData);
    setInitialModule(moduleData);  // 保存初始值用于对比
    setHasLocalChanges(false); // 重置修改状态
    setIsSavingModule(false);
    setLastSavedTime(new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }));
    setIsModalOpen(true);
  };
  
  // 监听用户编辑，对比初始值和当前值
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
    
    // 模拟异步保存
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const exists = modules.find(m => m.id === editingModule.id);
    if (exists) {
      setModules(modules.map(m => m.id === editingModule.id ? editingModule : m));
    } else {
      setModules([...modules, editingModule]);
    }
    
    // 保存后关闭弹窗
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
      setModules(modules.filter(m => m.id !== id));
    }
  };

  // 移动模块
  const handleMoveModule = (index, direction) => {
    const newModules = [...modules];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= modules.length) return;
    [newModules[index], newModules[targetIndex]] = [newModules[targetIndex], newModules[index]];
    setModules(newModules);
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
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };
  const handleDragEnd = () => { setDraggedIndex(null); setDragOverIndex(null); };

  return (
    <EditorLayout
      title="实业投资"
      description="管理实业投资页面的标题与业务模块内容，支持富文本编辑与模块排序。"
      pageKey="business_industry"
      onSave={handleSave}
      onSaveDraft={handleSaveDraft}
      hasUnsavedChanges={hasUnsavedChanges}
      historyData={[
        { id: 'h1', time: '2024-03-20 14:30', description: '更新了页面标题和业务模块', operator: 'admin', status: 'published' },
        { id: 'h2', time: '2024-03-18 10:00', description: '修改了业务模块顺序', operator: 'admin', status: 'published' },
      ]}
    >

      {/* 页面标题编辑 */}
      <div className="space-y-md">
        <h3 className="text-section font-semibold text-gray-8 mb-md">页面标题编辑</h3>
        <p className="text-caption text-gray-6 mb-lg">
          编辑页面主标题，支持 Markdown 语法。使用 **文字** 设置粗体，使用颜色按钮设置彩色文字。
        </p>
        
        <RichTextEditor
          value={pageTitle}
          onChange={setPageTitle}
          placeholder="在此输入页面标题内容（支持 Markdown）"
          minHeight={120}
        />
      </div>

      {/* 模块列表 */}
      <div className="space-y-md border-t border-gray-4 pt-lg">
        <div className="flex items-center justify-between mb-lg">
          <div>
            <h3 className="text-section font-semibold text-gray-8">业务模块</h3>
            <p className="text-caption text-gray-6 mt-xxs">管理"三个聚焦"业务模块，可拖拽排序</p>
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
                      placeholder="如：聚焦资源保障的高端化学品"
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
    </EditorLayout>
  );
};

export default BusinessIndustryEditor;
