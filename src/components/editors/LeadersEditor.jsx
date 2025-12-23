import { useState, useRef, useEffect } from 'react';
import { CheckSquare, GripVertical } from 'lucide-react';
import { EditorLayout } from '../ui';

const LeadersEditor = ({ data, onChange, peopleLib }) => {
  const [draggedId, setDraggedId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);
  const dragNode = useRef(null);

  // 追踪未保存的修改
  const savedDataRef = useRef(JSON.stringify(data));
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    setHasUnsavedChanges(JSON.stringify(data) !== savedDataRef.current);
  }, [data]);

  const handleSaveDraft = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('领导班子配置已保存:', data);
    savedDataRef.current = JSON.stringify(data);
    setHasUnsavedChanges(false);
  };

  const handleSave = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('领导班子配置已发布:', data);
    savedDataRef.current = JSON.stringify(data);
    setHasUnsavedChanges(false);
  };

  // 获取已选中的领导列表（按顺序）
  const selectedLeaders = data.leaderIds
    .map(id => peopleLib.find(p => p.id === id))
    .filter(Boolean);

  // 获取未选中的人员列表
  const unselectedPeople = peopleLib.filter(p => !data.leaderIds.includes(p.id));

  // 拖拽开始
  const handleDragStart = (e, id) => {
    setDraggedId(id);
    dragNode.current = e.target;
    e.target.style.opacity = '0.5';
    e.dataTransfer.effectAllowed = 'move';
  };

  // 拖拽结束
  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedId(null);
    setDragOverId(null);
    dragNode.current = null;
  };

  // 拖拽经过
  const handleDragOver = (e, id) => {
    e.preventDefault();
    if (draggedId === id) return;
    setDragOverId(id);
  };

  // 放置
  const handleDrop = (e, targetId) => {
    e.preventDefault();
    if (draggedId === targetId) return;
    
    const currentIds = [...data.leaderIds];
    const draggedIndex = currentIds.indexOf(draggedId);
    const targetIndex = currentIds.indexOf(targetId);
    
    if (draggedIndex === -1 || targetIndex === -1) return;
    
    // 移除拖拽项
    currentIds.splice(draggedIndex, 1);
    // 在目标位置插入
    currentIds.splice(targetIndex, 0, draggedId);
    
    onChange({ ...data, leaderIds: currentIds });
    setDragOverId(null);
  };

  // 选择/取消选择领导
  const handleToggleSelect = (id) => {
    const newIds = data.leaderIds.includes(id)
      ? data.leaderIds.filter(lid => lid !== id)
      : [...data.leaderIds, id];
    onChange({ ...data, leaderIds: newIds });
  };

  return (
    <EditorLayout
      title="领导班子"
      description="选择要在页面展示的领导班子成员，支持多选和拖拽排序。"
      pageKey="leaders"
      onSave={handleSave}
      onSaveDraft={handleSaveDraft}
      hasUnsavedChanges={hasUnsavedChanges}
    >
      {/* 已选领导（可拖拽排序） */}
      {selectedLeaders.length > 0 && (
        <div className="mb-lg">
          <h4 className="text-sm font-medium text-[#1C1F23] mb-3">
            已选领导 <span className="text-[#8A9099]">（拖拽调整顺序）</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {selectedLeaders.map((p, index) => (
              <div
                key={p.id}
                draggable
                onDragStart={(e) => handleDragStart(e, p.id)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => handleDragOver(e, p.id)}
                onDrop={(e) => handleDrop(e, p.id)}
                className={`flex items-center gap-3 p-4 border rounded-xl cursor-move transition-all bg-[#E6F1FF] border-[#2B7FFF] shadow-sm ${
                  dragOverId === p.id ? 'border-dashed border-2' : ''
                }`}
              >
                <div className="flex items-center gap-2 text-[#8A9099] cursor-grab active:cursor-grabbing">
                  <GripVertical className="w-4 h-4" />
                  <span className="text-xs font-medium w-5 text-center">{index + 1}</span>
                </div>
                <div className={`w-10 h-10 ${p.photo || 'bg-slate-200'} rounded-full bg-cover ring-2 ring-white shadow-md flex-shrink-0`}></div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-[#1C1F23] text-sm truncate">{p.name}</div>
                  <div className="text-xs text-[#8A9099] truncate">{p.title}</div>
                </div>
                <button
                  onClick={() => handleToggleSelect(p.id)}
                  className="p-1.5 rounded-lg hover:bg-white/50 text-[#2B7FFF] transition-colors"
                >
                  <CheckSquare className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 未选人员列表 */}
      <div className="pt-lg border-t border-gray-4">
        {unselectedPeople.length > 0 && (
          <>
            <h4 className="text-sm font-medium text-gray-8 mb-3">
              可选人员 <span className="text-gray-6">（点击添加）</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {unselectedPeople.map(p => (
                <label 
                  key={p.id} 
                  className="flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all bg-gray-2 border-gray-4 hover:border-brand/50"
                >
                  <div className="w-5 h-5 rounded flex items-center justify-center border transition-all border-gray-4 bg-white">
                  </div>
                  <input 
                    type="checkbox" 
                    className="hidden" 
                    checked={false} 
                    onChange={() => handleToggleSelect(p.id)}
                  />
                  <div className={`w-10 h-10 ${p.photo || 'bg-slate-200'} rounded-full bg-cover ring-2 ring-white shadow-md flex-shrink-0`}></div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-gray-8 text-sm truncate">{p.name}</div>
                    <div className="text-xs text-gray-6 truncate">{p.title}</div>
                  </div>
                </label>
              ))}
            </div>
          </>
        )}

        {unselectedPeople.length === 0 && selectedLeaders.length === 0 && (
          <div className="text-center py-12 text-gray-6">
            <p>暂无可选人员，请先在人员专家库中添加</p>
          </div>
        )}
      </div>
    </EditorLayout>
  );
};

export default LeadersEditor;
