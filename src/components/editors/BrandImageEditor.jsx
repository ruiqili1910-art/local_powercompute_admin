import { useState, useRef, useEffect } from 'react';
import { Upload, Music, Film, X, FileAudio, FileVideo } from 'lucide-react';
import { FormItem, Input, TextArea, ImageSelector, EditorLayout } from '../ui';

const BrandImageEditor = ({ data = {}, onChange, imageLib = [] }) => {
  const [activeTab, setActiveTab] = useState('declaration');
  const [isDragging, setIsDragging] = useState(false);
  const audioInputRef = useRef(null);
  const videoInputRef = useRef(null);

  // 记录上次保存的数据快照
  const savedDataRef = useRef(JSON.stringify(data));
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // 监听数据变化
  useEffect(() => {
    const currentData = JSON.stringify(data);
    setHasUnsavedChanges(currentData !== savedDataRef.current);
  }, [data]);

  const handleChange = (field, value) => {
    if (onChange) {
      onChange({ ...data, [field]: value });
    }
  };

  // 保存配置
  const handleSaveDraft = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('品牌形象配置已保存:', data);
    savedDataRef.current = JSON.stringify(data);
    setHasUnsavedChanges(false);
  };

  // 发布上线
  const handleSave = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('品牌形象已发布:', data);
    savedDataRef.current = JSON.stringify(data);
    setHasUnsavedChanges(false);
  };

  // 处理拖拽
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0], type);
    }
  };

  // 处理文件选择
  const handleFileSelect = (file, type) => {
    if (!file) return;
    
    // 验证文件类型
    if (type === 'audio') {
      if (!file.type.startsWith('audio/')) {
        alert('请选择音频文件');
        return;
      }
    } else if (type === 'video') {
      if (!file.type.startsWith('video/')) {
        alert('请选择视频文件');
        return;
      }
    }

    // 创建本地 URL 预览
    const fileUrl = URL.createObjectURL(file);
    const fileName = file.name;
    
    if (type === 'audio') {
      handleChange('song', { ...data.song, file: fileUrl, fileName });
    } else if (type === 'video') {
      handleChange('video', { ...data.video, file: fileUrl, fileName });
    }
  };

  // 清除文件
  const handleClearFile = (type) => {
    if (type === 'audio') {
      handleChange('song', { ...data.song, file: '', fileName: '' });
    } else if (type === 'video') {
      handleChange('video', { ...data.video, file: '', fileName: '' });
    }
  };

  return (
    <EditorLayout
      title="品牌形象"
      description="管理品牌形象内容：品牌宣言、企业厂歌、企业宣传片。"
      pageKey="brand-image"
      onSave={handleSave}
      onSaveDraft={handleSaveDraft}
      hasUnsavedChanges={hasUnsavedChanges}
    >
      {/* Tab 切换 */}
      <div className="mb-lg">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab('declaration')}
            className={`px-md py-xs rounded-sm text-body font-medium transition-all ${
              activeTab === 'declaration'
                ? 'bg-brand-light text-brand'
                : 'text-gray-7 hover:text-gray-8 hover:bg-gray-3'
            }`}
          >
            品牌宣言
          </button>
          <button
            onClick={() => setActiveTab('song')}
            className={`px-md py-xs rounded-sm text-body font-medium transition-all ${
              activeTab === 'song'
                ? 'bg-brand-light text-brand'
                : 'text-gray-7 hover:text-gray-8 hover:bg-gray-3'
            }`}
          >
            企业厂歌
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`px-md py-xs rounded-sm text-body font-medium transition-all ${
              activeTab === 'video'
                ? 'bg-brand-light text-brand'
                : 'text-gray-7 hover:text-gray-8 hover:bg-gray-3'
            }`}
          >
            企业宣传片
          </button>
        </div>
      </div>

      {/* Tab 内容 */}
      <div>
        {/* 品牌宣言 */}
        {activeTab === 'declaration' && (
          <div className="space-y-md">
            <FormItem label="品牌宣言标题">
              <Input 
                value={data.declaration?.title || ''} 
                onChange={e => handleChange('declaration', { ...data.declaration, title: e.target.value })} 
                placeholder="请输入品牌宣言标题"
              />
            </FormItem>
            <FormItem label="品牌宣言内容">
              <TextArea 
                value={data.declaration?.content || ''} 
                onChange={e => handleChange('declaration', { ...data.declaration, content: e.target.value })} 
                rows={8}
                placeholder="请输入品牌宣言内容"
              />
            </FormItem>
            <ImageSelector
              label="品牌宣言配图"
              value={data.declaration?.image ? { url: data.declaration.image } : null}
              onChange={img => handleChange('declaration', { ...data.declaration, image: img?.url || '' })}
              library={imageLib}
            />
          </div>
        )}

        {/* 企业厂歌 */}
        {activeTab === 'song' && (
          <div className="space-y-md">
            {/* 基本信息 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
              <FormItem label="歌曲名称">
                <Input 
                  value={data.song?.title || ''} 
                  onChange={e => handleChange('song', { ...data.song, title: e.target.value })} 
                  placeholder="请输入歌曲名称"
                />
              </FormItem>
              <FormItem label="作词">
                <Input 
                  value={data.song?.lyricist || ''} 
                  onChange={e => handleChange('song', { ...data.song, lyricist: e.target.value })} 
                  placeholder="请输入作词人"
                />
              </FormItem>
              <FormItem label="作曲">
                <Input 
                  value={data.song?.composer || ''} 
                  onChange={e => handleChange('song', { ...data.song, composer: e.target.value })} 
                  placeholder="请输入作曲人"
                />
              </FormItem>
            </div>

            <FormItem label="创作/发布年份">
              <Input 
                value={data.song?.year || ''} 
                onChange={e => handleChange('song', { ...data.song, year: e.target.value })} 
                placeholder="如：2020"
                className="max-w-xs"
              />
            </FormItem>
            
            {/* 音频文件 */}
            <FormItem label="厂歌音频文件">
              {data.song?.file ? (
                <div className="flex items-center gap-md p-md bg-gray-2 rounded-md border border-gray-4">
                  <div className="w-12 h-12 rounded-md bg-brand-light flex items-center justify-center">
                    <FileAudio className="w-6 h-6 text-brand" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-body font-medium text-gray-8 truncate">{data.song?.fileName || '音频文件'}</p>
                    <p className="text-caption text-gray-6">音频已上传</p>
                  </div>
                  <audio controls className="flex-shrink-0 h-10">
                    <source src={data.song.file} />
                  </audio>
                  <button 
                    onClick={() => handleClearFile('audio')}
                    className="p-xs text-gray-6 hover:text-error rounded-sm hover:bg-gray-3"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, 'audio')}
                  onClick={() => audioInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-md p-lg text-center cursor-pointer transition-all ${
                    isDragging ? 'border-brand bg-brand-light/30' : 'border-gray-4 hover:border-gray-5 hover:bg-gray-2'
                  }`}
                >
                  <input
                    ref={audioInputRef}
                    type="file"
                    accept="audio/*"
                    onChange={(e) => handleFileSelect(e.target.files?.[0], 'audio')}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center gap-sm">
                    <div className="w-12 h-12 rounded-full bg-gray-3 flex items-center justify-center">
                      <Music className="w-6 h-6 text-gray-6" />
                    </div>
                    <div>
                      <p className="text-body text-gray-7">拖拽音频文件到此处，或</p>
                      <p className="text-brand">点击上传</p>
                    </div>
                    <p className="text-caption text-gray-5">支持 MP3、WAV、OGG 等格式</p>
                  </div>
                </div>
              )}
            </FormItem>

            {/* 歌词节选 */}
            <FormItem label="歌词节选">
              <TextArea 
                value={data.song?.lyricsExcerpt || ''} 
                onChange={e => handleChange('song', { ...data.song, lyricsExcerpt: e.target.value })} 
                rows={4}
                placeholder="请输入歌词节选（用于官网展示的精华部分）"
              />
            </FormItem>

            {/* 创作背景 */}
            <FormItem label="创作背景">
              <TextArea 
                value={data.song?.background || ''} 
                onChange={e => handleChange('song', { ...data.song, background: e.target.value })} 
                rows={4}
                placeholder="请输入厂歌的创作背景、故事或寓意"
              />
            </FormItem>
          </div>
        )}

        {/* 企业宣传片 */}
        {activeTab === 'video' && (
          <div className="space-y-md">
            {/* 视频文件 */}
            <FormItem label="宣传片视频文件">
              {data.video?.file ? (
                <div className="space-y-sm">
                  <div className="flex items-center gap-md p-md bg-gray-2 rounded-md border border-gray-4">
                    <div className="w-12 h-12 rounded-md bg-brand-light flex items-center justify-center">
                      <FileVideo className="w-6 h-6 text-brand" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-body font-medium text-gray-8 truncate">{data.video?.fileName || '视频文件'}</p>
                      <p className="text-caption text-gray-6">视频已上传</p>
                    </div>
                    <button 
                      onClick={() => handleClearFile('video')}
                      className="p-xs text-gray-6 hover:text-error rounded-sm hover:bg-gray-3"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <video controls className="w-full max-h-80 rounded-md bg-black">
                    <source src={data.video.file} />
                  </video>
                </div>
              ) : (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, 'video')}
                  onClick={() => videoInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-md p-lg text-center cursor-pointer transition-all ${
                    isDragging ? 'border-brand bg-brand-light/30' : 'border-gray-4 hover:border-gray-5 hover:bg-gray-2'
                  }`}
                >
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    onChange={(e) => handleFileSelect(e.target.files?.[0], 'video')}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center gap-sm">
                    <div className="w-12 h-12 rounded-full bg-gray-3 flex items-center justify-center">
                      <Film className="w-6 h-6 text-gray-6" />
                    </div>
                    <div>
                      <p className="text-body text-gray-7">拖拽视频文件到此处，或</p>
                      <p className="text-brand">点击上传</p>
                    </div>
                    <p className="text-caption text-gray-5">支持 MP4、WebM、MOV 等格式</p>
                  </div>
                </div>
              )}
            </FormItem>

            <ImageSelector
              label="宣传片封面"
              value={data.video?.cover ? { url: data.video.cover } : null}
              onChange={img => handleChange('video', { ...data.video, cover: img?.url || '' })}
              library={imageLib}
            />

            <FormItem label="宣传片描述">
              <TextArea 
                value={data.video?.description || ''} 
                onChange={e => handleChange('video', { ...data.video, description: e.target.value })} 
                rows={4}
                placeholder="请输入宣传片描述"
              />
            </FormItem>
          </div>
        )}
      </div>
    </EditorLayout>
  );
};

export default BrandImageEditor;
