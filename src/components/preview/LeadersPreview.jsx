const LeadersPreview = ({ data, peopleLib }) => (
  <div className="bg-slate-50 py-16 min-h-screen">
     <div className="max-w-6xl mx-auto px-8">
       <div className="grid grid-cols-3 gap-8">
         {data.leaderIds.map(id => {
            const p = peopleLib.find(x => x.id === id);
            if(!p) return null;
            return (
               <div key={id} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-xl transition-all border border-slate-100 hover:-translate-y-1">
                  <div className={`w-24 h-24 ${p.photo} rounded-full bg-cover mx-auto mb-6 shadow-md`}></div>
                  <div className="text-center">
                     <div className="font-bold text-lg text-slate-900">{p.name}</div>
                     <div className="text-sm text-blue-600 font-medium mb-4">{p.title}</div>
                     <div className="text-sm text-slate-500 leading-relaxed text-justify line-clamp-4">{p.bio}</div>
                  </div>
               </div>
            )
         })}
       </div>
     </div>
  </div>
);

export default LeadersPreview;



