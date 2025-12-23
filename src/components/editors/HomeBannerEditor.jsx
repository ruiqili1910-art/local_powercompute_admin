import { useState, useRef, useEffect } from 'react';
import { Upload, X, Play } from 'lucide-react';
import { Input, FormItem, ImageSelector, EditorLayout } from '../ui';

const INITIAL_DATA = {
  title: '工程领域综合解决方案服务商',
  subtitle: '我们的愿景',
  english: 'Building a world-class enterprise with high-quality development',
  primaryButton: { text: '联系我们', link: '/contact', linkType: 'internal' },
  secondaryButton: { text: '了解更多', link: '/about', linkType: 'internal' },
  bgType: 'image', // 'image' | 'video'
  bgImage: '',
  bgVideo: ''
};


const HomeBannerEditor = ({ data = {}, onChange, imageLib = [] }) => {
  const [formData, setFormData] = useState({ ...INITIAL_DATA, ...data });
  const [isDragging, setIsDragging] = useState(false);
  const videoInputRef = useRef(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [initialData, setInitialData] = useState({ ...INITIAL_DATA, ...data });

  // 当外部data变化时，更新formData和初始数据
  useEffect(() => {
    const newData = { ...INITIAL_DATA, ...data };
    setFormData(newData);
    setInitialData(newData);
    setHasUnsavedChanges(false);
  }, [data]);

  // 检查是否有未保存的修改
  useEffect(() => {
    const hasChanges = JSON.stringify(formData) !== JSON.stringify(initialData);
    setHasUnsavedChanges(hasChanges);
  }, [formData, initialData]);

  const handleChange = (field, value) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
  };

  const handleButtonChange = (btnKey, field, value) => {
    const newBtn = { ...formData[btnKey], [field]: value };
    handleChange(btnKey, newBtn);
  };

  const handleSaveDraft = async () => {
    onChange && onChange(formData);
    setInitialData({ ...formData });
    setHasUnsavedChanges(false);
  };

  const handlePublish = async () => {
    onChange && onChange(formData);
    setInitialData({ ...formData });
    setHasUnsavedChanges(false);
  };

  // 视频上传
  const handleVideoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      handleChange('bgVideo', url);
      handleChange('bgType', 'video');
    }
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      handleChange('bgVideo', url);
      handleChange('bgType', 'video');
    }
  };

  // 渲染链接设置
  const renderLinkSetting = (btnKey, label, btnData) => {
    const prefix = '/';
    const example = '/about';
    
    return (
      <div className="space-y-md p-md bg-gray-2 rounded-lg">
        <h4 className="text-body font-semibold text-gray-8">{label}</h4>
        <FormItem label="按钮文字">
          <Input 
            value={btnData?.text || ''} 
            onChange={e => handleButtonChange(btnKey, 'text', e.target.value)} 
            placeholder="按钮显示文字"
          />
        </FormItem>
        <FormItem label="跳转链接（站内链接）">
          <div className="flex items-center gap-sm">
            <span className="text-caption text-gray-6 bg-gray-3 px-sm py-xs rounded">{prefix}</span>
            <Input 
              value={btnData?.link?.replace(prefix, '') || ''} 
              onChange={e => handleButtonChange(btnKey, 'link', prefix + e.target.value.replace(prefix, ''))} 
              placeholder={example}
              className="flex-1"
            />
          </div>
          <p className="text-caption text-gray-5 mt-xxs">示例：{example}</p>
        </FormItem>
      </div>
    );
  };

  // 模拟历史记录数据
  const historyData = [
    { id: 'h1', time: '2024-03-20 14:30', description: '更新了Banner标题和按钮设置', operator: 'admin', status: 'published' },
    { id: 'h2', time: '2024-03-20 14:25', description: '修改了Banner背景图片', operator: 'admin', status: 'draft' },
    { id: 'h3', time: '2024-03-18 10:00', description: '更新了Banner配置', operator: 'admin', status: 'published' },
  ];

  const handleRestoreHistory = (record) => {
    console.log('恢复版本:', record);
    // 这里可以根据record恢复数据
  };

  return (
    <EditorLayout
      title="首页 Banner 设置"
      description="配置官网首页顶部 Banner 的标题、副标题、英文、按钮和背景。"
      pageKey="home_banner"
      onSave={handlePublish}
      onSaveDraft={handleSaveDraft}
      onRestoreHistory={handleRestoreHistory}
      historyData={historyData}
      hasUnsavedChanges={hasUnsavedChanges}
    >
      <div className="space-y-lg">
        {/* 标题设置 */}
        <div className="space-y-md">
          <FormItem label="主标题">
            <Input 
              value={formData.title || ''} 
              onChange={e => handleChange('title', e.target.value)} 
              placeholder="如：工程领域综合解决方案服务商"
            />
          </FormItem>
          <FormItem label="副标题">
            <Input 
              value={formData.subtitle || ''} 
              onChange={e => handleChange('subtitle', e.target.value)} 
              placeholder="如：我们的愿景"
            />
          </FormItem>
          <FormItem label="英文">
            <Input 
              value={formData.english || ''} 
              onChange={e => handleChange('english', e.target.value)} 
              placeholder="如：Building a world-class enterprise with high-quality development"
            />
          </FormItem>
        </div>

        <div className="border-t border-gray-4" />

        {/* 背景设置 */}
        <div className="space-y-md">
          <h3 className="text-body font-semibold text-gray-8">背景设置</h3>
          <div className="flex gap-sm mb-md">
            {[{ v: 'image', l: '背景图片' }, { v: 'video', l: '背景视频' }].map(opt => (
              <button
                key={opt.v}
                onClick={() => handleChange('bgType', opt.v)}
                className={`px-md py-xs rounded-sm text-body ${
                  formData.bgType === opt.v ? 'bg-brand-light text-brand' : 'bg-gray-2 text-gray-6'
                }`}
              >
                {opt.l}
              </button>
            ))}
          </div>

          {formData.bgType === 'image' ? (
            <ImageSelector 
              label="背景图片"
              value={formData.bgImage ? { url: formData.bgImage } : null}
              onChange={img => handleChange('bgImage', img?.url || '')}
              library={imageLib}
            />
          ) : (
            <div className="space-y-sm">
              {formData.bgVideo ? (
                <div className="relative rounded-lg overflow-hidden bg-black">
                  <video src={formData.bgVideo} className="w-full h-48 object-cover" muted />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Play className="w-12 h-12 text-white" />
                  </div>
                  <button 
                    onClick={() => handleChange('bgVideo', '')}
                    className="absolute top-2 right-2 p-1.5 bg-white rounded-full text-gray-6 hover:text-error"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  className={`border-2 border-dashed rounded-lg p-xl text-center cursor-pointer transition-all ${
                    isDragging ? 'border-brand bg-brand-light' : 'border-gray-4 hover:border-brand'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => videoInputRef.current?.click()}
                >
                  <Upload className={`w-10 h-10 mx-auto mb-sm ${isDragging ? 'text-brand' : 'text-gray-5'}`} />
                  <p className="text-body text-gray-7">拖拽或点击上传视频</p>
                  <p className="text-caption text-gray-6">支持 MP4、WebM 格式</p>
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="hidden"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="border-t border-gray-4" />

        {/* 按钮设置 */}
        <div className="space-y-md">
          <h3 className="text-body font-semibold text-gray-8">按钮设置</h3>
          <div className="grid grid-cols-2 gap-lg">
            {renderLinkSetting('primaryButton', '主按钮（蓝色实心）', formData.primaryButton)}
            {renderLinkSetting('secondaryButton', '次按钮（透明边框）', formData.secondaryButton)}
          </div>
        </div>
      </div>
    </EditorLayout>
  );
};

export default HomeBannerEditor;
