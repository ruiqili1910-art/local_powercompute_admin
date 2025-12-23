import { CheckSquare } from 'lucide-react';
import Input from './Input';
import { COMPANY_FIELD_LABELS } from '../../constants/initialData';

/**
 * 数据展示选择器 - 通用组件
 * 支持两种模式：引用全局档案 / 自定义输入
 */
const StatsSelector = ({ 
  statsMode = 'global',
  selectedGlobalKeys = [],
  customStats = [{ value: '', label: '' }, { value: '', label: '' }, { value: '', label: '' }, { value: '', label: '' }],
  companyInfo = {},
  onModeChange,
  onGlobalKeysChange,
  onCustomStatsChange,
  maxItems = 4
}) => {
  // 切换选中的全局字段
  const toggleGlobalKey = (key) => {
    if (selectedGlobalKeys.includes(key)) {
      onGlobalKeysChange(selectedGlobalKeys.filter(k => k !== key));
    } else {
      if (selectedGlobalKeys.length >= maxItems) {
        alert(`最多只能选择 ${maxItems} 个展示数据`);
        return;
      }
      onGlobalKeysChange([...selectedGlobalKeys, key]);
    }
  };

  // 更新自定义数据
  const updateCustomStat = (index, field, value) => {
    const newStats = [...customStats];
    newStats[index] = { ...newStats[index], [field]: value };
    onCustomStatsChange(newStats);
  };

  return (
    <div className="space-y-md">
      <h3 className="text-section font-semibold text-gray-8">数据展示</h3>
      
      {/* 数据来源切换 */}
      <div className="flex items-center justify-between">
        <span className="text-body text-gray-7">请选择数据来源：</span>
        <div className="flex bg-gray-3 p-1 rounded-sm">
          <button 
            onClick={() => onModeChange('global')} 
            className={`px-md py-xs rounded-xs text-body transition-all ${
              statsMode === 'global' 
                ? 'bg-brand text-white shadow-light' 
                : 'text-gray-7 hover:bg-gray-2'
            }`}
          >
            引用全局档案
          </button>
          <button 
            onClick={() => onModeChange('custom')} 
            className={`px-md py-xs rounded-xs text-body transition-all ${
              statsMode === 'custom' 
                ? 'bg-brand text-white shadow-light' 
                : 'text-gray-7 hover:bg-gray-2'
            }`}
          >
            自定义输入
          </button>
        </div>
      </div>
      
      {/* 全局档案选择 */}
      {statsMode === 'global' ? (
        <div className="grid grid-cols-2 gap-md">
          {Object.keys(companyInfo).map(key => {
            const isSelected = selectedGlobalKeys.includes(key);
            return (
              <div 
                key={key} 
                onClick={() => toggleGlobalKey(key)} 
                className={`flex items-center gap-md p-md rounded-md cursor-pointer transition-all ${
                  isSelected 
                    ? 'bg-brand-light' 
                    : 'bg-gray-2 hover:bg-gray-3'
                }`}
              >
                <div className={`w-5 h-5 rounded-xs flex items-center justify-center transition-all flex-shrink-0 ${
                  isSelected 
                    ? 'bg-brand' 
                    : 'bg-gray-4'
                }`}>
                  {isSelected && <CheckSquare className="w-3.5 h-3.5 text-white"/>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-caption text-gray-6 mb-xxs font-medium">{COMPANY_FIELD_LABELS[key]}</div>
                  <div className="text-section font-bold text-gray-8">{companyInfo[key]}</div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* 自定义输入 */
        <div className="space-y-md">
          {customStats.map((stat, idx) => (
            <div key={idx} className="flex gap-md items-center">
              <div className="w-7 h-7 rounded-full bg-gray-3 flex items-center justify-center text-caption font-bold text-gray-6 flex-shrink-0">
                {idx + 1}
              </div>
              <Input 
                value={stat.value} 
                onChange={e => updateCustomStat(idx, 'value', e.target.value)} 
                className="flex-1" 
                placeholder="数值"
              />
              <Input 
                value={stat.label} 
                onChange={e => updateCustomStat(idx, 'label', e.target.value)} 
                className="flex-1" 
                placeholder="标签（如：成立时间）"
              />
            </div>
          ))}
          <p className="text-caption text-gray-6">
            提示：最多可配置 {maxItems} 条展示数据，留空则不显示
          </p>
        </div>
      )}
    </div>
  );
};

export default StatsSelector;




