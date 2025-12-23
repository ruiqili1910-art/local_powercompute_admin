import { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, Clock, Building, Users, Target, Award, Phone } from 'lucide-react';
import { FormItem, Input, TextArea, Button, EditorLayout, PageBanner, FloatingActionBar, UnifiedHistoryModal, ImageSelector } from '../ui';
import { CertPicker } from '../common';

const PublicSubsidiaryEditor = ({ data, onChange, certLib = {}, imageLib = [] }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  
  // 追踪未保存的修改
  const savedDataRef = useRef(JSON.stringify(data));
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [hasPendingChanges, setHasPendingChanges] = useState(false);
  const [lastPublishedTime, setLastPublishedTime] = useState('10:30');
  const [lastPublishedDate, setLastPublishedDate] = useState('2025-12-11 10:30');
  
  // 初始化状态
  useEffect(() => {
    if (!savedDataRef.current) {
      savedDataRef.current = JSON.stringify(data);
    }
    const saved = localStorage.getItem('cms_editor_public_subsidiary_publishTime');
    if (saved) {
      const date = new Date(saved);
      setLastPublishedTime(date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }));
      setLastPublishedDate(date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-') 
        + ' ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }));
    }
    const pending = localStorage.getItem('cms_editor_public_subsidiary_pending');
    if (pending !== null) {
      setHasPendingChanges(pending === 'true');
    }
  }, []);
  
  // 监听数据变化
  useEffect(() => {
    setHasUnsavedChanges(JSON.stringify(data) !== savedDataRef.current);
  }, [data]);
  
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };
  
  // 更新嵌套字段
  const updateNestedField = (parentField, field, value) => {
    onChange({ ...data, [parentField]: { ...data[parentField], [field]: value } });
  };
  
  // 更新领导列表
  const updateLeader = (index, field, value) => {
    const leaders = [...(data.leaders || [])];
    leaders[index] = { ...leaders[index], [field]: value };
    handleChange('leaders', leaders);
  };
  
  // 添加领导
  const handleAddLeader = () => {
    const leaders = data.leaders || [];
    handleChange('leaders', [...leaders, { id: `leader_${Date.now()}`, name: '', position: '' }]);
  };
  
  // 删除领导
  const handleDeleteLeader = (index) => {
    if (confirm('确定删除该领导吗？')) {
      const leaders = data.leaders || [];
      handleChange('leaders', leaders.filter((_, i) => i !== index));
    }
  };
  
  // 更新资质列表
  const updateQualification = (index, value) => {
    const qualifications = [...(data.qualifications || [])];
    qualifications[index] = value;
    handleChange('qualifications', qualifications);
  };
  
  // 添加资质
  const handleAddQualification = () => {
    const qualifications = data.qualifications || [];
    handleChange('qualifications', [...qualifications, '']);
  };
  
  // 删除资质
  const handleDeleteQualification = (index) => {
    if (confirm('确定删除该资质吗？')) {
      const qualifications = data.qualifications || [];
      handleChange('qualifications', qualifications.filter((_, i) => i !== index));
    }
  };
  
  // 更新联系方式
  const updateContact = (index, field, value) => {
    const contacts = [...(data.contacts || [])];
    contacts[index] = { ...contacts[index], [field]: value };
    handleChange('contacts', contacts);
  };
  
  // 添加联系方式
  const handleAddContact = () => {
    const contacts = data.contacts || [];
    handleChange('contacts', [...contacts, { id: `contact_${Date.now()}`, department: '', phone: '' }]);
  };
  
  // 删除联系方式
  const handleDeleteContact = (index) => {
    if (confirm('确定删除该联系方式吗？')) {
      const contacts = data.contacts || [];
      handleChange('contacts', contacts.filter((_, i) => i !== index));
    }
  };
  
  const handleSaveDraft = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    savedDataRef.current = JSON.stringify(data);
    setHasUnsavedChanges(false);
    setHasPendingChanges(true);
    localStorage.setItem('cms_editor_public_subsidiary_pending', 'true');
    setIsSaving(false);
    console.log('子公司情况配置已保存');
  };
  
  const handleSave = async () => {
    setIsPublishing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    savedDataRef.current = JSON.stringify(data);
    setHasUnsavedChanges(false);
    setHasPendingChanges(false);
    
    const now = new Date();
    const timeStr = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-') 
      + ' ' + now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    
    setLastPublishedTime(timeStr);
    setLastPublishedDate(dateStr);
    
    localStorage.setItem('cms_editor_public_subsidiary_publishTime', now.toISOString());
    localStorage.setItem('cms_editor_public_subsidiary_pending', 'false');
    setIsPublishing(false);
    console.log('子公司情况配置已发布');
  };
  
  // 获取显示状态
  const getDisplayStatus = () => {
    if (isPublishing) return 'publishing';
    if (isSaving) return 'saving';
    if (hasUnsavedChanges) return 'unsaved';
    if (hasPendingChanges) return 'pending';
    return 'published';
  };
  
  // 生成历史记录数据（模拟）
  const generateHistoryData = () => {
    return [
      { id: '1', time: '2025-12-11 10:30', operator: 'admin', action: '发布', changes: '发布子公司情况配置' },
      { id: '2', time: '2025-12-10 15:20', operator: 'admin', action: '保存', changes: '保存子公司情况配置' },
      { id: '3', time: '2025-12-09 09:15', operator: 'editor', action: '编辑', changes: '修改子公司信息' },
    ];
  };
  
  const leaders = data.leaders || [];
  const qualifications = data.qualifications || [];
  const contacts = data.contacts || [];
  
  return (
    <>
      <EditorLayout
        title="子公司情况"
        description="管理子公司详细信息，包括公司介绍、领导、发展战略、工商注册、企业资质、人力资源等。"
        pageKey="public_subsidiary"
        onSave={handleSave}
        onSaveDraft={handleSaveDraft}
        hasUnsavedChanges={hasUnsavedChanges}
        historyData={generateHistoryData()}
      >
        <div className="px-xl py-lg border-t border-gray-4 space-y-xxl">
          {/* 公司名称 */}
          <div className="space-y-md">
            <div>
              <h3 className="text-section font-semibold text-gray-8 flex items-center gap-xs">
                <Building className="w-5 h-5 text-brand" />
                公司名称
              </h3>
              <p className="text-caption text-gray-6 mt-xxs">
                子公司的完整名称
              </p>
            </div>
            <FormItem label="公司名称">
              <Input
                value={data.companyName || ''}
                onChange={e => handleChange('companyName', e.target.value)}
                placeholder="请输入公司名称"
              />
            </FormItem>
          </div>
          
          {/* 公司介绍 */}
          <div className="space-y-md border-t border-gray-4 pt-lg">
            <div>
              <h3 className="text-section font-semibold text-gray-8 flex items-center gap-xs">
                <Building className="w-5 h-5 text-brand" />
                公司介绍
              </h3>
              <p className="text-caption text-gray-6 mt-xxs">
                详细介绍子公司的背景、业务范围、技术优势等
              </p>
            </div>
            <FormItem label="公司介绍">
              <TextArea
                value={data.introduction || ''}
                onChange={e => handleChange('introduction', e.target.value)}
                rows={8}
                placeholder="请输入公司介绍"
              />
            </FormItem>
            <FormItem label="公司图片（可选）">
              <ImageSelector
                value={data.companyImage}
                onChange={img => handleChange('companyImage', img)}
                library={imageLib}
              />
            </FormItem>
          </div>
          
          {/* 公司领导 */}
          <div className="space-y-md border-t border-gray-4 pt-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-section font-semibold text-gray-8 flex items-center gap-xs">
                  <Users className="w-5 h-5 text-brand" />
                  公司领导
                </h3>
                <p className="text-caption text-gray-6 mt-xxs">
                  管理公司领导信息
                </p>
              </div>
              <Button variant="add" onClick={handleAddLeader}>
                <Plus className="w-4 h-4" />
                添加领导
              </Button>
            </div>
            
            {leaders.length > 0 ? (
              <div className="space-y-md">
                {leaders.map((leader, index) => (
                  <div key={leader.id || index} className="bg-gray-2 rounded-md p-md border border-gray-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
                      <FormItem label="职位">
                        <Input
                          value={leader.position || ''}
                          onChange={e => updateLeader(index, 'position', e.target.value)}
                          placeholder="请输入职位，如：总经理/执行董事"
                        />
                      </FormItem>
                      <FormItem label="姓名">
                        <Input
                          value={leader.name || ''}
                          onChange={e => updateLeader(index, 'name', e.target.value)}
                          placeholder="请输入姓名"
                        />
                      </FormItem>
                      <div className="flex items-end">
                        <Button
                          variant="danger"
                          onClick={() => handleDeleteLeader(index)}
                          className="w-full"
                        >
                          <Trash2 className="w-4 h-4" />
                          删除
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-xl text-gray-6 bg-gray-2 rounded-md border border-gray-4">
                <Users className="w-12 h-12 mx-auto mb-md text-gray-4" />
                <p className="text-body">暂无领导信息</p>
                <p className="text-caption">点击"添加领导"开始创建</p>
              </div>
            )}
          </div>
          
          {/* 发展战略 */}
          <div className="space-y-md border-t border-gray-4 pt-lg">
            <div>
              <h3 className="text-section font-semibold text-gray-8 flex items-center gap-xs">
                <Target className="w-5 h-5 text-brand" />
                发展战略
              </h3>
              <p className="text-caption text-gray-6 mt-xxs">
                公司的发展战略和总体目标
              </p>
            </div>
            <FormItem>
              <TextArea
                value={data.strategy?.overallGoal || ''}
                onChange={e => updateNestedField('strategy', 'overallGoal', e.target.value)}
                rows={3}
                placeholder="请输入总体目标"
              />
            </FormItem>
          </div>
          
          {/* 工商注册 */}
          <div className="space-y-md border-t border-gray-4 pt-lg">
            <div>
              <h3 className="text-section font-semibold text-gray-8 flex items-center gap-xs">
                <Building className="w-5 h-5 text-brand" />
                工商注册
              </h3>
              <p className="text-caption text-gray-6 mt-xxs">
                数据来源：全局资源库-【公司档案信息】
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-md">
              <FormItem label="统一社会信用代码">
                <Input
                  value={data.registration?.unifiedSocialCreditCode || ''}
                  onChange={e => updateNestedField('registration', 'unifiedSocialCreditCode', e.target.value)}
                  placeholder="请输入统一社会信用代码"
                />
              </FormItem>
              <FormItem label="名称">
                <Input
                  value={data.registration?.name || ''}
                  onChange={e => updateNestedField('registration', 'name', e.target.value)}
                  placeholder="请输入公司名称"
                />
              </FormItem>
              <FormItem label="类型">
                <Input
                  value={data.registration?.type || ''}
                  onChange={e => updateNestedField('registration', 'type', e.target.value)}
                  placeholder="请输入注册类型"
                />
              </FormItem>
              <FormItem label="法定代表人">
                <Input
                  value={data.registration?.legalRepresentative || ''}
                  onChange={e => updateNestedField('registration', 'legalRepresentative', e.target.value)}
                  placeholder="请输入法定代表人"
                />
              </FormItem>
              <FormItem label="注册资本">
                <Input
                  value={data.registration?.registeredCapital || ''}
                  onChange={e => updateNestedField('registration', 'registeredCapital', e.target.value)}
                  placeholder="请输入注册资本"
                />
              </FormItem>
              <FormItem label="成立日期">
                <Input
                  type="date"
                  value={data.registration?.establishDate || ''}
                  onChange={e => updateNestedField('registration', 'establishDate', e.target.value)}
                />
              </FormItem>
            </div>
            <FormItem label="注册地址">
              <Input
                value={data.registration?.registrationAddress || data.registration?.address || ''}
                onChange={e => {
                  const registration = { ...data.registration };
                  registration.registrationAddress = e.target.value;
                  registration.address = e.target.value; // 兼容两种字段名
                  handleChange('registration', registration);
                }}
                placeholder="请输入注册地址"
              />
            </FormItem>
            <FormItem label="经营范围">
              <TextArea
                value={data.registration?.businessScope || ''}
                onChange={e => updateNestedField('registration', 'businessScope', e.target.value)}
                rows={4}
                placeholder="请输入经营范围"
              />
            </FormItem>
          </div>
          
          {/* 企业资质 */}
          <div className="space-y-md border-t border-gray-4 pt-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-section font-semibold text-gray-8 flex items-center gap-xs">
                  <Award className="w-5 h-5 text-brand" />
                  企业资质
                </h3>
                <p className="text-caption text-gray-6 mt-xxs">
                  管理企业资质列表
                </p>
              </div>
              <Button variant="add" onClick={handleAddQualification}>
                <Plus className="w-4 h-4" />
                添加资质
              </Button>
            </div>
            
            {qualifications.length > 0 ? (
              <div className="space-y-sm">
                {qualifications.map((qual, index) => (
                  <div key={index} className="flex items-center gap-md bg-gray-2 rounded-md p-md border border-gray-4">
                    <Input
                      value={qual}
                      onChange={e => updateQualification(index, e.target.value)}
                      placeholder="请输入资质名称"
                      className="flex-1"
                    />
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteQualification(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-xl text-gray-6 bg-gray-2 rounded-md border border-gray-4">
                <Award className="w-12 h-12 mx-auto mb-md text-gray-4" />
                <p className="text-body">暂无企业资质</p>
                <p className="text-caption">点击"添加资质"开始创建</p>
              </div>
            )}
          </div>
          
          {/* 人力资源 */}
          <div className="space-y-md border-t border-gray-4 pt-lg">
            <div>
              <h3 className="text-section font-semibold text-gray-8 flex items-center gap-xs">
                <Users className="w-5 h-5 text-brand" />
                人力资源
              </h3>
              <p className="text-caption text-gray-6 mt-xxs">
                公司的人才战略和员工情况
              </p>
            </div>
            <FormItem label="人才战略描述">
              <TextArea
                value={data.hr?.strategy || ''}
                onChange={e => updateNestedField('hr', 'strategy', e.target.value)}
                rows={6}
                placeholder="请输入人才战略描述"
              />
            </FormItem>
            <FormItem label="员工情况描述">
              <TextArea
                value={data.hr?.employeeInfo || ''}
                onChange={e => updateNestedField('hr', 'employeeInfo', e.target.value)}
                rows={4}
                placeholder="请输入员工情况描述（学历、职称、证书等）"
              />
            </FormItem>
          </div>
          
          {/* 联系方式 */}
          <div className="space-y-md border-t border-gray-4 pt-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-section font-semibold text-gray-8 flex items-center gap-xs">
                  <Phone className="w-5 h-5 text-brand" />
                  联系方式
                </h3>
                <p className="text-caption text-gray-6 mt-xxs">
                  管理各部门联系方式
                </p>
              </div>
              <Button variant="add" onClick={handleAddContact}>
                <Plus className="w-4 h-4" />
                添加联系方式
              </Button>
            </div>
            
            {contacts.length > 0 ? (
              <div className="space-y-md">
                {contacts.map((contact, index) => (
                  <div key={contact.id || index} className="bg-gray-2 rounded-md p-md border border-gray-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
                      <FormItem label="部门">
                        <Input
                          value={contact.department || ''}
                          onChange={e => updateContact(index, 'department', e.target.value)}
                          placeholder="请输入部门名称"
                        />
                      </FormItem>
                      <FormItem label="电话">
                        <Input
                          value={contact.phone || ''}
                          onChange={e => updateContact(index, 'phone', e.target.value)}
                          placeholder="请输入电话号码，如：028-68931232"
                        />
                      </FormItem>
                      <div className="flex items-end">
                        <Button
                          variant="danger"
                          onClick={() => handleDeleteContact(index)}
                          className="w-full"
                        >
                          <Trash2 className="w-4 h-4" />
                          删除
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-xl text-gray-6 bg-gray-2 rounded-md border border-gray-4">
                <Phone className="w-12 h-12 mx-auto mb-md text-gray-4" />
                <p className="text-body">暂无联系方式</p>
                <p className="text-caption">点击"添加联系方式"开始创建</p>
              </div>
            )}
          </div>
        </div>
      </EditorLayout>
      
      {/* 底部占位块 */}
      <div className="h-20" aria-hidden="true" />
      
      {/* 底部悬浮操作栏 */}
      <FloatingActionBar
        status={getDisplayStatus()}
        scene="config"
        lastPublishedTime={lastPublishedTime}
        lastPublishedDate={lastPublishedDate}
        onSave={handleSave}
        onSaveDraft={handleSaveDraft}
        saveText="发布更新"
        saveDraftText="保存配置"
        showDraftButton={true}
      />
      
      {/* 历史记录弹窗 */}
      <UnifiedHistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        title="子公司情况 - 历史记录"
        mode="editor"
        records={generateHistoryData()}
        onRestore={(record) => {
          console.log('恢复版本:', record);
          setShowHistoryModal(false);
        }}
      />
    </>
  );
};

export default PublicSubsidiaryEditor;
