import { useState } from 'react';
import { 
  Image as ImageIcon, Settings, Users, Building2, Briefcase, FileText, UserCheck, 
  Award, ChevronDown, Database, History, UserCircle, Bell, Eye,
  Home, Newspaper, Flag, Star, Leaf, Shield, Globe, Layout, Target, Handshake, FolderTree, Heart,
  Phone, Lightbulb, LogOut, Menu, X
} from 'lucide-react';

// 登录页面
import LoginPage from './components/LoginPage';

// UI 组件
import UserMenu from './components/ui/UserMenu';
import UserProfileDrawer from './components/ui/UserProfileDrawer';

// 未保存修改上下文
import { UnsavedChangesProvider, useUnsavedChanges } from './contexts/UnsavedChangesContext';

// 常量
import {
  INITIAL_COMPANY_INFO,
  INITIAL_CERT_LIBRARY,
  INITIAL_IMAGE_LIBRARY,
  INITIAL_PEOPLE_LIBRARY,
  INITIAL_ABOUT_BANNER,
  INITIAL_INTRO_DATA,
  INITIAL_HISTORY_DATA,
  INITIAL_SPEECH_DATA,
  INITIAL_LEADERS_DATA,
  INITIAL_HONORS_DATA,
  INITIAL_HOME_VISION,
  INITIAL_HOME_NEWS,
  INITIAL_HOME_ABOUT,
  INITIAL_HOME_STAFF,
  INITIAL_HOME_PARTNER,
  INITIAL_ARTICLES,
  INITIAL_COMPANY_INFO_LIBRARY,
  INITIAL_COMPANY_HONORS,
  INITIAL_STAFF_LIBRARY,
  INITIAL_PARTNER_LIBRARY,
  INITIAL_RECRUITS,
  INITIAL_CULTURE_DATA,
  INITIAL_SUBSIDIARY_DATA,
  INITIAL_ESG_DATA,
  INITIAL_PROJECT_LIBRARY,
  INITIAL_BRAND_LIBRARY,
  INITIAL_HR_LIBRARY,
  INITIAL_DISTRIBUTION_LIBRARY,
  INITIAL_TECH_LIBRARY,
  INITIAL_WELFARE_LIBRARY,
  INITIAL_ESG_LIBRARY,
  INITIAL_PUBLIC_BASIC,
  INITIAL_PUBLIC_SUBSIDIARY,
  INITIAL_PUBLIC_CONTACT,
  INITIAL_MESSAGES,
  INITIAL_SUSTAIN_TECH_DATA,
  INITIAL_SUSTAIN_RESPONSIBILITY_DATA,
  INITIAL_BUSINESS_BANNER,
  INITIAL_BUSINESS_INDUSTRY,
  INITIAL_BUSINESS_TRADE,
  INITIAL_SUSTAIN_SAFETY,
  INITIAL_SUSTAIN_GLOBAL,
  INITIAL_PARTY_INTEGRITY,
    // 新闻中心
    NEWS_CATEGORIES,
    INITIAL_NEWS_LIST,
    INITIAL_NEWS_BANNER,
    // 工程承包
    INITIAL_ENGINEERING_CATEGORIES,
    INITIAL_ENGINEERING_PROJECTS,
    // 页脚内容
    INITIAL_FOOTER_CONTENT
} from './constants/initialData';

// UI 组件
import { Modal, UnsavedChangesModal } from './components/ui';

// 预览组件
import { PreviewContent } from './components/preview';

// 编辑器组件
import {
  CompanyInfoEditor,
  ImageLibraryEditor,
  CertLibraryEditor,
  PeopleLibraryEditor,
  AboutBannerEditor,
  ModuleBannerEditor,
  IntroEditor,
  HistoryEditor,
  SpeechEditor,
  LeadersEditor,
  HonorsEditor,
  HomeBannerEditor,
  HomeNewsEditor,
  HomeAboutEditor,
  HomeBusinessEditor,
  HomeCultureEditor,
  HomeStaffEditor,
  HomePartnerEditor,
  NewsListEditor,
  NewsCategoryEditor,
  NewsBannerEditor,
  BusinessBannerEditor,
  BusinessProjectEditor,
  BusinessEngineeringEditor,
  CultureCompanyEditor,
  PartyBuildingEditor,
  HREditor,
  PublicBasicEditor,
  PublicContactEditor,
  PublicSubsidiaryEditor,
  SustainTechEditor,
  SustainResponsibilityEditor,
  SustainESGEditor,
  ArticleEditor,
  CompanyInfoLibraryEditor,
  BrandImageEditor,
  PartyIntegrityEditor,
  PartyYouthEditor,
  PartyWorkersEditor,
  HRRecruitEditor,
  StaffLibraryEditor,
  ProjectLibraryEditor,
  BusinessIndustryEditor,
  BusinessTradeEditor,
  SustainSafetyEditor,
  SustainGlobalEditor,
  BrandLibraryEditor,
  HRLibraryEditor,
  DistributionLibraryEditor,
  TechLibraryEditor,
  WelfareLibraryEditor,
  ESGLibraryEditor,
  FooterContentEditor,
  UserPermissionEditor
} from './components/editors';

// ==========================================
// 菜单配置
// ==========================================
const menuConfig = [
  {
    id: 'global', label: '全局资源库', icon: Database,
    items: [
      { id: 'info', label: '公司档案信息', icon: Building2 },
      { id: 'images', label: '图片媒体库', icon: ImageIcon },
      { id: 'certs', label: '资质荣誉库', icon: Award },
      { id: 'people', label: '人员专家库', icon: UserCircle },
      { id: 'footer', label: '页脚内容管理', icon: Settings },
    ]
  },
  {
    id: 'home_manage', label: '首页管理', icon: Home,
    items: [
      { id: 'home_banner', label: 'Banner 设置', icon: Image },
      { id: 'home_news', label: '最新动态', icon: Newspaper },
      { id: 'home_about', label: '关于我们', icon: Building2 },
      { id: 'home_business', label: '业务板块', icon: Briefcase },
      { id: 'home_culture', label: '社会责任与文化', icon: Heart },
      { id: 'home_staff', label: '员工风采', icon: Users },
      { id: 'home_partner', label: '合作伙伴', icon: Handshake },
    ]
  },
  {
    id: 'about', label: '关于我们', icon: Briefcase,
    items: [
      { id: 'banner_config', label: 'Banner 设置', icon: Settings },
      { id: 'intro', label: '公司简介', icon: FileText },
      { id: 'history', label: '发展历程', icon: History },
      { id: 'speech', label: '董事长致辞', icon: UserCheck },
      { id: 'leaders', label: '公司领导', icon: Users },
      { id: 'honors', label: '荣誉资质', icon: Award },
    ]
  },
  {
    id: 'news', label: '新闻中心', icon: Newspaper,
    items: [
      { id: 'news_banner', label: 'Banner设置', icon: FileText },
      { id: 'news_company', label: '公司要闻', icon: FileText },
      { id: 'news_enterprise', label: '企业新闻', icon: FileText },
      { id: 'news_project', label: '项目动态', icon: FileText },
      { id: 'news_industry', label: '行业信息', icon: FileText },
    ]
  },
  {
    id: 'business', label: '业务领域', icon: Layout,
    items: [
      { id: 'biz_banner', label: 'Banner 设置', icon: ImageIcon },
      { id: 'biz_engineering', label: '工程承包', icon: Building2 },
      { id: 'biz_project', label: '项目总览', icon: FolderTree },
      { id: 'biz_industry', label: '实业投资', icon: Globe },
      { id: 'biz_trade', label: '国际贸易', icon: Globe },
    ]
  },
  {
    id: 'culture', label: '品牌文化', icon: Flag,
    items: [
      { id: 'culture_banner', label: 'Banner 设置', icon: Settings },
      { id: 'culture_company', label: '企业文化', icon: Heart },
      { id: 'culture_brand', label: '品牌形象', icon: ImageIcon },
    ]
  },
  {
    id: 'party', label: '党建领航', icon: Star,
    items: [
      { id: 'party_banner', label: 'Banner 设置', icon: Settings },
      { id: 'party_building', label: '党的建设', icon: FileText },
      { id: 'party_integrity', label: '廉洁从业', icon: Shield },
      { id: 'party_youth', label: '青年之友', icon: Users },
      { id: 'party_workers', label: '职工之家', icon: Users },
    ]
  },
  {
    id: 'hr', label: '人力资源', icon: Users,
    items: [
      { id: 'hr_banner', label: 'Banner 设置', icon: Settings },
      { id: 'hr_strategy', label: '人才战略', icon: FileText },
      { id: 'hr_team', label: '人才队伍', icon: Users },
      { id: 'hr_recruit', label: '招聘信息', icon: Briefcase },
    ]
  },
  {
    id: 'public', label: '企业公开', icon: Shield,
    items: [
      { id: 'public_banner', label: 'Banner 设置', icon: Settings },
      { id: 'public_info', label: '基本信息', icon: FileText },
      { id: 'public_management', label: '经营管理重大事项', icon: Settings },
      { id: 'public_contact', label: '联系方式', icon: Phone },
      { id: 'public_subsidiary', label: '子公司情况', icon: Building2 },
    ]
  },
  {
    id: 'sustain', label: '可持续发展', icon: Leaf,
    items: [
      { id: 'sus_banner', label: 'Banner 设置', icon: Settings },
      { id: 'sus_tech', label: '科技创新', icon: Lightbulb },
      { id: 'sus_safety', label: '安环行动', icon: Shield },
      { id: 'sus_global', label: '全球发展', icon: Globe },
      { id: 'sus_responsibility', label: '社会责任', icon: Heart },
      { id: 'sus_esg', label: 'ESG报告', icon: FileText },
    ]
  },
];

// ==========================================
// 主应用内容组件（使用 Context）
// ==========================================
const AppContent = () => {
  // 未保存修改上下文
  const { 
    showLeaveConfirm, 
    confirmNavigation, 
    cancelNavigation,
    requestNavigation 
  } = useUnsavedChanges();

  // 登录状态
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  // 深色模式状态
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // 个人中心抽屉状态
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);

  // 导航状态 - 默认跳转到首页管理
  const [activeNav, setActiveNav] = useState({ category: 'home_manage', page: 'home_banner' });
  const [expandedMenu, setExpandedMenu] = useState('home_manage');
  const [showFullPreview, setShowFullPreview] = useState(false);
  
  // 响应式侧边栏状态
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 全局库状态 - 所有 useState 必须在条件返回之前
  const [companyInfo, setCompanyInfo] = useState(INITIAL_COMPANY_INFO);
  const [certLibrary, setCertLibrary] = useState(INITIAL_CERT_LIBRARY);
  const [imageLibrary, setImageLibrary] = useState(INITIAL_IMAGE_LIBRARY);
  const [peopleLibrary, setPeopleLibrary] = useState(INITIAL_PEOPLE_LIBRARY);
  const [articles, setArticles] = useState(INITIAL_ARTICLES);
  const [companyInfoLibrary, setCompanyInfoLibrary] = useState(INITIAL_COMPANY_INFO_LIBRARY);
  const [companyHonors, setCompanyHonors] = useState(INITIAL_COMPANY_HONORS);
  const [staffLibrary, setStaffLibrary] = useState(INITIAL_STAFF_LIBRARY);
  const [partnerLibrary, setPartnerLibrary] = useState(INITIAL_PARTNER_LIBRARY);
  const [projectLibrary, setProjectLibrary] = useState(INITIAL_PROJECT_LIBRARY);
  const [engineeringCategories, setEngineeringCategories] = useState(INITIAL_ENGINEERING_CATEGORIES);
  const [engineeringProjects, setEngineeringProjects] = useState(INITIAL_ENGINEERING_PROJECTS);
  const [recruits, setRecruits] = useState(INITIAL_RECRUITS);
  const [brandLibrary, setBrandLibrary] = useState(INITIAL_BRAND_LIBRARY);
  const [cultureData, setCultureData] = useState(INITIAL_CULTURE_DATA);
  const [subsidiaryData, setSubsidiaryData] = useState(INITIAL_SUBSIDIARY_DATA);
  const [sustainEsg, setSustainEsg] = useState({});
  const [hrLibrary, setHRLibrary] = useState(INITIAL_HR_LIBRARY);
  const [distributionLibrary, setDistributionLibrary] = useState(INITIAL_DISTRIBUTION_LIBRARY);
  const [techLibrary, setTechLibrary] = useState(INITIAL_TECH_LIBRARY);
  const [welfareLibrary, setWelfareLibrary] = useState(INITIAL_WELFARE_LIBRARY);
  const [esgLibrary, setESGLibrary] = useState(INITIAL_ESG_LIBRARY);
  const [footerContent, setFooterContent] = useState(INITIAL_FOOTER_CONTENT);

  // 页面配置状态
  const [aboutBanner, setAboutBanner] = useState(INITIAL_ABOUT_BANNER);
  const [introData, setIntroData] = useState(INITIAL_INTRO_DATA);
  const [historyData, setHistoryData] = useState(INITIAL_HISTORY_DATA);
  const [speechData, setSpeechData] = useState(INITIAL_SPEECH_DATA);
  const [leadersData, setLeadersData] = useState(INITIAL_LEADERS_DATA);
  const [honorsData, setHonorsData] = useState(INITIAL_HONORS_DATA);
  
  // 首页管理状态
  const [homeBanner, setHomeBanner] = useState({});
  const [homeNews, setHomeNews] = useState({});
  const [homeAbout, setHomeAbout] = useState({});
  const [homeBusiness, setHomeBusiness] = useState({});
  const [homeCulture, setHomeCulture] = useState({});
  const [homeStaff, setHomeStaff] = useState({});
  const [homePartner, setHomePartner] = useState({});
  
  // 企业公开状态
  const [publicBasic, setPublicBasic] = useState(INITIAL_PUBLIC_BASIC);
  const [publicSubsidiary, setPublicSubsidiary] = useState(INITIAL_PUBLIC_SUBSIDIARY);
  const [publicContact, setPublicContact] = useState(INITIAL_PUBLIC_CONTACT);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  
  // 可持续发展状态
  const [sustainTech, setSustainTech] = useState(INITIAL_SUSTAIN_TECH_DATA);
  const [sustainResponsibility, setSustainResponsibility] = useState(INITIAL_SUSTAIN_RESPONSIBILITY_DATA);
  
  // 业务领域状态
  const [businessBanner, setBusinessBanner] = useState(INITIAL_BUSINESS_BANNER);
  const [businessIndustry, setBusinessIndustry] = useState(INITIAL_BUSINESS_INDUSTRY);
  const [businessTrade, setBusinessTrade] = useState(INITIAL_BUSINESS_TRADE);
  
  // 党建领航-廉洁从业状态
  const [partyIntegrity, setPartyIntegrity] = useState(INITIAL_PARTY_INTEGRITY);

  // 各模块 Banner 状态
  const [cultureBanner, setCultureBanner] = useState({ title: '品牌文化', subtitle: '传承企业精神，塑造卓越品牌', bgType: 'color', bgValue: 'bg-purple-900' });
  const [partyBanner, setPartyBanner] = useState({ title: '党建领航', subtitle: '坚持党的领导，引领企业发展', bgType: 'color', bgValue: 'bg-red-900' });
  const [partyYouthBanner, setPartyYouthBanner] = useState({ title: '青年之友', subtitle: '青春建功新时代，奋斗成就新梦想', bgType: 'color', bgValue: 'bg-red-900' });
  const [hrBanner, setHRBanner] = useState({ title: '人力资源', subtitle: '人才是第一资源，共创美好未来', bgType: 'color', bgValue: 'bg-teal-900' });
  const [publicBanner, setPublicBanner] = useState({ title: '企业公开', subtitle: '公开透明，接受社会监督', bgType: 'color', bgValue: 'bg-green-900' });
  const [sustainBanner, setSustainBanner] = useState({ title: '可持续发展', subtitle: '绿色发展，共建美好未来', bgType: 'color', bgValue: 'bg-sky-900' });
  
  // 可持续发展-安环行动和全球发展状态
  const [sustainSafety, setSustainSafety] = useState(INITIAL_SUSTAIN_SAFETY);
  const [sustainGlobal, setSustainGlobal] = useState(INITIAL_SUSTAIN_GLOBAL);

  // 新闻中心状态
  const [newsList, setNewsList] = useState(INITIAL_NEWS_LIST);
  const [newsCategories, setNewsCategories] = useState(NEWS_CATEGORIES);
  const [newsBanner, setNewsBanner] = useState(INITIAL_NEWS_BANNER);

  // 处理登录
  const handleLogin = (formData) => {
    // 模拟登录验证（实际项目中应调用后端API）
    setCurrentUser({
      username: formData.username,
      email: `${formData.username}@cms.com`,
      avatar: formData.username.charAt(0).toUpperCase()
    });
    setIsLoggedIn(true);
  };

  // 处理登出
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  // 处理个人中心点击
  const handleProfileClick = () => {
    setShowProfileDrawer(true);
  };

  // 处理更新个人资料
  const handleUpdateProfile = (profileData) => {
    console.log('更新个人资料:', profileData);
    setCurrentUser({
      ...currentUser,
      username: profileData.nickname,
      avatar: profileData.avatar
    });
    setShowProfileDrawer(false);
    alert('个人资料更新成功');
  };

  // 处理修改密码
  const handleUpdatePassword = (passwordData) => {
    console.log('修改密码:', passwordData);
    // TODO: 调用后端API修改密码
  };

  // 处理切换语言
  const handleLanguageChange = () => {
    console.log('切换语言');
    // TODO: 实现语言切换逻辑
  };

  // 处理深色模式切换
  const handleThemeChange = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    // 应用深色模式样式
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // 处理访问前台
  const handleVisitFrontend = () => {
    // 打开前台网站（需要根据实际情况配置URL）
    window.open('/', '_blank');
  };

  // 处理用户权限管理
  const handleUserManagement = () => {
    // 导航到用户权限页面（使用特殊的category标识）
    const canNavigate = requestNavigation(() => {
      setActiveNav({ category: 'user_permission', page: 'user_permission' });
      setSidebarOpen(false);
    });
    
    if (canNavigate) {
      setActiveNav({ category: 'user_permission', page: 'user_permission' });
      setSidebarOpen(false);
    }
  };

  // 未登录时显示登录页面
  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // 计算当前页面标签
  const activeCatLabel = activeNav.category === 'user_permission' 
    ? '系统管理' 
    : menuConfig.find(c => c.id === activeNav.category)?.label;
  const activePageLabel = activeNav.category === 'user_permission'
    ? '用户权限'
    : menuConfig.find(c => c.id === activeNav.category)?.items.find(i => i.id === activeNav.page)?.label;

  // 处理导航点击（带离开拦截）
  const handleNavClick = (category, page) => {
    // 如果点击的是当前页面，直接返回
    if (activeNav.category === category && activeNav.page === page) {
      return;
    }
    
    // 请求导航，如果有未保存修改会弹出确认框
    const canNavigate = requestNavigation(() => {
      setActiveNav({ category, page });
      setSidebarOpen(false);
    });
    
    // 如果允许直接导航
    if (canNavigate) {
      setActiveNav({ category, page });
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-3 text-text-primary font-sans overflow-hidden selection:bg-brand/20">
      {/* ==================== 移动端遮罩层 ==================== */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ==================== 侧边栏 ==================== */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-[204px] bg-white border-r border-gray-4 flex flex-col shadow-light
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="p-4 lg:p-6 border-b border-gray-4 flex items-center justify-between">
          <h1 className="text-section lg:text-title flex items-center gap-2 lg:gap-2.5 text-text-primary">
            <div className="w-7 h-7 lg:w-8 lg:h-8 bg-brand rounded-lg flex items-center justify-center shadow-lg shadow-brand/30">
               <Settings className="w-4 h-4 lg:w-5 lg:h-5 text-white" strokeWidth={2} />
            </div>
            <span>CMS 后台</span>
          </h1>
          {/* 移动端关闭按钮 */}
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-gray-3 text-text-placeholder"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 导航菜单 */}
        <nav className="flex-1 overflow-y-auto py-4 lg:py-6 px-2 lg:px-3 space-y-1 custom-scrollbar">
          {menuConfig.map(cat => (
            <div key={cat.id} className="mb-1 lg:mb-2">
              <button 
                onClick={() => setExpandedMenu(expandedMenu === cat.id ? null : cat.id)} 
                className={`w-full flex items-center justify-between px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg transition-all duration-200 group ${expandedMenu === cat.id ? 'bg-gray-3 text-brand' : 'text-text-secondary hover:bg-gray-3 hover:text-text-primary'}`}
              >
                <div className="flex items-center gap-2.5 lg:gap-3 font-medium text-caption lg:text-body">
                  <cat.icon className={`w-4 h-4 lg:w-5 lg:h-5 transition-colors ${expandedMenu === cat.id ? 'text-brand' : 'text-text-placeholder group-hover:text-text-secondary'}`} strokeWidth={1.5} />
                  <span>{cat.label}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-text-placeholder transition-transform duration-300 ${expandedMenu === cat.id ? 'rotate-180 text-brand' : ''}`} />
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedMenu === cat.id ? 'max-h-[600px] opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                <div className="pl-3 lg:pl-4 space-y-0.5 lg:space-y-1">
                  {cat.items.map(item => {
                    const isActive = activeNav.category === cat.id && activeNav.page === item.id;
                    return (
                      <button 
                        key={item.id} 
                        onClick={() => handleNavClick(cat.id, item.id)} 
                        className={`w-full flex items-center gap-2.5 lg:gap-3 px-3 lg:px-4 py-2 lg:py-2.5 rounded-lg text-caption lg:text-body font-medium transition-all ${
                          isActive 
                            ? 'bg-brand-light text-brand' 
                            : 'text-text-secondary hover:text-text-primary hover:bg-gray-3'
                        }`}
                      >
                        <div className={`w-1 h-1 lg:w-1.5 lg:h-1.5 rounded-full transition-colors ${isActive ? 'bg-brand' : 'bg-transparent'}`}></div>
                        <span className="truncate">{item.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          ))}
        </nav>
        
        {/* 用户信息 */}
        <div className="p-3 lg:p-4 border-t border-gray-4">
          <UserMenu
            user={currentUser}
            onLogout={handleLogout}
            onProfileClick={handleProfileClick}
            onVisitFrontend={handleVisitFrontend}
            onUserManagement={handleUserManagement}
          />
        </div>
      </div>

      {/* 个人中心抽屉 */}
      <UserProfileDrawer
        isOpen={showProfileDrawer}
        onClose={() => setShowProfileDrawer(false)}
        user={currentUser}
        onUpdateProfile={handleUpdateProfile}
        onUpdatePassword={handleUpdatePassword}
      />

      {/* ==================== 主编辑区域 ==================== */}
      <div className="flex-1 flex flex-col min-w-0 bg-gray-3">
        {/* 顶部标题栏 */}
        <header className="bg-white/80 backdrop-blur-md h-14 lg:h-16 flex items-center justify-between px-lg lg:px-xl flex-shrink-0 sticky top-0 z-10 border-b border-gray-4/50">
          <div className="flex items-center gap-2 lg:gap-4">
             {/* 移动端汉堡菜单按钮 */}
             <button 
               onClick={() => setSidebarOpen(true)}
               className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-gray-3 text-text-secondary"
             >
               <Menu className="w-5 h-5" />
             </button>
             <div className="flex items-center gap-1 lg:gap-2 min-w-0">
               <span className="hidden sm:inline text-caption text-text-placeholder">当前位置 /</span>
               <h2 className="text-caption font-medium text-text-primary flex items-center gap-1 lg:gap-2 truncate">
                 <span className="hidden md:inline">{activeCatLabel}</span>
                 <span className="hidden md:inline text-gray-4">/</span>
                 <span className="truncate">{activePageLabel}</span>
               </h2>
             </div>
          </div>
          <div className="flex items-center gap-2 lg:gap-4">
             <button 
                onClick={() => setShowFullPreview(true)}
                className="flex items-center gap-1.5 lg:gap-2 px-2.5 lg:px-3 py-1.5 lg:py-2 text-brand bg-brand/10 hover:bg-brand/20 rounded-lg text-caption lg:text-body font-medium transition-colors"
             >
                <Eye className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                <span className="hidden sm:inline">预览</span>
             </button>
             <button className="p-1.5 lg:p-2 text-text-placeholder hover:text-text-primary transition-colors relative">
               <Bell className="w-4 h-4 lg:w-5 lg:h-5" />
               <span className="absolute top-1 right-1 lg:top-1.5 lg:right-1.5 w-1.5 h-1.5 lg:w-2 lg:h-2 bg-error rounded-full"></span>
             </button>
          </div>
        </header>

        {/* 内容区域 - 统一间距 24px */}
        <div className="flex-1 overflow-y-auto p-xl custom-scrollbar">
           <div className="max-w-full lg:max-w-[1160px] mx-auto pb-xxl animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* 全局资源库 */}
              {activeNav.category === 'global' && (
                <>
                  {activeNav.page === 'info' && <CompanyInfoEditor info={companyInfo} onChange={setCompanyInfo} />}
                  {activeNav.page === 'images' && <ImageLibraryEditor library={imageLibrary} onChange={setImageLibrary} />}
                  {activeNav.page === 'certs' && <CertLibraryEditor library={certLibrary} onChange={setCertLibrary} imageLib={imageLibrary} />}
                  {activeNav.page === 'people' && <PeopleLibraryEditor library={peopleLibrary} onChange={setPeopleLibrary} imageLib={imageLibrary} />}
                  {activeNav.page === 'footer' && <FooterContentEditor data={footerContent} onChange={setFooterContent} imageLib={imageLibrary} />}
                </>
              )}

              {/* 关于我们 */}
              {activeNav.category === 'about' && (
                <>
                  {activeNav.page === 'banner_config' && <AboutBannerEditor data={aboutBanner} onChange={setAboutBanner} imageLib={imageLibrary} />}
                  {activeNav.page === 'intro' && <IntroEditor data={introData} onChange={setIntroData} imageLib={imageLibrary} companyInfo={companyInfo} />}
                  {activeNav.page === 'history' && <HistoryEditor data={historyData} onChange={setHistoryData} imageLib={imageLibrary} />}
                  {activeNav.page === 'speech' && <SpeechEditor data={speechData} onChange={setSpeechData} peopleLib={peopleLibrary} imageLib={imageLibrary} />}
                  {activeNav.page === 'leaders' && <LeadersEditor data={leadersData} onChange={setLeadersData} peopleLib={peopleLibrary} />}
                  {activeNav.page === 'honors' && <HonorsEditor data={honorsData} onChange={setHonorsData} certLib={certLibrary} companyInfo={companyInfo} />}
                </>
              )}

              {/* 首页管理 */}
              {activeNav.category === 'home_manage' && (
                <>
                  {activeNav.page === 'home_banner' && <HomeBannerEditor data={homeBanner} onChange={setHomeBanner} imageLib={imageLibrary} />}
                  {activeNav.page === 'home_news' && <HomeNewsEditor data={homeNews} onChange={setHomeNews} newsList={newsList} />}
                  {activeNav.page === 'home_about' && <HomeAboutEditor data={homeAbout} onChange={setHomeAbout} companyInfo={companyInfo} imageLib={imageLibrary} />}
                  {activeNav.page === 'home_business' && <HomeBusinessEditor data={homeBusiness} onChange={setHomeBusiness} imageLib={imageLibrary} />}
                  {activeNav.page === 'home_culture' && <HomeCultureEditor data={homeCulture} onChange={setHomeCulture} imageLib={imageLibrary} />}
                  {activeNav.page === 'home_staff' && <HomeStaffEditor data={homeStaff} onChange={setHomeStaff} imageLib={imageLibrary} />}
                  {activeNav.page === 'home_partner' && <HomePartnerEditor data={homePartner} onChange={setHomePartner} imageLib={imageLibrary} />}
                </>
              )}

              {/* 新闻中心 */}
              {activeNav.category === 'news' && (
                <>
                  {activeNav.page === 'news_banner' && <NewsBannerEditor data={newsBanner} onChange={setNewsBanner} imageLib={imageLibrary} />}
                  {activeNav.page === 'news_company' && <NewsListEditor newsList={newsList} onChange={setNewsList} imageLib={imageLibrary} defaultCategory="company" categoryLabel="公司要闻" />}
                  {activeNav.page === 'news_enterprise' && <NewsListEditor newsList={newsList} onChange={setNewsList} imageLib={imageLibrary} defaultCategory="enterprise" categoryLabel="企业新闻" />}
                  {activeNav.page === 'news_project' && <NewsListEditor newsList={newsList} onChange={setNewsList} imageLib={imageLibrary} defaultCategory="project" categoryLabel="项目动态" />}
                  {activeNav.page === 'news_industry' && <NewsListEditor newsList={newsList} onChange={setNewsList} imageLib={imageLibrary} defaultCategory="industry" categoryLabel="行业信息" />}
                </>
              )}

              {/* 业务领域 */}
              {activeNav.category === 'business' && (
                <>
                  {activeNav.page === 'biz_banner' && <BusinessBannerEditor data={businessBanner} onChange={setBusinessBanner} companyInfo={companyInfo} />}
                  {activeNav.page === 'biz_engineering' && (
                    <BusinessEngineeringEditor 
                      categories={engineeringCategories} 
                      onCategoriesChange={setEngineeringCategories}
                      projects={engineeringProjects}
                      onProjectsChange={setEngineeringProjects}
                      imageLib={imageLibrary}
                    />
                  )}
                  {activeNav.page === 'biz_project' && <BusinessProjectEditor />}
                  {activeNav.page === 'biz_industry' && <BusinessIndustryEditor data={businessIndustry} onChange={setBusinessIndustry} imageLib={imageLibrary} />}
                  {activeNav.page === 'biz_trade' && <BusinessTradeEditor data={businessTrade} onChange={setBusinessTrade} imageLib={imageLibrary} />}
                </>
              )}

              {/* 品牌文化 */}
              {activeNav.category === 'culture' && (
                <>
                  {activeNav.page === 'culture_banner' && <ModuleBannerEditor title="品牌文化 Banner 设置" description="此处的配置将应用于所有「品牌文化」下的子页面，保持视觉统一。" data={cultureBanner} onChange={setCultureBanner} imageLib={imageLibrary} />}
                  {activeNav.page === 'culture_company' && <CultureCompanyEditor data={cultureData.company || {}} onChange={(data) => setCultureData({...cultureData, company: data})} imageLib={imageLibrary} newsList={newsList} />}
                  {activeNav.page === 'culture_brand' && <BrandImageEditor data={cultureData.brand || {}} onChange={(data) => setCultureData({...cultureData, brand: data})} imageLib={imageLibrary} />}
                </>
              )}

              {/* 党建领航 */}
              {activeNav.category === 'party' && (
                <>
                  {activeNav.page === 'party_banner' && <ModuleBannerEditor title="党建领航 Banner 设置" description="此处的配置将应用于所有「党建领航」下的子页面，保持视觉统一。" data={partyBanner} onChange={setPartyBanner} imageLib={imageLibrary} />}
                  {activeNav.page === 'party_building' && <PartyBuildingEditor imageLib={imageLibrary} />}
                  {activeNav.page === 'party_integrity' && <PartyIntegrityEditor />}
                  {activeNav.page === 'party_youth' && <PartyYouthEditor imageLib={imageLibrary} bannerData={partyYouthBanner} onBannerChange={setPartyYouthBanner} />}
                  {activeNav.page === 'party_workers' && <PartyWorkersEditor />}
                </>
              )}

              {/* 人力资源 */}
              {activeNav.category === 'hr' && (
                <>
                  {activeNav.page === 'hr_banner' && <ModuleBannerEditor title="人力资源 Banner 设置" description="此处的配置将应用于所有「人力资源」下的子页面，保持视觉统一。" data={hrBanner} onChange={setHRBanner} imageLib={imageLibrary} />}
                  {activeNav.page === 'hr_strategy' && <HREditor data={hrLibrary.find(h => h.type === 'strategy') || {}} onChange={(data) => {
                    const existing = hrLibrary.find(h => h.type === 'strategy');
                    if (existing) {
                      setHRLibrary(hrLibrary.map(h => h.type === 'strategy' ? { ...existing, ...data } : h));
                    } else {
                      setHRLibrary([...hrLibrary, { ...data, type: 'strategy', id: `hr_${Date.now()}` }]);
                    }
                  }} type="strategy" imageLib={imageLibrary} companyInfo={companyInfo} />}
                  {activeNav.page === 'hr_team' && <HREditor data={hrLibrary.find(h => h.type === 'team') || {}} onChange={(data) => {
                    const existing = hrLibrary.find(h => h.type === 'team');
                    if (existing) {
                      setHRLibrary(hrLibrary.map(h => h.type === 'team' ? { ...existing, ...data } : h));
                    } else {
                      setHRLibrary([...hrLibrary, { ...data, type: 'team', id: `hr_${Date.now()}` }]);
                    }
                  }} type="team" imageLib={imageLibrary} companyInfo={companyInfo} />}
                  {activeNav.page === 'hr_recruit' && <HRRecruitEditor recruits={recruits} onChange={setRecruits} />}
                </>
              )}

              {/* 企业公开 */}
              {activeNav.category === 'public' && (
                <>
                  {activeNav.page === 'public_banner' && <ModuleBannerEditor title="企业公开 Banner 设置" description="此处的配置将应用于所有「企业公开」下的子页面，保持视觉统一。" data={publicBanner} onChange={setPublicBanner} imageLib={imageLibrary} />}
                  {activeNav.page === 'public_info' && <PublicBasicEditor data={publicBasic} onChange={setPublicBasic} certLib={certLibrary} imageLib={imageLibrary} />}
                  {activeNav.page === 'public_subsidiary' && <PublicSubsidiaryEditor data={publicSubsidiary} onChange={setPublicSubsidiary} certLib={certLibrary} imageLib={imageLibrary} />}
                  {activeNav.page === 'public_management' && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <div className="w-32 h-32 bg-[#E6F1FF] rounded-full flex items-center justify-center mb-6 shadow-inner animate-pulse">
                        <Settings className="w-16 h-16 text-[#2B7FFF] opacity-50" />
                      </div>
                      <h2 className="text-2xl font-bold text-[#1C1F23] mb-2">经营管理重大事项</h2>
                      <p className="text-[#4B4F55] max-w-md mx-auto">此模块待定，先预留菜单与空状态页面。</p>
                    </div>
                  )}
                  {activeNav.page === 'public_contact' && <PublicContactEditor data={publicContact} onChange={setPublicContact} messages={messages} />}
                </>
              )}

              {/* 可持续发展 */}
              {activeNav.category === 'sustain' && (
                <>
                  {activeNav.page === 'sus_banner' && <ModuleBannerEditor title="可持续发展 Banner 设置" description="此处的配置将应用于所有「可持续发展」下的子页面，保持视觉统一。" data={sustainBanner} onChange={setSustainBanner} imageLib={imageLibrary} />}
                  {activeNav.page === 'sus_tech' && <SustainTechEditor data={sustainTech} onChange={setSustainTech} imageLib={imageLibrary} certLib={certLibrary} />}
                  {activeNav.page === 'sus_safety' && <SustainSafetyEditor data={sustainSafety} onChange={setSustainSafety} imageLib={imageLibrary} />}
                  {activeNav.page === 'sus_global' && <SustainGlobalEditor data={sustainGlobal} onChange={setSustainGlobal} imageLib={imageLibrary} />}
                  {activeNav.page === 'sus_responsibility' && <SustainResponsibilityEditor data={sustainResponsibility} onChange={setSustainResponsibility} imageLib={imageLibrary} certLib={certLibrary} />}
                  {activeNav.page === 'sus_esg' && <SustainESGEditor data={sustainEsg} onChange={setSustainEsg} imageLib={imageLibrary} />}
                </>
              )}

              {/* 用户权限管理 */}
              {activeNav.category === 'user_permission' && (
                <UserPermissionEditor />
              )}
           </div>
        </div>
      </div>

      {/* ==================== 全屏预览弹窗 ==================== */}
      <Modal 
        isOpen={showFullPreview} 
        onClose={() => setShowFullPreview(false)} 
        title="全屏预览"
        fullScreen={true}
      >
         <div className="max-w-7xl mx-auto bg-white min-h-screen shadow-sm my-8 rounded-lg overflow-hidden border border-[#E5E7EB]">
            <PreviewContent 
               activeNav={activeNav} 
               aboutBanner={aboutBanner}
               introData={introData}
               historyData={historyData}
               speechData={speechData}
               leadersData={leadersData}
               honorsData={honorsData}
               companyInfo={companyInfo}
               peopleLib={peopleLibrary}
               certLib={certLibrary}
            />
         </div>
      </Modal>

      {/* ==================== 未保存修改确认弹窗 ==================== */}
      <UnsavedChangesModal
        isOpen={showLeaveConfirm}
        onStay={cancelNavigation}
        onLeave={confirmNavigation}
      />
    </div>
  );
};

// ==========================================
// 主应用组件（包装 Provider）
// ==========================================
const App = () => {
  return (
    <UnsavedChangesProvider>
      <AppContent />
    </UnsavedChangesProvider>
  );
};

export default App;
