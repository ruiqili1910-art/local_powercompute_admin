import { useState, useEffect } from 'react';
import { X, User, Lock, Shield, Camera, Eye, EyeOff } from 'lucide-react';
import { Button, FormItem, Input } from './index';

/**
 * 个人中心抽屉组件 - 右侧滑出
 */
const UserProfileDrawer = ({ 
  isOpen, 
  onClose, 
  user,
  onUpdatePassword,
  onUpdateProfile
}) => {
  const [activeTab, setActiveTab] = useState('basic'); // basic, security, logs
  
  // 基础信息表单
  const [basicForm, setBasicForm] = useState({
    avatar: user?.avatar || 'A',
    nickname: user?.username || '管理员',
    department: '技术部',
    userId: user?.email?.split('@')[0] || 'admin'
  });

  // 当用户信息变化时更新表单
  useEffect(() => {
    if (user) {
      setBasicForm({
        avatar: user.avatar || 'A',
        nickname: user.username || '管理员',
        department: '技术部',
        userId: user.email?.split('@')[0] || 'admin'
      });
    }
  }, [user]);

  // 修改密码表单
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // 密码显示/隐藏状态
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 操作日志数据（模拟）
  const [operationLogs, setOperationLogs] = useState([
    { id: '1', time: '2025-01-15 14:30', ip: '192.168.1.100', location: '北京', device: 'Chrome 浏览器', action: '登录' },
    { id: '2', time: '2025-01-15 10:15', ip: '192.168.1.101', location: '北京', device: 'Safari 浏览器', action: '登录' },
    { id: '3', time: '2025-01-14 18:20', ip: '192.168.1.100', location: '北京', device: 'Chrome 浏览器', action: '修改密码' },
    { id: '4', time: '2025-01-14 16:45', ip: '192.168.1.102', location: '上海', device: 'Chrome 浏览器', action: '登录' },
    { id: '5', time: '2025-01-13 15:30', ip: '192.168.1.100', location: '北京', device: 'Chrome 浏览器', action: '修改密码' },
    { id: '6', time: '2025-01-14 09:20', ip: '192.168.1.100', location: '北京', device: 'Firefox 浏览器', action: '登录' },
    { id: '7', time: '2025-01-12 11:15', ip: '192.168.1.100', location: '北京', device: 'Chrome 浏览器', action: '修改密码' },
  ]);

  const handleSaveBasic = () => {
    console.log('保存基础信息:', basicForm);
    onUpdateProfile?.(basicForm);
  };

  const handleSavePassword = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('两次输入的密码不一致');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      alert('密码长度至少6位');
      return;
    }
    console.log('修改密码:', passwordForm);
    onUpdatePassword?.(passwordForm);
    
    // 添加修改密码记录到操作日志
    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newLog = {
      id: `log_${Date.now()}`,
      time: timeStr,
      ip: '192.168.1.100', // 可以从实际环境获取
      location: '北京',
      device: navigator.userAgent.includes('Chrome') ? 'Chrome 浏览器' : navigator.userAgent.includes('Safari') ? 'Safari 浏览器' : '其他浏览器',
      action: '修改密码'
    };
    setOperationLogs(prev => [newLog, ...prev]);
    
    // 清空表单
    setPasswordForm({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    // 重置密码显示状态
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    alert('密码修改成功');
  };

  const tabs = [
    { id: 'basic', label: '基础信息', icon: User },
    { id: 'security', label: '安全设置', icon: Lock },
    { id: 'logs', label: '操作日志', icon: Shield }
  ];

  return (
    <>
      {/* 遮罩层 */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-8/40 backdrop-blur-sm z-50 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* 抽屉 */}
      <div className={`
        fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-strong z-50
        transform transition-transform duration-300 ease-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        flex flex-col
      `}>
        {/* 头部 */}
        <div className="px-lg py-md border-b border-gray-4 flex items-center justify-between flex-shrink-0">
          <h2 className="text-section font-semibold text-gray-8">个人中心</h2>
          <button
            onClick={onClose}
            className="p-xs rounded-lg hover:bg-gray-3 text-gray-6 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab 导航 */}
        <div className="flex border-b border-gray-4 flex-shrink-0">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 flex items-center justify-center gap-2 px-md py-3 text-body font-medium
                transition-colors relative
                ${activeTab === tab.id
                  ? 'text-brand'
                  : 'text-gray-6 hover:text-gray-8'
                }
              `}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand" />
              )}
            </button>
          ))}
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-y-auto p-lg custom-scrollbar">
          {/* 基础信息 */}
          {activeTab === 'basic' && (
            <div className="space-y-lg">
              <div>
                <h3 className="text-body font-semibold text-gray-8 mb-md">基础信息</h3>
                
                {/* 头像 */}
                <div className="flex items-center gap-md mb-lg">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-brand to-aux-highlight flex items-center justify-center text-white text-title font-semibold">
                      {basicForm.avatar}
                    </div>
                    <button
                      className="absolute bottom-0 right-0 w-6 h-6 bg-brand rounded-full flex items-center justify-center text-white hover:bg-brand-hover transition-colors"
                      title="更换头像"
                    >
                      <Camera className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex-1">
                    <p className="text-caption text-gray-6 mb-1">头像</p>
                    <p className="text-body text-gray-7">点击右侧按钮更换头像</p>
                  </div>
                </div>

                {/* 表单 */}
                <div className="space-y-md">
                  <FormItem label="昵称" required>
                    <Input
                      value={basicForm.nickname}
                      onChange={e => setBasicForm({...basicForm, nickname: e.target.value})}
                      placeholder="请输入昵称"
                    />
                  </FormItem>

                  <FormItem label="邮箱">
                    <Input
                      value={user?.email || 'admin@cms.com'}
                      disabled
                      className="bg-gray-2"
                    />
                    <p className="text-caption text-gray-6 mt-1">邮箱不可修改</p>
                  </FormItem>

                  <FormItem label="部门">
                    <Input
                      value={basicForm.department}
                      disabled
                      className="bg-gray-2"
                    />
                    <p className="text-caption text-gray-6 mt-1">部门不可修改</p>
                  </FormItem>

                  <FormItem label="用户ID">
                    <Input
                      value={basicForm.userId}
                      disabled
                      className="bg-gray-2"
                    />
                    <p className="text-caption text-gray-6 mt-1">用户ID不可修改</p>
                  </FormItem>
                </div>

                <div className="flex justify-end gap-sm mt-lg">
                  <Button variant="secondary" onClick={onClose}>取消</Button>
                  <Button onClick={handleSaveBasic}>保存</Button>
                </div>
              </div>
            </div>
          )}

          {/* 安全设置 */}
          {activeTab === 'security' && (
            <div className="space-y-lg">
              <div>
                <h3 className="text-body font-semibold text-gray-8 mb-md">修改密码</h3>
                
                <div className="space-y-md">
                  <FormItem label="当前密码" required>
                    <Input
                      type="password"
                      value={passwordForm.oldPassword}
                      onChange={e => setPasswordForm({...passwordForm, oldPassword: e.target.value})}
                      placeholder="请输入当前密码"
                    />
                  </FormItem>

                  <FormItem label="新密码" required>
                    <div className="relative">
                      <Input
                        type={showNewPassword ? 'text' : 'password'}
                        value={passwordForm.newPassword}
                        onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                        placeholder="请输入新密码（至少6位）"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-6 hover:text-gray-8 transition-colors"
                        title={showNewPassword ? '隐藏密码' : '显示密码'}
                      >
                        {showNewPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </FormItem>

                  <FormItem label="确认新密码" required>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={passwordForm.confirmPassword}
                        onChange={e => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                        placeholder="请再次输入新密码"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-6 hover:text-gray-8 transition-colors"
                        title={showConfirmPassword ? '隐藏密码' : '显示密码'}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </FormItem>
                </div>

                <div className="flex justify-end gap-sm mt-lg">
                  <Button variant="secondary" onClick={onClose}>取消</Button>
                  <Button onClick={handleSavePassword}>保存</Button>
                </div>
              </div>
            </div>
          )}

          {/* 操作日志 */}
          {activeTab === 'logs' && (
            <div className="space-y-lg">
              <div>
                <h3 className="text-body font-semibold text-gray-8 mb-md">操作日志</h3>
                <p className="text-caption text-gray-6 mb-md">查看最近登录和密码修改记录，如有异常请及时修改密码</p>
                
                <div className="space-y-sm">
                  {operationLogs.map(log => (
                    <div
                      key={log.id}
                      className="p-md bg-gray-2 rounded-lg border border-gray-4 hover:border-brand transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            log.action === '登录' ? 'bg-success' : 'bg-brand'
                          }`}></div>
                          <span className="text-body font-medium text-gray-8">{log.action}</span>
                        </div>
                        <span className="text-caption text-gray-6">{log.time}</span>
                      </div>
                      <div className="space-y-1 text-caption text-gray-6">
                        <div className="flex items-center gap-4">
                          <span>IP地址：{log.ip}</span>
                          <span>位置：{log.location}</span>
                        </div>
                        <div>设备：{log.device}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserProfileDrawer;

