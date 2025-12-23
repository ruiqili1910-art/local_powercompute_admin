import { useState } from 'react';
import { Trash2, Edit } from 'lucide-react';
import { Button, Input, FormItem, TextArea, ImageSelector, Modal, PageBanner } from '../ui';

const ProjectLibraryEditor = ({ projects = [], onChange, imageLib }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'fertilizer',
    cover: '',
    location: '',
    startDate: '',
    endDate: '',
    investment: '',
    description: '',
    sort: 0,
    status: 'published'
  });

  const categories = [
    { id: 'fertilizer', label: '化肥' },
    { id: 'ethylene', label: '乙烯' },
    { id: 'refining', label: '炼油' },
    { id: 'infrastructure', label: '基础设施' },
    { id: 'green-hydrogen', label: '绿色氢基能源' },
    { id: 'other', label: '其他' }
  ];

  const handleAdd = () => {
    setEditingProject(null);
    setFormData({
      name: '',
      category: 'fertilizer',
      cover: '',
      location: '',
      startDate: '',
      endDate: '',
      investment: '',
      description: '',
      sort: 0,
      status: 'published'
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name) {
      alert('请输入项目名称');
      return;
    }
    const newProject = {
      ...formData,
      id: editingProject?.id || `project_${Date.now()}`,
      createTime: editingProject?.createTime || new Date().toISOString(),
      updateTime: new Date().toISOString()
    };
    
    if (editingProject) {
      onChange(projects.map(p => p.id === editingProject.id ? newProject : p));
    } else {
      onChange([...projects, newProject]);
    }
    
    setIsModalOpen(false);
    setEditingProject(null);
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData(project);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm('确定删除该项目吗？')) {
      onChange(projects.filter(p => p.id !== id));
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-[#E6E8EB] overflow-hidden">
        {/* PageBanner */}
        <PageBanner 
          title="工程项目库"
          description="管理工程项目信息。数据可用于业务领域等页面。"
          buttonText="新增项目"
          buttonIcon="add"
          onButtonClick={handleAdd}
        />

        {/* 工程项目列表 */}
        <div className="px-xl py-lg border-t border-[#F0F0F0]">
          <div className="space-y-3">
            {projects.length === 0 ? (
              <div className="text-center py-12 text-[#8A9099]">
                <p>暂无工程项目</p>
              </div>
            ) : (
              projects.map(project => (
                <div 
                  key={project.id} 
                  className="p-4 border border-[#F0F0F0] rounded-lg hover:border-[#2B7FFF]/50 hover:shadow-md transition-all bg-[#FAFAFA]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h5 className="font-semibold text-[#1C1F23]">{project.name || '未命名项目'}</h5>
                        <span className="text-xs px-2 py-1 rounded-full bg-[#E6F1FF] text-[#2B7FFF]">
                          {categories.find(c => c.id === project.category)?.label || project.category}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm text-[#4B4F55] mb-2">
                        <div>项目地点：{project.location || '-'}</div>
                        <div>开始日期：{project.startDate || '-'}</div>
                        <div>投资金额：{project.investment || '-'}</div>
                      </div>
                      <p className="text-sm text-[#4B4F55] line-clamp-2">{project.description || '无描述'}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="secondary" onClick={() => handleEdit(project)}><Edit className="w-4 h-4"/> 编辑</Button>
                      <Button variant="danger" onClick={() => handleDelete(project.id)}><Trash2 className="w-4 h-4"/> 删除</Button>
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
        onClose={() => { setIsModalOpen(false); setEditingProject(null); }} 
        title={editingProject ? '编辑工程项目' : '新增工程项目'}
        footer={
          <>
            <Button variant="secondary" onClick={() => { setIsModalOpen(false); setEditingProject(null); }}>取消</Button>
            <Button onClick={handleSave}>保存</Button>
          </>
        }
      >
        <div className="space-y-6">
          <FormItem label="项目名称 *">
            <Input 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              placeholder="请输入项目名称"
            />
          </FormItem>

          <FormItem label="项目分类">
            <select 
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
              className="w-full px-4 py-2 bg-white border border-[#E6E8EB] rounded-lg text-sm text-[#1C1F23]"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
          </FormItem>

          <FormItem label="项目封面">
            <ImageSelector 
              label="" 
              value={formData.cover ? { url: formData.cover, title: 'cover' } : null} 
              onChange={img => setFormData({...formData, cover: img?.url || ''})} 
              library={imageLib} 
            />
          </FormItem>

          <div className="grid grid-cols-2 gap-4">
            <FormItem label="项目地点">
              <Input 
                value={formData.location} 
                onChange={e => setFormData({...formData, location: e.target.value})} 
                placeholder="请输入项目地点"
              />
            </FormItem>
            <FormItem label="投资金额">
              <Input 
                value={formData.investment} 
                onChange={e => setFormData({...formData, investment: e.target.value})} 
                placeholder="请输入投资金额"
              />
            </FormItem>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormItem label="开始日期">
              <Input 
                type="date"
                value={formData.startDate} 
                onChange={e => setFormData({...formData, startDate: e.target.value})} 
              />
            </FormItem>
            <FormItem label="结束日期">
              <Input 
                type="date"
                value={formData.endDate} 
                onChange={e => setFormData({...formData, endDate: e.target.value})} 
              />
            </FormItem>
          </div>

          <FormItem label="项目描述">
            <TextArea 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
              rows={8}
              placeholder="请输入项目描述"
            />
          </FormItem>

          <div className="grid grid-cols-2 gap-4">
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
        </div>
      </Modal>
    </>
  );
};

export default ProjectLibraryEditor;
