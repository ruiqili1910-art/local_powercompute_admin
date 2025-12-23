import { useState } from 'react';
import { Trash2, Edit } from 'lucide-react';
import { Button, Input, FormItem, TextArea, Modal, PageBanner } from '../ui';

const BrandLibraryEditor = ({ brands = [], onChange, imageLib }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [formData, setFormData] = useState({
    type: 'declaration',
    title: '',
    content: '',
    media: '',
    status: 'published'
  });

  const types = [
    { id: 'declaration', label: '品牌宣言' },
    { id: 'song', label: '企业厂歌' },
    { id: 'video', label: '企业宣传片' }
  ];

  const handleAdd = () => {
    setEditingBrand(null);
    setFormData({
      type: 'declaration',
      title: '',
      content: '',
      media: '',
      status: 'published'
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.title) {
      alert('请输入标题');
      return;
    }
    const newBrand = {
      ...formData,
      id: editingBrand?.id || `brand_${Date.now()}`,
      createTime: editingBrand?.createTime || new Date().toISOString(),
      updateTime: new Date().toISOString()
    };
    
    if (editingBrand) {
      onChange(brands.map(b => b.id === editingBrand.id ? newBrand : b));
    } else {
      onChange([...brands, newBrand]);
    }
    
    setIsModalOpen(false);
    setEditingBrand(null);
  };

  const handleEdit = (brand) => {
    setEditingBrand(brand);
    setFormData(brand);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm('确定删除该品牌宣言吗？')) {
      onChange(brands.filter(b => b.id !== id));
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-[#E6E8EB] overflow-hidden">
        {/* PageBanner */}
        <PageBanner 
          title="品牌宣言库"
          description="管理品牌宣言、企业厂歌、企业宣传片。数据可用于品牌文化等页面。"
          buttonText="新增品牌宣言"
          buttonIcon="add"
          onButtonClick={handleAdd}
        />

        {/* 品牌宣言列表 */}
        <div className="px-xl py-lg border-t border-[#F0F0F0]">
          <div className="space-y-3">
            {brands.length === 0 ? (
              <div className="text-center py-12 text-[#8A9099]">
                <p>暂无品牌宣言</p>
              </div>
            ) : (
              brands.map(brand => (
                <div 
                  key={brand.id} 
                  className="p-4 border border-[#F0F0F0] rounded-lg hover:border-[#2B7FFF]/50 hover:shadow-md transition-all bg-[#FAFAFA]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h5 className="font-semibold text-[#1C1F23]">{brand.title || '未命名'}</h5>
                        <span className="text-xs px-2 py-1 rounded-full bg-[#E6F1FF] text-[#2B7FFF]">
                          {types.find(t => t.id === brand.type)?.label || brand.type}
                        </span>
                      </div>
                      <p className="text-sm text-[#4B4F55] line-clamp-2">{brand.content || '无内容'}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="secondary" onClick={() => handleEdit(brand)}><Edit className="w-4 h-4"/> 编辑</Button>
                      <Button variant="danger" onClick={() => handleDelete(brand.id)}><Trash2 className="w-4 h-4"/> 删除</Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 新增/编辑弹窗 */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingBrand(null); }} 
        title={editingBrand ? '编辑品牌宣言' : '新增品牌宣言'}
        footer={
          <>
            <Button variant="secondary" onClick={() => { setIsModalOpen(false); setEditingBrand(null); }}>取消</Button>
            <Button onClick={handleSave}>保存</Button>
          </>
        }
      >
        <div className="space-y-6">
          <FormItem label="类型 *">
            <select 
              value={formData.type}
              onChange={e => setFormData({...formData, type: e.target.value})}
              className="w-full px-4 py-2 bg-white border border-[#E6E8EB] rounded-lg text-sm text-[#1C1F23]"
            >
              {types.map(t => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          </FormItem>

          <FormItem label="标题 *">
            <Input 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
              placeholder="请输入标题"
            />
          </FormItem>

          <FormItem label="内容">
            <TextArea 
              value={formData.content} 
              onChange={e => setFormData({...formData, content: e.target.value})} 
              rows={8}
              placeholder="请输入内容"
            />
          </FormItem>

          <FormItem label="媒体文件">
            <Input 
              value={formData.media} 
              onChange={e => setFormData({...formData, media: e.target.value})} 
              placeholder="请输入媒体文件URL（音频/视频）"
            />
          </FormItem>

          <FormItem label="状态">
            <select 
              value={formData.status}
              onChange={e => setFormData({...formData, status: e.target.value})}
              className="w-full px-4 py-2 bg-white border border-[#E6E8EB] rounded-lg text-sm text-[#1C1F23]"
            >
              <option value="published">已发布</option>
              <option value="offline">已下架</option>
            </select>
          </FormItem>
        </div>
      </Modal>
    </>
  );
};

export default BrandLibraryEditor;
