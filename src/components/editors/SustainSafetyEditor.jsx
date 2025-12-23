import { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, Edit, Shield, Heart, Leaf, Target } from 'lucide-react';
import { Button, Input, FormItem, TextArea, ImageSelector, Modal, PageBanner, EditorLayout } from '../ui';

// 初始数据
const INITIAL_GOALS = [
  { id: 'g1', icon: 'shield', title: '零事故', content: '建立完善的安全管理体系，消除一切安全隐患，确保生产运营全过程安全可控。' },
  { id: 'g2', icon: 'heart', title: '零伤害', content: '关注员工职业健康，提供全方位防护措施，保障每一位员工的生命安全与身体健康。' },
  { id: 'g3', icon: 'leaf', title: '零污染', content: '推行清洁生产工艺，实现污染物达标排放，建设环境友好型企业。' },
];

const INITIAL_POLICIES = [
  { id: 'p1', title: '职业健康方针', subtitle: '预防为主，防治结合', image: '' },
  { id: 'p2', title: '安全方针', subtitle: '', image: '' },
  { id: 'p3', title: '环境保护方针', subtitle: '', image: '' },
];

const iconMap = {
  shield: Shield,
  heart: Heart,
  leaf: Leaf,
  target: Target,
};

const SustainSafetyEditor = ({ data = {}, onChange, imageLib = [] }) => {
  const [goals, setGoals] = useState(data.goals || INITIAL_GOALS);
  const [policies, setPolicies] = useState(data.policies || INITIAL_POLICIES);
  
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [goalForm, setGoalForm] = useState({ icon: 'shield', title: '', content: '' });
  const [policyForm, setPolicyForm] = useState({ title: '', subtitle: '', image: '' });

  // EditorLayout 状态管理
  const savedDataRef = useRef(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastPublishedTime, setLastPublishedTime] = useState(null);
  const [lastPublishedDate, setLastPublishedDate] = useState(null);

  // 初始化保存的数据引用
  useEffect(() => {
    savedDataRef.current = JSON.stringify({ goals, policies });
    const saved = localStorage.getItem('sus_safety_lastPublished');
    if (saved) {
      const parsed = JSON.parse(saved);
      setLastPublishedTime(parsed.time || '10:30');
      setLastPublishedDate(parsed.date || '2025-12-11 10:30');
    }
  }, []);

  // 检测未保存的更改
  useEffect(() => {
    const current = JSON.stringify({ goals, policies });
    setHasUnsavedChanges(current !== savedDataRef.current);
  }, [goals, policies]);

  const updateData = (newGoals, newPolicies) => {
    onChange && onChange({ goals: newGoals, policies: newPolicies });
  };

  const handleSaveDraft = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    savedDataRef.current = JSON.stringify({ goals, policies });
    setHasUnsavedChanges(false);
    alert('配置已保存');
  };

  const handleSave = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    savedDataRef.current = JSON.stringify({ goals, policies });
    setHasUnsavedChanges(false);
    const now = new Date();
    const time = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    const date = now.toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    setLastPublishedTime(time);
    setLastPublishedDate(date);
    localStorage.setItem('sus_safety_lastPublished', JSON.stringify({ time, date }));
    alert('配置已发布');
  };

  const generateHistory = () => {
    return [
      { id: 'v1', time: '2025-12-11 10:30', description: '更新了安环行动配置', operator: 'admin', status: 'published' },
      { id: 'v2', time: '2025-12-10 14:25', description: '编辑了安环行动', operator: 'admin', status: 'draft' },
      { id: 'v3', time: '2025-12-09 10:00', description: '首次创建安环行动', operator: 'admin', status: 'published' },
    ];
  };

  // ================== 目标管理 ==================
  const handleAddGoal = () => {
    setEditingIndex(null);
    setGoalForm({ icon: 'shield', title: '', content: '' });
    setIsGoalModalOpen(true);
  };

  const handleEditGoal = (goal, index) => {
    setEditingIndex(index);
    setGoalForm({ icon: goal.icon || 'shield', title: goal.title, content: goal.content });
    setIsGoalModalOpen(true);
  };

  const handleSaveGoal = () => {
    if (!goalForm.title) return alert('请填写标题');
    const newGoals = editingIndex !== null
      ? goals.map((g, i) => i === editingIndex ? { ...g, ...goalForm } : g)
      : [...goals, { id: `g${Date.now()}`, ...goalForm }];
    setGoals(newGoals);
    updateData(newGoals, policies);
    setIsGoalModalOpen(false);
  };

  const handleDeleteGoal = (index) => {
    if (confirm('确定删除？')) {
      const newGoals = goals.filter((_, i) => i !== index);
      setGoals(newGoals);
      updateData(newGoals, policies);
    }
  };

  // ================== 方针管理 ==================
  const handleAddPolicy = () => {
    setEditingIndex(null);
    setPolicyForm({ title: '', subtitle: '', image: '' });
    setIsPolicyModalOpen(true);
  };

  const handleEditPolicy = (policy, index) => {
    setEditingIndex(index);
    setPolicyForm({ title: policy.title, subtitle: policy.subtitle || '', image: policy.image || '' });
    setIsPolicyModalOpen(true);
  };

  const handleSavePolicy = () => {
    if (!policyForm.title) return alert('请填写标题');
    const newPolicies = editingIndex !== null
      ? policies.map((p, i) => i === editingIndex ? { ...p, ...policyForm } : p)
      : [...policies, { id: `p${Date.now()}`, ...policyForm }];
    setPolicies(newPolicies);
    updateData(goals, newPolicies);
    setIsPolicyModalOpen(false);
  };

  const handleDeletePolicy = (index) => {
    if (confirm('确定删除？')) {
      const newPolicies = policies.filter((_, i) => i !== index);
      setPolicies(newPolicies);
      updateData(goals, newPolicies);
    }
  };

  return (
    <>
      <EditorLayout
        title="安环行动"
        description="管理安环行动页面内容，包括目标展示和管理方针。"
        pageKey="sus_safety"
        onSave={handleSave}
        onSaveDraft={handleSaveDraft}
        historyData={generateHistory()}
        hasUnsavedChanges={hasUnsavedChanges}
        saveText="发布更新"
        draftText="保存配置"
      >
        <div className="space-y-xl">
          {/* ================== 我们的目标 ================== */}
          <div className="space-y-md">
            <div className="flex items-center justify-between">
              <h3 className="text-body font-semibold text-gray-8">我们的目标</h3>
              <Button variant="add" onClick={handleAddGoal}>
                <Plus className="w-4 h-4" /> 添加目标
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
              {goals.map((goal, index) => {
                const IconComp = iconMap[goal.icon] || Shield;
                return (
                  <div key={goal.id} className="bg-gray-2 rounded-lg p-lg group relative">
                    <div className="w-12 h-12 rounded-full bg-brand-light flex items-center justify-center mb-md">
                      <IconComp className="w-6 h-6 text-brand" />
                    </div>
                    <h4 className="text-section font-bold text-gray-8 mb-xs">{goal.title}</h4>
                    <p className="text-caption text-gray-6">{goal.content}</p>
                    <div className="absolute top-2 right-2 flex gap-xxs opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEditGoal(goal, index)} className="p-1.5 bg-white rounded shadow text-gray-6 hover:text-brand"><Edit className="w-3 h-3" /></button>
                      <button onClick={() => handleDeleteGoal(index)} className="p-1.5 bg-white rounded shadow text-gray-6 hover:text-error"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t border-gray-4" />

          {/* ================== 管理方针 ================== */}
          <div className="space-y-md">
            <div className="flex items-center justify-between">
              <h3 className="text-body font-semibold text-gray-8">管理方针</h3>
              <Button variant="add" onClick={handleAddPolicy}>
                <Plus className="w-4 h-4" /> 添加方针
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
              {policies.map((policy, index) => (
                <div key={policy.id} className="rounded-lg overflow-hidden group relative">
                  <div className="aspect-[4/3] bg-gray-3 relative">
                    {policy.image ? (
                      <img src={policy.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                        <Shield className="w-12 h-12 text-white/50" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-sm text-white">
                      <div className="text-body font-semibold">{policy.title}</div>
                      {policy.subtitle && <div className="text-caption opacity-80">{policy.subtitle}</div>}
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 flex gap-xxs opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEditPolicy(policy, index)} className="p-1.5 bg-white rounded shadow text-gray-6 hover:text-brand"><Edit className="w-3 h-3" /></button>
                    <button onClick={() => handleDeletePolicy(index)} className="p-1.5 bg-white rounded shadow text-gray-6 hover:text-error"><Trash2 className="w-3 h-3" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </EditorLayout>

      {/* 目标弹窗 */}
      <Modal isOpen={isGoalModalOpen} onClose={() => setIsGoalModalOpen(false)} title={editingIndex !== null ? '编辑目标' : '添加目标'}
        footer={<><Button variant="secondary" onClick={() => setIsGoalModalOpen(false)}>取消</Button><Button onClick={handleSaveGoal}>确认</Button></>}>
        <div className="space-y-md">
          <FormItem label="图标">
            <div className="flex gap-sm">
              {Object.entries(iconMap).map(([key, Icon]) => (
                <button key={key} onClick={() => setGoalForm({...goalForm, icon: key})}
                  className={`p-md rounded-md border ${goalForm.icon === key ? 'bg-brand-light border-brand' : 'border-gray-4'}`}>
                  <Icon className={`w-6 h-6 ${goalForm.icon === key ? 'text-brand' : 'text-gray-6'}`} />
                </button>
              ))}
            </div>
          </FormItem>
          <FormItem label="标题" required><Input value={goalForm.title} onChange={e => setGoalForm({...goalForm, title: e.target.value})} placeholder="如：零事故" /></FormItem>
          <FormItem label="描述"><TextArea value={goalForm.content} onChange={e => setGoalForm({...goalForm, content: e.target.value})} rows={3} /></FormItem>
        </div>
      </Modal>

      {/* 方针弹窗 */}
      <Modal isOpen={isPolicyModalOpen} onClose={() => setIsPolicyModalOpen(false)} title={editingIndex !== null ? '编辑方针' : '添加方针'}
        footer={<><Button variant="secondary" onClick={() => setIsPolicyModalOpen(false)}>取消</Button><Button onClick={handleSavePolicy}>确认</Button></>}>
        <div className="space-y-md">
          <FormItem label="方针名称" required><Input value={policyForm.title} onChange={e => setPolicyForm({...policyForm, title: e.target.value})} placeholder="如：职业健康方针" /></FormItem>
          <FormItem label="副标题"><Input value={policyForm.subtitle} onChange={e => setPolicyForm({...policyForm, subtitle: e.target.value})} placeholder="如：预防为主，防治结合" /></FormItem>
          <ImageSelector label="背景图片" value={policyForm.image ? {url: policyForm.image} : null} onChange={img => setPolicyForm({...policyForm, image: img?.url || ''})} library={imageLib} />
        </div>
      </Modal>
    </>
  );
};

export default SustainSafetyEditor;
