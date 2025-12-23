import { useState } from 'react';
import NewsListEditor from './NewsListEditor';

// 初始招聘数据 - 标题、内容、作者、附件
const INITIAL_RECRUITS = [
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

const HRRecruitEditor = ({ recruits: propRecruits, onChange }) => {
  // 如果传入的数据格式不对（旧格式），使用默认数据
  const isValidRecruit = (recruit) => {
    return recruit && recruit.title && recruit.category === 'recruit';
  };
  
  const validRecruits = propRecruits?.filter(isValidRecruit) || [];
  const [recruits, setRecruits] = useState(validRecruits.length > 0 ? validRecruits : INITIAL_RECRUITS);
  
  // 当recruits更新时，同步到父组件
  const handleChange = (newRecruits) => {
    setRecruits(newRecruits);
    if (onChange) {
      onChange(newRecruits);
    }
  };

  return (
    <NewsListEditor
      newsList={recruits}
      onChange={handleChange}
      imageLib={[]}
      defaultCategory="recruit"
      categoryLabel="招聘信息"
      newsCategories={[]}
      buttonText="新增内容"
    />
  );
};

export default HRRecruitEditor;
