import { useState } from 'react';
import { Trash2, Edit } from 'lucide-react';
import { Button, Input, FormItem, TextArea, ImageSelector, Modal, PageBanner } from '../ui';

const HRLibraryEditor = ({ hrs = [], onChange, imageLib }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHR, setEditingHR] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    type: 'strategy',
    content: '',
    image: '',
    status: 'published'
  });

  const handleAdd = () => {
    setEditingHR(null);
    setFormData({
      title: '',
      type: 'strategy',
      content: '',
      image: '',
      status: 'published'
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.content) {
      alert('请输入标题和内容');
      return;
    }
    const newHR = {
      ...formData,
      id: editingHR?.id || `hr_${Date.now()}`,
      createTime: editingHR?.createTime || new Date().toISOString(),
      updateTime: new Date().toISOString()
    };
    
    if (editingHR) {
      onChange(hrs.map(h => h.id === editingHR.id ? newHR : h));
    } else {
      onChange([...hrs, newHR]);
    }
    
    setIsModalOpen(false);
    setEditingHR(null);
  };

  const handleEdit = (hr) => {
    setEditingHR(hr);
    setFormData(hr);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm('确定删除该人力资源信息吗？')) {
      onChange(hrs.filter(h => h.id !== id));
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-[#E6E8EB] overflow-hidden">
        {/* PageBanner */}
        <PageBanner 
          title="人力资源库"
          description="管理人力资源信息（人才战略/人才队伍）。数据可用于人力资源、企业公开等页面。"
          buttonText="新增人力资源"
          buttonIcon="add"
          onButtonClick={handleAdd}
        />

        {/* 人力资源列表 */}
        <div className="px-xl py-lg border-t border-[#F0F0F0]">
          <div className="space-y-3">
            {hrs.length === 0 ? (
              <div className="text-center py-12 text-[#8A9099]">
                <p>暂无人力资源信息</p>
              </div>
            ) : (
              hrs.map(hr => (
                <div 
                  key={hr.id} 
                  className="p-4 border border-[#F0F0F0] rounded-lg hover:border-[#2B7FFF]/50 hover:shadow-md transition-all bg-[#FAFAFA]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h5 className="font-semibold text-[#1C1F23]">{hr.title || '未命名'}</h5>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          hr.type === 'strategy' ? 'bg-[#E6F1FF] text-[#2B7FFF]' : 'bg-[#FFF7E6] text-[#FAAD14]'
                        }`}>
                          {hr.type === 'strategy' ? '人才战略' : '人才队伍'}
                        </span>
                      </div>
                      <p className="text-sm text-[#4B4F55] line-clamp-3">{hr.content || '无内容'}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="secondary" onClick={() => handleEdit(hr)}><Edit className="w-4 h-4"/> 编辑</Button>
                      <Button variant="danger" onClick={() => handleDelete(hr.id)}><Trash2 className="w-4 h-4"/> 删除</Button>
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
        onClose={() => { setIsModalOpen(false); setEditingHR(null); }} 
        title={editingHR ? '编辑人力资源' : '新增人力资源'}
        footer={
          <>
            <Button variant="secondary" onClick={() => { setIsModalOpen(false); setEditingHR(null); }}>取消</Button>
            <Button onClick={handleSave}>保存</Button>
          </>
        }
      >
        <div className="space-y-6">
          <FormItem label="标题 *">
            <Input 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
              placeholder="请输入标题"
            />
          </FormItem>

          <FormItem label="类型">
            <select 
              value={formData.type}
              onChange={e => setFormData({...formData, type: e.target.value})}
              className="w-full px-4 py-2 bg-white border border-[#E6E8EB] rounded-lg text-sm text-[#1C1F23]"
            >
              <option value="strategy">人才战略</option>
              <option value="team">人才队伍</option>
            </select>
          </FormItem>

          <FormItem label="内容 *">
            <TextArea 
              value={formData.content} 
              onChange={e => setFormData({...formData, content: e.target.value})} 
              rows={10}
              placeholder="请输入内容"
            />
          </FormItem>

          <FormItem label="配图">
            <ImageSelector 
              label="" 
              value={formData.image ? { url: formData.image, title: 'hr' } : null} 
              onChange={img => setFormData({...formData, image: img?.url || ''})} 
              library={imageLib} 
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

export default HRLibraryEditor;
