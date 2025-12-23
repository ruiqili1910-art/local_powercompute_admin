// ==========================================
// 初始数据与常量 (Constants)
// ==========================================

export const INITIAL_COMPANY_INFO = {
  foundingDate: "1964-10-01",
  areaSize: "304,030",
  globalStaff: "2,200+",
  completedProjects: "8,000+",
  patents: "7,100+",
  countries: "80+"
};

export const COMPANY_FIELD_LABELS = {
  foundingDate: "成立时间",
  areaSize: "占地面积",
  globalStaff: "全球员工",
  completedProjects: "建成项目",
  patents: "发明专利",
  countries: "业务覆盖国家/地区"
};

// 资质荣誉库数据（新格式：资质/荣誉 各有 数据展示/细节）
export const INITIAL_CERT_LIBRARY = {
  // 资质数据展示
  certStats: [
    { id: 'cert_stat_1', value: '9', unit: '个', label: '工程勘察综合甲级资质' },
    { id: 'cert_stat_2', value: '6', unit: '个', label: '工程设计综合甲级资质' },
    { id: 'cert_stat_3', value: '9', unit: '个', label: '工程设计行业甲级资质' },
    { id: 'cert_stat_4', value: '7', unit: '个', label: '工程化工施工总承包特级资质' },
    { id: 'cert_stat_5', value: '67', unit: '项', label: '石油化工施工总承包一级资质' },
  ],
  // 资质细节
  certDetails: [
    { id: 'cert_detail_1', title: '工程设计综合甲级资质', description: '具备工程设计综合甲级资质，可承担各行业建设工程项目的设计业务。', image: '' },
    { id: 'cert_detail_2', title: '工程勘查综合甲级资质', description: '具备工程勘查综合甲级资质，可承担各类工程的勘查业务。', image: '' },
  ],
  // 荣誉数据展示
  honorStats: [
    { id: 'honor_stat_1', value: '46', unit: '项', label: '中国建设工程鲁班奖' },
    { id: 'honor_stat_2', value: '129', unit: '项', label: '国家优质工程奖' },
    { id: 'honor_stat_3', value: '855', unit: '项', label: '工程总承包奖' },
  ],
  // 荣誉细节
  honorDetails: [
    { id: 'honor_detail_1', title: '中国建设工程鲁班奖', description: '中国建筑行业工程质量最高荣誉奖。', image: '' },
    { id: 'honor_detail_2', title: '国家优质工程奖', description: '国家级工程质量奖项。', image: '' },
  ]
};

// 图片分类配置
export const IMAGE_CATEGORIES = [
  { id: 'all', label: '全部图片' },
  { id: 'about', label: '关于我们' },
  { id: 'news', label: '新闻中心' },
  { id: 'business', label: '业务领域' },
  { id: 'culture', label: '品牌文化' },
  { id: 'party', label: '党建领航' },
  { id: 'hr', label: '人力资源' },
  { id: 'public', label: '企业公开' },
  { id: 'sustain', label: '可持续发展' },
  { id: 'other', label: '其他' },
];

export const INITIAL_IMAGE_LIBRARY = [
  { id: 'img1', title: "公司大楼全景.jpg", url: "bg-slate-700", category: "about" },
  { id: 'img2', title: "董事长肖像.jpg", url: "bg-gray-300", category: "about" },
  { id: 'img3', title: "施工现场_01.jpg", url: "bg-amber-700", category: "business" },
  { id: 'img4', title: "企业文化墙.jpg", url: "bg-blue-600", category: "culture" },
  { id: 'img5', title: "荣誉墙合影.jpg", url: "bg-red-800", category: "about" },
  { id: 'img6', title: "党建活动现场.jpg", url: "bg-red-600", category: "party" },
  { id: 'img7', title: "新闻发布会.jpg", url: "bg-indigo-500", category: "news" },
  { id: 'img8', title: "员工培训.jpg", url: "bg-teal-500", category: "hr" },
  { id: 'img9', title: "项目竣工庆典.jpg", url: "bg-emerald-600", category: "business" },
  { id: 'img10', title: "年度表彰大会.jpg", url: "bg-purple-600", category: "culture" },
  { id: 'img11', title: "安全生产宣传.jpg", url: "bg-orange-500", category: "sustain" },
  { id: 'img12', title: "技术创新成果.jpg", url: "bg-cyan-600", category: "sustain" },
  { id: 'img13', title: "企业公开日活动.jpg", url: "bg-rose-500", category: "public" },
  { id: 'img14', title: "校园招聘现场.jpg", url: "bg-lime-600", category: "hr" },
  { id: 'img15', title: "行业交流论坛.jpg", url: "bg-sky-500", category: "news" },
];

export const INITIAL_PEOPLE_LIBRARY = [
  { id: 'p1', name: "李建军", title: "董事长", photo: "bg-slate-400", bio: "现任第十四届全国人大代表，中国化学工程第七建设有限公司董事长、党委书记。长期从事化工工程建设管理工作，具有丰富的大型项目管理经验。" },
  { id: 'p2', name: "赵国庆", title: "总经理", photo: "bg-slate-500", bio: "曾主导多个国家级大型项目建设，在项目管理、技术创新等方面具有深厚造诣，推动公司业务持续健康发展。" },
  { id: 'p3', name: "王明华", title: "党委副书记", photo: "bg-slate-600", bio: "负责公司党建、纪检监察、工会等工作，长期从事企业党务管理，具有丰富的基层党建工作经验。" },
  { id: 'p4', name: "张伟东", title: "副总经理", photo: "bg-zinc-400", bio: "分管公司工程技术、质量安全等工作，高级工程师，曾获省部级科技进步奖多项。" },
  { id: 'p5', name: "刘晓燕", title: "总会计师", photo: "bg-zinc-500", bio: "负责公司财务管理、资金运营等工作，注册会计师，具有二十余年财务管理经验。" },
  { id: 'p6', name: "陈志强", title: "副总经理", photo: "bg-zinc-600", bio: "分管公司市场开发、国际业务等工作，曾主导多个海外大型项目，具有丰富的国际工程管理经验。" },
];

export const INITIAL_ABOUT_BANNER = {
  title: "关于我们",
  subtitle: "化学连接万物 化学改变生活",
  bgType: 'color', 
  bgValue: "bg-sky-900"
};

export const INITIAL_INTRO_DATA = {
  main: {
    title: "公司简介",
    content: "中国化学工程第七建设有限公司（简称\"七化建\"）成立于1964年，总部设在四川成都，是为建设中国第一套进口大化肥（泸天化）、解决中国老百姓穿衣吃饭而诞生，是国务院国资委管理的中国化学工程股份有限公司全资子公司，2010年1月随中国化学工程股份有限公司在上交所上市。公司按照\"一体两翼\"发展战略，主要从事工程总承包（投资、建造、运营）、实业和国际贸易等业务，是一家综合型国际公司。",
    image: null,
    statsMode: 'global',
    selectedGlobalKeys: ['foundingDate', 'patents', 'countries'],
    customStats: [ 
      { label: "1968年", value: "七化建始建于" },
      { label: "7100+项", value: "获得国家授权专利" },
      { label: "80+个", value: "业务遍布全球80多个国家和地区" }
    ]
  }
};

export const INITIAL_HISTORY_DATA = {
  timeline: [
    { id: 1, year: "1968", title: "七化建始建于", desc: "为建设中国第一套进口大化肥（泸天化）而诞生", img: null },
    { id: 2, year: "2010", title: "上市成功", desc: "随中国化学工程股份有限公司在上交所上市，开启资本运作新篇章", img: null },
    { id: 3, year: "2023", title: "数字化转型", desc: "发布数字化转型战略，推进企业高质量发展", img: null },
  ]
};

export const INITIAL_SPEECH_DATA = {
  speakerId: 'p1',
  customImage: null,
  content: {
    title: "肩负推动国家化工事业发展的重任",
    body: "欢迎您浏览中国化学工程集团有限公司网站...",
  }
};

export const INITIAL_LEADERS_DATA = { leaderIds: ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'] };

export const INITIAL_HONORS_DATA = {
  statsConfig: {
    mode: 'global',
    selectedGlobalKeys: ['foundingDate', 'areaSize', 'globalStaff', 'completedProjects', 'patents'],
    customItems: [
      { label: "鲁班奖", value: "46项" },
      { label: "国优金奖", value: "12项" },
      { label: "专利总数", value: "150+" },
      { label: "研发投入", value: "5%" },
      { label: "行业排名", value: "TOP 10" }
    ]
  },
  qualifications: { title: "公司资质", certIds: ['c1', 'c2'] },
  honors: { title: "企业荣誉", certIds: ['c3', 'c4'] }
};

// 首页管理初始数据
export const INITIAL_HOME_VISION = {
  title: "工程领域综合解决方案服务商",
  subtitle: "Building a world-class enterprise with high-quality development",
  description: "我们的愿景",
  bgImage: null,
  learnMoreLink: "/about",
  contactLink: "/public-contact",
  enabled: true
};

export const INITIAL_HOME_NEWS = {
  title: "最新动态",
  count: 6,
  categories: ['company-news', 'enterprise-news', 'project-dynamic'],
  enabled: true
};

export const INITIAL_HOME_ABOUT = {
  title: "关于我们",
  description: "中国化学工程第七建设有限公司（简称\"七化建\"）成立于1964年，总部设在四川成都，是为建设中国第一套进口大化肥（泸天化）、解决中国老百姓穿衣吃饭而诞生，是国务院国资委管理的中国化学工程股份有限公司全资子公司，2010年1月随中国化学工程股份有限公司在上交所上市。公司按照\"一体两翼\"发展战略，主要从事工程总承包（投资、建造、运营）、实业和国际贸易等业务，是一家综合型国际公司。",
  quickLinks: {
    history: "/about-history",
    culture: "/brand-culture",
    speech: "/about-speech",
    honors: "/about-honors"
  },
  enabled: true
};

export const INITIAL_HOME_STAFF = {
  title: "员工风采",
  count: 8,
  enabled: true
};

export const INITIAL_HOME_PARTNER = {
  title: "我们的合作伙伴",
  count: 12,
  enabled: true
};

// ==========================================
// 新闻中心数据
// ==========================================

// 新闻分类配置
export const NEWS_CATEGORIES = [
  { id: "company", label: "公司要闻", color: "bg-blue-100 text-blue-700" },
  { id: "enterprise", label: "企业新闻", color: "bg-purple-100 text-purple-700" },
  { id: "project", label: "项目动态", color: "bg-orange-100 text-orange-700" },
  { id: "industry", label: "行业信息", color: "bg-cyan-100 text-cyan-700" },
];

// 新闻状态配置
export const NEWS_STATUS = [
  { id: "all", label: "全部" },
  { id: "published", label: "已发布", color: "bg-green-50 text-green-600" },
  { id: "draft", label: "草稿", color: "bg-yellow-50 text-yellow-600" },
];

// 展示位置配置
export const DISPLAY_POSITIONS = [
  { 
    id: "bigImage", 
    label: "大图推荐", 
    badge: "大图",
    tooltip: "大图推荐 将在栏目顶部以通栏大图形式展示。\n建议封面尺寸：1920×600px，请务必保证清晰度。",
    icon: "LayoutGrid", 
    max: 1, 
    desc: "最多1个" 
  },
  { 
    id: "smallImage", 
    label: "小图推荐", 
    badge: "小图",
    tooltip: "小图推荐 将在顶部右侧区域展示，位置显眼。\n建议封面尺寸：800×600px。",
    icon: "Image", 
    max: 1, 
    desc: "最多1个" 
  },
  { 
    id: "textRecommend", 
    label: "文字置顶", 
    badge: "置顶",
    tooltip: "文字置顶 仅展示标题，不显示封面图，位置固定在列表顶部。\n适用于重要公告或无配图的紧急新闻。",
    icon: "FileText", 
    max: 3, 
    desc: "最多3个" 
  },
  { 
    id: "normal", 
    label: "图文列表", 
    badge: "列表",
    tooltip: "标准列表默认的左图右文展示样式。\n建议封面尺寸：4:3 或 16:9 比例。",
    icon: "List", 
    max: null, 
    desc: "不限数目" 
  },
  { 
    id: "featuredList", 
    label: "图文置顶", 
    badge: "首推",
    tooltip: "首条推荐列表第一条，采用大图+详细摘要的强调样式。\n用于突出本栏目最新、最重要的一条动态。",
    icon: "Star", 
    max: 1, 
    desc: "最多1个" 
  },
  { 
    id: "cardGrid", 
    label: "卡片列表", 
    badge: "卡片",
    tooltip: "卡片展示以纯文字卡片矩阵形式展示，不显示封面图。\n适用于批量展示短新闻或政策文件。",
    icon: "Grid", 
    max: null, 
    desc: "不限数目" 
  },
];

// 新闻列表初始数据 - 每个分类15条，共60条
export const INITIAL_NEWS_LIST = [
  // ==================== 公司要闻 (company) - 15条 ====================
  // 大图推荐 1个
  { id: 101, title: "公司荣获\"2025年度科技创新领军企业\"称号", summary: "在刚刚结束的全国化工行业峰会上，我司凭借多项核心技术突破荣获科技创新领军企业称号。", category: "company", cover: "bg-gradient-to-br from-blue-500 to-indigo-600", publishTime: "2025/12/08 09:00:00", updateTime: "2025/12/08 09:00:00", status: "published", author: "管理员", displayPosition: "bigImage" },
  // 小图推荐 1个
  { id: 102, title: "董事长出席国际化工论坛并发表主旨演讲", summary: "12月5日，公司董事长应邀出席第十届国际化工产业发展论坛，分享绿色转型经验。", category: "company", cover: "bg-gradient-to-br from-purple-500 to-pink-600", publishTime: "2025/12/05 14:30:00", updateTime: "2025/12/06 10:15:00", status: "published", hasUnsyncedChanges: true, author: "公司办公室", displayPosition: "smallImage" },
  // 文字推荐 3个
  { id: 103, title: "【重要通知】关于2025年度总结表彰大会的安排", summary: "经公司研究决定，2025年度总结表彰大会定于12月28日召开，请各单位做好准备。", category: "company", cover: "", publishTime: "2025/12/04 16:00:00", updateTime: "2025/12/04 16:00:00", status: "published", author: "管理员", displayPosition: "textRecommend" },
  { id: 104, title: "【公告】公司获批设立博士后科研工作站", summary: "近日，公司正式获批设立博士后科研工作站，将进一步提升技术研发能力。", category: "company", cover: "", publishTime: "2025/12/03 10:00:00", updateTime: "2025/12/03 10:00:00", status: "published", author: "人力资源部", displayPosition: "textRecommend" },
  { id: 105, title: "【通知】关于元旦放假安排的通知", summary: "根据国家法定节假日安排，现将2026年元旦放假安排通知如下。", category: "company", cover: "", publishTime: "2025/12/02 09:00:00", updateTime: "2025/12/02 09:00:00", status: "draft", author: "综合办公室", displayPosition: "textRecommend" },
  // 列表 10个
  { id: 106, title: "公司召开2025年度战略发展研讨会", summary: "为进一步明确发展方向，公司召开战略发展研讨会，各部门负责人参加会议。", category: "company", cover: "bg-gradient-to-br from-cyan-400 to-cyan-600", publishTime: "2025/12/01 10:00:00", updateTime: "2025/12/01 10:00:00", status: "published", author: "管理员", displayPosition: "normal" },
  { id: 107, title: "公司与某知名高校签署战略合作协议", summary: "11月28日，公司与某知名高校签署产学研战略合作协议，共同推进技术创新。", category: "company", cover: "bg-gradient-to-br from-green-400 to-emerald-600", publishTime: "2025/11/28 15:00:00", updateTime: "2025/11/29 08:00:00", status: "published", hasUnsyncedChanges: true, author: "科技发展部", displayPosition: "normal" },
  { id: 108, title: "公司成功中标某大型石化项目EPC总承包", summary: "近日，公司成功中标某大型石化项目EPC总承包合同，合同金额超50亿元。", category: "company", cover: "bg-gradient-to-br from-orange-400 to-red-500", publishTime: "2025/11/25 11:00:00", updateTime: "2025/11/25 11:00:00", status: "published", author: "市场营销部", displayPosition: "normal" },
  { id: 109, title: "公司安全生产连续1000天无事故", summary: "截至11月20日，公司实现安全生产连续1000天无事故，创历史最好成绩。", category: "company", cover: "", publishTime: "2025/11/20 09:00:00", updateTime: "2025/11/20 09:00:00", status: "published", author: "安全环保部", displayPosition: "normal" },
  { id: 110, title: "公司党委召开主题教育总结会议", summary: "11月18日，公司党委召开主题教育总结会议，全面总结学习成果。", category: "company", cover: "bg-gradient-to-br from-red-500 to-rose-600", publishTime: "2025/11/18 14:00:00", updateTime: "2025/11/18 14:00:00", status: "draft", author: "党群工作部", displayPosition: "normal" },
  { id: 111, title: "公司荣获省级\"绿色工厂\"称号", summary: "近日，公司被省工信厅认定为省级\"绿色工厂\"，标志着绿色发展迈上新台阶。", category: "company", cover: "bg-gradient-to-br from-teal-400 to-green-600", publishTime: "2025/11/15 10:00:00", updateTime: "2025/11/16 09:00:00", status: "published", hasUnsyncedChanges: true, author: "管理员", displayPosition: "normal" },
  { id: 112, title: "公司代表团赴欧洲考察新能源技术", summary: "11月10日至15日，公司代表团赴欧洲考察学习先进新能源技术和管理经验。", category: "company", cover: "bg-gradient-to-br from-sky-400 to-blue-600", publishTime: "2025/11/10 08:00:00", updateTime: "2025/11/10 08:00:00", status: "published", author: "国际合作部", displayPosition: "normal" },
  { id: 113, title: "公司三季度经营业绩创历史新高", summary: "公司发布三季度经营数据，各项指标均创历史同期最好水平。", category: "company", cover: "", publishTime: "2025/11/05 16:00:00", updateTime: "2025/11/05 16:00:00", status: "draft", author: "财务管理部", displayPosition: "normal" },
  { id: 114, title: "公司新研发中心正式启用", summary: "11月1日，公司新研发中心正式启用，将大幅提升科研创新能力。", category: "company", cover: "bg-gradient-to-br from-violet-400 to-purple-600", publishTime: "2025/11/01 10:00:00", updateTime: "2025/11/01 10:00:00", status: "published", author: "科技发展部", displayPosition: "normal" },
  { id: 115, title: "公司入选国家级专精特新\"小巨人\"企业", summary: "近日，公司成功入选第五批国家级专精特新\"小巨人\"企业名单。", category: "company", cover: "bg-gradient-to-br from-amber-400 to-orange-500", publishTime: "2025/10/28 09:00:00", updateTime: "2025/10/28 09:00:00", status: "draft", author: "管理员", displayPosition: "normal" },
  { id: 116, title: "公司新产品发布会因故延期", summary: "原定于12月15日举行的新产品发布会因故延期，具体时间另行通知。", category: "company", cover: "bg-gradient-to-br from-gray-400 to-gray-600", publishTime: "2025/12/10 10:00:00", updateTime: "2025/12/10 10:00:00", status: "draft", author: "市场部", displayPosition: "normal" },

  // ==================== 企业新闻 (enterprise) - 15条 ====================
  // 大图推荐 1个
  { id: 201, title: "公司年度工作会议圆满召开", summary: "12月6日，公司召开2025年度工作会议，总结成绩、部署任务，全体员工士气高涨。", category: "enterprise", cover: "bg-gradient-to-br from-indigo-500 to-blue-600", publishTime: "2025/12/06 09:00:00", updateTime: "2025/12/06 09:00:00", status: "published", author: "企业文化部", displayPosition: "bigImage" },
  // 小图推荐 1个
  { id: 202, title: "员工技能大赛圆满落幕，32人获奖", summary: "经过为期一周的激烈角逐，2025年度员工技能大赛圆满结束，共有32名选手获奖。", category: "enterprise", cover: "bg-gradient-to-br from-emerald-500 to-teal-600", publishTime: "2025/12/03 15:30:00", updateTime: "2025/12/04 08:00:00", status: "published", hasUnsyncedChanges: true, author: "人力资源部", displayPosition: "smallImage" },
  // 文字推荐 3个
  { id: 203, title: "【喜报】公司5名员工获评省级劳动模范", summary: "在省总工会组织的评选中，公司5名优秀员工荣获省级劳动模范称号。", category: "enterprise", cover: "", publishTime: "2025/12/01 10:00:00", updateTime: "2025/12/01 10:00:00", status: "published", author: "工会", displayPosition: "textRecommend" },
  { id: 204, title: "【通知】关于开展冬季送温暖活动的通知", summary: "为关爱困难职工，公司工会决定开展2025年冬季送温暖活动。", category: "enterprise", cover: "", publishTime: "2025/11/28 09:00:00", updateTime: "2025/11/28 09:00:00", status: "published", author: "工会", displayPosition: "textRecommend" },
  { id: 205, title: "【公示】2025年度优秀员工评选结果公示", summary: "经各单位推荐、公司评审，现将2025年度优秀员工评选结果予以公示。", category: "enterprise", cover: "", publishTime: "2025/11/25 14:00:00", updateTime: "2025/11/25 14:00:00", status: "draft", author: "人力资源部", displayPosition: "textRecommend" },
  // 列表 10个
  { id: 206, title: "新员工入职培训顺利完成", summary: "为期两周的新员工入职培训于11月22日顺利结束，50名新同事正式加入公司。", category: "enterprise", cover: "bg-gradient-to-br from-pink-400 to-rose-500", publishTime: "2025/11/22 17:00:00", updateTime: "2025/11/22 17:00:00", status: "published", author: "人力资源部", displayPosition: "normal" },
  { id: 207, title: "公司举办\"读书月\"系列活动", summary: "11月读书月期间，公司举办了读书分享会、知识竞赛等系列活动，营造学习氛围。", category: "enterprise", cover: "bg-gradient-to-br from-yellow-400 to-amber-500", publishTime: "2025/11/20 10:00:00", updateTime: "2025/11/21 09:00:00", status: "published", hasUnsyncedChanges: true, author: "企业文化部", displayPosition: "normal" },
  { id: 208, title: "公司志愿者参与社区公益活动", summary: "11月18日，公司30名志愿者参与社区环境整治公益活动，展现企业社会责任。", category: "enterprise", cover: "bg-gradient-to-br from-lime-400 to-green-500", publishTime: "2025/11/18 16:00:00", updateTime: "2025/11/18 16:00:00", status: "published", author: "党群工作部", displayPosition: "normal" },
  { id: 209, title: "公司篮球队获集团联赛冠军", summary: "在刚刚结束的集团公司篮球联赛中，我司代表队勇夺冠军。", category: "enterprise", cover: "bg-gradient-to-br from-orange-400 to-red-500", publishTime: "2025/11/15 18:00:00", updateTime: "2025/11/15 18:00:00", status: "draft", author: "工会", displayPosition: "normal" },
  { id: 210, title: "公司举办消防安全演练活动", summary: "11月9日消防日，公司组织全体员工开展消防安全演练，提升安全意识。", category: "enterprise", cover: "", publishTime: "2025/11/09 14:00:00", updateTime: "2025/11/09 14:00:00", status: "published", author: "安全环保部", displayPosition: "normal" },
  { id: 211, title: "员工子女\"六一\"活动圆满举办", summary: "公司工会组织的员工子女\"六一\"亲子活动圆满结束，100余个家庭参与。", category: "enterprise", cover: "bg-gradient-to-br from-cyan-400 to-sky-500", publishTime: "2025/11/05 10:00:00", updateTime: "2025/11/06 08:00:00", status: "published", hasUnsyncedChanges: true, author: "工会", displayPosition: "normal" },
  { id: 212, title: "公司开展\"金秋助学\"捐赠活动", summary: "公司向对口帮扶学校捐赠教学设备和学习用品，助力乡村教育发展。", category: "enterprise", cover: "bg-gradient-to-br from-red-400 to-pink-500", publishTime: "2025/11/01 09:00:00", updateTime: "2025/11/01 09:00:00", status: "published", author: "党群工作部", displayPosition: "normal" },
  { id: 213, title: "公司女工委开展健康知识讲座", summary: "10月28日，公司女工委邀请专家开展女性健康知识讲座，200余人参加。", category: "enterprise", cover: "", publishTime: "2025/10/28 15:00:00", updateTime: "2025/10/28 15:00:00", status: "draft", author: "工会", displayPosition: "normal" },
  { id: 214, title: "青年员工创新创效大赛启动", summary: "为激发青年员工创新活力，公司团委启动2025年青年创新创效大赛。", category: "enterprise", cover: "bg-gradient-to-br from-violet-400 to-indigo-500", publishTime: "2025/10/25 10:00:00", updateTime: "2025/10/25 10:00:00", status: "published", author: "团委", displayPosition: "normal" },
  { id: 215, title: "公司举办重阳节敬老活动", summary: "重阳节期间，公司组织慰问退休老同志，传承尊老敬老传统美德。", category: "enterprise", cover: "bg-gradient-to-br from-amber-400 to-yellow-500", publishTime: "2025/10/20 11:00:00", updateTime: "2025/10/20 11:00:00", status: "draft", author: "工会", displayPosition: "normal" },

  // ==================== 项目动态 (project) - 15条 ====================
  // 图文置顶 1个
  { id: 301, title: "智慧园区项目二期正式启动建设", summary: "12月5日，智慧园区项目二期建设正式启动，项目总投资15亿元，建设周期18个月。", category: "project", cover: "bg-gradient-to-br from-blue-500 to-cyan-600", publishTime: "2025/12/05 09:30:00", updateTime: "2025/12/06 14:20:00", status: "published", hasUnsyncedChanges: true, author: "项目管理部", displayPosition: "featuredList" },
  // 列表 14个
  { id: 302, title: "新能源基地建设项目完成主体结构封顶", summary: "截至目前，新能源基地建设项目已完成主体结构封顶，预计明年6月试运行。", category: "project", cover: "bg-gradient-to-br from-green-500 to-emerald-600", publishTime: "2025/12/03 11:00:00", updateTime: "2025/12/03 11:00:00", status: "published", author: "工程管理部", displayPosition: "normal" },
  { id: 303, title: "海外EPC项目提前30天完工交付", summary: "经过18个月紧张施工，海外某大型化工EPC项目顺利竣工并提前交付，获业主好评。", category: "project", cover: "bg-gradient-to-br from-orange-500 to-red-600", publishTime: "2025/12/01 16:00:00", updateTime: "2025/12/01 16:00:00", status: "published", author: "国际业务部", displayPosition: "normal" },
  { id: 304, title: "某炼化一体化项目进入设备安装阶段", summary: "某炼化一体化项目土建工程全部完成，正式进入核心设备安装调试阶段。", category: "project", cover: "bg-gradient-to-br from-purple-500 to-violet-600", publishTime: "2025/11/28 10:00:00", updateTime: "2025/11/29 08:00:00", status: "published", hasUnsyncedChanges: true, author: "工程管理部", displayPosition: "normal" },
  { id: 305, title: "环保升级改造项目顺利通过验收", summary: "11月25日，公司环保升级改造项目顺利通过专家组验收，各项指标优于设计要求。", category: "project", cover: "", publishTime: "2025/11/25 15:00:00", updateTime: "2025/11/25 15:00:00", status: "published", author: "安全环保部", displayPosition: "normal" },
  { id: 306, title: "数字化转型项目一期上线运行", summary: "公司数字化转型项目一期正式上线，实现生产运营数据实时监控和智能分析。", category: "project", cover: "bg-gradient-to-br from-sky-500 to-blue-600", publishTime: "2025/11/22 09:00:00", updateTime: "2025/11/22 09:00:00", status: "draft", author: "信息中心", displayPosition: "normal" },
  { id: 307, title: "储能电站项目完成并网发电", summary: "公司投资建设的100MW储能电站项目完成并网发电，年发电量预计达2亿度。", category: "project", cover: "bg-gradient-to-br from-yellow-500 to-amber-600", publishTime: "2025/11/20 14:00:00", updateTime: "2025/11/21 10:00:00", status: "published", hasUnsyncedChanges: true, author: "新能源事业部", displayPosition: "normal" },
  { id: 308, title: "某海外石化项目开工建设", summary: "11月18日，公司在某国承建的石化项目举行开工仪式，标志着国际化战略迈出新步伐。", category: "project", cover: "bg-gradient-to-br from-teal-500 to-cyan-600", publishTime: "2025/11/18 10:00:00", updateTime: "2025/11/18 10:00:00", status: "published", author: "国际业务部", displayPosition: "normal" },
  { id: 309, title: "技术研发中心改扩建项目竣工", summary: "历时8个月建设，公司技术研发中心改扩建项目正式竣工，研发面积扩大一倍。", category: "project", cover: "", publishTime: "2025/11/15 11:00:00", updateTime: "2025/11/15 11:00:00", status: "draft", author: "基建部", displayPosition: "normal" },
  { id: 310, title: "氢能示范项目通过中期评估", summary: "公司承担的国家氢能示范项目顺利通过中期评估，各项技术指标达到预期目标。", category: "project", cover: "bg-gradient-to-br from-lime-500 to-green-600", publishTime: "2025/11/12 09:00:00", updateTime: "2025/11/12 09:00:00", status: "published", author: "科技发展部", displayPosition: "normal" },
  { id: 311, title: "智能仓储物流项目投入使用", summary: "公司智能仓储物流项目正式投入使用，物流效率提升40%，仓储成本降低25%。", category: "project", cover: "bg-gradient-to-br from-indigo-500 to-purple-600", publishTime: "2025/11/08 14:00:00", updateTime: "2025/11/09 09:00:00", status: "published", hasUnsyncedChanges: true, author: "物资供应部", displayPosition: "normal" },
  { id: 312, title: "碳捕集利用项目进入试运行", summary: "公司自主研发的碳捕集利用项目进入试运行阶段，年碳捕集能力达10万吨。", category: "project", cover: "bg-gradient-to-br from-emerald-500 to-teal-600", publishTime: "2025/11/05 10:00:00", updateTime: "2025/11/05 10:00:00", status: "published", author: "安全环保部", displayPosition: "normal" },
  { id: 313, title: "某精细化工项目完成设计审查", summary: "某精细化工新建项目完成初步设计审查，即将进入施工图设计阶段。", category: "project", cover: "", publishTime: "2025/11/01 15:00:00", updateTime: "2025/11/01 15:00:00", status: "draft", author: "工程设计院", displayPosition: "normal" },
  { id: 314, title: "光伏发电项目实现全容量并网", summary: "公司屋顶分布式光伏发电项目实现全容量并网，装机容量达50MW。", category: "project", cover: "bg-gradient-to-br from-rose-500 to-pink-600", publishTime: "2025/10/28 09:00:00", updateTime: "2025/10/28 09:00:00", status: "published", author: "新能源事业部", displayPosition: "normal" },
  { id: 315, title: "污水深度处理项目开工建设", summary: "为进一步提升环保水平，公司污水深度处理项目正式开工建设，预计明年建成。", category: "project", cover: "bg-gradient-to-br from-cyan-500 to-sky-600", publishTime: "2025/10/25 11:00:00", updateTime: "2025/10/25 11:00:00", status: "draft", author: "安全环保部", displayPosition: "normal" },

  // ==================== 行业信息 (industry) - 15条 ====================
  // 全部为卡片列表
  { id: 401, title: "2025年化工行业发展趋势分析报告发布", summary: "化工行业在新能源转型背景下面临新的机遇与挑战，绿色化工将成为未来发展主旋律。", category: "industry", cover: "", publishTime: "2025/12/08 10:00:00", updateTime: "2025/12/08 10:00:00", status: "published", author: "行业研究室", displayPosition: "cardGrid" },
  { id: 402, title: "国家发改委发布化工产业政策解读", summary: "近日，国家发改委发布最新化工产业政策，明确支持绿色化工和高端材料发展。", category: "industry", cover: "", publishTime: "2025/12/05 14:00:00", updateTime: "2025/12/06 09:30:00", status: "published", hasUnsyncedChanges: true, author: "政策研究室", displayPosition: "cardGrid" },
  { id: 403, title: "全球能源转型趋势与化工行业机遇", summary: "随着全球能源转型加速，化工行业迎来新材料、新能源、新工艺等多重发展机遇。", category: "industry", cover: "", publishTime: "2025/12/03 11:30:00", updateTime: "2025/12/03 11:30:00", status: "published", author: "市场研究部", displayPosition: "cardGrid" },
  { id: 404, title: "碳中和目标下的化工产业转型路径", summary: "面向2060碳中和目标，化工产业需要在原料替代、工艺优化、能效提升等方面发力。", category: "industry", cover: "", publishTime: "2025/12/01 09:00:00", updateTime: "2025/12/01 09:00:00", status: "draft", author: "战略规划部", displayPosition: "cardGrid" },
  { id: 405, title: "新材料领域投资热点与市场前景", summary: "新材料作为战略性新兴产业，正吸引大量资本关注，市场规模有望五年内翻番。", category: "industry", cover: "", publishTime: "2025/11/28 15:00:00", updateTime: "2025/11/28 15:00:00", status: "published", author: "投资研究部", displayPosition: "cardGrid" },
  { id: 406, title: "氢能产业链发展现状与投资机会", summary: "氢能作为清洁能源重要组成部分，产业链各环节正迎来快速发展期。", category: "industry", cover: "", publishTime: "2025/11/25 10:00:00", updateTime: "2025/11/26 08:00:00", status: "published", hasUnsyncedChanges: true, author: "行业研究室", displayPosition: "cardGrid" },
  { id: 407, title: "精细化工行业2025年市场分析", summary: "精细化工行业在电子、医药、农业等领域需求旺盛，市场规模持续扩大。", category: "industry", cover: "", publishTime: "2025/11/22 14:00:00", updateTime: "2025/11/22 14:00:00", status: "published", author: "市场研究部", displayPosition: "cardGrid" },
  { id: 408, title: "石化行业数字化转型趋势与实践", summary: "数字化转型成为石化行业提质增效的重要抓手，智能工厂建设加速推进。", category: "industry", cover: "", publishTime: "2025/11/20 09:00:00", updateTime: "2025/11/20 09:00:00", status: "draft", author: "信息化研究室", displayPosition: "cardGrid" },
  { id: 409, title: "化工园区安全环保新规政策解读", summary: "新版化工园区安全环保管理规定出台，对企业合规经营提出更高要求。", category: "industry", cover: "", publishTime: "2025/11/18 11:00:00", updateTime: "2025/11/19 10:00:00", status: "published", hasUnsyncedChanges: true, author: "政策研究室", displayPosition: "cardGrid" },
  { id: 410, title: "可降解塑料产业发展前景展望", summary: "随着\"禁塑令\"推进，可降解塑料市场需求爆发，产业迎来黄金发展期。", category: "industry", cover: "", publishTime: "2025/11/15 15:00:00", updateTime: "2025/11/15 15:00:00", status: "published", author: "行业研究室", displayPosition: "cardGrid" },
  { id: 411, title: "锂电池材料行业竞争格局分析", summary: "新能源汽车快速发展带动锂电池材料需求，行业竞争格局正在重塑。", category: "industry", cover: "", publishTime: "2025/11/12 10:00:00", updateTime: "2025/11/12 10:00:00", status: "draft", author: "市场研究部", displayPosition: "cardGrid" },
  { id: 412, title: "化工物流行业发展趋势研究", summary: "化工物流专业化、智能化趋势明显，安全管理和信息化建设成为重点。", category: "industry", cover: "", publishTime: "2025/11/08 14:00:00", updateTime: "2025/11/08 14:00:00", status: "published", author: "物流研究室", displayPosition: "cardGrid" },
  { id: 413, title: "国际油价波动对化工行业影响分析", summary: "近期国际油价波动加剧，对化工行业成本和盈利带来一定影响。", category: "industry", cover: "", publishTime: "2025/11/05 09:00:00", updateTime: "2025/11/06 08:00:00", status: "published", hasUnsyncedChanges: true, author: "市场研究部", displayPosition: "cardGrid" },
  { id: 414, title: "生物基化学品发展现状与趋势", summary: "生物基化学品作为传统石化产品的绿色替代，正受到越来越多关注。", category: "industry", cover: "", publishTime: "2025/11/01 11:00:00", updateTime: "2025/11/01 11:00:00", status: "published", author: "行业研究室", displayPosition: "cardGrid" },
  { id: 415, title: "化工行业人才需求与培养趋势", summary: "化工行业转型升级对人才提出新要求，复合型、创新型人才需求旺盛。", category: "industry", cover: "", publishTime: "2025/10/28 10:00:00", updateTime: "2025/10/28 10:00:00", status: "draft", author: "人才研究室", displayPosition: "cardGrid" },
];

// 新闻Banner配置
export const INITIAL_NEWS_BANNER = {
  title: "新闻中心",
  subtitle: "了解公司最新动态",
  bgType: "color",
  bgValue: "bg-indigo-900"
};

// 新闻中心初始数据（原文章数据，保留用于其他模块）
export const INITIAL_ARTICLES = [
  {
    id: 'article_1',
    title: '公司2025年中高层管理人员能力提升"远航计划"赋能培训圆满收官',
    category: 'company-news',
    cover: 'bg-blue-500',
    summary: '11月14日，公司2025年中高层管理人员能力提升"远航计划"赋能培训（2期）在华为全球培训中心顺利结业。',
    content: '11月14日，公司2025年中高层管理人员能力提升"远航计划"赋能培训（2期）在华为全球培训中心顺利结业。此次培训旨在提升中高层管理人员的综合管理能力和战略思维，为公司高质量发展提供人才保障。',
    author: '公司办公室',
    source: '公司内部',
    publishTime: '2025-11-14T10:00:00',
    status: 'published',
    sort: 100,
    isTop: true,
    createTime: '2025-11-14T10:00:00',
    updateTime: '2025-11-14T10:00:00'
  },
  {
    id: 'article_2',
    title: '天然气化工综合体UIO装置区49米高塔灯成功吊装并投入使用',
    category: 'project-dynamic',
    cover: 'bg-green-500',
    summary: '天然气化工综合体UIO装置区49米高塔灯成功吊装并投入使用',
    content: '近日，由我公司承建的天然气化工综合体UIO装置区49米高塔灯成功吊装并投入使用。该项目的顺利实施标志着公司在大型化工装置建设领域的技术实力进一步提升。',
    author: '项目部',
    source: '项目现场',
    publishTime: '2025-08-18T14:00:00',
    status: 'published',
    sort: 90,
    isTop: false,
    createTime: '2025-08-18T14:00:00',
    updateTime: '2025-08-18T14:00:00'
  },
  {
    id: 'article_3',
    title: '成都分公司旺苍嘉川停车场项目部开展消防应急疏散演练',
    category: 'enterprise-news',
    cover: 'bg-red-500',
    summary: '成都分公司旺苍嘉川停车场项目部开展消防应急疏散演练',
    content: '为提升项目现场安全管理水平，增强员工消防安全意识，成都分公司旺苍嘉川停车场项目部组织开展了消防应急疏散演练活动。演练过程规范有序，达到了预期效果。',
    author: '成都分公司',
    source: '分公司',
    publishTime: '2025-08-18T09:00:00',
    status: 'published',
    sort: 80,
    isTop: false,
    createTime: '2025-08-18T09:00:00',
    updateTime: '2025-08-18T09:00:00'
  },
  {
    id: 'article_4',
    title: '福建分公司到中建科工智能科技公司开展焊接机器人领域考察交流',
    category: 'enterprise-news',
    cover: 'bg-purple-500',
    summary: '福建分公司到中建科工智能科技公司开展焊接机器人领域考察交流',
    content: '为推进智能化施工技术应用，福建分公司组织技术团队到中建科工智能科技公司开展焊接机器人领域考察交流。双方就智能化焊接技术在工程建设中的应用进行了深入探讨。',
    author: '福建分公司',
    source: '分公司',
    publishTime: '2025-08-18T16:00:00',
    status: 'published',
    sort: 70,
    isTop: false,
    createTime: '2025-08-18T16:00:00',
    updateTime: '2025-08-18T16:00:00'
  },
  {
    id: 'article_5',
    title: '化工行业数字化转型趋势分析',
    category: 'industry-info',
    cover: 'bg-indigo-500',
    summary: '随着数字化技术的快速发展，化工行业正迎来数字化转型的关键时期。',
    content: '随着数字化技术的快速发展，化工行业正迎来数字化转型的关键时期。通过引入人工智能、大数据、物联网等先进技术，化工企业可以实现生产过程的智能化管理，提升生产效率和产品质量，降低运营成本。',
    author: '行业研究部',
    source: '行业分析',
    publishTime: '2025-09-01T10:00:00',
    status: 'published',
    sort: 60,
    isTop: false,
    createTime: '2025-09-01T10:00:00',
    updateTime: '2025-09-01T10:00:00'
  },
  {
    id: 'article_6',
    title: '绿色化工发展路径探索',
    category: 'industry-info',
    cover: 'bg-emerald-500',
    summary: '绿色化工是未来化工行业发展的重要方向，需要从技术创新、工艺优化、资源循环利用等多个维度推进。',
    content: '绿色化工是未来化工行业发展的重要方向，需要从技术创新、工艺优化、资源循环利用等多个维度推进。通过采用清洁生产技术、开发环保型产品、建立循环经济模式，可以实现经济效益与环境效益的双赢。',
    author: '技术研发中心',
    source: '行业研究',
    publishTime: '2025-09-15T14:00:00',
    status: 'published',
    sort: 50,
    isTop: false,
    createTime: '2025-09-15T14:00:00',
    updateTime: '2025-09-15T14:00:00'
  },
  {
    id: 'article_7',
    title: '加强党的建设，推动企业高质量发展',
    category: 'party-building',
    cover: 'bg-red-600',
    summary: '公司党委深入学习贯彻党的二十大精神，以高质量党建引领企业高质量发展。',
    content: '公司党委深入学习贯彻党的二十大精神，以高质量党建引领企业高质量发展。通过加强基层党组织建设、开展主题教育活动、推进党风廉政建设，不断提升党组织的凝聚力和战斗力，为企业改革发展提供坚强政治保证。',
    author: '党委办公室',
    source: '党建动态',
    publishTime: '2025-10-01T09:00:00',
    status: 'published',
    sort: 100,
    isTop: true,
    createTime: '2025-10-01T09:00:00',
    updateTime: '2025-10-01T09:00:00'
  },
  {
    id: 'article_8',
    title: '青年员工座谈会成功举办',
    category: 'youth-friend',
    cover: 'bg-blue-400',
    summary: '为倾听青年员工心声，促进青年成长成才，公司团委组织召开了青年员工座谈会。',
    content: '为倾听青年员工心声，促进青年成长成才，公司团委组织召开了青年员工座谈会。座谈会上，青年员工代表围绕职业发展、工作环境、学习培训等方面积极发言，提出了许多建设性意见和建议。公司领导认真听取了青年员工的发言，并表示将积极采纳合理建议，为青年员工创造更好的发展平台。',
    author: '团委',
    source: '青年之友',
    publishTime: '2025-10-10T15:00:00',
    status: 'published',
    sort: 90,
    isTop: false,
    createTime: '2025-10-10T15:00:00',
    updateTime: '2025-10-10T15:00:00'
  }
];

// 招聘信息初始数据 - 标题、内容、作者、附件
export const INITIAL_RECRUITS = [
  { 
    id: 'r_1', 
    title: '中国化学工程第七建设有限公司部分二级单位副职招聘公告', 
    summary: '中国化学工程集团有限公司（简称"中国化学"）是国务院国资委监管的大型中央企业集团...', 
    content: '<p>中国化学工程集团有限公司（简称"中国化学"）是国务院国资委监管的大型中央企业集团，是我国化工领域资质最齐全、功能最完备、业务链最完整、知识技术密集的国际工程公司，是石油和化学工业工程领域的国家队，是带动中国技术、中国标准和中国装备"走出去"，高质量共建"一带一路"的排头兵，在油气服务领域稳居全球第一。中国化学前身是成立于1953年的国家重工业部化学工业管理局，为解决全国人民"吃饭穿衣"问题应运而生，在国内外建设了7万多套化工装置，为新中国构建独立完整化学工业体系、促进经济社会发展、增进"一带一路"沿线国家人民福祉作出重要贡献。目前正在加快打造成为工业工程领域综合解决方案服务商、高端化学品和先进材料供应商，全面建设研发、投资、建造、运营一体化的世界一流企业。</p>', 
    cover: '', 
    author: '人力资源部', 
    category: 'recruit',
    displayPosition: null,
    hasUnsyncedChanges: false,
    attachment: {
      name: '招聘公告.pdf',
      url: '/files/recruit_1.pdf'
    },
    publishTime: '2024/12/01 10:00:00', 
    updateTime: '2024/12/01 10:00:00', 
    status: 'published'
  },
  { 
    id: 'r_2', 
    title: '中国化学工程第七建设有限公司技术研发中心高级工程师招聘公告', 
    summary: '中国化学工程集团有限公司（简称"中国化学"）是国务院国资委监管的大型中央企业集团...', 
    content: '<p>中国化学工程集团有限公司（简称"中国化学"）是国务院国资委监管的大型中央企业集团，是我国化工领域资质最齐全、功能最完备、业务链最完整、知识技术密集的国际工程公司，是石油和化学工业工程领域的国家队，是带动中国技术、中国标准和中国装备"走出去"，高质量共建"一带一路"的排头兵，在油气服务领域稳居全球第一。中国化学前身是成立于1953年的国家重工业部化学工业管理局，为解决全国人民"吃饭穿衣"问题应运而生，在国内外建设了7万多套化工装置，为新中国构建独立完整化学工业体系、促进经济社会发展、增进"一带一路"沿线国家人民福祉作出重要贡献。目前正在加快打造成为工业工程领域综合解决方案服务商、高端化学品和先进材料供应商，全面建设研发、投资、建造、运营一体化的世界一流企业。</p>', 
    cover: '', 
    author: '人力资源部', 
    category: 'recruit',
    displayPosition: null,
    hasUnsyncedChanges: false,
    attachment: {
      name: '技术研发中心招聘公告.pdf',
      url: '/files/recruit_2.pdf'
    },
    publishTime: '2024/12/02 14:30:00', 
    updateTime: '2024/12/02 14:30:00', 
    status: 'published'
  },
  { 
    id: 'r_3', 
    title: '中国化学工程第七建设有限公司工程项目管理部项目经理招聘公告', 
    summary: '中国化学工程集团有限公司（简称"中国化学"）是国务院国资委监管的大型中央企业集团...', 
    content: '<p>中国化学工程集团有限公司（简称"中国化学"）是国务院国资委监管的大型中央企业集团，是我国化工领域资质最齐全、功能最完备、业务链最完整、知识技术密集的国际工程公司，是石油和化学工业工程领域的国家队，是带动中国技术、中国标准和中国装备"走出去"，高质量共建"一带一路"的排头兵，在油气服务领域稳居全球第一。中国化学前身是成立于1953年的国家重工业部化学工业管理局，为解决全国人民"吃饭穿衣"问题应运而生，在国内外建设了7万多套化工装置，为新中国构建独立完整化学工业体系、促进经济社会发展、增进"一带一路"沿线国家人民福祉作出重要贡献。目前正在加快打造成为工业工程领域综合解决方案服务商、高端化学品和先进材料供应商，全面建设研发、投资、建造、运营一体化的世界一流企业。</p>', 
    cover: '', 
    author: '人力资源部', 
    category: 'recruit',
    displayPosition: null,
    hasUnsyncedChanges: false,
    attachment: {
      name: '项目管理部招聘公告.pdf',
      url: '/files/recruit_3.pdf'
    },
    publishTime: '2024/12/03 09:00:00', 
    updateTime: '2024/12/03 09:00:00', 
    status: 'published'
  },
  { 
    id: 'r_4', 
    title: '中国化学工程第七建设有限公司财务资产部财务总监招聘公告', 
    summary: '中国化学工程集团有限公司（简称"中国化学"）是国务院国资委监管的大型中央企业集团...', 
    content: '<p>中国化学工程集团有限公司（简称"中国化学"）是国务院国资委监管的大型中央企业集团，是我国化工领域资质最齐全、功能最完备、业务链最完整、知识技术密集的国际工程公司，是石油和化学工业工程领域的国家队，是带动中国技术、中国标准和中国装备"走出去"，高质量共建"一带一路"的排头兵，在油气服务领域稳居全球第一。中国化学前身是成立于1953年的国家重工业部化学工业管理局，为解决全国人民"吃饭穿衣"问题应运而生，在国内外建设了7万多套化工装置，为新中国构建独立完整化学工业体系、促进经济社会发展、增进"一带一路"沿线国家人民福祉作出重要贡献。目前正在加快打造成为工业工程领域综合解决方案服务商、高端化学品和先进材料供应商，全面建设研发、投资、建造、运营一体化的世界一流企业。</p>', 
    cover: '', 
    author: '人力资源部', 
    category: 'recruit',
    displayPosition: null,
    hasUnsyncedChanges: false,
    attachment: {
      name: '财务资产部招聘公告.pdf',
      url: '/files/recruit_4.pdf'
    },
    publishTime: '2024/12/04 11:20:00', 
    updateTime: '2024/12/04 11:20:00', 
    status: 'published'
  },
  { 
    id: 'r_5', 
    title: '中国化学工程第七建设有限公司安全环保部安全总监招聘公告', 
    summary: '中国化学工程集团有限公司（简称"中国化学"）是国务院国资委监管的大型中央企业集团...', 
    content: '<p>中国化学工程集团有限公司（简称"中国化学"）是国务院国资委监管的大型中央企业集团，是我国化工领域资质最齐全、功能最完备、业务链最完整、知识技术密集的国际工程公司，是石油和化学工业工程领域的国家队，是带动中国技术、中国标准和中国装备"走出去"，高质量共建"一带一路"的排头兵，在油气服务领域稳居全球第一。中国化学前身是成立于1953年的国家重工业部化学工业管理局，为解决全国人民"吃饭穿衣"问题应运而生，在国内外建设了7万多套化工装置，为新中国构建独立完整化学工业体系、促进经济社会发展、增进"一带一路"沿线国家人民福祉作出重要贡献。目前正在加快打造成为工业工程领域综合解决方案服务商、高端化学品和先进材料供应商，全面建设研发、投资、建造、运营一体化的世界一流企业。</p>', 
    cover: '', 
    author: '人力资源部', 
    category: 'recruit',
    displayPosition: null,
    hasUnsyncedChanges: false,
    attachment: {
      name: '安全环保部招聘公告.pdf',
      url: '/files/recruit_5.pdf'
    },
    publishTime: '2024/12/05 15:45:00', 
    updateTime: '2024/12/05 15:45:00', 
    status: 'published'
  },
  { 
    id: 'r_6', 
    title: '中国化学工程第七建设有限公司国际业务部海外项目经理招聘公告', 
    summary: '中国化学工程集团有限公司（简称"中国化学"）是国务院国资委监管的大型中央企业集团...', 
    content: '<p>中国化学工程集团有限公司（简称"中国化学"）是国务院国资委监管的大型中央企业集团，是我国化工领域资质最齐全、功能最完备、业务链最完整、知识技术密集的国际工程公司，是石油和化学工业工程领域的国家队，是带动中国技术、中国标准和中国装备"走出去"，高质量共建"一带一路"的排头兵，在油气服务领域稳居全球第一。中国化学前身是成立于1953年的国家重工业部化学工业管理局，为解决全国人民"吃饭穿衣"问题应运而生，在国内外建设了7万多套化工装置，为新中国构建独立完整化学工业体系、促进经济社会发展、增进"一带一路"沿线国家人民福祉作出重要贡献。目前正在加快打造成为工业工程领域综合解决方案服务商、高端化学品和先进材料供应商，全面建设研发、投资、建造、运营一体化的世界一流企业。</p>', 
    cover: '', 
    author: '人力资源部', 
    category: 'recruit',
    displayPosition: null,
    hasUnsyncedChanges: false,
    attachment: {
      name: '国际业务部招聘公告.pdf',
      url: '/files/recruit_6.pdf'
    },
    publishTime: '2024/12/06 10:15:00', 
    updateTime: '2024/12/06 10:15:00', 
    status: 'published'
  },
  { 
    id: 'r_7', 
    title: '中国化学工程第七建设有限公司市场开发部市场总监招聘公告', 
    summary: '中国化学工程集团有限公司（简称"中国化学"）是国务院国资委监管的大型中央企业集团...', 
    content: '<p>中国化学工程集团有限公司（简称"中国化学"）是国务院国资委监管的大型中央企业集团，是我国化工领域资质最齐全、功能最完备、业务链最完整、知识技术密集的国际工程公司，是石油和化学工业工程领域的国家队，是带动中国技术、中国标准和中国装备"走出去"，高质量共建"一带一路"的排头兵，在油气服务领域稳居全球第一。中国化学前身是成立于1953年的国家重工业部化学工业管理局，为解决全国人民"吃饭穿衣"问题应运而生，在国内外建设了7万多套化工装置，为新中国构建独立完整化学工业体系、促进经济社会发展、增进"一带一路"沿线国家人民福祉作出重要贡献。目前正在加快打造成为工业工程领域综合解决方案服务商、高端化学品和先进材料供应商，全面建设研发、投资、建造、运营一体化的世界一流企业。</p>', 
    cover: '', 
    author: '人力资源部', 
    category: 'recruit',
    displayPosition: null,
    hasUnsyncedChanges: false,
    attachment: null, // 示例：有些招聘可能没有附件
    publishTime: '2024/12/07 13:30:00', 
    updateTime: '2024/12/07 13:30:00', 
    status: 'draft'
  },
];

// 品牌文化初始数据
export const INITIAL_CULTURE_DATA = {
  company: {
    values: '以匠心铸品质，以初心担使命，聚力协同创新，共筑成长共赢。我们坚持诚信、创新、协作、卓越的核心价值观，致力于为客户创造价值，为员工提供发展平台，为社会承担责任。',
    activities: '公司定期组织各类文化活动，包括员工运动会、文艺汇演、技能竞赛、团队建设等，丰富员工业余生活，增强团队凝聚力，营造积极向上的企业文化氛围。',
    activityImage: null
  },
  brand: {
    declaration: {
      title: '品牌宣言',
      content: '我们致力于成为工程领域综合解决方案服务商，以专业的技术、优质的服务、创新的理念，为客户创造价值，为行业树立标杆。'
    },
    song: {
      title: '企业厂歌',
      file: '',
      lyrics: ''
    },
    video: {
      title: '企业宣传片',
      file: '',
      cover: null,
      description: ''
    }
  },
  responsibility: {
    poverty: [],
    other: []
  }
};

// 子公司初始数据
export const INITIAL_SUBSIDIARY_DATA = [
  {
    id: 'subsidiary_1',
    name: '成都分公司',
    type: 'subsidiary',
    establishDate: '2010-05-01',
    registeredCapital: '5000万元',
    legalRepresentative: '张总',
    address: '四川省成都市高新区',
    businessScope: '工程总承包、设备安装、技术服务',
    description: '成都分公司成立于2010年，是公司在西南地区的重要分支机构，主要从事工程总承包、设备安装和技术服务等业务。',
    certIds: ['c1', 'c2'],
    hrInfo: '拥有员工200余人，其中高级工程师30人，工程师80人。',
    status: 'published',
    createTime: '2024-01-01T00:00:00',
    updateTime: '2024-01-01T00:00:00'
  },
  {
    id: 'subsidiary_2',
    name: '北京分公司',
    type: 'subsidiary',
    establishDate: '2015-03-15',
    registeredCapital: '8000万元',
    legalRepresentative: '李总',
    address: '北京市朝阳区',
    businessScope: '工程总承包、国际贸易、技术咨询',
    description: '北京分公司成立于2015年，是公司在华北地区的重要分支机构，主要从事工程总承包、国际贸易和技术咨询等业务。',
    certIds: ['c3'],
    hrInfo: '拥有员工150余人，其中高级工程师25人，工程师60人。',
    status: 'published',
    createTime: '2024-01-01T00:00:00',
    updateTime: '2024-01-01T00:00:00'
  }
];

// ESG报告初始数据
export const INITIAL_ESG_DATA = [
  {
    id: 'esg_1',
    title: '2024年度ESG报告',
    year: '2024',
    cover: 'bg-blue-100',
    file: 'https://example.com/esg-report-2024.pdf',
    summary: '本报告全面展示了公司在环境、社会和治理方面的实践与成果，体现了公司可持续发展的承诺和行动。',
    publishDate: '2025-03-01',
    status: 'published',
    createTime: '2025-03-01T00:00:00',
    updateTime: '2025-03-01T00:00:00'
  },
  {
    id: 'esg_2',
    title: '2023年度ESG报告',
    year: '2023',
    cover: 'bg-green-100',
    file: 'https://example.com/esg-report-2023.pdf',
    summary: '2023年度ESG报告详细记录了公司在环境保护、社会责任和公司治理方面的各项举措和成效。',
    publishDate: '2024-03-01',
    status: 'published',
    createTime: '2024-03-01T00:00:00',
    updateTime: '2024-03-01T00:00:00'
  }
];

// 工程承包类别
export const INITIAL_ENGINEERING_CATEGORIES = [
  { id: 'fertilizer', title: '化肥', coverImage: '/images/engineering/fertilizer.jpg' },
  { id: 'ethylene', title: '乙烯', coverImage: '/images/engineering/ethylene.jpg' },
  { id: 'refining', title: '炼油', coverImage: '/images/engineering/refining.jpg' },
  { id: 'infrastructure', title: '基础设施', coverImage: '/images/engineering/infrastructure.jpg' },
  { id: 'green_energy', title: '绿色氢基能源', coverImage: '/images/engineering/green_energy.jpg' },
  { id: 'other', title: '其他', coverImage: '/images/engineering/other.jpg' }
];

// 工程承包项目初始数据
export const INITIAL_ENGINEERING_PROJECTS = [
  {
    id: 'eng_proj_1',
    title: '某大型化肥装置建设项目',
    summary: '公司承建的大型化肥装置建设项目，采用国际先进技术。',
    content: '该项目是公司承建的大型化肥装置建设项目，采用国际先进技术，建成后将成为国内领先的化肥生产基地。项目包括合成氨装置、尿素装置及配套公用工程。',
    category: 'fertilizer',
    coverImage: '/images/projects/fertilizer-1.jpg',
    status: 'published',
    publishTime: '2024-01-15T00:00:00',
    updateTime: '2024-01-15T00:00:00'
  },
  {
    id: 'eng_proj_2',
    title: '某乙烯装置EPC总承包项目',
    summary: '百万吨级乙烯装置EPC总承包项目，采用国际先进裂解技术。',
    content: '该项目是公司承建的百万吨级乙烯装置EPC总承包项目，采用国际先进的裂解技术，建成后将有效提升区域石化产业竞争力。',
    category: 'ethylene',
    coverImage: '/images/projects/ethylene-1.jpg',
    status: 'published',
    publishTime: '2024-02-20T00:00:00',
    updateTime: '2024-02-20T00:00:00'
  },
  {
    id: 'eng_proj_3',
    title: '某炼油装置改造项目',
    summary: '对现有炼油装置进行技术改造和升级。',
    content: '该项目是对现有炼油装置进行技术改造和升级，提升装置运行效率和产品质量，降低能耗和排放。',
    category: 'refining',
    coverImage: '/images/projects/refining-1.jpg',
    status: 'published',
    publishTime: '2024-03-10T00:00:00',
    updateTime: '2024-03-10T00:00:00'
  },
  {
    id: 'eng_proj_4',
    title: '绿色氢能示范项目',
    summary: '采用先进的电解水制氢技术，打造绿色能源标杆。',
    content: '该项目采用先进的电解水制氢技术，结合太阳能发电，打造零碳排放的绿色氢能生产基地。',
    category: 'green_energy',
    coverImage: '/images/projects/green-energy-1.jpg',
    status: 'draft',
    publishTime: '',
    updateTime: '2024-04-05T00:00:00'
  }
];

// 工程项目初始数据（旧，保留兼容）
export const INITIAL_PROJECT_LIBRARY = [
  {
    id: 'project_1',
    name: '某大型化肥装置建设项目',
    category: 'fertilizer',
    cover: 'bg-blue-500',
    location: '四川省泸州市',
    startDate: '2020-01-01',
    endDate: '2022-12-31',
    investment: '50亿元',
    description: '该项目是公司承建的大型化肥装置建设项目，采用国际先进技术，建成后将成为国内领先的化肥生产基地。项目包括合成氨装置、尿素装置及配套公用工程。',
    sort: 100,
    status: 'published',
    createTime: '2024-01-01T00:00:00',
    updateTime: '2024-01-01T00:00:00'
  },
  {
    id: 'project_2',
    name: '某乙烯装置EPC总承包项目',
    category: 'ethylene',
    cover: 'bg-green-500',
    location: '广东省惠州市',
    startDate: '2021-03-01',
    endDate: '2024-06-30',
    investment: '80亿元',
    description: '该项目是公司承建的百万吨级乙烯装置EPC总承包项目，采用国际先进的裂解技术，建成后将有效提升区域石化产业竞争力。',
    sort: 90,
    status: 'published',
    createTime: '2024-01-01T00:00:00',
    updateTime: '2024-01-01T00:00:00'
  },
  {
    id: 'project_3',
    name: '某炼油装置改造项目',
    category: 'refining',
    cover: 'bg-yellow-500',
    location: '山东省青岛市',
    startDate: '2022-05-01',
    endDate: '2024-08-31',
    investment: '30亿元',
    description: '该项目是对现有炼油装置进行技术改造和升级，提升装置运行效率和产品质量，降低能耗和排放。',
    sort: 80,
    status: 'published',
    createTime: '2024-01-01T00:00:00',
    updateTime: '2024-01-01T00:00:00'
  }
];

// 品牌宣言初始数据
export const INITIAL_BRAND_LIBRARY = [
  {
    id: 'brand_1',
    type: 'declaration',
    title: '品牌宣言',
    content: '我们致力于成为工程领域综合解决方案服务商，以专业的技术、优质的服务、创新的理念，为客户创造价值，为行业树立标杆。我们秉承"诚信、创新、协作、卓越"的核心价值观，以匠心铸品质，以初心担使命，聚力协同创新，共筑成长共赢。',
    media: '',
    status: 'published',
    createTime: '2024-01-01T00:00:00',
    updateTime: '2024-01-01T00:00:00'
  },
  {
    id: 'brand_2',
    type: 'song',
    title: '企业厂歌',
    content: '我们的企业厂歌体现了公司员工团结奋进、勇于创新的精神风貌，激励着全体员工为实现公司愿景而努力奋斗。',
    media: 'https://example.com/company-song.mp3',
    lyrics: '（歌词内容）\n我们是七化建人，\n肩负着化工建设的重任，\n用智慧和汗水，\n铸就辉煌的明天。',
    status: 'published',
    createTime: '2024-01-01T00:00:00',
    updateTime: '2024-01-01T00:00:00'
  },
  {
    id: 'brand_3',
    type: 'video',
    title: '企业宣传片',
    content: '企业宣传片全面展示了公司的发展历程、业务能力、技术实力和企业文化，是公司对外宣传的重要载体。',
    media: 'https://example.com/company-video.mp4',
    cover: 'bg-blue-400',
    description: '本宣传片时长15分钟，全面介绍了公司的历史、现状和未来发展规划。',
    status: 'published',
    createTime: '2024-01-01T00:00:00',
    updateTime: '2024-01-01T00:00:00'
  }
];

// 人力资源库初始数据
export const INITIAL_HR_LIBRARY = [
  {
    id: 'hr_1',
    title: '人才战略',
    type: 'strategy',
    content: '公司坚持"人才是第一资源"的理念，实施人才强企战略。通过建立完善的人才培养体系、激励机制和职业发展通道，吸引、培养和留住优秀人才。公司注重人才梯队建设，培养一批具有国际视野、专业能力突出的复合型人才，为企业高质量发展提供人才保障。',
    image: 'bg-blue-200',
    status: 'published',
    createTime: '2024-01-01T00:00:00',
    updateTime: '2024-01-01T00:00:00'
  },
  {
    id: 'hr_2',
    title: '人才队伍',
    type: 'team',
    content: '公司拥有一支高素质的人才队伍，现有员工2200余人，其中高级工程师300余人，工程师800余人，各类专业技术人员占比超过60%。公司建立了完善的人才培养和激励机制，为员工提供广阔的发展平台和职业发展空间。',
    image: 'bg-green-200',
    status: 'published',
    createTime: '2024-01-01T00:00:00',
    updateTime: '2024-01-01T00:00:00'
  }
];

// 业务分布初始数据
export const INITIAL_DISTRIBUTION_LIBRARY = [
  {
    id: 'dist_1',
    region: '国内业务分布',
    map: 'bg-blue-300',
    description: '公司业务遍布全国20多个省、自治区、直辖市，在成都、北京、上海、广州、深圳等主要城市设有分支机构。',
    status: 'published',
    createTime: '2024-01-01T00:00:00',
    updateTime: '2024-01-01T00:00:00'
  },
  {
    id: 'dist_2',
    region: '海外业务分布',
    map: 'bg-green-300',
    description: '公司业务覆盖全球80多个国家和地区，在"一带一路"沿线国家承建了多个大型工程项目，是国际工程承包领域的重要参与者。',
    status: 'published',
    createTime: '2024-01-01T00:00:00',
    updateTime: '2024-01-01T00:00:00'
  }
];

// 科技成果初始数据
export const INITIAL_TECH_LIBRARY = [
  {
    id: 'tech_1',
    title: '大型化工装置智能化控制系统',
    category: 'achievement',
    image: 'bg-blue-400',
    description: '该成果采用先进的智能化控制技术，实现了大型化工装置的自动化运行和优化控制，提升了装置运行效率和安全性，降低了能耗和排放。',
    achievementDate: '2023-06-01',
    status: 'published',
    createTime: '2024-01-01T00:00:00',
    updateTime: '2024-01-01T00:00:00'
  },
  {
    id: 'tech_2',
    title: '绿色化工工艺技术',
    category: 'technology',
    image: 'bg-green-400',
    description: '该技术采用清洁生产工艺，实现了化工生产过程的绿色化改造，大幅降低了污染物排放，提高了资源利用效率。',
    achievementDate: '2023-09-15',
    status: 'published',
    createTime: '2024-01-01T00:00:00',
    updateTime: '2024-01-01T00:00:00'
  },
  {
    id: 'tech_3',
    title: '高效节能换热技术',
    category: 'technology',
    image: 'bg-purple-400',
    description: '该技术通过优化换热器设计和工艺流程，实现了能量的高效利用，节能效果显著，已在多个项目中推广应用。',
    achievementDate: '2023-12-01',
    status: 'published',
    createTime: '2024-01-01T00:00:00',
    updateTime: '2024-01-01T00:00:00'
  }
];

// 公益服务初始数据
export const INITIAL_WELFARE_LIBRARY = [
  {
    id: 'welfare_1',
    title: '对口帮扶贫困地区教育项目',
    type: 'poverty',
    cover: 'bg-blue-300',
    content: '公司积极响应国家脱贫攻坚号召，对口帮扶贫困地区，投入资金支持当地教育事业发展，建设希望小学，资助贫困学生，为当地培养人才贡献力量。',
    activityDate: '2024-06-01',
    location: '四川省凉山州',
    status: 'published',
    createTime: '2024-01-01T00:00:00',
    updateTime: '2024-01-01T00:00:00'
  },
  {
    id: 'welfare_2',
    title: '环保公益活动',
    type: 'other',
    cover: 'bg-green-300',
    content: '公司组织员工参与环保公益活动，开展植树造林、垃圾分类宣传、环保知识普及等活动，积极履行企业社会责任，为建设美丽中国贡献力量。',
    activityDate: '2024-04-22',
    location: '成都市',
    status: 'published',
    createTime: '2024-01-01T00:00:00',
    updateTime: '2024-01-01T00:00:00'
  }
];

// ESG报告库初始数据（全局资源库）
export const INITIAL_ESG_LIBRARY = [
  {
    id: 'esg_lib_1',
    title: '2024年度ESG报告',
    year: '2024',
    cover: 'bg-blue-100',
    file: 'https://example.com/esg-report-2024.pdf',
    summary: '本报告全面展示了公司在环境、社会和治理方面的实践与成果，体现了公司可持续发展的承诺和行动。',
    publishDate: '2025-03-01',
    status: 'published',
    createTime: '2025-03-01T00:00:00',
    updateTime: '2025-03-01T00:00:00'
  },
  {
    id: 'esg_lib_2',
    title: '2023年度ESG报告',
    year: '2023',
    cover: 'bg-green-100',
    file: 'https://example.com/esg-report-2023.pdf',
    summary: '2023年度ESG报告详细记录了公司在环境保护、社会责任和公司治理方面的各项举措和成效。',
    publishDate: '2024-03-01',
    status: 'published',
    createTime: '2024-03-01T00:00:00',
    updateTime: '2024-03-01T00:00:00'
  }
];

// 企业公开基本信息初始数据
export const INITIAL_PUBLIC_BASIC = {
  registration: {
    companyName: '中国化学工程第七建设有限公司',
    unifiedSocialCreditCode: '91510000123456789X',
    registrationType: '有限责任公司（国有独资）',
    legalRepresentative: '待补充',
    registeredCapital: '待补充',
    establishDate: '1964-10-01',
    businessTerm: '长期',
    registrationAddress: '四川省成都市',
    businessScope: '工程总承包（投资、建造、运营）、实业和国际贸易等业务'
  },
  qualification: {
    certIds: ['c1', 'c2']
  },
  strategy: {
    title: '发展战略',
    content: '公司按照"一体两翼"发展战略，以工程总承包为主体，以实业和国际贸易为两翼，致力于成为工程领域综合解决方案服务商。'
  },
  distribution: {
    description: '公司业务遍布全国20多个省、自治区、直辖市，在成都、北京、上海、广州、深圳等主要城市设有分支机构。海外业务覆盖全球80多个国家和地区。'
  },
  achievements: {
    description: '公司累计完成工程项目8000余项，获得国家授权专利7100余项，业务遍布全球80多个国家和地区。'
  }
};

// 企业公开子公司情况初始数据
export const INITIAL_PUBLIC_SUBSIDIARY = {
  companyName: '赢海复兴工程科技(成都)有限公司',
  introduction: '赢海复兴工程科技(成都)有限公司系中国化学集团(股票代码601117) 中国化学工程第七建设有限公司下属全资子公司,公司目前是国家高新技术企业,拥有各类中高级设计和管理人才近二百人,拥有化工石化医药行业(化工工程)专业甲级设计、建筑行业(建筑工程)专业乙级、工程咨信乙级(石化、化工、医药)、压力容器设计、压力管道(GB、GC)设计等资质,通过了ISO9001、ISO 18001、ISO45001质量、环境、健康体系认证,并拥有对外贸易经营权。在锂资源综合利用、磷化工、天然气液化、液化天然气接收站、天然气制甲醇、天然气制合成氨尿素等领域具有技术优势,项目足迹遍布中国、东欧、孟加拉、乌兹别克斯坦等国家和地区。公司自成立以来已承接了磷化工、石油化工、天然气化工、精细化工、新材料、三废治理、储运、资源循环再利用等领域项目数百个,受到客户的广泛好评。',
  companyImage: null,
  leaders: [
    { id: 'leader_1', name: '石林', position: '总经理/执行董事' },
    { id: 'leader_2', name: '郑志远', position: '副总经理' },
    { id: 'leader_3', name: '关沂山', position: '副总经理' }
  ],
  strategy: {
    overallGoal: '发展成设计、采购、EPC一体化总承包的国际型工程公司'
  },
  registration: {
    unifiedSocialCreditCode: '9151011220218088XX',
    name: '赢海复兴工程科技(成都)有限公司',
    type: '有限责任公司(非自然人投资或控股的法人独资)',
    legalRepresentative: '石林',
    registeredCapital: '壹拾亿元整',
    establishDate: '1991-02-10',
    registrationAddress: '成都东部新区三岔街道三岔街62号3栋',
    address: '成都东部新区三岔街道三岔街62号3栋', // 兼容字段
    businessScope: '许可项目:建设工程设计;房屋建筑和市政基础设施项目工程总承包:各类工程建设活动;特种设备设计;建筑劳务分包;施工专业作业(依法须经批准的项目, 经相关部门批准后方可开展经营活动,具体经营项目以相关部门批准文件或许可证件为准)一般项目:工程和技术研究和试验发展;工程管理服务;工程技术服务(规划管理、勘察、设计、监理除外);对外承包工程;技术服务、技术开发、技术咨询、技术交流、技术转让、技术推广;专业设计服务;工业设计服务;污水处理及其再生利用; 环保咨询服务;固体废物治理(除依法须经批准的项目外,凭营业执照依法自主开展经营活动)。'
  },
  qualifications: [
    '化工石化医药行业(化工工程)专业甲级设计资质',
    '石化化工医药专业资信乙级资质',
    '压力管道GB1、GB2、GC1、GC2设计资质',
    '压力容器设计资质',
    '建筑行业(建筑工程)专业乙级工程设计资质'
  ],
  hr: {
    strategy: '荟萃贤才、才适其岗、锻造精英团队,围绕"一体两翼"战略需求,全面实施"人才强企"战略,秉承"以人为本,创新驱动"的发展理念,为人才搭建广阔的成长舞台与事业发展高地,公司在人才的引进、甄选、培育、激励、评估等环节,持续探索革新,积极培育和打造一支具备前瞻视野、勇于担当责任且充满创新活力的人才队伍,为公司高质量发展筑牢人才根基。倡导"公正、透明、竞争、择优"的用人理念,面向海内外广纳各领域精英。积极营造重视实用人才、关爱实用人才、服务实用人才、激励实用人才的优良氛围,让每一位有能力、有抱负的员工都能绽放光彩,成就梦想!我们诚挚邀请更多志同道合的英才加入我们的团队,携手并肩,共同开创更加辉煌灿烂的明天!',
    employeeInfo: '现有职工180余人。拥有博士学历1人,硕士学历47人,本科学历124人;持有正高级职称证人员1人,高级职称证人员35人,中级职称证人员46人,一级建造师19人,注册安全工程师8人,注册公用设备工程师4人,注册化工工程师8人,注册结构工程师3人,注册消防工程师2人。'
  },
  contacts: [
    { id: 'contact_1', department: '综合办公室', phone: '028-68931232' }
  ]
};

// 企业公开联系方式初始数据
export const INITIAL_PUBLIC_CONTACT = {
  departments: [
    {
      id: 'dept_1',
      name: '综合管理部',
      phone: '028-68897777',
      email: 'zhglb@cc7.cn'
    },
    {
      id: 'dept_2',
      name: '市场开发部',
      phone: '028-68897777',
      email: ''
    },
    {
      id: 'dept_3',
      name: '招聘热线',
      phone: '028-68931163',
      email: ''
    }
  ],
  faxPhone: '028-68931163',
  officeAddress: '四川省成都市龙泉驿区龙都南路537号'
};

// 留言初始数据
export const INITIAL_MESSAGES = [
  {
    id: 'msg_1',
    name: '张先生',
    phone: '13800138000',
    email: 'zhang@example.com',
    region: '四川省成都市',
    wechat: 'zhang123',
    content: '想了解贵公司在大型化工装置建设方面的能力和经验。',
    status: 'pending',
    createTime: '2025-10-15T10:00:00',
    updateTime: '2025-10-15T10:00:00'
  },
  {
    id: 'msg_2',
    name: '李女士',
    phone: '13900139000',
    email: 'li@example.com',
    region: '北京市',
    wechat: 'li456',
    content: '希望与贵公司建立长期合作关系，共同开拓市场。',
    status: 'processed',
    createTime: '2025-10-14T14:00:00',
    updateTime: '2025-10-15T09:00:00'
  }
];

// 可持续发展-科技创新初始数据
export const INITIAL_SUSTAIN_TECH_DATA = {
  overview: {
    description: '公司高度重视科技创新，建立了完善的科技创新体系，在大型化工装置设计、施工、运营等方面形成了多项核心技术，获得国家授权专利7100余项。'
  },
  achievements: [],
  technology: [],
  honors: []
};

// 可持续发展-社会责任初始数据
export const INITIAL_SUSTAIN_RESPONSIBILITY_DATA = {
  glory: {
    title: '荣耀典藏',
    description: '公司积极履行社会责任，在精准扶贫、教育支持、环境保护等方面做出了积极贡献，获得了社会各界的广泛认可。',
    honorIds: ['honor_1', 'honor_2']
  },
  welfare: {
    title: '公益服务',
    description: '公司持续开展各类公益活动，包括对口帮扶、教育支持、环保行动等，积极回馈社会。',
    activityIds: []
  }
};

// 业务领域-Banner设置初始数据
export const INITIAL_BUSINESS_BANNER = {
  title: '七化建全球事业分布',
  subtitle1: '团队成员有着共同的愿景和目标',
  subtitle2: '成为中国化学行业的引领者',
  statsMode: 'global', // 'global' 或 'custom'
  selectedGlobalKeys: ['foundingDate', 'areaSize', 'globalStaff', 'completedProjects'],
  customStats: [
    { value: '', label: '' },
    { value: '', label: '' },
    { value: '', label: '' },
    { value: '', label: '' }
  ]
};

// 业务领域-实业投资初始数据
export const INITIAL_BUSINESS_INDUSTRY = {
  title: '实业投资',
  description: '公司在做好工程总承包主业的同时，积极拓展实业投资业务，通过投资建设运营一体化模式，实现产业链延伸和价值提升。公司已在多个领域开展实业投资，形成了良好的投资回报。',
  image: null,
  enabled: true
};

// 业务领域-国际贸易初始数据
export const INITIAL_BUSINESS_TRADE = {
  procurement: {
    title: '工程采购',
    content: '公司拥有完善的工程采购体系，与全球优质供应商建立了长期合作关系，能够为客户提供设备、材料、技术服务等一站式采购服务。',
    image: null
  },
  trade: {
    title: '大宗贸易',
    content: '公司积极开展大宗商品贸易业务，主要涉及化工产品、机械设备、原材料等，通过全球化的贸易网络，为客户提供优质的贸易服务。',
    image: null
  }
};

// 可持续发展-安环行动初始数据
export const INITIAL_SUSTAIN_SAFETY = {
  target: {
    title: '我们的目标',
    content: '公司致力于实现零事故、零污染、零伤害的安全环保目标，建立完善的安全环保管理体系，持续提升安全环保管理水平。'
  },
  policy: {
    title: '管理方针',
    content: '坚持"安全第一、预防为主、综合治理"的方针，严格执行国家安全生产法律法规，建立健全安全环保责任制，确保安全生产和环境保护工作落到实处。'
  },
  commitment: {
    title: '郑重承诺',
    content: '公司郑重承诺：严格遵守国家法律法规，履行安全环保主体责任，持续改进安全环保绩效，为员工、客户、社会创造安全、健康、环保的工作和生活环境。'
  },
  'zero-tolerance': {
    title: '零容忍政策',
    content: '公司对安全环保违规行为实行零容忍政策，对任何违反安全环保规定的行为，将严肃处理，绝不姑息。'
  }
};

// 可持续发展-全球发展初始数据
export const INITIAL_SUSTAIN_GLOBAL = {
  transformation: {
    title: '围绕发展目标推进转型',
    content: '公司围绕"成为工程领域综合解决方案服务商"的发展目标，积极推进数字化转型、绿色转型和国际化转型，不断提升企业核心竞争力。'
  },
  structure: {
    title: '发展梯队架构',
    content: '公司建立了完善的发展梯队架构，形成了以工程总承包为主体，以实业和国际贸易为两翼的业务格局，实现了业务的协同发展和价值提升。'
  }
};

// 党建领航-廉洁从业初始数据
export const INITIAL_PARTY_INTEGRITY = {
  title: '廉洁从业',
  content: '公司高度重视廉洁从业工作，建立了完善的廉洁从业制度体系，加强廉洁教育和监督，营造风清气正的工作环境。公司要求全体员工严格遵守廉洁从业规定，不得利用职务之便谋取私利，不得收受任何形式的贿赂，不得参与任何违法违规活动。'
};

// 公司信息库初始数据
export const INITIAL_COMPANY_INFO_LIBRARY = [
  {
    id: 'company_main',
    name: '中国化学工程第七建设有限公司',
    type: 'main',
    establishDate: '1964-10-01',
    registeredCapital: '待补充',
    legalRepresentative: '待补充',
    address: '四川省成都市',
    businessScope: '工程总承包（投资、建造、运营）、实业和国际贸易等业务',
    description: '中国化学工程第七建设有限公司（简称"七化建"）成立于1964年，总部设在四川成都，是为建设中国第一套进口大化肥（泸天化）、解决中国老百姓穿衣吃饭而诞生，是国务院国资委管理的中国化学工程股份有限公司全资子公司，2010年1月随中国化学工程股份有限公司在上交所上市。',
    status: 'published',
    createTime: '2024-01-01T00:00:00',
    updateTime: '2024-01-01T00:00:00'
  }
];

// 公司荣誉初始数据
export const INITIAL_COMPANY_HONORS = [
  {
    id: 'honor_1',
    title: '鲁班奖',
    type: 'enterprise',
    image: 'bg-amber-100',
    awardDate: '2020-01-01',
    awardOrg: '中国建筑业协会',
    description: '中国建设工程鲁班奖（国家优质工程）',
    sort: 100,
    status: 'published',
    createTime: '2024-01-01T00:00:00',
    updateTime: '2024-01-01T00:00:00'
  },
  {
    id: 'honor_2',
    title: '国家优质工程奖',
    type: 'enterprise',
    image: 'bg-blue-100',
    awardDate: '2019-01-01',
    awardOrg: '中国施工企业管理协会',
    description: '国家优质工程奖',
    sort: 90,
    status: 'published',
    createTime: '2024-01-01T00:00:00',
    updateTime: '2024-01-01T00:00:00'
  }
];

// 员工风采初始数据
export const INITIAL_STAFF_LIBRARY = [
  { id: 'staff_1', title: '员工照片 1', image: 'bg-blue-400', description: '以奋斗之名，展青春风采', status: 'published' },
  { id: 'staff_2', title: '员工照片 2', image: 'bg-green-400', description: '以奋斗之名，展青春风采', status: 'published' },
  { id: 'staff_3', title: '员工照片 3', image: 'bg-purple-400', description: '以奋斗之名，展青春风采', status: 'published' }
];

// 合作伙伴初始数据
export const INITIAL_PARTNER_LIBRARY = [
  { id: 'partner_1', name: 'BASF', logo: 'bg-gray-200', type: 'customer', description: '巴斯夫（中国）有限公司', status: 'published' },
  { id: 'partner_2', name: 'BAYER', logo: 'bg-gray-300', type: 'customer', description: '拜耳（中国）有限公司', status: 'published' },
  { id: 'partner_3', name: 'Partner 3', logo: 'bg-gray-400', type: 'supplier', description: '合作伙伴3', status: 'published' },
  { id: 'partner_4', name: 'Partner 4', logo: 'bg-gray-500', type: 'partner', description: '合作伙伴4', status: 'published' }
];

// 页脚内容初始数据
export const INITIAL_FOOTER_CONTENT = {
  // 上级单位和所属企业
  parentUnits: [
    '中国化学工程股份有限公司',
    '国家发展和改革委员会',
    '国有资产管理委员会',
    '中国化学工程集团公司'
  ],
  subsidiaryCompany: '中化学七化建化工工程 (成都) 有限公司',
  
  // 联系方式
  address: '四川省成都市龙泉驿区龙都南路537号',
  phone: '028-68897777',
  fax: '028-68931366',
  migrantWorkerHotline: '028-68931100',
  qrCode: '', // 二维码图片URL
  
  // 友情链接
  friendLinks: [
    { id: 'fl1', name: '工信部', url: 'https://www.miit.gov.cn' },
    { id: 'fl2', name: '住建部', url: 'https://www.mohurd.gov.cn' },
    { id: 'fl3', name: '四川省国资委', url: 'https://www.scgz.gov.cn' },
  ]
};

