import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';
import { Input, FormItem, Button, Modal, EditorLayout, ImageSelector } from '../ui';

const INITIAL_DATA = {
  // 上级单位和所属企业
  parentUnits: [
    '中国化学工程股份有限公司',
    '国家发展和改革委员会',
    '国有资产管理委员会',
    '中国化学工程集团公司'
  ],
  subsidiaryCompany: '中化学七化建化工工程 (成都) 有限公司',
  
  // 联系方式
  address: '四川省成都市龙泉驿区龙都南路537号',
  phone: '028-68897777',
  fax: '028-68931366',
  migrantWorkerHotline: '028-68931100',
  qrCode: '', // 二维码图片URL
  
  // 友情链接
  friendLinks: [
    { id: 'fl1', name: '工信部', url: 'https://www.miit.gov.cn' },
    { id: 'fl2', name: '住建部', url: 'https://www.mohurd.gov.cn' },
    { id: 'fl3', name: '四川省国资委', url: 'https://www.scgz.gov.cn' },
  ]
};

const FooterContentEditor = ({ data = {}, onChange, imageLib = [] }) => {
  const [formData, setFormData] = useState({ ...INITIAL_DATA, ...data });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [initialData, setInitialData] = useState({ ...INITIAL_DATA, ...data });
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [editingLinkIndex, setEditingLinkIndex] = useState(null);
  const [linkForm, setLinkForm] = useState({ name: '', url: '' });

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

  // 友情链接管理
  const handleAddLink = () => {
    setEditingLinkIndex(null);
    setLinkForm({ name: '', url: '' });
    setIsLinkModalOpen(true);
  };

  const handleEditLink = (link, index) => {
    setEditingLinkIndex(index);
    setLinkForm({ ...link });
    setIsLinkModalOpen(true);
  };

  const handleSaveLink = () => {
    if (!linkForm.name || !linkForm.url) {
      alert('请填写链接名称和URL');
      return;
    }
    
    const newLinks = editingLinkIndex !== null
      ? formData.friendLinks.map((link, i) => i === editingLinkIndex ? { ...link, ...linkForm } : link)
      : [...formData.friendLinks, { id: `fl${Date.now()}`, ...linkForm }];
    
    handleChange('friendLinks', newLinks);
    setIsLinkModalOpen(false);
  };

  const handleDeleteLink = (index) => {
    if (confirm('确定删除此友情链接吗？')) {
      const newLinks = formData.friendLinks.filter((_, i) => i !== index);
      handleChange('friendLinks', newLinks);
    }
  };

  // 上级单位管理
  const handleAddParentUnit = () => {
    const newUnits = [...(formData.parentUnits || []), ''];
    handleChange('parentUnits', newUnits);
  };

  const handleUpdateParentUnit = (index, value) => {
    const newUnits = [...(formData.parentUnits || [])];
    newUnits[index] = value;
    handleChange('parentUnits', newUnits);
  };

  const handleDeleteParentUnit = (index) => {
    if (confirm('确定删除此上级单位吗？')) {
      const newUnits = formData.parentUnits.filter((_, i) => i !== index);
      handleChange('parentUnits', newUnits);
    }
  };

  // 模拟历史记录数据
  const historyData = [
    { id: 'h1', time: '2024-03-20 14:30', description: '更新了页脚联系方式', operator: 'admin', status: 'published' },
    { id: 'h2', time: '2024-03-20 14:25', description: '修改了友情链接', operator: 'admin', status: 'draft' },
    { id: 'h3', time: '2024-03-18 10:00', description: '更新了页脚内容', operator: 'admin', status: 'published' },
  ];

  const handleRestoreHistory = (record) => {
    console.log('恢复版本:', record);
    // 这里可以根据record恢复数据
  };

  return (
    <>
      <EditorLayout
        title="页脚内容管理"
        description="管理网站页脚的上级单位信息、联系方式、友情链接等内容。"
        pageKey="footer_content"
        onSave={handlePublish}
        onSaveDraft={handleSaveDraft}
        onRestoreHistory={handleRestoreHistory}
        historyData={historyData}
        hasUnsavedChanges={hasUnsavedChanges}
      >
        <div className="space-y-lg">
          {/* 上级单位和所属企业 */}
          <div className="space-y-md">
            <h3 className="text-body font-semibold text-gray-8">上级单位和所属企业</h3>
            <div className="space-y-sm">
              <div className="flex items-center justify-between">
                <label className="text-body font-medium text-gray-8">上级单位</label>
                <Button variant="add" onClick={handleAddParentUnit}>
                  <Plus className="w-4 h-4" /> 添加单位
                </Button>
              </div>
              {formData.parentUnits && formData.parentUnits.length > 0 ? (
                <div className="space-y-sm">
                  {formData.parentUnits.map((unit, index) => (
                    <div key={index} className="flex items-center gap-sm">
                      <Input 
                        value={unit || ''} 
                        onChange={e => handleUpdateParentUnit(index, e.target.value)} 
                        placeholder="输入上级单位名称"
                        className="flex-1"
                      />
                      <button 
                        onClick={() => handleDeleteParentUnit(index)} 
                        className="p-1 text-gray-6 hover:text-error flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-md text-gray-6">
                  <p className="text-caption">暂无上级单位</p>
                  <p className="text-caption text-gray-5 mt-xxs">点击「添加单位」添加上级单位</p>
                </div>
              )}
            </div>
            <FormItem label="所属企业">
              <Input 
                value={formData.subsidiaryCompany || ''} 
                onChange={e => handleChange('subsidiaryCompany', e.target.value)} 
                placeholder="输入所属企业名称"
              />
            </FormItem>
          </div>

          <div className="border-t border-gray-4" />

          {/* 联系方式 */}
          <div className="space-y-md">
            <h3 className="text-body font-semibold text-gray-8">联系方式</h3>
            <FormItem label="公司地址">
              <Input 
                value={formData.address || ''} 
                onChange={e => handleChange('address', e.target.value)} 
                placeholder="输入公司地址"
              />
            </FormItem>
            <div className="grid grid-cols-2 gap-md">
              <FormItem label="电话/Tel">
                <Input 
                  value={formData.phone || ''} 
                  onChange={e => handleChange('phone', e.target.value)} 
                  placeholder="如：028-68897777"
                />
              </FormItem>
              <FormItem label="传真/FAX">
                <Input 
                  value={formData.fax || ''} 
                  onChange={e => handleChange('fax', e.target.value)} 
                  placeholder="如：028-68931366"
                />
              </FormItem>
            </div>
            <FormItem label="农民工服务热线">
              <Input 
                value={formData.migrantWorkerHotline || ''} 
                onChange={e => handleChange('migrantWorkerHotline', e.target.value)} 
                placeholder="如：028-68931100"
              />
            </FormItem>
            <FormItem label="二维码">
              <ImageSelector 
                label="二维码图片"
                value={formData.qrCode ? { url: formData.qrCode } : null}
                onChange={img => handleChange('qrCode', img?.url || '')}
                library={imageLib}
              />
              <p className="text-caption text-gray-5 mt-xxs">用于页脚右侧显示的二维码图片</p>
            </FormItem>
          </div>

          <div className="border-t border-gray-4" />

          {/* 友情链接 */}
          <div className="space-y-md">
            <div className="flex items-center justify-between">
              <h3 className="text-body font-semibold text-gray-8">友情链接</h3>
              <Button variant="add" onClick={handleAddLink}>
                <Plus className="w-4 h-4" /> 添加链接
              </Button>
            </div>
            {formData.friendLinks && formData.friendLinks.length > 0 ? (
              <div className="space-y-sm">
                {formData.friendLinks.map((link, index) => (
                  <div key={link.id} className="flex items-center justify-between p-md bg-gray-2 rounded-lg group">
                    <div className="flex-1">
                      <div className="text-body font-medium text-gray-8">{link.name}</div>
                      <div className="text-caption text-gray-6 truncate">{link.url}</div>
                    </div>
                    <div className="flex gap-xxs opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEditLink(link, index)} 
                        className="p-1 text-gray-6 hover:text-brand"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteLink(index)} 
                        className="p-1 text-gray-6 hover:text-error"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-lg text-gray-6">
                <p className="text-caption">暂无友情链接</p>
                <p className="text-caption text-gray-5 mt-xxs">点击「添加链接」添加友情链接</p>
              </div>
            )}
          </div>
        </div>
      </EditorLayout>

      {/* 友情链接编辑弹窗 */}
      <Modal 
        isOpen={isLinkModalOpen} 
        onClose={() => setIsLinkModalOpen(false)} 
        title={editingLinkIndex !== null ? '编辑友情链接' : '添加友情链接'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsLinkModalOpen(false)}>取消</Button>
            <Button onClick={handleSaveLink}>确认</Button>
          </>
        }
      >
        <div className="space-y-md">
          <FormItem label="链接名称" required>
            <Input 
              value={linkForm.name} 
              onChange={e => setLinkForm({...linkForm, name: e.target.value})} 
              placeholder="如：工信部"
            />
          </FormItem>
          <FormItem label="链接地址" required>
            <Input 
              value={linkForm.url} 
              onChange={e => setLinkForm({...linkForm, url: e.target.value})} 
              placeholder="如：https://www.miit.gov.cn"
            />
          </FormItem>
        </div>
      </Modal>
    </>
  );
};

export default FooterContentEditor;






