import { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, Edit, Award, Heart, ExternalLink, Check, Search } from 'lucide-react';
import { Button, Input, FormItem, TextArea, ImageSelector, Modal, PageBanner, EditorLayout } from '../ui';

// 初始公益服务数据
const INITIAL_SERVICES = [
  { 
    id: 's1', 
    title: '助力乡村振兴', 
    content: '通过捐建希望小学、资助贫困学生等方式，改善偏远地区教育条件，累计投入资金超过5000万元，惠及学生超过2万名。',
    image: '',
    stats: [
      { value: '160万元', label: '相关投资' },
      { value: '38名', label: '资助学生' },
      { value: '173户', label: '一户一策' },
    ]
  },
  { 
    id: 's2', 
    title: '生态保护修复工程', 
    content: '开展植树造林、湿地保护、污染治理等生态修复项目，致力于建设美丽中国，已完成生态修复面积超过3000公顷。',
    image: '',
    stats: [
      { value: '3200公顷', label: '修复面积' },
      { value: '150万棵', label: '植树数量' },
      { value: '173户', label: '一户一策' },
    ]
  },
  { 
    id: 's3', 
    title: '社区发展支持项目', 
    content: '支持社区基础设施建设、文化活动开展和特势群体关怀，促进社区和谐发展，已在全国建立社区服务中心28个。',
    image: '',
    stats: [
      { value: '28个', label: '服务中心' },
      { value: '1.5万人', label: '志愿者' },
      { value: '50万+', label: '服务人次' },
    ]
  },
];

const SustainResponsibilityEditor = ({ data = {}, onChange, imageLib = [], certLib = {} }) => {
  const [services, setServices] = useState(data.services || INITIAL_SERVICES);
  const [selectedHonorIds, setSelectedHonorIds] = useState(data.selectedHonorIds || []);
  
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isHonorPickerOpen, setIsHonorPickerOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [serviceForm, setServiceForm] = useState({ title: '', content: '', image: '', stats: [] });
  const [statInput, setStatInput] = useState({ value: '', label: '' });
  const [searchKeyword, setSearchKeyword] = useState('');

  // EditorLayout 状态管理
  const savedDataRef = useRef(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastPublishedTime, setLastPublishedTime] = useState(null);
  const [lastPublishedDate, setLastPublishedDate] = useState(null);

  // 初始化保存的数据引用
  useEffect(() => {
    savedDataRef.current = JSON.stringify({ services, selectedHonorIds });
    const saved = localStorage.getItem('sus_responsibility_lastPublished');
    if (saved) {
      const parsed = JSON.parse(saved);
      setLastPublishedTime(parsed.time || '10:30');
      setLastPublishedDate(parsed.date || '2025-12-11 10:30');
    }
  }, []);

  // 检测未保存的更改
  useEffect(() => {
    const current = JSON.stringify({ services, selectedHonorIds });
    setHasUnsavedChanges(current !== savedDataRef.current);
  }, [services, selectedHonorIds]);

  // 从全局资质库获取荣誉信息
  const allHonors = certLib.honorDetails || [];
  const selectedHonors = allHonors.filter(h => selectedHonorIds.includes(h.id));

  const updateData = (newServices, newSelectedIds) => {
    onChange && onChange({ services: newServices, selectedHonorIds: newSelectedIds });
  };

  const handleSaveDraft = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    savedDataRef.current = JSON.stringify({ services, selectedHonorIds });
    setHasUnsavedChanges(false);
    alert('配置已保存');
  };

  const handleSave = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    savedDataRef.current = JSON.stringify({ services, selectedHonorIds });
    setHasUnsavedChanges(false);
    const now = new Date();
    const time = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    const date = now.toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    setLastPublishedTime(time);
    setLastPublishedDate(date);
    localStorage.setItem('sus_responsibility_lastPublished', JSON.stringify({ time, date }));
    alert('配置已发布');
  };

  const generateHistory = () => {
    return [
      { id: 'v1', time: '2025-12-11 10:30', description: '更新了社会责任配置', operator: 'admin', status: 'published' },
      { id: 'v2', time: '2025-12-10 14:25', description: '编辑了社会责任', operator: 'admin', status: 'draft' },
      { id: 'v3', time: '2025-12-09 10:00', description: '首次创建社会责任', operator: 'admin', status: 'published' },
    ];
  };

  // ================== 公益服务管理 ==================
  const handleAddService = () => { 
    setEditingIndex(null); 
    setServiceForm({ title: '', content: '', image: '', stats: [] }); 
    setStatInput({ value: '', label: '' }); 
    setIsServiceModalOpen(true); 
  };
  
  const handleEditService = (s, i) => { 
    setEditingIndex(i); 
    setServiceForm({ ...s, stats: s.stats || [] }); 
    setStatInput({ value: '', label: '' }); 
    setIsServiceModalOpen(true); 
  };
  
  const handleSaveService = () => {
    if (!serviceForm.title) return alert('请填写标题');
    const newServices = editingIndex !== null 
      ? services.map((s, i) => i === editingIndex ? { ...s, ...serviceForm } : s) 
      : [...services, { id: `s${Date.now()}`, ...serviceForm }];
    setServices(newServices); 
    updateData(newServices, selectedHonorIds); 
    setIsServiceModalOpen(false);
  };
  
  const handleDeleteService = (i) => { 
    if (confirm('确定删除？')) { 
      const n = services.filter((_, idx) => idx !== i); 
      setServices(n); 
      updateData(n, selectedHonorIds); 
    } 
  };
  
  const addStat = () => { 
    if (!statInput.value || !statInput.label) return; 
    setServiceForm({ ...serviceForm, stats: [...serviceForm.stats, { ...statInput }] }); 
    setStatInput({ value: '', label: '' }); 
  };
  
  const removeStat = (idx) => { 
    setServiceForm({ ...serviceForm, stats: serviceForm.stats.filter((_, i) => i !== idx) }); 
  };

  // ================== 荣誉选择管理 ==================
  const toggleHonorSelection = (id) => {
    const newIds = selectedHonorIds.includes(id)
      ? selectedHonorIds.filter(i => i !== id)
      : [...selectedHonorIds, id];
    setSelectedHonorIds(newIds);
  };

  const handleConfirmHonorSelection = () => {
    updateData(services, selectedHonorIds);
    setIsHonorPickerOpen(false);
  };

  const removeSelectedHonor = (id) => {
    const newIds = selectedHonorIds.filter(i => i !== id);
    setSelectedHonorIds(newIds);
    updateData(services, newIds);
  };

  const filteredHonors = allHonors.filter(h => 
    !searchKeyword || (h.title || h.name || '').toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <>
      <EditorLayout
        title="社会责任"
        description="管理社会责任页面内容，包括荣耀典藏和公益服务。"
        pageKey="sus_responsibility"
        onSave={handleSave}
        onSaveDraft={handleSaveDraft}
        historyData={generateHistory()}
        hasUnsavedChanges={hasUnsavedChanges}
        saveText="发布更新"
        draftText="保存配置"
      >
        <div className="space-y-xl">
          {/* ================== 荣耀典藏（可选择） ================== */}
          <div className="space-y-md">
            <div className="flex items-center justify-between">
              <h3 className="text-body font-semibold text-gray-8">荣耀典藏</h3>
              <Button variant="secondary" onClick={() => setIsHonorPickerOpen(true)}>
                <Plus className="w-4 h-4" /> 选择荣誉
              </Button>
            </div>
            {selectedHonors.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
                {selectedHonors.map((honor) => (
                  <div key={honor.id} className="bg-gray-2 rounded-lg overflow-hidden group relative">
                    <div className="aspect-square bg-gradient-to-br from-yellow-100 to-yellow-50 flex items-center justify-center p-md">
                      {(honor.image || honor.img) ? (
                        <img src={honor.image || honor.img} alt="" className="w-full h-full object-contain" />
                      ) : (
                        <Award className="w-16 h-16 text-yellow-400" />
                      )}
                    </div>
                    <div className="p-sm">
                      <div className="text-body font-semibold text-gray-8 mb-xxs line-clamp-2">{honor.title || honor.name || ''}</div>
                      {honor.description && <p className="text-caption text-gray-6 line-clamp-2">{honor.description}</p>}
                      <button className="text-caption text-brand mt-xs flex items-center gap-xxs">
                        查看详情 <ExternalLink className="w-3 h-3" />
                      </button>
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

          <div className="border-t border-gray-4" />

          {/* ================== 公益服务 ================== */}
          <div className="space-y-md">
            <div className="flex items-center justify-between">
              <h3 className="text-body font-semibold text-gray-8">公益服务</h3>
              <Button variant="add" onClick={handleAddService}>
                <Plus className="w-4 h-4" /> 添加项目
              </Button>
            </div>
            <div className="space-y-lg">
              {services.map((service, index) => (
                <div key={service.id} className="bg-gray-2 rounded-lg p-lg group relative">
                  <div className="flex gap-lg">
                    <div className="w-1/3 flex-shrink-0">
                      {service.image ? (
                        <img src={service.image} alt="" className="w-full aspect-video object-cover rounded-md" />
                      ) : (
                        <div className="w-full aspect-video bg-gray-3 rounded-md flex items-center justify-center">
                          <Heart className="w-12 h-12 text-gray-4" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-section font-bold text-gray-8 mb-xs">{service.title}</h4>
                      <p className="text-caption text-gray-6 mb-md">{service.content}</p>
                      {service.stats && service.stats.length > 0 && (
                        <div className="flex gap-lg">
                          {service.stats.map((stat, i) => (
                            <div key={i}>
                              <div className="text-section font-bold text-brand">{stat.value}</div>
                              <div className="text-caption text-gray-6">{stat.label}</div>
                            </div>
                          ))}
                        </div>
                      )}
                      <button className="text-caption text-brand mt-md flex items-center gap-xxs">
                        查看详情 <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 flex gap-xxs opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEditService(service, index)} className="px-sm py-xxs text-caption text-brand hover:bg-brand-light rounded">编辑</button>
                    <button onClick={() => handleDeleteService(index)} className="px-sm py-xxs text-caption text-error hover:bg-red-50 rounded">删除</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </EditorLayout>

      {/* 公益服务弹窗 */}
      <Modal isOpen={isServiceModalOpen} onClose={() => setIsServiceModalOpen(false)} title={editingIndex !== null ? '编辑项目' : '添加项目'} size="lg"
        footer={<><Button variant="secondary" onClick={() => setIsServiceModalOpen(false)}>取消</Button><Button onClick={handleSaveService}>确认</Button></>}>
        <div className="space-y-md">
          <FormItem label="项目名称" required>
            <Input value={serviceForm.title} onChange={e => setServiceForm({...serviceForm, title: e.target.value})} />
          </FormItem>
          <FormItem label="项目描述">
            <TextArea value={serviceForm.content} onChange={e => setServiceForm({...serviceForm, content: e.target.value})} rows={3} />
          </FormItem>
          <FormItem label="数据展示">
            <div className="space-y-sm">
              {serviceForm.stats.map((stat, i) => (
                <div key={i} className="flex items-center gap-sm bg-gray-2 p-sm rounded">
                  <span className="text-brand font-bold">{stat.value}</span>
                  <span className="text-gray-6">{stat.label}</span>
                  <button onClick={() => removeStat(i)} className="ml-auto text-error"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
              <div className="flex gap-sm">
                <Input value={statInput.value} onChange={e => setStatInput({...statInput, value: e.target.value})} placeholder="数值（如：160万元）" className="w-1/3" />
                <Input value={statInput.label} onChange={e => setStatInput({...statInput, label: e.target.value})} placeholder="标签（如：相关投资）" className="flex-1" />
                <Button variant="secondary" onClick={addStat}>添加</Button>
              </div>
            </div>
          </FormItem>
          <ImageSelector label="项目图片" value={serviceForm.image ? {url: serviceForm.image} : null} onChange={img => setServiceForm({...serviceForm, image: img?.url || ''})} library={imageLib} />
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

export default SustainResponsibilityEditor;
