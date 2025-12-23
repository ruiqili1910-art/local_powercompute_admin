import { useState, useRef, useEffect } from 'react';
import { Edit2, Trash2, Plus, ImageIcon, Sparkles, Bold, Italic, Underline, ArrowDownCircle, Calendar, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { FormItem, Input, TextArea, ImageSelector, EditorLayout, Button, Modal, SearchFilterBar, StatusChip, UnifiedHistoryModal } from '../ui';
import { CoverUploader } from './ArticleSidebarConfig';

// 检测活动修改的字段
const detectChangedFields = (current, initial) => {
  if (!current || !initial) return [];
  const changedFields = [];
  
  if (current.title !== initial.title) changedFields.push('标题');
  if (current.summary !== initial.summary) changedFields.push('摘要');
  if (current.content !== initial.content) changedFields.push('正文');
  if (current.cover !== initial.cover) changedFields.push('封面');
  if (current.publishTime !== initial.publishTime) changedFields.push('发布时间');
  
  return changedFields;
};

// 核心价值观卡片初始数据
const INITIAL_VALUES = {
  mission: { title: '我们的使命', content: '通过建设国际领工程公司，不断满足员工物质文化需求，让员工分享公司的发展成果，提高公司员工的社会地位。' },
  vision: { title: '我们的愿景', content: '社会和谐、企业发展、员工幸福。' },
  valueCore: { title: '我们的价值观', content: '企业以员工为本，员工与企业共荣。' },
  cards: [
    { id: 'card_1', icon: 'target', title: '发展目标', content: '建设成为具有全球竞争力的投资、建设、运营一体化国际型工程公司。' },
    { id: 'card_2', icon: 'info', title: '企业宗旨', content: '让业主满意、对社会负责、促企业发展。' },
    { id: 'card_3', icon: 'star', title: '企业精神', content: '创新、诚信、务实、高效。' },
    { id: 'card_4', icon: 'users', title: '企业人才观', content: '广聚人才、人尽其用、造就一流员工队伍。' },
  ],
  image: '/images/culture/values.jpg'
};

// 文化活动初始数据
const INITIAL_ACTIVITIES = [
  { id: 'act_1', title: '办公室分工会《歌唱祖国》', summary: '全体员工参与户外拓展训练，增进团队凝聚力', content: '', cover: '', publishTime: '2023-06-15 10:00', updateTime: '2023-06-15 10:00', status: 'published' },
  { id: 'act_2', title: '技术分享会', summary: '前沿技术交流，促进知识共享与技能提升', content: '', cover: '', publishTime: '2023-07-22 14:00', updateTime: '2023-07-22 14:00', status: 'published' },
  { id: 'act_3', title: '公益志愿活动', summary: '回馈社会，践行企业社会责任', content: '', cover: '', publishTime: '2023-08-10 09:00', updateTime: '2023-08-10 09:00', status: 'published' },
];

// 员工风采初始数据
const INITIAL_STAFF = [
  { id: 'staff_1', name: '侯丽菲', title: '中东公司综合部支书记/副经理', summary: '融情西海筑梦中东的先锋者', content: '在公司的发展历程中，侯丽菲同志始终坚守岗位，以饱满的热情投入到各项工作中...', image: '', status: 'published', hasUnsyncedChanges: false, publishTime: '2023-06-15 10:00', updateTime: '2023-06-15 10:00' },
  { id: 'staff_2', name: '苏涛', title: '中东公司综合部支书记/副经理', summary: '己青年之姿，承工运精神', content: '苏涛同志是新一代工程人的杰出代表，在工作中展现出了卓越的专业素养...', image: '', status: 'published', hasUnsyncedChanges: false, publishTime: '2023-07-22 14:00', updateTime: '2023-07-22 14:00' },
  { id: 'staff_3', name: '马向前', title: '公司分公司/太原粤华中心/工程部长', summary: '焊火不息，匠心永铸；百年工运，再续华章！', content: '马向前同志深耕一线多年，用精湛的技艺和无私的奉献诠释着工匠精神...', image: '', status: 'published', hasUnsyncedChanges: false, publishTime: '2023-08-10 09:00', updateTime: '2023-08-10 09:00' },
  { id: 'staff_4', name: '解恒伟', title: '中东公司综合部支书记/副经理', summary: '七化建写真', content: '解恒伟同志在岗位上兢兢业业，为公司的发展做出了突出贡献...', image: '', status: 'published', hasUnsyncedChanges: false, publishTime: '2023-09-05 11:00', updateTime: '2023-09-05 11:00' },
];

const CultureCompanyEditor = ({ data = {}, onChange, imageLib = [], newsList = [] }) => {
  const [activeTab, setActiveTab] = useState('values');
  
  // 核心价值观状态
  const [values, setValues] = useState(
    typeof data.values === 'object' && data.values !== null ? data.values : INITIAL_VALUES
  );
  
  // 文化活动状态
  const [activities, setActivities] = useState(
    Array.isArray(data.activities) ? data.activities : INITIAL_ACTIVITIES.map(act => ({
      ...act,
      hasUnsyncedChanges: false,
      hasUnsavedChanges: false, // 追踪是否有未保存的修改
      displayPosition: 'normal' // 默认图片展示
    }))
  );
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('publishTime');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12; // 每页12个卡片（3x4布局）
  
  // 员工风采搜索、筛选、排序状态
  const [staffSearchText, setStaffSearchText] = useState('');
  const [staffFilterStatus, setStaffFilterStatus] = useState('all');
  const [staffSortBy, setStaffSortBy] = useState('publishTime');
  const [staffSortOrder, setStaffSortOrder] = useState('desc');
  const [staffCurrentPage, setStaffCurrentPage] = useState(1);
  const staffPageSize = 12; // 每页12个卡片（3x4布局）
  
  // 员工风采状态
  const [staff, setStaff] = useState(
    Array.isArray(data.staff) ? data.staff.map(s => ({
      ...s,
      status: s.status || 'published',
      hasUnsyncedChanges: s.hasUnsyncedChanges || false,
      hasUnsavedChanges: s.hasUnsavedChanges || false, // 追踪是否有未保存的修改
      publishTime: s.publishTime || '',
      updateTime: s.updateTime || ''
    })) : INITIAL_STAFF.map(s => ({
      ...s,
      hasUnsavedChanges: false
    }))
  );
  
  // 弹窗状态
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  
  // ==================== 编辑弹窗状态管理 ====================
  const [initialActivity, setInitialActivity] = useState(null);  // 初始值，用于对比是否有修改
  const [isSavingActivity, setIsSavingActivity] = useState(false);       // 保存中
  const [hasLocalChanges, setHasLocalChanges] = useState(false); // 用户是否有未保存的修改
  const [lastSavedTime, setLastSavedTime] = useState(null); // 上次保存时间
  const [showActivityHistoryModal, setShowActivityHistoryModal] = useState(false); // 活动历史记录
  const [showStaffHistoryModal, setShowStaffHistoryModal] = useState(false); // 员工风采历史记录
  
  // 编辑卡片弹窗
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  
  // 员工编辑弹窗
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  // 记录上次保存的数据快照（分别追踪每个Tab）
  const savedValuesRef = useRef(null);
  const savedActivitiesRef = useRef(null);
  const savedStaffRef = useRef(null);
  
  // 记录上次发布的数据快照（用于判断未更新状态）
  const publishedValuesRef = useRef(null);
  const publishedActivitiesRef = useRef(null);
  const publishedStaffRef = useRef(null);
  
  // 初始化ref（只在组件首次加载时执行）
  useEffect(() => {
    if (savedValuesRef.current === null) {
      savedValuesRef.current = JSON.stringify(values);
      savedActivitiesRef.current = JSON.stringify(activities);
      savedStaffRef.current = JSON.stringify(staff);
      publishedValuesRef.current = JSON.stringify(values);
      publishedActivitiesRef.current = JSON.stringify(activities);
      publishedStaffRef.current = JSON.stringify(staff);
    }
  }, []); // 空依赖数组，只在首次渲染时执行
  
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // 每个Tab的未保存状态
  const [hasUnsavedValues, setHasUnsavedValues] = useState(false);
  const [hasUnsavedActivities, setHasUnsavedActivities] = useState(false);
  const [hasUnsavedStaff, setHasUnsavedStaff] = useState(false);
  
  // 每个Tab的未更新状态（已保存但未发布）
  const [hasPendingValues, setHasPendingValues] = useState(false);
  const [hasPendingActivities, setHasPendingActivities] = useState(false);
  const [hasPendingStaff, setHasPendingStaff] = useState(false);

  // 监听数据变化 - 分别追踪每个Tab
  useEffect(() => {
    // 确保ref已初始化
    if (savedValuesRef.current === null) return;
    
    const currentData = JSON.stringify({ values, activities, staff });
    const savedData = JSON.stringify({
      values: JSON.parse(savedValuesRef.current),
      activities: JSON.parse(savedActivitiesRef.current),
      staff: JSON.parse(savedStaffRef.current)
    });
    setHasUnsavedChanges(currentData !== savedData);
    
    // 检查每个Tab的未保存状态
    // 核心价值观：基于是否有编辑（与保存快照对比）
    const valuesUnsaved = JSON.stringify(values) !== savedValuesRef.current;
    // 精彩文化活动、员工风采：基于卡片是否有"有未保存的修改"（hasUnsavedChanges）
    const activitiesUnsaved = activities.some(act => act.hasUnsavedChanges);
    const staffUnsaved = staff.some(s => s.hasUnsavedChanges);
    
    setHasUnsavedValues(valuesUnsaved);
    setHasUnsavedActivities(activitiesUnsaved);
    setHasUnsavedStaff(staffUnsaved);
    
    // 检查每个Tab的未更新状态（已保存但未发布）
    // 当底部显示"待同步"时，如果Tab已保存，应该显示蓝色小圆点
    const valuesSaved = JSON.stringify(values) === savedValuesRef.current;
    const valuesPublished = JSON.stringify(values) === publishedValuesRef.current;
    setHasPendingValues(valuesSaved && !valuesPublished && !valuesUnsaved);
    
    // 精彩文化活动：检查是否有待更新的活动（已保存配置但未发布）
    const activitiesSaved = JSON.stringify(activities) === savedActivitiesRef.current;
    const activitiesPublished = JSON.stringify(activities) === publishedActivitiesRef.current;
    setHasPendingActivities(
      activitiesSaved && 
      !activitiesPublished && 
      !activitiesUnsaved
    );
    
    // 员工风采：检查是否有待更新的员工（已保存配置但未发布）
    const staffSaved = JSON.stringify(staff) === savedStaffRef.current;
    const staffPublished = JSON.stringify(staff) === publishedStaffRef.current;
    setHasPendingStaff(staffSaved && !staffPublished && !staffUnsaved);
  }, [values, activities, staff]);

  // 保存配置
  const handleSaveDraft = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 将文化活动、员工风采的hasUnsavedChanges改为false，hasUnsyncedChanges改为true（标记为"待更新"）
    // 只对有修改的卡片进行更新
    const updatedActivities = activities.map(act => {
      if (act.hasUnsavedChanges) {
        return {
          ...act,
          hasUnsavedChanges: false,
          hasUnsyncedChanges: true, // 保存后标记为待更新
          // 如果是新建的活动（status 是 draft），保存配置后改为 published，这样才能显示"待更新"
          status: act.status === 'draft' ? 'published' : act.status
        };
      }
      return act; // 没有修改的卡片保持原样
    });
    const updatedStaff = staff.map(s => {
      if (s.hasUnsavedChanges) {
        return {
          ...s,
          hasUnsavedChanges: false,
          hasUnsyncedChanges: true, // 保存后标记为待更新
          // 如果是新建的员工（status 是 draft），保存配置后改为 published，这样才能显示"待更新"
          status: s.status === 'draft' ? 'published' : s.status
        };
      }
      return s; // 没有修改的卡片保持原样
    });
    
    setActivities(updatedActivities);
    setStaff(updatedStaff);
    
    if (onChange) {
      onChange({ ...data, values, activities: updatedActivities, staff: updatedStaff });
    }
    console.log('企业文化配置已保存');
    // 更新每个Tab的保存快照（但不更新发布快照，这样会触发"待同步"状态）
    savedValuesRef.current = JSON.stringify(values);
    savedActivitiesRef.current = JSON.stringify(updatedActivities);
    savedStaffRef.current = JSON.stringify(updatedStaff);
    setHasUnsavedChanges(false);
    // 注意：不更新publishedRef，这样会保持"待同步"状态
  };

  // 发布更新
  const handleSave = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 发布后，清除所有状态标志（显示"已上线"）
    const updatedActivities = activities.map(act => ({
      ...act,
      hasUnsavedChanges: false,
      hasUnsyncedChanges: false,
      // 确保所有活动都是 published 状态
      status: 'published'
    }));
    const updatedStaff = staff.map(s => ({
      ...s,
      hasUnsavedChanges: false,
      hasUnsyncedChanges: false,
      // 确保所有员工都是 published 状态
      status: 'published'
    }));
    
    setActivities(updatedActivities);
    setStaff(updatedStaff);
    
    if (onChange) {
      onChange({ ...data, values, activities: updatedActivities, staff: updatedStaff });
    }
    console.log('企业文化已发布');
    // 更新每个Tab的保存快照和发布快照
    savedValuesRef.current = JSON.stringify(values);
    savedActivitiesRef.current = JSON.stringify(updatedActivities);
    savedStaffRef.current = JSON.stringify(updatedStaff);
    publishedValuesRef.current = JSON.stringify(values);
    publishedActivitiesRef.current = JSON.stringify(updatedActivities);
    publishedStaffRef.current = JSON.stringify(updatedStaff);
    setHasUnsavedChanges(false);
  };

  // ==================== 文化活动相关 ====================
  
  // 筛选活动
  const filteredActivities = activities.filter(act => {
    const matchSearch = searchText === '' || act.title.toLowerCase().includes(searchText.toLowerCase());
    const matchStatus = filterStatus === 'all' || act.status === filterStatus;
    return matchSearch && matchStatus;
  });

  // 排序活动
  const sortedActivities = [...filteredActivities].sort((a, b) => {
    let aVal = a[sortBy] || '';
    let bVal = b[sortBy] || '';
    if (sortBy === 'publishTime' || sortBy === 'updateTime') {
      aVal = new Date(aVal || 0).getTime();
      bVal = new Date(bVal || 0).getTime();
    }
    return sortOrder === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
  });

  // 分页
  const paginatedActivities = sortedActivities.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalActivityPages = Math.ceil(sortedActivities.length / pageSize);
  
  // 员工风采筛选
  const filteredStaff = staff.filter(s => {
    const matchSearch = staffSearchText === '' || 
      (s.name && s.name.toLowerCase().includes(staffSearchText.toLowerCase())) ||
      (s.title && s.title.toLowerCase().includes(staffSearchText.toLowerCase())) ||
      (s.summary && s.summary.toLowerCase().includes(staffSearchText.toLowerCase()));
    const matchStatus = staffFilterStatus === 'all' || s.status === staffFilterStatus;
    return matchSearch && matchStatus;
  });

  // 员工风采排序
  const sortedStaff = [...filteredStaff].sort((a, b) => {
    let aVal = a[staffSortBy] || '';
    let bVal = b[staffSortBy] || '';
    if (staffSortBy === 'publishTime' || staffSortBy === 'updateTime') {
      aVal = new Date(aVal || 0).getTime();
      bVal = new Date(bVal || 0).getTime();
    } else if (staffSortBy === 'name') {
      aVal = (a.name || '').toLowerCase();
      bVal = (b.name || '').toLowerCase();
    }
    return staffSortOrder === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
  });
  
  // 员工风采分页
  const paginatedStaff = sortedStaff.slice((staffCurrentPage - 1) * staffPageSize, staffCurrentPage * staffPageSize);
  const totalStaffPages = Math.ceil(sortedStaff.length / staffPageSize);
  
  // 格式化日期显示（从 publishTime 提取日期部分）
  const formatActivityDate = (publishTime) => {
    if (!publishTime) return '';
    try {
      // 处理格式如 "2023-06-15 10:00" 或 "2023/06/15 10:00"
      const dateStr = publishTime.split(' ')[0].replace(/\//g, '-');
      return dateStr;
    } catch {
      return publishTime.split(' ')[0] || '';
    }
  };

  // 状态标签 - 与文章管理保持一致（使用 getArticleStatus 函数）
  const getArticleStatus = (status, hasUnsyncedChanges, hasUnsavedChanges = false) => {
    // 如果有未保存的修改，优先显示黄色"有未保存的修改"（无论是草稿还是已发布）
    if (hasUnsavedChanges) return 'unsaved';
    // 如果是草稿且没有未保存的修改，显示"未上线"
    if (status === 'draft') return 'draft';
    // 如果有未同步的修改（已保存但未发布），显示"待更新"
    if (status === 'published' && hasUnsyncedChanges) return 'pending';
    // 已上线
    return 'published';
  };
  
  // 新建活动
  const handleAddActivity = () => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`;
    
    const newActivity = {
      id: `act_${Date.now()}`,
      title: '',
      summary: '',
      content: '<p></p>',
      cover: '',
      publishTime: '',
      updateTime: `${dateStr} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:00`,
      status: 'draft',
      hasUnsyncedChanges: false,
      hasUnsavedChanges: false, // 新建活动默认为 false
      displayPosition: 'normal' // 默认图片展示
    };
    setEditingActivity(newActivity);
    setInitialActivity(newActivity);  // 保存初始值用于对比
    setHasLocalChanges(true); // 新活动默认为未保存状态
    setIsSavingActivity(false);
    setLastSavedTime(null);   // 新活动没有保存时间
    setIsActivityModalOpen(true);
  };

  // 编辑活动
  const handleEditActivity = (act) => {
    const activityData = { 
      ...act, 
      content: act.content || '<p></p>',
      displayPosition: act.displayPosition || 'normal' // 确保有默认展示位
    };
    setEditingActivity(activityData);
    setInitialActivity(activityData);  // 保存初始值用于对比
    setHasLocalChanges(false); // 重置修改状态
    setIsSavingActivity(false);
    // 设置初始保存时间为活动的更新时间
    const updateDate = activityData.updateTime ? new Date(activityData.updateTime.replace(/\//g, '-')) : new Date();
    setLastSavedTime(updateDate.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }));
    setIsActivityModalOpen(true);
  };
  
  // 监听用户编辑，对比初始值和当前值
  useEffect(() => {
    if (editingActivity && initialActivity) {
      const hasChanges = JSON.stringify(editingActivity) !== JSON.stringify(initialActivity);
      setHasLocalChanges(hasChanges);
    }
  }, [editingActivity, initialActivity]);
  
  // 更新编辑中的活动
  const updateEditingActivity = (updater) => {
    setEditingActivity(prev => {
      const updated = typeof updater === 'function' ? updater(prev) : updater;
      return updated;
    });
  };

  // 删除活动
  const handleDeleteActivity = (id) => {
    if (confirm('确定删除此活动吗？')) {
      setActivities(activities.filter(a => a.id !== id));
    }
  };
  
  // 下架活动
  const handleUnpublishActivity = (activity) => {
    const activityToUnpublish = {
      ...activity,
      status: 'draft',
      hasUnsyncedChanges: false,
      hasUnsavedChanges: false, // 下架时清除所有状态标志
      updateTime: new Date().toLocaleString('zh-CN', { 
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      }).replace(/\//g, '/')
    };
    setActivities(activities.map(a => a.id === activity.id ? activityToUnpublish : a));
  };

  // 确认活动（点击确认后，标记为有未保存的修改）
  const handleConfirmActivity = () => {
    if (!editingActivity || !editingActivity.title) {
      alert('请填写活动标题');
      return;
    }
    
    const now = new Date();
    const timeStr = now.toLocaleString('zh-CN', { 
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    }).replace(/\//g, '/');
    
    const exists = activities.find(a => a.id === editingActivity.id);
    const isExistingActivity = !!exists;
    
    const activityToConfirm = {
      ...editingActivity,
      updateTime: timeStr,
      displayPosition: 'normal', // 固定为图片展示
      // 新建或编辑活动后，都标记为有未保存的修改
      hasUnsavedChanges: true,
      // 新活动保持 hasUnsyncedChanges: false，已编辑的活动也保持 false（等待保存配置后才会变成待更新）
      hasUnsyncedChanges: false
    };
    
    if (exists) {
      setActivities(activities.map(a => a.id === editingActivity.id ? activityToConfirm : a));
    } else {
      setActivities([...activities, activityToConfirm]);
    }
    
    // 确认后关闭弹窗
    setIsActivityModalOpen(false);
    setEditingActivity(null);
    setInitialActivity(null);
    setHasLocalChanges(false);
  };
  
  // 关闭编辑弹窗
  const handleCloseActivityModal = () => {
    setIsActivityModalOpen(false);
    setEditingActivity(null);
    setInitialActivity(null);
    setHasLocalChanges(false);
    setIsSavingActivity(false);
    setLastSavedTime(null);
  };
  
  // 生成活动历史记录
  const generateActivityHistory = (activityTitle, currentActivity = null, initialActivity = null) => {
    // 如果有当前和初始数据，检测修改的字段
    // 只有保存文章（draft）时才生成细粒度描述，更新和发布只生成简单描述
    if (currentActivity && initialActivity) {
      // 只有保存文章时才检测字段变化并生成细粒度描述
      if (currentActivity.status === 'draft') {
        const changedFields = detectChangedFields(currentActivity, initialActivity);
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
      { id: 'v1', time: '2024-03-20 14:30', description: '更新了活动', operator: 'admin', status: 'updated' },
      { id: 'v2', time: '2024-03-20 14:25', description: '更新了活动', operator: 'admin', status: 'updated' },
      { id: 'v3', time: '2024-03-18 16:00', description: '发布了活动', operator: 'admin', status: 'published' },
      { id: 'v4', time: '2024-03-18 15:30', description: '编辑了"标题"、"摘要"内容', operator: 'admin', status: 'draft' },
      { id: 'v5', time: '2024-03-15 10:00', description: '发布了活动', operator: 'admin', status: 'published' },
    ];
  };

  // 活动表格列配置 - 复用新闻中心的样式
  const activityColumns = [
    { 
      key: 'cover', 
      title: '封面', 
      width: 100,
      render: (val, row) => {
        const cover = val || row.coverImage || '';
        return (
          <div className="relative w-20 h-14 rounded-md overflow-hidden">
            {cover ? (
              <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${cover})` }} />
            ) : (
              <div className="w-full h-full bg-gray-3 flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-gray-5" />
              </div>
            )}
          </div>
        );
      }
    },
    { 
      key: 'title', 
      title: '活动标题', 
      width: 300,
      render: (val) => <span className="text-body text-gray-7 line-clamp-2">{val || '-'}</span>
    },
    { 
      key: 'summary', 
      title: '活动简介', 
      width: 280,
      render: (val) => <span className="text-caption text-gray-6 line-clamp-2">{val || '-'}</span>
    },
    { 
      key: 'publishTime', 
      title: '发布时间', 
      width: 140,
      sortable: true,
      render: (val) => {
        if (!val) return <span className="text-caption text-gray-6">-</span>;
        try {
          const date = new Date(val.replace(/\//g, '-'));
          return <span className="text-caption text-gray-6">{date.toLocaleDateString('zh-CN')}</span>;
        } catch {
          return <span className="text-caption text-gray-6">{val.split(' ')[0] || '-'}</span>;
        }
      }
    },
    { 
      key: 'updateTime', 
      title: '修改时间', 
      width: 140,
      sortable: true,
      render: (val) => {
        if (!val) return <span className="text-caption text-gray-6">-</span>;
        try {
          const date = new Date(val.replace(/\//g, '-'));
          return <span className="text-caption text-gray-6">{date.toLocaleDateString('zh-CN')}</span>;
        } catch {
          return <span className="text-caption text-gray-6">{val.split(' ')[0] || '-'}</span>;
        }
      }
    },
    { 
      key: 'status', 
      title: '状态', 
      width: 90,
      render: (val, row) => (
        <StatusChip 
          status={getArticleStatus(val, row.hasUnsyncedChanges, row.hasUnsavedChanges)} 
          showDot={false} 
          showTooltip={true}
          scene="article"
        />
      )
    },
    { 
      key: 'actions', 
      title: '操作', 
      width: 120,
      render: (_, row) => {
        const articleStatus = getArticleStatus(row.status, row.hasUnsyncedChanges, row.hasUnsavedChanges);
        // 已上线（完美同步）或待更新（有未发布的修改）
        const isPublished = articleStatus === 'published';
        const isPending = articleStatus === 'pending';
        // 只有未上线状态才能删除
        const canDelete = !isPublished && !isPending;
        
        return (
          <div className="flex items-center gap-0.5 flex-nowrap">
            {/* 下架按钮 - 已上线或待更新状态显示 */}
            {(isPublished || isPending) && (
              <button 
                onClick={() => handleUnpublishActivity(row)} 
                className="flex items-center gap-0.5 px-1.5 py-1 text-xs text-gray-5 hover:text-error hover:bg-error/10 rounded transition-colors whitespace-nowrap"
              >
                <ArrowDownCircle className="w-3.5 h-3.5" />
                下架
              </button>
            )}
            
            {/* 编辑按钮 - 仅图标 */}
            <button 
              onClick={() => handleEditActivity(row)} 
              className="p-1.5 text-gray-5 hover:text-brand hover:bg-brand/10 rounded transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            
            {/* 删除按钮 - 仅图标，根据状态控制可用性 */}
            <div className="relative group/delete">
              <button 
                onClick={() => canDelete && handleDeleteActivity(row.id)} 
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

  // ==================== 核心价值观卡片编辑 ====================
  const handleEditCard = (card) => {
    setEditingCard({ ...card });
    setIsCardModalOpen(true);
  };

  const handleSaveCard = () => {
    if (!editingCard || !editingCard.title) {
      alert('请填写标题');
      return;
    }
    setValues({
      ...values,
      cards: (values.cards || []).map(c => c.id === editingCard.id ? editingCard : c)
    });
    setIsCardModalOpen(false);
    setEditingCard(null);
  };

  // ==================== 员工风采编辑 ====================
  const handleAddStaff = () => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`;
    setEditingStaff({
      id: `staff_${Date.now()}`,
      name: '',
      title: '',
      summary: '',
      content: '',
      image: '',
      status: 'draft',
      hasUnsyncedChanges: false,
      hasUnsavedChanges: false, // 新建员工默认为 false
      publishTime: '',
      updateTime: `${dateStr} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:00`
    });
    setIsStaffModalOpen(true);
  };

  const handleEditStaff = (s) => {
    setEditingStaff({ ...s });
    setIsStaffModalOpen(true);
  };

  const handleDeleteStaff = (id) => {
    if (confirm('确定删除此员工风采吗？')) {
      setStaff(staff.filter(s => s.id !== id));
    }
  };

  const handleConfirmStaff = () => {
    if (!editingStaff || !editingStaff.name) {
      alert('请填写员工姓名');
      return;
    }
    const now = new Date();
    const timeStr = now.toLocaleString('zh-CN', { 
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    }).replace(/\//g, '/');
    
    const exists = staff.find(s => s.id === editingStaff.id);
    const isExistingStaff = !!exists;
    
    const staffToConfirm = {
      ...editingStaff,
      updateTime: timeStr,
      // 新建或编辑员工后，都标记为有未保存的修改
      hasUnsavedChanges: true,
      // 新员工保持 hasUnsyncedChanges: false，已编辑的员工也保持 false（等待保存配置后才会变成待更新）
      hasUnsyncedChanges: false
    };
    
    if (exists) {
      setStaff(staff.map(s => s.id === editingStaff.id ? staffToConfirm : s));
    } else {
      setStaff([...staff, staffToConfirm]);
    }
    setIsStaffModalOpen(false);
    setEditingStaff(null);
  };

  return (
    <EditorLayout
      title="企业文化"
      description="管理企业文化页面：核心价值观、精彩文化活动、员工风采展示。"
      pageKey="culture-company"
      onSave={handleSave}
      onSaveDraft={handleSaveDraft}
      hasUnsavedChanges={hasUnsavedChanges}
    >
      {/* Tab 切换 - 统一按钮式风格，带状态指示器 */}
      <div className="mb-lg">
        <div className="flex gap-1">
          <button 
            onClick={() => setActiveTab('values')}
            className={`relative px-md py-xs rounded-sm text-body font-medium transition-all ${
              activeTab === 'values' 
                ? 'bg-brand-light text-brand' 
                : 'text-gray-7 hover:text-gray-8 hover:bg-gray-3'
            }`}
          >
            核心价值观
            {/* 未保存指示器 - 黄色小圆点（与悬浮栏unsaved状态一致，使用bg-warning） */}
            {hasUnsavedValues && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-warning rounded-full border-2 border-white"></span>
            )}
            {/* 未更新指示器 - 蓝色小圆点（与悬浮栏pending状态一致，使用bg-brand） */}
            {hasPendingValues && !hasUnsavedValues && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-brand rounded-full border-2 border-white"></span>
            )}
          </button>
          <button 
            onClick={() => setActiveTab('activities')}
            className={`relative px-md py-xs rounded-sm text-body font-medium transition-all ${
              activeTab === 'activities' 
                ? 'bg-brand-light text-brand' 
                : 'text-gray-7 hover:text-gray-8 hover:bg-gray-3'
            }`}
          >
            精彩文化活动
            {/* 未保存指示器 - 黄色小圆点（与悬浮栏unsaved状态一致，使用bg-warning） */}
            {hasUnsavedActivities && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-warning rounded-full border-2 border-white"></span>
            )}
            {/* 未更新指示器 - 蓝色小圆点（与悬浮栏pending状态一致，使用bg-brand） */}
            {hasPendingActivities && !hasUnsavedActivities && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-brand rounded-full border-2 border-white"></span>
            )}
          </button>
          <button 
            onClick={() => setActiveTab('staff')}
            className={`relative px-md py-xs rounded-sm text-body font-medium transition-all ${
              activeTab === 'staff' 
                ? 'bg-brand-light text-brand' 
                : 'text-gray-7 hover:text-gray-8 hover:bg-gray-3'
            }`}
          >
            员工风采
            {/* 未保存指示器 - 黄色小圆点（与悬浮栏unsaved状态一致，使用bg-warning） */}
            {hasUnsavedStaff && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-warning rounded-full border-2 border-white"></span>
            )}
            {/* 未更新指示器 - 蓝色小圆点（与悬浮栏pending状态一致，使用bg-brand） */}
            {hasPendingStaff && !hasUnsavedStaff && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-brand rounded-full border-2 border-white"></span>
            )}
          </button>
        </div>
      </div>

      {/* ==================== 核心价值观 Tab ==================== */}
      {activeTab === 'values' && (
        <div className="space-y-lg">
          {/* 使命、愿景、价值观 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
            <div className="space-y-md">
              <FormItem label="我们的使命">
                <TextArea 
                  value={values.mission?.content || ''} 
                  onChange={e => setValues({...values, mission: {...values.mission, content: e.target.value}})} 
                  rows={3}
                  placeholder="请输入使命内容"
                />
              </FormItem>
              <FormItem label="我们的愿景">
                <TextArea 
                  value={values.vision?.content || ''} 
                  onChange={e => setValues({...values, vision: {...values.vision, content: e.target.value}})} 
                  rows={2}
                  placeholder="请输入愿景内容"
                />
              </FormItem>
              <FormItem label="我们的价值观">
                <TextArea 
                  value={values.valueCore?.content || ''} 
                  onChange={e => setValues({...values, valueCore: {...values.valueCore, content: e.target.value}})} 
                  rows={2}
                  placeholder="请输入价值观内容"
                />
              </FormItem>
            </div>
            <div>
              <ImageSelector
                label="配图"
                value={values.image ? { url: values.image } : null}
                onChange={img => setValues({...values, image: img?.url || ''})}
                library={imageLib}
              />
            </div>
          </div>

          {/* 四个卡片 */}
          <div>
            <h4 className="text-body font-medium text-gray-8 mb-md">价值理念卡片</h4>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-md">
              {(values.cards || []).map(card => (
                <div 
                  key={card.id} 
                  className="group p-md bg-gray-2 rounded-md border border-gray-4 hover:border-gray-5 cursor-pointer transition-all"
                  onClick={() => handleEditCard(card)}
                >
                  <div className="flex items-center gap-xs mb-sm">
                    <div className="w-6 h-6 rounded-full bg-brand-light flex items-center justify-center">
                      <ImageIcon className="w-3.5 h-3.5 text-brand" />
                    </div>
                    <span className="text-body font-medium text-gray-8">{card.title}</span>
                  </div>
                  <p className="text-caption text-gray-6 line-clamp-3">{card.content}</p>
                  <div className="mt-sm text-caption text-brand opacity-0 group-hover:opacity-100 transition-opacity">点击编辑</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================== 精彩文化活动 Tab ==================== */}
      {activeTab === 'activities' && (
        <>
          {/* 操作按钮 */}
          <div className="flex items-center justify-between mb-lg">
            <div>
              <h4 className="text-body font-medium text-gray-8">文化活动列表</h4>
              <p className="text-caption text-gray-6">管理精彩文化活动内容</p>
            </div>
            <Button variant="add" onClick={handleAddActivity}>
              <Plus className="w-4 h-4" />
              新建文化活动
            </Button>
          </div>

          {/* 搜索筛选 */}
          <SearchFilterBar
            searchText={searchText}
            onSearchChange={(val) => {
              setSearchText(val);
              setCurrentPage(1); // 搜索时重置到第一页
            }}
            searchPlaceholder="搜索活动标题..."
            sortOptions={[
              { id: 'publishTime', label: '发布时间' },
              { id: 'updateTime', label: '修改时间' },
              { id: 'title', label: '标题' }
            ]}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={(field, order) => {
              setSortBy(field);
              setSortOrder(order);
              setCurrentPage(1); // 排序时重置到第一页
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
              if (fieldId === 'status') {
                setFilterStatus(value);
                setCurrentPage(1); // 筛选时重置到第一页
              }
            }}
            onFilterReset={() => {
              setFilterStatus('all');
              setCurrentPage(1);
            }}
          />

          {/* 活动卡片展示 */}
          <div className="border-t border-gray-4 pt-lg">
            {paginatedActivities.length === 0 ? (
              <div className="text-center py-xxl text-gray-6">
                <p>暂无文化活动</p>
              </div>
            ) : (
              <>
                {/* 卡片网格 - 3x4布局（每页12个卡片） */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md mb-lg">
                  {paginatedActivities.map(act => {
                    const articleStatus = getArticleStatus(act.status, act.hasUnsyncedChanges, act.hasUnsavedChanges);
                    const isPublished = articleStatus === 'published';
                    const isPending = articleStatus === 'pending';
                    const canDelete = !isPublished && !isPending;
                    
                    return (
                      <div 
                        key={act.id} 
                        className="group bg-white rounded-md overflow-hidden border border-gray-4 hover:border-gray-5 hover:shadow-md transition-all"
                      >
                        {/* 顶部图片 */}
                        <div 
                          className="aspect-[4/3] bg-gray-3 bg-cover bg-center relative"
                          style={{ backgroundImage: act.cover ? `url(${act.cover})` : undefined }}
                        >
                          {!act.cover && (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="w-12 h-12 text-gray-5" />
                            </div>
                          )}
                          {/* 操作按钮 */}
                          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => handleEditActivity(act)}
                              className="p-1.5 bg-white/90 rounded-sm text-gray-7 hover:text-brand hover:bg-white"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            {act.id && activities.find(a => a.id === act.id) && (
                              <button 
                                onClick={() => {
                                  setEditingActivity(act);
                                  setShowActivityHistoryModal(true);
                                }}
                                className="p-1.5 bg-white/90 rounded-sm text-gray-7 hover:text-brand hover:bg-white"
                                title="查看历史记录"
                              >
                                <Clock className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button 
                              onClick={() => handleDeleteActivity(act.id)}
                              className="p-1.5 bg-white/90 rounded-sm text-gray-7 hover:text-error hover:bg-white"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          {/* 状态标签 */}
                          <div className="absolute top-2 left-2">
                            <StatusChip 
                              status={articleStatus} 
                              showDot={false} 
                              showTooltip={true}
                              scene="article"
                            />
                          </div>
                        </div>
                        
                        {/* 文本信息区域 */}
                        <div className="p-md space-y-xs">
                          {/* 日期 */}
                          {act.publishTime && (
                            <div className="flex items-center gap-1 text-caption text-gray-6">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>{formatActivityDate(act.publishTime)}</span>
                            </div>
                          )}
                          
                          {/* 标题 */}
                          <h5 className="text-body font-semibold text-gray-8 line-clamp-2 mt-xs">
                            {act.title || '未命名活动'}
                          </h5>
                          
                          {/* 摘要 */}
                          {act.summary && (
                            <p className="text-caption text-gray-6 line-clamp-2 mt-xs">
                              {act.summary}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* 分页控件 */}
                {totalActivityPages > 1 && (
                  <div className="flex items-center justify-between pt-md border-t border-gray-4">
                    <div className="text-caption text-gray-6">
                      共 {sortedActivities.length} 条，第 {currentPage} / {totalActivityPages} 页
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1.5 text-caption font-medium text-gray-8 border border-gray-4 rounded-sm hover:bg-gray-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        上一页
                      </button>
                      {Array.from({ length: Math.min(totalActivityPages, 5) }, (_, i) => {
                        let page;
                        if (totalActivityPages <= 5) {
                          page = i + 1;
                        } else if (currentPage <= 3) {
                          page = i + 1;
                        } else if (currentPage >= totalActivityPages - 2) {
                          page = totalActivityPages - 4 + i;
                        } else {
                          page = currentPage - 2 + i;
                        }
                        return (
                          <button 
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-8 h-8 rounded-sm text-body font-medium transition-colors ${
                              currentPage === page ? 'bg-brand text-white' : 'text-gray-7 hover:bg-gray-2'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                      <button 
                        onClick={() => setCurrentPage(p => Math.min(totalActivityPages, p + 1))}
                        disabled={currentPage === totalActivityPages || totalActivityPages === 0}
                        className="px-3 py-1.5 text-caption font-medium text-gray-8 border border-gray-4 rounded-sm hover:bg-gray-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                      >
                        下一页
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}

      {/* ==================== 员工风采 Tab ==================== */}
      {activeTab === 'staff' && (
        <>
          {/* 操作按钮 */}
          <div className="flex items-center justify-between mb-lg">
            <div>
              <h4 className="text-body font-medium text-gray-8">员工风采展示</h4>
              <p className="text-caption text-gray-6">管理员工风采内容，展示优秀员工事迹</p>
            </div>
            <Button variant="add" onClick={handleAddStaff}>
              <Plus className="w-4 h-4" />
              添加员工风采
            </Button>
          </div>

          {/* 搜索筛选 */}
          <SearchFilterBar
            searchText={staffSearchText}
            onSearchChange={(val) => {
              setStaffSearchText(val);
              setStaffCurrentPage(1); // 搜索时重置到第一页
            }}
            searchPlaceholder="搜索员工姓名、职位或简介..."
            sortOptions={[
              { id: 'publishTime', label: '发布时间' },
              { id: 'updateTime', label: '修改时间' },
              { id: 'name', label: '姓名' }
            ]}
            sortBy={staffSortBy}
            sortOrder={staffSortOrder}
            onSortChange={(field, order) => {
              setStaffSortBy(field);
              setStaffSortOrder(order);
              setStaffCurrentPage(1); // 排序时重置到第一页
            }}
            filterFields={[
              {
                id: 'status',
                label: '状态',
                type: 'select',
                value: staffFilterStatus,
                options: [
                  { value: 'all', label: '全部状态' },
                  { value: 'published', label: '已发布' },
                  { value: 'draft', label: '草稿' }
                ]
              }
            ]}
            onFilterChange={(fieldId, value) => {
              if (fieldId === 'status') {
                setStaffFilterStatus(value);
                setStaffCurrentPage(1); // 筛选时重置到第一页
              }
            }}
            onFilterReset={() => {
              setStaffFilterStatus('all');
              setStaffCurrentPage(1);
            }}
          />

          {/* 员工风采卡片展示 */}
          <div className="border-t border-gray-4 pt-lg">
            {paginatedStaff.length === 0 ? (
              <div className="text-center py-xxl text-gray-6">
                <p>暂无员工风采</p>
              </div>
            ) : (
              <>
                {/* 卡片网格 - 3x4布局（每页12个卡片） */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md mb-lg">
                  {paginatedStaff.map(s => {
                    const staffStatus = getArticleStatus(s.status, s.hasUnsyncedChanges, s.hasUnsavedChanges);
                    
                    return (
                      <div key={s.id} className="group bg-white rounded-md overflow-hidden border border-gray-4 hover:border-gray-5 hover:shadow-md transition-all">
                        <div 
                          className="aspect-[4/3] bg-gray-3 bg-cover bg-center relative"
                          style={{ backgroundImage: s.image ? `url(${s.image})` : undefined }}
                        >
                          {!s.image && (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="w-12 h-12 text-gray-5" />
                            </div>
                          )}
                          {/* 状态标签 - 左上角 */}
                          <div className="absolute top-2 left-2">
                            <StatusChip 
                              status={staffStatus} 
                              showDot={false} 
                              showTooltip={true}
                              scene="article"
                            />
                          </div>
                          {/* 操作按钮 */}
                          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => handleEditStaff(s)}
                              className="p-1.5 bg-white/90 rounded-sm text-gray-7 hover:text-brand hover:bg-white"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => handleDeleteStaff(s.id)}
                              className="p-1.5 bg-white/90 rounded-sm text-gray-7 hover:text-error hover:bg-white"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <div className="p-md">
                          <h5 className="text-body font-semibold text-gray-8">{s.name || '未命名'}</h5>
                          <p className="text-caption text-gray-6 mt-xxs line-clamp-2">{s.title || ''}</p>
                          {s.summary && (
                            <p className="text-caption text-brand mt-xs line-clamp-2">"{s.summary}"</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* 分页控件 */}
                {totalStaffPages > 1 && (
                  <div className="flex items-center justify-between pt-md border-t border-gray-4">
                    <div className="text-caption text-gray-6">
                      共 {sortedStaff.length} 条，第 {staffCurrentPage} / {totalStaffPages} 页
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setStaffCurrentPage(p => Math.max(1, p - 1))}
                        disabled={staffCurrentPage === 1}
                        className="px-3 py-1.5 text-caption font-medium text-gray-8 border border-gray-4 rounded-sm hover:bg-gray-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        上一页
                      </button>
                      {Array.from({ length: Math.min(totalStaffPages, 5) }, (_, i) => {
                        let page;
                        if (totalStaffPages <= 5) {
                          page = i + 1;
                        } else if (staffCurrentPage <= 3) {
                          page = i + 1;
                        } else if (staffCurrentPage >= totalStaffPages - 2) {
                          page = totalStaffPages - 4 + i;
                        } else {
                          page = staffCurrentPage - 2 + i;
                        }
                        return (
                          <button 
                            key={page}
                            onClick={() => setStaffCurrentPage(page)}
                            className={`w-8 h-8 rounded-sm text-body font-medium transition-colors ${
                              staffCurrentPage === page ? 'bg-brand text-white' : 'text-gray-7 hover:bg-gray-2'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                      <button 
                        onClick={() => setStaffCurrentPage(p => Math.min(totalStaffPages, p + 1))}
                        disabled={staffCurrentPage === totalStaffPages || totalStaffPages === 0}
                        className="px-3 py-1.5 text-caption font-medium text-gray-8 border border-gray-4 rounded-sm hover:bg-gray-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                      >
                        下一页
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}

      {/* ==================== 活动编辑弹窗 - 复用新闻中心的沉浸式布局 ==================== */}
      <Modal
        isOpen={isActivityModalOpen}
        onClose={handleCloseActivityModal}
        title={editingActivity && activities.find(a => a.id === editingActivity.id) ? '编辑文化活动' : '新建文化活动'}
        size="4xl"
        footer={null}
      >
        {editingActivity && (
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
                    value={editingActivity.title || ''}
                    onChange={e => {
                      const value = e.target.value.slice(0, 50);
                      updateEditingActivity(prev => prev ? {...prev, title: value} : prev);
                    }}
                    placeholder="请输入活动标题"
                    maxLength={50}
                    className="w-full px-4 py-3 border border-gray-3 rounded-lg text-text-primary placeholder-text-placeholder focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors"
                  />
                  <div className="flex justify-between mt-1.5 text-xs text-gray-5">
                    <span>{editingActivity.title?.length || 0} 字符</span>
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
                      value={editingActivity.summary || ''}
                      onChange={e => {
                        const value = e.target.value.slice(0, 100);
                        updateEditingActivity(prev => prev ? {...prev, summary: value} : prev);
                      }}
                      placeholder="请输入活动摘要（选填）"
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
                    <span>{editingActivity.summary?.length || 0} 字符</span>
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
                          updateEditingActivity(prev => prev ? {...prev, content: html || '<p></p>'} : prev);
                        }}
                        onBlur={e => {
                          const html = e.target.innerHTML;
                          updateEditingActivity(prev => prev ? {...prev, content: html || '<p></p>'} : prev);
                        }}
                        dangerouslySetInnerHTML={{ __html: editingActivity.content || '<p></p>' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 右侧：配置区 (约35%) - 只显示封面上传，不显示展示位选择 */}
              <div className="flex-[35] overflow-y-auto pl-8 border-l border-gray-3">
                <div className="space-y-6">
                  {/* 封面图上传 */}
                  <CoverUploader 
                    cover={editingActivity.cover}
                    onCoverChange={(val) => updateEditingActivity(prev => prev ? {...prev, cover: val} : prev)}
                    required={true}
                    hint="精彩文化活动需要封面图片"
                    recommendedSize="1200×675px"
                  />
                </div>
              </div>
            </div>

            {/* 底部按钮栏 */}
            <div className="flex items-center justify-end gap-2 pt-md border-t border-gray-3">
              {editingActivity.id && activities.find(a => a.id === editingActivity.id) && (
                <button
                  onClick={() => setShowActivityHistoryModal(true)}
                  className="flex items-center gap-1.5 px-3 py-2 text-gray-6 hover:text-gray-7 hover:bg-gray-2 rounded-lg text-sm transition-colors"
                  title="查看版本历史"
                >
                  <Clock className="w-4 h-4" />
                  历史记录
                </button>
              )}
              <Button onClick={handleConfirmActivity}>确认</Button>
            </div>
          </div>
        )}
      </Modal>
      
      {/* 活动版本历史弹窗 */}
      <UnifiedHistoryModal
        isOpen={showActivityHistoryModal}
        onClose={() => {
          setShowActivityHistoryModal(false);
          setEditingActivity(null);
        }}
        title={editingActivity ? `《${editingActivity.title}》 - 版本历史` : '版本历史'}
        mode="editor"
        records={editingActivity ? generateActivityHistory(editingActivity.title, editingActivity, initialActivity) : []}
        onRestore={(record) => {
          console.log('恢复版本:', record);
          setShowActivityHistoryModal(false);
          setEditingActivity(null);
        }}
        useArticleVersionLabels={true}
      />

      {/* ==================== 卡片编辑弹窗 ==================== */}
      <Modal
        isOpen={isCardModalOpen}
        onClose={() => { setIsCardModalOpen(false); setEditingCard(null); }}
        title="编辑价值理念卡片"
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsCardModalOpen(false)}>取消</Button>
            <Button onClick={handleSaveCard}>保存</Button>
          </>
        }
      >
        {editingCard && (
          <div className="space-y-md">
            <FormItem label="卡片标题" required>
              <Input 
                value={editingCard.title || ''} 
                onChange={e => setEditingCard({...editingCard, title: e.target.value})} 
                placeholder="如：发展目标"
              />
            </FormItem>
            <FormItem label="卡片内容">
              <TextArea 
                value={editingCard.content || ''} 
                onChange={e => setEditingCard({...editingCard, content: e.target.value})} 
                rows={4}
                placeholder="请输入卡片内容"
              />
            </FormItem>
          </div>
        )}
      </Modal>

      {/* ==================== 员工风采编辑弹窗 ==================== */}
      <Modal
        isOpen={isStaffModalOpen}
        onClose={() => { setIsStaffModalOpen(false); setEditingStaff(null); }}
        title={editingStaff && staff.find(s => s.id === editingStaff.id) ? '编辑员工风采' : '添加员工风采'}
        size="lg"
        footer={
          <div className="flex items-center justify-end gap-2">
            {editingStaff && editingStaff.id && staff.find(s => s.id === editingStaff.id) && (
              <button
                onClick={() => setShowStaffHistoryModal(true)}
                className="flex items-center gap-1.5 px-3 py-2 text-gray-6 hover:text-gray-7 hover:bg-gray-2 rounded-lg text-sm transition-colors"
                title="查看版本历史"
              >
                <Clock className="w-4 h-4" />
                历史记录
              </button>
            )}
            <Button onClick={handleConfirmStaff}>确认</Button>
          </div>
        }
      >
        {editingStaff && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
            <div className="space-y-md">
              <FormItem label="员工姓名" required>
                <Input 
                  value={editingStaff.name || ''} 
                  onChange={e => setEditingStaff({...editingStaff, name: e.target.value})} 
                  placeholder="请输入员工姓名"
                />
              </FormItem>
              <FormItem label="职位/部门">
                <Input 
                  value={editingStaff.title || ''} 
                  onChange={e => setEditingStaff({...editingStaff, title: e.target.value})} 
                  placeholder="如：中东公司综合部支书记/副经理"
                />
              </FormItem>
              <FormItem label="简介/金句">
                <Input 
                  value={editingStaff.summary || ''} 
                  onChange={e => setEditingStaff({...editingStaff, summary: e.target.value})} 
                  placeholder="一句话描述该员工特点或座右铭"
                />
              </FormItem>
              <FormItem label="详细内容">
                <TextArea 
                  value={editingStaff.content || ''} 
                  onChange={e => setEditingStaff({...editingStaff, content: e.target.value})} 
                  rows={6}
                  placeholder="请输入员工风采详细介绍..."
                />
              </FormItem>
            </div>
            <div>
              <ImageSelector
                label="员工照片"
                value={editingStaff.image ? { url: editingStaff.image } : null}
                onChange={img => setEditingStaff({...editingStaff, image: img?.url || ''})}
                library={imageLib}
              />
            </div>
          </div>
        )}
      </Modal>

      {/* 员工风采版本历史弹窗 */}
      <UnifiedHistoryModal
        isOpen={showStaffHistoryModal}
        onClose={() => {
          setShowStaffHistoryModal(false);
          setEditingStaff(null);
        }}
        title={editingStaff ? `《${editingStaff.name}》 - 版本历史` : '版本历史'}
        mode="editor"
        records={editingStaff ? [
          { id: 'v1', time: '2024-03-20 14:30', description: '更新了员工信息', operator: 'admin', status: 'updated' },
          { id: 'v2', time: '2024-03-18 10:00', description: '发布了员工风采', operator: 'admin', status: 'published' },
        ] : []}
        onRestore={(record) => {
          console.log('恢复版本:', record);
          setShowStaffHistoryModal(false);
          setEditingStaff(null);
        }}
        useArticleVersionLabels={true}
      />
    </EditorLayout>
  );
};

export default CultureCompanyEditor;
