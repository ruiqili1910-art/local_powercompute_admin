import { useState } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';
import { Button, Input, FormItem, TextArea, ImageSelector, Modal, PageBanner } from '../ui';

const CompanyHonorEditor = ({ honors = [], onChange, imageLib }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [editingHonor, setEditingHonor] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    type: 'enterprise',
    image: '',
    awardDate: '',
    awardOrg: '',
    description: '',
    sort: 0,
    status: 'published'
  });

  const filteredHonors = filter === 'all' 
    ? honors 
    : honors.filter(h => h.type === filter);

  const handleAdd = () => {
    setEditingHonor(null);
    setFormData({
      title: '',
      type: 'enterprise',
      image: '',
      awardDate: '',
      awardOrg: '',
      description: '',
      sort: 0,
      status: 'published'
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.title) {
      alert('请输入荣誉名称');
      return;
    }
    const newHonor = {
      ...formData,
      id: editingHonor?.id || `honor_${Date.now()}`,
      createTime: editingHonor?.createTime || new Date().toISOString(),
      updateTime: new Date().toISOString()
    };
    
    if (editingHonor) {
      onChange(honors.map(h => h.id === editingHonor.id ? newHonor : h));
    } else {
      onChange([...honors, newHonor]);
    }
    
    setIsModalOpen(false);
    setEditingHonor(null);
  };

  const handleEdit = (honor) => {
    setEditingHonor(honor);
    setFormData(honor);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm('确定删除该荣誉吗？')) {
      onChange(honors.filter(h => h.id !== id));
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-[#E6E8EB] overflow-hidden">
        {/* PageBanner */}
        <PageBanner 
          title="公司荣誉库"
          description="管理公司荣誉信息，包括企业荣誉和社会荣誉。数据可用于关于我们、可持续发展等页面。"
          buttonText="添加荣誉"
          buttonIcon="add"
          onButtonClick={handleAdd}
        />

        {/* 分类筛选 */}
        <div className="px-xl py-md border-t border-[#F0F0F0]">
          <div className="flex gap-1">
            {['all', 'enterprise', 'social'].map(t => (
              <button 
                key={t} 
                onClick={() => setFilter(t)} 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === t 
                    ? 'bg-[#E6F1FF] text-[#2B7FFF]' 
                    : 'text-[#4B4F55] hover:text-[#1C1F23] hover:bg-[#F5F7FA]'
                }`}
              >
                {t === 'all' ? '全部荣誉' : (t === 'enterprise' ? '企业荣誉' : '社会荣誉')}
              </button>
            ))}
          </div>
        </div>

        {/* 荣誉列表 */}
        <div className="px-xl py-lg border-t border-[#F0F0F0]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredHonors.length === 0 ? (
              <div className="col-span-full text-center py-12 text-[#8A9099]">
                <p>暂无荣誉</p>
              </div>
            ) : (
              filteredHonors.map(honor => (
                <div 
                  key={honor.id} 
                  className="bg-[#FAFAFA] p-5 rounded-xl border border-[#F0F0F0] shadow-sm hover:shadow-md transition-all group hover:border-[#2B7FFF]/30"
                >
                  {honor.image && (
                    <div className={`w-full h-32 ${honor.image} rounded-lg mb-3 bg-cover`}></div>
                  )}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h5 className="text-sm font-bold text-[#1C1F23] line-clamp-2">{honor.title}</h5>
                      <span className={`text-[10px] inline-flex px-2.5 py-1 rounded-full font-medium ${
                        honor.type === 'enterprise' 
                          ? 'bg-[#E6F1FF] text-[#2B7FFF] border border-[#5EA8FF]' 
                          : 'bg-[#FFF7E6] text-[#FAAD14] border border-[#FFE58F]'
                      }`}>
                        {honor.type === 'enterprise' ? '企业' : '社会'}
                      </span>
                    </div>
                    <div className="text-xs text-[#8A9099]">
                      <div>颁发机构：{honor.awardOrg || '-'}</div>
                      <div>获得日期：{honor.awardDate || '-'}</div>
                    </div>
                    <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="secondary" className="!px-2 !py-1 !text-xs" onClick={() => handleEdit(honor)}>
                        <Edit className="w-3 h-3"/> 编辑
                      </Button>
                      <Button variant="danger" className="!px-2 !py-1 !text-xs" onClick={() => handleDelete(honor.id)}>
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
        onClose={() => { setIsModalOpen(false); setEditingHonor(null); }} 
        title={editingHonor ? '编辑荣誉' : '添加荣誉'}
        footer={
          <>
            <Button variant="secondary" onClick={() => { setIsModalOpen(false); setEditingHonor(null); }}>取消</Button>
            <Button onClick={handleSave}>保存</Button>
          </>
        }
      >
        <div className="space-y-6">
          <FormItem label="荣誉名称 *">
            <Input 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
              placeholder="请输入荣誉名称"
            />
          </FormItem>

          <FormItem label="荣誉类型">
            <div className="flex gap-4">
              <label className={`flex items-center gap-3 border p-4 rounded-xl flex-1 cursor-pointer transition-all ${
                formData.type === 'enterprise' ? 'bg-[#E6F1FF] border-[#2B7FFF]' : 'bg-white border-[#E6E8EB] hover:bg-[#F5F7FA]'
              }`}>
                <input 
                  type="radio" 
                  className="w-4 h-4 text-[#2B7FFF]" 
                  checked={formData.type === 'enterprise'} 
                  onChange={() => setFormData({...formData, type: 'enterprise'})} 
                /> 
                <span className={`text-sm font-medium ${formData.type === 'enterprise' ? 'text-[#2B7FFF]' : 'text-[#1C1F23]'}`}>企业荣誉</span>
              </label>
              <label className={`flex items-center gap-3 border p-4 rounded-xl flex-1 cursor-pointer transition-all ${
                formData.type === 'social' ? 'bg-[#FFF7E6] border-[#FAAD14]' : 'bg-white border-[#E6E8EB] hover:bg-[#F5F7FA]'
              }`}>
                <input 
                  type="radio" 
                  className="w-4 h-4 text-[#FAAD14]" 
                  checked={formData.type === 'social'} 
                  onChange={() => setFormData({...formData, type: 'social'})} 
                /> 
                <span className={`text-sm font-medium ${formData.type === 'social' ? 'text-[#FAAD14]' : 'text-[#1C1F23]'}`}>社会荣誉</span>
              </label>
            </div>
          </FormItem>

          <FormItem label="荣誉图片">
            <ImageSelector 
              label="" 
              value={formData.image ? { url: formData.image, title: 'honor' } : null} 
              onChange={img => setFormData({...formData, image: img?.url || ''})} 
              library={imageLib} 
            />
          </FormItem>

          <div className="grid grid-cols-2 gap-4">
            <FormItem label="获得日期">
              <Input 
                type="date"
                value={formData.awardDate} 
                onChange={e => setFormData({...formData, awardDate: e.target.value})} 
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

          <FormItem label="颁发机构">
            <Input 
              value={formData.awardOrg} 
              onChange={e => setFormData({...formData, awardOrg: e.target.value})} 
              placeholder="请输入颁发机构"
            />
          </FormItem>

          <FormItem label="荣誉描述">
            <TextArea 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
              rows={4}
              placeholder="请输入荣誉描述"
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

export default CompanyHonorEditor;
