import { useState } from 'react';
import { Plus, Search, Trash2, Edit } from 'lucide-react';
import { Button, Input, FormItem, TextArea, ImageSelector, Modal, PageBanner } from '../ui';

const ArticleEditor = ({ articles = [], onChange, imageLib }) => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'company-news',
    cover: '',
    summary: '',
    content: '',
    author: '',
    source: '',
    publishTime: '',
    status: 'draft',
    sort: 0,
    isTop: false
  });

  const categories = [
    { id: 'company-news', label: '公司要闻' },
    { id: 'enterprise-news', label: '企业新闻' },
    { id: 'project-dynamic', label: '项目动态' },
    { id: 'industry-info', label: '行业信息' },
    { id: 'party-building', label: '党的建设' },
    { id: 'youth-friend', label: '青年之友' },
    { id: 'social-responsibility', label: '社会责任' }
  ];

  const filteredArticles = articles.filter(article => {
    const matchKeyword = !searchKeyword || 
      article.title?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      article.summary?.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchStatus = statusFilter === 'all' || article.status === statusFilter;
    const matchCategory = categoryFilter === 'all' || article.category === categoryFilter;
    return matchKeyword && matchStatus && matchCategory;
  });

  const handleAdd = () => {
    setEditingArticle(null);
    setFormData({
      title: '',
      category: 'company-news',
      cover: '',
      summary: '',
      content: '',
      author: '',
      source: '',
      publishTime: '',
      status: 'draft',
      sort: 0,
      isTop: false
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.title) {
      alert('请输入标题');
      return;
    }
    const newArticle = {
      ...formData,
      id: editingArticle?.id || `article_${Date.now()}`,
      createTime: editingArticle?.createTime || new Date().toISOString(),
      updateTime: new Date().toISOString()
    };
    
    if (editingArticle) {
      onChange(articles.map(a => a.id === editingArticle.id ? newArticle : a));
    } else {
      onChange([...articles, newArticle]);
    }
    
    setIsModalOpen(false);
    setEditingArticle(null);
    setFormData({
      title: '',
      category: 'company-news',
      cover: '',
      summary: '',
      content: '',
      author: '',
      source: '',
      publishTime: '',
      status: 'draft',
      sort: 0,
      isTop: false
    });
  };

  const handleEdit = (article) => {
    setEditingArticle(article);
    setFormData(article);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm('确定删除该文章吗？')) {
      onChange(articles.filter(a => a.id !== id));
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-[#E6E8EB] overflow-hidden">
        {/* PageBanner */}
        <PageBanner 
          title="文章内容"
          description="管理全站文章内容，支持分类、状态、排序、置顶等功能。"
          buttonText="新增文章"
          buttonIcon="add"
          onButtonClick={handleAdd}
        />

        {/* 搜索和筛选 */}
        <div className="px-xl py-md border-t border-[#F0F0F0]">
          <div className="flex gap-3 flex-wrap">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A9099]" />
              <input
                type="text"
                placeholder="搜索标题或摘要..."
                value={searchKeyword}
                onChange={e => setSearchKeyword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAFAFA] border border-[#E5E7EB] rounded-lg text-sm text-[#374151] placeholder-[#8A9099] focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/20 focus:border-[#2B7FFF]"
              />
            </div>
            <select 
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="px-4 py-2 bg-white border border-[#E6E8EB] rounded-lg text-sm text-[#1C1F23]"
            >
              <option value="all">全部栏目</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
            <select 
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-white border border-[#E6E8EB] rounded-lg text-sm text-[#1C1F23]"
            >
              <option value="all">全部状态</option>
              <option value="published">已发布</option>
              <option value="draft">草稿</option>
              <option value="offline">已下架</option>
            </select>
          </div>
        </div>

        {/* 文章列表 */}
        <div className="px-xl py-lg border-t border-[#F0F0F0]">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-12 text-[#8A9099]">
              <p>暂无文章</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredArticles.map(article => (
                <div 
                  key={article.id} 
                  className="p-4 border border-[#F0F0F0] rounded-lg hover:border-[#2B7FFF]/50 hover:shadow-md transition-all bg-[#FAFAFA]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {article.isTop && <span className="px-2 py-0.5 bg-[#FF4D4F] text-white text-xs rounded">置顶</span>}
                        <span className="text-xs px-2 py-1 rounded-full bg-[#E6F1FF] text-[#2B7FFF]">
                          {categories.find(c => c.id === article.category)?.label || article.category}
                        </span>
                        <h5 className="font-semibold text-[#1C1F23]">{article.title || '未命名文章'}</h5>
                      </div>
                      <p className="text-sm text-[#4B4F55] line-clamp-2 mb-3">{article.summary || '无摘要'}</p>
                      <div className="flex items-center gap-4 text-xs text-[#8A9099]">
                        <span>作者：{article.author || '-'}</span>
                        <span>来源：{article.source || '-'}</span>
                        <span>发布时间：{article.publishTime || '-'}</span>
                        <span>排序：{article.sort || 0}</span>
                        <span className={`px-2 py-1 rounded-full ${
                          article.status === 'published' ? 'bg-[#E8FFF3] text-[#27C46A]' :
                          article.status === 'draft' ? 'bg-[#FFF7E8] text-[#FFB020]' :
                          'bg-[#FFECEC] text-[#FF4D4F]'
                        }`}>
                          {article.status === 'published' ? '已发布' : 
                           article.status === 'draft' ? '草稿' : '已下架'}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="secondary" onClick={() => handleEdit(article)}><Edit className="w-4 h-4"/> 编辑</Button>
                      <Button variant="danger" onClick={() => handleDelete(article.id)}><Trash2 className="w-4 h-4"/> 删除</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 新增/编辑弹窗 */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingArticle(null); }} 
        title={editingArticle ? '编辑文章' : '新增文章'}
        footer={
          <>
            <Button variant="secondary" onClick={() => { setIsModalOpen(false); setEditingArticle(null); }}>取消</Button>
            <Button onClick={handleSave}>保存</Button>
          </>
        }
      >
        <div className="space-y-6">
          <FormItem label="标题 *">
            <Input 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
              placeholder="请输入文章标题"
            />
          </FormItem>

          <FormItem label="栏目 *">
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

          <FormItem label="封面图">
            <ImageSelector 
              label="" 
              value={formData.cover ? { url: formData.cover, title: 'cover' } : null} 
              onChange={img => setFormData({...formData, cover: img?.url || ''})} 
              library={imageLib} 
            />
          </FormItem>

          <FormItem label="摘要">
            <TextArea 
              value={formData.summary} 
              onChange={e => setFormData({...formData, summary: e.target.value})} 
              rows={3}
              placeholder="请输入文章摘要"
            />
          </FormItem>

          <FormItem label="正文 *">
            <TextArea 
              value={formData.content} 
              onChange={e => setFormData({...formData, content: e.target.value})} 
              rows={10}
              placeholder="请输入文章正文"
            />
          </FormItem>

          <div className="grid grid-cols-2 gap-4">
            <FormItem label="作者">
              <Input 
                value={formData.author} 
                onChange={e => setFormData({...formData, author: e.target.value})} 
                placeholder="请输入作者"
              />
            </FormItem>
            <FormItem label="来源">
              <Input 
                value={formData.source} 
                onChange={e => setFormData({...formData, source: e.target.value})} 
                placeholder="请输入来源"
              />
            </FormItem>
          </div>

          <FormItem label="发布时间">
            <Input 
              type="datetime-local"
              value={formData.publishTime} 
              onChange={e => setFormData({...formData, publishTime: e.target.value})} 
            />
          </FormItem>

          <div className="grid grid-cols-2 gap-4">
            <FormItem label="状态">
              <select 
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value})}
                className="w-full px-4 py-2 bg-white border border-[#E6E8EB] rounded-lg text-sm text-[#1C1F23]"
              >
                <option value="draft">草稿</option>
                <option value="published">已发布</option>
                <option value="offline">已下架</option>
              </select>
            </FormItem>
            <FormItem label="排序权重">
              <Input 
                type="number"
                value={formData.sort} 
                onChange={e => setFormData({...formData, sort: parseInt(e.target.value) || 0})} 
                placeholder="数字越大越靠前"
              />
            </FormItem>
          </div>

          <div className="flex items-center gap-3">
            <input 
              type="checkbox" 
              id="isTop"
              checked={formData.isTop}
              onChange={e => setFormData({...formData, isTop: e.target.checked})}
              className="w-4 h-4 text-[#2B7FFF]"
            />
            <label htmlFor="isTop" className="text-sm text-[#4B4F55]">是否置顶</label>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ArticleEditor;
