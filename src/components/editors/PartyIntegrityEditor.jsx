import { Shield, Settings } from 'lucide-react';
import { PageBanner } from '../ui';

const PartyIntegrityEditor = () => {
  return (
    <div className="bg-white rounded-md border border-gray-4">
      {/* PageBanner */}
      <PageBanner 
        title="廉洁从业"
        description="管理廉洁从业相关内容。"
      />

      {/* 过渡页面 */}
      <div className="px-xl py-xxxl border-t border-gray-4">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 bg-brand-light rounded-full flex items-center justify-center mb-lg">
            <Shield className="w-12 h-12 text-brand opacity-60" />
          </div>
          <h2 className="text-section-title font-semibold text-gray-8 mb-sm">廉洁从业</h2>
          <p className="text-body text-gray-6 max-w-md">
            此模块正在建设中，敬请期待。
          </p>
          <div className="mt-lg flex items-center gap-xs text-caption text-gray-5">
            <Settings className="w-4 h-4" />
            <span>功能开发中...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartyIntegrityEditor;
