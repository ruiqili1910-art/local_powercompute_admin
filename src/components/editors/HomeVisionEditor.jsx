import { Input, FormItem, TextArea, ImageSelector, PageBanner } from '../ui';

const HomeVisionEditor = ({ data, onChange, imageLib }) => {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const handleSave = () => {
    alert('配置已保存');
  };

  return (
    <div className="bg-white rounded-xl border border-[#E6E8EB] overflow-hidden">
      {/* PageBanner */}
      <PageBanner 
        title="我们的愿景"
        description="配置首页「我们的愿景」模块内容，支持静态文案、图片和跳转链接配置。"
        buttonText="保存配置"
        buttonIcon="save"
        onButtonClick={handleSave}
      />

      {/* 内容区域 */}
      <div className="px-xl py-lg border-t border-[#F0F0F0]">
        <div className="space-y-6">
          <FormItem label="标题">
            <Input 
              value={data.title || ''} 
              onChange={e => handleChange('title', e.target.value)} 
              placeholder="请输入标题"
            />
          </FormItem>

          <FormItem label="副标题">
            <Input 
              value={data.subtitle || ''} 
              onChange={e => handleChange('subtitle', e.target.value)} 
              placeholder="请输入副标题"
            />
          </FormItem>

          <FormItem label="描述内容">
            <TextArea 
              value={data.description || ''} 
              onChange={e => handleChange('description', e.target.value)} 
              rows={6}
              placeholder="请输入描述内容"
            />
          </FormItem>

          <FormItem label="背景图片">
            <ImageSelector 
              label="" 
              value={data.bgImage ? { url: data.bgImage, title: 'bg' } : null} 
              onChange={img => handleChange('bgImage', img?.url || '')} 
              library={imageLib} 
            />
          </FormItem>

          <div className="grid grid-cols-2 gap-6">
            <FormItem label="「了解更多」跳转链接">
              <Input 
                value={data.learnMoreLink || ''} 
                onChange={e => handleChange('learnMoreLink', e.target.value)} 
                placeholder="/about"
              />
            </FormItem>

            <FormItem label="「联系我们」跳转链接">
              <Input 
                value={data.contactLink || ''} 
                onChange={e => handleChange('contactLink', e.target.value)} 
                placeholder="/public-contact"
              />
            </FormItem>
          </div>

          <div className="flex items-center gap-3">
            <input 
              type="checkbox" 
              id="enabled"
              checked={data.enabled !== false}
              onChange={e => handleChange('enabled', e.target.checked)}
              className="w-4 h-4 text-[#2B7FFF] border-[#E6E8EB] rounded focus:ring-[#2B7FFF]"
            />
            <label htmlFor="enabled" className="text-sm text-[#4B4F55]">启用此模块</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeVisionEditor;
