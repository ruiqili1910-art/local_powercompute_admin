import { useState } from 'react';
import { Plus, Globe, Trash2, Edit } from 'lucide-react';
import { Card, Button, Input, FormItem, TextArea, ImageSelector, Modal } from '../ui';

const DistributionLibraryEditor = ({ distributions = [], onChange, imageLib }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDistribution, setEditingDistribution] = useState(null);
  const [formData, setFormData] = useState({
    region: '',
    map: '',
    description: '',
    status: 'published'
  });

  const handleSave = () => {
    if (!formData.region) {
      alert('请输入区域');
      return;
    }
    const newDistribution = {
      ...formData,
      id: editingDistribution?.id || `distribution_${Date.now()}`,
      createTime: editingDistribution?.createTime || new Date().toISOString(),
      updateTime: new Date().toISOString()
    };
    
    if (editingDistribution) {
      onChange(distributions.map(d => d.id === editingDistribution.id ? newDistribution : d));
    } else {
      onChange([...distributions, newDistribution]);
    }
    
    setIsModalOpen(false);
    setEditingDistribution(null);
    setFormData({
      region: '',
      map: '',
      description: '',
      status: 'published'
    });
  };

  const handleEdit = (distribution) => {
    setEditingDistribution(distribution);
    setFormData(distribution);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm('确定删除该业务分布吗？')) {
      onChange(distributions.filter(d => d.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#E6F1FF] border border-[#5EA8FF] p-6 rounded-xl flex items-start gap-4">
        <div className="p-2.5 bg-white rounded-lg shadow-sm text-[#2B7FFF]">
          <Globe className="w-6 h-6"/>
        </div>
        <div>
          <h4 className="font-bold text-[#1C1F23] text-lg">业务分布</h4>
          <p className="text-sm text-[#4B4F55] mt-1 leading-relaxed">管理业务分布信息。数据可用于企业公开等页面。</p>
        </div>
      </div>

      <Card 
        title={`业务分布列表 (${distributions.length})`}
        action={<Button variant="add" onClick={() => { setEditingDistribution(null); setFormData({...formData, region: ''}); setIsModalOpen(true); }}><Plus className="w-4 h-4"/> 新增业务分布</Button>}
      >
        <div className="space-y-3">
          {distributions.length === 0 ? (
            <div className="text-center py-12 text-[#8A9099]">
              <p>暂无业务分布</p>
            </div>
          ) : (
            distributions.map(distribution => (
              <div 
                key={distribution.id} 
                className="p-4 border border-[#E6E8EB] rounded-lg hover:border-[#2B7FFF]/50 hover:shadow-md transition-all bg-white"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h5 className="font-semibold text-[#1C1F23] mb-2">{distribution.region || '未命名区域'}</h5>
                    <p className="text-sm text-[#4B4F55] line-clamp-2">{distribution.description || '无描述'}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => handleEdit(distribution)}><Edit className="w-4 h-4"/> 编辑</Button>
                    <Button variant="danger" onClick={() => handleDelete(distribution.id)}><Trash2 className="w-4 h-4"/> 删除</Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* 新增/编辑弹窗 */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingDistribution(null); }} 
        title={editingDistribution ? '编辑业务分布' : '新增业务分布'}
        footer={
          <>
            <Button variant="secondary" onClick={() => { setIsModalOpen(false); setEditingDistribution(null); }}>取消</Button>
            <Button onClick={handleSave}>保存</Button>
          </>
        }
      >
        <div className="space-y-6">
          <FormItem label="区域 *">
            <Input 
              value={formData.region} 
              onChange={e => setFormData({...formData, region: e.target.value})} 
              placeholder="请输入区域"
            />
          </FormItem>

          <FormItem label="分布地图">
            <ImageSelector 
              label="" 
              value={formData.map ? { url: formData.map, title: 'map' } : null} 
              onChange={img => setFormData({...formData, map: img?.url || ''})} 
              library={imageLib} 
            />
          </FormItem>

          <FormItem label="业务描述">
            <TextArea 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
              rows={8}
              placeholder="请输入业务描述"
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
    </div>
  );
};

export default DistributionLibraryEditor;

