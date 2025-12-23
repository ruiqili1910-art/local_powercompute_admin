import { useState, useRef } from 'react';
import { Crop, Trash2, CloudUpload, Search, Check, X, RotateCcw } from 'lucide-react';
import Button from './Button';
import { IMAGE_CATEGORIES } from '../../constants/initialData';

// 常用裁剪比例
const CROP_RATIOS = [
  { id: 'free', label: '自由', value: null },
  { id: '1:1', label: '1:1', value: 1 },
  { id: '3:4', label: '3:4', value: 3/4 },
  { id: '4:3', label: '4:3', value: 4/3 },
  { id: '9:16', label: '9:16', value: 9/16 },
  { id: '16:9', label: '16:9', value: 16/9 },
];

const ImageSelector = ({ label, value, onChange, library = [], cropRatio }) => {
  const [activeTab, setActiveTab] = useState('local'); 
  const [showCropUI, setShowCropUI] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  
  // 本地上传和裁剪相关状态
  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedCropRatio, setSelectedCropRatio] = useState('free');
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 100, height: 100 });
  const fileInputRef = useRef(null);

  const handleSelect = (img) => {
    const newValue = { ...img, isCropped: !!cropRatio };
    onChange(newValue);
    if(cropRatio) setShowCropUI(true);
  };

  // 筛选图片：按搜索文本和分类
  const filteredLibrary = library.filter(img => {
    const matchSearch = searchText === '' || img.title.toLowerCase().includes(searchText.toLowerCase());
    const matchCategory = filterCategory === 'all' || img.category === filterCategory;
    return matchSearch && matchCategory;
  });

  // 处理本地文件上传
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage({
          file,
          preview: event.target.result,
          name: file.name
        });
        setShowCropUI(true);
        setSelectedCropRatio('free');
      };
      reader.readAsDataURL(file);
    }
  };

  // 确认裁剪
  const handleConfirmCrop = () => {
    if (uploadedImage) {
      const newValue = {
        id: `local_${Date.now()}`,
        title: uploadedImage.name,
        url: uploadedImage.preview,
        isLocal: true,
        cropRatio: selectedCropRatio
      };
      onChange(newValue);
      setUploadedImage(null);
      setShowCropUI(false);
    }
  };

  // 取消裁剪
  const handleCancelCrop = () => {
    setUploadedImage(null);
    setShowCropUI(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 获取裁剪框样式
  const getCropBoxStyle = () => {
    const ratio = CROP_RATIOS.find(r => r.id === selectedCropRatio);
    if (!ratio || !ratio.value) {
      return { paddingBottom: '75%' }; // 默认 4:3
    }
    return { paddingBottom: `${(1 / ratio.value) * 100}%` };
  };

  return (
    <div className="flex flex-col gap-3">
      {label && (
        <label className="text-sm font-medium text-[#4B4F55] flex justify-between items-center">
          {label}
          {cropRatio && <span className="text-xs text-[#2B7FFF] font-normal bg-[#E6F1FF] px-2 py-0.5 rounded-full">建议比例 {cropRatio}</span>}
        </label>
      )}
      
      {value ? (
        <div className="relative group rounded-md overflow-hidden border border-gray-4 bg-gray-3 shadow-light transition-all hover:shadow-base">
           {/* 图片显示 - 支持本地上传和资源库图片 */}
           {value.isLocal || value.url?.startsWith('data:') || value.url?.startsWith('http') || value.url?.startsWith('/') ? (
             <img 
               src={value.url} 
               alt={value.title || '图片'}
               className={`w-full ${cropRatio === '9:16' ? 'aspect-[9/16]' : 'h-48'} object-cover transition-all`}
             />
           ) : (
             <div className={`w-full ${cropRatio === '9:16' ? 'aspect-[9/16]' : 'h-48'} ${value.url} bg-cover bg-center transition-all`}></div>
           )}
           
           {/* 悬停操作 */}
           <div className="absolute inset-0 bg-gray-8/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-sm transition-all backdrop-blur-sm">
              <div className="flex gap-sm">
                <Button 
                  variant="secondary" 
                  className="!bg-white/20 !border-white/40 !text-white hover:!bg-white hover:!text-brand backdrop-blur-md !py-1.5 !px-3 !text-xs" 
                  onClick={() => {
                    setUploadedImage({ preview: value.url, name: value.title || '图片' });
                    setShowCropUI(true);
                  }}
                >
                  <Crop className="w-3.5 h-3.5"/> 重新裁剪
                </Button>
                <Button variant="secondary" className="!bg-error/80 !border-error/50 !text-white hover:!bg-error backdrop-blur-md !py-1.5 !px-3 !text-xs" onClick={()=>onChange(null)}>
                  <Trash2 className="w-3.5 h-3.5"/> 删除
                </Button>
              </div>
           </div>
           
           {/* 裁剪比例标签 */}
           {value.cropRatio && value.cropRatio !== 'free' && (
             <div className="absolute top-2 right-2">
               <span className="text-caption px-xs py-xxs rounded-xs bg-brand text-white font-medium">
                 {value.cropRatio}
               </span>
             </div>
           )}
        </div>
      ) : (
        <div className="space-y-md">
           {/* 切换标签 */}
           <div className="flex gap-1 bg-gray-3 p-1 rounded-sm w-fit">
              <button 
                onClick={()=>setActiveTab('local')} 
                className={`text-caption px-sm py-xxs rounded-xs transition-all font-medium ${activeTab==='local' ? 'bg-white text-gray-8 shadow-light' : 'text-gray-6 hover:text-gray-7'}`}
              >
                本地上传
              </button>
              <button 
                onClick={()=>setActiveTab('library')} 
                className={`text-caption px-sm py-xxs rounded-xs transition-all font-medium ${activeTab==='library' ? 'bg-white text-gray-8 shadow-light' : 'text-gray-6 hover:text-gray-7'}`}
              >
                资源库选择
              </button>
           </div>
           
           {/* 上传区域 */}
           {activeTab === 'local' ? (
             <div className="relative">
               <input
                 ref={fileInputRef}
                 type="file"
                 accept="image/jpeg,image/png,image/webp"
                 onChange={handleFileSelect}
                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
               />
               <div className="border-2 border-dashed border-gray-5 rounded-md h-40 flex flex-col items-center justify-center cursor-pointer hover:bg-brand-light hover:border-brand transition-all gap-sm group">
                  <div className="w-12 h-12 bg-white rounded-full shadow-base flex items-center justify-center group-hover:scale-110 transition-transform">
                    <CloudUpload className="w-6 h-6 text-brand" />
                  </div>
                  <div className="text-center">
                    <span className="text-body font-medium text-gray-8">点击上传文件</span>
                    <p className="text-caption text-gray-6 mt-xxs">支持 JPG, PNG (Max 5MB)，上传后可裁剪</p>
                  </div>
               </div>
             </div>
           ) : (
             <div className="space-y-sm">
                {/* 搜索和分类筛选 */}
                <div className="flex flex-col sm:flex-row gap-sm">
                  {/* 搜索框 */}
                  <div className="relative flex-1">
                    <Search className="absolute left-sm top-1/2 -translate-y-1/2 w-4 h-4 text-gray-6" />
                    <input
                      type="text"
                      placeholder="搜索图片..."
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      className="w-full pl-xxl pr-sm py-xs bg-gray-2 border border-gray-4 rounded-sm text-body text-gray-8 placeholder-gray-6 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                    />
                  </div>
                  {/* 分类筛选 */}
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-sm py-xs bg-gray-2 border border-gray-4 rounded-sm text-body text-gray-8 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all cursor-pointer"
                  >
                    {IMAGE_CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                {/* 图片列表 */}
                {filteredLibrary.length > 0 ? (
                  <div className="grid grid-cols-4 gap-sm max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                     {filteredLibrary.map(img => (
                       <button 
                         key={img.id} 
                         onClick={()=>handleSelect(img)} 
                         className="group relative aspect-square rounded-sm overflow-hidden ring-1 ring-gray-4 hover:ring-2 hover:ring-brand transition-all"
                         title={img.title}
                       >
                          <div className={`w-full h-full ${img.url} bg-cover group-hover:scale-105 transition-transform duration-500`}></div>
                          {/* 分类标签 */}
                          <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-sm px-xxs py-xxs">
                            <p className="text-[10px] text-white truncate text-center">{img.title}</p>
                          </div>
                       </button>
                     ))}
                  </div>
                ) : (
                  <div className="h-32 flex flex-col items-center justify-center text-gray-6">
                    <p className="text-body">没有找到匹配的图片</p>
                    <p className="text-caption mt-xxs">尝试调整搜索条件</p>
                  </div>
                )}
             </div>
           )}
        </div>
      )}

      {/* 裁剪弹窗 */}
      {showCropUI && uploadedImage && (
        <div className="fixed inset-0 bg-gray-8/80 backdrop-blur-sm z-50 flex items-center justify-center p-md">
          <div className="bg-white rounded-lg shadow-strong max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* 标题栏 */}
            <div className="flex items-center justify-between px-lg py-md border-b border-gray-4">
              <h3 className="text-section font-semibold text-gray-8">裁剪图片</h3>
              <button 
                onClick={handleCancelCrop}
                className="p-xxs text-gray-6 hover:text-gray-8 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 裁剪比例选择 */}
            <div className="px-lg py-md border-b border-gray-4">
              <p className="text-caption text-gray-6 mb-sm">选择裁剪比例</p>
              <div className="flex flex-wrap gap-xs">
                {CROP_RATIOS.map(ratio => (
                  <button
                    key={ratio.id}
                    onClick={() => setSelectedCropRatio(ratio.id)}
                    className={`px-md py-xs rounded-sm text-body font-medium transition-all ${
                      selectedCropRatio === ratio.id
                        ? 'bg-brand text-white'
                        : 'bg-gray-3 text-gray-7 hover:bg-gray-4'
                    }`}
                  >
                    {ratio.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 图片预览区 */}
            <div className="p-lg bg-gray-2">
              <div className="relative max-w-md mx-auto">
                {/* 原图 */}
                <div className="relative bg-gray-8 rounded-md overflow-hidden">
                  <img 
                    src={uploadedImage.preview} 
                    alt="预览" 
                    className="w-full h-auto max-h-80 object-contain"
                  />
                  {/* 裁剪框遮罩 */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div 
                      className="relative border-2 border-white shadow-lg bg-transparent"
                      style={{
                        width: selectedCropRatio === 'free' ? '80%' : 'auto',
                        height: selectedCropRatio === 'free' ? '80%' : 'auto',
                        aspectRatio: selectedCropRatio === 'free' ? 'auto' : selectedCropRatio.replace(':', '/'),
                        maxWidth: '90%',
                        maxHeight: '90%',
                      }}
                    >
                      {/* 四角标记 */}
                      <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-white"></div>
                      <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-white"></div>
                      <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-white"></div>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-white"></div>
                    </div>
                  </div>
                </div>
                
                {/* 图片名称 */}
                <p className="text-caption text-gray-6 text-center mt-sm truncate">
                  {uploadedImage.name}
                </p>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex items-center justify-between px-lg py-md border-t border-gray-4">
              <button
                onClick={() => setSelectedCropRatio('free')}
                className="flex items-center gap-xxs text-body text-gray-6 hover:text-gray-8 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                重置
              </button>
              <div className="flex gap-sm">
                <Button variant="secondary" onClick={handleCancelCrop}>
                  取消
                </Button>
                <Button onClick={handleConfirmCrop}>
                  <Check className="w-4 h-4" />
                  确认裁剪
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageSelector;



