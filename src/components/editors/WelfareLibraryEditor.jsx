import { useState } from 'react';
import { Trash2, Edit } from 'lucide-react';
import { Button, Input, FormItem, TextArea, ImageSelector, Modal, PageBanner } from '../ui';

const WelfareLibraryEditor = ({ welfares = [], onChange, imageLib }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWelfare, setEditingWelfare] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    type: 'poverty',
    cover: '',
    content: '',
    activityDate: '',
    location: '',
    status: 'published'
  });

  const handleAdd = () => {
    setEditingWelfare(null);
    setFormData({
      title: '',
      type: 'poverty',
      cover: '',
      content: '',
      activityDate: '',
      location: '',
      status: 'published'
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.title) {
      alert('请输入活动标题');
      return;
    }
    const newWelfare = {
      ...formData,
      id: editingWelfare?.id || `welfare_${Date.now()}`,
      createTime: editingWelfare?.createTime || new Date().toISOString(),
      updateTime: new Date().toISOString()
    };
    
    if (editingWelfare) {
      onChange(welfares.map(w => w.id === editingWelfare.id ? newWelfare : w));
    } else {
      onChange([...welfares, newWelfare]);
    }
    
    setIsModalOpen(false);
    setEditingWelfare(null);
  };

  const handleEdit = (welfare) => {
    setEditingWelfare(welfare);
    setFormData(welfare);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm('确定删除该公益服务吗？')) {
      onChange(welfares.filter(w => w.id !== id));
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-[#E6E8EB] overflow-hidden">
        {/* PageBanner */}
        <PageBanner 
          title="公益服务"
          description="管理公益服务活动信息。数据可用于可持续发展-社会责任等页面。"
          buttonText="新增公益服务"
          buttonIcon="add"
          onButtonClick={handleAdd}
        />

        {/* 公益服务列表 */}
        <div className="px-xl py-lg border-t border-[#F0F0F0]">
          <div className="space-y-3">
            {welfares.length === 0 ? (
              <div className="text-center py-12 text-[#8A9099]">
                <p>暂无公益服务</p>
              </div>
            ) : (
              welfares.map(welfare => (
                <div 
                  key={welfare.id} 
                  className="p-4 border border-[#F0F0F0] rounded-lg hover:border-[#2B7FFF]/50 hover:shadow-md transition-all bg-[#FAFAFA]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h5 className="font-semibold text-[#1C1F23]">{welfare.title || '未命名活动'}</h5>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          welfare.type === 'poverty' ? 'bg-[#E6F1FF] text-[#2B7FFF]' : 'bg-[#FFF7E6] text-[#FAAD14]'
                        }`}>
                          {welfare.type === 'poverty' ? '精准扶贫' : '其他公益'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-[#4B4F55] mb-2">
                        <div>活动日期：{welfare.activityDate || '-'}</div>
                        <div>活动地点：{welfare.location || '-'}</div>
                      </div>
                      <p className="text-sm text-[#4B4F55] line-clamp-2">{welfare.content || '无内容'}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="secondary" onClick={() => handleEdit(welfare)}><Edit className="w-4 h-4"/> 编辑</Button>
                      <Button variant="danger" onClick={() => handleDelete(welfare.id)}><Trash2 className="w-4 h-4"/> 删除</Button>
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
        onClose={() => { setIsModalOpen(false); setEditingWelfare(null); }} 
        title={editingWelfare ? '编辑公益服务' : '新增公益服务'}
        footer={
          <>
            <Button variant="secondary" onClick={() => { setIsModalOpen(false); setEditingWelfare(null); }}>取消</Button>
            <Button onClick={handleSave}>保存</Button>
          </>
        }
      >
        <div className="space-y-6">
          <FormItem label="活动标题 *">
            <Input 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
              placeholder="请输入活动标题"
            />
          </FormItem>

          <FormItem label="活动类型">
            <select 
              value={formData.type}
              onChange={e => setFormData({...formData, type: e.target.value})}
              className="w-full px-4 py-2 bg-white border border-[#E6E8EB] rounded-lg text-sm text-[#1C1F23]"
            >
              <option value="poverty">精准扶贫</option>
              <option value="other">其他公益</option>
            </select>
          </FormItem>

          <FormItem label="活动封面">
            <ImageSelector 
              label="" 
              value={formData.cover ? { url: formData.cover, title: 'cover' } : null} 
              onChange={img => setFormData({...formData, cover: img?.url || ''})} 
              library={imageLib} 
            />
          </FormItem>

          <FormItem label="活动内容 *">
            <TextArea 
              value={formData.content} 
              onChange={e => setFormData({...formData, content: e.target.value})} 
              rows={8}
              placeholder="请输入活动内容"
            />
          </FormItem>

          <div className="grid grid-cols-2 gap-4">
            <FormItem label="活动日期">
              <Input 
                type="date"
                value={formData.activityDate} 
                onChange={e => setFormData({...formData, activityDate: e.target.value})} 
              />
            </FormItem>
            <FormItem label="活动地点">
              <Input 
                value={formData.location} 
                onChange={e => setFormData({...formData, location: e.target.value})} 
                placeholder="请输入活动地点"
              />
            </FormItem>
          </div>

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

export default WelfareLibraryEditor;
