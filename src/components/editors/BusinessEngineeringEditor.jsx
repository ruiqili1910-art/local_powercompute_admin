import { useState, useEffect, useRef } from 'react';
import { Edit2, GripVertical, Trash2, Save, ArrowUpCircle, ArrowDownCircle, RefreshCw, AlertCircle, Clock, ImageIcon, Sparkles, Bold, Italic, Underline, X } from 'lucide-react';
import { Modal, Button, FormItem, Input, PageBanner, ImageSelector, SearchFilterBar, DataTable, StatusChip, UnifiedHistoryModal, EditorLayout } from '../ui';
import { CoverUploader } from './ArticleSidebarConfig';

// 检测项目修改的字段
const detectChangedFields = (current, initial) => {
  if (!current || !initial) return [];
  const changedFields = [];
  
  if (current.title !== initial.title) changedFields.push('标题');
  if (current.summary !== initial.summary) changedFields.push('摘要');
  if (current.content !== initial.content) changedFields.push('正文');
  if (current.cover !== initial.cover) changedFields.push('封面');
  if (current.category !== initial.category) changedFields.push('分类');
  if (current.publishTime !== initial.publishTime) changedFields.push('发布时间');
  
  return changedFields;
};

// 生成项目版本历史数据
const generateProjectHistory = (projectTitle, currentProject = null, initialProject = null) => {
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
    { id: 'v4', time: '2024-03-18 15:30', description: '编辑了"标题"、"摘要"内容', operator: 'admin', status: 'draft' },
    { id: 'v5', time: '2024-03-15 10:00', description: '发布了项目', operator: 'admin', status: 'published' },
  ];
};

/**
 * 工程承包 - 单页面
 * 包含：类别设置 + 项目管理
 */
const BusinessEngineeringEditor = ({ 
  categories, 
  onCategoriesChange, 
  projects, 
  onProjectsChange, 
  imageLib 
}) => {
  // 当前 Tab
  const [activeTab, setActiveTab] = useState('categories');
  
  // ==================== 类别设置相关 ====================
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [draggedCatIndex, setDraggedCatIndex] = useState(null);
  const [dragOverCatIndex, setDragOverCatIndex] = useState(null);
  
  // 类别设置的未保存修改追踪
  const categoriesSavedRef = useRef(JSON.stringify(categories));
  const [hasUnsavedCategoryChanges, setHasUnsavedCategoryChanges] = useState(false);
  
  useEffect(() => {
    setHasUnsavedCategoryChanges(JSON.stringify(categories) !== categoriesSavedRef.current);
  }, [categories]);

  // 编辑类别
  const handleEditCategory = (cat) => {
    setEditingCategory({ ...cat });
    setCategoryModalOpen(true);
  };

  // 保存类别（编辑弹窗中的保存）
  const handleSaveCategory = () => {
    if (!editingCategory.title) {
      alert('请填写类别名称');
      return;
    }
    onCategoriesChange(categories.map(c => c.id === editingCategory.id ? editingCategory : c));
    setCategoryModalOpen(false);
    setEditingCategory(null);
  };
  
  // 保存类别配置（草稿）
  const handleSaveCategoryDraft = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    categoriesSavedRef.current = JSON.stringify(categories);
    setHasUnsavedCategoryChanges(false);
    console.log('类别配置已保存:', categories);
  };
  
  // 发布类别配置
  const handlePublishCategories = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    categoriesSavedRef.current = JSON.stringify(categories);
    setHasUnsavedCategoryChanges(false);
    console.log('类别配置已发布:', categories);
  };

  // 拖拽排序 - 类别
  const handleCatDragStart = (index) => setDraggedCatIndex(index);
  const handleCatDragOver = (e, index) => {
    e.preventDefault();
    if (draggedCatIndex !== null && draggedCatIndex !== index) setDragOverCatIndex(index);
  };
  const handleCatDrop = (index) => {
    if (draggedCatIndex !== null && draggedCatIndex !== index) {
      const newCats = [...categories];
      const [dragged] = newCats.splice(draggedCatIndex, 1);
      newCats.splice(index, 0, dragged);
      onCategoriesChange(newCats);
    }
    setDraggedCatIndex(null);
    setDragOverCatIndex(null);
  };
  const handleCatDragEnd = () => { setDraggedCatIndex(null); setDragOverCatIndex(null); };

  // ==================== 项目管理相关 ====================
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortField, setSortField] = useState('updateTime');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  
  // ==================== 编辑弹窗状态管理 ====================
  const [initialProject, setInitialProject] = useState(null);  // 初始值，用于对比是否有修改
  const [isSaving, setIsSaving] = useState(false);       // 保存中
  const [hasLocalChanges, setHasLocalChanges] = useState(false); // 用户是否有未保存的修改
  const [lastSavedTime, setLastSavedTime] = useState(null); // 上次保存时间
  
  // ==================== 历史记录弹窗 ====================
  const [showProjectHistoryModal, setShowProjectHistoryModal] = useState(false);
  const [showPageHistoryModal, setShowPageHistoryModal] = useState(false); // 页面级历史
  
  // ==================== 页面级操作日志 ====================
  // Mock 操作日志数据
  const MOCK_OPERATION_LOGS = [
    { 
      id: 'log_1', 
      time: '2024-12-08T15:30:00.000Z', 
      description: '发布了《某大型化肥装置建设项目》',
      operator: 'admin',
      action: 'publish',
      projectId: 'p1',
      projectTitle: '某大型化肥装置建设项目'
    },
    { 
      id: 'log_2', 
      time: '2024-12-08T14:20:00.000Z', 
      description: '更新了《某乙烯装置EPC总承包项目》',
      operator: 'admin',
      action: 'update',
      projectId: 'p2',
      projectTitle: '某乙烯装置EPC总承包项目'
    },
    { 
      id: 'log_3', 
      time: '2024-12-08T13:10:00.000Z', 
      description: '下架了《某炼化一体化项目》',
      operator: 'admin',
      action: 'unpublish',
      projectId: 'p3',
      projectTitle: '某炼化一体化项目'
    },
  ];
  
  const [pageOperationLogs, setPageOperationLogs] = useState(() => {
    // 从 localStorage 读取或初始化
    const saved = localStorage.getItem('engineering_page_operation_logs');
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
      description = `发布了《${project.title}》`;
    } else if (action === 'unpublish') {
      description = `下架了《${project.title}》`;
    } else if (action === 'update') {
      description = `更新了《${project.title}》`;
    }
    
    const newLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      time: timeStr,
      description,
      operator: 'admin', // 实际应该从用户上下文获取
      action,
      projectId: project.id,
      projectTitle: project.title,
      ...extraInfo
    };
    
    const updatedLogs = [newLog, ...pageOperationLogs].slice(0, 100); // 最多保留100条
    setPageOperationLogs(updatedLogs);
    localStorage.setItem('engineering_page_operation_logs', JSON.stringify(updatedLogs));
  };
  
  // ==================== 上架抽屉状态 ====================
  const [showPublishDrawer, setShowPublishDrawer] = useState(false);
  const [publishingProject, setPublishingProject] = useState(null); // 正在上架的项目


  // 筛选项目（同时兼容 coverImage 和 cover 字段）
  const filteredProjects = projects.map(project => {
    // 统一 cover 字段，兼容旧数据
    if (project.coverImage && !project.cover) {
      return { ...project, cover: project.coverImage };
    }
    return project;
  }).filter(project => {
    const matchSearch = searchText === '' || project.title.toLowerCase().includes(searchText.toLowerCase());
    const matchStatus = filterStatus === 'all' || project.status === filterStatus;
    const matchCategory = filterCategory === 'all' || project.category === filterCategory;
    return matchSearch && matchStatus && matchCategory;
  });

  // 排序项目
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    let aVal, bVal;
    switch (sortField) {
      case 'publishTime':
      case 'updateTime':
        aVal = a[sortField] || '';
        bVal = b[sortField] || '';
        break;
      case 'title':
        aVal = a.title || '';
        bVal = b.title || '';
        break;
      default:
        aVal = a[sortField] || '';
        bVal = b[sortField] || '';
    }
    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1;
    }
    return aVal < bVal ? 1 : -1;
  });

  // 分页
  const totalPages = Math.ceil(sortedProjects.length / pageSize);
  const paginatedProjects = sortedProjects.slice((currentPage - 1) * pageSize, currentPage * pageSize);


  // 新增项目
  const handleAddProject = () => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`;
    
    const newProject = {
      id: `eng_proj_${Date.now()}`,
      title: '',
      summary: '',
      content: '<p></p>', // 确保有默认值
      category: categories[0]?.id || '',
      cover: '',
      status: 'draft',
      publishTime: '',
      updateTime: `${dateStr} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:00`,
      displayPosition: 'normal', // 默认图文列表
      hasUnsyncedChanges: false
    };
    setEditingProject(newProject);
    setInitialProject(newProject);  // 保存初始值用于对比
    setHasLocalChanges(true); // 新项目默认为未保存状态
    setIsSaving(false);
    setLastSavedTime(null);   // 新项目没有保存时间
    setProjectModalOpen(true);
  };

  // 编辑项目
  const handleEditProject = (project) => {
    // 兼容 coverImage 和 cover 字段
    const cover = project.cover || project.coverImage || '';
    const projectData = { 
      ...project, 
      content: project.content || '<p></p>', // 确保有默认值
      cover: cover,
      displayPosition: 'normal', // 确保有 displayPosition
      hasUnsyncedChanges: project.hasUnsyncedChanges || false
    };
    // 移除 coverImage 字段，统一使用 cover
    delete projectData.coverImage;
    setEditingProject(projectData);
    setInitialProject(projectData);  // 保存初始值用于对比
    setHasLocalChanges(false); // 重置修改状态
    setIsSaving(false);
    // 设置初始保存时间为项目的更新时间
    const updateDate = project.updateTime ? new Date(project.updateTime.replace(/\//g, '-')) : new Date();
    setLastSavedTime(updateDate.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }));
    setProjectModalOpen(true);
  };

  // 删除项目
  const handleDeleteProject = (id) => {
    const project = projects.find(p => p.id === id);
    const canDelete = project && project.status === 'draft';
    if (!canDelete) {
      alert('请先下架后再删除');
      return;
    }
    if (confirm('确定删除该项目吗？')) {
      onProjectsChange(projects.filter(p => p.id !== id));
    }
  };

  // 保存项目（保存后关闭弹窗，如果是已发布项目则标记为待同步）
  const handleSaveProject = async () => {
    if (!editingProject || !editingProject.title) {
      alert('请填写项目标题');
      return;
    }
    
    setIsSaving(true);
    
    try {
      // 模拟异步保存（实际项目中这里是 API 调用）
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const now = new Date();
      const timeStr = now.toLocaleString('zh-CN', { 
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      }).replace(/\//g, '/');
      
      // 构建保存的项目对象，确保所有必需字段都存在
      const projectToSave = {
        id: editingProject.id,
        title: editingProject.title || '',
        summary: editingProject.summary || '',
        content: editingProject.content || '<p></p>', // 确保 content 有默认值
        category: editingProject.category || categories[0]?.id || '',
        cover: editingProject.cover || '', // 统一使用 cover 字段
        status: editingProject.status || 'draft',
        publishTime: editingProject.publishTime || '',
        updateTime: timeStr,
        displayPosition: 'normal', // 固定为图文列表
        // 保存时：如果原本是已发布状态，标记为有未同步的修改（待同步）
        hasUnsyncedChanges: editingProject.status === 'published' ? true : (editingProject.hasUnsyncedChanges || false)
      };
      
      // 确保 content 不为空
      if (!projectToSave.content || projectToSave.content.trim() === '' || projectToSave.content === '<br>') {
        projectToSave.content = '<p></p>';
      }
      
      // 移除可能存在的 coverImage 字段
      delete projectToSave.coverImage;
      
      const exists = projects.find(p => p.id === editingProject.id);
      if (exists) {
        // 更新现有项目
        const updatedProjects = projects.map(p => {
          if (p.id === editingProject.id) {
            const updated = { ...projectToSave };
            // 移除可能存在的 coverImage 字段
            delete updated.coverImage;
            // 确保所有必需字段都存在
            const savedProject = {
              id: updated.id,
              title: updated.title || '',
              summary: updated.summary || '',
              content: updated.content || '<p></p>',
              category: updated.category || categories[0]?.id || '',
              cover: updated.cover || '',
              status: updated.status || 'draft',
              publishTime: updated.publishTime || '',
              updateTime: updated.updateTime || timeStr,
              displayPosition: updated.displayPosition || 'normal',
              hasUnsyncedChanges: updated.hasUnsyncedChanges || false
            };
            
            // 如果项目已发布，记录更新操作
            if (savedProject.status === 'published') {
              recordOperation('update', savedProject);
            }
            
            return savedProject;
          }
          // 确保其他项目也没有 coverImage 字段，且所有必需字段都存在
          const cleaned = { ...p };
          if (cleaned.coverImage && !cleaned.cover) {
            cleaned.cover = cleaned.coverImage;
          }
          delete cleaned.coverImage;
          // 确保所有必需字段都存在
          return {
            ...cleaned,
            title: cleaned.title || '',
            summary: cleaned.summary || '',
            content: cleaned.content || '<p></p>',
            category: cleaned.category || categories[0]?.id || '',
            cover: cleaned.cover || '',
            status: cleaned.status || 'draft',
            publishTime: cleaned.publishTime || '',
            updateTime: cleaned.updateTime || '',
            displayPosition: cleaned.displayPosition || 'normal',
            hasUnsyncedChanges: cleaned.hasUnsyncedChanges || false
          };
        });
        onProjectsChange(updatedProjects);
      } else {
        // 新增项目
        onProjectsChange([projectToSave, ...projects]);
      }
      
      // 保存后关闭弹窗
      setIsSaving(false);
      setHasLocalChanges(false);
      setLastSavedTime(null);
      setProjectModalOpen(false);
      setEditingProject(null);
      setInitialProject(null);
    } catch (error) {
      console.error('保存项目失败:', error);
      alert('保存失败，请重试');
      setIsSaving(false);
    }
  };

  // ==================== 列表操作：上架/下架/同步 ====================
  
  // 检查项目是否需要封面图（图文列表需要封面）
  const needsCoverForPublish = (project) => {
    return true; // 图文列表必须要有封面
  };
  
  // 上架项目（点击发布按钮）
  const handlePublish = async (project) => {
    // 校验封面图（兼容 coverImage 和 cover 字段）
    const needsCover = needsCoverForPublish(project);
    const hasCover = !!(project.cover || project.coverImage);
    
    // 如果缺少必要信息，打开抽屉编辑
    if (needsCover && !hasCover) {
      // 统一使用 cover 字段
      const projectForDrawer = { ...project, cover: project.cover || project.coverImage || '' };
      delete projectForDrawer.coverImage;
      setPublishingProject(projectForDrawer);
      setShowPublishDrawer(true);
      return;
    }
    
    // 直接发布
    confirmPublish(project);
  };
  
  // 确认发布项目
  const confirmPublish = (project) => {
    const now = new Date();
    const timeStr = now.toLocaleString('zh-CN', { 
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    }).replace(/\//g, '/');
    
    // 统一使用 cover 字段，移除 coverImage
    const projectToPublish = {
      ...project,
      cover: project.cover || project.coverImage || '',
      status: 'published',
      hasUnsyncedChanges: false,
      publishTime: timeStr,
      updateTime: timeStr,
      displayPosition: 'normal' // 固定为图文列表
    };
    delete projectToPublish.coverImage;
    onProjectsChange(projects.map(p => p.id === project.id ? projectToPublish : p));
    
    // 记录操作日志
    recordOperation('publish', projectToPublish);
    
    setShowPublishDrawer(false);
    setPublishingProject(null);
  };
  
  // 更新抽屉中的项目配置
  const updatePublishingProject = (updates) => {
    setPublishingProject(prev => prev ? { ...prev, ...updates } : null);
  };

  // 下架项目
  const handleUnpublish = async (project) => {
    const projectToUnpublish = {
      ...project,
      status: 'draft',
      hasUnsyncedChanges: false,
      updateTime: new Date().toLocaleString('zh-CN', { 
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      }).replace(/\//g, '/')
    };
    onProjectsChange(projects.map(p => p.id === project.id ? projectToUnpublish : p));
    
    // 记录操作日志
    recordOperation('unpublish', projectToUnpublish);
  };

  // 同步项目（将本地修改同步到线上）
  const handleSync = async (project) => {
    const projectToSync = {
      ...project,
      hasUnsyncedChanges: false,
      updateTime: new Date().toLocaleString('zh-CN', { 
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      }).replace(/\//g, '/')
    };
    onProjectsChange(projects.map(p => p.id === project.id ? projectToSync : p));
    
    // 记录操作日志
    recordOperation('update', projectToSync);
  };

  // 关闭编辑弹窗
  const handleCloseModal = () => {
    setProjectModalOpen(false);
    setEditingProject(null);
    setInitialProject(null);
    setHasLocalChanges(false);
    setIsSaving(false);
    setLastSavedTime(null);
  };

  // 获取类别名称
  const getCategoryName = (categoryId) => categories.find(c => c.id === categoryId)?.title || '未分类';

  // 状态标签 - 与文章管理保持一致
  const getArticleStatus = (status, hasUnsyncedChanges) => {
    if (status === 'draft') return 'draft';
    if (status === 'published' && hasUnsyncedChanges) return 'pending';
    return 'published';
  };

  // 监听用户编辑，对比初始值和当前值
  const checkForChanges = (current, initial) => {
    if (!current || !initial) return false;
    // 对比关键字段
    return (
      current.title !== initial.title ||
      current.summary !== initial.summary ||
      current.content !== initial.content ||
      current.cover !== initial.cover ||
      current.category !== initial.category ||
      current.publishTime !== initial.publishTime
    );
  };

  // 更新编辑中的项目（简化版，不在 setState 回调中调用其他 setState）
  const updateEditingProject = (updater) => {
    setEditingProject(prev => {
      if (!prev) return prev;
      const newValue = typeof updater === 'function' ? updater(prev) : updater;
      return newValue || prev;
    });
  };
  
  // 使用 useEffect 监听 editingProject 变化来检测修改
  useEffect(() => {
    if (initialProject && editingProject) {
      setHasLocalChanges(checkForChanges(editingProject, initialProject));
    }
  }, [editingProject, initialProject]);

  // 表格列配置 - 使用类似新闻中心的表格
  const tableColumns = [
    { 
      key: 'cover', 
      title: '封面', 
      width: 100,
      render: (val, row) => {
        // 兼容 coverImage 和 cover 字段
        const cover = val || row.coverImage || '';
        return (
          <div className="w-20 h-14 rounded-xs bg-gray-3 bg-cover bg-center" style={{ backgroundImage: cover ? `url(${cover})` : undefined }}>
            {!cover && (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-gray-4" />
              </div>
            )}
          </div>
        );
      }
    },
    { 
      key: 'title', 
      title: '标题', 
      width: 180,
      render: (val) => <span className="text-body text-gray-7 line-clamp-2">{val || '-'}</span>
    },
    { 
      key: 'summary', 
      title: '简介', 
      width: 220,
      render: (val) => <span className="text-caption text-gray-6 line-clamp-2">{val || '-'}</span>
    },
    { 
      key: 'category', 
      title: '分类', 
      width: 100,
      render: (val) => {
        const categoryName = val ? getCategoryName(val) : '未分类';
        return (
          <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-normal bg-[#EFF6FF] text-[#155DFC]">
            {categoryName}
          </span>
        );
      }
    },
    { 
      key: 'publishTime', 
      title: '发布时间', 
      width: 140,
      sortable: true,
      render: (val, row) => {
        // 未上线(draft)：发布时间为空
        if (row.status === 'draft') {
          return <span className="text-caption text-gray-4">-</span>;
        }
        // 已上线/待更新：显示发布时间
        if (!val) {
          return <span className="text-caption text-gray-4">-</span>;
        }
        // 处理不同格式的时间字符串
        let formatted = '-';
        if (typeof val === 'string') {
          // 处理 ISO 格式: 2024-01-15T00:00:00
          if (val.includes('T')) {
            const date = new Date(val);
            if (!isNaN(date.getTime())) {
              formatted = date.toLocaleString('zh-CN', { 
                year: 'numeric', 
                month: '2-digit', 
                day: '2-digit',
                hour: '2-digit', 
                minute: '2-digit'
              }).replace(/\//g, '-');
            }
          } else {
            // 处理其他格式: 2024/01/15 00:00:00 或 2024-01-15 00:00:00
            const parts = val.split(' ');
            if (parts.length >= 2) {
              formatted = `${parts[0]?.replace(/\//g, '-')} ${parts[1]?.slice(0, 5)}`;
            } else if (parts.length === 1) {
              formatted = parts[0]?.replace(/\//g, '-');
            }
          }
        }
        return <span className="text-caption text-gray-6">{formatted}</span>;
      }
    },
    { 
      key: 'updateTime', 
      title: '修改时间', 
      width: 140,
      sortable: true,
      render: (val, row) => {
        const projectStatus = getArticleStatus(row.status, row.hasUnsyncedChanges);
        // 已上线（完美同步）：修改时间 = 发布时间
        if (projectStatus === 'published') {
          const publishTime = row.publishTime;
          if (!publishTime) {
            return <span className="text-caption text-gray-4">-</span>;
          }
          // 处理不同格式的时间字符串
          let formatted = '-';
          if (typeof publishTime === 'string') {
            if (publishTime.includes('T')) {
              const date = new Date(publishTime);
              if (!isNaN(date.getTime())) {
                formatted = date.toLocaleString('zh-CN', { 
                  year: 'numeric', 
                  month: '2-digit', 
                  day: '2-digit',
                  hour: '2-digit', 
                  minute: '2-digit'
                }).replace(/\//g, '-');
              }
            } else {
              const parts = publishTime.split(' ');
              if (parts.length >= 2) {
                formatted = `${parts[0]?.replace(/\//g, '-')} ${parts[1]?.slice(0, 5)}`;
              } else if (parts.length === 1) {
                formatted = parts[0]?.replace(/\//g, '-');
              }
            }
          }
          return <span className="text-caption text-gray-6">{formatted}</span>;
        }
        // 未上线/待更新：显示上次保存时间
        if (!val) {
          return <span className="text-caption text-gray-4">-</span>;
        }
        // 处理不同格式的时间字符串
        let formatted = '-';
        if (typeof val === 'string') {
          if (val.includes('T')) {
            const date = new Date(val);
            if (!isNaN(date.getTime())) {
              formatted = date.toLocaleString('zh-CN', { 
                year: 'numeric', 
                month: '2-digit', 
                day: '2-digit',
                hour: '2-digit', 
                minute: '2-digit'
              }).replace(/\//g, '-');
            }
          } else {
            const parts = val.split(' ');
            if (parts.length >= 2) {
              formatted = `${parts[0]?.replace(/\//g, '-')} ${parts[1]?.slice(0, 5)}`;
            } else if (parts.length === 1) {
              formatted = parts[0]?.replace(/\//g, '-');
            }
          }
        }
        return <span className="text-caption text-gray-6">{formatted}</span>;
      }
    },
    { 
      key: 'status', 
      title: '状态', 
      width: 90,
      render: (val, row) => {
        const status = val || 'draft';
        const hasUnsyncedChanges = row.hasUnsyncedChanges || false;
        return (
          <StatusChip 
            status={getArticleStatus(status, hasUnsyncedChanges)} 
            showDot={false} 
            showTooltip={true}
            scene="article"
          />
        );
      }
    },
    { 
      key: 'actions', 
      title: '操作', 
      width: 160,
      render: (_, row) => {
        const projectStatus = getArticleStatus(row.status, row.hasUnsyncedChanges);
        // 草稿/下线状态
        const isDraft = projectStatus === 'draft';
        // 已上线（完美同步）
        const isPublished = projectStatus === 'published';
        // 待更新（有未发布的修改）
        const isPending = projectStatus === 'pending';
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
              onClick={() => handleEditProject(row)} 
              className="p-1.5 text-gray-5 hover:text-brand hover:bg-brand/10 rounded transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            
            {/* 删除按钮 - 仅图标，根据状态控制可用性 */}
            <div className="relative group/delete">
              <button 
                onClick={() => canDelete && handleDeleteProject(row.id)} 
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
      {/* 类别设置 Tab - 使用 EditorLayout */}
      {activeTab === 'categories' ? (
        <EditorLayout
          title="工程承包"
          description="管理工程承包业务类别与项目明细，支持按类别筛选和状态管理。"
          pageKey="engineering_categories"
          onSave={handlePublishCategories}
          onSaveDraft={handleSaveCategoryDraft}
          hasUnsavedChanges={hasUnsavedCategoryChanges}
          historyData={[
            { id: 'h1', time: '2024-03-20 14:30', description: '更新了类别设置', operator: 'admin', status: 'published' },
            { id: 'h2', time: '2024-03-18 10:00', description: '修改了类别顺序', operator: 'admin', status: 'published' },
          ]}
        >
          {/* Tab 切换 - 在 EditorLayout 内部 */}
          <div className="mb-lg">
            <div className="flex gap-1">
              <button 
                onClick={() => setActiveTab('categories')}
                className={`px-md py-xs rounded-sm text-body font-medium transition-all ${
                  activeTab === 'categories' 
                    ? 'bg-brand-light text-brand' 
                    : 'text-gray-7 hover:text-gray-8 hover:bg-gray-3'
                }`}
              >
                类别设置
              </button>
              <button 
                onClick={() => setActiveTab('projects')}
                className={`px-md py-xs rounded-sm text-body font-medium transition-all ${
                  activeTab === 'projects' 
                    ? 'bg-brand-light text-brand' 
                    : 'text-gray-7 hover:text-gray-8 hover:bg-gray-3'
                }`}
              >
                工程承包明细
              </button>
            </div>
          </div>

          {/* 类别设置内容 */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-md">
            {categories.map((cat, index) => (
              <div 
                key={cat.id}
                draggable
                onDragStart={() => handleCatDragStart(index)}
                onDragOver={(e) => handleCatDragOver(e, index)}
                onDrop={() => handleCatDrop(index)}
                onDragEnd={handleCatDragEnd}
                className={`relative group rounded-md overflow-hidden border transition-all cursor-move ${
                  draggedCatIndex === index ? 'opacity-50 border-brand' : dragOverCatIndex === index ? 'border-brand' : 'border-gray-4 hover:border-gray-5 hover:shadow-light'
                }`}
              >
                <div 
                  className="aspect-[16/10] bg-gray-3 bg-cover bg-center relative"
                  style={{ backgroundImage: cat.coverImage ? `url(${cat.coverImage})` : undefined }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute top-2 left-2 p-1 bg-black/30 rounded text-white/70 opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical className="w-4 h-4" />
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleEditCategory(cat); }}
                    className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-sm text-gray-7 hover:bg-white hover:text-brand transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 p-md">
                    <h3 className="text-section font-semibold text-white drop-shadow-lg">{cat.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </EditorLayout>
      ) : (
        /* 工程承包明细 Tab - 保持原有布局 */
        <div className="bg-white rounded-md border border-gray-4">
          {/* PageBanner */}
          <PageBanner 
            title="工程承包"
            description="管理工程承包业务类别与项目明细，支持按类别筛选和状态管理。"
            buttonText="新增项目"
            buttonIcon="add"
            onButtonClick={handleAddProject}
            onHistoryClick={() => setShowPageHistoryModal(true)}
          />

          {/* Tab 切换 */}
          <div className="px-xl py-md border-t border-gray-4">
            <div className="flex gap-1">
              <button 
                onClick={() => setActiveTab('categories')}
                className={`px-md py-xs rounded-sm text-body font-medium transition-all ${
                  activeTab === 'categories' 
                    ? 'bg-brand-light text-brand' 
                    : 'text-gray-7 hover:text-gray-8 hover:bg-gray-3'
                }`}
              >
                类别设置
              </button>
              <button 
                onClick={() => setActiveTab('projects')}
                className={`px-md py-xs rounded-sm text-body font-medium transition-all ${
                  activeTab === 'projects' 
                    ? 'bg-brand-light text-brand' 
                    : 'text-gray-7 hover:text-gray-8 hover:bg-gray-3'
                }`}
              >
                工程承包明细
              </button>
            </div>
          </div>

        {/* ==================== 项目管理 Tab ==================== */}
        {activeTab === 'projects' && (
          <>
            {/* 搜索和筛选栏 - 使用通用组件 */}
            <SearchFilterBar
              searchText={searchText}
              onSearchChange={setSearchText}
              searchPlaceholder="搜索标题..."
              sortOptions={[
                { id: 'publishTime', label: '发布时间' },
                { id: 'updateTime', label: '修改时间' },
                { id: 'title', label: '标题' }
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
                },
                {
                  id: 'category',
                  label: '分类',
                  type: 'select',
                  value: filterCategory,
                  options: [
                    { value: 'all', label: '全部类别' },
                    ...categories.map(cat => ({ value: cat.id, label: cat.title }))
                  ]
                }
              ]}
              onFilterChange={(fieldId, value) => {
                if (fieldId === 'status') setFilterStatus(value);
                if (fieldId === 'category') setFilterCategory(value);
              }}
              onFilterReset={() => {
                setFilterStatus('all');
                setFilterCategory('all');
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
                total={sortedProjects.length}
                onPageChange={setCurrentPage}
                emptyText="暂无项目数据"
                minWidth={1000}
              />
            </div>
          </>
        )}
        </div>
      )}

      {/* ==================== 类别编辑弹窗 ==================== */}
      <Modal
        isOpen={categoryModalOpen}
        onClose={() => { setCategoryModalOpen(false); setEditingCategory(null); }}
        title="编辑类别"
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setCategoryModalOpen(false)}>取消</Button>
            <Button variant="primary" onClick={handleSaveCategory}>保存</Button>
          </>
        }
      >
        {editingCategory && (
          <div className="space-y-md">
            <FormItem label="类别名称" required>
              <Input value={editingCategory.title} onChange={e => setEditingCategory({...editingCategory, title: e.target.value})} placeholder="请输入类别名称" />
            </FormItem>
            <ImageSelector 
              label="封面图片（建议比例 16:10）" 
              value={editingCategory.coverImage ? { url: editingCategory.coverImage } : null}
              onChange={img => setEditingCategory({...editingCategory, coverImage: img?.url || ''})}
              library={imageLib}
            />
          </div>
        )}
      </Modal>

      {/* ==================== 项目编辑弹窗 - 沉浸式写作布局 ==================== */}
      <Modal
        isOpen={projectModalOpen}
        onClose={handleCloseModal}
        title={projects.find(p => p.id === editingProject?.id) ? '编辑项目' : '新增项目'}
        size="4xl"
      >
        {editingProject && (
          <div className="flex flex-col h-[75vh]">
            {/* 主内容区 - 左右分栏 */}
            <div className="flex-1 flex overflow-hidden">
              
              {/* 左侧：表单编辑区 (约65%) */}
              <div className="flex-[65] overflow-y-auto pr-8 space-y-5">
                
                {/* 标题字段 */}
                <div>
                  <label className="block text-sm text-gray-6 mb-2">
                    标题 <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    value={editingProject.title || ''}
                    onChange={e => {
                      const value = e.target.value.slice(0, 50);
                      updateEditingProject(prev => prev ? {...prev, title: value} : prev);
                    }}
                    placeholder="请输入项目标题"
                    maxLength={50}
                    className="w-full px-4 py-3 border border-gray-3 rounded-lg text-text-primary placeholder-text-placeholder focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors"
                  />
                  <div className="flex justify-between mt-1.5 text-xs text-gray-5">
                    <span>{editingProject.title?.length || 0} 字符</span>
                    <span>最多 50 字符</span>
                  </div>
                </div>

                {/* 摘要字段 */}
                <div>
                  <label className="block text-sm text-gray-6 mb-2">
                    摘要
                  </label>
                  <div className="relative">
                    <textarea
                      value={editingProject.summary || ''}
                      onChange={e => {
                        const value = e.target.value.slice(0, 100);
                        updateEditingProject(prev => prev ? {...prev, summary: value} : prev);
                      }}
                      placeholder="请输入项目摘要（选填）"
                      rows={3}
                      maxLength={100}
                      className="w-full px-4 py-3 border border-gray-3 rounded-lg text-text-primary placeholder-text-placeholder focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors resize-none"
                    />
                    <button className="absolute right-3 top-3 flex items-center gap-1 px-2 py-1 text-xs text-brand hover:bg-brand/10 rounded transition-colors">
                      <Sparkles className="w-3 h-3" />
                      AI 生成
                    </button>
                  </div>
                  <div className="flex justify-between mt-1.5 text-xs text-gray-5">
                    <span>{editingProject.summary?.length || 0} 字符</span>
                    <span>最多 100 字符</span>
                  </div>
                </div>

                {/* 正文字段 */}
                <div className="flex-1 flex flex-col">
                  <label className="block text-sm text-gray-6 mb-2">
                    正文 <span className="text-error">*</span>
                  </label>
                  <div className="flex-1 border border-gray-3 rounded-lg overflow-hidden bg-white">
                    {/* 工具栏 */}
                    <div className="flex items-center gap-0.5 px-3 py-2 border-b border-gray-3 bg-gray-1">
                      <select className="px-2 py-1 text-sm text-gray-6 bg-transparent border-none outline-none cursor-pointer hover:bg-gray-3 rounded">
                        <option>正文</option>
                        <option>标题 1</option>
                        <option>标题 2</option>
                      </select>
                      <div className="w-px h-4 bg-gray-3 mx-2" />
                      <button className="p-1.5 hover:bg-gray-3 rounded transition-colors" title="加粗"><Bold className="w-4 h-4 text-gray-6" /></button>
                      <button className="p-1.5 hover:bg-gray-3 rounded transition-colors" title="斜体"><Italic className="w-4 h-4 text-gray-6" /></button>
                      <button className="p-1.5 hover:bg-gray-3 rounded transition-colors" title="下划线"><Underline className="w-4 h-4 text-gray-6" /></button>
                      <div className="w-px h-4 bg-gray-3 mx-2" />
                      <button className="p-1.5 hover:bg-gray-3 rounded transition-colors" title="插入图片"><ImageIcon className="w-4 h-4 text-gray-6" /></button>
                      <div className="flex-1" />
                      <span className="text-xs text-gray-5">+ 插入</span>
                    </div>
                    {/* 编辑区域 */}
                    <div className="p-4 min-h-[280px]">
                      <div 
                        className="text-sm text-text-primary leading-relaxed outline-none min-h-[260px] focus:outline-none"
                        contentEditable
                        suppressContentEditableWarning
                        onInput={e => {
                          const html = e.currentTarget.innerHTML;
                          updateEditingProject(prev => prev ? {...prev, content: html || '<p></p>'} : prev);
                        }}
                        onBlur={e => {
                          const html = e.target.innerHTML;
                          updateEditingProject(prev => prev ? {...prev, content: html || '<p></p>'} : prev);
                        }}
                        dangerouslySetInnerHTML={{ __html: editingProject.content || '<p></p>' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 右侧：配置区 (约35%) - 只保留封面选择，去掉展示位选择 */}
              <div className="flex-[35] overflow-y-auto pl-8 border-l border-gray-3">
                <div className="space-y-6">
                  {/* 封面图上传 - 必填 */}
                  <CoverUploader 
                    cover={editingProject.cover || ''}
                    onCoverChange={(val) => updateEditingProject(prev => prev ? {...prev, cover: val} : prev)}
                    required={true}
                    hint={!editingProject.cover ? '请上传封面图（图文列表必须要有封面）' : null}
                    recommendedSize="1200×675px"
                  />
                  
                  {/* 所属类别 */}
                  <div>
                    <label className="block text-sm text-gray-6 mb-2">
                      所属类别
                    </label>
                    <select
                      value={editingProject.category}
                      onChange={e => updateEditingProject(prev => prev ? {...prev, category: e.target.value} : prev)}
                      className="w-full px-4 py-3 border border-gray-3 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors cursor-pointer"
                    >
                      {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.title}</option>)}
                    </select>
                  </div>
                  
                  {/* 提示信息 */}
                  <div className="flex items-start gap-2 text-xs text-gray-5 bg-gray-1 rounded-lg px-3 py-2.5">
                    <ImageIcon className="w-4 h-4 flex-shrink-0 mt-0.5 text-gray-4" />
                    <span>工程承包明细统一采用图文列表样式展示，展示位置固定为"图文列表"。</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 底部状态栏 - 简化版：只显示保存状态 + 保存按钮 */}
            <div className="flex-shrink-0 mt-4 pt-4 border-t border-gray-3 flex items-center justify-between">
              {/* 左侧：保存状态（纯文字） */}
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
                  onClick={handleSaveProject}
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
        title={editingProject ? `《${editingProject.title}》 - 版本历史` : '版本历史'}
        mode="editor"
        records={editingProject ? generateProjectHistory(editingProject.title, editingProject, initialProject) : []}
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
        title="工程承包 - 操作日志"
        mode="article"
        records={pageOperationLogs}
      />

      {/* 上架配置抽屉 */}
      {showPublishDrawer && publishingProject && (
        <div className="fixed inset-0 z-[60] flex">
          {/* 遮罩层 */}
          <div 
            className="absolute inset-0 bg-gray-8/40 backdrop-blur-sm"
            onClick={() => { setShowPublishDrawer(false); setPublishingProject(null); }}
          />
          
          {/* 抽屉内容 - 从右侧滑入 */}
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-strong flex flex-col animate-in slide-in-from-right duration-300">
            {/* 抽屉头部 */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-3">
              <div>
                <h3 className="text-section text-gray-8">发布配置</h3>
                <p className="text-caption text-gray-5 mt-1">请完善封面图片后发布</p>
              </div>
              <button 
                onClick={() => { setShowPublishDrawer(false); setPublishingProject(null); }}
                className="p-1.5 text-gray-5 hover:text-gray-7 hover:bg-gray-2 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* 项目信息 */}
            <div className="px-6 py-4 bg-gray-1 border-b border-gray-3">
              <div className="text-sm text-gray-6">正在发布</div>
              <div className="text-body font-medium text-gray-8 mt-1 line-clamp-2">{publishingProject.title}</div>
            </div>
            
            {/* 配置内容 - 只显示封面选择 */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <CoverUploader 
                cover={publishingProject.cover || ''}
                onCoverChange={(val) => updatePublishingProject({ cover: val })}
                required={true}
                hint={!publishingProject.cover ? '请上传封面图（图文列表必须要有封面）' : null}
                recommendedSize="1200×675px"
              />
            </div>
            
            {/* 抽屉底部 */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-3 bg-white">
              <button
                onClick={() => { setShowPublishDrawer(false); setPublishingProject(null); }}
                className="px-4 py-2 text-sm text-gray-6 hover:text-gray-7 hover:bg-gray-2 rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => {
                  // 先保存配置到列表
                  onProjectsChange(projects.map(p => p.id === publishingProject.id ? {
                    ...p,
                    cover: publishingProject.cover
                  } : p));
                  // 再发布
                  confirmPublish(publishingProject);
                }}
                disabled={!publishingProject.cover}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  !publishingProject.cover
                    ? 'bg-gray-3 text-gray-5 cursor-not-allowed'
                    : 'bg-brand text-white hover:bg-brand-active'
                }`}
              >
                <ArrowUpCircle className="w-4 h-4" />
                确认发布
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BusinessEngineeringEditor;
