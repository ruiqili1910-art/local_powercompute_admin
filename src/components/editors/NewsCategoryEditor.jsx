import { useState } from 'react';
import { Edit2, GripVertical, Tag } from 'lucide-react';
import { Modal, Button, FormItem, Input, PageBanner } from '../ui';

const NewsCategoryEditor = ({ categories, onChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  
  // 拖拽排序状态
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  // 颜色选项
  const colorOptions = [
    { id: 'blue', label: '蓝色', value: 'bg-blue-100 text-blue-700' },
    { id: 'purple', label: '紫色', value: 'bg-purple-100 text-purple-700' },
    { id: 'green', label: '绿色', value: 'bg-green-100 text-green-700' },
    { id: 'orange', label: '橙色', value: 'bg-orange-100 text-orange-700' },
    { id: 'red', label: '红色', value: 'bg-red-100 text-red-700' },
    { id: 'pink', label: '粉色', value: 'bg-pink-100 text-pink-700' },
    { id: 'teal', label: '青色', value: 'bg-teal-100 text-teal-700' },
    { id: 'indigo', label: '靛蓝', value: 'bg-indigo-100 text-indigo-700' },
  ];

  // 编辑分类
  const handleEdit = (cat) => {
    setEditingCategory({ ...cat });
    setIsModalOpen(true);
  };

  // 保存分类
  const handleSave = () => {
    if (!editingCategory.label) {
      alert('请填写分类名称');
      return;
    }
    
    onChange(categories.map(c => c.id === editingCategory.id ? editingCategory : c));
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  // 拖拽开始
  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  // 拖拽经过
  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  // 拖拽结束
  const handleDrop = (index) => {
    if (draggedIndex !== null && draggedIndex !== index) {
      const newCategories = [...categories];
      const [draggedItem] = newCategories.splice(draggedIndex, 1);
      newCategories.splice(index, 0, draggedItem);
      onChange(newCategories);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // 拖拽离开
  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-[#E6E8EB] overflow-hidden">
        {/* PageBanner */}
        <PageBanner 
          title="分类管理"
          description="管理新闻的分类标签，可用于新闻筛选和前台展示。"
        />

        {/* 内容区域 */}
        <div className="px-xl py-lg border-t border-gray-4">
          <div className="space-y-sm">
            {categories.map((cat, index) => (
              <div 
                key={cat.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={() => handleDrop(index)}
                onDragEnd={handleDragEnd}
                className={`flex items-center gap-md p-md bg-gray-2 rounded-md border transition-all group cursor-move ${
                  draggedIndex === index 
                    ? 'opacity-50 border-brand' 
                    : dragOverIndex === index 
                      ? 'border-brand bg-brand-light' 
                      : 'border-gray-4 hover:border-gray-5 hover:shadow-light'
                }`}
              >
                {/* 拖拽手柄 */}
                <div className="cursor-grab text-gray-5 group-hover:text-gray-6 transition-colors">
                  <GripVertical className="w-5 h-5" />
                </div>
                
                {/* 序号 */}
                <div className="w-8 h-8 bg-white rounded-sm border border-gray-4 flex items-center justify-center text-body font-medium text-gray-7 flex-shrink-0">
                  {index + 1}
                </div>
                
                {/* 分类信息 */}
                <div className="flex-1 flex items-center gap-md min-w-0">
                  <span className="font-medium text-body text-gray-8 truncate">{cat.label}</span>
                  <span className={`px-xs py-xxs rounded-xs text-caption font-medium w-fit ${cat.color}`}>
                    {cat.label}
                  </span>
                </div>
                
                {/* 编辑按钮 */}
                <button 
                  onClick={(e) => { e.stopPropagation(); handleEdit(cat); }}
                  className="p-xs text-brand hover:bg-brand-light rounded-sm transition-colors opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                  title="编辑"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            {categories.length === 0 && (
              <div className="text-center py-xxl text-gray-6">
                <Tag className="w-12 h-12 mx-auto mb-md opacity-30" />
                <p className="text-body">暂无分类</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 编辑弹窗 */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCategory(null);
        }}
        title="编辑分类"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>取消</Button>
            <Button variant="primary" onClick={handleSave}>保存</Button>
          </>
        }
      >
        {editingCategory && (
          <div className="space-y-4">
            <FormItem label="分类名称" required>
              <Input
                value={editingCategory.label}
                onChange={e => setEditingCategory({...editingCategory, label: e.target.value})}
                placeholder="请输入分类名称"
              />
            </FormItem>
            
            <FormItem label="标签颜色">
              <div className="grid grid-cols-4 gap-2">
                {colorOptions.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setEditingCategory({...editingCategory, color: opt.value})}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${opt.value} ${
                      editingCategory.color === opt.value 
                        ? 'ring-2 ring-offset-2 ring-[#2B7FFF]' 
                        : 'hover:opacity-80'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </FormItem>
            
            <div className="pt-4 border-t border-[#F0F0F0]">
              <p className="text-sm text-[#8A9099] mb-2">预览效果：</p>
              <span className={`px-3 py-1.5 rounded text-sm font-medium ${editingCategory.color}`}>
                {editingCategory.label || '分类名称'}
              </span>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default NewsCategoryEditor;
