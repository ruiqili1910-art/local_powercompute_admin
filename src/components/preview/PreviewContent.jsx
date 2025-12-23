import { Monitor, Database } from 'lucide-react';
import CommonBanner from './CommonBanner';
import IntroPreview from './IntroPreview';
import HistoryPreview from './HistoryPreview';
import SpeechPreview from './SpeechPreview';
import LeadersPreview from './LeadersPreview';
import HonorsPreview from './HonorsPreview';
import { UnderConstruction } from '../common';

const PreviewContent = ({ activeNav, aboutBanner, introData, historyData, speechData, leadersData, honorsData, companyInfo, peopleLib, certLib }) => {
  if (activeNav.category === 'about') {
    return (
      <div className="min-h-full bg-white">
        <CommonBanner config={aboutBanner} />
        {activeNav.page === 'banner_config' && (
          <div className="h-[400px] flex flex-col items-center justify-center text-[#8A9099] gap-4 bg-[#F8FAFC]">
             <Monitor className="w-12 h-12 opacity-20"/>
             <p className="text-sm">此处仅预览 Banner 效果<br/>请切换左侧菜单查看具体页面内容</p>
          </div>
        )}
        {activeNav.page === 'intro' && <IntroPreview data={introData} companyInfo={companyInfo} />}
        {activeNav.page === 'history' && <HistoryPreview data={historyData} />}
        {activeNav.page === 'speech' && <SpeechPreview data={speechData} peopleLib={peopleLib} />}
        {activeNav.page === 'leaders' && <LeadersPreview data={leadersData} peopleLib={peopleLib} />}
        {activeNav.page === 'honors' && <HonorsPreview data={honorsData} certLib={certLib} companyInfo={companyInfo} />}
      </div>
    );
  } else if (['global'].includes(activeNav.category)) {
     return (
      <div className="h-full flex flex-col items-center justify-center text-[#8A9099] gap-4 bg-[#F8FAFC]">
         <Database className="w-16 h-16 opacity-20"/>
         <p>这是数据管理后台，请切换到页面模块查看预览</p>
      </div>
    );
  } else {
     return <UnderConstruction />;
  }
};

export default PreviewContent;



