import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Link2, ExternalLink } from 'lucide-react';
import { Input, FormItem, TextArea, Button, Modal, StatsDisplay, EditorLayout } from '../ui';

const LINK_TYPES = [
  { value: 'internal', label: '站内', prefix: '/' },
  { value: 'external', label: '外部', prefix: 'https://' },
];

const INITIAL_DATA = {
  content: '中国化学工程第七建设有限公司（简称"七化建"）成立于1965年，是中国化学工程集团有限公司的全资子公司...',
  stats: [
    { id: 's1', value: '1965', unit: '年', label: '成立时间', description: '六十年工程建设经验' },
    { id: 's2', value: '7100', unit: '+', label: '员工人数', description: '专业化技术团队' },
    { id: 's3', value: '80', unit: '+', label: '国家和地区', description: '全球化业务覆盖' },
  ],
  statsMode: 'custom',
  selectedGlobalKeys: [],
  buttons: [
    { id: 'b1', text: '央企背景', link: '/about', linkType: 'internal' },
    { id: 'b2', text: '60年历史', link: '/about/history', linkType: 'internal' },
    { id: 'b3', text: '全球布局', link: '/business', linkType: 'internal' },
    { id: 'b4', text: '科技引领', link: '/sustain/tech', linkType: 'internal' },
  ]
};

const HomeAboutEditor = ({ data = {}, onChange, companyInfo = {} }) => {
  const [formData, setFormData] = useState({ ...INITIAL_DATA, ...data });
  const [isButtonModalOpen, setIsButtonModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [buttonForm, setButtonForm] = useState({ text: '', link: '', linkType: 'internal' });
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

  const handleChange = (field, value) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
  };

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

  // 按钮管理
  const handleAddButton = () => {
    if ((formData.buttons || []).length >= 4) return alert('最多添加4个按钮');
    setEditingIndex(null);
    setButtonForm({ text: '', link: '', linkType: 'internal' });
    setIsButtonModalOpen(true);
  };

  const handleEditButton = (btn, index) => {
    setEditingIndex(index);
    setButtonForm({ ...btn });
    setIsButtonModalOpen(true);
  };

  const handleSaveButton = () => {
    if (!buttonForm.text) return alert('请填写按钮文字');
    const newButtons = editingIndex !== null
      ? formData.buttons.map((b, i) => i === editingIndex ? { ...b, ...buttonForm } : b)
      : [...(formData.buttons || []), { id: `b${Date.now()}`, ...buttonForm }];
    handleChange('buttons', newButtons);
    setIsButtonModalOpen(false);
  };

  const handleDeleteButton = (index) => {
    if (confirm('确定删除？')) {
      handleChange('buttons', formData.buttons.filter((_, i) => i !== index));
    }
  };

  // 模拟历史记录数据
  const historyData = [
    { id: 'h1', time: '2024-03-20 14:30', description: '更新了公司介绍和核心数据', operator: 'admin', status: 'published' },
    { id: 'h2', time: '2024-03-20 14:25', description: '修改了快捷按钮配置', operator: 'admin', status: 'draft' },
    { id: 'h3', time: '2024-03-18 10:00', description: '更新了关于我们模块', operator: 'admin', status: 'published' },
  ];

  const handleRestoreHistory = (record) => {
    console.log('恢复版本:', record);
  };

  return (
    <>
      <EditorLayout
        title="关于我们"
        description="配置首页「关于我们」模块，包括公司介绍、核心数据和快捷按钮。"
        pageKey="home_about"
        onSave={handlePublish}
        onSaveDraft={handleSaveDraft}
        onRestoreHistory={handleRestoreHistory}
        historyData={historyData}
        hasUnsavedChanges={hasUnsavedChanges}
      >
        <div className="space-y-xl">
          {/* 公司介绍 */}
          <div className="space-y-md">
            <h3 className="text-body font-semibold text-gray-8">公司介绍</h3>
            <FormItem>
              <TextArea value={formData.content} onChange={e => handleChange('content', e.target.value)} rows={4} />
            </FormItem>
          </div>

          <div className="border-t border-gray-4" />

          {/* 核心数据展示 - 使用统一组件 */}
          <StatsDisplay
            title="核心数据展示"
            stats={formData.stats || []}
            onChange={(stats) => handleChange('stats', stats)}
            statsMode={formData.statsMode || 'custom'}
            onModeChange={(mode) => handleChange('statsMode', mode)}
            selectedGlobalKeys={formData.selectedGlobalKeys || []}
            onGlobalKeysChange={(keys) => handleChange('selectedGlobalKeys', keys)}
            companyInfo={companyInfo}
            maxItems={6}
            cols={3}
          />

          <div className="border-t border-gray-4" />

          {/* 快捷按钮 */}
          <div className="space-y-md">
            <h3 className="text-body font-semibold text-gray-8">快捷按钮（最多4个）</h3>
            <div className="relative">
              <div className="grid grid-cols-4 gap-md">
                {(formData.buttons || []).map((btn, index) => (
                  <div key={btn.id} className="bg-gray-2 rounded-lg p-md group relative">
                    <div className="text-body font-medium text-gray-8 mb-xs">{btn.text}</div>
                    <div className="text-caption text-gray-6 truncate flex items-center gap-xxs">
                      {btn.linkType === 'external' ? <ExternalLink className="w-3 h-3" /> : <Link2 className="w-3 h-3" />}
                      {btn.link}
                    </div>
                    <div className="absolute top-2 right-2 flex gap-xxs opacity-0 group-hover:opacity-100">
                      <button onClick={() => handleEditButton(btn, index)} className="p-1 text-gray-6 hover:text-brand"><Edit className="w-3 h-3" /></button>
                      <button onClick={() => handleDeleteButton(index)} className="p-1 text-gray-6 hover:text-error"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-md">
                <Button variant="secondary" onClick={handleAddButton} disabled={(formData.buttons || []).length >= 4}>
                  <Plus className="w-4 h-4" /> 添加按钮
                </Button>
              </div>
            </div>
          </div>
        </div>
      </EditorLayout>

      {/* 按钮编辑弹窗 */}
      <Modal isOpen={isButtonModalOpen} onClose={() => setIsButtonModalOpen(false)} title={editingIndex !== null ? '编辑按钮' : '添加按钮'}
        footer={<><Button variant="secondary" onClick={() => setIsButtonModalOpen(false)}>取消</Button><Button onClick={handleSaveButton}>确认</Button></>}>
        <div className="space-y-md">
          <FormItem label="按钮文字" required>
            <Input value={buttonForm.text} onChange={e => setButtonForm({...buttonForm, text: e.target.value})} placeholder="如：央企背景" />
          </FormItem>
          <FormItem label="链接类型">
            <div className="flex gap-sm">
              {LINK_TYPES.map(type => (
                <button
                  key={type.value}
                  onClick={() => setButtonForm({...buttonForm, linkType: type.value})}
                  className={`px-md py-xs rounded-sm text-body flex items-center gap-xs ${
                    buttonForm.linkType === type.value ? 'bg-brand-light text-brand' : 'bg-gray-2 text-gray-6'
                  }`}
                >
                  {type.value === 'external' ? <ExternalLink className="w-3 h-3" /> : <Link2 className="w-3 h-3" />}
                  {type.label}
                </button>
              ))}
            </div>
          </FormItem>
          <FormItem label="跳转链接">
            <Input 
              value={buttonForm.link} 
              onChange={e => setButtonForm({...buttonForm, link: e.target.value})} 
              placeholder={buttonForm.linkType === 'external' ? 'https://example.com' : '/about'}
            />
          </FormItem>
        </div>
      </Modal>
    </>
  );
};

export default HomeAboutEditor;
