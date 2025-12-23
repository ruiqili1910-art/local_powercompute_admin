import { useState, useRef, useEffect } from 'react';
import { CheckSquare } from 'lucide-react';
import { Input, EditorLayout } from '../ui';
import { CertPicker } from '../common';
import { COMPANY_FIELD_LABELS } from '../../constants/initialData';

const HonorsEditor = ({ data, onChange, certLib, companyInfo }) => {
  // 追踪未保存的修改
  const savedDataRef = useRef(JSON.stringify(data));
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    setHasUnsavedChanges(JSON.stringify(data) !== savedDataRef.current);
  }, [data]);

  const toggleGlobalKey = (key) => {
    const currentKeys = data.statsConfig.selectedGlobalKeys || [];
    if (currentKeys.includes(key)) {
      onChange({...data, statsConfig: {...data.statsConfig, selectedGlobalKeys: currentKeys.filter(k => k !== key)}});
    } else {
      if (currentKeys.length >= 5) {
        alert("只能选择 5 项数据");
        return;
      }
      onChange({...data, statsConfig: {...data.statsConfig, selectedGlobalKeys: [...currentKeys, key]}});
    }
  };

  const handleSaveDraft = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('资质荣誉配置已保存:', data);
    savedDataRef.current = JSON.stringify(data);
    setHasUnsavedChanges(false);
  };

  const handleSave = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('资质荣誉配置已发布:', data);
    savedDataRef.current = JSON.stringify(data);
    setHasUnsavedChanges(false);
  };

  return (
    <EditorLayout
      title="资质荣誉"
      description="配置公司资质荣誉展示，包括统计数据和证书列表。"
      pageKey="honors"
      onSave={handleSave}
      onSaveDraft={handleSaveDraft}
      hasUnsavedChanges={hasUnsavedChanges}
    >
      <div className="space-y-lg">
          {/* 荣誉统计展示 */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-semibold text-[#1C1F23]">荣誉统计展示</h3>
              <div className="flex bg-[#F5F7FA] p-1 rounded-lg">
                <button onClick={()=>onChange({...data, statsConfig:{...data.statsConfig, mode:'global'}})} className={`px-4 py-1.5 rounded-md text-sm transition-all ${data.statsConfig.mode==='global'?'bg-white shadow-sm text-[#1C1F23] font-medium':'text-[#8A9099]'}`}>引用全局资质荣誉</button>
                <button onClick={()=>onChange({...data, statsConfig:{...data.statsConfig, mode:'custom'}})} className={`px-4 py-1.5 rounded-md text-sm transition-all ${data.statsConfig.mode==='custom'?'bg-white shadow-sm text-[#1C1F23] font-medium':'text-[#8A9099]'}`}>自定义输入</button>
              </div>
            </div>
            
            {data.statsConfig.mode === 'global' ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.keys(companyInfo).map(key => {
                   const isSelected = (data.statsConfig.selectedGlobalKeys || []).includes(key);
                   return (
                      <div key={key} onClick={() => toggleGlobalKey(key)} className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer border transition-all ${isSelected ? 'bg-[#F0F5FF] border-[#2B7FFF]' : 'bg-[#FAFAFA] border-[#F0F0F0] hover:border-[#2B7FFF]/50'}`}>
                         <div className={`w-5 h-5 rounded flex items-center justify-center border ${isSelected ? 'bg-[#2B7FFF] border-[#2B7FFF]' : 'border-[#E6E8EB]'}`}>
                            {isSelected && <CheckSquare className="w-3.5 h-3.5 text-white"/>}
                         </div>
                         <div className="flex-1">
                            <div className="text-xs text-[#8A9099] mb-0.5">{COMPANY_FIELD_LABELS[key]}</div>
                            <div className="text-sm font-bold text-[#1C1F23]">{companyInfo[key]}</div>
                         </div>
                      </div>
                   )
                })}
              </div>
            ) : (
              <div className="space-y-4 bg-[#FAFAFA] p-6 rounded-xl border border-[#F0F0F0]">
                {data.statsConfig.customItems.map((item, idx) => (
                   <div key={idx} className="flex gap-4 items-center">
                      <div className="w-8 h-8 rounded-full bg-white border border-[#E6E8EB] flex items-center justify-center text-xs font-bold text-[#8A9099] shadow-sm">{idx+1}</div>
                      <div className="w-32">
                        <Input 
                          value={item.value} 
                          onChange={e=>{const n=[...data.statsConfig.customItems];n[idx].value=e.target.value;onChange({...data, statsConfig:{...data.statsConfig, customItems:n}})}} 
                          className="font-bold text-[#2B7FFF] text-center" 
                          placeholder="数字 (例: 46项)"
                        />
                      </div>
                      <div className="flex-1">
                        <Input 
                          value={item.label} 
                          onChange={e=>{const n=[...data.statsConfig.customItems];n[idx].label=e.target.value;onChange({...data, statsConfig:{...data.statsConfig, customItems:n}})}} 
                          placeholder="标题 (例: 鲁班奖)"
                        />
                      </div>
                   </div>
                ))}
              </div>
            )}
          </div>

          <CertPicker 
            title="公司资质" 
            category="qualification" 
            selected={data.qualifications.certIds || []} 
            onSelect={ids=>onChange({...data, qualifications:{...data.qualifications, certIds:ids}})} 
            certLib={certLib} 
            showAsCards={true}
          />
          <CertPicker 
            title="企业荣誉" 
            category="honor" 
            selected={data.honors.certIds || []} 
            onSelect={ids=>onChange({...data, honors:{...data.honors, certIds:ids}})} 
            certLib={certLib} 
            showAsCards={true}
          />
        </div>
    </EditorLayout>
  );
};

export default HonorsEditor;
