import { useState, useMemo } from 'react';
import { X, Search, ChevronDown, ChevronRight, RotateCcw, Calendar, Filter } from 'lucide-react';
import Button from './Button';

/**
 * 历史记录弹窗组件
 * 
 * 特性：
 * - 按月份分组，可折叠展开
 * - 搜索修改描述
 * - 时间范围快速筛选
 * - 状态筛选（发布上线 / 保存配置）
 * - 支持恢复历史版本
 * 
 * 状态颜色与悬浮栏保持一致：
 * - 🟢 发布上线 = 绿色 (success)
 * - 🔵 保存配置 = 蓝色 (brand)
 * 
 * @param {boolean} isOpen - 是否显示弹窗
 * @param {function} onClose - 关闭回调
 * @param {string} pageTitle - 页面标题，用于显示
 * @param {Array} historyData - 历史记录数据
 * @param {function} onRestore - 恢复版本回调
 */

// 模拟历史数据（实际使用时从 props 传入）
// 业务流程说明：
// 1. 用户编辑内容后点击"保存配置" → 生成 draft 记录
// 2. 用户点击"发布上线" → 生成 published 记录（同一人、同一描述）
// 3. 如果只有 draft 没有 published，说明保存后还未发布
const MOCK_HISTORY_DATA = [
  // === 最新一次修改：admin 更新了主标题和Banner图片 ===
  { id: 'h1', time: '2024-03-20 14:30', description: '更新了主标题和Banner图片', operator: 'admin', status: 'published' },
  { id: 'h2', time: '2024-03-20 14:25', description: '更新了主标题和Banner图片', operator: 'admin', status: 'draft' },
  
  // === 第二次修改：admin 调整了页面布局和间距 ===
  { id: 'h3', time: '2024-03-10 09:00', description: '调整了页面布局和间距', operator: 'admin', status: 'published' },
  { id: 'h4', time: '2024-03-10 08:45', description: '调整了页面布局和间距', operator: 'admin', status: 'draft' },
  
  // === 第三次修改：admin 更新了公司简介正文内容 ===
  { id: 'h5', time: '2024-02-28 16:45', description: '更新了公司简介正文内容', operator: 'admin', status: 'published' },
  { id: 'h6', time: '2024-02-28 16:30', description: '更新了公司简介正文内容', operator: 'admin', status: 'draft' },
  
  // === 第四次修改：admin 添加了核心数据展示模块 ===
  { id: 'h7', time: '2024-02-15 14:00', description: '添加了核心数据展示模块', operator: 'admin', status: 'published' },
  { id: 'h8', time: '2024-02-15 13:50', description: '添加了核心数据展示模块', operator: 'admin', status: 'draft' },
  
  // === 第五次修改：admin 优化了移动端显示效果 ===
  { id: 'h9', time: '2024-01-30 10:00', description: '优化了移动端显示效果', operator: 'admin', status: 'published' },
  { id: 'h10', time: '2024-01-30 09:45', description: '优化了移动端显示效果', operator: 'admin', status: 'draft' },
  
  // === 首次创建并发布 ===
  { id: 'h11', time: '2024-01-20 09:00', description: '首次发布页面', operator: 'admin', status: 'published' },
  { id: 'h12', time: '2024-01-20 08:30', description: '初始版本创建', operator: 'admin', status: 'draft' },
];

// 时间筛选选项
const TIME_FILTER_OPTIONS = [
  { id: 'all', label: '全部时间' },
  { id: '7days', label: '最近7天' },
  { id: '30days', label: '最近30天' },
  { id: '90days', label: '最近3个月' },
];

// 状态筛选选项
const STATUS_FILTER_OPTIONS = [
  { id: 'all', label: '全部状态' },
  { id: 'published', label: '发布上线' },
  { id: 'draft', label: '保存配置' },
];

const HistoryModal = ({ 
  isOpen, 
  onClose, 
  pageTitle = '页面',
  historyData = MOCK_HISTORY_DATA,
  onRestore,
}) => {
  // 筛选状态
  const [searchText, setSearchText] = useState('');
  const [timeFilter, setTimeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // 折叠状态：记录哪些月份是展开的
  const [expandedMonths, setExpandedMonths] = useState(new Set());

  // 筛选历史记录
  const filteredHistory = useMemo(() => {
    let result = [...historyData];

    // 搜索过滤
    if (searchText) {
      const lowerSearch = searchText.toLowerCase();
      result = result.filter(item => 
        item.description.toLowerCase().includes(lowerSearch) ||
        item.operator.toLowerCase().includes(lowerSearch)
      );
    }

    // 时间过滤
    if (timeFilter !== 'all') {
      const now = new Date();
      const days = timeFilter === '7days' ? 7 : timeFilter === '30days' ? 30 : 90;
      const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      result = result.filter(item => new Date(item.time) >= cutoff);
    }

    // 状态过滤
    if (statusFilter !== 'all') {
      result = result.filter(item => item.status === statusFilter);
    }

    return result;
  }, [historyData, searchText, timeFilter, statusFilter]);

  // 按月份分组
  const groupedHistory = useMemo(() => {
    const groups = {};
    
    filteredHistory.forEach(item => {
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

    // 按时间倒序排列月份
    return Object.values(groups).sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });
  }, [filteredHistory]);

  // 初始化时展开最近的月份
  useMemo(() => {
    if (groupedHistory.length > 0 && expandedMonths.size === 0) {
      setExpandedMonths(new Set([groupedHistory[0].key]));
    }
  }, [groupedHistory]);

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
    if (expandedMonths.size === groupedHistory.length) {
      setExpandedMonths(new Set());
    } else {
      setExpandedMonths(new Set(groupedHistory.map(g => g.key)));
    }
  };

  // 格式化时间显示
  const formatTime = (timeStr) => {
    const date = new Date(timeStr);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${month}-${day} ${hours}:${minutes}`;
  };

  // 状态标签 - 与悬浮栏状态颜色保持一致
  // 🟢 发布上线 = 绿色 (success)
  // 🔵 保存配置 = 蓝色 (brand) - 对应悬浮栏的"待发布"状态
  const StatusTag = ({ status }) => {
    const config = {
      published: { text: '发布上线', className: 'bg-success/10 text-success border-success/20' },
      draft: { text: '保存配置', className: 'bg-brand/10 text-brand border-brand/20' },
    };
    const { text, className } = config[status] || config.draft;
    
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${className}`}>
        {text}
      </span>
    );
  };

  // 处理恢复版本
  const handleRestore = (record) => {
    if (onRestore) {
      onRestore(record);
    } else {
      alert(`确定要恢复到 ${record.time} 的版本吗？`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-xs sm:p-md">
      {/* 遮罩层 */}
      <div className="absolute inset-0 bg-gray-8/40 backdrop-blur-sm" onClick={onClose} />
      
      {/* 弹窗内容 */}
      <div className="relative bg-white rounded-xl shadow-strong w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[85vh] border border-gray-4">
        {/* 头部 */}
        <div className="px-lg py-md border-b border-gray-4 flex justify-between items-center bg-white sticky top-0 z-10">
          <h3 className="text-section text-text-primary">修改历史记录</h3>
          <button 
            onClick={onClose} 
            className="p-xs rounded-md hover:bg-gray-3 text-text-secondary hover:text-text-primary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 筛选栏 */}
        <div className="px-lg py-sm border-b border-gray-4 bg-gray-2 space-y-sm">
          {/* 搜索框 */}
          <div className="flex items-center gap-sm">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-6" />
              <input
                type="text"
                placeholder="搜索修改描述或操作人..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-body bg-white border border-gray-4 rounded-md focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-xs px-3 py-2 rounded-md border transition-colors ${
                showFilters || timeFilter !== 'all' || statusFilter !== 'all'
                  ? 'bg-brand-light border-brand text-brand'
                  : 'bg-white border-gray-4 text-gray-7 hover:border-gray-5'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="text-body">筛选</span>
            </button>
          </div>

          {/* 展开的筛选选项 */}
          {showFilters && (
            <div className="flex flex-wrap items-center gap-sm pt-xs">
              {/* 时间筛选 */}
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

              {/* 状态筛选 */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2 py-1.5 text-caption bg-white border border-gray-4 rounded-md focus:outline-none focus:border-brand cursor-pointer"
              >
                {STATUS_FILTER_OPTIONS.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>

              {/* 清除筛选 */}
              {(timeFilter !== 'all' || statusFilter !== 'all') && (
                <button
                  onClick={() => { setTimeFilter('all'); setStatusFilter('all'); }}
                  className="text-caption text-brand hover:text-brand-hover"
                >
                  清除筛选
                </button>
              )}
            </div>
          )}
        </div>

        {/* 历史记录列表 */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {groupedHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-6">
              <Search className="w-12 h-12 mb-4 opacity-30" />
              <p className="text-body">没有找到匹配的历史记录</p>
            </div>
          ) : (
            <div className="px-lg py-sm">
              {/* 展开/折叠全部 */}
              {groupedHistory.length > 1 && (
                <div className="flex justify-end mb-sm">
                  <button
                    onClick={toggleAll}
                    className="text-caption text-gray-6 hover:text-brand transition-colors"
                  >
                    {expandedMonths.size === groupedHistory.length ? '全部折叠' : '全部展开'}
                  </button>
                </div>
              )}

              {/* 分组列表 */}
              {groupedHistory.map((group, groupIndex) => (
                <div key={group.key} className="mb-md">
                  {/* 月份标题 */}
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
                    <span className="text-caption text-gray-6">（{group.items.length}条记录）</span>
                  </button>

                  {/* 该月的记录 */}
                  {expandedMonths.has(group.key) && (
                    <div className="ml-2 border-l-2 border-gray-4 pl-4 mt-sm space-y-1">
                      {group.items.map((record, index) => {
                        const isFirst = groupIndex === 0 && index === 0;
                        
                        return (
                          <div 
                            key={record.id}
                            className="relative py-3 group"
                          >
                            {/* 时间轴圆点 */}
                            <div 
                              className={`absolute -left-[21px] top-4 w-3 h-3 rounded-full border-2 ${
                                isFirst 
                                  ? 'bg-brand border-brand' 
                                  : 'bg-white border-gray-4 group-hover:border-brand'
                              } transition-colors`}
                            />

                            {/* 内容区域 */}
                            <div className="flex items-start justify-between gap-4">
                              {/* 左侧：时间和描述 */}
                              <div className="flex-1 min-w-0">
                                <div className={`text-body font-medium ${isFirst ? 'text-brand' : 'text-gray-8'}`}>
                                  {formatTime(record.time)}
                                </div>
                                <div className="text-body text-gray-7 mt-0.5 line-clamp-2">
                                  {record.description}
                                </div>
                                
                                {/* 操作按钮 - 非最新版本显示恢复按钮 */}
                                {!isFirst && (
                                  <div className="flex items-center gap-2 mt-2">
                                    <button
                                      onClick={() => handleRestore(record)}
                                      className="flex items-center gap-1 text-caption text-brand hover:text-brand-hover transition-colors"
                                    >
                                      <RotateCcw className="w-3.5 h-3.5" />
                                      <span>恢复此版本</span>
                                    </button>
                                  </div>
                                )}
                              </div>

                              {/* 右侧：操作人和状态 */}
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <span className="text-caption text-gray-6 hidden sm:inline">
                                  {record.operator}
                                </span>
                                <StatusTag status={record.status} />
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
            共 {filteredHistory.length} 条记录
            {filteredHistory.length !== historyData.length && (
              <span className="ml-1">（已筛选，原 {historyData.length} 条）</span>
            )}
          </span>
          <Button onClick={onClose}>关闭</Button>
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;

