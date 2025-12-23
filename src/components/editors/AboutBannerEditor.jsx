import { useState, useRef, useEffect } from 'react';
import { Image as ImageIcon, Palette } from 'lucide-react';
import { FormItem, Input, ImageSelector, EditorLayout } from '../ui';

const AboutBannerEditor = ({ data, onChange, imageLib }) => {
  // 追踪未保存的修改
  const savedDataRef = useRef(JSON.stringify(data));
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    setHasUnsavedChanges(JSON.stringify(data) !== savedDataRef.current);
  }, [data]);

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

  return (
    <EditorLayout
      title="Banner设置"
      description="此处的配置将应用于所有「关于我们」下的子页面，保持视觉统一。"
      pageKey="about_banner"
      onSave={handleSave}
      onSaveDraft={handleSaveDraft}
      hasUnsavedChanges={hasUnsavedChanges}
    >
      {/* 表单内容 */}
      <div>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <FormItem label="主标题">
              <Input value={data.title} onChange={e=>onChange({...data, title:e.target.value})} />
            </FormItem>
            <FormItem label="副标题">
              <Input value={data.subtitle} onChange={e=>onChange({...data, subtitle:e.target.value})} />
            </FormItem>
          </div>

          <FormItem label="背景模式">
            <div className="flex gap-3 mb-4">
              <button
                onClick={() => onChange({...data, bgType: 'color'})}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all ${
                  data.bgType === 'color'
                    ? 'bg-[#E6F1FF] border-[#2B7FFF] text-[#2B7FFF]'
                    : 'border-[#E6E8EB] text-[#4B4F55] hover:border-[#2B7FFF]/50'
                }`}
              >
                <Palette className="w-4 h-4" />
                <span className="font-medium text-sm">纯色背景</span>
              </button>
              <button
                onClick={() => onChange({...data, bgType: 'image'})}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all ${
                  data.bgType === 'image'
                    ? 'bg-[#E6F1FF] border-[#2B7FFF] text-[#2B7FFF]'
                    : 'border-[#E6E8EB] text-[#4B4F55] hover:border-[#2B7FFF]/50'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span className="font-medium text-sm">图片背景</span>
              </button>
            </div>
             
            {data.bgType === 'color' ? (
              <div className="flex gap-4 p-6 bg-[#F5F7FA] rounded-xl border border-[#F0F0F0]">
                {['bg-sky-900', 'bg-slate-800', 'bg-blue-900', 'bg-indigo-900'].map(c => (
                  <button key={c} onClick={()=>onChange({...data, bgValue: c})} className={`w-12 h-12 rounded-full ${c} ring-offset-2 transition-all ${data.bgValue===c?'ring-2 ring-[#2B7FFF] shadow-lg scale-110':'hover:scale-105 hover:shadow-md'}`}></button>
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

export default AboutBannerEditor;
