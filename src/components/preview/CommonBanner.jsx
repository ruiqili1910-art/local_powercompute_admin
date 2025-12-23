const CommonBanner = ({ config }) => (
  <div className={`h-64 relative flex flex-col items-center justify-center text-white text-center ${config.bgType==='color'?config.bgValue:'bg-slate-800'}`}>
     {config.bgType === 'image' && config.bgValue && <div className={`absolute inset-0 ${config.bgValue} bg-cover bg-center opacity-50`}></div>}
     <div className="z-10">
        <h2 className="text-4xl font-bold tracking-widest mb-2">{config.title}</h2>
        <p className="text-sm opacity-80 uppercase tracking-widest">{config.subtitle}</p>
     </div>
  </div>
);

export default CommonBanner;



