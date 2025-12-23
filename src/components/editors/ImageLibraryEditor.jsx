import { useState } from 'react';
import { Upload, Plus, Trash2, CloudUpload, FolderOpen, ChevronLeft, ChevronRight, X, Image } from 'lucide-react';
import { 
  Modal, Button, FormItem, Input, PageBanner, SearchFilterBar,
  ReferenceIndicator, DeleteConfirmModal, UnifiedHistoryModal
} from '../ui';
import { IMAGE_CATEGORIES } from '../../constants/initialData';

// 模拟操作日志数据
const MOCK_OPERATION_LOGS = [
  { id: 'log1', time: '2025-12-15 15:30', operator: 'admin', action: 'add', itemType: 'image', itemTitle: '公司大楼全景.jpg' },
  { id: 'log2', time: '2025-12-15 14:20', operator: 'admin', action: 'add', itemType: 'image', itemTitle: '董事长肖像.jpg' },
  { id: 'log3', time: '2025-12-15 11:45', operator: 'editor_zhang', action: 'delete', itemType: 'image', itemTitle: '施工现场_01.jpg' },
  { id: 'log4', time: '2025-12-14 16:00', operator: 'admin', action: 'add', itemType: 'image', itemTitle: '企业文化墙.jpg' },
  { id: 'log5', time: '2025-12-14 10:30', operator: 'editor_zhang', action: 'add', itemType: 'image', itemTitle: '荣誉墙合影.jpg' },
  { id: 'log6', time: '2025-12-13 14:15', operator: 'admin', action: 'add', itemType: 'image', itemTitle: '党建活动现场.jpg' },
  { id: 'log7', time: '2025-12-12 09:00', operator: 'admin', action: 'add', itemType: 'image', itemTitle: '新闻发布会.jpg' },
  { id: 'log8', time: '2025-12-11 16:30', operator: 'editor_zhang', action: 'add', itemType: 'image', itemTitle: '员工培训.jpg' },
  { id: 'log9', time: '2025-12-10 11:20', operator: 'admin', action: 'add', itemType: 'image', itemTitle: '项目竣工庆典.jpg' },
  { id: 'log10', time: '2025-12-09 14:45', operator: 'admin', action: 'add', itemType: 'image', itemTitle: '年度表彰大会.jpg' },
];

// 模拟引用关系数据（哪些页面引用了哪些图片）
// 格式：{ page: '页面名称', path: '页面路径' }
const MOCK_IMAGE_REFERENCES = {
  // img1: 公司大楼全景 - 被多个页面引用
  'img1': [
    { page: '首页 - Banner设置', path: '/home/banner' },
    { page: '关于我们 - Banner设置', path: '/about/banner' },
    { page: '关于我们 - 公司简介', path: '/about/intro' },
  ],
  // img2: 董事长肖像 - 被关于我们相关页面引用
  'img2': [
    { page: '首页 - 关于我们', path: '/home/about' },
    { page: '关于我们 - 公司简介', path: '/about/intro' },
    { page: '关于我们 - 董事长致辞', path: '/about/speech' },
  ],
  // img3: 施工现场 - 被业务相关页面引用
  'img3': [
    { page: '关于我们 - 公司简介', path: '/about/intro' },
    { page: '业务领域 - Banner设置', path: '/business/banner' },
    { page: '可持续发展 - Banner设置', path: '/sustain/banner' },
    { page: '业务领域 - 工程承包', path: '/business/engineering' },
  ],
  // img4: 企业文化墙 - 被文化相关页面引用
  'img4': [
    { page: '首页 - 业务板块', path: '/home/business' },
    { page: '首页 - 社会责任与文化', path: '/home/culture' },
    { page: '企业文化 - 核心价值观', path: '/culture/values' },
  ],
  // img5: 荣誉墙合影 - 被荣誉相关页面引用
  'img5': [
    { page: '新闻中心 - Banner设置', path: '/news/banner' },
    { page: '关于我们 - 发展历程', path: '/about/history' },
    { page: '关于我们 - 荣誉资质', path: '/about/honors' },
  ],
  // img6: 党建活动现场 - 被党建页面引用
  'img6': [
    { page: '党建领航 - Banner设置', path: '/party/banner' },
    { page: '党建领航 - 品牌形象', path: '/party/brand' },
  ],
  // img7: 新闻发布会 - 被新闻相关页面引用
  'img7': [
    { page: '新闻中心 - Banner设置', path: '/news/banner' },
    { page: '首页 - 最新动态', path: '/home/news' },
    { page: '新闻中心 - 公司要闻', path: '/news/company' },
  ],
  // img8: 员工培训 - 被人力资源相关页面引用
  'img8': [
    { page: '人力资源 - Banner设置', path: '/hr/banner' },
    { page: '人力资源 - 人才战略', path: '/hr/strategy' },
    { page: '人力资源 - 人才队伍', path: '/hr/team' },
  ],
  // img9: 项目竣工庆典 - 被业务相关页面引用
  'img9': [
    { page: '业务领域 - 工程承包', path: '/business/engineering' },
    { page: '业务领域 - 实业投资', path: '/business/industry' },
    { page: '首页 - 业务板块', path: '/home/business' },
  ],
  // img10: 年度表彰大会 - 被文化相关页面引用
  'img10': [
    { page: '企业文化 - 核心价值观', path: '/culture/values' },
    { page: '企业文化 - 精彩文化活动', path: '/culture/activities' },
    { page: '首页 - 社会责任与文化', path: '/home/culture' },
  ],
};

const ImageLibraryEditor = ({ library, onChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newImage, setNewImage] = useState({ title: '', category: 'about', url: '' });
  
  // 搜索、筛选、排序状态
  const [searchText, setSearchText] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('updateTime');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // 每页显示数量
  
  // 批量上传状态
  const [uploadFiles, setUploadFiles] = useState([]);
  
  // 删除确认弹窗状态
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteReferences, setDeleteReferences] = useState([]);
  
  // 历史记录弹窗状态
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // 搜索和筛选图片
  const filteredImages = library.filter(img => {
    // 搜索匹配（按标题）
    const matchSearch = searchText === '' || 
      (img.title && img.title.toLowerCase().includes(searchText.toLowerCase()));
    
    // 分类筛选
    const matchCategory = filterCategory === 'all' || img.category === filterCategory;
    
    return matchSearch && matchCategory;
  });

  // 排序图片
  const sortedImages = [...filteredImages].sort((a, b) => {
    let aVal = a[sortBy] || '';
    let bVal = b[sortBy] || '';
    
    if (sortBy === 'title') {
      aVal = (a.title || '').toLowerCase();
      bVal = (b.title || '').toLowerCase();
    } else if (sortBy === 'updateTime' || sortBy === 'createTime') {
      // 如果有时间字段，按时间排序
      aVal = new Date(aVal || 0).getTime();
      bVal = new Date(bVal || 0).getTime();
    }
    
    return sortOrder === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
  });

  // 分页计算
  const totalPages = Math.ceil(sortedImages.length / pageSize);
  const paginatedImages = sortedImages.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );


  // 获取引用关系
  const getReferences = (imageId) => {
    return MOCK_IMAGE_REFERENCES[imageId] || [];
  };

  // 删除图片前检查引用
  const handleDelete = (img) => {
    const refs = getReferences(img.id);
    setDeleteTarget(img);
    setDeleteReferences(refs);
    setShowDeleteModal(true);
  };

  // 确认删除图片
  const confirmDelete = () => {
    if (deleteTarget) {
      onChange(library.filter(img => img.id !== deleteTarget.id));
      setShowDeleteModal(false);
      setDeleteTarget(null);
    }
  };


  // 获取分类标签
  const getCategoryLabel = (categoryId) => {
    return IMAGE_CATEGORIES.find(c => c.id === categoryId)?.label || '未分类';
  };

  // 处理批量文件选择
  const handleFilesSelect = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map((file, index) => ({
      id: `upload_${Date.now()}_${index}`,
      file,
      name: file.name.replace(/\.[^/.]+$/, ''), // 去掉扩展名作为默认名称
      category: newImage.category,
      preview: URL.createObjectURL(file)
    }));
    setUploadFiles(prev => [...prev, ...newFiles]);
  };

  // 删除待上传的文件
  const handleRemoveUploadFile = (id) => {
    setUploadFiles(prev => prev.filter(f => f.id !== id));
  };

  // 更新待上传文件的信息
  const handleUpdateUploadFile = (id, field, value) => {
    setUploadFiles(prev => prev.map(f => 
      f.id === id ? { ...f, [field]: value } : f
    ));
  };

  // 批量上传确认
  const handleBatchUpload = () => {
    if (uploadFiles.length === 0) return;
    
    const newImages = uploadFiles.map(f => ({
      id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: f.name || '未命名图片',
      category: f.category,
      url: f.preview // 实际项目中这里应该是上传后的URL
    }));
    
    onChange([...library, ...newImages]);
    setUploadFiles([]);
    setIsModalOpen(false);
  };

  // 关闭弹窗时清理
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setUploadFiles([]);
    setNewImage({ title: '', category: 'about', url: '' });
  };
  
  return (
    <>
      <div className="bg-white rounded-xl border border-[#E6E8EB] overflow-hidden">
        {/* PageBanner */}
        <PageBanner 
          title="图片媒体库"
          description="统一管理网站所有图片资源，支持分类筛选和批量上传。"
          buttonText="上传图片"
          buttonIcon="add"
          onButtonClick={() => setIsModalOpen(true)}
          onHistoryClick={() => setShowHistoryModal(true)}
        />

        {/* 搜索筛选栏 */}
        <SearchFilterBar
          searchText={searchText}
          onSearchChange={(val) => {
            setSearchText(val);
            setCurrentPage(1); // 搜索时重置到第一页
          }}
          searchPlaceholder="搜索图片标题..."
          sortOptions={[
            { id: 'updateTime', label: '更新时间' },
            { id: 'createTime', label: '创建时间' },
            { id: 'title', label: '标题' }
          ]}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={(field, order) => {
            setSortBy(field);
            setSortOrder(order);
            setCurrentPage(1); // 排序时重置到第一页
          }}
          filterFields={[
            {
              id: 'category',
              label: '分类',
              type: 'select',
              value: filterCategory,
              options: [
                { value: 'all', label: '全部分类' },
                ...IMAGE_CATEGORIES.filter(c => c.id !== 'all').map(cat => ({ 
                  value: cat.id, 
                  label: cat.label 
                }))
              ]
            }
          ]}
          onFilterChange={(fieldId, value) => {
            if (fieldId === 'category') {
              setFilterCategory(value);
              setCurrentPage(1); // 筛选时重置到第一页
            }
          }}
          onFilterReset={() => {
            setFilterCategory('all');
            setCurrentPage(1);
          }}
        />

        {/* 图片列表 */}
        <div className="px-xl py-lg border-t border-gray-4">
          {sortedImages.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-lg">
                 {paginatedImages.map(img => (
                    <div key={img.id} className="group relative aspect-square rounded-md border border-gray-4 overflow-hidden shadow-light hover:shadow-strong hover:-translate-y-1 transition-all bg-white">
                       <div className={`w-full h-full ${img.url} bg-cover group-hover:scale-105 transition-transform duration-700`}></div>
                       
                       {/* 分类标签 */}
                       <div className="absolute top-2 left-2">
                         <span className="text-caption px-xs py-xxs rounded-xs bg-black/50 text-white backdrop-blur-sm font-medium">
                           {getCategoryLabel(img.category)}
                         </span>
                       </div>
                       
                       {/* 删除按钮 - 右上角，hover时显示 */}
                       <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Button 
                           variant="danger" 
                           className="!p-2 !rounded-full !shadow-lg"
                           onClick={() => handleDelete(img)}
                         >
                           <Trash2 className="w-4 h-4"/>
                         </Button>
                       </div>
                       
                       {/* 引用状态指示器 - 右下角 */}
                       <ReferenceIndicator refs={getReferences(img.id)} position="bottom-right" />
                       
                       <div className="absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur-md p-sm border-t border-gray-4">
                         <p className="text-caption text-gray-7 truncate font-medium text-center">{img.title}</p>
                       </div>
                    </div>
                 ))}
                 <button onClick={() => setIsModalOpen(true)} className="border-2 border-dashed border-gray-4 rounded-md flex flex-col items-center justify-center text-gray-6 hover:border-brand hover:text-brand hover:bg-brand-light transition-all aspect-square group">
                    <div className="w-10 h-10 bg-gray-3 rounded-full flex items-center justify-center mb-sm group-hover:bg-white group-hover:shadow-light transition-all">
                      <Plus className="w-5 h-5"/>
                    </div>
                    <span className="text-caption font-medium">点击上传</span>
                 </button>
              </div>
              
              {/* 分页组件 */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-lg pt-lg border-t border-gray-4">
                  <p className="text-caption text-gray-6">
                    共 {sortedImages.length} 张图片，当前第 {currentPage} / {totalPages} 页
                  </p>
                  <div className="flex items-center gap-xs">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-xs rounded-sm border border-gray-4 text-gray-7 hover:bg-gray-3 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 rounded-sm text-body font-medium transition-colors ${
                          currentPage === page
                            ? 'bg-brand text-white'
                            : 'text-gray-7 hover:bg-gray-3'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-xs rounded-sm border border-gray-4 text-gray-7 hover:bg-gray-3 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-xxl text-center">
              <div className="w-20 h-20 bg-gray-3 rounded-full flex items-center justify-center mb-md">
                <FolderOpen className="w-10 h-10 text-gray-4" />
              </div>
              <p className="text-body text-gray-6 mb-md">该分类下暂无图片</p>
              <Button onClick={() => setIsModalOpen(true)}>
                <Upload className="w-4 h-4"/> 上传图片
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* 上传弹窗 - 支持批量上传 */}
      <Modal 
         isOpen={isModalOpen} 
         onClose={handleCloseModal} 
         title="批量上传图片"
         footer={
            <>
              <Button variant="secondary" onClick={handleCloseModal}>取消</Button>
              <Button variant="primary" disabled={uploadFiles.length === 0} onClick={handleBatchUpload}>
                上传 {uploadFiles.length > 0 ? `(${uploadFiles.length})` : ''}
              </Button>
            </>
         }
      >
         <div className="space-y-lg">
           {/* 默认分类选择 */}
           <FormItem label="默认分类（新上传图片将归入此分类）">
             <div className="flex flex-wrap gap-xs">
               {IMAGE_CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                 <button
                   key={cat.id}
                   onClick={() => setNewImage({...newImage, category: cat.id})}
                   className={`px-md py-xs rounded-sm text-body font-medium transition-all ${
                     newImage.category === cat.id
                       ? 'bg-brand-light text-brand'
                       : 'bg-gray-3 text-gray-7 hover:bg-gray-4'
                   }`}
                 >
                   {cat.label}
                 </button>
               ))}
             </div>
           </FormItem>

           {/* 上传区域 */}
           <div className="relative">
             <input
               type="file"
               multiple
               accept="image/jpeg,image/png,image/webp"
               onChange={handleFilesSelect}
               className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
             />
             <div className="border-2 border-dashed border-gray-5 bg-gray-2 rounded-md p-xl flex flex-col items-center justify-center gap-md text-center cursor-pointer hover:bg-brand-light hover:border-brand transition-all">
                <div className="w-16 h-16 bg-white shadow-light text-brand rounded-full flex items-center justify-center ring-1 ring-gray-4">
                   <CloudUpload className="w-8 h-8" />
                </div>
                <div>
                   <h4 className="text-section font-semibold text-gray-8">点击或拖拽文件到此处</h4>
                   <p className="text-caption text-gray-6 mt-xxs">支持 JPG, PNG, WEBP (最大 10MB)，可同时选择多个文件</p>
                </div>
             </div>
           </div>

           {/* 待上传文件列表 */}
           {uploadFiles.length > 0 && (
             <div className="space-y-sm">
               <div className="flex items-center justify-between">
                 <span className="text-body font-medium text-gray-8">待上传文件 ({uploadFiles.length})</span>
                 <button 
                   onClick={() => setUploadFiles([])}
                   className="text-caption text-gray-6 hover:text-error transition-colors"
                 >
                   清空全部
                 </button>
               </div>
               <div className="max-h-60 overflow-y-auto space-y-sm custom-scrollbar">
                 {uploadFiles.map(file => (
                   <div key={file.id} className="flex items-center gap-sm p-sm bg-gray-2 rounded-sm border border-gray-4">
                     {/* 预览图 */}
                     <div className="w-12 h-12 rounded-xs overflow-hidden bg-gray-3 flex-shrink-0">
                       {file.preview ? (
                         <img src={file.preview} alt="" className="w-full h-full object-cover" />
                       ) : (
                         <div className="w-full h-full flex items-center justify-center">
                           <Image className="w-5 h-5 text-gray-5" />
                         </div>
                       )}
                     </div>
                     
                     {/* 文件信息 */}
                     <div className="flex-1 min-w-0">
                       <input
                         type="text"
                         value={file.name}
                         onChange={(e) => handleUpdateUploadFile(file.id, 'name', e.target.value)}
                         className="w-full text-body text-gray-8 bg-transparent border-none outline-none focus:bg-white focus:px-xs focus:py-xxs focus:rounded-xs focus:ring-1 focus:ring-brand transition-all"
                         placeholder="图片名称"
                       />
                       <select
                         value={file.category}
                         onChange={(e) => handleUpdateUploadFile(file.id, 'category', e.target.value)}
                         className="text-caption text-gray-6 bg-transparent border-none outline-none cursor-pointer"
                       >
                         {IMAGE_CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                           <option key={cat.id} value={cat.id}>{cat.label}</option>
                         ))}
                       </select>
                     </div>
                     
                     {/* 删除按钮 */}
                     <button
                       onClick={() => handleRemoveUploadFile(file.id)}
                       className="p-xxs text-gray-6 hover:text-error transition-colors"
                     >
                       <X className="w-4 h-4" />
                     </button>
                   </div>
                 ))}
               </div>
             </div>
           )}

           <div className="relative">
             <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-4"></span></div>
             <div className="relative flex justify-center text-caption uppercase"><span className="bg-white px-xs text-gray-6">OR</span></div>
           </div>
           
           <FormItem label="输入图片 URL">
             <Input placeholder="https://example.com/image.jpg" />
           </FormItem>
         </div>
      </Modal>

      {/* 删除确认弹窗 */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        target={deleteTarget}
        references={deleteReferences}
        onConfirm={confirmDelete}
        onClose={() => setShowDeleteModal(false)}
        itemTypeName="图片"
      />

      {/* 操作日志弹窗 */}
      <UnifiedHistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        title="图片媒体库 - 操作日志"
        mode="library"
        records={MOCK_OPERATION_LOGS}
      />
    </>
  );
};

export default ImageLibraryEditor;
