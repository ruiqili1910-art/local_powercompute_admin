import { useState } from 'react';
import { PageBanner, UnifiedHistoryModal } from '../ui';
import MemberManagement from './permissions/MemberManagement';
import DepartmentPermissions from './permissions/DepartmentPermissions';

/**
 * 用户权限管理编辑器
 * 包含两个Tab：成员管理 和 部门权限设置
 */
const UserPermissionEditor = () => {
  const [activeTab, setActiveTab] = useState('members'); // 'members' | 'permissions'
  const [showHistory, setShowHistory] = useState(false);
  const [triggerAddMember, setTriggerAddMember] = useState(0);
  const [triggerAddDepartment, setTriggerAddDepartment] = useState(0);

  const tabs = [
    { id: 'members', label: '成员管理' },
    { id: 'permissions', label: '部门权限设置' }
  ];

  // 历史记录数据
  const historyData = [
    { id: 'v1', time: '2025-01-15 10:30', description: '新增成员"张三"', operator: 'admin' },
    { id: 'v2', time: '2025-01-14 14:20', description: '修改了技术部权限配置', operator: 'admin' },
    { id: 'v3', time: '2025-01-13 09:15', description: '删除成员"李四"', operator: 'admin' },
    { id: 'v4', time: '2025-01-12 16:00', description: '新增部门"财务部"', operator: 'admin' }
  ];

  // 处理新增按钮点击
  const handleAdd = () => {
    if (activeTab === 'members') {
      setTriggerAddMember(prev => prev + 1);
    } else {
      setTriggerAddDepartment(prev => prev + 1);
    }
  };

  // 获取当前Tab的按钮文字
  const getButtonText = () => {
    return activeTab === 'members' ? '新增成员' : '新增部门';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-4">
      {/* Banner */}
      <PageBanner
        title="用户权限管理"
        description="管理系统用户账号和部门权限配置"
        buttonText={getButtonText()}
        onButtonClick={handleAdd}
        buttonIcon="add"
        buttonVariant="secondary"
        onHistoryClick={() => setShowHistory(true)}
      />

      {/* Tab 切换 - 与其他页面统一的样式 */}
      <div className="flex items-center gap-2 border-b border-gray-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 text-body font-medium relative transition-colors ${
              activeTab === tab.id
                ? 'text-brand'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand"></div>
            )}
          </button>
        ))}
      </div>

      {/* Tab 内容 */}
      <div>
        {activeTab === 'members' && <MemberManagement triggerAddMember={triggerAddMember} />}
        {activeTab === 'permissions' && <DepartmentPermissions triggerAddDepartment={triggerAddDepartment} />}
      </div>

      {/* 历史记录弹窗 */}
      <UnifiedHistoryModal
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        title="用户权限管理"
        historyData={historyData}
      />
    </div>
  );
};

export default UserPermissionEditor;

