import { useState, useRef, useEffect } from 'react';
import { FormItem, Input, TextArea, ImageSelector, EditorLayout, StatsDisplay } from '../ui';

const IntroEditor = ({ data, onChange, imageLib, companyInfo }) => {
  // 记录上次保存的数据快照，用于比较是否有未保存的修改
  const savedDataRef = useRef(JSON.stringify(data));
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // 监听数据变化，判断是否有未保存的修改
  useEffect(() => {
    const currentData = JSON.stringify(data);
    setHasUnsavedChanges(currentData !== savedDataRef.current);
  }, [data]);

  // 保存配置
  const handleSaveDraft = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('公司简介配置已保存:', data);
    // 保存成功后更新快照
    savedDataRef.current = JSON.stringify(data);
    setHasUnsavedChanges(false);
  };

  // 发布上线
  const handleSave = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('公司简介已发布:', data);
    // 发布成功后更新快照
    savedDataRef.current = JSON.stringify(data);
    setHasUnsavedChanges(false);
  };

  // 处理数据展示变化
  const handleStatsChange = (newStats) => {
    onChange({...data, main: {...data.main, customStats: newStats}});
  };

  const handleModeChange = (mode) => {
    onChange({...data, main: {...data.main, statsMode: mode}});
  };

  const handleGlobalKeysChange = (keys) => {
    onChange({...data, main: {...data.main, selectedGlobalKeys: keys}});
  };

  return (
    <EditorLayout
      title="公司简介"
      description="配置公司简介页面的图文内容和数据展示。"
      pageKey="intro"
      onSave={handleSave}
      onSaveDraft={handleSaveDraft}
      hasUnsavedChanges={hasUnsavedChanges}
    >
      <div className="space-y-xl">
        {/* 图文内容配置 */}
        <div className="space-y-md">
          <h3 className="text-body font-semibold text-gray-8">图文内容配置</h3>
          <FormItem label="标题">
            <Input value={data.main?.title || ''} onChange={e => onChange({...data, main:{...data.main, title:e.target.value}})} />
          </FormItem>
          <FormItem label="正文">
            <TextArea value={data.main?.content || ''} onChange={e => onChange({...data, main:{...data.main, content:e.target.value}})} rows={6} />
          </FormItem>
          <ImageSelector 
            label="公司形象配图" 
            value={data.main?.image} 
            onChange={img => onChange({...data, main: {...data.main, image: img}})} 
            library={imageLib} 
          />
        </div>

        <div className="border-t border-gray-4" />
         
        {/* 核心数据展示 - 使用统一组件 */}
        <StatsDisplay
          title="核心数据展示"
          stats={data.main?.customStats || []}
          onChange={handleStatsChange}
          statsMode={data.main?.statsMode || 'custom'}
          onModeChange={handleModeChange}
          selectedGlobalKeys={data.main?.selectedGlobalKeys || []}
          onGlobalKeysChange={handleGlobalKeysChange}
          companyInfo={companyInfo}
          maxItems={4}
          cols={3}
        />
      </div>
    </EditorLayout>
  );
};

export default IntroEditor;
