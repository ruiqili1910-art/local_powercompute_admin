import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { FormItem, Input, TextArea, ImageSelector, Button, StatsDisplay, EditorLayout, UnifiedHistoryModal } from '../ui';

// 人才战略初始数据
const INITIAL_STRATEGY = {
  sections: [
    {
      id: 'sec_1',
      title: '人才强企，筑基一流',
      content: '我们立足"一体两翼"战略，深入实施"人才强企"战略，不断优化人才"选、育、用、留"机制。通过创新招聘、培养、薪酬与考核体系，我们致力于打造一支价值驱动、具备使命感的一流团队，为公司建设世界一流企业奠定坚实的人才根基。'
    },
    {
      id: 'sec_2',
      title: '唯才是举，共创未来',
      content: '我们坚持"公开、平等、竞争、择优"的用人理念，面向全球广纳贤才，公司持续营造人敬业、尊重知识与人才的良好氛围。让每位有能力、有担负的员工都能施展才华、实现理想。我们诚挚期待更多有志之士加入我们，携手共创辉煌明天。'
    }
  ],
  images: [
    { id: 'img_1', url: '', title: '团队风采1' },
    { id: 'img_2', url: '', title: '团队风采2' },
    { id: 'img_3', url: '', title: '团队风采3' }
  ]
};

// 人才队伍初始数据
const INITIAL_TEAM = {
  title: '人才队伍',
  description: '现有职工5400余人，其中，管理人员4100余人，作业人员1300余人。985.211、双一流，QS排名top100国际院校等高学历人才在管理人员中占比近三分之一，硕士及以上人员460余人，在管理人员中占比11%。\n\n干部队伍年轻化成效显著，中级及以上管理人员平均年龄43岁；拥有享受政府特殊津贴专家12人，集团级工程技术专家、项目管理专家等集团公司"一百千"人才79人；正高级职称23人，高级职称239人，一级建造师236人，注册安全工程师125人，注册造价师66人，注册会计师11人。',
  image: '',
  // 数据展示配置
  statsMode: 'custom',
  selectedGlobalKeys: [],
  customStats: [
    { id: 's1', value: '5400+', unit: '', label: '现有职工总数', description: '' },
    { id: 's2', value: '4100+', unit: '', label: '管理人员', description: '' },
    { id: 's3', value: '460+', unit: '', label: '硕士及以上', description: '' },
    { id: 's4', value: '79+', unit: '', label: '专家人才', description: '' }
  ]
};

const HREditor = ({ data = {}, onChange, type, imageLib = [], companyInfo = {} }) => {
  const typeLabels = {
    'strategy': '人才战略',
    'team': '人才队伍'
  };

  // 根据类型获取初始数据
  const getInitialData = () => {
    if (type === 'strategy') {
      return { ...INITIAL_STRATEGY, ...data };
    }
    return { ...INITIAL_TEAM, ...data };
  };

  const [formData, setFormData] = useState(getInitialData());
  
  // 记录上次保存的数据快照
  const savedDataRef = useRef(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // 初始化ref
  useEffect(() => {
    if (savedDataRef.current === null) {
      savedDataRef.current = JSON.stringify(formData);
    }
  }, []);
  
  // 监听数据变化
  useEffect(() => {
    if (savedDataRef.current === null) return;
    const currentData = JSON.stringify(formData);
    setHasUnsavedChanges(currentData !== savedDataRef.current);
  }, [formData]);

  const handleChange = (field, value) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    if (onChange) {
      onChange(newData);
    }
  };

  // 保存配置
  const handleSaveDraft = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (onChange) {
      onChange(formData);
    }
    savedDataRef.current = JSON.stringify(formData);
    setHasUnsavedChanges(false);
  };

  // 发布更新
  const handleSave = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (onChange) {
      onChange(formData);
    }
    savedDataRef.current = JSON.stringify(formData);
    setHasUnsavedChanges(false);
  };
  
  // 生成历史记录数据
  const generateHistory = () => [
    { id: 'h1', time: '2024-03-20 14:30', description: `更新了${typeLabels[type]}页面配置`, operator: 'admin', action: 'edit' },
    { id: 'h2', time: '2024-03-18 10:00', description: `编辑了${typeLabels[type]}页面内容`, operator: 'admin', action: 'edit' },
    { id: 'h3', time: '2024-03-15 16:20', description: `首次配置${typeLabels[type]}页面`, operator: 'admin', action: 'add' },
  ];

  // 人才战略 - 更新段落
  const handleSectionChange = (id, field, value) => {
    const sections = formData.sections.map(sec => 
      sec.id === id ? { ...sec, [field]: value } : sec
    );
    handleChange('sections', sections);
  };

  // 人才战略 - 添加段落
  const handleAddSection = () => {
    const newSection = {
      id: `sec_${Date.now()}`,
      title: '',
      content: ''
    };
    handleChange('sections', [...(formData.sections || []), newSection]);
  };

  // 人才战略 - 删除段落
  const handleDeleteSection = (id) => {
    if (confirm('确定删除此段落吗？')) {
      handleChange('sections', formData.sections.filter(sec => sec.id !== id));
    }
  };

  // 人才战略 - 更新图片
  const handleImageChange = (id, url) => {
    const images = (formData.images || []).map(img => 
      img.id === id ? { ...img, url } : img
    );
    handleChange('images', images);
  };

  return (
    <EditorLayout
      title={typeLabels[type] || '人力资源'}
      description={type === 'strategy' ? '管理人才战略页面内容，包括文字说明和展示图片。' : '管理人才队伍页面内容，包括团队介绍和核心数据展示。'}
      pageKey={`hr_${type}`}
      onSaveDraft={handleSaveDraft}
      onSave={handleSave}
      hasUnsavedChanges={hasUnsavedChanges}
      historyData={generateHistory()}
    >
      <div className="px-xl py-lg">
        {type === 'strategy' ? (
          // ==================== 人才战略 ====================
          <div className="space-y-xl">
            {/* 文字段落 */}
            <div>
              <div className="flex items-center justify-between mb-md">
                <h3 className="text-body font-semibold text-gray-8">文字内容</h3>
                <Button variant="secondary" onClick={handleAddSection}>
                  <Plus className="w-4 h-4" />
                  添加段落
                </Button>
              </div>
              <div className="space-y-md">
                {(formData.sections || []).map((section, index) => (
                  <div key={section.id} className="p-md bg-gray-2 rounded-lg">
                    <div className="flex items-start gap-sm">
                      <div className="flex-shrink-0 pt-2">
                        <GripVertical className="w-4 h-4 text-gray-5 cursor-move" />
                      </div>
                      <div className="flex-1 space-y-sm">
                        <FormItem label={`段落${index + 1}标题`}>
                          <Input 
                            value={section.title || ''} 
                            onChange={e => handleSectionChange(section.id, 'title', e.target.value)} 
                            placeholder="请输入段落标题"
                          />
                        </FormItem>
                        <FormItem label="段落内容">
                          <TextArea 
                            value={section.content || ''} 
                            onChange={e => handleSectionChange(section.id, 'content', e.target.value)} 
                            rows={4}
                            placeholder="请输入段落内容"
                          />
                        </FormItem>
                      </div>
                      <button 
                        onClick={() => handleDeleteSection(section.id)}
                        className="flex-shrink-0 p-xs text-gray-5 hover:text-error transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-4" />

            {/* 展示图片 */}
            <div>
              <h3 className="text-body font-semibold text-gray-8 mb-md">展示图片（轮播）</h3>
              <div className="grid grid-cols-3 gap-md">
                {(formData.images || []).map((img, index) => (
                  <div key={img.id}>
                    <ImageSelector
                      label={`图片${index + 1}`}
                      value={img.url ? { url: img.url } : null}
                      onChange={imgData => handleImageChange(img.id, imgData?.url || '')}
                      library={imageLib}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // ==================== 人才队伍 ====================
          <div className="space-y-xl">
            {/* 左右布局 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
              {/* 左侧：图片 */}
              <div>
                <ImageSelector
                  label="人才队伍配图"
                  value={formData.image ? { url: formData.image } : null}
                  onChange={img => handleChange('image', img?.url || '')}
                  library={imageLib}
                />
              </div>

              {/* 右侧：文字说明 */}
              <div className="space-y-md">
                <FormItem label="标题">
                  <Input 
                    value={formData.title || ''} 
                    onChange={e => handleChange('title', e.target.value)} 
                    placeholder="请输入标题"
                  />
                </FormItem>
                <FormItem label="内容介绍">
                  <TextArea 
                    value={formData.description || ''} 
                    onChange={e => handleChange('description', e.target.value)} 
                    rows={10}
                    placeholder="请输入人才队伍介绍内容"
                  />
                </FormItem>
              </div>
            </div>

            <div className="border-t border-gray-4" />

            {/* 核心数据展示 - 使用统一组件 */}
            <StatsDisplay
              title="核心数据展示"
              stats={formData.customStats || []}
              onChange={(stats) => handleChange('customStats', stats)}
              statsMode={formData.statsMode || 'custom'}
              onModeChange={(mode) => handleChange('statsMode', mode)}
              selectedGlobalKeys={formData.selectedGlobalKeys || []}
              onGlobalKeysChange={(keys) => handleChange('selectedGlobalKeys', keys)}
              companyInfo={companyInfo}
              maxItems={4}
              cols={4}
            />
          </div>
        )}
      </div>
    </EditorLayout>
  );
};

export default HREditor;
