import { useState, useRef, useEffect } from 'react';
import { FormItem, Input, TextArea, Button, EditorLayout, PageBanner, UnifiedHistoryModal, DataTable } from '../ui';
import { GripVertical, Trash2, Plus, Briefcase, Building, Phone } from 'lucide-react';

const PublicContactEditor = ({ data, onChange, messages = [] }) => {
  const [activeTab, setActiveTab] = useState('contact');
  
  // 追踪未保存的修改
  const savedDataRef = useRef(JSON.stringify(data));
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // 留言管理分页
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  
  // 拖拽状态
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  
  // 确保数据结构存在
  const departments = data?.departments || [];
  const faxPhone = data?.faxPhone || '';
  const officeAddress = data?.officeAddress || '';
  
  useEffect(() => {
    setHasUnsavedChanges(JSON.stringify(data) !== savedDataRef.current);
  }, [data]);
  
  // 留言管理分页数据
  const paginatedMessages = messages.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // 根据显示名称自动判断图标
  const getIconByName = (name) => {
    if (!name) return Phone;
    const lowerName = name.toLowerCase();
    if (lowerName.includes('热线') || lowerName.includes('招聘')) {
      return Briefcase;
    }
    if (lowerName.includes('部') || lowerName.includes('中心')) {
      return Building;
    }
    return Phone;
  };

  // 更新部门列表
  const updateDepartments = (newDepartments) => {
    onChange({ ...data, departments: newDepartments });
  };

  // 更新单个部门字段
  const updateDepartment = (index, field, value) => {
    const newDepartments = [...departments];
    newDepartments[index] = { ...newDepartments[index], [field]: value };
    updateDepartments(newDepartments);
  };

  // 添加新部门
  const handleAddDepartment = () => {
    const newDepartment = {
      id: `dept_${Date.now()}`,
      name: '',
      phone: '',
      email: ''
    };
    updateDepartments([...departments, newDepartment]);
  };

  // 删除部门
  const handleDeleteDepartment = (index) => {
    const newDepartments = departments.filter((_, i) => i !== index);
    updateDepartments(newDepartments);
  };

  // 拖拽排序
  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (index) => {
    if (draggedIndex !== null && draggedIndex !== index) {
      const newDepartments = [...departments];
      const [dragged] = newDepartments.splice(draggedIndex, 1);
      newDepartments.splice(index, 0, dragged);
      updateDepartments(newDepartments);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // 更新固定配置
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const handleSaveDraft = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('联系方式配置已保存:', data);
    savedDataRef.current = JSON.stringify(data);
    setHasUnsavedChanges(false);
  };

  const handleSave = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('联系方式配置已发布:', data);
    savedDataRef.current = JSON.stringify(data);
    setHasUnsavedChanges(false);
  };
  
  // 生成历史记录数据（模拟）
  const generateHistoryData = () => {
    return [
      { id: '1', time: '2025-12-11 10:30', operator: 'admin', action: '发布', changes: '发布联系方式配置' },
      { id: '2', time: '2025-12-10 15:20', operator: 'admin', action: '保存', changes: '保存联系方式配置' },
      { id: '3', time: '2025-12-09 09:15', operator: 'editor', action: '编辑', changes: '修改联系方式信息' },
    ];
  };

  const [showHistoryModal, setShowHistoryModal] = useState(false);
  
  // 留言管理表格列配置
  const messageColumns = [
    { key: 'name', title: '姓名', width: 120 },
    { key: 'email', title: '邮箱', width: 180 },
    { key: 'phone', title: '联系电话', width: 140 },
    { key: 'region', title: '地区', width: 120, render: (msg) => <span>{msg.region || '-'}</span> },
    { key: 'wechat', title: '微信号', width: 140, render: (msg) => <span>{msg.wechat || '-'}</span> },
    { key: 'content', title: '留言', width: 300, render: (msg) => <span className="line-clamp-2">{msg.content || '无内容'}</span> },
    { key: 'status', title: '状态', width: 100, render: (msg) => (
      <span className={`px-2 py-1 rounded-full text-xs ${
        msg.status === 'processed' ? 'bg-success-light text-success' :
        msg.status === 'closed' ? 'bg-error-light text-error' :
        'bg-warning-light text-warning'
      }`}>
        {msg.status === 'processed' ? '已处理' : 
         msg.status === 'closed' ? '已关闭' : '未处理'}
      </span>
    )},
    { key: 'createTime', title: '时间', width: 160 },
    { key: 'actions', title: '操作', width: 120, render: (msg) => (
      <div className="flex gap-2">
        <Button variant="secondary" className="!px-2 !py-1 !text-xs">处理</Button>
        <Button variant="secondary" className="!px-2 !py-1 !text-xs">备注</Button>
      </div>
    )},
  ];

  return (
    <>
      {activeTab === 'contact' ? (
        <EditorLayout
          title="联系方式"
          description="管理各部门联系信息、公共基础信息及用户留言。"
          pageKey="public_contact"
          onSave={handleSave}
          onSaveDraft={handleSaveDraft}
          hasUnsavedChanges={hasUnsavedChanges}
          historyData={generateHistoryData()}
        >
          {/* Tab 切换 - 按钮风格 */}
          <div className="px-xl py-md border-t border-gray-4">
            <div className="flex gap-1">
              <button
                onClick={() => setActiveTab('contact')}
                className={`px-md py-xs rounded-sm text-body font-medium transition-all ${
                  activeTab === 'contact'
                    ? 'bg-brand-light text-brand'
                    : 'text-gray-7 hover:text-gray-8 hover:bg-gray-3'
                }`}
              >
                联系方式
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className={`px-md py-xs rounded-sm text-body font-medium transition-all ${
                  activeTab === 'messages'
                    ? 'bg-brand-light text-brand'
                    : 'text-gray-7 hover:text-gray-8 hover:bg-gray-3'
                }`}
              >
                留言管理 ({messages.length})
              </button>
            </div>
          </div>

          {/* 内容区域 */}
          <div className="px-xl py-lg border-t border-gray-4 space-y-xxl">
            {/* 区域一：动态列表区（联系部门与热线） */}
            <div className="space-y-md">
              <div>
                <h3 className="text-section font-semibold text-gray-8 flex items-center gap-xs">
                  <Phone className="w-5 h-5 text-brand" />
                  部门与热线配置
                </h3>
                <p className="text-caption text-gray-6 mt-xxs">
                  管理各部门电话、邮箱及招聘热线，支持拖拽排序
                </p>
              </div>

              {/* 可编辑表格 */}
              <div className="bg-white border border-gray-4 rounded-md overflow-hidden">
                {/* 表头 */}
                <div className="grid grid-cols-[40px_1fr_200px_250px_100px] gap-md px-md py-sm bg-gray-2 border-b border-gray-4">
                  <div className="text-caption font-medium text-gray-7"></div>
                  <div className="text-caption font-medium text-gray-7">显示名称</div>
                  <div className="text-caption font-medium text-gray-7">联系电话</div>
                  <div className="text-caption font-medium text-gray-7">电子邮箱（选填）</div>
                  <div className="text-caption font-medium text-gray-7">操作</div>
                </div>

                {/* 表格内容 */}
                {departments.length > 0 ? (
                  <div className="divide-y divide-gray-4">
                    {departments.map((dept, index) => {
                      const IconComponent = getIconByName(dept.name);
                      return (
                        <div
                          key={dept.id}
                          draggable
                          onDragStart={() => handleDragStart(index)}
                          onDragOver={(e) => handleDragOver(e, index)}
                          onDrop={() => handleDrop(index)}
                          onDragEnd={handleDragEnd}
                          className={`grid grid-cols-[40px_1fr_200px_250px_100px] gap-md px-md py-sm items-center transition-all ${
                            draggedIndex === index ? 'opacity-50 bg-brand-light/20' :
                            dragOverIndex === index ? 'bg-brand-light/10 border-l-2 border-brand' :
                            'hover:bg-gray-2'
                          }`}
                        >
                          {/* 拖拽手柄 */}
                          <div className="flex items-center justify-center cursor-move opacity-50 hover:opacity-100">
                            <GripVertical className="w-5 h-5 text-gray-5" />
                          </div>

                          {/* 显示名称 */}
                          <div className="flex items-center gap-xs">
                            <IconComponent className="w-4 h-4 text-gray-6 flex-shrink-0" />
                            <Input
                              value={dept.name || ''}
                              onChange={e => updateDepartment(index, 'name', e.target.value)}
                              placeholder="请输入显示名称"
                              className="flex-1"
                            />
                          </div>

                          {/* 联系电话 */}
                          <Input
                            value={dept.phone || ''}
                            onChange={e => updateDepartment(index, 'phone', e.target.value)}
                            placeholder="请输入联系电话"
                          />

                          {/* 电子邮箱 */}
                          <Input
                            type="email"
                            value={dept.email || ''}
                            onChange={e => updateDepartment(index, 'email', e.target.value)}
                            placeholder="请输入电子邮箱（选填）"
                          />

                          {/* 操作 */}
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() => handleDeleteDepartment(index)}
                              className="p-xxs text-error hover:bg-error-light rounded-sm transition-colors"
                              title="删除"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="px-md py-xl text-center text-caption text-gray-6">
                    暂无联系项，点击下方按钮添加
                  </div>
                )}

                {/* 新增按钮 */}
                <div className="px-md py-md border-t border-gray-4">
                  <Button
                    variant="dashed"
                    onClick={handleAddDepartment}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4" />
                    新增联系项
                  </Button>
                </div>
              </div>
            </div>

            {/* 区域二：固定配置区（公共基础信息） */}
            <div className="space-y-md border-t border-gray-4 pt-lg">
              <div>
                <h3 className="text-section font-semibold text-gray-8 flex items-center gap-xs">
                  <Building className="w-5 h-5 text-brand" />
                  公共信息配置
                </h3>
                <p className="text-caption text-gray-6 mt-xxs">
                  配置传真、地址及地图定位
                </p>
              </div>

              <div className="space-y-md">
                <FormItem label="传真号码">
                  <Input
                    value={faxPhone}
                    onChange={e => handleChange('faxPhone', e.target.value)}
                    placeholder="请输入传真号码"
                  />
                </FormItem>

                <FormItem label="办公地址">
                  <TextArea
                    value={officeAddress}
                    onChange={e => handleChange('officeAddress', e.target.value)}
                    rows={3}
                    placeholder="请输入办公地址"
                  />
                </FormItem>
              </div>
            </div>
          </div>
        </EditorLayout>
      ) : (
        <div className="bg-white rounded-xl border border-gray-4 overflow-hidden">
          <PageBanner 
            title="联系方式"
            description="管理各部门联系信息、公共基础信息及用户留言。"
          />
          
          {/* Tab 切换 - 按钮风格 */}
          <div className="px-xl py-md border-t border-gray-4">
            <div className="flex gap-1">
              <button
                onClick={() => setActiveTab('contact')}
                className={`px-md py-xs rounded-sm text-body font-medium transition-all ${
                  activeTab === 'contact'
                    ? 'bg-brand-light text-brand'
                    : 'text-gray-7 hover:text-gray-8 hover:bg-gray-3'
                }`}
              >
                联系方式
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className={`px-md py-xs rounded-sm text-body font-medium transition-all ${
                  activeTab === 'messages'
                    ? 'bg-brand-light text-brand'
                    : 'text-gray-7 hover:text-gray-8 hover:bg-gray-3'
                }`}
              >
                留言管理 ({messages.length})
              </button>
            </div>
          </div>

          {/* 留言管理表格 */}
          <div className="border-t border-gray-4">
            <DataTable
              columns={messageColumns}
              data={paginatedMessages}
              currentPage={currentPage}
              pageSize={pageSize}
              total={messages.length}
              onPageChange={setCurrentPage}
              emptyText="暂无留言"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default PublicContactEditor;
