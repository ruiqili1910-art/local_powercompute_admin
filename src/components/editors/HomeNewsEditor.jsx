import { useState, useEffect } from 'react';
import { Plus, Trash2, Search, Filter, Star, LayoutGrid, Image, ChevronDown } from 'lucide-react';
import { Input, Button, Modal, EditorLayout } from '../ui';

// 新闻类别中文映射
const CATEGORY_LABELS = {
  'company': '公司要闻',
  'project': '项目动态',
  'industry': '行业资讯',
  'enterprise': '企业新闻',
  'all': '全部分类'
};

const INITIAL_DATA = {
  featuredNews: [], // 置顶推荐（最多3个）
  cardNews: [],     // 卡片展示（最多3个）
};

const HomeNewsEditor = ({ data = {}, onChange, newsList = [] }) => {
  const [formData, setFormData] = useState({ ...INITIAL_DATA, ...data });
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectingFor, setSelectingFor] = useState('featured'); // 'featured' | 'card'
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [initialData, setInitialData] = useState({ ...INITIAL_DATA, ...data });

  // 当外部data变化时，更新formData和初始数据
  useEffect(() => {
    const newData = { ...INITIAL_DATA, ...data };
    setFormData(newData);
    setInitialData(newData);
    setHasUnsavedChanges(false);
  }, [data]);

  // 检查是否有未保存的修改
  useEffect(() => {
    const hasChanges = JSON.stringify(formData) !== JSON.stringify(initialData);
    setHasUnsavedChanges(hasChanges);
  }, [formData, initialData]);

  const handleSaveDraft = async () => {
    onChange && onChange(formData);
    setInitialData({ ...formData });
    setHasUnsavedChanges(false);
  };

  const handlePublish = async () => {
    onChange && onChange(formData);
    setInitialData({ ...formData });
    setHasUnsavedChanges(false);
  };

  const openPicker = (type) => {
    setSelectingFor(type);
    setIsPickerOpen(true);
  };

  const toggleNewsSelection = (newsId) => {
    const key = selectingFor === 'featured' ? 'featuredNews' : 'cardNews';
    const currentIds = formData[key] || [];
    const maxCount = 3;

    if (currentIds.includes(newsId)) {
      setFormData({ ...formData, [key]: currentIds.filter(id => id !== newsId) });
    } else if (currentIds.length < maxCount) {
      setFormData({ ...formData, [key]: [...currentIds, newsId] });
    } else {
      alert(`最多选择 ${maxCount} 条新闻`);
    }
  };

  const removeNews = (type, newsId) => {
    const key = type === 'featured' ? 'featuredNews' : 'cardNews';
    setFormData({ ...formData, [key]: (formData[key] || []).filter(id => id !== newsId) });
  };

  const getNewsById = (id) => newsList.find(n => n.id === id);

  // 获取所有分类
  const categories = [...new Set(newsList.map(n => n.category).filter(Boolean))];

  // 过滤新闻 - 只显示已发布状态的新闻
  const filteredNews = newsList.filter(n => {
    // 只显示已发布状态的新闻（排除草稿和待同步状态）
    const isPublished = n.status === 'published' && (!n.hasUnsyncedChanges || n.hasUnsyncedChanges === false);
    if (!isPublished) return false;
    
    const matchSearch = !searchKeyword || n.title?.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchCategory = filterCategory === 'all' || n.category === filterCategory;
    return matchSearch && matchCategory;
  });

  // 当前选择列表
  const currentSelectedIds = selectingFor === 'featured' ? formData.featuredNews : formData.cardNews;

  // 渲染新闻卡片
  const renderNewsCard = (news, type) => (
    <div key={news.id} className="bg-gray-2 rounded-lg p-md flex gap-md group relative">
      <div className="w-24 h-16 bg-gray-3 rounded flex-shrink-0 overflow-hidden">
        {news.coverImage ? (
          <img src={news.coverImage} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center"><Image className="w-6 h-6 text-gray-4" /></div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-body font-medium text-gray-8 line-clamp-2">{news.title}</div>
        <div className="text-caption text-gray-6 mt-xxs">{news.publishTime?.split(' ')[0]} · {CATEGORY_LABELS[news.category] || news.category}</div>
      </div>
      <button 
        onClick={() => removeNews(type, news.id)}
        className="absolute top-2 right-2 p-1 text-gray-6 hover:text-error opacity-0 group-hover:opacity-100"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );

  // 模拟历史记录数据
  const historyData = [
    { id: 'h1', time: '2024-03-20 14:30', description: '更新了置顶推荐新闻', operator: 'admin', status: 'published' },
    { id: 'h2', time: '2024-03-20 14:25', description: '修改了卡片展示新闻', operator: 'admin', status: 'draft' },
    { id: 'h3', time: '2024-03-18 10:00', description: '更新了最新动态配置', operator: 'admin', status: 'published' },
  ];

  const handleRestoreHistory = (record) => {
    console.log('恢复版本:', record);
  };

  return (
    <>
      <EditorLayout
        title="最新动态"
        description="配置首页「最新动态」模块，选择要展示的新闻及其显示方式。"
        pageKey="home_news"
        onSave={handlePublish}
        onSaveDraft={handleSaveDraft}
        onRestoreHistory={handleRestoreHistory}
        historyData={historyData}
        hasUnsavedChanges={hasUnsavedChanges}
      >
        <div className="space-y-xl">
          {/* 置顶推荐 */}
          <div className="space-y-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-sm">
                <Star className="w-5 h-5 text-orange" />
                <h3 className="text-body font-semibold text-gray-8">置顶推荐</h3>
                <span className="text-caption text-gray-6">（{formData.featuredNews?.length || 0}/3）</span>
              </div>
              <Button variant="secondary" onClick={() => openPicker('featured')}>
                <Plus className="w-4 h-4" /> 选择新闻
              </Button>
            </div>
            <p className="text-caption text-gray-6">大图展示，最多选择 3 条新闻作为首页重点推荐</p>
            
            {(formData.featuredNews?.length > 0) ? (
              <div className="space-y-sm">
                {formData.featuredNews.map(id => {
                  const news = getNewsById(id);
                  return news ? renderNewsCard(news, 'featured') : null;
                })}
              </div>
            ) : (
              <div className="text-center py-md bg-gray-2 rounded-lg text-gray-6 text-caption">
                暂未选择置顶推荐新闻
              </div>
            )}
          </div>

          <div className="border-t border-gray-4" />

          {/* 卡片展示 */}
          <div className="space-y-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-sm">
                <LayoutGrid className="w-5 h-5 text-brand" />
                <h3 className="text-body font-semibold text-gray-8">卡片展示</h3>
                <span className="text-caption text-gray-6">（{formData.cardNews?.length || 0}/3）</span>
              </div>
              <Button variant="secondary" onClick={() => openPicker('card')}>
                <Plus className="w-4 h-4" /> 选择新闻
              </Button>
            </div>
            <p className="text-caption text-gray-6">小卡片展示，最多选择 3 条新闻</p>
            
            {(formData.cardNews?.length > 0) ? (
              <div className="space-y-sm">
                {formData.cardNews.map(id => {
                  const news = getNewsById(id);
                  return news ? renderNewsCard(news, 'card') : null;
                })}
              </div>
            ) : (
              <div className="text-center py-md bg-gray-2 rounded-lg text-gray-6 text-caption">
                暂未选择卡片展示新闻
              </div>
            )}
          </div>
        </div>
      </EditorLayout>

      {/* 新闻选择弹窗 - 表格形式 */}
      <Modal isOpen={isPickerOpen} onClose={() => setIsPickerOpen(false)} 
        title={`选择${selectingFor === 'featured' ? '置顶推荐' : '卡片展示'}新闻`} size="xl"
        footer={<Button variant="secondary" onClick={() => setIsPickerOpen(false)}>完成选择</Button>}>
        <div className="space-y-md">
          {/* 搜索和筛选 */}
          <div className="flex gap-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-5" />
              <Input 
                value={searchKeyword} 
                onChange={e => setSearchKeyword(e.target.value)} 
                placeholder="搜索新闻标题..." 
                className="pl-9"
              />
            </div>
            <div className="relative">
              <select
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value)}
                className="appearance-none px-md py-xs pr-8 border border-gray-4 rounded-sm text-body bg-white focus:outline-none focus:border-brand"
              >
                <option value="all">全部分类</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{CATEGORY_LABELS[cat] || cat}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-5 pointer-events-none" />
            </div>
          </div>

          {/* 新闻表格 */}
          <div className="border border-gray-4 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-2">
                <tr>
                  <th className="w-12 px-md py-sm text-left text-caption font-medium text-gray-6">选择</th>
                  <th className="px-md py-sm text-left text-caption font-medium text-gray-6">封面</th>
                  <th className="px-md py-sm text-left text-caption font-medium text-gray-6">标题</th>
                  <th className="px-md py-sm text-left text-caption font-medium text-gray-6">分类</th>
                  <th className="px-md py-sm text-left text-caption font-medium text-gray-6">发布时间</th>
                  <th className="px-md py-sm text-left text-caption font-medium text-gray-6">状态</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-4">
                {filteredNews.length > 0 ? filteredNews.slice(0, 20).map(news => {
                  const isSelected = currentSelectedIds?.includes(news.id);
                  return (
                    <tr 
                      key={news.id} 
                      onClick={() => toggleNewsSelection(news.id)}
                      className={`cursor-pointer transition-colors ${isSelected ? 'bg-brand-light' : 'hover:bg-gray-2'}`}
                    >
                      <td className="px-md py-sm">
                        <input 
                          type="checkbox" 
                          checked={isSelected}
                          onChange={() => {}}
                          className="w-4 h-4 text-brand rounded focus:ring-brand"
                        />
                      </td>
                      <td className="px-md py-sm">
                        <div className="w-16 h-10 bg-gray-3 rounded overflow-hidden">
                          {news.coverImage ? (
                            <img src={news.coverImage} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center"><Image className="w-4 h-4 text-gray-4" /></div>
                          )}
                        </div>
                      </td>
                      <td className="px-md py-sm">
                        <div className="text-body text-gray-8 line-clamp-1 max-w-xs">{news.title}</div>
                      </td>
                      <td className="px-md py-sm">
                        <span className="px-sm py-xxs bg-gray-3 text-caption text-gray-7 rounded">{CATEGORY_LABELS[news.category] || news.category}</span>
                      </td>
                      <td className="px-md py-sm text-caption text-gray-6">{news.publishTime?.split(' ')[0]}</td>
                      <td className="px-md py-sm">
                        <span className={`px-sm py-xxs rounded text-caption ${news.status === 'published' ? 'bg-green-light text-green' : 'bg-gray-3 text-gray-6'}`}>
                          {news.status === 'published' ? '已发布' : '草稿'}
                        </span>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={6} className="px-md py-xl text-center text-gray-6">
                      暂无符合条件的新闻
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <p className="text-caption text-gray-6">
            已选择 {currentSelectedIds?.length || 0} / 3 条新闻
          </p>
        </div>
      </Modal>
    </>
  );
};

export default HomeNewsEditor;
