import { useState } from 'react';
import { Trash2, Edit } from 'lucide-react';
import { Button, Input, FormItem, TextArea, Modal, PageBanner } from '../ui';

const CompanyInfoLibraryEditor = ({ companies = [], onChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'main',
    establishDate: '',
    registeredCapital: '',
    legalRepresentative: '',
    address: '',
    businessScope: '',
    description: '',
    status: 'published'
  });

  const handleAdd = () => {
    setEditingCompany(null);
    setFormData({
      name: '',
      type: 'main',
      establishDate: '',
      registeredCapital: '',
      legalRepresentative: '',
      address: '',
      businessScope: '',
      description: '',
      status: 'published'
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name) {
      alert('请输入公司名称');
      return;
    }
    const newCompany = {
      ...formData,
      id: editingCompany?.id || `company_${Date.now()}`,
      createTime: editingCompany?.createTime || new Date().toISOString(),
      updateTime: new Date().toISOString()
    };
    
    if (editingCompany) {
      onChange(companies.map(c => c.id === editingCompany.id ? newCompany : c));
    } else {
      onChange([...companies, newCompany]);
    }
    
    setIsModalOpen(false);
    setEditingCompany(null);
  };

  const handleEdit = (company) => {
    setEditingCompany(company);
    setFormData(company);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm('确定删除该公司信息吗？')) {
      onChange(companies.filter(c => c.id !== id));
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-[#E6E8EB] overflow-hidden">
        {/* PageBanner */}
        <PageBanner 
          title="公司信息库"
          description="管理公司基本信息，包括总公司、子公司等。数据可用于关于我们、首页、企业公开等页面。"
          buttonText="新增公司"
          buttonIcon="add"
          onButtonClick={handleAdd}
        />

        {/* 内容区域 */}
        <div className="px-xl py-lg border-t border-[#F0F0F0]">
          <div className="space-y-3">
            {companies.length === 0 ? (
              <div className="text-center py-12 text-[#8A9099]">
                <p>暂无公司信息</p>
              </div>
            ) : (
              companies.map(company => (
                <div 
                  key={company.id} 
                  className="p-4 border border-[#F0F0F0] rounded-lg hover:border-[#2B7FFF]/50 hover:shadow-md transition-all bg-[#FAFAFA]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h5 className="font-semibold text-[#1C1F23]">{company.name || '未命名公司'}</h5>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          company.type === 'main' ? 'bg-[#E6F1FF] text-[#2B7FFF]' : 'bg-[#FFF7E6] text-[#FAAD14]'
                        }`}>
                          {company.type === 'main' ? '总公司' : '子公司'}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          company.status === 'published' ? 'bg-[#E8FFF3] text-[#27C46A]' : 'bg-[#FFECEC] text-[#FF4D4F]'
                        }`}>
                          {company.status === 'published' ? '已发布' : '已下架'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-[#4B4F55]">
                        <div>成立日期：{company.establishDate || '-'}</div>
                        <div>注册资本：{company.registeredCapital || '-'}</div>
                        <div>法定代表人：{company.legalRepresentative || '-'}</div>
                        <div>注册地址：{company.address || '-'}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="secondary" onClick={() => handleEdit(company)}><Edit className="w-4 h-4"/> 编辑</Button>
                      <Button variant="danger" onClick={() => handleDelete(company.id)}><Trash2 className="w-4 h-4"/> 删除</Button>
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
        onClose={() => { setIsModalOpen(false); setEditingCompany(null); }} 
        title={editingCompany ? '编辑公司信息' : '新增公司信息'}
        footer={
          <>
            <Button variant="secondary" onClick={() => { setIsModalOpen(false); setEditingCompany(null); }}>取消</Button>
            <Button onClick={handleSave}>保存</Button>
          </>
        }
      >
        <div className="space-y-6">
          <FormItem label="公司名称 *">
            <Input 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              placeholder="请输入公司名称"
            />
          </FormItem>

          <FormItem label="类型">
            <select 
              value={formData.type}
              onChange={e => setFormData({...formData, type: e.target.value})}
              className="w-full px-4 py-2 bg-white border border-[#E6E8EB] rounded-lg text-sm text-[#1C1F23]"
            >
              <option value="main">总公司</option>
              <option value="subsidiary">子公司</option>
            </select>
          </FormItem>

          <div className="grid grid-cols-2 gap-4">
            <FormItem label="成立日期">
              <Input 
                type="date"
                value={formData.establishDate} 
                onChange={e => setFormData({...formData, establishDate: e.target.value})} 
              />
            </FormItem>
            <FormItem label="注册资本">
              <Input 
                value={formData.registeredCapital} 
                onChange={e => setFormData({...formData, registeredCapital: e.target.value})} 
                placeholder="请输入注册资本"
              />
            </FormItem>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormItem label="法定代表人">
              <Input 
                value={formData.legalRepresentative} 
                onChange={e => setFormData({...formData, legalRepresentative: e.target.value})} 
                placeholder="请输入法定代表人"
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

          <FormItem label="注册地址">
            <Input 
              value={formData.address} 
              onChange={e => setFormData({...formData, address: e.target.value})} 
              placeholder="请输入注册地址"
            />
          </FormItem>

          <FormItem label="经营范围">
            <TextArea 
              value={formData.businessScope} 
              onChange={e => setFormData({...formData, businessScope: e.target.value})} 
              rows={5}
              placeholder="请输入经营范围"
            />
          </FormItem>

          <FormItem label="公司简介">
            <TextArea 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
              rows={6}
              placeholder="请输入公司简介"
            />
          </FormItem>
        </div>
      </Modal>
    </>
  );
};

export default CompanyInfoLibraryEditor;
