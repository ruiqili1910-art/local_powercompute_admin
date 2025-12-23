import { useState, useMemo } from 'react';
import { Plus, User, GripVertical } from 'lucide-react';
import { 
  Modal, Button, FormItem, Input, TextArea, ImageSelector, PageBanner,
  ReferenceIndicator, ResourceActions, DeleteConfirmModal, UpdateConfirmModal, VersionHistoryModal,
  UnifiedHistoryModal, SearchFilterBar
} from '../ui';

// 模拟引用关系数据
const MOCK_PEOPLE_REFERENCES = {
  'p1': [
    { page: '董事长致辞', path: '/about/speech' },
    { page: '公司领导', path: '/about/leaders' },
  ],
  'p2': [
    { page: '公司领导', path: '/about/leaders' },
  ],
  'p3': [
    { page: '董事长致辞', path: '/about/speech' },
  ],
  'p4': [],
  'p5': [
    { page: '专家团队', path: '/about/experts' },
  ],
  'p6': [],
};

// 模拟版本历史
const MOCK_PEOPLE_VERSIONS = {
  'p1': [
    { version: 'V3', time: '2025-12-08 10:00', operator: 'admin', changes: '更新了个人简介' },
    { version: 'V2', time: '2025-11-20 14:30', operator: 'editor_zhang', changes: '更新了头像照片' },
    { version: 'V1', time: '2025-10-01 09:00', operator: 'admin', changes: '初始创建' },
  ],
  'p2': [
    { version: 'V2', time: '2025-12-05 11:00', operator: 'admin', changes: '更新了职位信息' },
    { version: 'V1', time: '2025-10-01 09:00', operator: 'admin', changes: '初始创建' },
  ],
  'p3': [
    { version: 'V1', time: '2025-10-15 10:00', operator: 'admin', changes: '初始创建' },
  ],
  'p4': [
    { version: 'V1', time: '2025-11-01 09:00', operator: 'admin', changes: '初始创建' },
  ],
  'p5': [
    { version: 'V1', time: '2025-11-10 14:00', operator: 'admin', changes: '初始创建' },
  ],
  'p6': [
    { version: 'V1', time: '2025-12-01 09:00', operator: 'admin', changes: '初始创建' },
  ],
};

// 模拟操作日志
const MOCK_PEOPLE_LOGS = [
  { id: 'log1', time: '2025-12-08 15:00', operator: 'admin', action: 'edit', itemTitle: '张三' },
  { id: 'log2', time: '2025-12-07 14:00', operator: 'editor_zhang', action: 'add', itemTitle: '王五' },
  { id: 'log3', time: '2025-12-06 10:00', operator: 'admin', action: 'delete', itemTitle: '临时人员' },
];

const PeopleLibraryEditor = ({ library = [], onChange, imageLib = [] }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingPerson, setEditingPerson] = useState(null);
  const [personForm, setPersonForm] = useState({ name: '', title: '', bio: '', photo: '' });

  // 搜索、筛选、排序状态
  const [searchText, setSearchText] = useState('');
  const [filterTitle, setFilterTitle] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // 弹窗状态
  const [showLogModal, setShowLogModal] = useState(false);
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [versionItem, setVersionItem] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteReferences, setDeleteReferences] = useState([]);
  const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);
  const [updateTarget, setUpdateTarget] = useState(null);
  const [updateReferences, setUpdateReferences] = useState([]);

  // 获取引用信息
  const getReferences = (personId) => MOCK_PEOPLE_REFERENCES[personId] || [];
  
  // 获取版本历史
  const getVersionHistory = (personId) => MOCK_PEOPLE_VERSIONS[personId] || [];

  // 添加人员
  const handleAdd = () => {
    setEditingIndex(null);
    setEditingPerson(null);
    setPersonForm({ name: '', title: '', bio: '', photo: '' });
    setIsModalOpen(true);
  };

  // 编辑人员
  const handleEdit = (person, index) => {
    setEditingIndex(index);
    setEditingPerson(person);
    setPersonForm({ ...person });
    setIsModalOpen(true);
  };

  // 实际执行保存
  const doSave = () => {
    const newLibrary = editingIndex !== null
      ? library.map((p, i) => i === editingIndex ? { ...p, ...personForm } : p)
      : [...library, { id: `p${Date.now()}`, ...personForm }];
    onChange(newLibrary);
    setIsModalOpen(false);
    setShowUpdateConfirm(false);
    setUpdateTarget(null);
  };

  // 保存人员（带引用检查）
  const handleSave = () => {
    if (!personForm.name) return alert('请输入姓名');
    
    // 如果是编辑且有引用，弹出确认
    if (editingPerson) {
      const refs = getReferences(editingPerson.id);
      if (refs.length > 0) {
        setUpdateTarget({ ...editingPerson, name: personForm.name });
        setUpdateReferences(refs);
        setShowUpdateConfirm(true);
        return;
      }
    }
    
    doSave();
  };

  // 查看历史版本
  const handleViewVersions = (person) => {
    setVersionItem(person);
    setShowVersionModal(true);
  };

  // 恢复版本
  const handleRestoreVersion = (version) => {
    if (confirm(`确定要恢复到 ${version.version} 版本吗？`)) {
      alert(`已恢复到 ${version.version} 版本`);
      setShowVersionModal(false);
    }
  };

  // 删除人员（带引用检查）
  const handleDelete = (person, index) => {
    const refs = getReferences(person.id);
    setDeleteTarget({ ...person, index });
    setDeleteReferences(refs);
    setShowDeleteModal(true);
  };

  // 确认删除
  const confirmDelete = () => {
    if (deleteTarget) {
      onChange(library.filter((_, i) => i !== deleteTarget.index));
      setShowDeleteModal(false);
      setDeleteTarget(null);
    }
  };

  // 拖拽排序
  const [draggedIndex, setDraggedIndex] = useState(null);

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    const newLibrary = [...library];
    const [draggedItem] = newLibrary.splice(draggedIndex, 1);
    newLibrary.splice(index, 0, draggedItem);
    onChange(newLibrary);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // 获取所有职位列表（用于筛选）
  const getAllTitles = useMemo(() => {
    const titles = [...new Set(library.map(p => p.title).filter(Boolean))];
    return titles;
  }, [library]);

  // 筛选和排序后的数据
  const filteredAndSortedLibrary = useMemo(() => {
    let filtered = [...library];

    // 搜索筛选
    if (searchText) {
      filtered = filtered.filter(person =>
        person.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        person.title?.toLowerCase().includes(searchText.toLowerCase()) ||
        person.bio?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // 职位筛选
    if (filterTitle !== 'all') {
      filtered = filtered.filter(person => person.title === filterTitle);
    }

    // 排序
    filtered.sort((a, b) => {
      let aVal, bVal;
      switch (sortBy) {
        case 'name':
          aVal = a.name || '';
          bVal = b.name || '';
          break;
        case 'title':
          aVal = a.title || '';
          bVal = b.title || '';
          break;
        default:
          aVal = a.name || '';
          bVal = b.name || '';
      }
      
      if (sortOrder === 'asc') {
        return aVal.localeCompare(bVal, 'zh-CN');
      } else {
        return bVal.localeCompare(aVal, 'zh-CN');
      }
    });

    return filtered;
  }, [library, searchText, filterTitle, sortBy, sortOrder]);

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-4 overflow-hidden">
        <PageBanner 
          title="人员专家库"
          description="统一管理公司领导、专家等人员信息，即时生效。"
          buttonText="新增人员"
          buttonIcon="add"
          onButtonClick={handleAdd}
          onHistoryClick={() => setShowLogModal(true)}
        />

        <div className="px-xl py-lg border-t border-gray-4">
          {/* 搜索、筛选、排序栏 */}
          <SearchFilterBar
            searchText={searchText}
            onSearchChange={setSearchText}
            searchPlaceholder="搜索姓名、职位、简介..."
            sortOptions={[
              { id: 'name', label: '姓名' },
              { id: 'title', label: '职位' }
            ]}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={(field, order) => {
              setSortBy(field);
              setSortOrder(order);
            }}
            filterFields={[
              {
                id: 'title',
                label: '职位',
                type: 'select',
                value: filterTitle,
                options: [
                  { value: 'all', label: '全部职位' },
                  ...getAllTitles.map(title => ({ value: title, label: title }))
                ]
              }
            ]}
            onFilterChange={(fieldId, value) => {
              if (fieldId === 'title') setFilterTitle(value);
            }}
            onFilterReset={() => {
              setFilterTitle('all');
              setSearchText('');
            }}
          />

          {filteredAndSortedLibrary.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg mt-lg">
              {filteredAndSortedLibrary.map((person, index) => {
                // 找到原始索引用于编辑和删除
                const originalIndex = library.findIndex(p => p.id === person.id);
                const refs = getReferences(person.id);
                
                return (
                  <div 
                    key={person.id}
                    draggable
                    onDragStart={() => handleDragStart(originalIndex)}
                    onDragOver={(e) => handleDragOver(e, originalIndex)}
                    onDragEnd={handleDragEnd}
                    className={`bg-white rounded-xl border border-gray-4 overflow-hidden group hover:shadow-lg hover:border-brand/30 transition-all cursor-move ${
                      draggedIndex === originalIndex ? 'opacity-50' : ''
                    }`}
                  >
                    {/* 头像区域 */}
                    <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-2 to-gray-3">
                      {person.photo && !person.photo.startsWith('bg-') ? (
                        <img src={person.photo} alt={person.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-20 h-20 text-gray-4" />
                        </div>
                      )}
                      
                      {/* 操作按钮 - 右上角 */}
                      <ResourceActions
                        onViewHistory={() => handleViewVersions(person)}
                        onEdit={() => handleEdit(person, originalIndex)}
                        onDelete={() => handleDelete(person, originalIndex)}
                        position="top-right"
                        showOnHover={true}
                      />
                      
                      {/* 引用状态指示器 - 右下角 */}
                      <ReferenceIndicator refs={refs} position="bottom-right" />
                      
                      {/* 拖拽手柄 */}
                      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="p-1 bg-white/80 rounded">
                          <GripVertical className="w-4 h-4 text-gray-6" />
                        </div>
                      </div>
                    </div>
                    
                    {/* 信息区域 */}
                    <div className="p-md">
                      <div className="flex items-start justify-between mb-sm">
                        <div>
                          <h4 className="text-section font-bold text-gray-8">{person.name}</h4>
                          <p className="text-caption text-brand">{person.title}</p>
                        </div>
                      </div>
                      {person.bio && (
                        <p className="text-caption text-gray-6 line-clamp-3">{person.bio}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : library.length === 0 ? (
            <div className="text-center py-xl">
              <User className="w-16 h-16 mx-auto mb-md text-gray-4" />
              <p className="text-body text-gray-6 mb-sm">暂无人员信息</p>
              <p className="text-caption text-gray-5 mb-lg">点击「新增人员」添加公司领导或专家</p>
              <Button variant="add" onClick={handleAdd}><Plus className="w-4 h-4" /> 新增人员</Button>
            </div>
          ) : (
            <div className="text-center py-xl">
              <User className="w-16 h-16 mx-auto mb-md text-gray-4" />
              <p className="text-body text-gray-6 mb-sm">未找到匹配的人员</p>
              <p className="text-caption text-gray-5 mb-lg">请尝试调整搜索或筛选条件</p>
            </div>
          )}
        </div>
      </div>

      {/* 编辑弹窗 */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingIndex !== null ? '编辑人员' : '添加人员'}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>取消</Button>
            <Button onClick={handleSave}>确认</Button>
          </>
        }
      >
        <div className="space-y-lg">
          <div className="flex gap-lg">
            <div className="w-1/3">
              <FormItem label="头像照片">
                <div className="aspect-square bg-gray-2 rounded-lg overflow-hidden">
                  <ImageSelector 
                    label="" 
                    value={personForm.photo ? { url: personForm.photo } : null} 
                    onChange={(img) => setPersonForm({...personForm, photo: img?.url || ''})} 
                    library={imageLib} 
                  />
                </div>
              </FormItem>
            </div>
            <div className="flex-1 space-y-md">
              <FormItem label="姓名" required>
                <Input 
                  value={personForm.name} 
                  onChange={e => setPersonForm({...personForm, name: e.target.value})} 
                  placeholder="输入姓名" 
                />
              </FormItem>
              <FormItem label="职位">
                <Input 
                  value={personForm.title} 
                  onChange={e => setPersonForm({...personForm, title: e.target.value})} 
                  placeholder="例如：董事长、总经理" 
                />
              </FormItem>
            </div>
          </div>
          <FormItem label="个人简介">
            <TextArea 
              value={personForm.bio} 
              onChange={e => setPersonForm({...personForm, bio: e.target.value})} 
              rows={4}
              placeholder="请输入个人简介..." 
            />
          </FormItem>
        </div>
      </Modal>

      {/* 操作日志弹窗 */}
      <UnifiedHistoryModal
        isOpen={showLogModal}
        onClose={() => setShowLogModal(false)}
        title="人员专家库 - 操作日志"
        mode="library"
        records={MOCK_PEOPLE_LOGS}
      />

      {/* 版本历史弹窗 */}
      <VersionHistoryModal
        isOpen={showVersionModal}
        item={versionItem}
        versions={versionItem ? getVersionHistory(versionItem.id) : []}
        onRestore={handleRestoreVersion}
        onClose={() => setShowVersionModal(false)}
      />

      {/* 删除确认弹窗 */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        target={deleteTarget}
        references={deleteReferences}
        onConfirm={confirmDelete}
        onClose={() => setShowDeleteModal(false)}
        itemTypeName="人员"
      />

      {/* 更新确认弹窗 */}
      <UpdateConfirmModal
        isOpen={showUpdateConfirm}
        target={updateTarget}
        references={updateReferences}
        onConfirm={doSave}
        onClose={() => {
          setShowUpdateConfirm(false);
          setUpdateTarget(null);
        }}
      />
    </>
  );
};

export default PeopleLibraryEditor;
