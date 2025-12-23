const SpeechPreview = ({ data, peopleLib }) => {
  const person = peopleLib.find(p => p.id === data.speakerId) || {};
  const photoUrl = data.customImage?.url || person.photo || 'bg-slate-200';
  return (
    <div className="bg-white py-16">
       <div className="max-w-5xl mx-auto px-8 flex gap-12 items-start">
          <div className={`w-64 h-80 ${photoUrl} bg-cover rounded-lg shadow-2xl flex-shrink-0 relative`}>
             <div className="absolute -bottom-6 -right-6 bg-white p-6 shadow-xl rounded-lg border border-slate-100">
                <div className="text-xl font-bold text-slate-900">{person.name}</div>
                <div className="text-sm text-blue-600 font-medium">{person.title}</div>
             </div>
          </div>
          <div className="flex-1 pt-4">
             <h3 className="text-2xl font-bold mb-6 leading-tight text-slate-800">{data.content.title}</h3>
             <div className="text-base text-slate-600 leading-loose whitespace-pre-line">{data.content.body}</div>
             <div className="mt-8 pt-8 border-t border-slate-100 flex justify-end">
                {/* Signature can go here */}
             </div>
          </div>
       </div>
    </div>
  );
};

export default SpeechPreview;



