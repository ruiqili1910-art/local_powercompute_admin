import { COMPANY_FIELD_LABELS } from '../../constants/initialData';

const CertSection = ({ title, ids, certLib }) => (
  <div className="mb-12">
     <h4 className="font-bold text-xl mb-6 text-slate-800">{title}</h4>
     <div className="flex gap-6 overflow-x-auto pb-4 px-2">
        {ids.map(id => {
           const c = certLib.find(x => x.id === id);
           if(!c) return null;
           return (
              <div key={id} className={`flex-shrink-0 w-48 h-64 ${c.img} bg-cover p-3 shadow-md bg-white relative rounded-sm hover:scale-105 transition-transform duration-300`}>
                 <div className="w-full h-full border border-dashed border-black/10 flex items-center justify-center text-center">
                    <span className="text-xs font-bold text-slate-700 bg-white/90 px-2 py-1 rounded shadow-sm backdrop-blur-sm">{c.title}</span>
                 </div>
              </div>
           )
        })}
     </div>
  </div>
);

const HonorsPreview = ({ data, certLib, companyInfo }) => {
   const stats = data.statsConfig.mode === 'global' 
     ? (data.statsConfig.selectedGlobalKeys || []).map(key => ({
         label: COMPANY_FIELD_LABELS[key],
         value: companyInfo[key]
       }))
     : data.statsConfig.customItems;

   return (
     <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex gap-16 mb-16 justify-center border-b border-slate-100 pb-12">
             {stats.slice(0, 5).map((s, i) => (
                <div key={i} className="text-center">
                   <div className="text-4xl font-bold text-amber-500 italic mb-2 font-serif">{s.value}</div>
                   <div className="text-sm text-slate-400 uppercase tracking-widest">{s.label}</div>
                </div>
             ))}
          </div>
          <CertSection title={data.qualifications.title} ids={data.qualifications.certIds} certLib={certLib} />
          <CertSection title={data.honors.title} ids={data.honors.certIds} certLib={certLib} />
        </div>
     </div>
   );
};

export default HonorsPreview;



