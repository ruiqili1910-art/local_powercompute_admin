import { useState } from 'react';
import { Plus, Trash2, Edit, Check } from 'lucide-react';
import Button from './Button';
import Modal from './Modal';
import FormItem from './FormItem';
import Input from './Input';

/**
 * 统一的数据展示组件
 * 用于所有页面中的核心数据展示，支持引用全局档案或自定义
 */
const StatsDisplay = ({ 
  stats = [], 
  onChange,
  statsMode = 'custom',
  onModeChange,
  selectedGlobalKeys = [],
  onGlobalKeysChange,
  companyInfo = {},
  title = '核心数据展示',
  maxItems = 6,
  showModeSwitch = true,
  cols = 3  // 列数
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [statForm, setStatForm] = useState({ value: '', unit: '', label: '', description: '' });

  // 全局档案数据选项
  const globalStatsOptions = companyInfo ? [
    { key: 'founded', label: '成立时间', value: companyInfo.founded || companyInfo.foundingDate, unit: '年' },
    { key: 'employees', label: '员工人数', value: companyInfo.employees || companyInfo.globalStaff, unit: '' },
    { key: 'projects', label: '建成项目', value: companyInfo.projects || companyInfo.completedProjects, unit: '' },
    { key: 'countries', label: '国家和地区', value: companyInfo.countries, unit: '' },
    { key: 'patents', label: '发明专利', value: companyInfo.patents, unit: '' },
    { key: 'areaSize', label: '占地面积', value: companyInfo.areaSize, unit: '㎡' },
  ].filter(opt => opt.value) : [];

  // 添加数据
  const handleAdd = () => {
    if (stats.length >= maxItems) return alert(`最多添加 ${maxItems} 条数据`);
    setEditingIndex(null);
    setStatForm({ value: '', unit: '', label: '', description: '' });
    setIsModalOpen(true);
  };

  // 编辑数据
  const handleEdit = (stat, index) => {
    setEditingIndex(index);
    setStatForm({ ...stat });
    setIsModalOpen(true);
  };

  // 保存数据
  const handleSave = () => {
    if (!statForm.value || !statForm.label) return alert('请填写数值和标签');
    const newStats = editingIndex !== null
      ? stats.map((s, i) => i === editingIndex ? { ...s, ...statForm, id: s.id } : s)
      : [...stats, { id: `stat_${Date.now()}`, ...statForm }];
    onChange && onChange(newStats);
    setIsModalOpen(false);
  };

  // 删除数据
  const handleDelete = (index) => {
    if (confirm('确定删除？')) {
      onChange && onChange(stats.filter((_, i) => i !== index));
    }
  };

  // 切换全局档案选择
  const toggleGlobalKey = (key) => {
    const currentKeys = selectedGlobalKeys || [];
    const newKeys = currentKeys.includes(key)
      ? currentKeys.filter(k => k !== key)
      : currentKeys.length < maxItems ? [...currentKeys, key] : currentKeys;
    onGlobalKeysChange && onGlobalKeysChange(newKeys);
  };

  const colsClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  }[cols] || 'grid-cols-3';

  return (
    <>
      <div className="space-y-md">
        <div className="flex items-center justify-between">
          <h3 className="text-body font-semibold text-gray-8">{title}</h3>
          {showModeSwitch && (
            <div className="flex gap-sm">
              {[{ v: 'global', l: '引用全局档案' }, { v: 'custom', l: '自定义' }].map(opt => (
                <button 
                  key={opt.v}
                  onClick={() => onModeChange && onModeChange(opt.v)}
                  className={`px-md py-xs rounded-sm text-body ${
                    statsMode === opt.v ? 'bg-brand-light text-brand' : 'text-gray-6 hover:bg-gray-2'
                  }`}
                >
                  {opt.l}
                </button>
              ))}
            </div>
          )}
        </div>

        {statsMode === 'global' && showModeSwitch ? (
          <div className={`grid ${colsClass} gap-sm`}>
            {globalStatsOptions.map(opt => {
              const isSelected = selectedGlobalKeys?.includes(opt.key);
              return (
                <div 
                  key={opt.key}
                  onClick={() => toggleGlobalKey(opt.key)}
                  className={`flex items-center gap-md p-md rounded-lg border cursor-pointer transition-all ${
                    isSelected ? 'border-brand bg-brand-light' : 'border-gray-4 hover:border-brand'
                  }`}
                >
                  <div className="flex-1 text-center">
                    <div className="text-section font-bold text-brand">
                      {opt.value}<span className="text-body font-normal">{opt.unit}</span>
                    </div>
                    <div className="text-caption text-gray-6">{opt.label}</div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    isSelected ? 'border-brand bg-brand' : 'border-gray-4'
                  }`}>
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <>
            <div className={`grid ${colsClass} gap-md`}>
              {stats.map((stat, index) => (
                <div key={stat.id} className="bg-gray-2 rounded-lg p-md text-center group relative">
                  <div className="text-title font-bold text-brand">
                    {stat.value}<span className="text-body font-normal">{stat.unit}</span>
                  </div>
                  <div className="text-body font-medium text-gray-8">{stat.label}</div>
                  {stat.description && <div className="text-caption text-gray-6">{stat.description}</div>}
                  <div className="absolute top-2 right-2 flex gap-xxs opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(stat, index)} className="p-1 text-gray-6 hover:text-brand"><Edit className="w-3 h-3" /></button>
                    <button onClick={() => handleDelete(index)} className="p-1 text-gray-6 hover:text-error"><Trash2 className="w-3 h-3" /></button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <Button variant="secondary" onClick={handleAdd}>
                <Plus className="w-4 h-4" /> 添加数据
              </Button>
            </div>
          </>
        )}
      </div>

      {/* 编辑弹窗 */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingIndex !== null ? '编辑数据' : '添加数据'}
        footer={<><Button variant="secondary" onClick={() => setIsModalOpen(false)}>取消</Button><Button onClick={handleSave}>确认</Button></>}>
        <div className="space-y-md">
          <div className="grid grid-cols-2 gap-sm">
            <FormItem label="数值" required>
              <Input value={statForm.value} onChange={e => setStatForm({...statForm, value: e.target.value})} placeholder="如：1965" />
            </FormItem>
            <FormItem label="单位">
              <Input value={statForm.unit} onChange={e => setStatForm({...statForm, unit: e.target.value})} placeholder="如：年、+、%" />
            </FormItem>
          </div>
          <FormItem label="标签" required>
            <Input value={statForm.label} onChange={e => setStatForm({...statForm, label: e.target.value})} placeholder="如：成立时间" />
          </FormItem>
          <FormItem label="描述">
            <Input value={statForm.description} onChange={e => setStatForm({...statForm, description: e.target.value})} placeholder="如：六十年工程建设经验" />
          </FormItem>
        </div>
      </Modal>
    </>
  );
};

export default StatsDisplay;




