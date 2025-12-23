/**
 * 资源库通用组件
 * 包含：引用指示器、操作按钮组、引用检查弹窗、更新确认弹窗
 */
import { Link2, Clock, Edit, Trash2, AlertTriangle, X } from 'lucide-react';
import Button from './Button';

/**
 * 引用指示器组件
 * @param {Array} refs - 引用列表
 * @param {string} position - 位置 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
 */
export const ReferenceIndicator = ({ refs, position = 'bottom-right' }) => {
  if (!refs || refs.length === 0) return null;
  
  const positionClasses = {
    'top-left': 'top-2 left-2',
    'top-right': 'top-2 right-2',
    'bottom-left': 'bottom-2 left-2',
    'bottom-right': 'bottom-2 right-2',
  };
  
  const tooltipAlign = position.includes('left') ? 'left-0' : 'right-0';
  
  return (
    <div className={`absolute ${positionClasses[position]} z-10`}>
      <div className="relative group/ref">
        <div className="flex items-center gap-1 px-1.5 py-0.5 bg-brand/10 text-brand rounded text-xs font-medium border border-brand/20 backdrop-blur-sm">
          <Link2 className="w-3 h-3" />
          <span>{refs.length}</span>
        </div>
        {/* Hover 显示引用详情 - 向上弹出避免遮挡 */}
        <div className={`absolute ${tooltipAlign} bottom-full mb-1.5 opacity-0 group-hover/ref:opacity-100 pointer-events-none group-hover/ref:pointer-events-auto transition-opacity z-50`}>
          <div className="bg-gray-8 text-white text-xs rounded-lg px-3 py-2 shadow-xl whitespace-nowrap">
            <div className="font-medium mb-1">被 {refs.length} 个页面引用</div>
            {refs.slice(0, 3).map((ref, i) => (
              <div key={i} className="text-gray-4">• {ref.page}</div>
            ))}
            {refs.length > 3 && (
              <div className="text-gray-5 mt-1">还有 {refs.length - 3} 个...</div>
            )}
          </div>
          {/* 小箭头指向下方 */}
          <div className={`absolute ${tooltipAlign === 'left-0' ? 'left-3' : 'right-3'} top-full border-6 border-transparent border-t-gray-8`}></div>
        </div>
      </div>
    </div>
  );
};

/**
 * 资源操作按钮组
 * @param {Function} onViewHistory - 查看历史
 * @param {Function} onEdit - 编辑
 * @param {Function} onDelete - 删除
 * @param {string} position - 位置 'top-right' | 'inline'
 * @param {boolean} showOnHover - 是否悬停显示
 */
export const ResourceActions = ({ 
  onViewHistory, 
  onEdit, 
  onDelete, 
  position = 'top-right',
  showOnHover = true,
  className = ''
}) => {
  const baseClass = showOnHover 
    ? 'opacity-0 group-hover:opacity-100 transition-opacity' 
    : '';
  
  const positionClass = position === 'top-right' 
    ? 'absolute top-2 right-2' 
    : '';
  
  return (
    <div className={`flex items-center gap-1 ${positionClass} ${baseClass} ${className}`}>
      {onViewHistory && (
        <button 
          onClick={onViewHistory}
          className="p-1.5 bg-white rounded-md shadow-sm text-gray-6 hover:text-brand transition-colors"
          title="查看历史版本"
        >
          <Clock className="w-3.5 h-3.5" />
        </button>
      )}
      {onEdit && (
        <button 
          onClick={onEdit}
          className="p-1.5 bg-white rounded-md shadow-sm text-gray-6 hover:text-brand transition-colors"
          title="编辑"
        >
          <Edit className="w-3.5 h-3.5" />
        </button>
      )}
      {onDelete && (
        <button 
          onClick={onDelete}
          className="p-1.5 bg-white rounded-md shadow-sm text-gray-6 hover:text-error transition-colors"
          title="删除"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

/**
 * 删除确认弹窗（带引用检查）
 * @param {boolean} isOpen - 是否打开
 * @param {Object} target - 删除目标 { title/label, isStat }
 * @param {Array} references - 引用列表
 * @param {Function} onConfirm - 确认删除
 * @param {Function} onClose - 关闭弹窗
 * @param {string} itemTypeName - 资源类型名称（如 "资质"、"人员"）
 */
export const DeleteConfirmModal = ({ 
  isOpen, 
  target, 
  references = [], 
  onConfirm, 
  onClose,
  itemTypeName = '资源'
}) => {
  if (!isOpen || !target) return null;
  
  const itemName = target.label || target.title || target.name || '该项目';
  const hasRefs = references.length > 0;
  
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-md">
      <div className="absolute inset-0 bg-gray-8/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-strong w-full max-w-md overflow-hidden border border-gray-4">
        {!hasRefs ? (
          // 场景 A：无引用 - 普通删除确认
          <>
            <div className="p-lg text-center">
              <div className="w-16 h-16 mx-auto mb-md rounded-full bg-error/10 flex items-center justify-center">
                <Trash2 className="w-8 h-8 text-error" />
              </div>
              <h3 className="text-section text-gray-8 mb-xs">
                确定删除该{itemTypeName}吗？
              </h3>
              <p className="text-body text-gray-6">
                "{itemName}" 将被删除，此操作无法恢复。
              </p>
            </div>
            <div className="px-lg pb-lg flex items-center justify-center gap-sm">
              <Button variant="secondary" onClick={onClose}>取消</Button>
              <Button 
                onClick={onConfirm}
                className="bg-error hover:bg-error/90 text-white"
              >
                <Trash2 className="w-4 h-4" />
                确认删除
              </Button>
            </div>
          </>
        ) : (
          // 场景 B：有引用 - 警告提示
          <>
            <div className="p-lg">
              <div className="flex items-start gap-3 mb-md">
                <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-error" />
                </div>
                <div>
                  <h3 className="text-section text-error mb-xs">无法删除</h3>
                  <p className="text-body text-gray-6">
                    "{itemName}" 正被以下页面引用，请先移除引用后再删除。
                  </p>
                </div>
              </div>
              
              {/* 引用页面列表 */}
              <div className="bg-error/5 border border-error/20 rounded-lg p-md">
                <div className="text-caption text-error font-medium mb-sm">被引用的页面：</div>
                <div className="space-y-1">
                  {references.map((ref, i) => (
                    <div key={i} className="flex items-center gap-2 text-body text-gray-7">
                      <span className="w-1.5 h-1.5 bg-error rounded-full" />
                      {ref.page}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-lg pb-lg flex justify-end">
              <Button onClick={onClose}>我知道了</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

/**
 * 更新确认弹窗（带引用警告）
 * @param {boolean} isOpen - 是否打开
 * @param {Object} target - 更新目标
 * @param {Array} references - 引用列表
 * @param {Function} onConfirm - 确认更新
 * @param {Function} onClose - 关闭弹窗
 */
export const UpdateConfirmModal = ({ 
  isOpen, 
  target, 
  references = [], 
  onConfirm, 
  onClose 
}) => {
  if (!isOpen || !target) return null;
  
  const itemName = target.label || target.title || target.name || '该项目';
  
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-md">
      <div className="absolute inset-0 bg-gray-8/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-strong w-full max-w-md overflow-hidden border border-gray-4">
        <div className="p-lg">
          <div className="flex items-start gap-3 mb-md">
            <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-warning" />
            </div>
            <div>
              <h3 className="text-section text-gray-8 mb-xs">确认更新？</h3>
              <p className="text-body text-gray-6">
                "{itemName}" 正被以下页面引用，更新后将同步影响这些页面。
              </p>
            </div>
          </div>
          
          {/* 引用页面列表 */}
          <div className="bg-warning/5 border border-warning/20 rounded-lg p-md">
            <div className="text-caption text-warning font-medium mb-sm">将影响的页面：</div>
            <div className="space-y-1">
              {references.map((ref, i) => (
                <div key={i} className="flex items-center gap-2 text-body text-gray-7">
                  <span className="w-1.5 h-1.5 bg-warning rounded-full" />
                  {ref.page}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="px-lg pb-lg flex items-center justify-end gap-sm">
          <Button variant="secondary" onClick={onClose}>取消</Button>
          <Button onClick={onConfirm}>
            确认更新
          </Button>
        </div>
      </div>
    </div>
  );
};

/**
 * 版本历史弹窗
 * @param {boolean} isOpen - 是否打开
 * @param {Object} item - 资源项 { title/label/name, isStat }
 * @param {Array} versions - 版本列表
 * @param {Function} onRestore - 恢复版本
 * @param {Function} onClose - 关闭弹窗
 */
export const VersionHistoryModal = ({ 
  isOpen, 
  item, 
  versions = [], 
  onRestore, 
  onClose 
}) => {
  if (!isOpen || !item) return null;
  
  const itemName = item.label || item.title || item.name || '该项目';
  
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-md">
      <div className="absolute inset-0 bg-gray-8/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-strong w-full max-w-md overflow-hidden border border-gray-4">
        {/* 头部 */}
        <div className="px-lg py-md border-b border-gray-4 flex justify-between items-center">
          <div>
            <h3 className="text-section text-gray-8">版本历史</h3>
            <p className="text-caption text-gray-6 mt-0.5">{itemName}</p>
            {item.isStat && (
              <span className="inline-block mt-1 px-1.5 py-0.5 text-[10px] bg-gray-3 text-gray-6 rounded">
                数据展示项
              </span>
            )}
          </div>
          <button 
            onClick={onClose} 
            className="p-xs rounded-md hover:bg-gray-3 text-gray-6"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 版本列表 */}
        <div className="px-lg py-md max-h-[400px] overflow-y-auto">
          {versions.length === 0 ? (
            <div className="text-center py-8 text-gray-6">
              <Clock className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p>暂无版本历史</p>
            </div>
          ) : (
            versions.map((version, index) => (
              <div 
                key={version.version} 
                className={`relative pl-6 pb-4 ${index !== versions.length - 1 ? 'border-l-2 border-gray-4' : ''}`}
              >
                {/* 时间轴圆点 */}
                <div className={`absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full ${
                  index === 0 ? 'bg-brand' : 'bg-gray-4'
                }`} />
                
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-body font-medium ${index === 0 ? 'text-brand' : 'text-gray-8'}`}>
                        {version.version}
                      </span>
                      {index === 0 && (
                        <span className="px-1.5 py-0.5 text-xs bg-brand/10 text-brand rounded">当前</span>
                      )}
                    </div>
                    <div className="text-caption text-gray-6 mt-0.5">{version.changes}</div>
                    <div className="text-caption text-gray-5 mt-0.5">
                      {version.operator} · {version.time}
                    </div>
                  </div>
                  {index !== 0 && onRestore && (
                    <button
                      onClick={() => onRestore(version)}
                      className="flex items-center gap-1 text-caption text-brand hover:text-brand-hover"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>恢复</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* 底部 */}
        <div className="px-lg py-md border-t border-gray-4 flex justify-end">
          <Button onClick={onClose}>关闭</Button>
        </div>
      </div>
    </div>
  );
};

export default {
  ReferenceIndicator,
  ResourceActions,
  DeleteConfirmModal,
  UpdateConfirmModal,
  VersionHistoryModal,
};

