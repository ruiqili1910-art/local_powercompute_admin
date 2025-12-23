import { useState, useEffect } from 'react';
import { Plus, Trash2, Image } from 'lucide-react';
import { ImageSelector, Button, EditorLayout } from '../ui';

const INITIAL_DATA = {
  images: [
    { id: 'st1', url: '' },
    { id: 'st2', url: '' },
  ]
};

const HomeStaffEditor = ({ data = {}, onChange, imageLib = [] }) => {
  const [formData, setFormData] = useState({ ...INITIAL_DATA, ...data });
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
    const newImages = [...(formData.images || []), { id: `st${Date.now()}`, url: '' }];
    setFormData({ ...formData, images: newImages });
  };

  const updateImage = (index, url) => {
    const newImages = formData.images?.map((img, i) => 
      i === index ? { ...img, url } : img
    ) || [];
    setFormData({ ...formData, images: newImages });
  };

  const removeImage = (index) => {
    const newImages = formData.images?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, images: newImages });
  };

  // 模拟历史记录数据
  const historyData = [
    { id: 'h1', time: '2024-03-20 14:30', description: '更新了员工风采轮播图片', operator: 'admin', status: 'published' },
    { id: 'h2', time: '2024-03-20 14:25', description: '添加了新的员工风采图片', operator: 'admin', status: 'draft' },
    { id: 'h3', time: '2024-03-18 10:00', description: '更新了员工风采配置', operator: 'admin', status: 'published' },
  ];

  const handleRestoreHistory = (record) => {
    console.log('恢复版本:', record);
  };

  return (
    <EditorLayout
      title="员工风采"
      description="配置首页「员工风采」展示区域的轮播图片。"
      pageKey="home_staff"
      onSave={handlePublish}
      onSaveDraft={handleSaveDraft}
      onRestoreHistory={handleRestoreHistory}
      historyData={historyData}
      hasUnsavedChanges={hasUnsavedChanges}
    >
      <div className="space-y-lg">
        {/* 轮播图片 */}
        <div className="space-y-md">
          <div className="flex items-center justify-between">
            <h3 className="text-body font-semibold text-gray-8">轮播图片</h3>
            <Button variant="secondary" onClick={addImage}>
              <Plus className="w-4 h-4" /> 添加图片
            </Button>
          </div>

          <div className="grid grid-cols-4 gap-md">
            {(formData.images || []).map((img, index) => (
              <div key={img.id} className="relative group">
                <div className="aspect-[3/2] bg-gray-2 rounded-lg overflow-hidden">
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

          {(formData.images || []).length === 0 && (
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

export default HomeStaffEditor;
