import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Edit2, Trash2, Sparkles, Bold, Italic, Underline, ImageIcon, ArrowUpCircle, ArrowDownCircle, RefreshCw, AlertCircle, Save, Clock, X, FileText, Upload } from 'lucide-react';
import { Modal, PageBanner, SearchFilterBar, DataTable, StatusChip, UnifiedHistoryModal } from '../ui';
import { NEWS_CATEGORIES, NEWS_STATUS, DISPLAY_POSITIONS } from '../../constants/initialData';
import { ArticleSidebarConfig } from './ArticleSidebarConfig';

// 检测文章修改的字段
const detectChangedFields = (current, initial) => {
  if (!current || !initial) return [];
  const changedFields = [];
  
  if (current.title !== initial.title) changedFields.push('标题');
  if (current.summary !== initial.summary) changedFields.push('摘要');
  if (current.content !== initial.content) changedFields.push('正文');
  if (current.cover !== initial.cover) changedFields.push('封面');
  if (current.category !== initial.category) changedFields.push('分类');
  if (current.displayPosition !== initial.displayPosition) changedFields.push('展示位置');
  if (current.publishTime !== initial.publishTime) changedFields.push('发布时间');
  if (current.author !== initial.author) changedFields.push('作者');
  
  if (current.category === 'recruit' && JSON.stringify(current.attachment) !== JSON.stringify(initial.attachment)) {
    changedFields.push('附件');
  }
  
  return changedFields;
};

// 生成文章版本历史数据
const generateArticleHistory = (articleTitle, currentNews = null, initialNews = null) => {
  // 如果有当前和初始数据，检测修改的字段
  // 只有保存文章（draft）时才生成细粒度描述，更新和发布只生成简单描述
  if (currentNews && initialNews) {
    // 只有保存文章时才检测字段变化并生成细粒度描述
    if (currentNews.status === 'draft') {
      const changedFields = detectChangedFields(currentNews, initialNews);
      if (changedFields.length > 0) {
        const fieldsDesc = changedFields.join('、');
        return [
          { id: 'v1', time: new Date().toISOString(), description: `编辑了"${fieldsDesc}"内容`, operator: 'admin', status: 'draft' },
        ];
      }
    }
    // 更新和发布只生成简单描述，不检测字段
    // 这里不自动生成，由调用方在保存/发布时手动添加记录
  }
  
  // 默认模拟数据
  // 如果文章ID是116（状态为draft的文章），返回包含下架记录的历史
  if (currentNews && currentNews.id === 116 && currentNews.status === 'draft') {
    return [
      { id: 'v1', time: new Date().toISOString(), description: '下架了文章', operator: 'admin', status: 'unpublish' },
      { id: 'v2', time: '2024-03-20 14:30', description: '更新了文章', operator: 'admin', status: 'updated' },
      { id: 'v3', time: '2024-03-18 16:00', description: '发布了文章', operator: 'admin', status: 'published' },
      { id: 'v4', time: '2024-03-18 15:30', description: '编辑了"标题"、"摘要"内容', operator: 'admin', status: 'draft' },
    ];
  }
  
  return [
    { id: 'v1', time: '2024-03-20 14:30', description: '更新了文章', operator: 'admin', status: 'updated' },
    { id: 'v2', time: '2024-03-20 14:25', description: '更新了文章', operator: 'admin', status: 'updated' },
    { id: 'v3', time: '2024-03-18 16:00', description: '发布了文章', operator: 'admin', status: 'published' },
    { id: 'v4', time: '2024-03-18 15:30', description: '编辑了"标题"、"摘要"内容', operator: 'admin', status: 'draft' },
    { id: 'v5', time: '2024-03-15 10:00', description: '发布了文章', operator: 'admin', status: 'published' },
  ];
};

// ==================== 封面角标组件 ====================
const CoverBadge = ({ cover, displayPosition, status }) => {
  const pos = DISPLAY_POSITIONS.find(p => p.id === displayPosition);
  
  // 图文列表(normal)和卡片列表(cardGrid)不显示角标
  // 未上线(draft)的文章不显示角标
  const hideBadgePositions = ['normal', 'cardGrid'];
  const hasBadge = pos && pos.badge && !hideBadgePositions.includes(displayPosition) && status !== 'draft';
  
  return (
    <div className="relative w-20 h-14 rounded-md overflow-visible group/cover">
      {/* 封面图或占位图 */}
      <div className="w-full h-full rounded-md overflow-hidden">
        {cover ? (
          <div className={`w-full h-full ${cover}`}></div>
        ) : (
          <div className="w-full h-full bg-[#F3F4F6] flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-[#9CA3AF]" />
          </div>
        )}
      </div>
      
      {/* 角标 - 右上角，60%黑底 + 白字 + 微弱圆角 + 背景模糊 */}
      {hasBadge && (
        <div className="absolute -top-1 -right-1 z-10">
          <div className="relative group/badge">
            <div 
              className="flex items-center px-1.5 py-0.5 rounded-sm text-[10px] font-medium text-white backdrop-blur-sm"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
            >
              {pos.badge}
            </div>
            {/* Hover 显示 Tooltip - 向右弹出避免遮挡 */}
            <div className="absolute left-full top-0 ml-2 opacity-0 group-hover/badge:opacity-100 pointer-events-none group-hover/badge:pointer-events-auto transition-opacity z-[100]">
              <div className="bg-gray-8 text-white text-xs rounded-lg px-3 py-2 shadow-xl whitespace-pre-line w-56">
                <div className="font-medium mb-1">{pos.label}</div>
                <div className="text-gray-4 leading-relaxed">{pos.tooltip}</div>
              </div>
              {/* 小箭头指向左方 */}
              <div className="absolute right-full top-2 border-6 border-transparent border-r-gray-8"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==================== 状态标签组件 ====================
// 将 status + hasUnsyncedChanges 映射为 StatusChip 需要的状态
const getArticleStatus = (status, hasUnsyncedChanges) => {
  if (status === 'draft') return 'draft';
  if (status === 'published' && hasUnsyncedChanges) return 'pending';
  return 'published';
};

const NewsListEditor = forwardRef(({ newsList, onChange, newsCategories, imageLib, defaultCategory = null, categoryLabel = null, buttonText = '新增文章', hidePageBanner = false, onAddClick, onHistoryClick }, ref) => {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState(defaultCategory || 'all');
  const [dateFilter, setDateFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('publishTime');
  const [sortOrder, setSortOrder] = useState('desc');
  const pageSize = 10;

  // ==================== 编辑弹窗状态管理 ====================
  const [initialNews, setInitialNews] = useState(null);  // 初始值，用于对比是否有修改
  const [isSaving, setIsSaving] = useState(false);       // 保存中
  const [hasLocalChanges, setHasLocalChanges] = useState(false); // 用户是否有未保存的修改
  const [lastSavedTime, setLastSavedTime] = useState(null); // 上次保存时间
  
  // ==================== 历史记录弹窗 ====================
  const [showArticleHistoryModal, setShowArticleHistoryModal] = useState(false); // 单篇文章历史
  const [showPageHistoryModal, setShowPageHistoryModal] = useState(false); // 页面级操作日志
  
  // ==================== 页面级操作日志 ====================
  // Mock 操作日志数据
  const MOCK_OPERATION_LOGS = [
    { 
      id: 'log_1', 
      time: '2024-12-08T15:30:00.000Z', 
      description: '发布了《公司荣获"2025年度科技创新领军企业"称号》', 
      operator: 'admin', 
      action: 'publish',
      newsId: 'news_1',
      newsTitle: '公司荣获"2025年度科技创新领军企业"称号',
      displayPosition: 'bigImage'
    },
    { 
      id: 'log_2', 
      time: '2024-12-08T14:20:00.000Z', 
      description: '更新了《2025年度工作会议圆满召开》', 
      operator: 'admin', 
      action: 'update',
      newsId: 'news_2',
      newsTitle: '2025年度工作会议圆满召开',
      displayPosition: 'smallImage'
    },
    { 
      id: 'log_3', 
      time: '2024-12-08T13:15:00.000Z', 
      description: '下架了《公司荣获行业标杆企业称号》', 
      operator: 'admin', 
      action: 'unpublish',
      newsId: 'news_3',
      newsTitle: '公司荣获行业标杆企业称号',
      displayPosition: 'normal'
    },
    { 
      id: 'log_4', 
      time: '2024-12-07T16:45:00.000Z', 
      description: '发布了《新能源项目正式启动》', 
      operator: 'editor_zhang', 
      action: 'publish',
      newsId: 'news_4',
      newsTitle: '新能源项目正式启动',
      displayPosition: 'textRecommend'
    },
    { 
      id: 'log_5', 
      time: '2024-12-07T10:30:00.000Z', 
      description: '更新了《公司签署战略合作协议》', 
      operator: 'admin', 
      action: 'update',
      newsId: 'news_5',
      newsTitle: '公司签署战略合作协议',
      displayPosition: 'normal'
    },
    { 
      id: 'log_6', 
      time: '2024-12-06T11:20:00.000Z', 
      description: '发布了《2024年度总结报告》', 
      operator: 'admin', 
      action: 'publish',
      newsId: 'news_6',
      newsTitle: '2024年度总结报告',
      displayPosition: 'normal'
    },
    { 
      id: 'log_7', 
      time: '2024-12-05T09:15:00.000Z', 
      description: '下架了《临时通知：系统维护公告》', 
      operator: 'editor_zhang', 
      action: 'unpublish',
      newsId: 'news_7',
      newsTitle: '临时通知：系统维护公告',
      displayPosition: 'textRecommend'
    },
  ];
  
  const [pageOperationLogs, setPageOperationLogs] = useState(() => {
    // 从 localStorage 读取或初始化
    const saved = localStorage.getItem(`news_page_operation_logs_${defaultCategory || 'all'}`);
    if (saved) {
      return JSON.parse(saved);
    }
    // 如果没有保存的数据，返回mock数据
    return MOCK_OPERATION_LOGS;
  });
  
  // 记录操作日志
  const recordOperation = (action, news, extraInfo = {}) => {
    const now = new Date();
    const timeStr = now.toISOString();
    
    let description = '';
    if (action === 'publish') {
      description = `发布了《${news.title}》`;
    } else if (action === 'unpublish') {
      description = `下架了《${news.title}》`;
    } else if (action === 'update') {
      description = `更新了《${news.title}》`;
    }
    
    const newLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      time: timeStr,
      description,
      operator: 'admin', // 实际应该从用户上下文获取
      action,
      newsId: news.id,
      newsTitle: news.title,
      displayPosition: news.displayPosition,
      ...extraInfo
    };
    
    const updatedLogs = [newLog, ...pageOperationLogs].slice(0, 100); // 最多保留100条
    setPageOperationLogs(updatedLogs);
    localStorage.setItem(`news_page_operation_logs_${defaultCategory || 'all'}`, JSON.stringify(updatedLogs));
  };
  
  // ==================== 上架抽屉状态 ====================
  const [showPublishDrawer, setShowPublishDrawer] = useState(false);
  const [publishingNews, setPublishingNews] = useState(null); // 正在上架的文章
  
  // ==================== 封面配置抽屉状态 ====================
  const [showCoverDrawer, setShowCoverDrawer] = useState(false);
  const [configNews, setConfigNews] = useState(null); // 正在配置封面的文章

  // 监听用户编辑，对比初始值和当前值
  const checkForChanges = (current, initial) => {
    if (!current || !initial) return false;
    // 对比关键字段
    const basicChanges = (
      current.title !== initial.title ||
      current.summary !== initial.summary ||
      current.content !== initial.content ||
      current.cover !== initial.cover ||
      current.category !== initial.category ||
      current.displayPosition !== initial.displayPosition ||
      current.publishTime !== initial.publishTime ||
      current.author !== initial.author
    );
    // 招聘信息还需要对比附件
    if (current.category === 'recruit') {
      const attachmentChanged = JSON.stringify(current.attachment) !== JSON.stringify(initial.attachment);
      return basicChanges || attachmentChanged;
    }
    return basicChanges;
  };

  // 更新编辑中的新闻（简化版，不在 setState 回调中调用其他 setState）
  const updateEditingNews = (updater) => {
    setEditingNews(prev => {
      if (!prev) return prev;
      const newValue = typeof updater === 'function' ? updater(prev) : updater;
      return newValue || prev;
    });
  };
  
  // 使用 useEffect 监听 editingNews 变化来检测修改
  useEffect(() => {
    if (initialNews && editingNews) {
      setHasLocalChanges(checkForChanges(editingNews, initialNews));
    }
  }, [editingNews, initialNews]);

  // 根据分类获取可用的展示位置
  const getAvailablePositions = (category) => {
    switch (category) {
      case 'company': // 公司要闻 - 大图*1、小图*1、文字推荐*3、列表不限
        return ['bigImage', 'smallImage', 'textRecommend', 'normal'];
      case 'enterprise': // 企业新闻 - 大图*1、小图*1、文字推荐*3、列表不限
        return ['bigImage', 'smallImage', 'textRecommend', 'normal'];
      case 'project': // 项目动态 - 图文置顶*1、列表不限
        return ['featuredList', 'normal'];
      case 'industry': // 行业信息 - 卡片不限
        return ['cardGrid'];
      case 'party_building': // 党的建设 - 卡片，不可选
        return ['cardGrid'];
      case 'party_youth': // 青年之友 - 置顶、卡片列表
        return ['featuredList', 'cardGrid'];
      case 'recruit': // 招聘信息 - 不需要展示位
        return [];
      default:
        return ['normal'];
    }
  };

  // 根据分类自动设置展示位置
  const getDefaultPosition = (category) => {
    switch (category) {
      case 'company':
        return 'normal';
      case 'enterprise':
        return 'normal';
      case 'project':
        return 'normal';
      case 'industry':
        return 'cardGrid';
      case 'party_building':
        return 'cardGrid';
      case 'party_youth':
        return 'cardGrid';
      case 'recruit':
        return null; // 招聘信息不需要展示位
      default:
        return 'normal';
    }
  };

  // 筛选新闻
  const filteredNews = newsList.filter(news => {
    const matchSearch = !searchText || news.title.includes(searchText) || news.summary.includes(searchText);
    const matchStatus = statusFilter === 'all' || news.status === statusFilter;
    const matchCategory = categoryFilter === 'all' || news.category === categoryFilter;
    const matchDate = !dateFilter || news.publishTime.startsWith(dateFilter);
    return matchSearch && matchStatus && matchCategory && matchDate;
  });

  // 排序
  const sortedNews = [...filteredNews].sort((a, b) => {
    let aVal, bVal;
    switch (sortBy) {
      case 'displayPosition':
        const posOrder = { bigImage: 1, featuredList: 2, smallImage: 3, textRecommend: 4, cardGrid: 5, normal: 6 };
        aVal = posOrder[a.displayPosition] || 6;
        bVal = posOrder[b.displayPosition] || 6;
        break;
      case 'publishTime':
        aVal = a.publishTime || '';
        bVal = b.publishTime || '';
        break;
      case 'updateTime':
        aVal = a.updateTime || '';
        bVal = b.updateTime || '';
        break;
      case 'title':
        aVal = a.title || '';
        bVal = b.title || '';
        break;
      default:
        aVal = a.publishTime || '';
        bVal = b.publishTime || '';
    }
    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1;
    }
    return aVal < bVal ? 1 : -1;
  });

  // 分页
  const totalPages = Math.ceil(sortedNews.length / pageSize);
  const paginatedNews = sortedNews.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // 排序选项
  const sortOptions = [
    { id: 'publishTime', label: '发布时间' },
    { id: 'updateTime', label: '修改时间' },
    { id: 'displayPosition', label: '展示位置' },
    { id: 'title', label: '标题' },
  ];

  // 获取展示位置图标
  const getPositionIcon = (iconName, className = "w-5 h-5") => {
    const icons = {
      List: List,
      LayoutGrid: LayoutGrid,
      Image: Image,
      FileText: FileText,
      Star: Star,
      Grid: Grid,
    };
    const IconComponent = icons[iconName] || List;
    return <IconComponent className={className} />;
  };

  // 删除新闻
  const handleDelete = (id) => {
    if (confirm('确定删除该新闻吗？')) {
      onChange(newsList.filter(n => n.id !== id));
    }
  };

  // 编辑新闻
  const handleEdit = (news) => {
    const newsData = { ...news, content: news.content || '<p>模拟的内容...</p>' };
    setEditingNews(newsData);
    setInitialNews(newsData);  // 保存初始值用于对比
    setHasLocalChanges(false); // 重置修改状态
    setIsSaving(false);
    // 设置初始保存时间为文章的更新时间
    const updateDate = news.updateTime ? new Date(news.updateTime.replace(/\//g, '-')) : new Date();
    setLastSavedTime(updateDate.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }));
    setIsModalOpen(true);
  };

  // 新增新闻
  const handleAdd = () => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`;
    const category = defaultCategory || 'company';
    
    const newNews = {
      id: Math.max(...newsList.map(n => n.id), 0) + 1,
      title: '',
      summary: '',
      content: category === 'recruit' ? '<p>请输入招聘公告内容...</p>' : '<p>模拟的内容...</p>',
      category: category,
      cover: '',
      publishDate: dateStr,
      publishTime: `${dateStr} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:00`,
      updateTime: `${dateStr} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:00`,
      status: 'draft',
      author: category === 'recruit' ? '人力资源部' : '管理员',
      displayPosition: getDefaultPosition(category), // 根据分类自动设置默认展示位置
      attachment: category === 'recruit' ? null : undefined // 招聘信息有附件字段
    };
    setEditingNews(newNews);
    setInitialNews(newNews);  // 保存初始值用于对比
    setHasLocalChanges(true); // 新文章默认为未保存状态
    setIsSaving(false);
    setLastSavedTime(null);   // 新文章没有保存时间
    setIsModalOpen(true);
  };

  // ==================== 暴露方法给父组件 ====================
  useImperativeHandle(ref, () => ({
    handleAdd: handleAdd,
    showHistory: () => setShowPageHistoryModal(true)
  }));

  // 分类变化时自动调整展示位置
  const handleCategoryChange = (category) => {
    const availablePositions = getAvailablePositions(category);
    
    updateEditingNews(prev => {
      if (!prev) return prev;
      let newPosition = prev.displayPosition;
      // 如果当前展示位置不在可用范围内，自动切换
      if (!availablePositions.includes(newPosition)) {
        newPosition = getDefaultPosition(category);
      }
      return {
        ...prev,
        category,
        displayPosition: newPosition
      };
    });
  };

  // 保存文章（保存后关闭弹窗，如果是已发布文章则标记为待同步）
  const handleSaveArticle = async () => {
    if (!editingNews.title) {
      alert('请填写新闻标题');
      return;
    }
    
    // 注意：展示位置超出限制时仍然允许保存，发布时系统会自动处理顶替逻辑
    
    setIsSaving(true);
    
    // 模拟异步保存（实际项目中这里是 API 调用）
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const now = new Date();
    const newsToSave = {
      ...editingNews,
      // 保存时：如果原本是已发布状态，标记为有未同步的修改（待同步）
      hasUnsyncedChanges: editingNews.status === 'published' ? true : editingNews.hasUnsyncedChanges,
      updateTime: now.toLocaleString('zh-CN', { 
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      }).replace(/\//g, '/')
    };
    
    const exists = newsList.find(n => n.id === editingNews.id);
    if (exists) {
      onChange(newsList.map(n => n.id === editingNews.id ? newsToSave : n));
    } else {
      onChange([newsToSave, ...newsList]);
    }
    
    // 保存后关闭弹窗
    setIsSaving(false);
    setHasLocalChanges(false);
    setLastSavedTime(null);
    setIsModalOpen(false);
    setEditingNews(null);
    setInitialNews(null);
  };

  // ==================== 列表操作：上架/下架/同步 ====================
  
  // 检查文章是否需要封面图（根据分类和展示位置）
  const needsCoverForPublish = (news) => {
    // 行业信息不需要封面
    if (news.category === 'industry') return false;
    // 招聘信息不需要封面
    if (news.category === 'recruit') return false;
    // 党的建设不需要封面（可选）
    if (news.category === 'party_building') return false;
    // 青年之友：卡片列表不需要封面，置顶需要
    if (news.category === 'party_youth') {
      return news.displayPosition === 'featuredList';
    }
    // 文字置顶不需要封面
    if (news.displayPosition === 'textRecommend') return false;
    // 其他展示位置都需要封面
    return true;
  };
  
  // 上架文章（点击发布按钮）
  const handlePublish = async (news) => {
    // 招聘信息直接发布，不需要校验封面和展示位
    if (news.category === 'recruit') {
      confirmPublish(news);
      return;
    }
    
    // 其他分类：校验封面图和展示位置
    const needsCover = needsCoverForPublish(news);
    const hasCover = !!news.cover;
    const hasPosition = !!news.displayPosition;
    
    // 如果缺少必要信息，打开抽屉编辑
    if ((needsCover && !hasCover) || !hasPosition) {
      setPublishingNews({ ...news });
      setShowPublishDrawer(true);
      return;
    }
    
    // 直接发布
    confirmPublish(news);
  };
  
  // 确认发布文章
  const confirmPublish = (news) => {
    const now = new Date();
    const timeStr = now.toLocaleString('zh-CN', { 
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    }).replace(/\//g, '/');
    
    const newsToPublish = {
      ...news,
      status: 'published',
      hasUnsyncedChanges: false,
      publishTime: timeStr,
      updateTime: timeStr
    };
    onChange(newsList.map(n => n.id === news.id ? newsToPublish : n));
    
    // 记录操作日志
    recordOperation('publish', newsToPublish);
    
    setShowPublishDrawer(false);
    setPublishingNews(null);
  };
  
  // 更新抽屉中的文章配置
  const updatePublishingNews = (updates) => {
    setPublishingNews(prev => prev ? { ...prev, ...updates } : null);
  };

  // 下架文章
  const handleUnpublish = async (news) => {
    const newsToUnpublish = {
      ...news,
      status: 'draft',
      hasUnsyncedChanges: false,
      updateTime: new Date().toLocaleString('zh-CN', { 
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      }).replace(/\//g, '/')
    };
    onChange(newsList.map(n => n.id === news.id ? newsToUnpublish : n));
    
    // 记录操作日志
    recordOperation('unpublish', news);
  };

  // 同步文章（将本地修改同步到线上）
  const handleSync = async (news) => {
    const newsToSync = {
      ...news,
      hasUnsyncedChanges: false,
      updateTime: new Date().toLocaleString('zh-CN', { 
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      }).replace(/\//g, '/')
    };
    onChange(newsList.map(n => n.id === news.id ? newsToSync : n));
    
    // 记录更新操作日志
    recordOperation('update', news);
  };

  // 打开封面配置抽屉
  const handleOpenCoverConfig = (news) => {
    setConfigNews({ ...news });
    setShowCoverDrawer(true);
  };
  
  // 更新封面配置
  const updateConfigNews = (updates) => {
    setConfigNews(prev => prev ? { ...prev, ...updates } : null);
  };
  
  // 保存封面配置
  const handleSaveCoverConfig = () => {
    if (configNews) {
      const originalNews = newsList.find(n => n.id === configNews.id);
      const hasChanges = originalNews && (
        originalNews.cover !== configNews.cover ||
        originalNews.displayPosition !== configNews.displayPosition
      );
      
      // 如果封面或展示位置发生变化，记录更新操作日志
      if (originalNews && (originalNews.cover !== configNews.cover || originalNews.displayPosition !== configNews.displayPosition)) {
        recordOperation('update', configNews);
      }
      
      onChange(newsList.map(n => n.id === configNews.id ? {
        ...n,
        cover: configNews.cover,
        displayPosition: configNews.displayPosition,
        // 如果文章已上线且有修改，标记为待更新
        hasUnsyncedChanges: (n.status === 'published' && hasChanges) ? true : n.hasUnsyncedChanges
      } : n));
    }
    setShowCoverDrawer(false);
    setConfigNews(null);
  };

  // 表格列配置
  const tableColumns = [
    // 招聘信息不显示封面列
    ...(defaultCategory !== 'recruit' ? [{
      key: 'cover', 
      title: '封面', 
      width: 100,
      render: (val, row) => (
        <div 
          className="cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => handleOpenCoverConfig(row)}
          title="点击编辑封面和展示位"
        >
          <CoverBadge cover={val} displayPosition={row.displayPosition} status={row.status} />
        </div>
      )
    }] : []),
    { 
      key: 'title', 
      title: '标题', 
      width: 180,
      render: (val) => <span className="text-body text-gray-7 line-clamp-2">{val}</span>
    },
    { 
      key: 'summary', 
      title: '简介', 
      width: 220,
      render: (val) => <span className="text-caption text-gray-6 line-clamp-2">{val}</span>
    },
    { 
      key: 'author', 
      title: '作者', 
      width: 100,
      render: (val) => <span className="text-caption text-gray-6">{val || '-'}</span>
    },
    { 
      key: 'publishTime', 
      title: '发布时间', 
      width: 140,
      sortable: true,
      render: (val, row) => {
        // 未上线(draft)：发布时间为空
        if (row.status === 'draft') {
          return <span className="text-caption text-gray-4">-</span>;
        }
        // 已上线/待更新：显示发布时间
        const formatted = val ? `${val.split(' ')[0]?.replace(/\//g, '-')} ${val.split(' ')[1]?.slice(0, 5)}` : '-';
        return <span className="text-caption text-gray-6">{formatted}</span>;
      }
    },
    { 
      key: 'updateTime', 
      title: '修改时间', 
      width: 140,
      sortable: true,
      render: (val, row) => {
        const articleStatus = getArticleStatus(row.status, row.hasUnsyncedChanges);
        // 已上线（完美同步）：修改时间 = 发布时间
        if (articleStatus === 'published') {
          const publishTime = row.publishTime;
          const formatted = publishTime ? `${publishTime.split(' ')[0]?.replace(/\//g, '-')} ${publishTime.split(' ')[1]?.slice(0, 5)}` : '-';
          return <span className="text-caption text-gray-6">{formatted}</span>;
        }
        // 未上线/待更新：显示上次保存时间
        const formatted = val ? `${val.split(' ')[0]?.replace(/\//g, '-')} ${val.split(' ')[1]?.slice(0, 5)}` : '-';
        return <span className="text-caption text-gray-6">{formatted}</span>;
      }
    },
    { 
      key: 'status', 
      title: '状态', 
      width: 90,
      render: (val, row) => (
        <StatusChip 
          status={getArticleStatus(val, row.hasUnsyncedChanges)} 
          showDot={false} 
          showTooltip={true}
          scene="article"
        />
      )
    },
    { 
      key: 'actions', 
      title: '操作', 
      width: 160,
      render: (_, row) => {
        const articleStatus = getArticleStatus(row.status, row.hasUnsyncedChanges);
        // 草稿/下线状态
        const isDraft = articleStatus === 'draft';
        // 已上线（完美同步）
        const isPublished = articleStatus === 'published';
        // 待更新（有未发布的修改）
        const isPending = articleStatus === 'pending';
        // 只有未上线状态才能删除
        const canDelete = isDraft;
        
        return (
          <div className="flex items-center gap-0.5 flex-nowrap">
            {/* 发布按钮 - 草稿状态显示 */}
            {isDraft && (
              <button 
                onClick={() => handlePublish(row)} 
                className="flex items-center gap-0.5 px-1.5 py-1 text-xs text-gray-5 hover:text-brand hover:bg-brand/10 rounded transition-colors whitespace-nowrap"
              >
                <ArrowUpCircle className="w-3.5 h-3.5" />
                发布
              </button>
            )}
            
            {/* 更新按钮 - 待更新状态显示（主操作） */}
            {isPending && (
              <button 
                onClick={() => handleSync(row)} 
                className="flex items-center gap-0.5 px-1.5 py-1 text-xs text-gray-5 hover:text-brand hover:bg-brand/10 rounded transition-colors whitespace-nowrap"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                更新
              </button>
            )}
            
            {/* 下架按钮 - 已上线或待更新状态显示 */}
            {(isPublished || isPending) && (
              <button 
                onClick={() => handleUnpublish(row)} 
                className="flex items-center gap-0.5 px-1.5 py-1 text-xs text-gray-5 hover:text-error hover:bg-error/10 rounded transition-colors whitespace-nowrap"
              >
                <ArrowDownCircle className="w-3.5 h-3.5" />
                下架
              </button>
            )}
            
            {/* 编辑按钮 - 仅图标 */}
            <button 
              onClick={() => handleEdit(row)} 
              className="p-1.5 text-gray-5 hover:text-brand hover:bg-brand/10 rounded transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            
            {/* 删除按钮 - 仅图标，根据状态控制可用性 */}
            <div className="relative group/delete">
              <button 
                onClick={() => canDelete && handleDelete(row.id)} 
                className={`p-1.5 rounded transition-colors ${
                  canDelete 
                    ? 'text-gray-5 hover:text-error hover:bg-error/10' 
                    : 'text-gray-4 cursor-not-allowed'
                }`}
                disabled={!canDelete}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              {/* 禁用时的 Tooltip */}
              {!canDelete && (
                <div className="absolute z-50 right-0 bottom-full mb-1 opacity-0 group-hover/delete:opacity-100 pointer-events-none transition-opacity">
                  <div className="px-2 py-1 bg-gray-8 text-white text-xs rounded shadow-lg whitespace-nowrap">
                    请先下架后再删除
                  </div>
                  <div className="absolute right-2 top-full border-4 border-transparent border-t-gray-8"></div>
                </div>
              )}
            </div>
          </div>
        );
      }
    }
  ];

  // 关闭编辑弹窗
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingNews(null);
    setInitialNews(null);
    setHasLocalChanges(false);
    setIsSaving(false);
    setLastSavedTime(null);
  };

  return (
    <div>
      {/* 整体卡片容器 - PageBanner + 搜索筛选栏 + 表格 */}
      <div className="bg-white rounded-b-xl border border-[#E6E8EB] overflow-hidden">
        {/* PageBanner - 添加页面级历史记录入口 */}
        {!hidePageBanner && (
          <PageBanner 
            title={categoryLabel || "文章管理"}
            description={categoryLabel 
              ? `管理「${categoryLabel}」分类下的所有文章，修改内容将实时同步到官网对应栏目。`
              : "支持统一管理企业新闻、公司要闻、行业资讯与项目动态，修改内容将实时同步到官网对应栏目。"
            }
            buttonText={buttonText}
            buttonIcon="add"
            onButtonClick={onAddClick || handleAdd}
            onHistoryClick={onHistoryClick || (() => setShowPageHistoryModal(true))}
          />
        )}
        {/* 搜索筛选栏 - 使用通用组件 */}
        <SearchFilterBar
          searchText={searchText}
          onSearchChange={setSearchText}
          searchPlaceholder="搜索标题..."
          sortOptions={sortOptions}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={(field, order) => {
            setSortBy(field);
            setSortOrder(order);
          }}
          filterFields={[
            {
              id: 'status',
              label: '状态',
              type: 'select',
              value: statusFilter,
              options: NEWS_STATUS.map(s => ({ value: s.id, label: s.label }))
            },
            // 如果没有默认分类，显示分类筛选器
            ...(!defaultCategory ? [{
              id: 'category',
              label: '分类',
              type: 'select',
              value: categoryFilter,
              options: [
                { value: 'all', label: '全部分类' },
                ...NEWS_CATEGORIES.map(cat => ({ value: cat.id, label: cat.label }))
              ]
            }] : []),
            {
              id: 'date',
              label: '日期',
              type: 'date',
              value: dateFilter
            }
          ]}
          onFilterChange={(fieldId, value) => {
            if (fieldId === 'status') setStatusFilter(value);
            if (fieldId === 'category') setCategoryFilter(value);
            if (fieldId === 'date') setDateFilter(value);
          }}
          onFilterReset={() => {
            setStatusFilter('all');
            setCategoryFilter('all');
            setDateFilter('');
          }}
        />

        {/* 表格 - 使用通用组件 */}
        <DataTable
          columns={tableColumns}
          data={paginatedNews}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={(field, order) => {
            setSortBy(field);
            setSortOrder(order);
          }}
          currentPage={currentPage}
          pageSize={pageSize}
          total={sortedNews.length}
          onPageChange={setCurrentPage}
          emptyText="暂无数据"
          minWidth={1000}
        />
      </div>

      {/* 弹窗编辑 - 沉浸式写作布局 */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={newsList.find(n => n.id === editingNews?.id) ? '编辑文章' : '新增文章'}
        size="4xl"
      >
        {editingNews && (
          <div className="flex flex-col h-[75vh]">
            {/* 主内容区 - 左右分栏（招聘信息全宽） */}
            <div className={`flex-1 flex overflow-hidden ${editingNews.category === 'recruit' ? '' : ''}`}>
              
              {/* 左侧：表单编辑区 (招聘信息全宽，其他65%) */}
              <div className={`${editingNews.category === 'recruit' ? 'flex-1' : 'flex-[65]'} overflow-y-auto ${editingNews.category === 'recruit' ? '' : 'pr-8'} space-y-5`}>
                
                {/* 标题字段 */}
                <div>
                  <label className="block text-sm text-gray-6 mb-2">
                    标题 <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    value={editingNews.title || ''}
                    onChange={e => {
                      const value = e.target.value.slice(0, 50);
                      updateEditingNews(prev => prev ? {...prev, title: value} : prev);
                    }}
                    placeholder="请输入文章标题"
                    maxLength={50}
                    className="w-full px-4 py-3 border border-gray-3 rounded-lg text-text-primary placeholder-text-placeholder focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors"
                  />
                  <div className="flex justify-between mt-1.5 text-xs text-gray-5">
                    <span>{editingNews.title?.length || 0} 字符</span>
                    <span>最多 50 字符</span>
                  </div>
                </div>

                {/* 摘要字段 */}
                <div>
                  <label className="block text-sm text-gray-6 mb-2">
                    摘要
                  </label>
                  <div className="relative">
                    <textarea
                      value={editingNews.summary || ''}
                      onChange={e => {
                        const value = e.target.value.slice(0, 100);
                        updateEditingNews(prev => prev ? {...prev, summary: value} : prev);
                      }}
                      placeholder="请输入文章摘要（选填）"
                      rows={3}
                      maxLength={100}
                      className="w-full px-4 py-3 border border-gray-3 rounded-lg text-text-primary placeholder-text-placeholder focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors resize-none"
                    />
                    <button className="absolute right-3 top-3 flex items-center gap-1 px-2 py-1 text-xs text-brand hover:bg-brand/10 rounded transition-colors">
                      <Sparkles className="w-3 h-3" />
                      AI 生成
                    </button>
                  </div>
                  <div className="flex justify-between mt-1.5 text-xs text-gray-5">
                    <span>{editingNews.summary?.length || 0} 字符</span>
                    <span>最多 100 字符</span>
                  </div>
                </div>

                {/* 正文字段 */}
                <div className="flex-1 flex flex-col">
                  <label className="block text-sm text-gray-6 mb-2">
                    正文 <span className="text-error">*</span>
                  </label>
                  <div className="flex-1 border border-gray-3 rounded-lg overflow-hidden bg-white">
                    {/* 工具栏 */}
                    <div className="flex items-center gap-0.5 px-3 py-2 border-b border-gray-3 bg-gray-1">
                      <select className="px-2 py-1 text-sm text-gray-6 bg-transparent border-none outline-none cursor-pointer hover:bg-gray-3 rounded">
                        <option>正文</option>
                        <option>标题 1</option>
                        <option>标题 2</option>
                      </select>
                      <div className="w-px h-4 bg-gray-3 mx-2" />
                      <button className="p-1.5 hover:bg-gray-3 rounded transition-colors" title="加粗"><Bold className="w-4 h-4 text-gray-6" /></button>
                      <button className="p-1.5 hover:bg-gray-3 rounded transition-colors" title="斜体"><Italic className="w-4 h-4 text-gray-6" /></button>
                      <button className="p-1.5 hover:bg-gray-3 rounded transition-colors" title="下划线"><Underline className="w-4 h-4 text-gray-6" /></button>
                      <div className="w-px h-4 bg-gray-3 mx-2" />
                      <button className="p-1.5 hover:bg-gray-3 rounded transition-colors" title="插入图片"><ImageIcon className="w-4 h-4 text-gray-6" /></button>
                      <div className="flex-1" />
                      <span className="text-xs text-gray-5">+ 插入</span>
                    </div>
                    {/* 编辑区域 */}
                    <div className="p-4 min-h-[280px]">
                      <div 
                        className="text-sm text-text-primary leading-relaxed outline-none min-h-[260px] focus:outline-none"
                        contentEditable
                        suppressContentEditableWarning
                        onInput={e => updateEditingNews(prev => prev ? {...prev, content: e.currentTarget.innerHTML} : prev)}
                        onBlur={e => updateEditingNews(prev => prev ? {...prev, content: e.target.innerHTML} : prev)}
                        dangerouslySetInnerHTML={{ __html: editingNews.content || '' }}
                      />
                    </div>
                  </div>
                </div>

                {/* 作者字段 */}
                <div>
                  <label className="block text-sm text-gray-6 mb-2">
                    作者
                  </label>
                  <input
                    type="text"
                    value={editingNews.author || ''}
                    onChange={e => updateEditingNews(prev => prev ? {...prev, author: e.target.value} : prev)}
                    placeholder="请输入作者"
                    className="w-full px-4 py-3 border border-gray-3 rounded-lg text-text-primary placeholder-text-placeholder focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors"
                  />
                </div>

                {/* 附件字段 - 仅招聘信息显示 */}
                {editingNews.category === 'recruit' && (
                  <div>
                    <label className="block text-sm text-gray-6 mb-2">
                      附件
                    </label>
                    {editingNews.attachment ? (
                      <div className="flex items-center gap-3 p-3 bg-gray-1 rounded-lg border border-gray-3">
                        <div className="flex items-center gap-2 flex-1">
                          <FileText className="w-5 h-5 text-gray-6" />
                          <div>
                            <div className="text-sm font-medium text-gray-8">{editingNews.attachment.name}</div>
                            <div className="text-xs text-gray-5">附件已上传</div>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            const fileInput = document.createElement('input');
                            fileInput.type = 'file';
                            fileInput.accept = '.pdf,.doc,.docx';
                            fileInput.onchange = (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const fakeUrl = URL.createObjectURL(file);
                                updateEditingNews(prev => prev ? {
                                  ...prev,
                                  attachment: {
                                    name: file.name,
                                    url: fakeUrl
                                  }
                                } : prev);
                              }
                            };
                            fileInput.click();
                          }}
                          className="px-3 py-1.5 text-sm text-brand hover:bg-brand/10 rounded transition-colors"
                        >
                          替换
                        </button>
                        <button
                          onClick={() => updateEditingNews(prev => prev ? {...prev, attachment: null} : prev)}
                          className="px-3 py-1.5 text-sm text-error hover:bg-error/10 rounded transition-colors"
                        >
                          删除
                        </button>
                      </div>
                    ) : (
                      <div
                        className="border-2 border-dashed border-gray-3 rounded-lg p-6 text-center cursor-pointer hover:border-brand transition-colors"
                        onClick={() => {
                          const fileInput = document.createElement('input');
                          fileInput.type = 'file';
                          fileInput.accept = '.pdf,.doc,.docx';
                          fileInput.onchange = (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const fakeUrl = URL.createObjectURL(file);
                              updateEditingNews(prev => prev ? {
                                ...prev,
                                attachment: {
                                  name: file.name,
                                  url: fakeUrl
                                }
                              } : prev);
                            }
                          };
                          fileInput.click();
                        }}
                      >
                        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-4" />
                        <p className="text-sm text-gray-6">点击上传附件</p>
                        <p className="text-xs text-gray-5 mt-1">支持 PDF、Word 格式</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 右侧：配置区 (约35%) - 根据分类动态渲染，招聘信息不显示 */}
              {editingNews.category !== 'recruit' && (
                <div className="flex-[35] overflow-y-auto pl-8 border-l border-gray-3">
                  <ArticleSidebarConfig
                    category={editingNews.category}
                    cover={editingNews.cover}
                    displayPosition={editingNews.displayPosition}
                    onCoverChange={(val) => updateEditingNews(prev => prev ? {...prev, cover: val} : prev)}
                    onPositionChange={(val) => updateEditingNews(prev => prev ? {...prev, displayPosition: val} : prev)}
                    currentNewsId={editingNews.id}
                    newsList={newsList}
                  />
                </div>
              )}
            </div>

            {/* 底部状态栏 - 简化版：只显示保存状态 + 保存按钮 */}
            <div className="flex-shrink-0 mt-4 pt-4 border-t border-gray-3 flex items-center justify-between">
              {/* 左侧：保存状态（纯文字） */}
              <div className="flex items-center gap-2">
                {isSaving ? (
                  <span className="text-sm text-gray-5">保存中...</span>
                ) : hasLocalChanges ? (
                  <div className="flex items-center gap-1.5 group/status relative">
                    <span className="text-sm text-gray-7">有未保存修改</span>
                    <AlertCircle className="w-3.5 h-3.5 text-gray-5" />
                    {/* Tooltip */}
                    <div className="absolute z-50 left-0 bottom-full mb-2 opacity-0 group-hover/status:opacity-100 pointer-events-none transition-opacity">
                      <div className="bg-gray-8 text-white text-xs rounded-lg px-3 py-2 shadow-xl whitespace-pre-line min-w-[200px] leading-relaxed">
                        检测到您有新的编辑内容尚未保存。{'\n'}注意：关闭页面将导致修改丢失。
                      </div>
                      <div className="absolute left-4 top-full border-6 border-transparent border-t-gray-8"></div>
                    </div>
                  </div>
                ) : lastSavedTime ? (
                  <span className="text-sm text-gray-5">已保存于 {lastSavedTime}</span>
                ) : (
                  <span className="text-sm text-gray-5">新文章</span>
                )}
              </div>
              
              {/* 右侧：历史记录 + 保存按钮 */}
              <div className="flex items-center gap-2">
                {/* 历史记录按钮 */}
                {editingNews.id && newsList.find(n => n.id === editingNews.id) && (
                  <button
                    onClick={() => setShowArticleHistoryModal(true)}
                    className="flex items-center gap-1.5 px-3 py-2 text-gray-6 hover:text-gray-7 hover:bg-gray-2 rounded-lg text-sm transition-colors"
                    title="查看版本历史"
                  >
                    <Clock className="w-4 h-4" />
                    历史记录
                  </button>
                )}
                
                {/* 保存按钮 */}
                <button
                  onClick={handleSaveArticle}
                  disabled={isSaving || !hasLocalChanges}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isSaving 
                      ? 'bg-gray-3 text-gray-5 cursor-not-allowed'
                      : hasLocalChanges
                        ? 'bg-brand text-white hover:bg-brand-active animate-breathe'
                        : 'bg-gray-3 text-gray-5 cursor-not-allowed'
                  }`}
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? '保存中...' : '保存文章'}
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* 单篇文章版本历史弹窗 */}
      <UnifiedHistoryModal
        isOpen={showArticleHistoryModal}
        onClose={() => setShowArticleHistoryModal(false)}
        title={editingNews ? `《${editingNews.title}》 - 版本历史` : '版本历史'}
        mode="editor"
        records={editingNews ? generateArticleHistory(editingNews.title, editingNews, initialNews) : []}
        onRestore={(record) => {
          console.log('恢复版本:', record);
          setShowArticleHistoryModal(false);
        }}
        useArticleVersionLabels={true}
      />

      {/* 页面级操作日志弹窗 */}
      <UnifiedHistoryModal
        isOpen={showPageHistoryModal}
        onClose={() => setShowPageHistoryModal(false)}
        title={`${categoryLabel || '文章管理'} - 操作日志`}
        mode="article"
        records={pageOperationLogs}
      />

      {/* 上架配置抽屉 */}
      {showPublishDrawer && publishingNews && (
        <div className="fixed inset-0 z-[60] flex">
          {/* 遮罩层 */}
          <div 
            className="absolute inset-0 bg-gray-8/40 backdrop-blur-sm"
            onClick={() => { setShowPublishDrawer(false); setPublishingNews(null); }}
          />
          
          {/* 抽屉内容 - 从右侧滑入 */}
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-strong flex flex-col animate-in slide-in-from-right duration-300">
            {/* 抽屉头部 */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-3">
              <div>
                <h3 className="text-section text-gray-8">发布配置</h3>
                <p className="text-caption text-gray-5 mt-1">请完善封面图片和展示位置后发布</p>
              </div>
              <button 
                onClick={() => { setShowPublishDrawer(false); setPublishingNews(null); }}
                className="p-1.5 text-gray-5 hover:text-gray-7 hover:bg-gray-2 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* 文章信息 */}
            <div className="px-6 py-4 bg-gray-1 border-b border-gray-3">
              <div className="text-sm text-gray-6">正在发布</div>
              <div className="text-body font-medium text-gray-8 mt-1 line-clamp-2">{publishingNews.title}</div>
            </div>
            
            {/* 配置内容 - 复用 ArticleSidebarConfig */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <ArticleSidebarConfig
                category={publishingNews.category}
                cover={publishingNews.cover}
                displayPosition={publishingNews.displayPosition}
                onCoverChange={(val) => updatePublishingNews({ cover: val })}
                onPositionChange={(val) => updatePublishingNews({ displayPosition: val })}
                currentNewsId={publishingNews.id}
                newsList={newsList}
              />
            </div>
            
            {/* 抽屉底部 */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-3 bg-white">
              <button
                onClick={() => { setShowPublishDrawer(false); setPublishingNews(null); }}
                className="px-4 py-2 text-sm text-gray-6 hover:text-gray-7 hover:bg-gray-2 rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => {
                  // 先保存配置到列表
                  onChange(newsList.map(n => n.id === publishingNews.id ? {
                    ...n,
                    cover: publishingNews.cover,
                    displayPosition: publishingNews.displayPosition
                  } : n));
                  // 再发布
                  confirmPublish(publishingNews);
                }}
                disabled={needsCoverForPublish(publishingNews) && !publishingNews.cover}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  needsCoverForPublish(publishingNews) && !publishingNews.cover
                    ? 'bg-gray-3 text-gray-5 cursor-not-allowed'
                    : 'bg-brand text-white hover:bg-brand-active'
                }`}
              >
                <ArrowUpCircle className="w-4 h-4" />
                确认发布
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 封面配置抽屉 - 点击封面图片打开 */}
      {showCoverDrawer && configNews && (
        <div className="fixed inset-0 z-[60] flex">
          {/* 遮罩层 */}
          <div 
            className="absolute inset-0 bg-gray-8/40 backdrop-blur-sm"
            onClick={() => { setShowCoverDrawer(false); setConfigNews(null); }}
          />
          
          {/* 抽屉内容 - 从右侧滑入 */}
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-strong flex flex-col animate-in slide-in-from-right duration-300">
            {/* 抽屉头部 */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-3">
              <div>
                <h3 className="text-section text-gray-8">封面与展示位配置</h3>
                <p className="text-caption text-gray-5 mt-1">编辑文章的封面图片和展示位置</p>
              </div>
              <button 
                onClick={() => { setShowCoverDrawer(false); setConfigNews(null); }}
                className="p-1.5 text-gray-5 hover:text-gray-7 hover:bg-gray-2 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* 文章信息 */}
            <div className="px-6 py-4 bg-gray-1 border-b border-gray-3">
              <div className="text-sm text-gray-6">正在编辑</div>
              <div className="text-body font-medium text-gray-8 mt-1 line-clamp-2">{configNews.title}</div>
            </div>
            
            {/* 配置内容 - 复用 ArticleSidebarConfig */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <ArticleSidebarConfig
                category={configNews.category}
                cover={configNews.cover}
                displayPosition={configNews.displayPosition}
                onCoverChange={(val) => updateConfigNews({ cover: val })}
                onPositionChange={(val) => updateConfigNews({ displayPosition: val })}
                currentNewsId={configNews.id}
                newsList={newsList}
              />
            </div>
            
            {/* 抽屉底部 */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-3 bg-white">
              <button
                onClick={() => { setShowCoverDrawer(false); setConfigNews(null); }}
                className="px-4 py-2 text-sm text-gray-6 hover:text-gray-7 hover:bg-gray-2 rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSaveCoverConfig}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-brand text-white hover:bg-brand-active transition-all"
              >
                <Save className="w-4 h-4" />
                保存配置
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

NewsListEditor.displayName = 'NewsListEditor';

export default NewsListEditor;
