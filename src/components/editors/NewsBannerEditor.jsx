import { useState, useRef, useEffect } from 'react';
import { Image as ImageIcon, Palette } from 'lucide-react';
import { FormItem, Input, ImageSelector, EditorLayout } from '../ui';

// 模拟历史记录数据
const MOCK_BANNER_HISTORY = [
  { id: 'h1', time: '2024-03-20 14:30', description: '更新了Banner背景图片', operator: 'admin', status: 'published' },
  { id: 'h2', time: '2024-03-20 14:25', description: '更新了Banner背景图片', operator: 'admin', status: 'draft' },
  { id: 'h3', time: '2024-03-10 09:00', description: '修改了主标题和副标题', operator: 'admin', status: 'published' },
  { id: 'h4', time: '2024-03-10 08:45', description: '修改了主标题和副标题', operator: 'admin', status: 'draft' },
  { id: 'h5', time: '2024-01-20 09:00', description: '首次发布Banner配置', operator: 'admin', status: 'published' },
];

const NewsBannerEditor = ({ data, onChange, imageLib }) => {
  // 追踪未保存的修改
  const savedDataRef = useRef(JSON.stringify(data));
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [bgMode, setBgMode] = useState(data.bgType);

  const colorOptions = [
    { label: '深蓝', value: 'bg-blue-900' },
    { label: '靛蓝', value: 'bg-indigo-900' },
    { label: '深紫', value: 'bg-purple-900' },
    { label: '深青', value: 'bg-cyan-900' },
    { label: '深灰', value: 'bg-slate-800' },
    { label: '深红', value: 'bg-red-900' },
  ];

  useEffect(() => {
    setHasUnsavedChanges(JSON.stringify(data) !== savedDataRef.current);
    setBgMode(data.bgType);
  }, [data]);

  const handleBgModeChange = (mode) => {
    setBgMode(mode);
    onChange({ ...data, bgType: mode });
  };

  const handleSaveDraft = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Banner配置已保存:', data);
    savedDataRef.current = JSON.stringify(data);
    setHasUnsavedChanges(false);
  };

  const handleSave = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Banner配置已发布:', data);
    savedDataRef.current = JSON.stringify(data);
    setHasUnsavedChanges(false);
  };

  const handleRestoreHistory = (record) => {
    console.log('恢复版本:', record);
    // 实际项目中这里会恢复历史版本
  };

  return (
    <EditorLayout
      title="Banner设置"
      description="此处的配置将应用于所有「新闻中心」下的子页面，保持视觉统一。"
      pageKey="news_banner"
      onSave={handleSave}
      onSaveDraft={handleSaveDraft}
      onRestoreHistory={handleRestoreHistory}
      historyData={MOCK_BANNER_HISTORY}
      hasUnsavedChanges={hasUnsavedChanges}
    >
      {/* 表单内容 */}
      <div>
        <div className="space-y-6">
          {/* 标题设置 */}
          <div className="grid grid-cols-2 gap-6">
            <FormItem label="主标题">
              <Input
                value={data.title}
                onChange={e => onChange({ ...data, title: e.target.value })}
                placeholder="请输入主标题"
              />
            </FormItem>
            <FormItem label="副标题">
              <Input
                value={data.subtitle}
                onChange={e => onChange({ ...data, subtitle: e.target.value })}
                placeholder="请输入副标题/Slogan"
              />
            </FormItem>
          </div>

          {/* 背景模式切换 */}
          <FormItem label="背景模式">
            <div className="flex gap-3 mb-4">
              <button
                onClick={() => handleBgModeChange('color')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all ${
                  bgMode === 'color'
                    ? 'bg-[#E6F1FF] border-[#2B7FFF] text-[#2B7FFF]'
                    : 'border-[#E6E8EB] text-[#4B4F55] hover:border-[#2B7FFF]/50'
                }`}
              >
                <Palette className="w-4 h-4" />
                <span className="font-medium text-sm">纯色背景</span>
              </button>
              <button
                onClick={() => handleBgModeChange('image')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all ${
                  bgMode === 'image'
                    ? 'bg-[#E6F1FF] border-[#2B7FFF] text-[#2B7FFF]'
                    : 'border-[#E6E8EB] text-[#4B4F55] hover:border-[#2B7FFF]/50'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span className="font-medium text-sm">图片背景</span>
              </button>
            </div>
             
            {bgMode === 'color' ? (
              <div className="flex gap-4 p-6 bg-[#F5F7FA] rounded-xl border border-[#F0F0F0]">
                {colorOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => onChange({ ...data, bgValue: opt.value })}
                    className={`w-12 h-12 rounded-full ${opt.value} ring-offset-2 transition-all ${
                      data.bgValue === opt.value
                        ? 'ring-2 ring-[#2B7FFF] shadow-lg scale-110'
                        : 'hover:scale-105 hover:shadow-md'
                    }`}
                    title={opt.label}
                  />
                ))}
              </div>
            ) : (
              <ImageSelector 
                label="上传Banner背景图 (建议 1920x400)" 
                value={data.bgValue && data.bgType === 'image' ? { url: data.bgValue, title: 'Banner' } : null} 
                onChange={v => onChange({...data, bgValue: v?.url || ''})} 
                library={imageLib} 
              />
            )}
          </FormItem>
        </div>
      </div>
    </EditorLayout>
  );
};

export default NewsBannerEditor;
