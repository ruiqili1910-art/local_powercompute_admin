import { useState } from 'react';
import { Trash2, Edit } from 'lucide-react';
import { Button, Input, FormItem, TextArea, ImageSelector, Modal, PageBanner } from '../ui';

const TechLibraryEditor = ({ techs = [], onChange, imageLib }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTech, setEditingTech] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    image: '',
    description: '',
    achievementDate: '',
    status: 'published'
  });

  const handleAdd = () => {
    setEditingTech(null);
    setFormData({
      title: '',
      category: '',
      image: '',
      description: '',
      achievementDate: '',
      status: 'published'
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.title) {
      alert('请输入成果名称');
      return;
    }
    const newTech = {
      ...formData,
      id: editingTech?.id || `tech_${Date.now()}`,
      createTime: editingTech?.createTime || new Date().toISOString(),
      updateTime: new Date().toISOString()
    };
    
    if (editingTech) {
      onChange(techs.map(t => t.id === editingTech.id ? newTech : t));
    } else {
      onChange([...techs, newTech]);
    }
    
    setIsModalOpen(false);
    setEditingTech(null);
  };

  const handleEdit = (tech) => {
    setEditingTech(tech);
    setFormData(tech);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm('确定删除该科技成果吗？')) {
      onChange(techs.filter(t => t.id !== id));
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-[#E6E8EB] overflow-hidden">
        {/* PageBanner */}
        <PageBanner 
          title="科技成果库"
          description="管理科技成果信息。数据可用于可持续发展-科技创新等页面。"
          buttonText="新增科技成果"
          buttonIcon="add"
          onButtonClick={handleAdd}
        />

        {/* 科技成果列表 */}
        <div className="px-xl py-lg border-t border-[#F0F0F0]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {techs.length === 0 ? (
              <div className="col-span-full text-center py-12 text-[#8A9099]">
                <p>暂无科技成果</p>
              </div>
            ) : (
              techs.map(tech => (
                <div 
                  key={tech.id} 
                  className="bg-[#FAFAFA] p-5 rounded-xl border border-[#F0F0F0] shadow-sm hover:shadow-md transition-all group hover:border-[#2B7FFF]/30"
                >
                  {tech.image && (
                    <div className={`w-full h-32 ${tech.image} rounded-lg mb-3 bg-cover`}></div>
                  )}
                  <div className="space-y-2">
                    <h5 className="text-sm font-bold text-[#1C1F23] line-clamp-2">{tech.title}</h5>
                    <div className="text-xs text-[#8A9099]">
                      <div>分类：{tech.category || '-'}</div>
                      <div>获得日期：{tech.achievementDate || '-'}</div>
                    </div>
                    <p className="text-xs text-[#4B4F55] line-clamp-2">{tech.description || '无描述'}</p>
                    <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="secondary" className="!px-2 !py-1 !text-xs" onClick={() => handleEdit(tech)}>
                        <Edit className="w-3 h-3"/> 编辑
                      </Button>
                      <Button variant="danger" className="!px-2 !py-1 !text-xs" onClick={() => handleDelete(tech.id)}>
                        <Trash2 className="w-3 h-3"/> 删除
                      </Button>
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
        onClose={() => { setIsModalOpen(false); setEditingTech(null); }} 
        title={editingTech ? '编辑科技成果' : '新增科技成果'}
        footer={
          <>
            <Button variant="secondary" onClick={() => { setIsModalOpen(false); setEditingTech(null); }}>取消</Button>
            <Button onClick={handleSave}>保存</Button>
          </>
        }
      >
        <div className="space-y-6">
          <FormItem label="成果名称 *">
            <Input 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
              placeholder="请输入成果名称"
            />
          </FormItem>

          <FormItem label="成果分类">
            <Input 
              value={formData.category} 
              onChange={e => setFormData({...formData, category: e.target.value})} 
              placeholder="请输入成果分类"
            />
          </FormItem>

          <FormItem label="成果图片">
            <ImageSelector 
              label="" 
              value={formData.image ? { url: formData.image, title: 'tech' } : null} 
              onChange={img => setFormData({...formData, image: img?.url || ''})} 
              library={imageLib} 
            />
          </FormItem>

          <FormItem label="成果描述 *">
            <TextArea 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
              rows={8}
              placeholder="请输入成果描述"
            />
          </FormItem>

          <FormItem label="获得日期">
            <Input 
              type="date"
              value={formData.achievementDate} 
              onChange={e => setFormData({...formData, achievementDate: e.target.value})} 
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

export default TechLibraryEditor;
