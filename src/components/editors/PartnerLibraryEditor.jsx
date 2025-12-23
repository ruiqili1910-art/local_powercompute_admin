import { useState } from 'react';
import { Trash2, Edit } from 'lucide-react';
import { Button, Input, FormItem, TextArea, ImageSelector, Modal, PageBanner } from '../ui';

const PartnerLibraryEditor = ({ partners = [], onChange, imageLib }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    type: 'partner',
    description: '',
    website: '',
    sort: 0,
    status: 'published'
  });

  const handleAdd = () => {
    setEditingPartner(null);
    setFormData({
      name: '',
      logo: '',
      type: 'partner',
      description: '',
      website: '',
      sort: 0,
      status: 'published'
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name) {
      alert('请输入合作伙伴名称');
      return;
    }
    const newPartner = {
      ...formData,
      id: editingPartner?.id || `partner_${Date.now()}`,
      createTime: editingPartner?.createTime || new Date().toISOString(),
      updateTime: new Date().toISOString()
    };
    
    if (editingPartner) {
      onChange(partners.map(p => p.id === editingPartner.id ? newPartner : p));
    } else {
      onChange([...partners, newPartner]);
    }
    
    setIsModalOpen(false);
    setEditingPartner(null);
  };

  const handleEdit = (partner) => {
    setEditingPartner(partner);
    setFormData(partner);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm('确定删除该合作伙伴吗？')) {
      onChange(partners.filter(p => p.id !== id));
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-[#E6E8EB] overflow-hidden">
        {/* PageBanner */}
        <PageBanner 
          title="合作伙伴库"
          description="管理合作伙伴信息。数据可用于首页等页面。"
          buttonText="新增合作伙伴"
          buttonIcon="add"
          onButtonClick={handleAdd}
        />

        {/* 合作伙伴列表 */}
        <div className="px-xl py-lg border-t border-[#F0F0F0]">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {partners.length === 0 ? (
              <div className="col-span-full text-center py-12 text-[#8A9099]">
                <p>暂无合作伙伴</p>
              </div>
            ) : (
              partners.map(partner => (
                <div 
                  key={partner.id} 
                  className="bg-[#FAFAFA] p-5 rounded-xl border border-[#F0F0F0] shadow-sm hover:shadow-md transition-all group hover:border-[#2B7FFF]/30 flex flex-col items-center"
                >
                  {partner.logo && (
                    <div className={`w-24 h-24 ${partner.logo} rounded-lg mb-3 bg-cover`}></div>
                  )}
                  <div className="text-center space-y-2 flex-1">
                    <h5 className="text-sm font-bold text-[#1C1F23]">{partner.name}</h5>
                    <span className={`text-[10px] inline-flex px-2.5 py-1 rounded-full font-medium ${
                      partner.type === 'supplier' ? 'bg-[#E6F1FF] text-[#2B7FFF]' :
                      partner.type === 'customer' ? 'bg-[#FFF7E6] text-[#FAAD14]' :
                      'bg-[#F6FFED] text-[#52C41A]'
                    }`}>
                      {partner.type === 'supplier' ? '供应商' : partner.type === 'customer' ? '客户' : '合作伙伴'}
                    </span>
                    <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="secondary" className="!px-2 !py-1 !text-xs" onClick={() => handleEdit(partner)}>
                        <Edit className="w-3 h-3"/> 编辑
                      </Button>
                      <Button variant="danger" className="!px-2 !py-1 !text-xs" onClick={() => handleDelete(partner.id)}>
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
        onClose={() => { setIsModalOpen(false); setEditingPartner(null); }} 
        title={editingPartner ? '编辑合作伙伴' : '新增合作伙伴'}
        footer={
          <>
            <Button variant="secondary" onClick={() => { setIsModalOpen(false); setEditingPartner(null); }}>取消</Button>
            <Button onClick={handleSave}>保存</Button>
          </>
        }
      >
        <div className="space-y-6">
          <FormItem label="合作伙伴名称 *">
            <Input 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              placeholder="请输入合作伙伴名称"
            />
          </FormItem>

          <FormItem label="Logo">
            <ImageSelector 
              label="" 
              value={formData.logo ? { url: formData.logo, title: 'logo' } : null} 
              onChange={img => setFormData({...formData, logo: img?.url || ''})} 
              library={imageLib} 
            />
          </FormItem>

          <FormItem label="合作类型">
            <select 
              value={formData.type}
              onChange={e => setFormData({...formData, type: e.target.value})}
              className="w-full px-4 py-2 bg-white border border-[#E6E8EB] rounded-lg text-sm text-[#1C1F23]"
            >
              <option value="supplier">供应商</option>
              <option value="customer">客户</option>
              <option value="partner">合作伙伴</option>
            </select>
          </FormItem>

          <FormItem label="官网链接">
            <Input 
              value={formData.website} 
              onChange={e => setFormData({...formData, website: e.target.value})} 
              placeholder="https://example.com"
            />
          </FormItem>

          <FormItem label="合作描述">
            <TextArea 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
              rows={4}
              placeholder="请输入合作描述"
            />
          </FormItem>

          <FormItem label="排序">
            <Input 
              type="number"
              value={formData.sort} 
              onChange={e => setFormData({...formData, sort: parseInt(e.target.value) || 0})} 
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

export default PartnerLibraryEditor;
