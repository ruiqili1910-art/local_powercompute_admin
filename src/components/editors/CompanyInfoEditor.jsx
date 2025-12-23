import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Clock } from 'lucide-react';
import { 
  Modal, Button, FormItem, Input, PageBanner, SearchFilterBar,
  ResourceActions, ReferenceIndicator, DeleteConfirmModal, UpdateConfirmModal,
  UnifiedHistoryModal, VersionHistoryModal
} from '../ui';
import { COMPANY_FIELD_LABELS } from '../../constants/initialData';

// 模拟操作日志数据（页面级别）
const MOCK_OPERATION_LOGS = [
  { id: 'log1', time: '2025-12-15 15:30', operator: 'admin', action: 'add', itemType: 'data', itemTitle: '业务覆盖国家/地区' },
  { id: 'log2', time: '2025-12-15 14:20', operator: 'admin', action: 'edit', itemType: 'data', itemTitle: '全球员工' },
  { id: 'log3', time: '2025-12-15 11:45', operator: 'editor_zhang', action: 'edit', itemType: 'data', itemTitle: '建成项目' },
  { id: 'log4', time: '2025-12-14 16:00', operator: 'admin', action: 'add', itemType: 'data', itemTitle: '发明专利' },
  { id: 'log5', time: '2025-12-14 10:30', operator: 'editor_zhang', action: 'edit', itemType: 'data', itemTitle: '成立时间' },
  { id: 'log6', time: '2025-12-13 14:15', operator: 'admin', action: 'delete', itemType: 'data', itemTitle: '占地面积' },
  { id: 'log7', time: '2025-12-12 09:00', operator: 'admin', action: 'add', itemType: 'data', itemTitle: '业务覆盖国家/地区' },
];

// 模拟资源版本历史（内容级别）
const MOCK_ITEM_VERSIONS = {
  // 成立时间
  'foundingDate': [
    { version: 'V2', time: '2025-12-10 14:30', operator: 'admin', changes: '更新了成立时间为1964-10-01' },
    { version: 'V1', time: '2025-10-01 09:00', operator: 'admin', changes: '初始创建' },
  ],
  // 占地面积
  'areaSize': [
    { version: 'V1', time: '2025-10-01 09:00', operator: 'admin', changes: '初始创建' },
  ],
  // 全球员工
  'globalStaff': [
    { version: 'V3', time: '2025-12-15 14:20', operator: 'admin', changes: '更新了数值为2200' },
    { version: 'V2', time: '2025-11-20 10:00', operator: 'editor_zhang', changes: '更新了数值为2100' },
    { version: 'V1', time: '2025-10-01 09:00', operator: 'admin', changes: '初始创建' },
  ],
  // 建成项目
  'completedProjects': [
    { version: 'V2', time: '2025-12-15 11:45', operator: 'editor_zhang', changes: '更新了数值为8000' },
    { version: 'V1', time: '2025-10-01 09:00', operator: 'admin', changes: '初始创建' },
  ],
  // 发明专利
  'patents': [
    { version: 'V2', time: '2025-12-14 16:00', operator: 'admin', changes: '更新了数值为7100' },
    { version: 'V1', time: '2025-10-01 09:00', operator: 'admin', changes: '初始创建' },
  ],
  // 业务覆盖国家/地区
  'countries': [
    { version: 'V2', time: '2025-12-15 15:30', operator: 'admin', changes: '更新了数值为80' },
    { version: 'V1', time: '2025-10-01 09:00', operator: 'admin', changes: '初始创建' },
  ],
};

// 模拟引用关系数据（哪些页面引用了哪些公司档案数据）
const MOCK_REFERENCES = {
  // 成立时间
  'foundingDate': [
    { page: '首页 - 关于我们', path: '/home/about' },
    { page: '关于我们 - 公司简介', path: '/about/intro' },
  ],
  // 占地面积
  'areaSize': [
    { page: '关于我们 - 公司简介', path: '/about/intro' },
  ],
  // 全球员工
  'globalStaff': [
    { page: '首页 - 关于我们', path: '/home/about' },
    { page: '关于我们 - 公司简介', path: '/about/intro' },
    { page: '业务领域 - Banner设置', path: '/business/banner' },
  ],
  // 建成项目
  'completedProjects': [
    { page: '首页 - 关于我们', path: '/home/about' },
    { page: '关于我们 - 公司简介', path: '/about/intro' },
    { page: '业务领域 - Banner设置', path: '/business/banner' },
  ],
  // 发明专利
  'patents': [
    { page: '首页 - 关于我们', path: '/home/about' },
    { page: '可持续发展 - 科技创新', path: '/sustain/tech' },
  ],
  // 业务覆盖国家/地区
  'countries': [
    { page: '首页 - 关于我们', path: '/home/about' },
    { page: '关于我们 - 公司简介', path: '/about/intro' },
    { page: '可持续发展 - 全球发展', path: '/sustain/global' },
  ],
};

// 将 companyInfo 对象转换为卡片数据格式
const convertToStats = (info) => {
  return Object.keys(COMPANY_FIELD_LABELS).map(key => {
    const value = info[key] || '';
    // 提取数值和单位
    const match = value.match(/^([\d,]+)(.*)$/);
    const statValue = match ? match[1].replace(/,/g, '') : value;
    const unit = match && match[2] ? match[2] : '';
    
    return {
      id: key,
      value: statValue,
      unit: unit,
      label: COMPANY_FIELD_LABELS[key],
      originalKey: key
    };
  });
};

// 将卡片数据转换回 companyInfo 对象
const convertFromStats = (stats) => {
  const info = {};
  stats.forEach(stat => {
    const fullValue = stat.unit ? `${stat.value}${stat.unit}` : stat.value;
    info[stat.originalKey] = fullValue;
  });
  return info;
};

const CompanyInfoEditor = ({ info, onChange }) => {
  const [stats, setStats] = useState(() => convertToStats(info));
  const [isStatModalOpen, setIsStatModalOpen] = useState(false);
  const [editingStat, setEditingStat] = useState(null);
  const [statForm, setStatForm] = useState({ value: '', unit: '', label: '' });
  
  // 搜索、筛选、排序状态
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState('label');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterUnit, setFilterUnit] = useState('all');
  
  // 删除和更新确认弹窗状态
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteReferences, setDeleteReferences] = useState([]);
  const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);
  const [updateTarget, setUpdateTarget] = useState(null);
  const [updateReferences, setUpdateReferences] = useState([]);
  const [pendingSaveAction, setPendingSaveAction] = useState(null);
  
  // 页面级别历史记录弹窗状态
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  
  // 内容级别版本历史弹窗状态
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [versionItem, setVersionItem] = useState(null);

  // 当外部 info 变化时，更新 stats
  useEffect(() => {
    setStats(convertToStats(info));
  }, [info]);

  // 更新父组件数据
  const updateInfo = (newStats) => {
    const newInfo = convertFromStats(newStats);
    onChange(newInfo);
  };

  // 添加数据
  const handleAddStat = () => {
    setEditingStat(null);
    setStatForm({ value: '', unit: '', label: '' });
    setIsStatModalOpen(true);
  };

  // 编辑数据
  const handleEditStat = (stat) => {
    setEditingStat(stat);
    setStatForm({ value: stat.value, unit: stat.unit, label: stat.label });
    setIsStatModalOpen(true);
  };

  // 删除数据前检查引用
  const handleDeleteStat = (stat) => {
    const refs = getReferences(stat.id);
    setDeleteTarget({ ...stat, isStat: true });
    setDeleteReferences(refs);
    setShowDeleteModal(true);
  };

  // 确认删除数据
  const confirmDeleteStat = () => {
    if (deleteTarget) {
      const newStats = stats.filter(s => s.id !== deleteTarget.id);
      setStats(newStats);
      updateInfo(newStats);
      setShowDeleteModal(false);
      setDeleteTarget(null);
    }
  };

  // 实际执行保存数据
  const doSaveStat = () => {
    const newStats = editingStat
      ? stats.map(s => s.id === editingStat.id ? { ...s, ...statForm } : s)
      : [...stats, { 
          id: `stat_${Date.now()}`, 
          ...statForm,
          originalKey: `custom_${Date.now()}`
        }];
    
    setStats(newStats);
    updateInfo(newStats);
    setIsStatModalOpen(false);
    setEditingStat(null);
    setShowUpdateConfirm(false);
    setUpdateTarget(null);
  };

  // 保存数据（带引用检查）
  const handleSaveStat = () => {
    if (!statForm.value || !statForm.label) {
      alert('请填写完整信息');
      return;
    }
    
    // 如果是编辑且有引用，弹出确认
    if (editingStat) {
      const refs = getReferences(editingStat.id);
      if (refs.length > 0) {
        setUpdateTarget({ ...editingStat, label: statForm.label, isStat: true });
        setUpdateReferences(refs);
        setPendingSaveAction('stat');
        setShowUpdateConfirm(true);
        return;
      }
    }
    
    doSaveStat();
  };

  // 确认更新（有引用时）
  const confirmUpdate = () => {
    if (pendingSaveAction === 'stat') {
      doSaveStat();
    }
    setPendingSaveAction(null);
  };

  // 获取引用关系
  const getReferences = (itemId) => {
    return MOCK_REFERENCES[itemId] || [];
  };

  // 获取资源的版本历史
  const getVersionHistory = (itemId) => {
    return MOCK_ITEM_VERSIONS[itemId] || [];
  };

  // 查看资源版本历史
  const handleViewVersions = (stat) => {
    setVersionItem({ ...stat, isStat: true });
    setShowVersionModal(true);
  };

  // 恢复到某个版本
  const handleRestoreVersion = (version) => {
    if (confirm(`确定要恢复到 ${version.version} 版本吗？\n\n修改内容：${version.changes}`)) {
      if (versionItem) {
        // 从版本描述中提取数值（简单实现，实际应该从版本数据中获取）
        // 这里可以根据实际需求实现更完善的恢复逻辑
        const changes = version.changes;
        const valueMatch = changes.match(/数值为(\d+)/);
        const timeMatch = changes.match(/时间为([\d-]+)/);
        
        if (valueMatch) {
          const restoredValue = valueMatch[1];
          const updatedStats = stats.map(s => 
            s.id === versionItem.id 
              ? { ...s, value: restoredValue }
              : s
          );
          setStats(updatedStats);
          updateInfo(updatedStats);
        } else if (timeMatch) {
          const restoredTime = timeMatch[1];
          const updatedStats = stats.map(s => 
            s.id === versionItem.id 
              ? { ...s, value: restoredTime }
              : s
          );
          setStats(updatedStats);
          updateInfo(updatedStats);
        }
        
        alert(`已恢复到 ${version.version} 版本`);
        setShowVersionModal(false);
        setVersionItem(null);
      }
    }
  };

  // 获取所有单位列表（用于筛选）
  const getAllUnits = () => {
    const units = [...new Set(stats.map(s => s.unit).filter(Boolean))];
    return units;
  };

  // 筛选和排序数据
  const getFilteredAndSortedStats = () => {
    let filteredStats = [...stats];
    
    // 搜索筛选
    if (searchText) {
      filteredStats = filteredStats.filter(stat => 
        stat.label.toLowerCase().includes(searchText.toLowerCase()) ||
        stat.value.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    // 单位筛选
    if (filterUnit !== 'all') {
      filteredStats = filteredStats.filter(stat => stat.unit === filterUnit);
    }
    
    // 排序
    filteredStats.sort((a, b) => {
      let aVal, bVal;
      switch (sortBy) {
        case 'label':
          aVal = a.label || '';
          bVal = b.label || '';
          break;
        case 'value':
          // 数值排序，需要转换为数字
          aVal = parseFloat(a.value.replace(/,/g, '')) || 0;
          bVal = parseFloat(b.value.replace(/,/g, '')) || 0;
          break;
        case 'unit':
          aVal = a.unit || '';
          bVal = b.unit || '';
          break;
        default:
          aVal = a.label || '';
          bVal = b.label || '';
      }
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      }
      return aVal < bVal ? 1 : -1;
    });
    
    return filteredStats;
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-4 overflow-hidden">
        {/* PageBanner - 添加历史记录入口 */}
        <PageBanner 
          title="公司档案信息"
          description="在此处维护的核心数据可被所有页面模块引用。修改此处配置将触发全站数据同步更新。"
          onHistoryClick={() => setShowHistoryModal(true)}
        />

        {/* 内容区域 */}
        <div className="px-xl py-lg border-t border-gray-4">
          {/* 数据展示部分 */}
          <div className="space-y-md">
            <div className="flex items-center justify-between">
              <h3 className="text-body font-semibold text-gray-8">公司档案数据展示</h3>
              <Button variant="add" onClick={handleAddStat}>
                <Plus className="w-4 h-4" />
                添加数据
              </Button>
            </div>

            {/* 搜索筛选栏 */}
            <SearchFilterBar
              searchText={searchText}
              onSearchChange={setSearchText}
              searchPlaceholder="搜索标签说明、数值..."
              sortOptions={[
                { id: 'label', label: '标签说明' },
                { id: 'value', label: '数值' },
                { id: 'unit', label: '单位' }
              ]}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortChange={(field, order) => {
                setSortBy(field);
                setSortOrder(order);
              }}
              filterFields={[
                {
                  id: 'unit',
                  label: '单位',
                  type: 'select',
                  value: filterUnit,
                  options: [
                    { value: 'all', label: '全部单位' },
                    ...getAllUnits().map(unit => ({ value: unit, label: unit || '无单位' }))
                  ]
                }
              ]}
              onFilterChange={(fieldId, value) => {
                if (fieldId === 'unit') setFilterUnit(value);
              }}
              onFilterReset={() => {
                setFilterUnit('all');
                setSearchText('');
              }}
            />

            {/* 数据列表 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-sm">
              {getFilteredAndSortedStats().map(stat => {
                const refs = getReferences(stat.id);
                
                return (
                  <div 
                    key={stat.id} 
                    className="p-sm bg-gray-2 rounded-md border border-gray-4 group hover:border-brand transition-colors relative"
                  >
                    {/* 操作按钮 - 右上角 */}
                    <ResourceActions
                      onViewHistory={() => handleViewVersions(stat)}
                      onEdit={() => handleEditStat(stat)}
                      onDelete={() => handleDeleteStat(stat)}
                      position="top-right"
                      showOnHover={true}
                    />
                    
                    {/* 引用状态指示器 - 右下角 */}
                    <ReferenceIndicator refs={refs} position="bottom-right" />

                    <div className="pr-20">
                      <div className="flex items-baseline gap-xxs">
                        <span className="text-section font-bold text-brand">{stat.value}</span>
                        {stat.unit && (
                          <span className="text-caption text-gray-6">{stat.unit}</span>
                        )}
                      </div>
                      <div className="text-caption text-gray-6 truncate">{stat.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 数据编辑弹窗 */}
      <Modal 
        isOpen={isStatModalOpen} 
        onClose={() => {
          setIsStatModalOpen(false);
          setEditingStat(null);
        }} 
        title={editingStat ? '编辑数据' : '新增数据'}
        footer={
          <>
            <Button variant="secondary" onClick={() => {
              setIsStatModalOpen(false);
              setEditingStat(null);
            }}>取消</Button>
            <Button onClick={handleSaveStat}>确认</Button>
          </>
        }
      >
        <div className="space-y-md">
          <FormItem label="数值" required>
            <Input 
              value={statForm.value} 
              onChange={e => setStatForm({...statForm, value: e.target.value})} 
              placeholder="如：2200"
            />
          </FormItem>
          <FormItem label="单位">
            <div className="flex gap-sm">
              {['', '+', '个', '项', '家', '年'].map(unit => (
                <button
                  key={unit || '无'}
                  onClick={() => setStatForm({...statForm, unit})}
                  className={`px-md py-xs rounded-sm border transition-colors ${
                    statForm.unit === unit
                      ? 'bg-brand-light text-brand border-brand'
                      : 'bg-white text-gray-7 border-gray-4 hover:border-brand'
                  }`}
                >
                  {unit || '无'}
                </button>
              ))}
            </div>
          </FormItem>
          <FormItem label="标签说明" required>
            <Input 
              value={statForm.label} 
              onChange={e => setStatForm({...statForm, label: e.target.value})} 
              placeholder="如：全球员工"
            />
          </FormItem>
        </div>
      </Modal>

      {/* 删除确认弹窗 */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        target={deleteTarget}
        references={deleteReferences}
        onConfirm={confirmDeleteStat}
        onClose={() => setShowDeleteModal(false)}
        itemTypeName="数据项"
      />

      {/* 更新确认弹窗 */}
      <UpdateConfirmModal
        isOpen={showUpdateConfirm}
        target={updateTarget}
        references={updateReferences}
        onConfirm={confirmUpdate}
        onClose={() => {
          setShowUpdateConfirm(false);
          setUpdateTarget(null);
          setPendingSaveAction(null);
        }}
      />

      {/* 页面级别操作日志弹窗 */}
      <UnifiedHistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        title="公司档案信息 - 操作日志"
        mode="library"
        records={MOCK_OPERATION_LOGS}
      />

      {/* 内容级别版本历史弹窗 */}
      <VersionHistoryModal
        isOpen={showVersionModal}
        item={versionItem}
        versions={versionItem ? getVersionHistory(versionItem.id) : []}
        onRestore={handleRestoreVersion}
        onClose={() => setShowVersionModal(false)}
      />
    </>
  );
};

export default CompanyInfoEditor;
