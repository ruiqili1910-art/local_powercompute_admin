import { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, Edit, Globe } from 'lucide-react';
import { Button, Input, FormItem, TextArea, ImageSelector, Modal, PageBanner, EditorLayout, EditorStatusBar, UnifiedHistoryModal } from '../ui';

// 初始数据
const INITIAL_INTRO = {
  title: '围绕发展目标推进转型',
  content: '立足全球化布局与专业化发展战略，我们致力于构建国际化发展新格局。通过整合全球资源，优化业务结构，形成具有国际竞争力的发展梯队。',
  subContent: '我们的目标是塑造欧洲公司、GES等区域窗口，培育具有国际竞争力的工程公司，打造能够独立承担大型项目的施工总承包商，全面提升全球业务承接能力。',
  image: '',
};

const INITIAL_STRATEGIES = [
  '构建"2个窗口、4家国际工程公司、5+1家施工总承包商"的发展梯队',
  '实现全球化资源配置与本地化服务能力的有机结合',
  '提升在重点区域市场的品牌影响力和市场份额',
];

const INITIAL_TEAMS = [
  { id: 't1', number: '01', title: '区域窗口', image: '' },
  { id: 't2', title: '国际工程公司', subtitle: '具备国际化运营能力和专业技术优势，承担复杂工程项目的设计与管理。', items: ['欧洲公司', 'GES', '北海分公司', '赢海复兴'], image: '' },
  { id: 't3', number: '03', title: '施工总承包商', image: '' },
];

const SustainGlobalEditor = ({ data = {}, onChange, imageLib = [] }) => {
  const [intro, setIntro] = useState(data.intro || INITIAL_INTRO);
  const [strategies, setStrategies] = useState(data.strategies || INITIAL_STRATEGIES);
  const [teams, setTeams] = useState(data.teams || INITIAL_TEAMS);
  
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [teamForm, setTeamForm] = useState({ title: '', subtitle: '', items: [], image: '' });
  const [itemInput, setItemInput] = useState('');
  const [strategyInput, setStrategyInput] = useState('');

  // EditorLayout 状态管理
  const savedDataRef = useRef(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastPublishedTime, setLastPublishedTime] = useState(null);
  const [lastPublishedDate, setLastPublishedDate] = useState(null);

  // 梯队编辑弹窗状态监测
  const [teamFormInitial, setTeamFormInitial] = useState(null);
  const [hasTeamFormChanges, setHasTeamFormChanges] = useState(false);
  const [isSavingTeam, setIsSavingTeam] = useState(false);
  const [teamLastSavedTime, setTeamLastSavedTime] = useState(null);
  const [showTeamHistoryModal, setShowTeamHistoryModal] = useState(false);

  // 初始化保存的数据引用
  useEffect(() => {
    savedDataRef.current = JSON.stringify({ intro, strategies, teams });
    const saved = localStorage.getItem('sus_global_lastPublished');
    if (saved) {
      const parsed = JSON.parse(saved);
      setLastPublishedTime(parsed.time || '10:30');
      setLastPublishedDate(parsed.date || '2025-12-11 10:30');
    }
  }, []);

  // 检测未保存的更改
  useEffect(() => {
    const current = JSON.stringify({ intro, strategies, teams });
    setHasUnsavedChanges(current !== savedDataRef.current);
  }, [intro, strategies, teams]);

  // 检测梯队表单更改
  useEffect(() => {
    if (teamFormInitial) {
      const hasChanges = JSON.stringify(teamForm) !== JSON.stringify(teamFormInitial);
      setHasTeamFormChanges(hasChanges);
    }
  }, [teamForm, teamFormInitial]);

  const updateData = (newIntro, newStrategies, newTeams) => {
    onChange && onChange({ intro: newIntro, strategies: newStrategies, teams: newTeams });
  };

  const handleSaveDraft = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    savedDataRef.current = JSON.stringify({ intro, strategies, teams });
    setHasUnsavedChanges(false);
    alert('配置已保存');
  };

  const handleSave = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    savedDataRef.current = JSON.stringify({ intro, strategies, teams });
    setHasUnsavedChanges(false);
    const now = new Date();
    const time = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    const date = now.toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    setLastPublishedTime(time);
    setLastPublishedDate(date);
    localStorage.setItem('sus_global_lastPublished', JSON.stringify({ time, date }));
    alert('配置已发布');
  };

  const generateHistory = () => {
    return [
      { id: 'v1', time: '2025-12-11 10:30', description: '更新了全球发展配置', operator: 'admin', status: 'published' },
      { id: 'v2', time: '2025-12-10 14:25', description: '编辑了全球发展', operator: 'admin', status: 'draft' },
      { id: 'v3', time: '2025-12-09 10:00', description: '首次创建全球发展', operator: 'admin', status: 'published' },
    ];
  };

  const generateTeamHistory = (teamTitle) => {
    return [
      { id: 'v1', time: '2025-12-11 10:30', description: `更新了《${teamTitle}》的内容`, operator: 'admin', status: 'published' },
      { id: 'v2', time: '2025-12-10 14:25', description: `编辑了《${teamTitle}》`, operator: 'admin', status: 'draft' },
      { id: 'v3', time: '2025-12-09 10:00', description: `首次创建《${teamTitle}》`, operator: 'admin', status: 'published' },
    ];
  };

  // ================== 策略管理 ==================
  const addStrategy = () => {
    if (!strategyInput.trim()) return;
    const newStrategies = [...strategies, strategyInput.trim()];
    setStrategies(newStrategies);
    setStrategyInput('');
    updateData(intro, newStrategies, teams);
  };

  const removeStrategy = (index) => {
    const newStrategies = strategies.filter((_, i) => i !== index);
    setStrategies(newStrategies);
    updateData(intro, newStrategies, teams);
  };

  // ================== 梯队管理 ==================
  const handleAddTeam = () => {
    setEditingIndex(null);
    const newForm = { title: '', subtitle: '', items: [], image: '' };
    setTeamForm(newForm);
    setTeamFormInitial(newForm);
    setHasTeamFormChanges(true);
    setTeamLastSavedTime(null);
    setItemInput('');
    setIsTeamModalOpen(true);
  };

  const handleEditTeam = (team, index) => {
    setEditingIndex(index);
    const teamData = { ...team, items: team.items || [] };
    delete teamData.number; // 删除序号字段
    setTeamForm(teamData);
    setTeamFormInitial(teamData);
    setHasTeamFormChanges(false);
    setTeamLastSavedTime(new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }));
    setItemInput('');
    setIsTeamModalOpen(true);
  };

  const handleSaveTeam = async () => {
    if (!teamForm.title) return alert('请填写标题');
    setIsSavingTeam(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    const newTeams = editingIndex !== null
      ? teams.map((t, i) => i === editingIndex ? { ...t, ...teamForm } : t)
      : [...teams, { id: `t${Date.now()}`, ...teamForm }];
    setTeams(newTeams);
    updateData(intro, strategies, newTeams);
    setTeamFormInitial(teamForm);
    setHasTeamFormChanges(false);
    setTeamLastSavedTime(new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }));
    setIsSavingTeam(false);
    setIsTeamModalOpen(false);
  };

  const handleDeleteTeam = (index) => {
    if (confirm('确定删除？')) {
      const newTeams = teams.filter((_, i) => i !== index);
      setTeams(newTeams);
      updateData(intro, strategies, newTeams);
    }
  };

  const addItem = () => {
    if (!itemInput.trim()) return;
    setTeamForm({ ...teamForm, items: [...teamForm.items, itemInput.trim()] });
    setItemInput('');
  };

  const removeItem = (idx) => {
    setTeamForm({ ...teamForm, items: teamForm.items.filter((_, i) => i !== idx) });
  };

  return (
    <>
      <EditorLayout
        title="全球发展"
        description="管理全球发展页面内容，包括发展目标、核心策略和发展梯队。"
        pageKey="sus_global"
        onSave={handleSave}
        onSaveDraft={handleSaveDraft}
        historyData={generateHistory()}
        hasUnsavedChanges={hasUnsavedChanges}
        saveText="发布更新"
        draftText="保存配置"
      >
        <div className="space-y-xl">
          {/* ================== 围绕发展目标推进转型 ================== */}
          <div className="space-y-md">
            <h3 className="text-body font-semibold text-gray-8">围绕发展目标推进转型</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
              <div className="space-y-md">
                <FormItem label="主标题">
                  <Input value={intro.title} onChange={e => { const n = {...intro, title: e.target.value}; setIntro(n); }} />
                </FormItem>
                <FormItem label="内容">
                  <TextArea value={intro.content} onChange={e => { const n = {...intro, content: e.target.value}; setIntro(n); }} rows={4} />
                </FormItem>
              </div>
              <div>
                <ImageSelector 
                  label="配图（右侧装饰图）"
                  value={intro.image ? {url: intro.image} : null}
                  onChange={img => { const n = {...intro, image: img?.url || ''}; setIntro(n); }}
                  library={imageLib}
                />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-4" />

          {/* ================== 核心发展策略 ================== */}
          <div className="space-y-md">
            <h3 className="text-body font-semibold text-gray-8">核心发展策略</h3>
            <div className="space-y-sm">
              {strategies.map((item, index) => (
                <div key={index} className="flex items-center gap-sm bg-gray-2 p-sm rounded-md group">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand flex-shrink-0" />
                  <span className="flex-1 text-body text-gray-7">{item}</span>
                  <button onClick={() => removeStrategy(index)} className="text-error opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <div className="flex gap-sm">
                <Input value={strategyInput} onChange={e => setStrategyInput(e.target.value)} placeholder="输入策略要点" className="flex-1" />
                <Button variant="secondary" onClick={addStrategy}>添加</Button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-4" />

          {/* ================== 发展梯队架构 ================== */}
          <div className="space-y-md">
            <div className="flex items-center justify-between">
              <h3 className="text-body font-semibold text-gray-8">发展梯队架构</h3>
              <Button variant="add" onClick={handleAddTeam}>
                <Plus className="w-4 h-4" /> 添加梯队
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
              {teams.map((team, index) => (
                <div key={team.id} className="rounded-lg overflow-hidden group relative">
                  <div className="aspect-[4/3] bg-gray-3 relative">
                    {team.image ? (
                      <img src={team.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                        <Globe className="w-12 h-12 text-white/50" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-md text-white">
                      {team.number && <div className="text-3xl font-bold opacity-60 mb-xs">{team.number}</div>}
                      <div className="text-body font-semibold">{team.title}</div>
                    </div>
                    {/* 中间卡片特殊样式 */}
                    {team.subtitle && (
                      <div className="absolute inset-0 bg-white/95 p-md flex flex-col">
                        <div className="flex items-center gap-sm mb-sm">
                          <Globe className="w-5 h-5 text-brand" />
                          <span className="text-body font-bold text-gray-8">{team.title}</span>
                        </div>
                        <p className="text-caption text-gray-6 mb-sm">{team.subtitle}</p>
                        {team.items && team.items.length > 0 && (
                          <ul className="space-y-xs">
                            {team.items.map((item, i) => (
                              <li key={i} className="text-caption text-gray-7 flex items-center gap-xs">
                                <span className="w-1.5 h-1.5 rounded-full bg-brand" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="absolute top-2 right-2 flex gap-xxs opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button onClick={() => handleEditTeam(team, index)} className="p-1.5 bg-white rounded shadow text-gray-6 hover:text-brand"><Edit className="w-3 h-3" /></button>
                    <button onClick={() => handleDeleteTeam(index)} className="p-1.5 bg-white rounded shadow text-gray-6 hover:text-error"><Trash2 className="w-3 h-3" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </EditorLayout>

      {/* 梯队弹窗 */}
      <Modal isOpen={isTeamModalOpen} onClose={() => setIsTeamModalOpen(false)} title={editingIndex !== null ? '编辑梯队' : '添加梯队'} size="lg"
        footer={null}>
        <div className="flex flex-col h-[75vh]">
          <div className="flex-1 overflow-y-auto pr-2">
            <div className="space-y-md">
              <FormItem label="标题" required><Input value={teamForm.title} onChange={e => setTeamForm({...teamForm, title: e.target.value})} placeholder="如：区域窗口" /></FormItem>
              <FormItem label="副标题/描述"><TextArea value={teamForm.subtitle} onChange={e => setTeamForm({...teamForm, subtitle: e.target.value})} rows={2} placeholder="填写后将显示为卡片样式" /></FormItem>
              <FormItem label="子项列表">
                <div className="space-y-sm">
                  {teamForm.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-sm bg-gray-2 p-sm rounded">
                      <span className="flex-1 text-caption">{item}</span>
                      <button onClick={() => removeItem(i)} className="text-error"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                  <div className="flex gap-sm">
                    <Input value={itemInput} onChange={e => setItemInput(e.target.value)} placeholder="如：欧洲公司" className="flex-1" />
                    <Button variant="secondary" onClick={addItem}>添加</Button>
                  </div>
                </div>
              </FormItem>
              <ImageSelector label="背景图片" value={teamForm.image ? {url: teamForm.image} : null} onChange={img => setTeamForm({...teamForm, image: img?.url || ''})} library={imageLib} />
            </div>
          </div>
          
          {/* 底部状态栏 */}
          <EditorStatusBar
            isSaving={isSavingTeam}
            hasLocalChanges={hasTeamFormChanges}
            lastSavedTime={teamLastSavedTime}
            onSave={handleSaveTeam}
            onHistoryClick={() => setShowTeamHistoryModal(true)}
            showHistory={editingIndex !== null && teams[editingIndex] ? true : false}
            saveButtonText="保存梯队"
          />
        </div>
      </Modal>
      
      {/* 梯队历史记录弹窗 */}
      <UnifiedHistoryModal
        isOpen={showTeamHistoryModal}
        onClose={() => setShowTeamHistoryModal(false)}
        title={teamForm.title ? `《${teamForm.title}》 - 版本历史` : '版本历史'}
        mode="editor"
        records={teamForm.title ? generateTeamHistory(teamForm.title) : []}
        onRestore={(record) => {
          console.log('恢复版本:', record);
          setShowTeamHistoryModal(false);
        }}
      />
    </>
  );
};

export default SustainGlobalEditor;
