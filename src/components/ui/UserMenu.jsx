import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  User, LogOut, ExternalLink, Users, MoreVertical
} from 'lucide-react';

/**
 * 用户菜单组件 - 下拉菜单展开形式
 */
const UserMenu = ({ 
  user, 
  onLogout,
  onProfileClick,
  onVisitFrontend,
  onUserManagement
}) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  // 获取用户角色（可以根据实际情况从 user 对象中获取）
  const userRole = user?.role || '超级管理员';

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && 
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  // 切换菜单并计算位置
  const toggleMenu = () => {
    if (!showMenu && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      // 菜单显示在按钮右侧，向上偏移以确保完全可见
      const menuHeight = 220; // 预估菜单高度
      setMenuPosition({
        top: Math.max(8, rect.bottom - menuHeight), // 确保不超出顶部，最小距离顶部8px
        left: rect.right + 8
      });
    }
    setShowMenu(!showMenu);
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    onLogout?.();
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <>
      {/* 用户信息展示 - 左右分布 */}
      <div className="flex items-center justify-between gap-2 px-2">
        {/* 左侧：头像 */}
        <div className="w-9 h-9 flex-shrink-0 rounded-full bg-gradient-to-tr from-brand to-aux-highlight flex items-center justify-center text-white text-body font-semibold shadow-sm">
          {user?.avatar || 'A'}
        </div>
        
        {/* 中间：文本信息 */}
        <div className="flex-1 min-w-0 text-left">
          <div className="text-body font-medium text-text-primary truncate leading-tight">
            {user?.username || 'Admin'}
          </div>
          <div className="text-[11px] text-text-placeholder truncate leading-tight mt-0.5">
            {userRole}
          </div>
        </div>

        {/* 右侧：菜单按钮（3个竖点） */}
        <button
          ref={buttonRef}
          onClick={toggleMenu}
          className="flex items-center justify-center w-6 h-6 text-text-placeholder hover:text-text-primary hover:bg-gray-3 rounded transition-colors"
        >
          <MoreVertical className="w-4 h-4" strokeWidth={2} />
        </button>
      </div>

      {/* 下拉菜单 - 使用Portal渲染到body */}
      {showMenu && createPortal(
        <div 
          ref={menuRef}
          className="fixed w-48 bg-white rounded-lg shadow-strong border border-gray-4 py-1 animate-in fade-in slide-in-from-left-2 duration-200"
          style={{
            top: `${menuPosition.top}px`,
            left: `${menuPosition.left}px`,
            zIndex: 99999
          }}
        >
          {/* 访问前台 */}
          <button
            onClick={() => {
              onVisitFrontend?.();
              setShowMenu(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-text-secondary hover:text-brand hover:bg-brand/5 transition-colors"
          >
            <ExternalLink className="w-[18px] h-[18px] flex-shrink-0" strokeWidth={2} />
            <span className="text-body font-medium">访问前台</span>
          </button>

          {/* 个人中心 */}
          <button
            onClick={() => {
              onProfileClick?.();
              setShowMenu(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-text-secondary hover:text-text-primary hover:bg-gray-3 transition-colors"
          >
            <User className="w-[18px] h-[18px] flex-shrink-0" strokeWidth={2} />
            <span className="text-body font-medium">个人中心</span>
          </button>

          {/* 用户权限 */}
          <button
            onClick={() => {
              onUserManagement?.();
              setShowMenu(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-text-secondary hover:text-aux-highlight hover:bg-aux-highlight/5 transition-colors"
          >
            <Users className="w-[18px] h-[18px] flex-shrink-0" strokeWidth={2} />
            <span className="text-body font-medium">用户权限</span>
          </button>

          {/* 分隔线 */}
          <div className="my-1 border-t border-gray-4"></div>

          {/* 退出登录 */}
          <button
            onClick={() => {
              handleLogoutClick();
              setShowMenu(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-text-secondary hover:text-error hover:bg-error/5 transition-colors"
          >
            <LogOut className="w-[18px] h-[18px] flex-shrink-0" strokeWidth={2} />
            <span className="text-body font-medium">退出登录</span>
          </button>
        </div>,
        document.body
      )}

      {/* 退出确认对话框 - 使用Portal渲染到body */}
      {showLogoutConfirm && createPortal(
        <>
          {/* 遮罩层 */}
          <div 
            className="fixed inset-0 bg-gray-8/40 backdrop-blur-sm transition-opacity duration-300"
            style={{ zIndex: 999999 }}
            onClick={cancelLogout}
          />

          {/* 对话框 */}
          <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 999999 }}>
            <div className="bg-white rounded-xl shadow-strong border border-gray-4 w-full max-w-sm animate-in fade-in zoom-in-95 duration-200">
              {/* 头部 */}
              <div className="px-6 py-4 border-b border-gray-4">
                <h3 className="text-section font-semibold text-gray-8">确认退出</h3>
              </div>

              {/* 内容 */}
              <div className="px-6 py-5">
                <p className="text-body text-gray-7">
                  您确定要退出登录吗？
                </p>
              </div>

              {/* 底部按钮 */}
              <div className="px-6 py-4 border-t border-gray-4 flex items-center justify-end gap-3">
                <button
                  onClick={cancelLogout}
                  className="px-4 py-2 text-body font-medium text-gray-7 hover:text-gray-8 hover:bg-gray-3 rounded-lg transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={confirmLogout}
                  className="px-4 py-2 text-body font-medium text-white bg-error hover:bg-error/90 rounded-lg transition-colors"
                >
                  确认退出
                </button>
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
};

export default UserMenu;

