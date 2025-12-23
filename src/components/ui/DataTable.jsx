import { useState, useRef, useCallback } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * 通用数据表格组件
 * 用于内容管理页面（文章管理、工程承包明细、项目总览等）
 * 
 * @param {array} columns - 列配置 [{ key, title, width, sortable, render }]
 * @param {array} data - 数据源
 * @param {string} sortBy - 当前排序字段
 * @param {string} sortOrder - 当前排序方向 'asc' | 'desc'
 * @param {function} onSortChange - 排序变化回调 (sortBy, sortOrder)
 * @param {number} currentPage - 当前页码
 * @param {number} pageSize - 每页数量
 * @param {number} total - 总数量
 * @param {function} onPageChange - 页码变化回调
 * @param {string} emptyText - 空数据提示文字
 * @param {number} minWidth - 表格最小宽度
 */
const DataTable = ({
  columns = [],
  data = [],
  sortBy = '',
  sortOrder = 'desc',
  onSortChange,
  currentPage = 1,
  pageSize = 10,
  total = 0,
  onPageChange,
  emptyText = '暂无数据',
  minWidth = 800
}) => {
  // 列宽状态
  const [columnWidths, setColumnWidths] = useState(() => {
    const widths = {};
    columns.forEach(col => {
      widths[col.key] = col.width || 120;
    });
    return widths;
  });
  
  const tableRef = useRef(null);
  const resizingCol = useRef(null);
  const startX = useRef(0);
  const startWidth = useRef(0);

  // 开始拖动列宽
  const handleMouseDown = useCallback((e, colKey) => {
    e.preventDefault();
    e.stopPropagation();
    resizingCol.current = colKey;
    startX.current = e.clientX;
    startWidth.current = columnWidths[colKey];
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [columnWidths]);

  // 拖动中
  const handleMouseMove = useCallback((e) => {
    if (!resizingCol.current) return;
    
    const diff = e.clientX - startX.current;
    const newWidth = Math.max(60, startWidth.current + diff);
    
    setColumnWidths(prev => ({
      ...prev,
      [resizingCol.current]: newWidth
    }));
  }, []);

  // 结束拖动
  const handleMouseUp = useCallback(() => {
    resizingCol.current = null;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);

  // 排序点击
  const handleSort = (field) => {
    if (!onSortChange) return;
    if (sortBy === field) {
      onSortChange(field, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      onSortChange(field, 'desc');
    }
  };

  // 排序图标
  const SortIcon = ({ field }) => {
    if (sortBy !== field) return <ArrowUpDown className="w-3.5 h-3.5 text-gray-5" />;
    return sortOrder === 'asc' 
      ? <ArrowUp className="w-3.5 h-3.5 text-brand" /> 
      : <ArrowDown className="w-3.5 h-3.5 text-brand" />;
  };

  // 分页计算
  const totalPages = Math.ceil(total / pageSize);

  return (
    <>
      {/* 表格 */}
      <div className="overflow-x-auto bg-white" ref={tableRef}>
        <table className="w-full bg-white" style={{ tableLayout: 'fixed', minWidth: `${minWidth}px` }}>
          <thead>
            <tr className="border-b border-gray-4 bg-white">
              {columns.map((col, index) => (
                <th 
                  key={col.key}
                  className={`px-sm py-sm text-left text-caption font-medium text-gray-7 relative select-none ${
                    index === 0 ? 'pl-lg' : ''
                  } ${index === columns.length - 1 ? 'pr-lg' : ''} ${
                    col.sortable ? 'cursor-pointer hover:text-gray-8' : ''
                  }`}
                  style={{ width: columnWidths[col.key], minWidth: 60 }}
                  onClick={col.sortable ? () => handleSort(col.key) : undefined}
                >
                  <div className="flex items-center gap-xxs">
                    {col.title}
                    {col.sortable && <SortIcon field={col.key} />}
                  </div>
                  <div 
                    className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-brand/50 active:bg-brand hidden sm:block"
                    onMouseDown={(e) => handleMouseDown(e, col.key)}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {data.map((row, rowIndex) => (
              <tr 
                key={row.id || rowIndex} 
                className="border-b border-gray-4 hover:bg-gray-2 transition-colors bg-white"
              >
                {columns.map((col, colIndex) => (
                  <td 
                    key={col.key}
                    className={`px-sm py-sm ${colIndex === 0 ? 'pl-lg' : ''} ${colIndex === columns.length - 1 ? 'pr-lg' : ''}`}
                    style={{ width: columnWidths[col.key] }}
                  >
                    {col.render ? col.render(row[col.key], row, rowIndex) : (
                      <span className="text-body text-gray-7">{row[col.key]}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-lg py-xxl text-center text-caption text-gray-6">
                  {emptyText}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 分页 */}
      {total > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between px-lg py-md border-t border-gray-4 gap-xs sm:gap-0">
          <div className="text-caption text-gray-6">共 {total} 条数据</div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onPageChange && onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 sm:px-4 py-1.5 text-caption font-medium text-gray-8 border border-gray-4 rounded-sm hover:bg-gray-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              上一页
            </button>
            {totalPages > 0 && Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let page;
              if (totalPages <= 5) {
                page = i + 1;
              } else if (currentPage <= 3) {
                page = i + 1;
              } else if (currentPage >= totalPages - 2) {
                page = totalPages - 4 + i;
              } else {
                page = currentPage - 2 + i;
              }
              return (
                <button 
                  key={page}
                  onClick={() => onPageChange && onPageChange(page)}
                  className={`w-8 h-8 rounded-sm text-body font-medium transition-colors ${
                    currentPage === page ? 'bg-brand text-white' : 'text-gray-7 hover:bg-gray-2'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            <button 
              onClick={() => onPageChange && onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 sm:px-4 py-1.5 text-caption font-medium text-gray-8 border border-gray-4 rounded-sm hover:bg-gray-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              下一页
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default DataTable;




