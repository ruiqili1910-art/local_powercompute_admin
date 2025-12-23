import { useState, useRef, useEffect } from 'react';
import { Image as ImageIcon, Palette } from 'lucide-react';
import NewsListEditor from './NewsListEditor';
import { PageBanner, FormItem, Input, ImageSelector, FloatingActionBar } from '../ui';

// 初始数据 - 需要添加 category 和 displayPosition 字段，以及 hasUnsyncedChanges
const INITIAL_ARTICLES = [
  { 
    id: 'py_1', 
    title: '青春建功新时代 奋斗成就新梦想', 
    summary: '公司团委组织青年员工开展"青春建功新时代"主题团日活动，激发青年活力。', 
    content: '<p>模拟的内容...</p>', 
    cover: '', 
    author: '团委', 
    category: 'party_youth',
    displayPosition: 'cardGrid', // 默认卡片列表
    hasUnsyncedChanges: false,
    publishTime: '2024/01/20 10:00:00', 
    updateTime: '2024/01/20 10:00:00', 
    status: 'published' 
  },
  { 
    id: 'py_2', 
    title: '青年志愿服务队深入社区送温暖', 
    summary: '公司青年志愿服务队走进社区，开展便民服务和公益活动，传递青春正能量。', 
    content: '<p>模拟的内容...</p>', 
    cover: '', 
    author: '青年工作部', 
    category: 'party_youth',
    displayPosition: 'cardGrid', // 默认卡片列表
    hasUnsyncedChanges: false,
    publishTime: '2024/02/15 14:30:00', 
    updateTime: '2024/02/15 14:30:00', 
    status: 'published' 
  },
  { 
    id: 'py_3', 
    title: '青年创新创效大赛圆满落幕', 
    summary: '公司首届青年创新创效大赛决赛举行，多项创新成果获得表彰。', 
    content: '<p>模拟的内容...</p>', 
    cover: '', 
    author: '团委', 
    category: 'party_youth',
    displayPosition: 'cardGrid', // 默认卡片列表
    hasUnsyncedChanges: false,
    publishTime: '2024/03/05 09:00:00', 
    updateTime: '2024/03/05 09:00:00', 
    status: 'draft' 
  },
];

const PartyYouthEditor = ({ imageLib = [], bannerData = {}, onBannerChange }) => {
  const [articles, setArticles] = useState(INITIAL_ARTICLES);
  const [activeTab, setActiveTab] = useState('banner');
  
  // Banner 设置相关状态
  const savedBannerDataRef = useRef(JSON.stringify(bannerData));
  const [hasUnsavedBannerChanges, setHasUnsavedBannerChanges] = useState(false);
  const [isSavingBanner, setIsSavingBanner] = useState(false);
  const [isPublishingBanner, setIsPublishingBanner] = useState(false);
  const [hasPendingBannerChanges, setHasPendingBannerChanges] = useState(() => {
    const storageKey = 'cms_editor_party_youth_banner_pending';
    return localStorage.getItem(storageKey) === 'true';
  });
  const [lastPublishedBannerTime, setLastPublishedBannerTime] = useState(() => {
    const publishTimeKey = 'cms_editor_party_youth_banner_publishTime';
    const saved = localStorage.getItem(publishTimeKey);
    if (saved) {
      const date = new Date(saved);
      return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    }
    const now = new Date();
    now.setMinutes(now.getMinutes() - 15);
    return now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  });
  const [lastPublishedBannerDate, setLastPublishedBannerDate] = useState(() => {
    const publishTimeKey = 'cms_editor_party_youth_banner_publishTime';
    const saved = localStorage.getItem(publishTimeKey);
    if (saved) {
      const date = new Date(saved);
      return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-') 
        + ' ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    }
    const now = new Date();
    now.setMinutes(now.getMinutes() - 15);
    return now.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-') 
      + ' ' + now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  });

  // 监听 Banner 数据变化
  useEffect(() => {
    const currentData = JSON.stringify(bannerData);
    setHasUnsavedBannerChanges(currentData !== savedBannerDataRef.current);
  }, [bannerData]);

  // 持久化待发布状态
  useEffect(() => {
    const storageKey = 'cms_editor_party_youth_banner_pending';
    localStorage.setItem(storageKey, hasPendingBannerChanges.toString());
  }, [hasPendingBannerChanges]);

  // 保存 Banner 配置
  const handleSaveBannerDraft = async () => {
    setIsSavingBanner(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Banner配置已保存:', bannerData);
    savedBannerDataRef.current = JSON.stringify(bannerData);
    setHasUnsavedBannerChanges(false);
    setHasPendingBannerChanges(true);
    setIsSavingBanner(false);
  };

  // 发布 Banner 配置
  const handleSaveBanner = async () => {
    setIsPublishingBanner(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Banner配置已发布:', bannerData);
    savedBannerDataRef.current = JSON.stringify(bannerData);
    setHasUnsavedBannerChanges(false);
    setHasPendingBannerChanges(false);
    
    const now = new Date();
    const timeStr = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-') 
      + ' ' + now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    
    setLastPublishedBannerTime(timeStr);
    setLastPublishedBannerDate(dateStr);
    
    const publishTimeKey = 'cms_editor_party_youth_banner_publishTime';
    localStorage.setItem(publishTimeKey, now.toISOString());
    const storageKey = 'cms_editor_party_youth_banner_pending';
    localStorage.setItem(storageKey, 'false');
    
    setIsPublishingBanner(false);
  };

  // 计算 Banner 状态
  const getBannerDisplayStatus = () => {
    if (isPublishingBanner) return 'publishing';
    if (isSavingBanner) return 'saving';
    if (hasUnsavedBannerChanges) return 'unsaved';
    if (hasPendingBannerChanges) return 'pending';
    return 'published';
  };

  const handleBannerChange = (field, value) => {
    if (onBannerChange) {
      onBannerChange({ ...bannerData, [field]: value });
    }
  };

  const tabs = [
    { id: 'banner', label: 'Banner设置' },
    { id: 'content', label: '内容管理' },
  ];

  // 内容管理tab的新增文章和历史记录处理
  const contentEditorRef = useRef(null);

  const handleContentAdd = () => {
    // 触发NewsListEditor内部的新增文章
    if (contentEditorRef.current) {
      contentEditorRef.current.handleAdd?.();
    }
  };

  const handleContentHistory = () => {
    // 触发NewsListEditor内部的历史记录弹窗
    if (contentEditorRef.current) {
      contentEditorRef.current.showHistory?.();
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-4">
      {/* Banner - Banner设置tab显示 */}
      {activeTab === 'banner' && (
        <PageBanner
          title="青年之友"
          description="只个性化配置青年之友页面的Banner"
        />
      )}

      {/* PageBanner - 内容管理tab显示，在tab上方 */}
      {activeTab === 'content' && (
        <PageBanner
          title="青年之友"
          description="管理「青年之友」分类下的所有文章，修改内容将实时同步到官网对应栏目。"
          buttonText="新增文章"
          buttonIcon="add"
          onButtonClick={handleContentAdd}
          onHistoryClick={handleContentHistory}
        />
      )}

      {/* Tab 切换 - 按钮风格 */}
      <div className="flex items-center gap-sm px-xl py-md">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-md py-xs text-body font-medium rounded-sm transition-all ${
              activeTab === tab.id
                ? 'bg-brand-light text-brand'
                : 'text-text-secondary hover:text-text-primary hover:bg-gray-2'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 内容 */}
      <div className="relative">
        {activeTab === 'banner' && (
          <>
            <div className="px-xl py-lg space-y-lg">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
                <FormItem label="主标题">
                  <Input 
                    value={bannerData.title || ''} 
                    onChange={e => handleBannerChange('title', e.target.value)} 
                    placeholder="请输入主标题"
                  />
                </FormItem>
                <FormItem label="副标题">
                  <Input 
                    value={bannerData.subtitle || ''} 
                    onChange={e => handleBannerChange('subtitle', e.target.value)} 
                    placeholder="请输入副标题"
                  />
                </FormItem>
              </div>

              <FormItem label="背景模式">
                <div className="flex gap-sm mb-md">
                  <button
                    onClick={() => handleBannerChange('bgType', 'color')}
                    className={`flex items-center gap-xs px-md py-xs rounded-sm border transition-all ${
                      bannerData.bgType === 'color'
                        ? 'bg-brand-light border-brand text-brand'
                        : 'border-gray-4 text-gray-7 hover:border-brand/50'
                    }`}
                  >
                    <Palette className="w-4 h-4" />
                    <span className="font-medium text-body">纯色背景</span>
                  </button>
                  <button
                    onClick={() => handleBannerChange('bgType', 'image')}
                    className={`flex items-center gap-xs px-md py-xs rounded-sm border transition-all ${
                      bannerData.bgType === 'image'
                        ? 'bg-brand-light border-brand text-brand'
                        : 'border-gray-4 text-gray-7 hover:border-brand/50'
                    }`}
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span className="font-medium text-body">图片背景</span>
                  </button>
                </div>
                 
                {bannerData.bgType === 'color' ? (
                  <div className="flex gap-md p-lg bg-gray-2 rounded-md border border-gray-4">
                    {[
                      { value: 'bg-sky-900', color: '#0c4a6e' },
                      { value: 'bg-slate-800', color: '#1e293b' },
                      { value: 'bg-blue-900', color: '#1e3a8a' },
                      { value: 'bg-indigo-900', color: '#312e81' },
                      { value: 'bg-purple-900', color: '#581c87' },
                      { value: 'bg-red-900', color: '#7f1d1d' },
                      { value: 'bg-green-900', color: '#14532d' },
                      { value: 'bg-teal-900', color: '#134e4a' },
                    ].map(c => (
                      <button 
                        key={c.value} 
                        onClick={() => handleBannerChange('bgValue', c.value)} 
                        style={{ backgroundColor: c.color }}
                        className={`w-10 h-10 rounded-full ring-offset-2 transition-all ${
                          bannerData.bgValue === c.value 
                            ? 'ring-2 ring-brand shadow-lg scale-110' 
                            : 'hover:scale-105 hover:shadow-md'
                        }`}
                      />
                    ))}
                  </div>
                ) : (
                  <ImageSelector 
                    label="上传Banner背景图 (建议 1920x400)" 
                    value={bannerData.bgValue && bannerData.bgType === 'image' ? { url: bannerData.bgValue, title: 'Banner' } : null} 
                    onChange={v => handleBannerChange('bgValue', v?.url || '')} 
                    library={imageLib} 
                  />
                )}
              </FormItem>
            </div>
            
            {/* 底部占位块 - 防止内容被悬浮栏遮挡 */}
            <div className="h-20" aria-hidden="true" />
            
            {/* 底部悬浮操作栏 - 保存配置 + 发布更新 */}
            <FloatingActionBar
              status={getBannerDisplayStatus()}
              scene="config"
              lastPublishedTime={lastPublishedBannerTime}
              lastPublishedDate={lastPublishedBannerDate}
              onSave={handleSaveBanner}
              onSaveDraft={handleSaveBannerDraft}
              saveText="发布更新"
              saveDraftText="保存配置"
              showDraftButton={true}
            />
          </>
        )}
        {activeTab === 'content' && (
          <NewsListEditor
            ref={contentEditorRef}
            newsList={articles}
            onChange={setArticles}
            imageLib={imageLib}
            defaultCategory="party_youth"
            categoryLabel="青年之友"
            newsCategories={[]} // 不需要分类筛选
            hidePageBanner={true}
            onAddClick={handleContentAdd}
            onHistoryClick={handleContentHistory}
          />
        )}
      </div>
    </div>
  );
};

export default PartyYouthEditor;
