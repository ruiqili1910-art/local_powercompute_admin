import { useState, useEffect, useRef } from 'react';
import { Edit2, Trash2, Save, ArrowUpCircle, ArrowDownCircle, RefreshCw, Clock, AlertCircle } from 'lucide-react';
import { Modal, Button, FormItem, Input, PageBanner, SearchFilterBar, DataTable, StatusChip, UnifiedHistoryModal } from '../ui';

// 检测项目修改的字段
const detectChangedFields = (current, initial) => {
  if (!current || !initial) return [];
  const changedFields = [];
  
  if (current.name !== initial.name) changedFields.push('项目名称');
  if (current.location !== initial.location) changedFields.push('建设地点');
  if (current.category !== initial.category) changedFields.push('类别');
  if (current.publishTime !== initial.publishTime) changedFields.push('发布时间');
  
  return changedFields;
};

// 生成项目版本历史数据
const generateProjectHistory = (projectName, currentProject = null, initialProject = null) => {
  // 如果有当前和初始数据，检测修改的字段
  // 只有保存文章（draft）时才生成细粒度描述，更新和发布只生成简单描述
  if (currentProject && initialProject) {
    // 只有保存文章时才检测字段变化并生成细粒度描述
    if (currentProject.status === 'draft') {
      const changedFields = detectChangedFields(currentProject, initialProject);
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
  return [
    { id: 'v1', time: '2024-03-20 14:30', description: '更新了项目', operator: 'admin', status: 'updated' },
    { id: 'v2', time: '2024-03-20 14:25', description: '更新了项目', operator: 'admin', status: 'updated' },
    { id: 'v3', time: '2024-03-18 16:00', description: '发布了项目', operator: 'admin', status: 'published' },
    { id: 'v4', time: '2024-03-18 15:30', description: '编辑了"项目名称"、"建设地点"内容', operator: 'admin', status: 'draft' },
    { id: 'v5', time: '2024-03-15 10:00', description: '发布了项目', operator: 'admin', status: 'published' },
  ];
};

// 项目类别
const PROJECT_CATEGORIES = [
  { id: 'domestic', label: '国内业绩' },
  { id: 'overseas', label: '国外业绩' }
];

// 初始项目数据（添加 hasUnsyncedChanges 字段）
const INITIAL_PROJECTS = [
  { id: 'p1', name: '双溪科技工业园配套基础设施项目', location: '四川成都', category: 'domestic', status: 'published', hasUnsyncedChanges: false, publishTime: '2024-01-15T00:00:00', updateTime: '2024-01-15T00:00:00' },
  { id: 'p2', name: '中船（天津）船舶制造有限公司工程承揽合同', location: '天津', category: 'domestic', status: 'published', hasUnsyncedChanges: false, publishTime: '2024-01-14T00:00:00', updateTime: '2024-01-14T00:00:00' },
  { id: 'p3', name: '龙泉驿区世纪广场城市停车场建设项目设计-施工总承包', location: '四川成都', category: 'domestic', status: 'published', hasUnsyncedChanges: true, publishTime: '2024-01-13T00:00:00', updateTime: '2024-01-13T00:00:00' },
  { id: 'p4', name: '旺苍嘉川化工园区基础设施建设项目', location: '四川广元', category: 'domestic', status: 'published', hasUnsyncedChanges: false, publishTime: '2024-01-12T00:00:00', updateTime: '2024-01-12T00:00:00' },
  { id: 'p5', name: '成都天府新区投资集团有限公司茂业路（遂州路-利州大道）等 2 个项目', location: '四川成都', category: 'domestic', status: 'published', hasUnsyncedChanges: false, publishTime: '2024-01-11T00:00:00', updateTime: '2024-01-11T00:00:00' },
  { id: 'p6', name: '甘肃巨化新材料有限公司高性能硅氟新材料一体化项目一标段EPC项目', location: '甘肃玉门', category: 'domestic', status: 'published', hasUnsyncedChanges: false, publishTime: '2024-01-10T00:00:00', updateTime: '2024-01-10T00:00:00' },
  { id: 'p7', name: '内蒙古卓正煤化工有限公司废水暂存池、浓盐水暂存池土建工程', location: '内蒙古鄂尔多斯', category: 'domestic', status: 'published', hasUnsyncedChanges: false, publishTime: '2024-01-09T00:00:00', updateTime: '2024-01-09T00:00:00' },
  { id: 'p8', name: '电子级玻璃纤维生产线设备更新及数智化提质增效项目EPC工程总承包', location: '重庆', category: 'domestic', status: 'published', hasUnsyncedChanges: false, publishTime: '2024-01-08T00:00:00', updateTime: '2024-01-08T00:00:00' },
  { id: 'p9', name: 'Saudi Aramco Jubail Refinery Project', location: 'Saudi Arabia', category: 'overseas', status: 'published', hasUnsyncedChanges: false, publishTime: '2024-01-07T00:00:00', updateTime: '2024-01-07T00:00:00' },
  { id: 'p10', name: 'Bangladesh Fertilizer Plant EPC Project', location: 'Bangladesh', category: 'overseas', status: 'published', hasUnsyncedChanges: false, publishTime: '2024-01-06T00:00:00', updateTime: '2024-01-06T00:00:00' },
  { id: 'p11', name: 'Pakistan Refinery Modernization Project', location: 'Pakistan', category: 'overseas', status: 'draft', hasUnsyncedChanges: false, publishTime: '', updateTime: '2024-01-05T00:00:00' },
  { id: 'p12', name: 'Indonesia Petrochemical Complex', location: 'Indonesia', category: 'overseas', status: 'published', hasUnsyncedChanges: false, publishTime: '2024-01-04T00:00:00', updateTime: '2024-01-04T00:00:00' },
];

/**
 * 项目总览管理页面
 */
const BusinessProjectEditor = () => {
  // 数据状态
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  
  // 搜索和筛选状态
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortField, setSortField] = useState('updateTime');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  
  // 编辑弹窗状态
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  
  // ==================== 编辑弹窗状态管理 ====================
  const [initialProject, setInitialProject] = useState(null);  // 初始值，用于对比是否有修改
  const [isSaving, setIsSaving] = useState(false);       // 保存中
  const [hasLocalChanges, setHasLocalChanges] = useState(false); // 用户是否有未保存的修改
  const [lastSavedTime, setLastSavedTime] = useState(null); // 上次保存时间
  
  // ==================== 历史记录弹窗 ====================
  const [showProjectHistoryModal, setShowProjectHistoryModal] = useState(false); // 单个项目历史
  const [showPageHistoryModal, setShowPageHistoryModal] = useState(false); // 页面级历史
  
  // ==================== 页面级操作日志 ====================
  // Mock 操作日志数据
  const MOCK_OPERATION_LOGS = [
    { 
      id: 'log_1', 
      time: '2024-12-08T15:30:00.000Z', 
      description: '发布了《双溪科技工业园配套基础设施项目》',
      operator: 'admin',
      action: 'publish',
      projectId: 'p1',
      projectTitle: '双溪科技工业园配套基础设施项目'
    },
    { 
      id: 'log_2', 
      time: '2024-12-08T14:20:00.000Z', 
      description: '更新了《中船（天津）船舶制造有限公司工程承揽合同》',
      operator: 'admin',
      action: 'update',
      projectId: 'p2',
      projectTitle: '中船（天津）船舶制造有限公司工程承揽合同'
    },
    { 
      id: 'log_3', 
      time: '2024-12-08T13:10:00.000Z', 
      description: '下架了《龙泉驿区世纪广场城市停车场建设项目》',
      operator: 'admin',
      action: 'unpublish',
      projectId: 'p3',
      projectTitle: '龙泉驿区世纪广场城市停车场建设项目'
    },
  ];
  
  const [pageOperationLogs, setPageOperationLogs] = useState(() => {
    // 从 localStorage 读取或初始化
    const saved = localStorage.getItem('project_page_operation_logs');
    if (saved) {
      return JSON.parse(saved);
    }
    // 如果没有保存的数据，返回mock数据
    return MOCK_OPERATION_LOGS;
  });
  
  // 记录操作日志
  const recordOperation = (action, project, extraInfo = {}) => {
    const now = new Date();
    const timeStr = now.toISOString();
    
    let description = '';
    if (action === 'publish') {
      description = `发布了《${project.name}》`;
    } else if (action === 'unpublish') {
      description = `下架了《${project.name}》`;
    } else if (action === 'update') {
      description = `更新了《${project.name}》`;
    }
    
    const newLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      time: timeStr,
      description,
      operator: 'admin', // 实际应该从用户上下文获取
      action,
      projectId: project.id,
      projectTitle: project.name,
      ...extraInfo
    };
    
    const updatedLogs = [newLog, ...pageOperationLogs].slice(0, 100); // 最多保留100条
    setPageOperationLogs(updatedLogs);
    localStorage.setItem('project_page_operation_logs', JSON.stringify(updatedLogs));
  };

  // 筛选项目
  const filteredProjects = projects.filter(project => {
    const matchSearch = searchText === '' || project.name.toLowerCase().includes(searchText.toLowerCase()) || project.location.toLowerCase().includes(searchText.toLowerCase());
    const matchStatus = filterStatus === 'all' || project.status === filterStatus;
    const matchCategory = filterCategory === 'all' || project.category === filterCategory;
    return matchSearch && matchStatus && matchCategory;
  });

  // 排序项目
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];
    if (sortField === 'publishTime' || sortField === 'updateTime') {
      aVal = new Date(aVal || 0).getTime();
      bVal = new Date(bVal || 0).getTime();
    }
    return sortOrder === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
  });

  // 分页
  const paginatedProjects = sortedProjects.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // 新增项目
  const handleAdd = () => {
    const newProject = {
      id: `p_${Date.now()}`,
      name: '',
      location: '',
      category: 'domestic',
      status: 'draft',
      hasUnsyncedChanges: false,
      publishTime: '',
      updateTime: new Date().toISOString()
    };
    setEditingProject(newProject);
    setInitialProject(newProject);  // 保存初始值用于对比
    setHasLocalChanges(true); // 新项目默认为未保存状态
    setIsSaving(false);
    setLastSavedTime(null);   // 新项目没有保存时间
    setIsModalOpen(true);
  };

  // 编辑项目
  const handleEdit = (project) => {
    const projectData = { ...project };
    setEditingProject(projectData);
    setInitialProject(projectData);  // 保存初始值用于对比
    setHasLocalChanges(false); // 重置修改状态
    setIsSaving(false);
    // 设置初始保存时间为项目的更新时间
    const updateDate = project.updateTime ? new Date(project.updateTime) : new Date();
    setLastSavedTime(updateDate.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }));
    setIsModalOpen(true);
  };
  
  // 监听用户编辑，对比初始值和当前值
  useEffect(() => {
    if (editingProject && initialProject) {
      const hasChanges = JSON.stringify(editingProject) !== JSON.stringify(initialProject);
      setHasLocalChanges(hasChanges);
    }
  }, [editingProject, initialProject]);
  
  // 更新编辑中的项目
  const updateEditingProject = (updater) => {
    setEditingProject(prev => {
      const updated = typeof updater === 'function' ? updater(prev) : updater;
      return updated;
    });
  };

  // 删除项目
  const handleDelete = (id) => {
    if (confirm('确定删除该项目吗？')) {
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  // 保存项目
  const handleSave = async () => {
    if (!editingProject.name) {
      alert('请填写项目名称');
      return;
    }
    if (!editingProject.location) {
      alert('请填写建设地点');
      return;
    }
    
    setIsSaving(true);
    
    // 模拟异步保存（实际项目中这里是 API 调用）
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const exists = projects.find(p => p.id === editingProject.id);
    const now = new Date().toISOString();
    const projectToSave = {
      ...editingProject,
      updateTime: now,
      // 如果原本是已发布状态，保存后标记为有未同步的修改（待同步）
      hasUnsyncedChanges: exists && exists.status === 'published' ? true : (editingProject.hasUnsyncedChanges || false)
    };
    
    if (exists) {
      setProjects(projects.map(p => p.id === editingProject.id ? projectToSave : p));
      
      // 如果项目已发布，记录更新操作
      if (projectToSave.status === 'published') {
        recordOperation('update', projectToSave);
      }
    } else {
      setProjects([...projects, projectToSave]);
    }
    
    // 保存后关闭弹窗
    setIsSaving(false);
    setHasLocalChanges(false);
    setLastSavedTime(new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }));
    setIsModalOpen(false);
    setEditingProject(null);
    setInitialProject(null);
  };
  
  // 关闭编辑弹窗
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    setInitialProject(null);
    setHasLocalChanges(false);
    setIsSaving(false);
    setLastSavedTime(null);
  };
  
  
  // ==================== 文章类操作函数 ====================
  
  // 发布项目
  const handlePublish = (project) => {
    const now = new Date().toISOString();
    const projectToPublish = {
      ...project,
      status: 'published',
      hasUnsyncedChanges: false,
      publishTime: now,
      updateTime: now
    };
    setProjects(projects.map(p => p.id === project.id ? projectToPublish : p));
    
    // 记录操作日志
    recordOperation('publish', projectToPublish);
  };
  
  // 下架项目
  const handleUnpublish = (project) => {
    const projectToUnpublish = {
      ...project,
      status: 'draft',
      hasUnsyncedChanges: false,
      updateTime: new Date().toISOString()
    };
    setProjects(projects.map(p => p.id === project.id ? projectToUnpublish : p));
    
    // 记录操作日志
    recordOperation('unpublish', projectToUnpublish);
  };
  
  // 同步项目（将本地修改同步到线上）
  const handleSync = (project) => {
    const projectToSync = {
      ...project,
      hasUnsyncedChanges: false,
      updateTime: new Date().toISOString()
    };
    setProjects(projects.map(p => p.id === project.id ? projectToSync : p));
    
    // 记录操作日志
    recordOperation('update', projectToSync);
  };

  // 获取类别名称
  const getCategoryName = (categoryId) => PROJECT_CATEGORIES.find(c => c.id === categoryId)?.label || '未分类';

  // 状态标签 - 与文章管理保持一致（使用 getArticleStatus 函数）
  const getArticleStatus = (status, hasUnsyncedChanges) => {
    if (status === 'draft') return 'draft';
    if (status === 'published' && hasUnsyncedChanges) return 'pending';
    return 'published';
  };

  // 表格列配置
  const tableColumns = [
    { 
      key: 'index', 
      title: '序号', 
      width: 60,
      render: (_, row, index) => <span className="text-body text-gray-7">{(currentPage - 1) * pageSize + index + 1}</span>
    },
    { 
      key: 'name', 
      title: '项目名称', 
      width: 400,
      render: (val) => <span className="text-body text-gray-7 line-clamp-2">{val}</span>
    },
    { 
      key: 'location', 
      title: '建设地点', 
      width: 140,
      render: (val) => <span className="text-body text-gray-7">{val}</span>
    },
    { 
      key: 'category', 
      title: '类别', 
      width: 100,
      render: (val) => (
        <span className={`inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-normal ${
          val === 'domestic' 
            ? 'bg-[#EFF6FF] text-[#155DFC]' 
            : 'bg-[#FEF3C7] text-[#D97706]'
        }`}>
          {getCategoryName(val)}
        </span>
      )
    },
    { 
      key: 'publishTime', 
      title: '发布时间', 
      width: 140,
      sortable: true,
      render: (val) => <span className="text-caption text-gray-6">{val ? new Date(val).toLocaleDateString('zh-CN') : '-'}</span>
    },
    { 
      key: 'updateTime', 
      title: '修改时间', 
      width: 140,
      sortable: true,
      render: (val) => <span className="text-caption text-gray-6">{val ? new Date(val).toLocaleDateString('zh-CN') : '-'}</span>
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

  return (
    <>
      <div className="bg-white rounded-md border border-gray-4">
        {/* PageBanner */}
        <PageBanner 
          title="项目总览"
          description="管理公司国内外工程项目业绩，支持按类别筛选和状态管理。"
          buttonText="新增项目"
          buttonIcon="add"
          onButtonClick={handleAdd}
          onHistoryClick={() => setShowPageHistoryModal(true)}
        />

        {/* Tab 切换 - 类别筛选 */}
        <div className="px-xl py-md border-t border-gray-4">
          <div className="flex gap-1">
            <button 
              onClick={() => { setFilterCategory('all'); setCurrentPage(1); }}
              className={`px-md py-xs rounded-sm text-body font-medium transition-all ${
                filterCategory === 'all' 
                  ? 'bg-brand-light text-brand' 
                  : 'text-gray-7 hover:text-gray-8 hover:bg-gray-3'
              }`}
            >
              全部项目
            </button>
            {PROJECT_CATEGORIES.map(cat => (
              <button 
                key={cat.id}
                onClick={() => { setFilterCategory(cat.id); setCurrentPage(1); }}
                className={`px-md py-xs rounded-sm text-body font-medium transition-all ${
                  filterCategory === cat.id 
                    ? 'bg-brand-light text-brand' 
                    : 'text-gray-7 hover:text-gray-8 hover:bg-gray-3'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 搜索和筛选栏 */}
        <SearchFilterBar
          searchText={searchText}
          onSearchChange={setSearchText}
          searchPlaceholder="搜索项目名称或地点..."
          sortOptions={[
            { id: 'updateTime', label: '修改时间' },
            { id: 'publishTime', label: '发布时间' },
            { id: 'name', label: '项目名称' }
          ]}
          sortBy={sortField}
          sortOrder={sortOrder}
          onSortChange={(field, order) => {
            setSortField(field);
            setSortOrder(order);
          }}
          filterFields={[
            {
              id: 'status',
              label: '状态',
              type: 'select',
              value: filterStatus,
              options: [
                { value: 'all', label: '全部状态' },
                { value: 'published', label: '已发布' },
                { value: 'draft', label: '草稿' }
              ]
            }
          ]}
          onFilterChange={(fieldId, value) => {
            if (fieldId === 'status') setFilterStatus(value);
          }}
          onFilterReset={() => {
            setFilterStatus('all');
          }}
        />

        {/* 项目列表表格 - 使用通用组件 */}
        <div className="border-t border-gray-4">
          <DataTable
            columns={tableColumns}
            data={paginatedProjects}
            sortBy={sortField}
            sortOrder={sortOrder}
            onSortChange={(field, order) => {
              setSortField(field);
              setSortOrder(order);
            }}
            currentPage={currentPage}
            pageSize={pageSize}
            total={filteredProjects.length}
            onPageChange={setCurrentPage}
            emptyText="暂无项目数据"
            minWidth={1000}
          />
        </div>
      </div>

      {/* 编辑弹窗 */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={projects.find(p => p.id === editingProject?.id) ? '编辑项目' : '新增项目'}
        size="lg"
        footer={null}
      >
        {editingProject && (
          <div className="flex flex-col h-[70vh]">
            {/* 表单内容 */}
            <div className="flex-1 overflow-y-auto space-y-md pr-2">
              <FormItem label="项目名称" required>
                <Input 
                  value={editingProject.name || ''} 
                  onChange={e => updateEditingProject({...editingProject, name: e.target.value})} 
                  placeholder="请输入项目名称" 
                />
              </FormItem>
              
              <FormItem label="建设地点" required>
                <Input 
                  value={editingProject.location || ''} 
                  onChange={e => updateEditingProject({...editingProject, location: e.target.value})} 
                  placeholder="请输入建设地点" 
                />
              </FormItem>
              
              <FormItem label="项目类别">
                <div className="flex gap-md">
                  {PROJECT_CATEGORIES.map(cat => (
                    <label 
                      key={cat.id}
                      className={`flex-1 flex items-center gap-sm p-md rounded-md cursor-pointer transition-all ${
                        editingProject.category === cat.id 
                          ? cat.id === 'domestic' ? 'bg-brand-light border border-brand' : 'bg-info-light border border-info'
                          : 'bg-gray-2 border border-gray-4 hover:bg-gray-3'
                      }`}
                    >
                      <input 
                        type="radio" 
                        checked={editingProject.category === cat.id} 
                        onChange={() => updateEditingProject({...editingProject, category: cat.id})} 
                        className="w-4 h-4" 
                      />
                      <span className={`text-body ${
                        editingProject.category === cat.id 
                          ? cat.id === 'domestic' ? 'text-brand' : 'text-info'
                          : 'text-gray-8'
                      }`}>{cat.label}</span>
                    </label>
                  ))}
                </div>
              </FormItem>
            </div>
            
            {/* 底部状态栏 */}
            <div className="flex-shrink-0 mt-4 pt-4 border-t border-gray-3 flex items-center justify-between">
              {/* 左侧：保存状态 */}
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
                  <span className="text-sm text-gray-5">新项目</span>
                )}
              </div>
              
              {/* 右侧：历史记录 + 保存按钮 */}
              <div className="flex items-center gap-2">
                {/* 历史记录按钮 */}
                {editingProject.id && projects.find(p => p.id === editingProject.id) && (
                  <button
                    onClick={() => setShowProjectHistoryModal(true)}
                    className="flex items-center gap-1.5 px-3 py-2 text-gray-6 hover:text-gray-7 hover:bg-gray-2 rounded-lg text-sm transition-colors"
                    title="查看版本历史"
                  >
                    <Clock className="w-4 h-4" />
                    历史记录
                  </button>
                )}
                
                {/* 保存按钮 */}
                <button
                  onClick={handleSave}
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
                  {isSaving ? '保存中...' : '保存项目'}
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
      
      {/* 项目版本历史弹窗 */}
      <UnifiedHistoryModal
        isOpen={showProjectHistoryModal}
        onClose={() => setShowProjectHistoryModal(false)}
        title={editingProject ? `《${editingProject.name}》 - 版本历史` : '版本历史'}
        mode="editor"
        records={editingProject ? generateProjectHistory(editingProject.name, editingProject, initialProject) : []}
        onRestore={(record) => {
          console.log('恢复版本:', record);
          setShowProjectHistoryModal(false);
        }}
        useArticleVersionLabels={true}
      />
      
      {/* 页面级历史记录弹窗 */}
      <UnifiedHistoryModal
        isOpen={showPageHistoryModal}
        onClose={() => setShowPageHistoryModal(false)}
        title="项目总览 - 操作日志"
        mode="article"
        records={pageOperationLogs}
      />
    </>
  );
};

export default BusinessProjectEditor;
