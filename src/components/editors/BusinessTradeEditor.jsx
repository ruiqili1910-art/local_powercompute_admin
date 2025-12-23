import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, GripVertical, ChevronUp, ChevronDown } from 'lucide-react';
import { FormItem, Input, TextArea, ImageSelector, EditorLayout, Button, Modal, EditorStatusBar, UnifiedHistoryModal } from '../ui';

// 工程采购初始模块
const INITIAL_PROCUREMENT_MODULES = [
  {
    id: 'proc_1',
    title: '生产设备',
    content: '公司积极响应国家能源发展战略，整合国内外优质原油资源，与境外多区域、多国别超大型能源供给源头方建立了良好的合作基础，和国内多家超大型炼油厂形成深度、稳定的合作关系，为保障国家能源安全作出应有贡献。公司立足境外石化工程建设，不断拓展境外石化能源类源头产品，积极推动集团及公司能化产业的高质量发展。',
    image: '/images/trade/production.jpg',
    imagePosition: 'right'
  },
  {
    id: 'proc_2',
    title: '工程物资',
    content: '借助与上游能源企业的战略合作机制和紧密关系，聚焦获取上游资源，同时投身中游基础设施建设，积极参与、投资工业项目建设，利用产业链平台发展国际贸易，提高国际气源供应能力',
    image: '/images/trade/lng.jpg',
    imagePosition: 'right'
  },
  {
    id: 'proc_3',
    title: '工程设备',
    content: '公司以进口蒙古国焦煤、动力煤为主，和上游的ETT、ER等大型煤业公司有良好合作基础，通过甘其毛都、满都拉、二连浩特等口岸向境内客户供应优质煤炭资源。公司国内有众多大型钢厂、焦化厂、电厂及贸易商客户。',
    image: '/images/trade/coal.jpg',
    imagePosition: 'left'
  }
];

// 大宗贸易初始模块
const INITIAL_TRADE_MODULES = [
  {
    id: 'trade_1',
    title: '原油贸易',
    content: '公司积极响应国家能源发展战略，整合国内外优质原油资源，与境外多区域、多国别超大型能源供给源头方建立了良好的合作基础。',
    image: '/images/trade/oil.jpg',
    imagePosition: 'right'
  },
  {
    id: 'trade_2',
    title: 'LNG贸易',
    content: '借助与上游能源企业的战略合作机制和紧密关系，聚焦获取上游资源，利用产业链平台发展国际贸易，提高国际气源供应能力。',
    image: '/images/trade/lng_trade.jpg',
    imagePosition: 'right'
  },
  {
    id: 'trade_3',
    title: '煤炭贸易',
    content: '公司以进口蒙古国焦煤、动力煤为主，和上游的ETT、ER等大型煤业公司有良好合作基础，向境内客户供应优质煤炭资源。',
    image: '/images/trade/coal_trade.jpg',
    imagePosition: 'left'
  }
];

const BusinessTradeEditor = ({ data, onChange, imageLib }) => {
  const [activeTab, setActiveTab] = useState('procurement');
  
  // 工程采购模块
  const [procurementModules, setProcurementModules] = useState(data?.procurement?.modules || INITIAL_PROCUREMENT_MODULES);
  
  // 大宗贸易模块
  const [tradeModules, setTradeModules] = useState(data?.trade?.modules || INITIAL_TRADE_MODULES);
  
  // 编辑弹窗状态
  const [editingModule, setEditingModule] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 拖拽状态
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  // 获取当前 Tab 的模块
  const currentModules = activeTab === 'procurement' ? procurementModules : tradeModules;
  const setCurrentModules = activeTab === 'procurement' ? setProcurementModules : setTradeModules;
  
  // ==================== 配置类页面状态管理 ====================
  const savedDataRef = useRef(JSON.stringify({ procurementModules, tradeModules }));
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  useEffect(() => {
    setHasUnsavedChanges(JSON.stringify({ procurementModules, tradeModules }) !== savedDataRef.current);
  }, [procurementModules, tradeModules]);
  
  // 保存配置（草稿）
  const handleSaveDraft = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    onChange({ 
      ...data, 
      procurement: { ...data?.procurement, modules: procurementModules },
      trade: { ...data?.trade, modules: tradeModules }
    });
    savedDataRef.current = JSON.stringify({ procurementModules, tradeModules });
    setHasUnsavedChanges(false);
    console.log('国际贸易配置已保存:', { procurementModules, tradeModules });
  };
  
  // 发布上线
  const handleSave = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    onChange({ 
      ...data, 
      procurement: { ...data?.procurement, modules: procurementModules },
      trade: { ...data?.trade, modules: tradeModules }
    });
    savedDataRef.current = JSON.stringify({ procurementModules, tradeModules });
    setHasUnsavedChanges(false);
    console.log('国际贸易配置已发布:', { procurementModules, tradeModules });
  };
  
  // ==================== 编辑弹窗状态管理 ====================
  const [initialModule, setInitialModule] = useState(null);  // 初始值，用于对比是否有修改
  const [isSavingModule, setIsSavingModule] = useState(false);       // 保存中
  const [hasLocalChanges, setHasLocalChanges] = useState(false); // 用户是否有未保存的修改
  const [lastSavedTime, setLastSavedTime] = useState(null); // 上次保存时间
  const [showModuleHistoryModal, setShowModuleHistoryModal] = useState(false); // 模块历史记录

  // 添加模块
  const handleAddModule = () => {
    const prefix = activeTab === 'procurement' ? 'proc' : 'trade';
    const newModule = {
      id: `${prefix}_${Date.now()}`,
      title: '新模块标题',
      content: '请输入模块内容描述...',
      image: '',
      imagePosition: currentModules.length % 2 === 0 ? 'right' : 'left'
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
    
    const exists = currentModules.find(m => m.id === editingModule.id);
    if (exists) {
      setCurrentModules(currentModules.map(m => m.id === editingModule.id ? editingModule : m));
    } else {
      setCurrentModules([...currentModules, editingModule]);
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
      setCurrentModules(currentModules.filter(m => m.id !== id));
    }
  };

  // 移动模块
  const handleMoveModule = (index, direction) => {
    const newModules = [...currentModules];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentModules.length) return;
    [newModules[index], newModules[targetIndex]] = [newModules[targetIndex], newModules[index]];
    setCurrentModules(newModules);
  };

  // 拖拽排序
  const handleDragStart = (index) => setDraggedIndex(index);
  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) setDragOverIndex(index);
  };
  const handleDrop = (index) => {
    if (draggedIndex !== null && draggedIndex !== index) {
      const newModules = [...currentModules];
      const [dragged] = newModules.splice(draggedIndex, 1);
      newModules.splice(index, 0, dragged);
      setCurrentModules(newModules);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };
  const handleDragEnd = () => { setDraggedIndex(null); setDragOverIndex(null); };

  return (
    <EditorLayout
      title="国际贸易"
      description="管理国际贸易页面的工程采购与大宗贸易业务模块，支持模块排序与编辑。"
      pageKey="business_trade"
      onSave={handleSave}
      onSaveDraft={handleSaveDraft}
      hasUnsavedChanges={hasUnsavedChanges}
      historyData={[
        { id: 'h1', time: '2024-03-20 14:30', description: '更新了工程采购和大宗贸易模块', operator: 'admin', status: 'published' },
        { id: 'h2', time: '2024-03-18 10:00', description: '修改了模块顺序', operator: 'admin', status: 'published' },
      ]}
    >
      {/* Tab 切换 - 统一风格 */}
      <div className="mb-lg">
        <div className="flex gap-1">
          <button 
            onClick={() => setActiveTab('procurement')}
            className={`px-md py-xs rounded-sm text-body font-medium transition-all ${
              activeTab === 'procurement' 
                ? 'bg-brand-light text-brand' 
                : 'text-gray-7 hover:text-gray-8 hover:bg-gray-3'
            }`}
          >
            工程采购
          </button>
          <button 
            onClick={() => setActiveTab('trade')}
            className={`px-md py-xs rounded-sm text-body font-medium transition-all ${
              activeTab === 'trade' 
                ? 'bg-brand-light text-brand' 
                : 'text-gray-7 hover:text-gray-8 hover:bg-gray-3'
            }`}
          >
            大宗贸易
          </button>
        </div>
      </div>

      {/* 模块列表 */}
      <div className="space-y-md border-t border-gray-4 pt-lg">
        <div className="flex items-center justify-between mb-lg">
          <div>
            <h3 className="text-section font-semibold text-gray-8">
              {activeTab === 'procurement' ? '工程采购模块' : '大宗贸易模块'}
            </h3>
            <p className="text-caption text-gray-6 mt-xxs">
              管理{activeTab === 'procurement' ? '工程采购' : '大宗贸易'}业务模块，可拖拽排序
            </p>
          </div>
        </div>

        <div className="space-y-md">
          {currentModules.map((mod, index) => (
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
                    disabled={index === currentModules.length - 1}
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
        title={currentModules.find(m => m.id === editingModule?.id) ? '编辑模块' : '新增模块'}
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
                      placeholder="如：生产设备、工程物资"
                    />
                  </FormItem>
                  
                  <FormItem label="模块内容">
                    <TextArea 
                      value={editingModule.content || ''} 
                      onChange={e => updateEditingModule({...editingModule, content: e.target.value})} 
                      rows={8}
                      placeholder="请输入模块详细描述..."
                    />
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
              showHistory={editingModule.id && currentModules.find(m => m.id === editingModule.id) ? true : false}
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

export default BusinessTradeEditor;
