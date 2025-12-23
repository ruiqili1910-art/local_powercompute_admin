import { useState, useRef, useEffect } from 'react';
import { FormItem, Input, TextArea, ImageSelector, EditorLayout } from '../ui';

const SpeechEditor = ({ data, onChange, peopleLib, imageLib }) => {
  // 追踪未保存的修改
  const savedDataRef = useRef(JSON.stringify(data));
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    setHasUnsavedChanges(JSON.stringify(data) !== savedDataRef.current);
  }, [data]);

  const handleSaveDraft = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('董事长致辞配置已保存:', data);
    savedDataRef.current = JSON.stringify(data);
    setHasUnsavedChanges(false);
  };

  const handleSave = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('董事长致辞已发布:', data);
    savedDataRef.current = JSON.stringify(data);
    setHasUnsavedChanges(false);
  };

  // 只显示董事长和总经理
  const speakerCandidates = peopleLib.filter(p => 
    p.title === '董事长' || p.title === '总经理'
  );

  return (
    <EditorLayout
        title="董事长致辞"
        description="配置公司领导致辞内容，展示企业愿景与价值理念。"
      pageKey="speech"
      onSave={handleSave}
      onSaveDraft={handleSaveDraft}
      hasUnsavedChanges={hasUnsavedChanges}
    >
      <div className="space-y-6">
        {/* 致辞人设置 */}
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-gray-8">致辞人设置</h3>
          <div className="bg-gray-2 p-6 rounded-xl border border-gray-4 space-y-6">
            <FormItem label="选择致辞人">
              <select value={data.speakerId} onChange={e=>onChange({...data, speakerId:e.target.value})} className="w-full px-4 py-3 bg-white border border-gray-4 rounded-lg text-sm text-gray-8 outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all cursor-pointer">
                {speakerCandidates.map(p=><option key={p.id} value={p.id}>{p.name} - {p.title}</option>)}
              </select>
            </FormItem>
            <ImageSelector label="致辞人照片 (默认使用人员库头像，上传可覆盖)" value={data.customImage} onChange={img=>onChange({...data, customImage:img})} library={imageLib} />
          </div>
        </div>
         
        {/* 致辞内容 */}
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-gray-8">致辞内容</h3>
          <div className="bg-gray-2 p-6 rounded-xl border border-gray-4 space-y-6">
            <FormItem label="致辞标题">
              <Input value={data.content.title} onChange={e=>onChange({...data, content:{...data.content, title:e.target.value}})} className="font-bold"/>
            </FormItem>
            <FormItem label="致辞正文">
              <TextArea value={data.content.body} onChange={e=>onChange({...data, content:{...data.content, body:e.target.value}})} className="h-64 leading-relaxed"/>
            </FormItem>
          </div>
        </div>
      </div>
    </EditorLayout>
  );
};

export default SpeechEditor;
