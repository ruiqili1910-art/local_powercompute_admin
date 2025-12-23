import { useState, useEffect, useRef } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { SearchFilterBar, DataTable, Modal, FormItem, Input, Button } from '../../ui';

/**
 * 部门权限设置组件
 * 使用表格形式展示部门列表和权限配置
 */
const DepartmentPermissions = ({ triggerAddDepartment = 0 }) => {
  // 部门列表数据
  const [departments, setDepartments] = useState([
    { 
      id: 'tech', 
      name: '技术部', 
      memberCount: 15,
      permissions: {
        // 一级菜单
        global: true,
        home_manage: true,
        about: true,
        news: true,
        business: true,
        culture: true,
        party: true,
        hr: true,
        public: true,
        sustain: true,
        // 全局资源库二级
        'global.info': true,
        'global.images': true,
        'global.certs': true,
        'global.people': true,
        'global.footer': true,
        // 首页管理二级
        'home_manage.home_banner': true,
        'home_manage.home_news': true,
        'home_manage.home_about': true,
        'home_manage.home_business': true,
        'home_manage.home_culture': true,
        'home_manage.home_staff': true,
        'home_manage.home_partner': true,
        // ... 其他二级菜单全部为true（技术部有全部权限）
      }
    },
    { 
      id: 'content', 
      name: '内容部', 
      memberCount: 8,
      permissions: {
        home_manage: true,
        news: true,
        culture: true,
        party: true,
        sustain: true,
        // 首页管理二级
        'home_manage.home_banner': true,
        'home_manage.home_news': true,
        'home_manage.home_about': false,
        'home_manage.home_business': false,
        'home_manage.home_culture': true,
        'home_manage.home_staff': false,
        'home_manage.home_partner': false,
        // 新闻中心二级
        'news.news_banner': true,
        'news.news_company': true,
        'news.news_enterprise': true,
        'news.news_project': true,
        'news.news_industry': true,
      }
    },
    { 
      id: 'market', 
      name: '市场部', 
      memberCount: 12,
      permissions: {
        home_manage: true,
        news: true,
        business: true,
        culture: true,
        // 首页管理二级
        'home_manage.home_banner': true,
        'home_manage.home_news': true,
        'home_manage.home_about': true,
        'home_manage.home_business': true,
        'home_manage.home_culture': true,
        'home_manage.home_staff': false,
        'home_manage.home_partner': true,
      }
    },
    { 
      id: 'hr', 
      name: '人力资源部', 
      memberCount: 5,
      permissions: {
        party: true,
        hr: true,
        public: true,
        // 党建领航二级
        'party.party_banner': true,
        'party.party_building': true,
        'party.party_integrity': true,
        'party.party_youth': true,
        'party.party_workers': true,
        // 人力资源二级
        'hr.hr_banner': true,
        'hr.hr_strategy': true,
        'hr.hr_team': true,
        'hr.hr_recruit': true,
      }
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [formData, setFormData] = useState({
    name: '',
    memberCount: 0,
    permissions: {}
  });

  // 使用ref跟踪上一次的triggerAddDepartment值
  const prevTriggerRef = useRef(triggerAddDepartment);

  // 监听父组件的新增部门触发
  useEffect(() => {
    // 只有当triggerAddDepartment真正增加时才触发
    if (triggerAddDepartment > prevTriggerRef.current) {
      prevTriggerRef.current = triggerAddDepartment;
      handleOpenModal(null);
    }
  }, [triggerAddDepartment]);

  // 菜单配置（包含一级和二级菜单）
  const menuItems = [
    { 
      id: 'global', 
      label: '全局资源库',
      children: [
        { id: 'info', label: '公司档案信息' },
        { id: 'images', label: '图片媒体库' },
        { id: 'certs', label: '资质荣誉库' },
        { id: 'people', label: '人员专家库' },
        { id: 'footer', label: '页脚内容管理' }
      ]
    },
    { 
      id: 'home_manage', 
      label: '首页管理',
      children: [
        { id: 'home_banner', label: 'Banner 设置' },
        { id: 'home_news', label: '最新动态' },
        { id: 'home_about', label: '关于我们' },
        { id: 'home_business', label: '业务板块' },
        { id: 'home_culture', label: '社会责任与文化' },
        { id: 'home_staff', label: '员工风采' },
        { id: 'home_partner', label: '合作伙伴' }
      ]
    },
    { 
      id: 'about', 
      label: '关于我们',
      children: [
        { id: 'banner_config', label: 'Banner 设置' },
        { id: 'intro', label: '公司简介' },
        { id: 'history', label: '发展历程' },
        { id: 'speech', label: '董事长致辞' },
        { id: 'leaders', label: '公司领导' },
        { id: 'honors', label: '荣誉资质' }
      ]
    },
    { 
      id: 'news', 
      label: '新闻中心',
      children: [
        { id: 'news_banner', label: 'Banner设置' },
        { id: 'news_company', label: '公司要闻' },
        { id: 'news_enterprise', label: '企业新闻' },
        { id: 'news_project', label: '项目动态' },
        { id: 'news_industry', label: '行业信息' }
      ]
    },
    { 
      id: 'business', 
      label: '业务领域',
      children: [
        { id: 'biz_banner', label: 'Banner 设置' },
        { id: 'biz_engineering', label: '工程承包' },
        { id: 'biz_project', label: '项目总览' },
        { id: 'biz_industry', label: '实业投资' },
        { id: 'biz_trade', label: '国际贸易' }
      ]
    },
    { 
      id: 'culture', 
      label: '品牌文化',
      children: [
        { id: 'culture_banner', label: 'Banner 设置' },
        { id: 'culture_company', label: '企业文化' },
        { id: 'culture_brand', label: '品牌形象' }
      ]
    },
    { 
      id: 'party', 
      label: '党建领航',
      children: [
        { id: 'party_banner', label: 'Banner 设置' },
        { id: 'party_building', label: '党的建设' },
        { id: 'party_integrity', label: '廉洁从业' },
        { id: 'party_youth', label: '青年之友' },
        { id: 'party_workers', label: '职工之家' }
      ]
    },
    { 
      id: 'hr', 
      label: '人力资源',
      children: [
        { id: 'hr_banner', label: 'Banner 设置' },
        { id: 'hr_strategy', label: '人才战略' },
        { id: 'hr_team', label: '人才队伍' },
        { id: 'hr_recruit', label: '招聘信息' }
      ]
    },
    { 
      id: 'public', 
      label: '企业公开',
      children: [
        { id: 'public_banner', label: 'Banner 设置' },
        { id: 'public_info', label: '基本信息' },
        { id: 'public_management', label: '经营管理重大事项' },
        { id: 'public_contact', label: '联系方式' }
      ]
    },
    { 
      id: 'sustain', 
      label: '可持续发展',
      children: [
        { id: 'sus_banner', label: 'Banner 设置' },
        { id: 'sus_tech', label: '科技创新' },
        { id: 'sus_safety', label: '安环行动' },
        { id: 'sus_global', label: '全球发展' },
        { id: 'sus_responsibility', label: '社会责任' },
        { id: 'sus_esg', label: 'ESG报告' }
      ]
    }
  ];

  // 计算部门已配置的权限数量
  const getPermissionCount = (permissions) => {
    return Object.values(permissions).filter(Boolean).length;
  };

  // 筛选部门
  const filteredDepartments = departments.filter(dept => 
    dept.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => {
    if (!sortBy) return 0;
    
    const aVal = sortBy === 'permissionCount' 
      ? getPermissionCount(a.permissions)
      : a[sortBy];
    const bVal = sortBy === 'permissionCount'
      ? getPermissionCount(b.permissions)
      : b[sortBy];
    
    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  // 处理排序变化
  const handleSortChange = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
  };

  // 打开新增/编辑部门弹窗
  const handleOpenModal = (dept = null) => {
    if (dept) {
      setEditingDept(dept);
      setFormData({
        name: dept.name,
        memberCount: dept.memberCount,
        permissions: dept.permissions || {}
      });
    } else {
      setEditingDept(null);
      setFormData({
        name: '',
        memberCount: 0,
        permissions: {}
      });
    }
    setShowModal(true);
  };

  // 保存部门
  const handleSave = () => {
    if (editingDept) {
      // 编辑
      setDepartments(departments.map(d => 
        d.id === editingDept.id 
          ? { ...d, name: formData.name, permissions: formData.permissions }
          : d
      ));
    } else {
      // 新增
      const newDept = {
        id: `dept_${Date.now()}`,
        name: formData.name,
        memberCount: 0,
        permissions: formData.permissions
      };
      setDepartments([...departments, newDept]);
    }
    setShowModal(false);
  };
  
  // 切换一级菜单权限（同时切换所有二级菜单）
  const toggleMenuPermission = (menuId) => {
    const newPermissions = { ...formData.permissions };
    const menu = menuItems.find(m => m.id === menuId);
    const newValue = !newPermissions[menuId];
    
    // 切换一级菜单
    newPermissions[menuId] = newValue;
    
    // 同时切换所有二级菜单
    if (menu && menu.children) {
      menu.children.forEach(child => {
        newPermissions[`${menuId}.${child.id}`] = newValue;
      });
    }
    
    setFormData({ ...formData, permissions: newPermissions });
  };
  
  // 切换二级菜单权限
  const toggleSubMenuPermission = (menuId, subMenuId) => {
    const newPermissions = { ...formData.permissions };
    const key = `${menuId}.${subMenuId}`;
    newPermissions[key] = !newPermissions[key];
    
    // 检查是否所有二级菜单都被选中，如果是，则一级菜单也选中
    const menu = menuItems.find(m => m.id === menuId);
    if (menu && menu.children) {
      const allChecked = menu.children.every(child => 
        newPermissions[`${menuId}.${child.id}`]
      );
      newPermissions[menuId] = allChecked;
    }
    
    setFormData({ ...formData, permissions: newPermissions });
  };

  // 删除部门
  const handleDelete = (id) => {
    if (confirm('确定要删除该部门吗？删除后该部门下的成员权限将需要重新分配。')) {
      setDepartments(departments.filter(d => d.id !== id));
    }
  };


  // 表格列配置
  const columns = [
    {
      key: 'name',
      title: '部门名称',
      width: 200,
      sortable: true,
      render: (value) => (
        <span className="font-medium text-text-primary">{value}</span>
      )
    },
    {
      key: 'memberCount',
      title: '部门人数',
      width: 120,
      sortable: true,
      render: (value) => (
        <span className="text-text-secondary">{value} 人</span>
      )
    },
    {
      key: 'permissions',
      title: '权限配置',
      width: 450,
      sortable: false,
      render: (value, row) => {
        // 获取已启用的一级菜单
        const enabledMenus = menuItems.filter(menu => {
          // 检查一级菜单或其任何二级菜单是否启用
          if (value[menu.id]) return true;
          return menu.children.some(child => value[`${menu.id}.${child.id}`]);
        });
        const displayMenus = enabledMenus.slice(0, 3);
        const remainingCount = enabledMenus.length - 3;
        
        return (
          <div className="flex items-center gap-2 flex-wrap">
            {displayMenus.map(menu => (
              <span 
                key={menu.id}
                className="px-2 py-1 bg-brand/10 text-brand text-caption rounded-full font-medium whitespace-nowrap"
              >
                {menu.label}
              </span>
            ))}
            {remainingCount > 0 && (
              <span 
                className="px-2 py-1 bg-gray-3 text-text-secondary text-caption rounded-full font-medium cursor-help"
                title={enabledMenus.slice(3).map(m => m.label).join('、')}
              >
                +{remainingCount}
              </span>
            )}
            {enabledMenus.length === 0 && (
              <span className="text-caption text-text-placeholder">未配置权限</span>
            )}
          </div>
        );
      }
    },
    {
      key: 'actions',
      title: '操作',
      width: 120,
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenModal(row)}
            className="p-1.5 text-text-placeholder hover:text-brand hover:bg-brand/10 rounded transition-colors"
            title="编辑"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="p-1.5 text-text-placeholder hover:text-error hover:bg-error/10 rounded transition-colors"
            title="删除"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div>
      {/* 搜索区域 */}
      <SearchFilterBar
        searchText={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="搜索部门名称..."
        filterFields={[]}
        onFilterChange={() => {}}
        onFilterReset={() => {}}
      />

      {/* 数据表格 */}
      <div className="border-t border-gray-4">
        <DataTable
          columns={columns}
          data={filteredDepartments}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
          emptyText="暂无部门数据"
        />
      </div>

      {/* 新增/编辑部门弹窗 */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingDept ? '编辑部门' : '新增部门'}
        maxWidth="max-w-5xl"
      >
        <div className="space-y-4">
          <FormItem label="部门名称" required>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="请输入部门名称"
            />
          </FormItem>

          {/* 权限配置 */}
          <div className="border-t border-gray-4 pt-4">
            <label className="block text-body font-medium text-text-primary mb-3">
              权限配置 <span className="text-caption text-text-placeholder font-normal">（勾选部门可访问的菜单）</span>
            </label>
            
            <div className="max-h-[500px] overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-4">
                {menuItems.map(menu => {
                  const isMainChecked = !!formData.permissions[menu.id];
                  const checkedCount = menu.children.filter(child => 
                    formData.permissions[`${menu.id}.${child.id}`]
                  ).length;
                  
                  return (
                    <div 
                      key={menu.id} 
                      className="border border-gray-4 rounded-lg overflow-hidden bg-white hover:border-brand/30 transition-colors"
                    >
                      {/* 一级菜单标题 */}
                      <div className="bg-gray-2 px-4 py-3 border-b border-gray-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isMainChecked}
                            onChange={() => toggleMenuPermission(menu.id)}
                            className="w-4 h-4 text-brand border-gray-4 rounded focus:ring-brand focus:ring-2"
                          />
                          <span className="text-body font-medium text-text-primary">{menu.label}</span>
                          <span className="text-caption text-text-placeholder ml-auto">
                            {checkedCount}/{menu.children.length}
                          </span>
                        </label>
                      </div>
                      
                      {/* 二级菜单表格 */}
                      <div className="p-3">
                        <div className="grid grid-cols-1 gap-1.5">
                          {menu.children.map(child => {
                            const isChecked = !!formData.permissions[`${menu.id}.${child.id}`];
                            return (
                              <label 
                                key={child.id} 
                                className="flex items-center gap-2 cursor-pointer py-1.5 px-2 rounded hover:bg-gray-2 transition-colors"
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => toggleSubMenuPermission(menu.id, child.id)}
                                  className="w-3.5 h-3.5 text-brand border-gray-4 rounded focus:ring-brand focus:ring-1"
                                />
                                <span className="text-caption text-text-secondary">{child.label}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <p className="text-caption text-text-placeholder mt-3">
              提示：可以勾选一级菜单快速全选，也可以单独勾选二级菜单进行精细控制
            </p>
          </div>

          {/* 底部按钮 */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-4">
            <Button
              onClick={() => setShowModal(false)}
              variant="secondary"
            >
              取消
            </Button>
            <Button
              onClick={handleSave}
              variant="primary"
            >
              {editingDept ? '保存' : '创建'}
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default DepartmentPermissions;

