import { useState } from 'react';
import { Plus, FileText, Trash2, Edit } from 'lucide-react';
import { Card, Button, Input, FormItem, TextArea, ImageSelector, Modal } from '../ui';

const ESGLibraryEditor = ({ esgs = [], onChange, imageLib }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingESG, setEditingESG] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    year: '',
    cover: '',
    file: '',
    summary: '',
    publishDate: '',
    status: 'published'
  });

  const handleSave = () => {
    if (!formData.title || !formData.year) {
      alert('请输入报告标题和年份');
      return;
    }
    const newESG = {
      ...formData,
      id: editingESG?.id || `esg_${Date.now()}`,
      createTime: editingESG?.createTime || new Date().toISOString(),
      updateTime: new Date().toISOString()
    };
    
    if (editingESG) {
      onChange(esgs.map(e => e.id === editingESG.id ? newESG : e));
    } else {
      onChange([...esgs, newESG]);
    }
    
    setIsModalOpen(false);
    setEditingESG(null);
    setFormData({
      title: '',
      year: '',
      cover: '',
      file: '',
      summary: '',
      publishDate: '',
      status: 'published'
    });
  };

  const handleEdit = (esg) => {
    setEditingESG(esg);
    setFormData(esg);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm('确定删除该ESG报告吗？')) {
      onChange(esgs.filter(e => e.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#E6F1FF] border border-[#5EA8FF] p-6 rounded-xl flex items-start gap-4">
        <div className="p-2.5 bg-white rounded-lg shadow-sm text-[#2B7FFF]">
          <FileText className="w-6 h-6"/>
        </div>
        <div>
          <h4 className="font-bold text-[#1C1F23] text-lg">ESG报告</h4>
          <p className="text-sm text-[#4B4F55] mt-1 leading-relaxed">管理ESG报告信息。数据可用于可持续发展等页面。</p>
        </div>
      </div>

      <Card 
        title={`ESG报告列表 (${esgs.length})`}
        action={<Button variant="add" onClick={() => { setEditingESG(null); setFormData({...formData, title: '', year: ''}); setIsModalOpen(true); }}><Plus className="w-4 h-4"/> 新增ESG报告</Button>}
      >
        <div className="space-y-3">
          {esgs.length === 0 ? (
            <div className="text-center py-12 text-[#8A9099]">
              <p>暂无ESG报告</p>
            </div>
          ) : (
            esgs.map(esg => (
              <div 
                key={esg.id} 
                className="p-4 border border-[#E6E8EB] rounded-lg hover:border-[#2B7FFF]/50 hover:shadow-md transition-all bg-white"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h5 className="font-semibold text-[#1C1F23]">{esg.title || '未命名报告'}</h5>
                      <span className="text-xs px-2 py-1 rounded-full bg-[#E6F1FF] text-[#2B7FFF]">
                        {esg.year || '-'}年
                      </span>
                    </div>
                    <p className="text-sm text-[#4B4F55] line-clamp-2 mb-2">{esg.summary || '无摘要'}</p>
                    <div className="text-xs text-[#8A9099]">
                      <div>发布日期：{esg.publishDate || '-'}</div>
                      {esg.file && <div>文件：<a href={esg.file} target="_blank" rel="noopener noreferrer" className="text-[#2B7FFF]">查看PDF</a></div>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => handleEdit(esg)}><Edit className="w-4 h-4"/> 编辑</Button>
                    <Button variant="danger" onClick={() => handleDelete(esg.id)}><Trash2 className="w-4 h-4"/> 删除</Button>
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
        onClose={() => { setIsModalOpen(false); setEditingESG(null); }} 
        title={editingESG ? '编辑ESG报告' : '新增ESG报告'}
        footer={
          <>
            <Button variant="secondary" onClick={() => { setIsModalOpen(false); setEditingESG(null); }}>取消</Button>
            <Button onClick={handleSave}>保存</Button>
          </>
        }
      >
        <div className="space-y-6">
          <FormItem label="报告标题 *">
            <Input 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
              placeholder="请输入报告标题"
            />
          </FormItem>

          <FormItem label="报告年份 *">
            <Input 
              value={formData.year} 
              onChange={e => setFormData({...formData, year: e.target.value})} 
              placeholder="例如：2024"
            />
          </FormItem>

          <FormItem label="报告封面">
            <ImageSelector 
              label="" 
              value={formData.cover ? { url: formData.cover, title: 'cover' } : null} 
              onChange={img => setFormData({...formData, cover: img?.url || ''})} 
              library={imageLib} 
            />
          </FormItem>

          <FormItem label="报告文件（PDF URL）">
            <Input 
              value={formData.file} 
              onChange={e => setFormData({...formData, file: e.target.value})} 
              placeholder="https://example.com/esg-report-2024.pdf"
            />
          </FormItem>

          <FormItem label="报告摘要">
            <TextArea 
              value={formData.summary} 
              onChange={e => setFormData({...formData, summary: e.target.value})} 
              rows={5}
              placeholder="请输入报告摘要"
            />
          </FormItem>

          <FormItem label="发布日期">
            <Input 
              type="date"
              value={formData.publishDate} 
              onChange={e => setFormData({...formData, publishDate: e.target.value})} 
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

export default ESGLibraryEditor;

