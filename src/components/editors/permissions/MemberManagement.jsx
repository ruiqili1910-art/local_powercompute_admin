import { useState, useEffect, useRef } from 'react';
import { Edit2, Trash2, Key } from 'lucide-react';
import { SearchFilterBar, DataTable, Modal, FormItem, Input, Select, Button } from '../../ui';

/**
 * 成员管理组件
 */
const MemberManagement = ({ triggerAddMember = 0 }) => {
  // 初始成员数据
  const [members, setMembers] = useState([
    {
      id: 'U001',
      name: '李明',
      email: 'liming@cms.com',
      avatar: 'L',
      department: '技术部',
      role: '超级管理员',
      status: true
    },
    {
      id: 'U002',
      name: '王芳',
      email: 'wangfang@cms.com',
      avatar: 'W',
      department: '内容部',
      role: '编辑',
      status: true
    },
    {
      id: 'U003',
      name: '张伟',
      email: 'zhangwei@cms.com',
      avatar: 'Z',
      department: '市场部',
      role: '查看者',
      status: false
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    department: '',
    role: '',
    password: ''
  });

  // 部门列表
  const departments = [
    { value: 'all', label: '全部部门' },
    { value: '技术部', label: '技术部' },
    { value: '内容部', label: '内容部' },
    { value: '市场部', label: '市场部' },
    { value: '人力资源部', label: '人力资源部' }
  ];

  // 角色列表
  const roles = [
    { value: 'all', label: '全部角色' },
    { value: '超级管理员', label: '超级管理员' },
    { value: '编辑', label: '编辑' }
  ];

  // 筛选和排序成员
  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDepartment = 
      departmentFilter === 'all' || member.department === departmentFilter;

    const matchesRole = 
      roleFilter === 'all' || member.role === roleFilter;

    return matchesSearch && matchesDepartment && matchesRole;
  }).sort((a, b) => {
    if (!sortBy) return 0;
    
    const aVal = a[sortBy];
    const bVal = b[sortBy];
    
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

  // 使用ref跟踪上一次的triggerAddMember值
  const prevTriggerRef = useRef(triggerAddMember);

  // 监听外部触发的新增操作
  useEffect(() => {
    // 只有当triggerAddMember真正增加时才触发
    if (triggerAddMember > prevTriggerRef.current) {
      prevTriggerRef.current = triggerAddMember;
      handleOpenModal();
    }
  }, [triggerAddMember]);

  // 打开新增/编辑弹窗
  const handleOpenModal = (member = null) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        id: member.id,
        name: member.name,
        email: member.email,
        department: member.department,
        role: member.role,
        password: ''
      });
    } else {
      setEditingMember(null);
      setFormData({
        id: `U${String(members.length + 1).padStart(3, '0')}`,
        name: '',
        email: '',
        department: '',
        role: '',
        password: 'cms@123'
      });
    }
    setShowModal(true);
  };

  // 保存成员
  const handleSave = () => {
    if (editingMember) {
      // 编辑
      setMembers(members.map(m => 
        m.id === editingMember.id 
          ? { ...m, ...formData, avatar: formData.name.charAt(0).toUpperCase() }
          : m
      ));
    } else {
      // 新增
      setMembers([...members, {
        ...formData,
        avatar: formData.name.charAt(0).toUpperCase(),
        status: true
      }]);
    }
    setShowModal(false);
  };

  // 切换状态
  const handleToggleStatus = (id) => {
    setMembers(members.map(m => 
      m.id === id ? { ...m, status: !m.status } : m
    ));
  };

  // 删除成员
  const handleDelete = (id) => {
    if (confirm('确定要删除该成员吗？')) {
      setMembers(members.filter(m => m.id !== id));
    }
  };

  // 重置密码
  const handleResetPassword = (member) => {
    if (confirm(`确认要把该用户密码重置为：cms@123?`)) {
      alert(`用户 ${member.name} 的密码已重置为：cms@123`);
    }
  };

  // 表格列配置
  const columns = [
    {
      key: 'avatar',
      title: '头像',
      width: 80,
      render: (value, row) => (
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand to-aux-highlight flex items-center justify-center text-white text-caption font-semibold">
          {value}
        </div>
      )
    },
    {
      key: 'name',
      title: '姓名',
      width: 120,
      sortable: true,
      render: (value) => (
        <span className="font-normal text-text-primary">{value}</span>
      )
    },
    {
      key: 'id',
      title: 'ID',
      width: 100,
      render: (value) => (
        <span className="text-caption text-text-secondary font-mono">{value}</span>
      )
    },
    {
      key: 'email',
      title: '邮箱',
      width: 200,
      sortable: true
    },
    {
      key: 'department',
      title: '所属部门',
      width: 120,
      sortable: true,
      render: (value) => (
        <span className="px-2 py-1 bg-gray-2 text-text-secondary text-caption rounded">
          {value}
        </span>
      )
    },
    {
      key: 'role',
      title: '角色',
      width: 120,
      render: (value) => (
        <span className="px-2 py-1 bg-brand/10 text-brand text-caption rounded font-medium">
          {value}
        </span>
      )
    },
    {
      key: 'status',
      title: '状态',
      width: 100,
      render: (value, row) => (
        <button
          onClick={() => handleToggleStatus(row.id)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            value ? 'bg-brand' : 'bg-gray-4'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              value ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      )
    },
    {
      key: 'actions',
      title: '操作',
      width: 150,
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
            onClick={() => handleResetPassword(row)}
            className="p-1.5 text-text-placeholder hover:text-aux-highlight hover:bg-aux-highlight/10 rounded transition-colors"
            title="重置密码"
          >
            <Key className="w-4 h-4" />
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
      {/* 搜索、筛选区域 */}
      <SearchFilterBar
        searchText={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="搜索姓名、邮箱或ID..."
        filterFields={[
          {
            id: 'department',
            label: '部门',
            type: 'select',
            value: departmentFilter,
            options: departments
          },
          {
            id: 'role',
            label: '角色',
            type: 'select',
            value: roleFilter,
            options: roles
          }
        ]}
        onFilterChange={(fieldId, value) => {
          if (fieldId === 'department') {
            setDepartmentFilter(value);
          } else if (fieldId === 'role') {
            setRoleFilter(value);
          }
        }}
        onFilterReset={() => {
          setDepartmentFilter('all');
          setRoleFilter('all');
        }}
      />

      {/* 数据表格 */}
      <div className="border-t border-gray-4">
        <DataTable
          columns={columns}
          data={filteredMembers}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
          emptyText="暂无成员数据"
        />
      </div>

      {/* 新增/编辑弹窗 */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingMember ? '编辑成员' : '新增成员'}
        maxWidth="max-w-lg"
      >
        <div className="space-y-4">
          <FormItem label="用户ID" required>
            <Input
              value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              placeholder="自动生成或手动输入"
              disabled={!!editingMember}
            />
          </FormItem>

          <FormItem label="姓名" required>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="请输入姓名"
            />
          </FormItem>

          <FormItem label="邮箱" required>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="请输入邮箱（作为登录名）"
            />
          </FormItem>

          <FormItem label="所属部门" required hint="选择部门后将自动继承该部门的权限">
            <Select
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            >
              <option value="">请选择部门</option>
              {departments.filter(d => d.value !== 'all').map(dept => (
                <option key={dept.value} value={dept.value}>
                  {dept.label}
                </option>
              ))}
            </Select>
          </FormItem>

          <FormItem label="角色" required>
            <Select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="">请选择角色</option>
              {roles.filter(r => r.value !== 'all').map(role => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </Select>
          </FormItem>

          {!editingMember && (
            <FormItem label="初始密码">
              <Input
                type="text"
                value={formData.password}
                disabled
                className="bg-gray-2"
              />
            </FormItem>
          )}

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
              {editingMember ? '保存' : '创建'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MemberManagement;

