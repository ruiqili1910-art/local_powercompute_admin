import { useState, useRef, useEffect } from 'react';
import { Plus, Edit, Trash2, FileText, Upload, X, Download, Eye } from 'lucide-react';
import { Button, Input, FormItem, TextArea, ImageSelector, Modal, PageBanner, EditorLayout, FloatingActionBar, UnifiedHistoryModal } from '../ui';

// 初始ESG报告数据
const INITIAL_ESGS = [
  { 
    id: 'esg_1', 
    year: '2024', 
    title: '2024年度ESG报告', 
    covers: ['/placeholder-esg.jpg'],
    summary: [
      '完善ESG治理架构，建立董事会直接领导机制',
      '实施绿色生产，单位产值能耗同比下降15%',
      '员工培训投入同比增长20%，满意度达97%',
      '社区公益投入超过1亿元'
    ],
    file: '',
    fileName: '',
    publishDate: '2024年6月',
    status: 'published'
  },
];

const SustainESGEditor = ({ data = {}, onChange, imageLib = [] }) => {
  const [esgs, setEsgs] = useState(data.esgs || INITIAL_ESGS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [esgForm, setEsgForm] = useState({ 
    year: '', 
    title: '', 
    covers: [], 
    summary: [], 
    file: '', 
    fileName: '',
    publishDate: '',
    status: 'published'
  });
  const [summaryInput, setSummaryInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  
  // EditorLayout 状态管理
  const savedDataRef = useRef(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastPublishedTime, setLastPublishedTime] = useState(null);
  const [lastPublishedDate, setLastPublishedDate] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // 初始化保存的数据引用
  useEffect(() => {
    savedDataRef.current = JSON.stringify(esgs);
    const saved = localStorage.getItem('sus_esg_lastPublished');
    if (saved) {
      const parsed = JSON.parse(saved);
      setLastPublishedTime(parsed.time || '10:30');
      setLastPublishedDate(parsed.date || '2025-12-11 10:30');
    }
  }, []);

  // 检测未保存的更改
  useEffect(() => {
    const current = JSON.stringify(esgs);
    setHasUnsavedChanges(current !== savedDataRef.current);
  }, [esgs]);

  const updateData = (newEsgs) => {
    onChange && onChange({ esgs: newEsgs });
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    savedDataRef.current = JSON.stringify(esgs);
    setHasUnsavedChanges(false);
    setIsSaving(false);
    alert('配置已保存');
  };

  const handleSave = async () => {
    setIsPublishing(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    savedDataRef.current = JSON.stringify(esgs);
    setHasUnsavedChanges(false);
    const now = new Date();
    const time = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    const date = now.toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    setLastPublishedTime(time);
    setLastPublishedDate(date);
    localStorage.setItem('sus_esg_lastPublished', JSON.stringify({ time, date }));
    setIsPublishing(false);
    alert('配置已发布');
  };

  const generateHistory = () => {
    return [
      { id: 'v1', time: '2025-12-11 10:30', description: '更新了ESG报告配置', operator: 'admin', status: 'published' },
      { id: 'v2', time: '2025-12-10 14:25', description: '编辑了ESG报告', operator: 'admin', status: 'draft' },
      { id: 'v3', time: '2025-12-09 10:00', description: '首次创建ESG报告', operator: 'admin', status: 'published' },
    ];
  };

  const getDisplayStatus = () => {
    if (hasUnsavedChanges) return 'unsaved';
    if (lastPublishedTime) return 'pending';
    return 'published';
  };

  // ================== ESG报告管理 ==================
  const handleAddEsg = () => {
    setEditingIndex(null);
    setEsgForm({ year: '', title: '', covers: [], summary: [], file: '', fileName: '', publishDate: '', status: 'published' });
    setSummaryInput('');
    setIsModalOpen(true);
  };

  const handleEditEsg = (esg, index) => {
    setEditingIndex(index);
    setEsgForm({ ...esg, covers: esg.covers || [], summary: esg.summary || [] });
    setSummaryInput('');
    setIsModalOpen(true);
  };

  const handleSaveEsg = () => {
    if (!esgForm.year || !esgForm.title) return alert('请填写年份和标题');
    const newEsgs = editingIndex !== null
      ? esgs.map((e, i) => i === editingIndex ? { ...e, ...esgForm } : e)
      : [...esgs, { id: `esg_${Date.now()}`, ...esgForm }];
    setEsgs(newEsgs);
    updateData(newEsgs);
    setIsModalOpen(false);
  };

  const handleDeleteEsg = (index) => {
    if (confirm('确定删除？')) {
      const newEsgs = esgs.filter((_, i) => i !== index);
      setEsgs(newEsgs);
      updateData(newEsgs);
    }
  };

  // 摘要管理
  const addSummary = () => {
    if (!summaryInput.trim()) return;
    setEsgForm({ ...esgForm, summary: [...esgForm.summary, summaryInput.trim()] });
    setSummaryInput('');
  };

  const removeSummary = (idx) => {
    setEsgForm({ ...esgForm, summary: esgForm.summary.filter((_, i) => i !== idx) });
  };

  // 封面管理
  const addCover = (url) => {
    if (!url) return;
    setEsgForm({ ...esgForm, covers: [...esgForm.covers, url] });
  };

  const removeCover = (idx) => {
    setEsgForm({ ...esgForm, covers: esgForm.covers.filter((_, i) => i !== idx) });
  };

  // 文件上传处理
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // 模拟上传，实际项目中应调用上传API
      const fakeUrl = URL.createObjectURL(file);
      setEsgForm({ ...esgForm, file: fakeUrl, fileName: file.name });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && (file.type === 'application/pdf' || file.name.endsWith('.pdf'))) {
      const fakeUrl = URL.createObjectURL(file);
      setEsgForm({ ...esgForm, file: fakeUrl, fileName: file.name });
    } else {
      alert('请上传PDF格式文件');
    }
  };

  const removeFile = () => {
    setEsgForm({ ...esgForm, file: '', fileName: '' });
  };

  return (
    <>
      <EditorLayout
        title="ESG报告"
        description="管理企业ESG报告，支持上传PDF文件和设置报告封面。"
        pageKey="sus_esg"
        onSave={handleSave}
        onSaveDraft={handleSaveDraft}
        historyData={generateHistory()}
        hasUnsavedChanges={hasUnsavedChanges}
        saveText="发布更新"
        draftText="保存配置"
      >
        <div className="flex items-center justify-between mb-lg">
          <p className="text-caption text-gray-6">管理企业ESG报告列表。</p>
          <Button variant="add" onClick={handleAddEsg}>
            <Plus className="w-4 h-4" /> 新增ESG报告
          </Button>
        </div>
        
        <div>
          {esgs.length > 0 ? (
            <div className="space-y-lg">
              {esgs.map((esg, index) => (
                <div key={esg.id} className="bg-gray-2 rounded-lg p-lg group relative">
                  <div className="flex gap-lg">
                    {/* 封面图 */}
                    <div className="w-1/3 flex-shrink-0">
                      {esg.covers && esg.covers.length > 0 ? (
                        <div className="flex gap-sm overflow-x-auto">
                          {esg.covers.map((cover, i) => (
                            <div key={i} className="w-32 h-44 bg-gradient-to-br from-green-600 to-green-800 rounded-md flex-shrink-0 overflow-hidden relative">
                              <img src={cover} alt="" className="w-full h-full object-cover" />
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 text-white text-center">
                                <div className="text-lg font-bold">{esg.year}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="w-32 h-44 bg-gradient-to-br from-green-600 to-green-800 rounded-md flex items-center justify-center">
                          <FileText className="w-12 h-12 text-white/50" />
                        </div>
                      )}
                    </div>
                    {/* 信息 */}
                    <div className="flex-1">
                      <h4 className="text-section font-bold text-gray-8 mb-sm">{esg.title}</h4>
                      {esg.summary && esg.summary.length > 0 && (
                        <ul className="space-y-xs mb-md">
                          {esg.summary.map((item, i) => (
                            <li key={i} className="text-caption text-gray-6 flex items-start gap-xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-brand mt-1.5 flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}
                      <div className="flex gap-sm mb-md">
                        {esg.file && (
                          <>
                            <Button variant="secondary" onClick={() => window.open(esg.file)}>
                              <Download className="w-4 h-4" /> 下载 PDF
                            </Button>
                            <Button variant="secondary">
                              <Eye className="w-4 h-4" /> 在线阅读
                            </Button>
                          </>
                        )}
                      </div>
                      <div className="text-caption text-gray-6">
                        发布日期：{esg.publishDate || `${esg.year}年`}
                      </div>
                    </div>
                  </div>
                  {/* 操作按钮 */}
                  <div className="absolute top-2 right-2 flex gap-xxs opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEditEsg(esg, index)} className="px-sm py-xxs text-caption text-brand hover:bg-brand-light rounded">编辑</button>
                    <button onClick={() => handleDeleteEsg(index)} className="px-sm py-xxs text-caption text-error hover:bg-red-50 rounded">删除</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-xl text-gray-6">
              <FileText className="w-16 h-16 mx-auto mb-md text-gray-4" />
              <p className="text-body">暂无ESG报告</p>
              <p className="text-caption mb-md">点击上方按钮添加ESG报告</p>
              <Button variant="add" onClick={handleAddEsg}><Plus className="w-4 h-4" /> 添加报告</Button>
            </div>
          )}
        </div>
      </EditorLayout>

      {/* ESG报告编辑弹窗 */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingIndex !== null ? '编辑ESG报告' : '添加ESG报告'} size="lg"
        footer={<><Button variant="secondary" onClick={() => setIsModalOpen(false)}>取消</Button><Button onClick={handleSaveEsg}>确认</Button></>}>
        <div className="space-y-md max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-sm">
            <FormItem label="年份" required>
              <Input value={esgForm.year} onChange={e => setEsgForm({...esgForm, year: e.target.value})} placeholder="如：2024" />
            </FormItem>
            <FormItem label="发布日期">
              <Input value={esgForm.publishDate} onChange={e => setEsgForm({...esgForm, publishDate: e.target.value})} placeholder="如：2024年6月" />
            </FormItem>
          </div>
          <FormItem label="报告标题" required>
            <Input value={esgForm.title} onChange={e => setEsgForm({...esgForm, title: e.target.value})} placeholder="如：2024年度ESG报告" />
          </FormItem>

          {/* PDF文件上传区域 */}
          <FormItem label="报告文件（PDF）">
            {esgForm.file ? (
              <div className="flex items-center gap-md p-md bg-green-50 rounded-md border border-green-200">
                <FileText className="w-10 h-10 text-green-600" />
                <div className="flex-1">
                  <div className="text-body font-medium text-gray-8">{esgForm.fileName || 'ESG报告.pdf'}</div>
                  <div className="text-caption text-gray-6">PDF文件已上传</div>
                </div>
                <button onClick={removeFile} className="p-1 text-gray-6 hover:text-error">
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div
                className={`border-2 border-dashed rounded-lg p-lg text-center cursor-pointer transition-all ${
                  isDragging ? 'border-brand bg-brand-light' : 'border-gray-4 hover:border-brand'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className={`w-10 h-10 mx-auto mb-sm ${isDragging ? 'text-brand' : 'text-gray-5'}`} />
                <p className="text-body text-gray-7 mb-xs">
                  {isDragging ? '松开鼠标上传文件' : '拖拽文件到此处，或点击上传'}
                </p>
                <p className="text-caption text-gray-6">支持 PDF 格式</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            )}
          </FormItem>

          {/* 报告摘要 */}
          <FormItem label="报告摘要">
            <div className="space-y-sm">
              {esgForm.summary.map((item, i) => (
                <div key={i} className="flex items-center gap-sm bg-gray-2 p-sm rounded">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand flex-shrink-0" />
                  <span className="flex-1 text-caption">{item}</span>
                  <button onClick={() => removeSummary(i)} className="text-error"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
              <div className="flex gap-sm">
                <Input value={summaryInput} onChange={e => setSummaryInput(e.target.value)} placeholder="输入摘要要点" className="flex-1" />
                <Button variant="secondary" onClick={addSummary}>添加</Button>
              </div>
            </div>
          </FormItem>

          {/* 报告封面 */}
          <FormItem label="报告封面">
            <div className="flex gap-sm mb-sm flex-wrap">
              {esgForm.covers.map((cover, i) => (
                <div key={i} className="relative group">
                  <img src={cover} alt="" className="w-24 h-32 object-cover rounded" />
                  <button onClick={() => removeCover(i)} className="absolute top-1 right-1 p-1 bg-white rounded shadow text-error opacity-0 group-hover:opacity-100">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            <ImageSelector label="添加封面" value={null} onChange={img => img?.url && addCover(img.url)} library={imageLib} />
          </FormItem>
        </div>
      </Modal>
    </>
  );
};

export default SustainESGEditor;
