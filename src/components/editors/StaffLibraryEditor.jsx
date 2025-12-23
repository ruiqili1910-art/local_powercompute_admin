import { useState } from 'react';
import { Trash2, Edit } from 'lucide-react';
import { Button, Input, FormItem, TextArea, ImageSelector, Modal, PageBanner } from '../ui';

const StaffLibraryEditor = ({ staffs = [], onChange, imageLib }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    description: '',
    publishTime: '',
    sort: 0,
    status: 'published'
  });

  const handleAdd = () => {
    setEditingStaff(null);
    setFormData({
      title: '',
      image: '',
      description: '',
      publishTime: '',
      sort: 0,
      status: 'published'
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.title) {
      alert('请输入标题');
      return;
    }
    const newStaff = {
      ...formData,
      id: editingStaff?.id || `staff_${Date.now()}`,
      createTime: editingStaff?.createTime || new Date().toISOString(),
      updateTime: new Date().toISOString()
    };
    
    if (editingStaff) {
      onChange(staffs.map(s => s.id === editingStaff.id ? newStaff : s));
    } else {
      onChange([...staffs, newStaff]);
    }
    
    setIsModalOpen(false);
    setEditingStaff(null);
  };

  const handleEdit = (staff) => {
    setEditingStaff(staff);
    setFormData(staff);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm('确定删除该员工风采吗？')) {
      onChange(staffs.filter(s => s.id !== id));
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-[#E6E8EB] overflow-hidden">
        {/* PageBanner */}
        <PageBanner 
          title="员工风采库"
          description="管理员工风采信息。数据可用于首页、品牌文化等页面。"
          buttonText="新增员工风采"
          buttonIcon="add"
          onButtonClick={handleAdd}
        />

        {/* 员工风采列表 */}
        <div className="px-xl py-lg border-t border-[#F0F0F0]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {staffs.length === 0 ? (
              <div className="col-span-full text-center py-12 text-[#8A9099]">
                <p>暂无员工风采</p>
              </div>
            ) : (
              staffs.map(staff => (
                <div 
                  key={staff.id} 
                  className="bg-[#FAFAFA] p-5 rounded-xl border border-[#F0F0F0] shadow-sm hover:shadow-md transition-all group hover:border-[#2B7FFF]/30"
                >
                  {staff.image && (
                    <div className={`w-full h-48 ${staff.image} rounded-lg mb-3 bg-cover`}></div>
                  )}
                  <div className="space-y-2">
                    <h5 className="text-sm font-bold text-[#1C1F23] line-clamp-2">{staff.title}</h5>
                    <p className="text-xs text-[#4B4F55] line-clamp-2">{staff.description || '无描述'}</p>
                    <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="secondary" className="!px-2 !py-1 !text-xs" onClick={() => handleEdit(staff)}>
                        <Edit className="w-3 h-3"/> 编辑
                      </Button>
                      <Button variant="danger" className="!px-2 !py-1 !text-xs" onClick={() => handleDelete(staff.id)}>
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
        onClose={() => { setIsModalOpen(false); setEditingStaff(null); }} 
        title={editingStaff ? '编辑员工风采' : '新增员工风采'}
        footer={
          <>
            <Button variant="secondary" onClick={() => { setIsModalOpen(false); setEditingStaff(null); }}>取消</Button>
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

          <FormItem label="图片 *">
            <ImageSelector 
              label="" 
              value={formData.image ? { url: formData.image, title: 'staff' } : null} 
              onChange={img => setFormData({...formData, image: img?.url || ''})} 
              library={imageLib} 
            />
          </FormItem>

          <FormItem label="描述">
            <TextArea 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
              rows={4}
              placeholder="请输入描述"
            />
          </FormItem>

          <div className="grid grid-cols-2 gap-4">
            <FormItem label="发布时间">
              <Input 
                type="datetime-local"
                value={formData.publishTime} 
                onChange={e => setFormData({...formData, publishTime: e.target.value})} 
              />
            </FormItem>
            <FormItem label="排序">
              <Input 
                type="number"
                value={formData.sort} 
                onChange={e => setFormData({...formData, sort: parseInt(e.target.value) || 0})} 
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

export default StaffLibraryEditor;
