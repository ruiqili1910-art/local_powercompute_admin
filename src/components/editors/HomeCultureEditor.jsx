import { useState, useEffect } from 'react';
import { Plus, Trash2, Heart, Award, Image } from 'lucide-react';
import { ImageSelector, Button, EditorLayout } from '../ui';

const INITIAL_DATA = {
  responsibility: {
    images: [
      { id: 'r1', url: '' },
      { id: 'r2', url: '' },
    ]
  },
  culture: {
    images: [
      { id: 'c1', url: '' },
      { id: 'c2', url: '' },
    ]
  }
};

const HomeCultureEditor = ({ data = {}, onChange, imageLib = [] }) => {
  const [formData, setFormData] = useState({ ...INITIAL_DATA, ...data });
  const [activeSection, setActiveSection] = useState('responsibility');
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

  const addImage = () => {
    const key = activeSection;
    const newImages = [...(formData[key]?.images || []), { id: `${key[0]}${Date.now()}`, url: '' }];
    setFormData({
      ...formData,
      [key]: { ...formData[key], images: newImages }
    });
  };

  const updateImage = (index, url) => {
    const key = activeSection;
    const newImages = formData[key]?.images?.map((img, i) => 
      i === index ? { ...img, url } : img
    ) || [];
    setFormData({
      ...formData,
      [key]: { ...formData[key], images: newImages }
    });
  };

  const removeImage = (index) => {
    const key = activeSection;
    const newImages = formData[key]?.images?.filter((_, i) => i !== index) || [];
    setFormData({
      ...formData,
      [key]: { ...formData[key], images: newImages }
    });
  };

  const currentImages = formData[activeSection]?.images || [];

  // 模拟历史记录数据
  const historyData = [
    { id: 'h1', time: '2024-03-20 14:30', description: '更新了社会责任轮播图片', operator: 'admin', status: 'published' },
    { id: 'h2', time: '2024-03-20 14:25', description: '修改了企业文化轮播图片', operator: 'admin', status: 'draft' },
    { id: 'h3', time: '2024-03-18 10:00', description: '更新了社会责任与文化配置', operator: 'admin', status: 'published' },
  ];

  const handleRestoreHistory = (record) => {
    console.log('恢复版本:', record);
  };

  return (
    <EditorLayout
      title="社会责任与文化"
      description="配置首页「社会责任」和「企业文化」两个轮播展示区域的图片。"
      pageKey="home_culture"
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
            { id: 'responsibility', label: '社会责任', icon: Heart },
            { id: 'culture', label: '企业文化', icon: Award }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`px-md py-xs rounded-sm text-body font-medium flex items-center gap-xs ${
                activeSection === tab.id ? 'bg-brand-light text-brand' : 'text-gray-6 hover:bg-gray-2'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* 轮播图片 */}
        <div className="space-y-md">
          <div className="flex items-center justify-between">
            <h3 className="text-body font-semibold text-gray-8">轮播图片</h3>
            <Button variant="secondary" onClick={addImage}>
              <Plus className="w-4 h-4" /> 添加图片
            </Button>
          </div>

          <div className="grid grid-cols-4 gap-md">
            {currentImages.map((img, index) => (
              <div key={img.id} className="relative group">
                <div className="aspect-video bg-gray-2 rounded-lg overflow-hidden">
                  {img.url ? (
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Image className="w-10 h-10 text-gray-4" />
                    </div>
                  )}
                </div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => removeImage(index)}
                    className="p-1.5 bg-white rounded shadow text-gray-6 hover:text-error"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-sm">
                  <ImageSelector
                    label=""
                    value={img.url ? { url: img.url } : null}
                    onChange={newImg => updateImage(index, newImg?.url || '')}
                    library={imageLib}
                  />
                </div>
              </div>
            ))}
          </div>

          {currentImages.length === 0 && (
            <div className="text-center py-lg bg-gray-2 rounded-lg">
              <Image className="w-12 h-12 mx-auto mb-sm text-gray-4" />
              <p className="text-gray-6">暂无轮播图片</p>
              <p className="text-caption text-gray-5">点击上方按钮添加图片</p>
            </div>
          )}
        </div>
      </div>
    </EditorLayout>
  );
};

export default HomeCultureEditor;
