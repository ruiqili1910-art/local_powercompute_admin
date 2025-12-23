/**
 * 统一历史记录弹窗组件
 * 
 * 支持三种模式：
 * 1. 配置页面模式 (mode="editor") - 显示保存/发布记录，支持恢复版本
 * 2. 资源库模式 (mode="library") - 显示新增/编辑/删除操作日志，不支持恢复
 * 3. 文章页面级操作日志 (mode="article") - 只记录发布、下架、更新，不支持恢复
 * 
 * @param {boolean} isOpen - 是否显示弹窗
 * @param {function} onClose - 关闭回调
 * @param {string} title - 弹窗标题
 * @param {string} mode - 'editor' | 'library' | 'article'
 * @param {Array} records - 历史记录数据
 * @param {function} onRestore - 恢复版本回调（仅 editor 模式）
 */
import { useState, useMemo } from 'react';
import { X, Search, ChevronDown, ChevronRight, RotateCcw, Calendar, Filter, Clock } from 'lucide-react';
import Button from './Button';

// 时间筛选选项
const TIME_FILTER_OPTIONS = [
  { id: 'all', label: '全部时间' },
  { id: '7days', label: '最近7天' },
  { id: '30days', label: '最近30天' },
  { id: '90days', label: '最近3个月' },
];

// 配置页面状态筛选
const EDITOR_STATUS_OPTIONS = [
  { id: 'all', label: '全部状态' },
  { id: 'published', label: '发布更新' },
  { id: 'draft', label: '保存' },
];

// 单篇文章版本历史状态筛选
const ARTICLE_VERSION_STATUS_OPTIONS = [
  { id: 'all', label: '全部状态' },
  { id: 'published', label: '发布' },
  { id: 'draft', label: '保存' },
  { id: 'updated', label: '更新' },
  { id: 'unpublish', label: '下架' },
];

// 资源库操作筛选
const LIBRARY_ACTION_OPTIONS = [
  { id: 'all', label: '全部操作' },
  { id: 'add', label: '新增' },
  { id: 'edit', label: '编辑' },
  { id: 'delete', label: '删除' },
];

// 文章页面级操作筛选
const ARTICLE_ACTION_OPTIONS = [
  { id: 'all', label: '全部操作' },
  { id: 'publish', label: '发布' },
  { id: 'unpublish', label: '下架' },
  { id: 'update', label: '更新' },
];

// 操作类型配置
const ACTION_CONFIG = {
  // 配置页面状态
  published: { text: '发布更新', className: 'bg-success/10 text-success border-success/20', dotClass: 'bg-success' },
  draft: { text: '保存', className: 'bg-brand/10 text-brand border-brand/20', dotClass: 'bg-brand' },
  // 单篇文章版本历史状态（自定义标签）
  'published-article': { text: '发布', className: 'bg-success/10 text-success border-success/20', dotClass: 'bg-success' },
  'draft-article': { text: '保存', className: 'bg-brand/10 text-brand border-brand/20', dotClass: 'bg-brand' },
  updated: { text: '更新', className: 'bg-brand/10 text-brand border-brand/20', dotClass: 'bg-brand' },
  'unpublish-article': { text: '下架', className: 'bg-error/10 text-error border-error/20', dotClass: 'bg-error' },
  // 资源库操作
  add: { text: '新增', className: 'bg-success/10 text-success border-success/20', dotClass: 'bg-success' },
  edit: { text: '编辑', className: 'bg-brand/10 text-brand border-brand/20', dotClass: 'bg-brand' },
  delete: { text: '删除', className: 'bg-error/10 text-error border-error/20', dotClass: 'bg-error' },
  // 文章页面级操作
  publish: { text: '发布', className: 'bg-success/10 text-success border-success/20', dotClass: 'bg-success' },
  unpublish: { text: '下架', className: 'bg-error/10 text-error border-error/20', dotClass: 'bg-error' },
  update: { text: '更新', className: 'bg-brand/10 text-brand border-brand/20', dotClass: 'bg-brand' },
};

const UnifiedHistoryModal = ({ 
  isOpen, 
  onClose, 
  title = '历史记录',
  mode = 'editor', // 'editor' | 'library' | 'article'
  records = [],
  onRestore,
  useArticleVersionLabels = false, // 是否使用单篇文章版本历史标签（保存、发布、更新）
}) => {
  // 筛选状态
  const [searchText, setSearchText] = useState('');
  const [timeFilter, setTimeFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // 折叠状态
  const [expandedMonths, setExpandedMonths] = useState(new Set());

  // 获取操作/状态字段名
  const getActionField = () => {
    if (mode === 'editor') return 'status';
    if (mode === 'article') return 'action';
    return 'action'; // library
  };

  // 筛选记录
  const filteredRecords = useMemo(() => {
    let result = [...records];
    const actionField = getActionField();

    // 搜索过滤
    if (searchText) {
      const lowerSearch = searchText.toLowerCase();
      result = result.filter(item => {
        const desc = item.description || item.itemTitle || '';
        const op = item.operator || '';
        return desc.toLowerCase().includes(lowerSearch) || op.toLowerCase().includes(lowerSearch);
      });
    }

    // 时间过滤
    if (timeFilter !== 'all') {
      const now = new Date();
      const days = timeFilter === '7days' ? 7 : timeFilter === '30days' ? 30 : 90;
      const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      result = result.filter(item => new Date(item.time) >= cutoff);
    }

    // 操作/状态过滤
    if (actionFilter !== 'all') {
      result = result.filter(item => item[actionField] === actionFilter);
    }

    return result;
  }, [records, searchText, timeFilter, actionFilter, mode]);

  // 按月份分组
  const groupedRecords = useMemo(() => {
    const groups = {};
    
    filteredRecords.forEach(item => {
      const date = new Date(item.time);
      const monthKey = `${date.getFullYear()}年${date.getMonth() + 1}月`;
      
      if (!groups[monthKey]) {
        groups[monthKey] = {
          key: monthKey,
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          items: []
        };
      }
      groups[monthKey].items.push(item);
    });

    return Object.values(groups).sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });
  }, [filteredRecords]);

  // 初始化展开最近月份
  useMemo(() => {
    if (groupedRecords.length > 0 && expandedMonths.size === 0) {
      setExpandedMonths(new Set([groupedRecords[0].key]));
    }
  }, [groupedRecords]);

  // 切换月份折叠
  const toggleMonth = (monthKey) => {
    const newExpanded = new Set(expandedMonths);
    if (newExpanded.has(monthKey)) {
      newExpanded.delete(monthKey);
    } else {
      newExpanded.add(monthKey);
    }
    setExpandedMonths(newExpanded);
  };

  // 全部展开/折叠
  const toggleAll = () => {
    if (expandedMonths.size === groupedRecords.length) {
      setExpandedMonths(new Set());
    } else {
      setExpandedMonths(new Set(groupedRecords.map(g => g.key)));
    }
  };

  // 格式化时间
  const formatTime = (timeStr) => {
    const date = new Date(timeStr);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${month}-${day} ${hours}:${minutes}`;
  };

  // 获取操作配置
  const getActionConfig = (record) => {
    const actionField = getActionField();
    const action = record[actionField];
    
    // 如果使用单篇文章版本历史标签，且是 editor 模式
    if (useArticleVersionLabels && mode === 'editor') {
      if (action === 'published') {
        return ACTION_CONFIG['published-article'];
      } else if (action === 'draft') {
        return ACTION_CONFIG['draft-article'];
      } else if (action === 'updated') {
        return ACTION_CONFIG['updated'];
      } else if (action === 'unpublish') {
        return ACTION_CONFIG['unpublish-article'];
      }
    }
    
    return ACTION_CONFIG[action] || ACTION_CONFIG.edit;
  };

  // 查找对应的保存记录（draft状态）
  const findRelatedDraftRecord = (currentRecord) => {
    if (mode !== 'editor' || (currentRecord.status !== 'published' && currentRecord.status !== 'updated')) {
      return null;
    }
    
    // 在records中查找时间最接近且早于当前记录的draft记录
    const currentTime = new Date(currentRecord.time).getTime();
    let closestDraft = null;
    let closestTimeDiff = Infinity;
    
    records.forEach(record => {
      if (record.status === 'draft') {
        const recordTime = new Date(record.time).getTime();
        const timeDiff = currentTime - recordTime;
        // 只考虑早于当前记录且时间差最小的draft记录
        if (timeDiff > 0 && timeDiff < closestTimeDiff) {
          closestTimeDiff = timeDiff;
          closestDraft = record;
        }
      }
    });
    
    return closestDraft;
  };

  // 获取记录描述
  const getRecordDescription = (record) => {
    if (mode === 'library') {
      const action = ACTION_CONFIG[record.action];
      return `${action?.text || '操作'}了 [${record.itemTitle}]`;
    }
    if (mode === 'article') {
      return record.description || '';
    }
    
    // editor模式：对于发布/更新状态，显示对应的保存记录时间
    if (mode === 'editor' && (record.status === 'published' || record.status === 'updated')) {
      const draftRecord = findRelatedDraftRecord(record);
      if (draftRecord) {
        const draftTime = formatTime(draftRecord.time);
        const actionText = record.status === 'published' ? '发布' : '更新';
        return `${actionText}了[${draftTime}]保存的版本`;
      }
    }
    
    return record.description;
  };

  // 处理恢复版本
  const handleRestore = (record) => {
    if (onRestore) {
      onRestore(record);
    }
  };

  if (!isOpen) return null;

  const filterOptions = 
    mode === 'editor' && useArticleVersionLabels ? ARTICLE_VERSION_STATUS_OPTIONS :
    mode === 'editor' ? EDITOR_STATUS_OPTIONS : 
    mode === 'article' ? ARTICLE_ACTION_OPTIONS : 
    LIBRARY_ACTION_OPTIONS;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-xs sm:p-md">
      {/* 遮罩层 */}
      <div className="absolute inset-0 bg-gray-8/40 backdrop-blur-sm" onClick={onClose} />
      
      {/* 弹窗内容 */}
      <div className="relative bg-white rounded-xl shadow-strong w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh] border border-gray-4">
        {/* 头部 */}
        <div className="px-lg py-md border-b border-gray-4 flex justify-between items-center bg-white">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-6" />
            <h3 className="text-section text-gray-8">{title}</h3>
          </div>
          <button 
            onClick={onClose} 
            className="p-xs rounded-md hover:bg-gray-3 text-gray-6"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 筛选栏 */}
        <div className="px-lg py-sm border-b border-gray-4 bg-gray-2 space-y-sm">
          <div className="flex items-center gap-sm">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-6" />
              <input
                type="text"
                placeholder={
                  mode === 'editor' ? '搜索修改描述或操作人...' : 
                  mode === 'article' ? '搜索操作描述或操作人...' : 
                  '搜索资源名称或操作人...'
                }
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-body bg-white border border-gray-4 rounded-md focus:outline-none focus:border-brand"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-xs px-3 py-2 rounded-md border transition-colors ${
                showFilters || timeFilter !== 'all' || actionFilter !== 'all'
                  ? 'bg-brand-light border-brand text-brand'
                  : 'bg-white border-gray-4 text-gray-7 hover:border-gray-5'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="text-body hidden sm:inline">筛选</span>
            </button>
          </div>

          {/* 展开的筛选选项 */}
          {showFilters && (
            <div className="flex flex-wrap items-center gap-sm pt-xs">
              <div className="flex items-center gap-xs">
                <Calendar className="w-4 h-4 text-gray-6" />
                <select
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className="px-2 py-1.5 text-caption bg-white border border-gray-4 rounded-md focus:outline-none focus:border-brand cursor-pointer"
                >
                  {TIME_FILTER_OPTIONS.map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="px-2 py-1.5 text-caption bg-white border border-gray-4 rounded-md focus:outline-none focus:border-brand cursor-pointer"
              >
                {filterOptions.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>

              {(timeFilter !== 'all' || actionFilter !== 'all') && (
                <button
                  onClick={() => { setTimeFilter('all'); setActionFilter('all'); }}
                  className="text-caption text-brand hover:text-brand-hover"
                >
                  清除筛选
                </button>
              )}
            </div>
          )}
        </div>

        {/* 记录列表 */}
        <div className="flex-1 overflow-y-auto">
          {groupedRecords.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-6">
              <Search className="w-12 h-12 mb-4 opacity-30" />
              <p className="text-body">没有找到匹配的记录</p>
            </div>
          ) : (
            <div className="px-lg py-sm">
              {groupedRecords.length > 1 && (
                <div className="flex justify-end mb-sm">
                  <button
                    onClick={toggleAll}
                    className="text-caption text-gray-6 hover:text-brand transition-colors"
                  >
                    {expandedMonths.size === groupedRecords.length ? '全部折叠' : '全部展开'}
                  </button>
                </div>
              )}

              {groupedRecords.map((group, groupIndex) => (
                <div key={group.key} className="mb-md">
                  <button
                    onClick={() => toggleMonth(group.key)}
                    className="w-full flex items-center gap-xs py-2 text-left hover:bg-gray-2 rounded-md transition-colors -mx-2 px-2"
                  >
                    {expandedMonths.has(group.key) ? (
                      <ChevronDown className="w-4 h-4 text-gray-6" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-6" />
                    )}
                    <span className="text-body font-medium text-gray-8">{group.key}</span>
                    <span className="text-caption text-gray-6">（{group.items.length}条）</span>
                  </button>

                  {expandedMonths.has(group.key) && (
                    <div className="ml-[7px] border-l-2 border-gray-4 pl-5 mt-sm space-y-1">
                      {group.items.map((record, index) => {
                        const isFirst = groupIndex === 0 && index === 0;
                        const config = getActionConfig(record);
                        
                        return (
                          <div key={record.id} className="relative py-3 group">
                            {/* 时间轴圆点 - 统一蓝色 */}
                            <div 
                              className={`absolute -left-[25px] top-4 w-3 h-3 rounded-full transition-colors ${
                                isFirst 
                                  ? 'bg-brand' 
                                  : 'bg-brand/30 group-hover:bg-brand/60'
                              }`}
                            />

                            <div className="flex items-start justify-between gap-4">
                              {/* 左侧：时间和描述 */}
                              <div className="flex-1 min-w-0">
                                <div className={`text-body font-medium ${isFirst ? 'text-brand' : 'text-gray-8'}`}>
                                  {formatTime(record.time)}
                                </div>
                                
                                {/* 描述 */}
                                <div className="text-body text-gray-7 mt-0.5">
                                  {getRecordDescription(record)}
                                </div>
                                
                                {/* 恢复按钮 - 仅 editor 模式且非最新，且只有保存（draft）才可以恢复 */}
                                {mode === 'editor' && !isFirst && onRestore && record.status === 'draft' && (
                                  <div className="flex items-center gap-2 mt-2">
                                    <button
                                      onClick={() => handleRestore(record)}
                                      className="flex items-center gap-1 text-caption text-brand hover:text-brand-hover"
                                    >
                                      <RotateCcw className="w-3.5 h-3.5" />
                                      <span>恢复此版本</span>
                                    </button>
                                  </div>
                                )}
                                
                              </div>

                              {/* 右侧：操作人 + 标签 */}
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <span className="text-caption text-gray-5">
                                  {record.operator}
                                </span>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${config.className}`}>
                                  {config.text}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 底部 */}
        <div className="px-lg py-md border-t border-gray-4 bg-gray-2 flex items-center justify-between">
          <span className="text-caption text-gray-6">
            共 {filteredRecords.length} 条记录
            {filteredRecords.length !== records.length && ` / 原 ${records.length} 条`}
          </span>
          <Button onClick={onClose}>关闭</Button>
        </div>
      </div>
    </div>
  );
};

export default UnifiedHistoryModal;
