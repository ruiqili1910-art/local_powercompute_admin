import { createContext, useContext, useState, useCallback } from 'react';

/**
 * 未保存修改上下文
 * 用于全局管理编辑器的未保存状态，实现导航拦截
 */
const UnsavedChangesContext = createContext({
  hasUnsavedChanges: false,
  setHasUnsavedChanges: () => {},
  showLeaveConfirm: false,
  pendingNavigation: null,
  confirmNavigation: () => {},
  cancelNavigation: () => {},
  requestNavigation: () => true,
});

export const UnsavedChangesProvider = ({ children }) => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);

  // 请求导航 - 如果有未保存修改，显示确认弹窗
  const requestNavigation = useCallback((navigationCallback) => {
    if (hasUnsavedChanges) {
      setPendingNavigation(() => navigationCallback);
      setShowLeaveConfirm(true);
      return false; // 阻止导航
    }
    return true; // 允许导航
  }, [hasUnsavedChanges]);

  // 确认离开
  const confirmNavigation = useCallback(() => {
    setShowLeaveConfirm(false);
    setHasUnsavedChanges(false);
    if (pendingNavigation) {
      pendingNavigation();
      setPendingNavigation(null);
    }
  }, [pendingNavigation]);

  // 取消离开
  const cancelNavigation = useCallback(() => {
    setShowLeaveConfirm(false);
    setPendingNavigation(null);
  }, []);

  return (
    <UnsavedChangesContext.Provider
      value={{
        hasUnsavedChanges,
        setHasUnsavedChanges,
        showLeaveConfirm,
        pendingNavigation,
        confirmNavigation,
        cancelNavigation,
        requestNavigation,
      }}
    >
      {children}
    </UnsavedChangesContext.Provider>
  );
};

export const useUnsavedChanges = () => {
  const context = useContext(UnsavedChangesContext);
  if (!context) {
    throw new Error('useUnsavedChanges must be used within UnsavedChangesProvider');
  }
  return context;
};

export default UnsavedChangesContext;

