import { useState } from 'react';
import { Plus, Edit, Trash2, ExternalLink } from 'lucide-react';
import { Button, Input, PageBanner } from '../ui';

const CultureResponsibilityEditor = ({ articles = [], allArticles = [], onAdd, onEdit, onDelete, onViewInGlobal }) => {
  const [activeTab, setActiveTab] = useState('poverty');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const tabs = [
    { id: 'poverty', label: '精准扶贫', category: 'poverty' },
    { id: 'other', label: '其他社会公益', category: 'other' }
  ];

  const currentTab = tabs.find(t => t.id === activeTab);
  const filteredArticles = articles.filter(article => {
    const matchKeyword = !searchKeyword || 
      article.title?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      article.summary?.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchStatus = statusFilter === 'all' || article.status === statusFilter;
    const matchCategory = article.category === `social-responsibility-${currentTab?.category}` || 
                         (currentTab?.category === 'poverty' && article.category === 'social-responsibility');
    return matchKeyword && matchStatus && matchCategory;
  });

  return (
    <div className="bg-white rounded-xl border border-[#E6E8EB] overflow-hidden">
      {/* PageBanner */}
      <PageBanner 
        title="社会责任"
        description="同页 Tab：精准扶贫/其他社会公益（来自全局资源库-【文章内容】的对应栏目）。"
        buttonText="新增文章"
        buttonIcon="add"
        onButtonClick={onAdd}
      />

      {/* 内容区域 */}
      <div className="px-xl py-lg border-t border-[#F0F0F0]">
        <div className="space-y-6">
          {/* Tab 切换 */}
          <div className="flex gap-2 border-b border-[#E6E8EB] pb-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#E6F1FF] text-[#2B7FFF] border-b-2 border-[#2B7FFF]'
                    : 'text-[#4B4F55] hover:text-[#1C1F23] hover:bg-[#F5F7FA]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 搜索筛选 */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="搜索标题或摘要..."
                value={searchKeyword}
                onChange={e => setSearchKeyword(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#FAFAFA] border border-[#E5E7EB] rounded-lg text-sm text-[#374151] placeholder-[#8A9099] focus:outline-none focus:ring-2 focus:ring-[#2B7FFF]/20 focus:border-[#2B7FFF]"
              />
            </div>
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

          {/* 文章列表 */}
          <div className="min-h-[200px]">
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
                        <h5 className="font-semibold text-[#1C1F23] mb-2">{article.title || '未命名文章'}</h5>
                        <p className="text-sm text-[#4B4F55] line-clamp-2 mb-3">{article.summary || '无摘要'}</p>
                        <div className="flex items-center gap-4 text-xs text-[#8A9099]">
                          <span>作者：{article.author || '-'}</span>
                          <span>发布时间：{article.publishTime || '-'}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="secondary" onClick={() => onEdit(article.id)}><Edit className="w-4 h-4"/> 编辑</Button>
                        <Button variant="danger" onClick={() => onDelete(article.id)}><Trash2 className="w-4 h-4"/> 删除</Button>
                        {onViewInGlobal && (
                          <Button variant="secondary" onClick={() => onViewInGlobal(article.id)} className="!px-2">
                            <ExternalLink className="w-4 h-4"/> 在全局库查看
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CultureResponsibilityEditor;
