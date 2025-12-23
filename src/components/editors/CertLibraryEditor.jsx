import { useState } from 'react';
import { Plus, Award, Medal } from 'lucide-react';
import { 
  Modal, Button, FormItem, Input, ImageSelector, PageBanner, TextArea,
  ReferenceIndicator, ResourceActions, DeleteConfirmModal, UpdateConfirmModal, VersionHistoryModal,
  UnifiedHistoryModal, SearchFilterBar
} from '../ui';

// 初始资质数据展示
const INITIAL_CERT_STATS = [
  { id: 'cert_stat_1', value: '9', unit: '个', label: '工程勘察综合甲级资质' },
  { id: 'cert_stat_2', value: '6', unit: '个', label: '工程设计综合甲级资质' },
  { id: 'cert_stat_3', value: '9', unit: '个', label: '工程设计行业甲级资质' },
  { id: 'cert_stat_4', value: '7', unit: '个', label: '工程化工施工总承包特级资质' },
  { id: 'cert_stat_5', value: '67', unit: '项', label: '石油化工施工总承包一级资质' },
];

// 初始资质信息
const INITIAL_CERT_DETAILS = [
  { id: 'cert_detail_1', title: '工程设计综合甲级资质', image: '', issueDate: '2020-01-01', expireDate: '2025-12-31', issuer: '住房和城乡建设部', description: '' },
  { id: 'cert_detail_2', title: '工程勘查综合甲级资质', image: '', issueDate: '2020-01-01', expireDate: '2025-12-31', issuer: '住房和城乡建设部', description: '' },
];

// 初始荣誉数据展示
const INITIAL_HONOR_STATS = [
  { id: 'honor_stat_1', value: '46', unit: '项', label: '中国建设工程鲁班奖' },
  { id: 'honor_stat_2', value: '129', unit: '项', label: '国家优质工程奖' },
  { id: 'honor_stat_3', value: '855', unit: '项', label: '工程总承包奖' },
];

// 初始荣誉信息
const INITIAL_HONOR_DETAILS = [
  { id: 'honor_detail_1', title: '鲁班奖', image: '', issueDate: '2020-01-01', issuer: '中国建筑业协会', description: '', type: '企业' },
  { id: 'honor_detail_2', title: '国家优质工程奖', image: '', issueDate: '2021-06-01', issuer: '中国施工企业管理协会', description: '', type: '企业' },
];

// 模拟操作日志数据
const MOCK_OPERATION_LOGS = [
  { id: 'log1', time: '2025-12-08 15:30', operator: 'admin', action: 'add', itemType: 'cert', itemTitle: '工程咨询甲级资质' },
  { id: 'log2', time: '2025-12-08 14:20', operator: 'admin', action: 'edit', itemType: 'honor', itemTitle: '鲁班奖' },
  { id: 'log3', time: '2025-12-08 11:45', operator: 'editor_zhang', action: 'delete', itemType: 'cert', itemTitle: '临时资质证书' },
  { id: 'log4', time: '2025-12-07 16:00', operator: 'admin', action: 'add', itemType: 'honor', itemTitle: '国家优质工程金奖' },
  { id: 'log5', time: '2025-12-07 10:30', operator: 'editor_zhang', action: 'edit', itemType: 'cert', itemTitle: '工程设计综合甲级资质' },
  { id: 'log6', time: '2025-12-06 14:15', operator: 'admin', action: 'add', itemType: 'cert', itemTitle: '工程勘查综合甲级资质' },
];

// 模拟引用关系数据（哪些页面引用了哪些资源）
const MOCK_REFERENCES = {
  // 资质信息引用
  'cert_detail_1': [
    { page: '首页 - 荣誉板块', path: '/home/honors' },
    { page: '关于我们 - 资质荣誉', path: '/about/honors' },
    { page: '企业公开 - 基本信息', path: '/public/info' },
  ],
  'cert_detail_2': [
    { page: '关于我们 - 资质荣誉', path: '/about/honors' },
  ],
  // 荣誉信息引用
  'honor_detail_1': [
    { page: '首页 - 荣誉板块', path: '/home/honors' },
    { page: '关于我们 - 资质荣誉', path: '/about/honors' },
  ],
  'honor_detail_2': [],
  // 资质数据展示引用
  'cert_stat_1': [
    { page: '首页 - 数据板块', path: '/home/stats' },
    { page: '关于我们 - 公司简介', path: '/about/intro' },
  ],
  'cert_stat_2': [
    { page: '首页 - 数据板块', path: '/home/stats' },
  ],
  'cert_stat_3': [],
  'cert_stat_4': [],
  'cert_stat_5': [
    { page: '企业公开 - 基本信息', path: '/public/info' },
  ],
  // 荣誉数据展示引用
  'honor_stat_1': [
    { page: '首页 - 荣誉板块', path: '/home/honors' },
    { page: '关于我们 - 资质荣誉', path: '/about/honors' },
  ],
  'honor_stat_2': [
    { page: '首页 - 荣誉板块', path: '/home/honors' },
  ],
  'honor_stat_3': [],
};

// 模拟资源版本历史
const MOCK_ITEM_VERSIONS = {
  // 资质信息版本
  'cert_detail_1': [
    { version: 'V3', time: '2025-12-08 14:30', operator: 'admin', changes: '更新了证书扫描件' },
    { version: 'V2', time: '2025-12-01 10:00', operator: 'editor_zhang', changes: '修改了过期时间' },
    { version: 'V1', time: '2025-11-15 09:00', operator: 'admin', changes: '初始创建' },
  ],
  'cert_detail_2': [
    { version: 'V2', time: '2025-12-05 11:20', operator: 'admin', changes: '更新了颁发机构信息' },
    { version: 'V1', time: '2025-11-10 14:00', operator: 'admin', changes: '初始创建' },
  ],
  // 荣誉信息版本
  'honor_detail_1': [
    { version: 'V2', time: '2025-12-07 16:00', operator: 'admin', changes: '添加了获奖描述' },
    { version: 'V1', time: '2025-10-20 09:30', operator: 'admin', changes: '初始创建' },
  ],
  'honor_detail_2': [
    { version: 'V1', time: '2025-11-01 10:00', operator: 'admin', changes: '初始创建' },
  ],
  // 资质数据展示版本
  'cert_stat_1': [
    { version: 'V2', time: '2025-12-06 10:00', operator: 'admin', changes: '更新了数值为9' },
    { version: 'V1', time: '2025-10-01 09:00', operator: 'admin', changes: '初始创建' },
  ],
  'cert_stat_2': [
    { version: 'V1', time: '2025-10-01 09:00', operator: 'admin', changes: '初始创建' },
  ],
  'cert_stat_3': [
    { version: 'V1', time: '2025-10-01 09:00', operator: 'admin', changes: '初始创建' },
  ],
  'cert_stat_4': [
    { version: 'V1', time: '2025-10-01 09:00', operator: 'admin', changes: '初始创建' },
  ],
  'cert_stat_5': [
    { version: 'V3', time: '2025-12-01 15:00', operator: 'editor_zhang', changes: '更新了数值为67' },
    { version: 'V2', time: '2025-11-15 11:00', operator: 'admin', changes: '更新了数值为60' },
    { version: 'V1', time: '2025-10-01 09:00', operator: 'admin', changes: '初始创建' },
  ],
  // 荣誉数据展示版本
  'honor_stat_1': [
    { version: 'V2', time: '2025-11-20 14:00', operator: 'admin', changes: '更新了数值为46' },
    { version: 'V1', time: '2025-09-01 10:00', operator: 'admin', changes: '初始创建' },
  ],
  'honor_stat_2': [
    { version: 'V1', time: '2025-09-01 10:00', operator: 'admin', changes: '初始创建' },
  ],
  'honor_stat_3': [
    { version: 'V1', time: '2025-09-01 10:00', operator: 'admin', changes: '初始创建' },
  ],
};

const CertLibraryEditor = ({ library = {}, onChange, imageLib }) => {
  // 主Tab：资质/荣誉
  const [mainTab, setMainTab] = useState('cert');
  
  // 数据状态
  const [certStats, setCertStats] = useState(library.certStats || INITIAL_CERT_STATS);
  const [certDetails, setCertDetails] = useState(library.certDetails || INITIAL_CERT_DETAILS);
  const [honorStats, setHonorStats] = useState(library.honorStats || INITIAL_HONOR_STATS);
  const [honorDetails, setHonorDetails] = useState(library.honorDetails || INITIAL_HONOR_DETAILS);
  
  // 搜索、筛选、排序状态
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterIssuer, setFilterIssuer] = useState('all');
  
  // Modal状态
  const [isStatModalOpen, setIsStatModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingStat, setEditingStat] = useState(null);
  const [editingDetail, setEditingDetail] = useState(null);
  const [statForm, setStatForm] = useState({ value: '', unit: '个', label: '' });
  const [detailForm, setDetailForm] = useState({ 
    title: '', image: '', issueDate: '', expireDate: '', issuer: '', description: '', type: '企业' 
  });

  // 新增：操作日志弹窗
  const [showLogModal, setShowLogModal] = useState(false);
  
  // 新增：资源版本历史弹窗
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [versionItem, setVersionItem] = useState(null);
  
  // 新增：删除确认/警告弹窗
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteReferences, setDeleteReferences] = useState([]);

  // 新增：更新确认弹窗（带引用警告）
  const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);
  const [updateTarget, setUpdateTarget] = useState(null);
  const [updateReferences, setUpdateReferences] = useState([]);
  const [pendingSaveAction, setPendingSaveAction] = useState(null); // 'stat' | 'detail'

  // 获取资源的引用信息
  const getReferences = (itemId) => {
    return MOCK_REFERENCES[itemId] || [];
  };

  // 获取资源的版本历史
  const getVersionHistory = (itemId) => {
    return MOCK_ITEM_VERSIONS[itemId] || [];
  };


  // 更新父组件数据
  const updateLibrary = (newCertStats, newCertDetails, newHonorStats, newHonorDetails) => {
    onChange({ 
      certStats: newCertStats, 
      certDetails: newCertDetails,
      honorStats: newHonorStats,
      honorDetails: newHonorDetails
    });
  };

  // 获取当前操作的数据
  const getCurrentStats = () => mainTab === 'cert' ? certStats : honorStats;
  const getCurrentDetails = () => mainTab === 'cert' ? certDetails : honorDetails;
  
  // 获取所有颁发机构列表（用于筛选）
  const getAllIssuers = () => {
    const details = getCurrentDetails();
    const issuers = [...new Set(details.map(d => d.issuer).filter(Boolean))];
    return issuers;
  };
  
  // 筛选和排序当前详情数据
  const getFilteredAndSortedDetails = () => {
    let details = [...getCurrentDetails()];
    
    // 搜索筛选
    if (searchText) {
      details = details.filter(d => 
        d.title.toLowerCase().includes(searchText.toLowerCase()) ||
        (d.issuer && d.issuer.toLowerCase().includes(searchText.toLowerCase())) ||
        (d.description && d.description.toLowerCase().includes(searchText.toLowerCase()))
      );
    }
    
    // 颁发机构筛选
    if (filterIssuer !== 'all') {
      details = details.filter(d => d.issuer === filterIssuer);
    }
    
    // 排序
    details.sort((a, b) => {
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
    
    return details;
  };
  const setCurrentStats = (data) => {
    if (mainTab === 'cert') {
      setCertStats(data);
      updateLibrary(data, certDetails, honorStats, honorDetails);
    } else {
      setHonorStats(data);
      updateLibrary(certStats, certDetails, data, honorDetails);
    }
  };
  const setCurrentDetails = (data) => {
    if (mainTab === 'cert') {
      setCertDetails(data);
      updateLibrary(certStats, data, honorStats, honorDetails);
    } else {
      setHonorDetails(data);
      updateLibrary(certStats, certDetails, honorStats, data);
    }
  };

  // ================== 数据展示管理 ==================
  const handleAddStat = () => {
    setEditingStat(null);
    setStatForm({ value: '', unit: '个', label: '' });
    setIsStatModalOpen(true);
  };

  const handleEditStat = (stat) => {
    setEditingStat(stat);
    setStatForm({ value: stat.value, unit: stat.unit, label: stat.label });
    setIsStatModalOpen(true);
  };

  // 实际执行保存数据展示
  const doSaveStat = () => {
    const currentStats = getCurrentStats();
    const newStats = editingStat
      ? currentStats.map(s => s.id === editingStat.id ? { ...s, ...statForm } : s)
      : [...currentStats, { id: `${mainTab}_stat_${Date.now()}`, ...statForm }];
    
    setCurrentStats(newStats);
    setIsStatModalOpen(false);
    setShowUpdateConfirm(false);
    setUpdateTarget(null);
  };

  // 保存数据展示（带引用检查）
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

  // 删除数据展示前检查引用
  const handleDeleteStat = (stat) => {
    const refs = getReferences(stat.id);
    setDeleteTarget({ ...stat, isStat: true }); // 标记是数据展示项
    setDeleteReferences(refs);
    setShowDeleteModal(true);
  };

  // 确认删除数据展示（无引用时）
  const confirmDeleteStat = () => {
    if (deleteTarget && deleteTarget.isStat) {
      setCurrentStats(getCurrentStats().filter(s => s.id !== deleteTarget.id));
      setShowDeleteModal(false);
      setDeleteTarget(null);
    }
  };

  // 查看资源版本历史（通用 - 支持数据展示和信息）
  const handleViewVersions = (item, isStat = false) => {
    setVersionItem({ ...item, isStat });
    setShowVersionModal(true);
  };

  // 恢复到某个版本
  const handleRestoreVersion = (version) => {
    if (confirm(`确定要恢复到 ${version.version} 版本吗？\n\n修改内容：${version.changes}`)) {
      alert(`已恢复到 ${version.version} 版本`);
      setShowVersionModal(false);
    }
  };

  // ================== 信息管理 ==================
  const handleAddDetail = () => {
    setEditingDetail(null);
    setDetailForm({ title: '', image: '', issueDate: '', expireDate: '', issuer: '', description: '', type: '企业' });
    setIsDetailModalOpen(true);
  };

  const handleEditDetail = (detail) => {
    setEditingDetail(detail);
    setDetailForm({ 
      title: detail.title || '', 
      image: detail.image || '', 
      issueDate: detail.issueDate || '',
      expireDate: detail.expireDate || '',
      issuer: detail.issuer || '',
      description: detail.description || '',
      type: detail.type || '企业'
    });
    setIsDetailModalOpen(true);
  };

  // 实际执行保存资源信息
  const doSaveDetail = () => {
    const currentDetails = getCurrentDetails();
    const newDetails = editingDetail
      ? currentDetails.map(d => d.id === editingDetail.id ? { ...d, ...detailForm } : d)
      : [...currentDetails, { id: `${mainTab}_detail_${Date.now()}`, ...detailForm }];
    
    setCurrentDetails(newDetails);
    setIsDetailModalOpen(false);
    setShowUpdateConfirm(false);
    setUpdateTarget(null);
  };

  // 保存资源信息（带引用检查）
  const handleSaveDetail = () => {
    if (!detailForm.title) {
      alert('请填写名称');
      return;
    }
    
    // 如果是编辑且有引用，弹出确认
    if (editingDetail) {
      const refs = getReferences(editingDetail.id);
      if (refs.length > 0) {
        setUpdateTarget({ ...editingDetail, title: detailForm.title });
        setUpdateReferences(refs);
        setPendingSaveAction('detail');
        setShowUpdateConfirm(true);
        return;
      }
    }
    
    doSaveDetail();
  };

  // 删除资源前检查引用
  const handleDeleteDetail = (detail) => {
    const refs = getReferences(detail.id);
    setDeleteTarget(detail);
    setDeleteReferences(refs);
    setShowDeleteModal(true);
  };

  // 确认删除（无引用时）
  const confirmDelete = () => {
    if (deleteTarget) {
      setCurrentDetails(getCurrentDetails().filter(d => d.id !== deleteTarget.id));
      setShowDeleteModal(false);
      setDeleteTarget(null);
    }
  };

  // 确认更新（有引用时）
  const confirmUpdate = () => {
    if (pendingSaveAction === 'stat') {
      doSaveStat();
    } else if (pendingSaveAction === 'detail') {
      doSaveDetail();
    }
    setPendingSaveAction(null);
  };

  const handleSave = () => {
    updateLibrary(certStats, certDetails, honorStats, honorDetails);
    alert('配置已保存');
  };

  const mainTabLabel = mainTab === 'cert' ? '资质' : '荣誉';

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-4 overflow-hidden">
        {/* PageBanner - 添加历史记录入口 */}
        <PageBanner 
          title="资质荣誉库"
          description="统一管理公司资质证书和荣誉奖项，即时生效。"
          onHistoryClick={() => setShowLogModal(true)}
        />

        {/* 主Tab切换 - 资质/荣誉 */}
        <div className="px-xl py-md border-t border-gray-4">
          <div className="flex gap-1">
            <button 
              onClick={() => setMainTab('cert')} 
              className={`px-md py-xs rounded-sm text-body font-medium transition-all flex items-center gap-xs ${
                mainTab === 'cert' 
                  ? 'bg-brand-light text-brand' 
                  : 'text-gray-7 hover:text-gray-8 hover:bg-gray-3'
              }`}
            >
              <Award className="w-4 h-4" />
              资质
            </button>
            <button 
              onClick={() => setMainTab('honor')} 
              className={`px-md py-xs rounded-sm text-body font-medium transition-all flex items-center gap-xs ${
                mainTab === 'honor' 
                  ? 'bg-brand-light text-brand' 
                  : 'text-gray-7 hover:text-gray-8 hover:bg-gray-3'
              }`}
            >
              <Medal className="w-4 h-4" />
              荣誉
            </button>
          </div>
        </div>
         
        {/* 内容区域 - 数据展示 + 信息在同一页面 */}
        <div className="px-xl py-lg border-t border-gray-4 space-y-xl">
          
          {/* ================== 数据展示部分 ================== */}
          <div className="space-y-md">
            <div className="flex items-center justify-between">
              <h3 className="text-body font-semibold text-gray-8">{mainTabLabel}数据展示</h3>
              <Button variant="add" onClick={handleAddStat}>
                <Plus className="w-4 h-4" />
                添加数据
              </Button>
            </div>

            {/* 数据列表 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-sm">
              {getCurrentStats().map(stat => {
                const refs = getReferences(stat.id);
                
                return (
                  <div 
                    key={stat.id} 
                    className="p-sm bg-gray-2 rounded-md border border-gray-4 group hover:border-brand transition-colors relative"
                  >
                    {/* 操作按钮 - 右上角 */}
                    <ResourceActions
                      onViewHistory={() => handleViewVersions(stat, true)}
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
                        <span className="text-caption text-gray-6">{stat.unit}</span>
                      </div>
                      <div className="text-caption text-gray-6 truncate">{stat.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 分割线 */}
          <div className="border-t border-gray-4"></div>

          {/* ================== 信息部分 ================== */}
          <div className="space-y-md">
            <div className="flex items-center justify-between">
              <h3 className="text-body font-semibold text-gray-8">{mainTabLabel}信息</h3>
              <Button variant="add" onClick={handleAddDetail}>
                <Plus className="w-4 h-4" />
                添加{mainTabLabel}
              </Button>
            </div>
            
            {/* 搜索筛选栏 */}
            <SearchFilterBar
              searchText={searchText}
              onSearchChange={setSearchText}
              searchPlaceholder={`搜索${mainTabLabel}名称、颁发机构...`}
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

            {/* 卡片列表 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
              {getFilteredAndSortedDetails().map(detail => {
                const refs = getReferences(detail.id);
                
                return (
                  <div 
                    key={detail.id} 
                    className="bg-gray-2 rounded-xl overflow-hidden group hover:shadow-md transition-all"
                  >
                    {/* 图片区域 - 居中显示 */}
                    <div className="p-md pb-0">
                      <div className="aspect-[4/3] bg-yellow-50 rounded-lg flex items-center justify-center relative overflow-hidden">
                        {detail.image ? (
                          <img 
                            src={detail.image} 
                            alt={detail.title} 
                            className="w-full h-full object-contain p-2"
                          />
                        ) : (
                          mainTab === 'cert' 
                            ? <Award className="w-16 h-16 text-yellow-200" /> 
                            : <Medal className="w-16 h-16 text-yellow-200" />
                        )}
                        
                        {/* 操作按钮 - 图片右上角 */}
                        <ResourceActions
                          onViewHistory={() => handleViewVersions(detail)}
                          onEdit={() => handleEditDetail(detail)}
                          onDelete={() => handleDeleteDetail(detail)}
                          position="top-right"
                          showOnHover={true}
                        />
                        
                        {/* 引用状态指示器 - 图片右下角 */}
                        <ReferenceIndicator refs={refs} position="bottom-right" />
                      </div>
                    </div>
                    
                    {/* 信息区域 */}
                    <div className="p-md pt-sm">
                      <div className="flex items-start justify-between gap-sm mb-sm">
                        <h4 className="text-body font-bold text-gray-8 line-clamp-1">{detail.title}</h4>
                        {detail.type && (
                          <span className="px-sm py-xxs text-caption text-brand border border-brand rounded-full flex-shrink-0">
                            {detail.type}
                          </span>
                        )}
                      </div>
                      <div className="space-y-xxs text-caption text-gray-6">
                        {detail.issuer && (
                          <div>颁发机构：{detail.issuer}</div>
                        )}
                        {detail.issueDate && (
                          <div>获得日期：{detail.issueDate}</div>
                        )}
                        {mainTab === 'cert' && detail.expireDate && (
                          <div>过期时间：{detail.expireDate}</div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {/* 添加按钮卡片 */}
              <div className="bg-gray-2 rounded-xl p-md">
                <button 
                  onClick={handleAddDetail}
                  className="w-full aspect-[4/3] border-2 border-dashed border-gray-4 rounded-lg flex flex-col items-center justify-center gap-xs text-gray-6 hover:border-brand hover:text-brand transition-colors bg-white"
                >
                  <Plus className="w-8 h-8" />
                  <span className="text-caption">添加{mainTabLabel}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 数据展示编辑弹窗 */}
      <Modal 
        isOpen={isStatModalOpen} 
        onClose={() => setIsStatModalOpen(false)} 
        title={editingStat ? `编辑${mainTabLabel}数据` : `新增${mainTabLabel}数据`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsStatModalOpen(false)}>取消</Button>
            <Button onClick={handleSaveStat}>确认</Button>
          </>
        }
      >
        <div className="space-y-md">
          <FormItem label="数值" required>
            <Input 
              value={statForm.value} 
              onChange={e => setStatForm({...statForm, value: e.target.value})} 
              placeholder="如：46"
            />
          </FormItem>
          <FormItem label="单位">
            <div className="flex gap-sm">
              {['个', '项', '+', '家'].map(unit => (
                <button
                  key={unit}
                  onClick={() => setStatForm({...statForm, unit})}
                  className={`px-md py-xs rounded-sm border transition-colors ${
                    statForm.unit === unit
                      ? 'bg-brand-light text-brand border-brand'
                      : 'bg-white text-gray-7 border-gray-4 hover:border-brand'
                  }`}
                >
                  {unit}
                </button>
              ))}
            </div>
          </FormItem>
          <FormItem label="标签说明" required>
            <Input 
              value={statForm.label} 
              onChange={e => setStatForm({...statForm, label: e.target.value})} 
              placeholder={mainTab === 'cert' ? '如：工程设计综合甲级资质' : '如：中国建设工程鲁班奖'}
            />
          </FormItem>
        </div>
      </Modal>

      {/* 信息编辑弹窗 */}
      <Modal 
        isOpen={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)} 
        title={editingDetail ? `编辑${mainTabLabel}` : `新增${mainTabLabel}`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsDetailModalOpen(false)}>取消</Button>
            <Button onClick={handleSaveDetail}>确认</Button>
          </>
        }
      >
        <div className="space-y-sm">
          <div className="grid grid-cols-2 gap-sm">
            <FormItem label={`${mainTabLabel}名称`} required>
              <Input 
                value={detailForm.title} 
                onChange={e => setDetailForm({...detailForm, title: e.target.value})} 
                placeholder={`请输入${mainTabLabel}名称`}
              />
            </FormItem>
            <FormItem label="颁发机构">
              <Input 
                value={detailForm.issuer} 
                onChange={e => setDetailForm({...detailForm, issuer: e.target.value})} 
                placeholder="如：住房和城乡建设部"
              />
            </FormItem>
          </div>
          
          <div className={`grid ${mainTab === 'cert' ? 'grid-cols-2' : 'grid-cols-1'} gap-sm`}>
            <FormItem label="颁发日期">
              <Input 
                type="date"
                value={detailForm.issueDate} 
                onChange={e => setDetailForm({...detailForm, issueDate: e.target.value})} 
              />
            </FormItem>
            {mainTab === 'cert' && (
              <FormItem label="过期时间">
                <Input 
                  type="date"
                  value={detailForm.expireDate} 
                  onChange={e => setDetailForm({...detailForm, expireDate: e.target.value})} 
                />
              </FormItem>
            )}
          </div>

          <FormItem label="描述">
            <TextArea 
              value={detailForm.description} 
              onChange={e => setDetailForm({...detailForm, description: e.target.value})} 
              rows={3}
              placeholder={`请输入${mainTabLabel}详细描述`}
            />
          </FormItem>

          <ImageSelector 
            label="扫描件"
            value={detailForm.image ? { url: detailForm.image } : null}
            onChange={(img) => setDetailForm({...detailForm, image: img?.url || ''})}
            library={imageLib}
          />
        </div>
      </Modal>

      {/* 操作日志弹窗 */}
      <UnifiedHistoryModal
        isOpen={showLogModal}
        onClose={() => setShowLogModal(false)}
        title="资质荣誉库 - 操作日志"
        mode="library"
        records={MOCK_OPERATION_LOGS}
      />

      {/* 版本历史弹窗 */}
      <VersionHistoryModal
        isOpen={showVersionModal}
        item={versionItem}
        versions={versionItem ? getVersionHistory(versionItem.id) : []}
        onRestore={handleRestoreVersion}
        onClose={() => setShowVersionModal(false)}
      />

      {/* 删除确认弹窗 */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        target={deleteTarget}
        references={deleteReferences}
        onConfirm={deleteTarget?.isStat ? confirmDeleteStat : confirmDelete}
        onClose={() => setShowDeleteModal(false)}
        itemTypeName={deleteTarget?.isStat ? '数据项' : mainTabLabel}
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
    </>
  );
};

export default CertLibraryEditor;
