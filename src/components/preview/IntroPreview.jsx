import { COMPANY_FIELD_LABELS } from '../../constants/initialData';

const IntroPreview = ({ data, companyInfo }) => {
  const stats = data.main.statsMode === 'global' 
    ? (data.main.selectedGlobalKeys || []).map(key => ({
        label: COMPANY_FIELD_LABELS[key],
        value: companyInfo[key]
      }))
    : data.main.customStats;

  return (
    <div className="bg-white">
       <div className="max-w-6xl mx-auto p-12">
         <div className="grid grid-cols-2 gap-12 items-center mb-16">
            <div>
               <h3 className="text-3xl font-bold mb-6 text-slate-800">{data.main.title}</h3>
               <div className="text-base text-slate-600 leading-loose whitespace-pre-line text-justify">{data.main.content}</div>
            </div>
            {data.main.image && (
               <div className={`w-full ${data.main.image.url} bg-cover bg-center rounded-2xl shadow-xl ${data.main.image.isCropped ? 'aspect-[9/16]' : 'aspect-video'}`}></div>
            )}
         </div>
         
         <div className="grid grid-cols-4 gap-8">
            {stats.slice(0, 4).map((s, i) => (
               <div key={i} className="text-center p-6 bg-slate-50 rounded-xl border border-slate-100 hover:shadow-lg transition-all">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{s.value}</div>
                  <div className="text-sm text-slate-500 uppercase tracking-wide">{s.label}</div>
               </div>
            ))}
         </div>
       </div>
    </div>
  );
};

export default IntroPreview;



