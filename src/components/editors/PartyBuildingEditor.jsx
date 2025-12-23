import { useState } from 'react';
import NewsListEditor from './NewsListEditor';

// 初始数据 - 需要添加 category 和 displayPosition 字段，以及 hasUnsyncedChanges
const INITIAL_ARTICLES = [
  { 
    id: 'pb_1', 
    title: '深入学习贯彻党的二十大精神', 
    summary: '公司党委组织全体党员深入学习贯彻党的二十大精神，推动学习成果转化为工作实效。', 
    content: '<p>模拟的内容...</p>', 
    cover: '', 
    author: '党委办公室', 
    category: 'party_building',
    displayPosition: 'cardGrid', // 默认卡片
    hasUnsyncedChanges: false,
    publishTime: '2024/01/15 10:00:00', 
    updateTime: '2024/01/15 10:00:00', 
    status: 'published' 
  },
  { 
    id: 'pb_2', 
    title: '党建引领促发展 凝心聚力谱新篇', 
    summary: '公司各基层党组织积极开展主题党日活动，凝聚发展合力，推动各项工作稳步前进。', 
    content: '<p>模拟的内容...</p>', 
    cover: '', 
    author: '组织部', 
    category: 'party_building',
    displayPosition: 'cardGrid', // 默认卡片
    hasUnsyncedChanges: false,
    publishTime: '2024/02/20 14:30:00', 
    updateTime: '2024/02/20 14:30:00', 
    status: 'published' 
  },
  { 
    id: 'pb_3', 
    title: '强化党风廉政建设 营造风清气正环境', 
    summary: '公司纪委召开党风廉政建设工作会议，部署全年党风廉政建设和反腐败工作。', 
    content: '<p>模拟的内容...</p>', 
    cover: '', 
    author: '纪委', 
    category: 'party_building',
    displayPosition: 'cardGrid', // 默认卡片
    hasUnsyncedChanges: false,
    publishTime: '2024/03/10 09:00:00', 
    updateTime: '2024/03/10 09:00:00', 
    status: 'draft' 
  },
];

const PartyBuildingEditor = ({ imageLib = [] }) => {
  const [articles, setArticles] = useState(INITIAL_ARTICLES);

  return (
    <NewsListEditor
      newsList={articles}
      onChange={setArticles}
      imageLib={imageLib}
      defaultCategory="party_building"
      categoryLabel="党的建设"
      newsCategories={[]} // 不需要分类筛选
    />
  );
};

export default PartyBuildingEditor;
