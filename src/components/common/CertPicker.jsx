import { useState } from 'react';
import { CheckCircle2, Award, Medal } from 'lucide-react';
import { SearchFilterBar } from '../ui';

/**
 * 资质/荣誉选择器 - 适配新的资质库数据格式
 * certLib 格式: { certStats, certDetails, honorStats, honorDetails }
 * 
 * @param {string} title - 标题
 * @param {string} category - 类别 'qualification' | 'cert' | 'honor'
 * @param {array} selected - 已选择的ID数组
 * @param {function} onSelect - 选择回调
 * @param {object} certLib - 资质库数据
 * @param {boolean} showAsCards - 是否以图片卡片形式展示（默认false，文字列表）
 */
const CertPicker = ({ title, category, selected = [], onSelect, certLib = {}, showAsCards = false }) => {
  // 搜索、筛选、排序状态
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterIssuer, setFilterIssuer] = useState('all');
  
  // 根据类别获取对应的数据
  const getItems = () => {
    if (category === 'qualification' || category === 'cert') {
      // 资质：优先使用细节，如果没有则使用统计数据
      if (certLib.certDetails && certLib.certDetails.length > 0) {
        return certLib.certDetails.map(d => ({
          id: d.id,
          title: d.title,
          description: d.description,
          image: d.image,
          issuer: d.issuer,
          issueDate: d.issueDate,
          expireDate: d.expireDate,
          type: d.type
        }));
      }
      if (certLib.certStats && certLib.certStats.length > 0) {
        return certLib.certStats.map(s => ({
          id: s.id,
          title: s.label,
          value: s.value,
          unit: s.unit
        }));
      }
      // 兼容旧格式
      if (certLib.categories) {
        return certLib.categories.map(c => ({
          id: c.id,
          title: c.title,
          count: c.count
        }));
      }
    } else if (category === 'honor') {
      // 荣誉：优先使用细节，如果没有则使用统计数据
      if (certLib.honorDetails && certLib.honorDetails.length > 0) {
        return certLib.honorDetails.map(d => ({
          id: d.id,
          title: d.title,
          description: d.description,
          image: d.image,
          issuer: d.issuer,
          issueDate: d.issueDate,
          type: d.type
        }));
      }
      if (certLib.honorStats && certLib.honorStats.length > 0) {
        return certLib.honorStats.map(s => ({
          id: s.id,
          title: s.label,
          value: s.value,
          unit: s.unit
        }));
      }
      // 兼容旧格式
      if (certLib.honors) {
        return certLib.honors.map(h => ({
          id: h.id,
          title: h.label,
          value: h.value,
          unit: h.unit
        }));
      }
    }
    
    // 兼容旧的数组格式
    if (Array.isArray(certLib)) {
      return certLib.filter(c => c.category === category);
    }
    
    return [];
  };

  const allItems = getItems();
  
  // 获取所有颁发机构列表（用于筛选）
  const getAllIssuers = () => {
    const issuers = [...new Set(allItems.map(item => item.issuer).filter(Boolean))];
    return issuers;
  };
  
  // 筛选和排序
  const getFilteredAndSortedItems = () => {
    let items = [...allItems];
    
    // 搜索筛选
    if (searchText) {
      items = items.filter(item => 
        item.title.toLowerCase().includes(searchText.toLowerCase()) ||
        (item.issuer && item.issuer.toLowerCase().includes(searchText.toLowerCase())) ||
        (item.description && item.description.toLowerCase().includes(searchText.toLowerCase()))
      );
    }
    
    // 颁发机构筛选
    if (filterIssuer !== 'all') {
      items = items.filter(item => item.issuer === filterIssuer);
    }
    
    // 排序
    items.sort((a, b) => {
      let aVal, bVal;
      switch (sortBy) {
        case 'title':
          aVal = a.title || '';
          bVal = b.title || '';
          break;
        case 'issueDate':
          aVal = a.issueDate || '';
          bVal = b.issueDate || '';
          break;
        case 'issuer':
          aVal = a.issuer || '';
          bVal = b.issuer || '';
          break;
        default:
          aVal = a.title || '';
          bVal = b.title || '';
      }
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      }
      return aVal < bVal ? 1 : -1;
    });
    
    return items;
  };

  const items = getFilteredAndSortedItems();
  const Icon = (category === 'qualification' || category === 'cert') ? Award : Medal;
  const categoryLabel = (category === 'qualification' || category === 'cert') ? '资质' : '荣誉';

  // 图片卡片展示模式
  if (showAsCards) {
    return (
      <div>
        <h3 className="font-semibold text-gray-8 text-body flex items-center gap-xs mb-xs">
          <Icon className="w-4 h-4 text-brand" />
          {title}
        </h3>
        
        {/* 搜索筛选栏 */}
        <div className="mb-md">
          <SearchFilterBar
            searchText={searchText}
            onSearchChange={setSearchText}
            searchPlaceholder={`搜索${categoryLabel}名称、颁发机构...`}
            sortOptions={[
              { id: 'title', label: '名称' },
              { id: 'issueDate', label: '颁发日期' },
              { id: 'issuer', label: '颁发机构' }
            ]}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={(field, order) => {
              setSortBy(field);
              setSortOrder(order);
            }}
            filterFields={[
              {
                id: 'issuer',
                label: '颁发机构',
                type: 'select',
                value: filterIssuer,
                options: [
                  { value: 'all', label: '全部机构' },
                  ...getAllIssuers().map(issuer => ({ value: issuer, label: issuer }))
                ]
              }
            ]}
            onFilterChange={(fieldId, value) => {
              if (fieldId === 'issuer') setFilterIssuer(value);
            }}
            onFilterReset={() => {
              setFilterIssuer('all');
              setSearchText('');
            }}
          />
        </div>
        
        {/* 图片卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
          {items.length === 0 ? (
            <div className="col-span-full text-center py-lg text-gray-6 text-caption">
              暂无{categoryLabel}数据
            </div>
          ) : (
            items.map(item => {
              const isSelected = selected.includes(item.id);
              return (
                <div 
                  key={item.id} 
                  onClick={() => onSelect(isSelected ? selected.filter(id => id !== item.id) : [...selected, item.id])} 
                  className={`bg-gray-2 rounded-xl overflow-hidden cursor-pointer transition-all ${
                    isSelected 
                      ? 'ring-2 ring-brand shadow-md' 
                      : 'hover:shadow-md'
                  }`}
                >
                  {/* 图片区域 */}
                  <div className="p-md pb-0">
                    <div className="aspect-[4/3] bg-yellow-50 rounded-lg flex items-center justify-center relative overflow-hidden">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-full h-full object-contain p-2"
                        />
                      ) : (
                        <Icon className="w-16 h-16 text-yellow-200" />
                      )}
                      
                      {/* 选中标记 - 右上角 */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-brand rounded-full flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* 信息区域 */}
                  <div className="p-md pt-sm">
                    <div className="flex items-start justify-between gap-sm mb-sm">
                      <h4 className="text-body font-bold text-gray-8 line-clamp-1">{item.title}</h4>
                      {item.type && (
                        <span className="px-sm py-xxs text-caption text-brand border border-brand rounded-full flex-shrink-0">
                          {item.type}
                        </span>
                      )}
                    </div>
                    <div className="space-y-xxs text-caption text-gray-6">
                      {item.issuer && (
                        <div>颁发机构：{item.issuer}</div>
                      )}
                      {item.issueDate && (
                        <div>获得日期：{item.issueDate}</div>
                      )}
                      {category === 'qualification' && item.expireDate && (
                        <div>过期时间：{item.expireDate}</div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  }

  // 文字列表展示模式（原有逻辑）
  return (
    <div className="bg-white p-lg rounded-lg border border-gray-4">
      <h3 className="font-semibold text-gray-8 mb-md text-body flex items-center gap-xs">
        <Icon className="w-4 h-4 text-brand" />
        {title}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-sm max-h-60 overflow-y-auto pr-2">
        {items.length === 0 ? (
          <div className="col-span-full text-center py-lg text-gray-6 text-caption">
            暂无{categoryLabel}数据
          </div>
        ) : (
          items.map(item => {
            const isSelected = selected.includes(item.id);
            return (
              <div 
                key={item.id} 
                onClick={() => onSelect(isSelected ? selected.filter(id => id !== item.id) : [...selected, item.id])} 
                className={`p-sm border rounded-md cursor-pointer flex gap-sm items-center transition-all ${
                  isSelected 
                    ? 'bg-brand-light border-brand shadow-sm' 
                    : 'border-gray-4 hover:border-brand hover:bg-gray-2'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${
                  isSelected 
                    ? 'bg-brand border-brand' 
                    : 'border-gray-5 bg-white'
                }`}>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white"/>}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-caption font-medium text-gray-8 truncate">{item.title}</div>
                  {item.value && (
                    <div className="text-caption text-brand font-bold">{item.value}{item.unit}</div>
                  )}
                  {item.count && (
                    <div className="text-caption text-brand font-bold">{item.count} {item.count > 10 ? '项' : '个'}</div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CertPicker;
