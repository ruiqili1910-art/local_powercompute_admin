const HistoryPreview = ({ data }) => (
  <div className="bg-white py-12">
     <div className="max-w-5xl mx-auto px-8">
       <div className="space-y-12 relative border-l-2 border-slate-100 ml-4 pl-12">
          {data.timeline.map(item => (
             <div key={item.id} className="relative group">
                <div className="absolute -left-[57px] top-1 w-6 h-6 rounded-full bg-white border-4 border-blue-600 shadow-md group-hover:scale-125 transition-transform"></div>
                <div className="grid grid-cols-[100px_1fr] gap-8 items-start">
                   <div className="text-3xl font-bold text-slate-300 font-mono group-hover:text-blue-600 transition-colors">{item.year}</div>
                   <div>
                      <div className="text-xl font-bold text-slate-800 mb-2">{item.title}</div>
                      <div className="text-base text-slate-600 leading-relaxed mb-4">{item.desc}</div>
                      {item.img && <div className={`w-full h-48 ${item.img.url} bg-cover rounded-xl shadow-sm opacity-90 group-hover:opacity-100 transition-opacity`}></div>}
                   </div>
                </div>
             </div>
          ))}
       </div>
     </div>
  </div>
);

export default HistoryPreview;



