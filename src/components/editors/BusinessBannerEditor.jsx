import { useState, useRef, useEffect } from 'react';
import { FormItem, Input, EditorLayout, StatsDisplay } from '../ui';

/**
 * 业务领域 Banner 设置
 * - 背景图片固定不可更改
 * - 可修改主标题、副标题
 * - 展示数据：引用全局档案 或 自定义输入
 */
const BusinessBannerEditor = ({ data, onChange, companyInfo }) => {
  const [localData, setLocalData] = useState(data || {
    title: '七化建全球事业分布',
    subtitle1: '团队成员有着共同的愿景和目标',
    subtitle2: '成为中国化学行业的引领者',
    statsMode: 'custom',
    selectedGlobalKeys: [],
    customStats: []
  });

  // 追踪未保存的修改
  const savedDataRef = useRef(JSON.stringify(localData));
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    setHasUnsavedChanges(JSON.stringify(localData) !== savedDataRef.current);
  }, [localData]);

  // 保存配置（草稿）
  const handleSaveDraft = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    onChange(localData);
    savedDataRef.current = JSON.stringify(localData);
    setHasUnsavedChanges(false);
    console.log('Banner配置已保存:', localData);
  };

  // 发布上线
  const handleSave = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    onChange(localData);
    savedDataRef.current = JSON.stringify(localData);
    setHasUnsavedChanges(false);
    console.log('Banner配置已发布:', localData);
  };

  return (
    <EditorLayout
      title="Banner 设置"
      description="配置业务领域页面的顶部横幅，背景图片固定，可修改标题和展示数据。"
      pageKey="business_banner"
      onSave={handleSave}
      onSaveDraft={handleSaveDraft}
      hasUnsavedChanges={hasUnsavedChanges}
      historyData={[
        { id: 'h1', time: '2024-03-20 14:30', description: '更新了Banner标题和展示数据', operator: 'admin', status: 'published' },
        { id: 'h2', time: '2024-03-18 10:00', description: '修改了Banner副标题', operator: 'admin', status: 'published' },
      ]}
    >
      <div className="space-y-xl">
        {/* 背景图片预览（固定不可更改） */}
        <div className="space-y-sm">
          <h3 className="text-body font-semibold text-gray-8">背景图片</h3>
          <div className="relative rounded-lg overflow-hidden border border-gray-4">
            <div 
              className="h-32 bg-[#0a3d91] flex items-center justify-center"
              style={{
                backgroundImage: 'url(/business-banner-bg.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="absolute inset-0 bg-[#0a3d91]/80"></div>
              <p className="relative z-10 text-white/60 text-body">背景图片固定，不可更改</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-4" />

        {/* 标题设置 */}
        <div className="space-y-md">
          <h3 className="text-body font-semibold text-gray-8">标题设置</h3>
          <FormItem label="主标题">
            <Input
              value={localData.title || ''}
              onChange={e => setLocalData({ ...localData, title: e.target.value })}
              placeholder="例如：七化建全球事业分布"
            />
          </FormItem>
          <FormItem label="副标题（第一行）">
            <Input
              value={localData.subtitle1 || ''}
              onChange={e => setLocalData({ ...localData, subtitle1: e.target.value })}
              placeholder="例如：团队成员有着共同的愿景和目标"
            />
          </FormItem>
          <FormItem label="副标题（第二行）">
            <Input
              value={localData.subtitle2 || ''}
              onChange={e => setLocalData({ ...localData, subtitle2: e.target.value })}
              placeholder="例如：成为中国化学行业的引领者"
            />
          </FormItem>
        </div>

        <div className="border-t border-gray-4" />

        {/* 核心数据展示 - 使用统一组件 */}
        <StatsDisplay
          title="数据展示"
          stats={localData.customStats || []}
          onChange={(stats) => setLocalData({ ...localData, customStats: stats })}
          statsMode={localData.statsMode || 'custom'}
          onModeChange={(mode) => setLocalData({ ...localData, statsMode: mode })}
          selectedGlobalKeys={localData.selectedGlobalKeys || []}
          onGlobalKeysChange={(keys) => setLocalData({ ...localData, selectedGlobalKeys: keys })}
          companyInfo={companyInfo}
          maxItems={4}
          cols={4}
        />
      </div>
    </EditorLayout>
  );
};

export default BusinessBannerEditor;
