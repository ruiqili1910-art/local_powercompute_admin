---
alwaysApply: true
---

# 组件开发规范

> 在创建或修改任何 React 组件时，必须遵循以下规范。

## 🎯 组件创建流程

### 1. 创建新组件前
- ✅ 检查是否已有类似功能的公共组件（Button, Card, Input, FormItem 等）
- ✅ 查看 `.cursor/rules/designrule/RULE.md` 了解设计规范
- ✅ 参考现有组件的实现方式（查看 `src/components/ui/` 目录）

### 2. 组件结构规范

```jsx
// ✅ 正确的组件结构示例
import { useState } from 'react';
import { Icon } from 'lucide-react';
import Button from './Button';
import Card from './Card';
import FormItem from './FormItem';

/**
 * 组件描述
 * 
 * @param {string} title - 标题
 * @param {function} onSubmit - 提交回调
 */
const MyComponent = ({ title, onSubmit }) => {
  // 状态管理
  const [value, setValue] = useState('');
  
  // 事件处理
  const handleSubmit = () => {
    onSubmit(value);
  };
  
  // JSX 返回
  return (
    <Card title={title}>
      <FormItem label="输入" required>
        <Input 
          value={value}
          onChange={e => setValue(e.target.value)}
        />
      </FormItem>
      <Button onClick={handleSubmit}>提交</Button>
    </Card>
  );
};

export default MyComponent;
```

### 3. 样式使用规范

#### ✅ 正确示例：
```jsx
// 使用 Tailwind 工具类
<div className="bg-white p-lg rounded-md shadow-light border border-gray-4">
  <h3 className="text-section text-gray-8">标题</h3>
  <p className="text-body text-gray-7">内容</p>
</div>

// 使用预定义组件
<Button variant="primary" size="md">按钮</Button>
<Card title="卡片标题">内容</Card>
```

#### ❌ 错误示例：
```jsx
// ❌ 硬编码颜色
<div style={{ backgroundColor: '#2B7FFF' }}>

// ❌ 非标准间距
<div className="p-10">

// ❌ 直接使用内联样式
<div style={{ padding: '16px', borderRadius: '8px' }}>
```

### 4. 页面编辑器组件规范

创建页面编辑器时，必须使用 `EditorLayout` 组件：

```jsx
import EditorLayout from '../ui/EditorLayout';

const MyEditor = ({ data, onChange }) => {
  const [localData, setLocalData] = useState(data);
  
  const handleSave = async () => {
    // 保存逻辑
    await saveToServer(localData);
  };
  
  const handleSaveDraft = async () => {
    // 保存草稿逻辑
    await saveDraft(localData);
    onChange(localData); // 通知父组件更新
  };
  
  return (
    <EditorLayout
      title="页面标题"
      description="页面描述"
      pageKey="my-editor" // 唯一标识
      onSave={handleSave}
      onSaveDraft={handleSaveDraft}
      hasUnsavedChanges={localData !== data} // 检测是否有未保存修改
    >
      {/* 编辑器内容 */}
      <FormItem label="字段">
        <Input value={localData.field} onChange={...} />
      </FormItem>
    </EditorLayout>
  );
};
```

### 5. 列表管理页面规范

创建列表管理页面时，必须使用 `PageBanner` + `SearchFilterBar` + `DataTable`：

```jsx
import PageBanner from '../ui/PageBanner';
import SearchFilterBar from '../ui/SearchFilterBar';
import DataTable from '../ui/DataTable';

const MyListPage = () => {
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  
  const columns = [
    { key: 'title', title: '标题', sortable: true },
    { key: 'date', title: '日期', sortable: true },
  ];
  
  return (
    <div className="bg-white rounded-xl border border-gray-4 overflow-hidden">
      <PageBanner
        title="列表标题"
        description="列表描述"
        buttonText="新增"
        buttonIcon="add"
        onButtonClick={handleAdd}
      />
      
      <SearchFilterBar
        searchText={searchText}
        onSearchChange={setSearchText}
        sortOptions={[
          { id: 'date', label: '日期' },
          { id: 'title', label: '标题' },
        ]}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={(by, order) => {
          setSortBy(by);
          setSortOrder(order);
        }}
      />
      
      <DataTable
        columns={columns}
        data={filteredData}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={(by, order) => {
          setSortBy(by);
          setSortOrder(order);
        }}
        currentPage={page}
        pageSize={10}
        total={total}
        onPageChange={setPage}
      />
    </div>
  );
};
```

### 6. 响应式设计规范

所有组件必须支持响应式：

```jsx
// ✅ 正确：使用响应式类名
<div className="flex flex-col sm:flex-row gap-sm sm:gap-md p-sm sm:p-md">
  <div className="w-full sm:w-1/2">内容</div>
</div>

// ✅ 正确：移动端隐藏/显示
<button className="lg:hidden">移动端按钮</button>
<div className="hidden lg:block">桌面端内容</div>
```

### 7. 图标使用规范

```jsx
import { Plus, Edit, Delete } from 'lucide-react';

// ✅ 正确：使用 Lucide React 图标
<Button>
  <Plus className="w-4 h-4" />
  新增
</Button>

// ✅ 图标尺寸规范
// 小图标：w-3.5 h-3.5 (14px) 或 w-4 h-4 (16px)
// 中等图标：w-4 h-4 (16px) 或 w-5 h-5 (20px)
// 大图标：w-6 h-6 (24px)
```

### 8. 状态管理规范

```jsx
// ✅ 使用 useState 管理本地状态
const [value, setValue] = useState('');

// ✅ 使用 useCallback 优化事件处理
const handleClick = useCallback(() => {
  // 处理逻辑
}, [dependencies]);

// ✅ 使用 useEffect 处理副作用
useEffect(() => {
  // 副作用逻辑
  return () => {
    // 清理逻辑
  };
}, [dependencies]);
```

## 📝 代码审查检查点

在提交代码前，请确认：

- [ ] 所有颜色使用 CSS 变量或 Tailwind 类名
- [ ] 所有间距使用预定义值（xxs, xs, sm, md, lg, xl, xxl, xxxl）
- [ ] 所有圆角使用预定义值（xs, sm, md, lg, xl）
- [ ] 所有文字使用预定义样式类（.text-title, .text-section, .text-body, .text-caption）
- [ ] 组件支持响应式设计
- [ ] 使用了适当的过渡动画
- [ ] 遵循了无障碍访问规范（适当的 aria 标签等）
- [ ] 代码有适当的注释和文档

## 🔗 相关文档

- 详细设计规范：`.cursor/rules/designrule/RULE.md`
- UI 组件库：`src/components/ui/`
- 现有编辑器示例：`src/components/editors/`




