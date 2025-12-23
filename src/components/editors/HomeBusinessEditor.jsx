import { useState, useRef, useEffect } from 'react';
import { Edit, Upload, X, Play, Briefcase, Globe, Building, Link2, ExternalLink, Factory, Beaker, Flame, Droplets, Zap, Cog } from 'lucide-react';
import { Input, FormItem, TextArea, ImageSelector, Button, Modal, EditorLayout } from '../ui';

// 可选图标
const ICONS = {
  factory: Factory,
  beaker: Beaker,
  flame: Flame,
  droplets: Droplets,
  zap: Zap,
  cog: Cog,
  briefcase: Briefcase,
  globe: Globe,
  building: Building,
};

const INITIAL_DATA = {
  // 工程总承包 - 6个子类
  engineering: {
    categories: [
      { id: 'ec1', name: '化学工程', icon: 'beaker', description: '化工领域工程总承包服务', coverType: 'image', coverImage: '', coverVideo: '' },
      { id: 'ec2', name: '环保工程', icon: 'droplets', description: '环保领域工程解决方案', coverType: 'image', coverImage: '', coverVideo: '' },
      { id: 'ec3', name: '基础设施', icon: 'building', description: '基础设施建设服务', coverType: 'image', coverImage: '', coverVideo: '' },
      { id: 'ec4', name: '石油化工', icon: 'flame', description: '石油化工工程服务', coverType: 'image', coverImage: '', coverVideo: '' },
      { id: 'ec5', name: '能源工程', icon: 'zap', description: '能源领域工程服务', coverType: 'image', coverImage: '', coverVideo: '' },
      { id: 'ec6', name: '工业制造', icon: 'factory', description: '工业制造工程服务', coverType: 'image', coverImage: '', coverVideo: '' },
    ]
  },
  // 国际贸易
  trade: {
    title: '国际贸易',
    subtitle: '全球化贸易服务与供应链管理',
    bgType: 'image',
    bgImage: '',
    bgVideo: '',
    button: { text: '了解更多', link: '/business/trade', linkType: 'internal' }
  },
  // 实业发展
  industry: {
    title: '实业发展',
    subtitle: '多元化实业投资与产业布局',
    bgType: 'image',
    bgImage: '',
    bgVideo: '',
    button: { text: '了解更多', link: '/business/industry', linkType: 'internal' }
  }
};

const HomeBusinessEditor = ({ data = {}, onChange, imageLib = [], engineeringCategories = [] }) => {
  const [formData, setFormData] = useState({ ...INITIAL_DATA, ...data });
  const [activeTab, setActiveTab] = useState('engineering');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCatIndex, setEditingCatIndex] = useState(null);
  const [catForm, setCatForm] = useState({ name: '', icon: 'factory', description: '', coverType: 'image', coverImage: '', coverVideo: '' });
  const [isDragging, setIsDragging] = useState(false);
  const videoInputRef = useRef(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [initialData, setInitialData] = useState({ ...INITIAL_DATA, ...data });

  // 当外部data变化时，更新formData和初始数据
  useEffect(() => {
    const newData = { ...INITIAL_DATA, ...data };
    setFormData(newData);
    setInitialData(newData);
    setHasUnsavedChanges(false);
  }, [data]);

  // 检查是否有未保存的修改
  useEffect(() => {
    const hasChanges = JSON.stringify(formData) !== JSON.stringify(initialData);
    setHasUnsavedChanges(hasChanges);
  }, [formData, initialData]);

  const handleSaveDraft = async () => {
    onChange && onChange(formData);
    setInitialData({ ...formData });
    setHasUnsavedChanges(false);
  };

  const handlePublish = async () => {
    onChange && onChange(formData);
    setInitialData({ ...formData });
    setHasUnsavedChanges(false);
  };

  // 更新子数据
  const updateSection = (section, field, value) => {
    setFormData({
      ...formData,
      [section]: { ...formData[section], [field]: value }
    });
  };

  // 工程总承包子类管理
  const handleEditCategory = (cat, index) => {
    setEditingCatIndex(index);
    setCatForm({ ...cat });
    setIsEditModalOpen(true);
  };

  const handleSaveCategory = () => {
    if (!catForm.name) return alert('请填写名称');
    const newCategories = formData.engineering.categories.map((c, i) => 
      i === editingCatIndex ? { ...c, ...catForm } : c
    );
    setFormData({
      ...formData,
      engineering: { ...formData.engineering, categories: newCategories }
    });
    setIsEditModalOpen(false);
  };

  // 视频上传
  const handleVideoUpload = (e, section, field) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (section === 'catForm') {
        setCatForm({ ...catForm, coverVideo: url, coverType: 'video' });
      } else {
        updateSection(section, field, url);
        updateSection(section, 'bgType', 'video');
      }
    }
  };

  // 渲染背景设置
  const renderBgSetting = (section, sectionData) => (
    <div className="space-y-md">
      <div className="flex gap-sm">
        {[{ v: 'image', l: '背景图片' }, { v: 'video', l: '背景视频' }].map(opt => (
          <button
            key={opt.v}
            onClick={() => updateSection(section, 'bgType', opt.v)}
            className={`px-md py-xs rounded-sm text-body ${
              sectionData.bgType === opt.v ? 'bg-brand-light text-brand' : 'bg-gray-2 text-gray-6'
            }`}
          >
            {opt.l}
          </button>
        ))}
      </div>

      {sectionData.bgType === 'image' ? (
        <ImageSelector 
          label=""
          value={sectionData.bgImage ? { url: sectionData.bgImage } : null}
          onChange={img => updateSection(section, 'bgImage', img?.url || '')}
          library={imageLib}
        />
      ) : (
        <div>
          {sectionData.bgVideo ? (
            <div className="relative rounded-lg overflow-hidden bg-black">
              <video src={sectionData.bgVideo} className="w-full h-32 object-cover" muted />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <Play className="w-8 h-8 text-white" />
              </div>
              <button 
                onClick={() => updateSection(section, 'bgVideo', '')}
                className="absolute top-2 right-2 p-1 bg-white rounded-full text-gray-6 hover:text-error"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              className="border-2 border-dashed rounded-lg p-md text-center cursor-pointer border-gray-4 hover:border-brand"
              onClick={() => document.getElementById(`video-${section}`)?.click()}
            >
              <Upload className="w-8 h-8 mx-auto mb-xs text-gray-5" />
              <p className="text-caption text-gray-6">点击上传视频</p>
              <input
                id={`video-${section}`}
                type="file"
                accept="video/*"
                onChange={(e) => handleVideoUpload(e, section, 'bgVideo')}
                className="hidden"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );

  // 模拟历史记录数据
  const historyData = [
    { id: 'h1', time: '2024-03-20 14:30', description: '更新了工程总承包子类配置', operator: 'admin', status: 'published' },
    { id: 'h2', time: '2024-03-20 14:25', description: '修改了国际贸易模块', operator: 'admin', status: 'draft' },
    { id: 'h3', time: '2024-03-18 10:00', description: '更新了业务板块配置', operator: 'admin', status: 'published' },
  ];

  const handleRestoreHistory = (record) => {
    console.log('恢复版本:', record);
  };

  return (
    <>
      <EditorLayout
        title="业务板块"
        description="配置首页「业务板块」展示，包括工程总承包、国际贸易、实业发展。"
        pageKey="home_business"
        onSave={handlePublish}
        onSaveDraft={handleSaveDraft}
        onRestoreHistory={handleRestoreHistory}
        historyData={historyData}
        hasUnsavedChanges={hasUnsavedChanges}
      >
        <div className="space-y-lg">
          {/* Tab 切换 */}
          <div className="flex gap-sm">
            {[
              { id: 'engineering', label: '工程总承包', icon: Briefcase },
              { id: 'trade', label: '国际贸易', icon: Globe },
              { id: 'industry', label: '实业发展', icon: Building }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-md py-xs rounded-sm text-body font-medium flex items-center gap-xs ${
                  activeTab === tab.id ? 'bg-brand-light text-brand' : 'text-gray-6 hover:bg-gray-2'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* 工程总承包 */}
          {activeTab === 'engineering' && (
            <div className="space-y-md">
              <p className="text-caption text-gray-6">
                工程总承包下的6个子类，名称来自「业务领域/工程承包」的分类。可设置封面图片/视频、图标和说明。
              </p>
              <div className="grid grid-cols-3 gap-md">
                {(formData.engineering?.categories || []).map((cat, index) => {
                  const IconComp = ICONS[cat.icon] || Factory;
                  return (
                    <div key={cat.id} className="bg-gray-2 rounded-lg overflow-hidden group relative">
                      <div className="aspect-video relative bg-gray-3">
                        {cat.coverType === 'video' && cat.coverVideo ? (
                          <>
                            <video src={cat.coverVideo} className="w-full h-full object-cover" muted />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                              <Play className="w-8 h-8 text-white" />
                            </div>
                          </>
                        ) : cat.coverImage ? (
                          <img src={cat.coverImage} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                            <IconComp className="w-12 h-12 text-white/50" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-sm text-white">
                          <div className="flex items-center gap-xs">
                            <IconComp className="w-4 h-4" />
                            <span className="text-body font-semibold">{cat.name}</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-sm">
                        <p className="text-caption text-gray-6 line-clamp-2">{cat.description || '暂无说明'}</p>
                      </div>
                      <button 
                        onClick={() => handleEditCategory(cat, index)}
                        className="absolute top-2 right-2 p-1.5 bg-white rounded shadow text-gray-6 hover:text-brand opacity-0 group-hover:opacity-100"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 国际贸易 */}
          {activeTab === 'trade' && (
            <div className="space-y-md">
              <div className="grid grid-cols-2 gap-lg">
                <FormItem label="标题">
                  <Input value={formData.trade?.title} onChange={e => updateSection('trade', 'title', e.target.value)} />
                </FormItem>
                <FormItem label="副标题">
                  <Input value={formData.trade?.subtitle} onChange={e => updateSection('trade', 'subtitle', e.target.value)} />
                </FormItem>
              </div>
              <FormItem label="背景图片/视频">
                {renderBgSetting('trade', formData.trade || {})}
              </FormItem>
              <FormItem label="按钮设置">
                <div className="grid grid-cols-2 gap-sm">
                  <Input 
                    value={formData.trade?.button?.text} 
                    onChange={e => updateSection('trade', 'button', { ...formData.trade?.button, text: e.target.value })}
                    placeholder="按钮文字"
                  />
                  <Input 
                    value={formData.trade?.button?.link} 
                    onChange={e => updateSection('trade', 'button', { ...formData.trade?.button, link: e.target.value })}
                    placeholder="跳转链接"
                  />
                </div>
              </FormItem>
            </div>
          )}

          {/* 实业发展 */}
          {activeTab === 'industry' && (
            <div className="space-y-md">
              <div className="grid grid-cols-2 gap-lg">
                <FormItem label="标题">
                  <Input value={formData.industry?.title} onChange={e => updateSection('industry', 'title', e.target.value)} />
                </FormItem>
                <FormItem label="副标题">
                  <Input value={formData.industry?.subtitle} onChange={e => updateSection('industry', 'subtitle', e.target.value)} />
                </FormItem>
              </div>
              <FormItem label="背景图片/视频">
                {renderBgSetting('industry', formData.industry || {})}
              </FormItem>
              <FormItem label="按钮设置">
                <div className="grid grid-cols-2 gap-sm">
                  <Input 
                    value={formData.industry?.button?.text} 
                    onChange={e => updateSection('industry', 'button', { ...formData.industry?.button, text: e.target.value })}
                    placeholder="按钮文字"
                  />
                  <Input 
                    value={formData.industry?.button?.link} 
                    onChange={e => updateSection('industry', 'button', { ...formData.industry?.button, link: e.target.value })}
                    placeholder="跳转链接"
                  />
                </div>
              </FormItem>
            </div>
          )}
        </div>
      </EditorLayout>

      {/* 子类编辑弹窗 */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="编辑子类" size="lg"
        footer={<><Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>取消</Button><Button onClick={handleSaveCategory}>确认</Button></>}>
        <div className="space-y-md">
          <FormItem label="名称">
            <Input value={catForm.name} onChange={e => setCatForm({...catForm, name: e.target.value})} />
          </FormItem>
          <FormItem label="图标">
            <div className="flex flex-wrap gap-sm">
              {Object.entries(ICONS).map(([key, Icon]) => (
                <button 
                  key={key} 
                  onClick={() => setCatForm({...catForm, icon: key})}
                  className={`p-md rounded-md border ${catForm.icon === key ? 'bg-brand-light border-brand' : 'border-gray-4'}`}
                >
                  <Icon className={`w-5 h-5 ${catForm.icon === key ? 'text-brand' : 'text-gray-6'}`} />
                </button>
              ))}
            </div>
          </FormItem>
          <FormItem label="说明">
            <TextArea value={catForm.description} onChange={e => setCatForm({...catForm, description: e.target.value})} rows={2} />
          </FormItem>
          <FormItem label="封面类型">
            <div className="flex gap-sm">
              {[{ v: 'image', l: '图片' }, { v: 'video', l: '视频' }].map(opt => (
                <button
                  key={opt.v}
                  onClick={() => setCatForm({...catForm, coverType: opt.v})}
                  className={`px-md py-xs rounded-sm text-body ${
                    catForm.coverType === opt.v ? 'bg-brand-light text-brand' : 'bg-gray-2 text-gray-6'
                  }`}
                >
                  {opt.l}
                </button>
              ))}
            </div>
          </FormItem>
          {catForm.coverType === 'image' ? (
            <ImageSelector 
              label="封面图片"
              value={catForm.coverImage ? { url: catForm.coverImage } : null}
              onChange={img => setCatForm({...catForm, coverImage: img?.url || ''})}
              library={imageLib}
            />
          ) : (
            <FormItem label="封面视频">
              {catForm.coverVideo ? (
                <div className="relative rounded-lg overflow-hidden bg-black">
                  <video src={catForm.coverVideo} className="w-full h-32 object-cover" muted />
                  <button 
                    onClick={() => setCatForm({...catForm, coverVideo: ''})}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full text-gray-6 hover:text-error"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  className="border-2 border-dashed rounded-lg p-md text-center cursor-pointer border-gray-4 hover:border-brand"
                  onClick={() => videoInputRef.current?.click()}
                >
                  <Upload className="w-8 h-8 mx-auto mb-xs text-gray-5" />
                  <p className="text-caption text-gray-6">点击上传视频</p>
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = URL.createObjectURL(file);
                        setCatForm({...catForm, coverVideo: url});
                      }
                    }}
                    className="hidden"
                  />
                </div>
              )}
            </FormItem>
          )}
        </div>
      </Modal>
    </>
  );
};

export default HomeBusinessEditor;
