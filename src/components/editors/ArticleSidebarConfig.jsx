import { Upload, ImageIcon, AlertTriangle, Check, Info, LayoutGrid, Image, FileText, List, Star, Grid3X3 } from 'lucide-react';
import { DISPLAY_POSITIONS } from '../../constants/initialData';

// ==================== 封面图上传组件 ====================
export const CoverUploader = ({ 
  cover, 
  onCoverChange, 
  required = false, 
  hint = null,
  recommendedSize = '1200×675'
}) => {
  const isEmpty = !cover;
  
  return (
    <div>
      <label className="block text-sm text-gray-6 mb-2">
        封面图片 {required ? <span className="text-error">*</span> : <span className="text-gray-4">(选填)</span>}
      </label>
      <div 
        className={`border-2 border-dashed rounded-lg transition-colors cursor-pointer overflow-hidden ${
          required && isEmpty 
            ? 'border-brand/50 hover:border-brand' 
            : 'border-gray-3 hover:border-gray-4'
        }`}
        onClick={() => {
          if (!cover) {
            onCoverChange('bg-gradient-to-br from-blue-400 to-indigo-500');
          }
        }}
      >
        {cover ? (
          <div className={`aspect-video ${cover} relative group`}>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              <button 
                onClick={(e) => { e.stopPropagation(); }}
                className="px-3 py-1.5 bg-white hover:bg-gray-1 text-xs text-gray-7 rounded-md shadow-sm transition-colors"
              >
                替换
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onCoverChange(''); }}
                className="px-3 py-1.5 bg-white hover:bg-gray-1 text-xs text-error rounded-md shadow-sm transition-colors"
              >
                删除
              </button>
            </div>
          </div>
        ) : (
          <div className={`aspect-video flex flex-col items-center justify-center transition-colors ${
            required ? 'bg-brand/5 hover:bg-brand/10' : 'bg-gray-1 hover:bg-gray-2'
          }`}>
            <Upload className={`w-8 h-8 mb-2 ${required ? 'text-brand/50' : 'text-gray-4'}`} />
            <span className={`text-sm ${required ? 'text-brand/70' : 'text-gray-5'}`}>
              {hint || '点击上传封面图'}
            </span>
            <span className="text-xs text-gray-4 mt-1">建议尺寸 {recommendedSize}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// ==================== 线条图标映射 ====================
const PositionIcon = ({ position, className = "w-5 h-5" }) => {
  const iconMap = {
    bigImage: LayoutGrid,
    smallImage: Image,
    textRecommend: FileText,
    normal: List,
    featuredList: Star,
    cardGrid: Grid3X3,
  };
  const IconComponent = iconMap[position] || List;
  return <IconComponent className={className} />;
};

// ==================== 展示位单选卡片 ====================
const PositionCard = ({ 
  position, 
  isSelected, 
  isDisabled,
  disabledReason,
  currentHolder,
  willReplace,
  replaceHint,
  count,
  max,
  onClick 
}) => {
  const pos = DISPLAY_POSITIONS.find(p => p.id === position);
  if (!pos) return null;
  
  const isOverLimit = max !== null && count >= max;
  
  return (
    <div className="relative group/pos">
      <button
        type="button"
        onClick={() => !isDisabled && onClick(position)}
        disabled={isDisabled}
        className={`
          w-full text-left p-3 rounded-lg border-2 transition-all
          ${isSelected 
            ? 'border-brand bg-brand/5 ring-1 ring-brand/20' 
            : isDisabled 
              ? 'border-gray-2 bg-gray-1 opacity-60 cursor-not-allowed'
              : 'border-gray-3 hover:border-gray-4 hover:bg-gray-1'
          }
        `}
      >
        <div className="flex items-start gap-2.5">
          <div className={`p-1.5 rounded ${isSelected ? 'bg-brand/10 text-brand' : 'bg-gray-2 text-gray-5'}`}>
            <PositionIcon position={position} className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${
                isSelected ? 'text-brand' : isDisabled ? 'text-gray-5' : 'text-gray-7'
              }`}>
                {pos.badge || pos.label}
              </span>
              {max !== null && (
                <span className={`text-xs px-1.5 py-0.5 rounded ${
                  isOverLimit && !isSelected 
                    ? 'bg-amber-50 text-amber-600' 
                    : 'bg-gray-2 text-gray-5'
                }`}>
                  {count}/{max}
                </span>
              )}
              {isSelected && (
                <Check className="w-4 h-4 text-brand ml-auto" />
              )}
            </div>
            
            {/* 当前占位者信息（未选中时显示） */}
            {currentHolder && !isSelected && (
              <div className="mt-1.5 text-xs text-gray-5 truncate">
                当前: {currentHolder}
              </div>
            )}
            {!currentHolder && max !== null && count === 0 && !isSelected && (
              <div className="mt-1.5 text-xs text-gray-4">
                当前: 空闲
              </div>
            )}
            
            {/* 选中时的顶替提示 */}
            {isSelected && replaceHint && (
              <div className="mt-2 flex items-start gap-1.5 text-xs text-amber-600 bg-amber-50 rounded px-2 py-1.5">
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                <span>{replaceHint}</span>
              </div>
            )}
          </div>
        </div>
      </button>
      
      {/* Tooltip - 禁用原因 */}
      {isDisabled && disabledReason && (
        <div className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-1 opacity-0 group-hover/pos:opacity-100 pointer-events-none transition-opacity">
          <div className="px-2 py-1 bg-gray-8 text-white text-xs rounded shadow-lg whitespace-nowrap">
            {disabledReason}
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 top-full border-4 border-transparent border-t-gray-8"></div>
        </div>
      )}
    </div>
  );
};

// ==================== 公司要闻/企业新闻 配置组件 ====================
export const NewsDisplayConfig = ({ 
  cover,
  displayPosition, 
  onCoverChange,
  onPositionChange,
  currentNewsId,
  newsList = [],
  category
}) => {
  // 可用的展示位置
  const availablePositions = ['bigImage', 'smallImage', 'textRecommend', 'normal'];
  
  // 需要封面图的展示位置
  const needsCoverPositions = ['bigImage', 'smallImage', 'normal'];
  const selectedNeedsCover = needsCoverPositions.includes(displayPosition);
  
  // 获取各展示位的当前占位者（第一个）
  const getPositionHolder = (positionId) => {
    const holder = newsList.find(n => 
      n.displayPosition === positionId && 
      n.id !== currentNewsId &&
      n.status === 'published'
    );
    return holder?.title || null;
  };
  
  // 获取各展示位的数量
  const getPositionCount = (positionId) => {
    return newsList.filter(n => 
      n.displayPosition === positionId && 
      n.id !== currentNewsId
    ).length;
  };
  
  // 获取顶替提示文案
  const getReplaceHint = (positionId) => {
    const pos = DISPLAY_POSITIONS.find(p => p.id === positionId);
    if (!pos) return null;
    
    const count = getPositionCount(positionId);
    
    // 大图/小图：有占位就显示顶替提示
    if (positionId === 'bigImage' || positionId === 'smallImage') {
      const holder = getPositionHolder(positionId);
      if (holder) {
        const posName = positionId === 'bigImage' ? '大图' : '小图';
        return `发布后，将顶替《${holder}》成为${posName}`;
      }
    }
    
    // 文字推荐/置顶：满额时显示顶替最早的
    if (positionId === 'textRecommend' && count >= pos.max) {
      const oldest = newsList
        .filter(n => n.displayPosition === positionId && n.id !== currentNewsId)
        .sort((a, b) => new Date(a.publishTime) - new Date(b.publishTime))[0];
      if (oldest) {
        return `位次已满 (${pos.max}/${pos.max})，发布后将自动顶替最早的一篇：《${oldest.title}》`;
      }
    }
    
    return null;
  };
  
  // 获取封面图提示
  const getCoverHint = () => {
    if (displayPosition === 'textRecommend') {
      return '当前样式仅展示标题，无需封面';
    }
    if (!cover && selectedNeedsCover) {
      if (displayPosition === 'bigImage') return '请上传封面以启用大图模式';
      if (displayPosition === 'smallImage') return '请上传封面以启用小图模式';
      return '请上传封面图';
    }
    return null;
  };
  
  // 获取推荐尺寸
  const getRecommendedSize = () => {
    if (displayPosition === 'bigImage') return '1920×600px';
    if (displayPosition === 'smallImage') return '800×600px';
    return '1200×675px';
  };
  
  return (
    <div className="space-y-6">
      {/* 封面图上传 */}
      <CoverUploader 
        cover={cover}
        onCoverChange={onCoverChange}
        required={selectedNeedsCover && displayPosition !== 'textRecommend'}
        hint={getCoverHint()}
        recommendedSize={getRecommendedSize()}
      />
      
      {/* 展示位配置 */}
      <div>
        <label className="block text-sm text-gray-6 mb-2">展示位置</label>
        <div className="space-y-2">
          {availablePositions.map(posId => {
            const pos = DISPLAY_POSITIONS.find(p => p.id === posId);
            const isSelected = displayPosition === posId;
            const count = getPositionCount(posId);
            const needsCover = needsCoverPositions.includes(posId);
            // 只有需要封面但没有封面时才禁用（大图/小图需要封面）
            const isDisabledByCover = needsCover && !cover && posId !== 'normal';
            
            return (
              <PositionCard
                key={posId}
                position={posId}
                isSelected={isSelected}
                isDisabled={isDisabledByCover}
                disabledReason={isDisabledByCover ? '请先上传封面图' : ''}
                currentHolder={getPositionHolder(posId)}
                replaceHint={isSelected ? getReplaceHint(posId) : null}
                count={count}
                max={pos?.max}
                onClick={onPositionChange}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ==================== 项目动态 配置组件 ====================
export const ProjectDisplayConfig = ({ 
  cover,
  displayPosition, 
  onCoverChange,
  onPositionChange,
  currentNewsId,
  newsList = []
}) => {
  // 获取当前置顶的文章
  const getCurrentFeatured = () => {
    const holder = newsList.find(n => 
      n.displayPosition === 'featuredList' && 
      n.id !== currentNewsId &&
      n.status === 'published'
    );
    return holder?.title || null;
  };
  
  const featuredHolder = getCurrentFeatured();
  const isFeatureSelected = displayPosition === 'featuredList';
  const isNormalSelected = displayPosition === 'normal';
  
  return (
    <div className="space-y-6">
      {/* 封面图上传 */}
      <CoverUploader 
        cover={cover}
        onCoverChange={onCoverChange}
        required={isFeatureSelected}
        hint={isFeatureSelected && !cover ? '请上传封面以启用置顶模式' : null}
        recommendedSize="1200×675px"
      />
      
      {/* 展示位配置 */}
      <div>
        <label className="block text-sm text-gray-6 mb-2">展示位置</label>
        <div className="space-y-2">
          {/* 图文置顶 */}
          <div className="relative group/pos">
            <button
              type="button"
              onClick={() => onPositionChange('featuredList')}
              disabled={!cover && !isFeatureSelected}
              className={`
                w-full text-left p-3 rounded-lg border-2 transition-all
                ${isFeatureSelected 
                  ? 'border-brand bg-brand/5 ring-1 ring-brand/20' 
                  : !cover
                    ? 'border-gray-2 bg-gray-1 opacity-60 cursor-not-allowed'
                    : 'border-gray-3 hover:border-gray-4 hover:bg-gray-1'
                }
              `}
            >
              <div className="flex items-start gap-2.5">
                <div className={`p-1.5 rounded ${isFeatureSelected ? 'bg-brand/10 text-brand' : 'bg-gray-2 text-gray-5'}`}>
                  <Star className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${isFeatureSelected ? 'text-brand' : 'text-gray-7'}`}>
                      图文置顶
                    </span>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-gray-2 text-gray-5">1/1</span>
                    {isFeatureSelected && <Check className="w-4 h-4 text-brand ml-auto" />}
                  </div>
                  {featuredHolder && !isFeatureSelected && (
                    <div className="mt-1.5 text-xs text-gray-5 truncate">
                      当前: {featuredHolder}
                    </div>
                  )}
                  {!featuredHolder && !isFeatureSelected && (
                    <div className="mt-1.5 text-xs text-gray-4">当前: 空闲</div>
                  )}
                  {isFeatureSelected && featuredHolder && (
                    <div className="mt-2 flex items-start gap-1.5 text-xs text-amber-600 bg-amber-50 rounded px-2 py-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                      <span>发布后，将顶替《{featuredHolder}》成为置顶</span>
                    </div>
                  )}
                </div>
              </div>
            </button>
            {!cover && !isFeatureSelected && (
              <div className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-1 opacity-0 group-hover/pos:opacity-100 pointer-events-none transition-opacity">
                <div className="px-2 py-1 bg-gray-8 text-white text-xs rounded shadow-lg whitespace-nowrap">
                  请先上传封面图
                </div>
              </div>
            )}
          </div>
          
          {/* 普通列表 */}
          <button
            type="button"
            onClick={() => onPositionChange('normal')}
            className={`
              w-full text-left p-3 rounded-lg border-2 transition-all
              ${isNormalSelected 
                ? 'border-brand bg-brand/5 ring-1 ring-brand/20' 
                : 'border-gray-3 hover:border-gray-4 hover:bg-gray-1'
              }
            `}
          >
            <div className="flex items-center gap-2.5">
              <div className={`p-1.5 rounded ${isNormalSelected ? 'bg-brand/10 text-brand' : 'bg-gray-2 text-gray-5'}`}>
                <List className="w-4 h-4" />
              </div>
              <span className={`text-sm font-medium ${isNormalSelected ? 'text-brand' : 'text-gray-7'}`}>
                普通列表
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-gray-2 text-gray-5">不限</span>
              {isNormalSelected && <Check className="w-4 h-4 text-brand ml-auto" />}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

// ==================== 行业信息 配置组件 ====================
export const IndustryDisplayConfig = ({ 
  cover,
  onCoverChange
}) => {
  return (
    <div className="space-y-6">
      {/* 封面图上传 - 选填 */}
      <CoverUploader 
        cover={cover}
        onCoverChange={onCoverChange}
        required={false}
        recommendedSize="800×600px"
      />
      
      {/* 提示信息 */}
      <div className="flex items-start gap-2 text-xs text-gray-5 bg-gray-1 rounded-lg px-3 py-2.5">
        <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-gray-4" />
        <span>行业信息栏目统一采用卡片样式展示，无需配置展示位置。</span>
      </div>
    </div>
  );
};

// ==================== 党的建设 配置组件 ====================
export const PartyBuildingDisplayConfig = ({ 
  cover,
  onCoverChange
}) => {
  return (
    <div className="space-y-6">
      {/* 封面图上传 - 选填 */}
      <CoverUploader 
        cover={cover}
        onCoverChange={onCoverChange}
        required={false}
        recommendedSize="1200×675px"
      />
      
      {/* 提示信息 */}
      <div className="flex items-start gap-2 text-xs text-gray-5 bg-gray-1 rounded-lg px-3 py-2.5">
        <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-gray-4" />
        <span>党的建设栏目统一采用卡片样式展示，封面图片为选填项。</span>
      </div>
    </div>
  );
};

// ==================== 青年之友 配置组件 ====================
export const PartyYouthDisplayConfig = ({ 
  cover,
  displayPosition,
  onCoverChange,
  onPositionChange,
  currentNewsId,
  newsList = []
}) => {
  // 获取当前置顶的文章
  const getCurrentFeatured = () => {
    const holder = newsList.find(n => 
      n.displayPosition === 'featuredList' && 
      n.id !== currentNewsId &&
      n.status === 'published'
    );
    return holder?.title || null;
  };
  
  const featuredHolder = getCurrentFeatured();
  const isFeatureSelected = displayPosition === 'featuredList';
  const isCardSelected = displayPosition === 'cardGrid';
  
  return (
    <div className="space-y-6">
      {/* 封面图上传 */}
      <CoverUploader 
        cover={cover}
        onCoverChange={onCoverChange}
        required={isFeatureSelected}
        hint={isFeatureSelected && !cover ? '请上传封面以启用置顶模式' : null}
        recommendedSize="1200×675px"
      />
      
      {/* 展示位配置 */}
      <div>
        <label className="block text-sm text-gray-6 mb-2">展示位置</label>
        <div className="space-y-2">
          {/* 置顶 */}
          <div className="relative group/pos">
            <button
              type="button"
              onClick={() => onPositionChange('featuredList')}
              disabled={!cover && !isFeatureSelected}
              className={`
                w-full text-left p-3 rounded-lg border-2 transition-all
                ${isFeatureSelected 
                  ? 'border-brand bg-brand/5 ring-1 ring-brand/20' 
                  : !cover
                    ? 'border-gray-2 bg-gray-1 opacity-60 cursor-not-allowed'
                    : 'border-gray-3 hover:border-gray-4 hover:bg-gray-1'
                }
              `}
            >
              <div className="flex items-start gap-2.5">
                <div className={`p-1.5 rounded ${isFeatureSelected ? 'bg-brand/10 text-brand' : 'bg-gray-2 text-gray-5'}`}>
                  <Star className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${isFeatureSelected ? 'text-brand' : 'text-gray-7'}`}>
                      置顶
                    </span>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-gray-2 text-gray-5">1/1</span>
                    {isFeatureSelected && <Check className="w-4 h-4 text-brand ml-auto" />}
                  </div>
                  {featuredHolder && !isFeatureSelected && (
                    <div className="mt-1.5 text-xs text-gray-5 truncate">
                      当前: {featuredHolder}
                    </div>
                  )}
                  {!featuredHolder && !isFeatureSelected && (
                    <div className="mt-1.5 text-xs text-gray-4">当前: 空闲</div>
                  )}
                  {isFeatureSelected && featuredHolder && (
                    <div className="mt-2 flex items-start gap-1.5 text-xs text-amber-600 bg-amber-50 rounded px-2 py-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                      <span>发布后，将顶替《{featuredHolder}》成为置顶</span>
                    </div>
                  )}
                </div>
              </div>
            </button>
            {!cover && !isFeatureSelected && (
              <div className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-1 opacity-0 group-hover/pos:opacity-100 pointer-events-none transition-opacity">
                <div className="px-2 py-1 bg-gray-8 text-white text-xs rounded shadow-lg whitespace-nowrap">
                  请先上传封面图
                </div>
              </div>
            )}
          </div>
          
          {/* 卡片列表 */}
          <button
            type="button"
            onClick={() => onPositionChange('cardGrid')}
            className={`
              w-full text-left p-3 rounded-lg border-2 transition-all
              ${isCardSelected 
                ? 'border-brand bg-brand/5 ring-1 ring-brand/20' 
                : 'border-gray-3 hover:border-gray-4 hover:bg-gray-1'
              }
            `}
          >
            <div className="flex items-center gap-2.5">
              <div className={`p-1.5 rounded ${isCardSelected ? 'bg-brand/10 text-brand' : 'bg-gray-2 text-gray-5'}`}>
                <Grid3X3 className="w-4 h-4" />
              </div>
              <span className={`text-sm font-medium ${isCardSelected ? 'text-brand' : 'text-gray-7'}`}>
                卡片列表
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-gray-2 text-gray-5">不限</span>
              {isCardSelected && <Check className="w-4 h-4 text-brand ml-auto" />}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

// ==================== 招聘信息 配置组件 ====================
export const RecruitDisplayConfig = () => {
  return (
    <div className="space-y-6">
      {/* 提示信息 */}
      <div className="flex items-start gap-2 text-xs text-gray-5 bg-gray-1 rounded-lg px-3 py-2.5">
        <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-gray-4" />
        <span>招聘信息无需配置封面图片和展示位置。</span>
      </div>
    </div>
  );
};

// ==================== 动态配置组件选择器 ====================
export const ArticleSidebarConfig = ({
  category,
  cover,
  displayPosition,
  onCoverChange,
  onPositionChange,
  currentNewsId,
  newsList = []
}) => {
  // 如果没有分类，返回空
  if (!category) {
    return <div className="text-gray-5 text-sm">请选择文章分类</div>;
  }
  
  // 根据分类返回对应的配置组件
  switch (category) {
    case 'recruit': // 招聘信息
      return <RecruitDisplayConfig />;
    case 'company':
    case 'enterprise':
      return (
        <NewsDisplayConfig
          cover={cover || ''}
          displayPosition={displayPosition || 'normal'}
          onCoverChange={onCoverChange}
          onPositionChange={onPositionChange}
          currentNewsId={currentNewsId}
          newsList={newsList || []}
          category={category}
        />
      );
    
    case 'project':
      return (
        <ProjectDisplayConfig
          cover={cover || ''}
          displayPosition={displayPosition || 'normal'}
          onCoverChange={onCoverChange}
          onPositionChange={onPositionChange}
          currentNewsId={currentNewsId}
          newsList={newsList || []}
        />
      );
    
    case 'industry':
      return (
        <IndustryDisplayConfig
          cover={cover || ''}
          onCoverChange={onCoverChange}
        />
      );
    
    case 'party_building': // 党的建设
      return (
        <PartyBuildingDisplayConfig
          cover={cover || ''}
          onCoverChange={onCoverChange}
        />
      );
    
    case 'party_youth': // 青年之友
      return (
        <PartyYouthDisplayConfig
          cover={cover || ''}
          displayPosition={displayPosition || 'cardGrid'}
          onCoverChange={onCoverChange}
          onPositionChange={onPositionChange}
          currentNewsId={currentNewsId}
          newsList={newsList || []}
        />
      );
    
    default:
      // 默认使用通用配置
      return (
        <NewsDisplayConfig
          cover={cover || ''}
          displayPosition={displayPosition || 'normal'}
          onCoverChange={onCoverChange}
          onPositionChange={onPositionChange}
          currentNewsId={currentNewsId}
          newsList={newsList || []}
          category={category}
        />
      );
  }
};

export default ArticleSidebarConfig;


