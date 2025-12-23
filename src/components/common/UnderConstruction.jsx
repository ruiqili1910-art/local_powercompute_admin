import { Megaphone } from 'lucide-react';

const UnderConstruction = () => (
  <div className="h-full flex flex-col items-center justify-center text-[#8A9099] gap-6 bg-[#F8FAFC] animate-in fade-in duration-500">
     <div className="w-24 h-24 bg-[#E6F1FF] rounded-full flex items-center justify-center shadow-inner">
        <Megaphone className="w-12 h-12 text-[#2B7FFF] opacity-80" />
     </div>
     <div className="text-center space-y-2">
       <h3 className="text-xl font-bold text-[#1C1F23]">功能开发中</h3>
       <p className="text-sm text-[#4B4F55] max-w-xs mx-auto">此模块正在加紧建设中，请稍后访问或联系管理员获取更多信息。</p>
     </div>
     <div className="w-64 h-2 bg-[#E6E8EB] rounded-full overflow-hidden mt-4">
       <div className="w-2/3 h-full bg-[#2B7FFF] rounded-full animate-[pulse_2s_ease-in-out_infinite]"></div>
     </div>
  </div>
);

export default UnderConstruction;



