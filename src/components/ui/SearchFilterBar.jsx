import { useState } from 'react';
import { Search, ArrowUpDown, Filter, ChevronDown } from 'lucide-react';

/**
 * 通用搜索筛选组件
 * 用于内容管理页面（文章管理、工程承包明细等）
 * 
 * @param {string} searchText - 搜索文本
 * @param {function} onSearchChange - 搜索文本变化回调
 * @param {string} searchPlaceholder - 搜索框占位符
 * @param {array} sortOptions - 排序选项 [{ id, label }]
 * @param {string} sortBy - 当前排序字段
 * @param {string} sortOrder - 当前排序方向 'asc' | 'desc'
 * @param {function} onSortChange - 排序变化回调 (sortBy, sortOrder)
 * @param {array} filterFields - 筛选字段配置 [{ id, label, type, options, value }]
 * @param {function} onFilterChange - 筛选变化回调 (fieldId, value)
 * @param {function} onFilterReset - 重置筛选回调
 */
const SearchFilterBar = ({
  searchText = '',
  onSearchChange,
  searchPlaceholder = '搜索标题...',
  sortOptions = [],
  sortBy = '',
  sortOrder = 'desc',
  onSortChange,
  filterFields = [],
  onFilterChange,
  onFilterReset
}) => {
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // 计算已激活的筛选数量
  const getActiveFilterCount = () => {
    return filterFields.filter(f => {
      if (f.type === 'select') return f.value !== 'all' && f.value !== '';
      if (f.type === 'date') return f.value !== '';
      return false;
    }).length;
  };

  return (
    <div className="px-xl py-md border-t border-gray-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
        {/* 搜索框 */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-[18px] sm:h-[18px] text-gray-6" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchText}
            onChange={e => onSearchChange(e.target.value)}
            className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 bg-gray-2 border border-gray-4 rounded-sm text-body text-gray-8 placeholder-gray-6 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
          />
        </div>

        <div className="flex gap-2">
          {/* 排序按钮 */}
          {sortOptions.length > 0 && (
            <div className="relative flex-1 sm:flex-initial">
              <button
                onClick={() => {
                  setShowSortMenu(!showSortMenu);
                  setShowFilterMenu(false);
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-4 rounded-sm text-body text-gray-8 hover:bg-gray-2 transition-colors"
              >
                <ArrowUpDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-6" />
                <span>排序</span>
                <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-6" />
              </button>
              
              {showSortMenu && (
                <div className="absolute right-0 sm:left-0 top-full mt-1 w-48 bg-white border border-gray-4 rounded-sm shadow-strong z-[9999]">
                  <div className="p-2">
                    <div className="text-caption text-gray-6 px-2 py-1 mb-1">排序字段</div>
                    {sortOptions.map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          onSortChange(opt.id, sortOrder);
                          setShowSortMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-body rounded-xs transition-colors ${
                          sortBy === opt.id ? 'bg-brand-light text-brand' : 'text-gray-8 hover:bg-gray-2'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                    <div className="border-t border-gray-4 my-2" />
                    <div className="text-caption text-gray-6 px-2 py-1 mb-1">排序方向</div>
                    <button
                      onClick={() => { onSortChange(sortBy, 'asc'); setShowSortMenu(false); }}
                      className={`w-full text-left px-3 py-2 text-body rounded-xs transition-colors ${sortOrder === 'asc' ? 'bg-brand-light text-brand' : 'text-gray-8 hover:bg-gray-2'}`}
                    >
                      升序
                    </button>
                    <button
                      onClick={() => { onSortChange(sortBy, 'desc'); setShowSortMenu(false); }}
                      className={`w-full text-left px-3 py-2 text-body rounded-xs transition-colors ${sortOrder === 'desc' ? 'bg-brand-light text-brand' : 'text-gray-8 hover:bg-gray-2'}`}
                    >
                      降序
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 筛选按钮 */}
          {filterFields.length > 0 && (
            <div className="relative flex-1 sm:flex-initial">
              <button
                onClick={() => {
                  setShowFilterMenu(!showFilterMenu);
                  setShowSortMenu(false);
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-4 rounded-sm text-body text-gray-8 hover:bg-gray-2 transition-colors"
              >
                <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-6" />
                <span>筛选</span>
                {getActiveFilterCount() > 0 && (
                  <span className="flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 bg-brand text-white text-caption rounded-full">
                    {getActiveFilterCount()}
                  </span>
                )}
                <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-6" />
              </button>
              
              {showFilterMenu && (
                <div className="absolute right-0 top-full mt-1 w-56 sm:w-64 bg-white border border-gray-4 rounded-sm shadow-strong z-[9999]">
                  <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                    {filterFields.map(field => (
                      <div key={field.id}>
                        <label className="block text-caption text-gray-6 mb-1.5 sm:mb-2">{field.label}</label>
                        {field.type === 'select' && (
                          <select
                            value={field.value}
                            onChange={e => onFilterChange(field.id, e.target.value)}
                            className="w-full px-3 py-2 bg-gray-2 border border-gray-4 rounded-sm text-body text-gray-8 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand cursor-pointer"
                          >
                            {field.options.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                        )}
                        {field.type === 'date' && (
                          <input
                            type="date"
                            value={field.value}
                            onChange={e => onFilterChange(field.id, e.target.value)}
                            className="w-full px-3 py-2 bg-gray-2 border border-gray-4 rounded-sm text-body text-gray-8 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                          />
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        onFilterReset();
                        setShowFilterMenu(false);
                      }}
                      className="w-full px-3 py-2 text-body text-gray-6 hover:text-gray-8 hover:bg-gray-2 rounded-sm transition-colors"
                    >
                      重置筛选
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* 点击外部关闭下拉菜单 */}
      {(showSortMenu || showFilterMenu) && (
        <div className="fixed inset-0 z-[9998]" onClick={() => { setShowSortMenu(false); setShowFilterMenu(false); }} />
      )}
    </div>
  );
};

export default SearchFilterBar;




