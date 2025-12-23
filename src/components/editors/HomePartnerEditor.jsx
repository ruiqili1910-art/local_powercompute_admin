import { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, Edit, Upload, X, Image } from 'lucide-react';
import { Input, FormItem, Button, Modal, EditorLayout } from '../ui';

const INITIAL_DATA = {
  partners: [
    { id: 'p1', name: 'DAELIM', logo: '' },
    { id: 'p2', name: 'SAMSUNG', logo: '' },
    { id: 'p3', name: 'SIEMENS', logo: '' },
    { id: 'p4', name: '中国石油', logo: '' },
    { id: 'p5', name: 'BASF', logo: '' },
    { id: 'p6', name: 'SULZER', logo: '' },
    { id: 'p7', name: 'FLUOR', logo: '' },
    { id: 'p8', name: 'NOVATEK', logo: '' },
    { id: 'p9', name: 'LUMMUS', logo: '' },
    { id: 'p10', name: 'SAIPEM', logo: '' },
  ]
};

const HomePartnerEditor = ({ data = {}, onChange, imageLib = [] }) => {
  const [formData, setFormData] = useState({ ...INITIAL_DATA, ...data });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [partnerForm, setPartnerForm] = useState({ name: '', logo: '' });
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
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

  const handleAddPartner = () => {
    setEditingIndex(null);
    setPartnerForm({ name: '', logo: '' });
    setIsModalOpen(true);
  };

  const handleEditPartner = (partner, index) => {
    setEditingIndex(index);
    setPartnerForm({ ...partner });
    setIsModalOpen(true);
  };

  const handleSavePartner = () => {
    if (!partnerForm.name) return alert('请填写合作伙伴名称');
    const newPartners = editingIndex !== null
      ? formData.partners.map((p, i) => i === editingIndex ? { ...p, ...partnerForm } : p)
      : [...(formData.partners || []), { id: `p${Date.now()}`, ...partnerForm }];
    setFormData({ ...formData, partners: newPartners });
    setIsModalOpen(false);
  };

  const handleDeletePartner = (index) => {
    if (confirm('确定删除？')) {
      setFormData({ ...formData, partners: formData.partners.filter((_, i) => i !== index) });
    }
  };

  // 文件上传处理
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const fakeUrl = URL.createObjectURL(file);
      setPartnerForm({ ...partnerForm, logo: fakeUrl });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const fakeUrl = URL.createObjectURL(file);
      setPartnerForm({ ...partnerForm, logo: fakeUrl });
    }
  };

  // 模拟历史记录数据
  const historyData = [
    { id: 'h1', time: '2024-03-20 14:30', description: '更新了合作伙伴列表', operator: 'admin', status: 'published' },
    { id: 'h2', time: '2024-03-20 14:25', description: '添加了新的合作伙伴', operator: 'admin', status: 'draft' },
    { id: 'h3', time: '2024-03-18 10:00', description: '更新了合作伙伴配置', operator: 'admin', status: 'published' },
  ];

  const handleRestoreHistory = (record) => {
    console.log('恢复版本:', record);
  };

  return (
    <>
      <EditorLayout
        title="合作伙伴"
        description="配置首页「合作伙伴」展示区域，展示企业合作品牌 Logo。"
        pageKey="home_partner"
        onSave={handlePublish}
        onSaveDraft={handleSaveDraft}
        onRestoreHistory={handleRestoreHistory}
        historyData={historyData}
        hasUnsavedChanges={hasUnsavedChanges}
      >
        <div className="space-y-lg">
          {/* 合作伙伴列表 */}
          <div className="space-y-md">
            <div className="flex items-center justify-between">
              <h3 className="text-body font-semibold text-gray-8">合作伙伴列表 ({formData.partners?.length || 0})</h3>
              <Button variant="secondary" onClick={handleAddPartner}>
                <Plus className="w-4 h-4" /> 添加伙伴
              </Button>
            </div>

            <div className="grid grid-cols-5 gap-md">
              {(formData.partners || []).map((partner, index) => (
                <div key={partner.id} className="bg-gray-2 rounded-lg p-md flex flex-col items-center justify-center group relative min-h-[100px]">
                  {partner.logo ? (
                    <img src={partner.logo} alt={partner.name} className="max-w-full max-h-12 object-contain" />
                  ) : (
                    <div className="text-body font-bold text-gray-6">{partner.name}</div>
                  )}
                  <div className="absolute top-1 right-1 flex gap-xxs opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEditPartner(partner, index)} className="p-1 bg-white rounded shadow text-gray-6 hover:text-brand"><Edit className="w-3 h-3" /></button>
                    <button onClick={() => handleDeletePartner(index)} className="p-1 bg-white rounded shadow text-gray-6 hover:text-error"><Trash2 className="w-3 h-3" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </EditorLayout>

      {/* 编辑弹窗 */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingIndex !== null ? '编辑合作伙伴' : '添加合作伙伴'}
        footer={<><Button variant="secondary" onClick={() => setIsModalOpen(false)}>取消</Button><Button onClick={handleSavePartner}>确认</Button></>}>
        <div className="space-y-md">
          <FormItem label="伙伴名称" required>
            <Input value={partnerForm.name} onChange={e => setPartnerForm({...partnerForm, name: e.target.value})} placeholder="如：SIEMENS" />
          </FormItem>
          
          <FormItem label="Logo 图片">
            {partnerForm.logo ? (
              <div className="flex items-center gap-md p-md bg-gray-2 rounded-lg">
                <img src={partnerForm.logo} alt="" className="max-w-[120px] max-h-12 object-contain" />
                <div className="flex-1 text-caption text-gray-6">Logo 已上传</div>
                <button onClick={() => setPartnerForm({...partnerForm, logo: ''})} className="p-1 text-gray-6 hover:text-error">
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div
                className={`border-2 border-dashed rounded-lg p-lg text-center cursor-pointer transition-all ${
                  isDragging ? 'border-brand bg-brand-light' : 'border-gray-4 hover:border-brand'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className={`w-8 h-8 mx-auto mb-sm ${isDragging ? 'text-brand' : 'text-gray-5'}`} />
                <p className="text-body text-gray-7">拖拽或点击上传 Logo</p>
                <p className="text-caption text-gray-6">建议使用透明背景 PNG 格式</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            )}
          </FormItem>
        </div>
      </Modal>
    </>
  );
};

export default HomePartnerEditor;
