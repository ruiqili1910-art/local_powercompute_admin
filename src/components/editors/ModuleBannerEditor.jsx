import { useState, useRef, useEffect } from 'react';
import { Image as ImageIcon, Palette } from 'lucide-react';
import { FormItem, Input, ImageSelector, EditorLayout } from '../ui';

/**
 * 通用模块Banner设置编辑器
 * 与"关于我们"、"新闻中心"的Banner设置保持一致
 */
const ModuleBannerEditor = ({ 
  title = 'Banner设置',
  description = '此处的配置将应用于当前模块下的所有子页面，保持视觉统一。',
  pageKey = 'module-banner',
  data = {}, 
  onChange, 
  imageLib = [] 
}) => {
  // 记录上次保存的数据快照
  const savedDataRef = useRef(JSON.stringify(data));
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // 监听数据变化
  useEffect(() => {
    const currentData = JSON.stringify(data);
    setHasUnsavedChanges(currentData !== savedDataRef.current);
  }, [data]);

  // 保存配置
  const handleSaveDraft = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Banner配置已保存:', data);
    savedDataRef.current = JSON.stringify(data);
    setHasUnsavedChanges(false);
  };

  // 发布上线
  const handleSave = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Banner配置已发布:', data);
    savedDataRef.current = JSON.stringify(data);
    setHasUnsavedChanges(false);
  };

  const handleChange = (field, value) => {
    if (onChange) {
      onChange({ ...data, [field]: value });
    }
  };

  return (
    <EditorLayout
      title={title}
      description={description}
      pageKey={pageKey}
      onSave={handleSave}
      onSaveDraft={handleSaveDraft}
      hasUnsavedChanges={hasUnsavedChanges}
    >
      <div className="space-y-lg">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
          <FormItem label="主标题">
            <Input 
              value={data.title || ''} 
              onChange={e => handleChange('title', e.target.value)} 
              placeholder="请输入主标题"
            />
          </FormItem>
          <FormItem label="副标题">
            <Input 
              value={data.subtitle || ''} 
              onChange={e => handleChange('subtitle', e.target.value)} 
              placeholder="请输入副标题"
            />
          </FormItem>
        </div>

        <FormItem label="背景模式">
          <div className="flex gap-sm mb-md">
            <button
              onClick={() => handleChange('bgType', 'color')}
              className={`flex items-center gap-xs px-md py-xs rounded-sm border transition-all ${
                data.bgType === 'color'
                  ? 'bg-brand-light border-brand text-brand'
                  : 'border-gray-4 text-gray-7 hover:border-brand/50'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span className="font-medium text-body">纯色背景</span>
            </button>
            <button
              onClick={() => handleChange('bgType', 'image')}
              className={`flex items-center gap-xs px-md py-xs rounded-sm border transition-all ${
                data.bgType === 'image'
                  ? 'bg-brand-light border-brand text-brand'
                  : 'border-gray-4 text-gray-7 hover:border-brand/50'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span className="font-medium text-body">图片背景</span>
            </button>
          </div>
           
          {data.bgType === 'color' ? (
            <div className="flex gap-md p-lg bg-gray-2 rounded-md border border-gray-4">
              {[
                { value: 'bg-sky-900', color: '#0c4a6e' },
                { value: 'bg-slate-800', color: '#1e293b' },
                { value: 'bg-blue-900', color: '#1e3a8a' },
                { value: 'bg-indigo-900', color: '#312e81' },
                { value: 'bg-purple-900', color: '#581c87' },
                { value: 'bg-red-900', color: '#7f1d1d' },
                { value: 'bg-green-900', color: '#14532d' },
                { value: 'bg-teal-900', color: '#134e4a' },
              ].map(c => (
                <button 
                  key={c.value} 
                  onClick={() => handleChange('bgValue', c.value)} 
                  style={{ backgroundColor: c.color }}
                  className={`w-10 h-10 rounded-full ring-offset-2 transition-all ${
                    data.bgValue === c.value 
                      ? 'ring-2 ring-brand shadow-lg scale-110' 
                      : 'hover:scale-105 hover:shadow-md'
                  }`}
                />
              ))}
            </div>
          ) : (
            <ImageSelector 
              label="上传Banner背景图 (建议 1920x400)" 
              value={data.bgValue && data.bgType === 'image' ? { url: data.bgValue, title: 'Banner' } : null} 
              onChange={v => handleChange('bgValue', v?.url || '')} 
              library={imageLib} 
            />
          )}
        </FormItem>
      </div>
    </EditorLayout>
  );
};

export default ModuleBannerEditor;
