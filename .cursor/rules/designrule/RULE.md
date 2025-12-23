---
alwaysApply: true
---

# CMS 后台管理系统 - 视觉设计原则

> **⚠️ 重要指令：在创建或修改任何页面、组件时，必须严格遵循本文档中的所有设计规范！**

## 📋 开发时必须遵守的规则

### ✅ 必须做的：
1. **创建新组件时**：
   - 必须使用本文档中定义的颜色系统（使用 CSS 变量或 Tailwind 类名）
   - 必须使用预定义的间距系统（xxs, xs, sm, md, lg, xl, xxl, xxxl）
   - 必须使用预定义的圆角系统（xs, sm, md, lg, xl）
   - 必须使用预定义的文字系统（.text-title, .text-section, .text-body, .text-caption）
   - 优先使用现有的公共组件（Button, Card, Input, FormItem, DataTable 等）

2. **修改现有组件时**：
   - 必须保持与现有设计系统的一致性
   - 必须使用相同的颜色、间距、圆角规范
   - 不得破坏现有的视觉风格

3. **样式实现**：
   - 优先使用 Tailwind 工具类（如 `bg-brand`, `p-md`, `rounded-sm`）
   - 复杂样式使用 CSS 变量（如 `var(--color-brand)`）
   - 响应式设计必须遵循断点规范（sm: 640px, md: 768px, lg: 1024px）

### ❌ 禁止做的：
1. **禁止硬编码颜色值**：不得使用 `#2B7FFF` 这样的硬编码，必须使用 `bg-brand` 或 `var(--color-brand)`
2. **禁止使用非标准间距**：不得使用 `p-10`, `p-15` 等非标准值，必须使用预定义的间距
3. **禁止创建新的颜色变体**：必须使用文档中已定义的颜色
4. **禁止绕过公共组件**：不得重新实现已有的 Button、Card 等组件功能

### 🔍 检查清单（创建/修改组件前必须确认）：
- [ ] 是否使用了正确的颜色系统？
- [ ] 是否使用了预定义的间距值？
- [ ] 是否使用了预定义的圆角值？
- [ ] 是否使用了正确的文字样式类？
- [ ] 是否优先使用了现有公共组件？
- [ ] 是否遵循了响应式设计规范？
- [ ] 是否添加了适当的过渡动画？

---

本文档定义了 CMS 后台管理系统的完整视觉设计系统，包括颜色、文字、间距、圆角、阴影和公共组件规范。

## 一、颜色系统 (Color System)

### 1.1 品牌色 (Brand Colors)
- **主色**: `#2B7FFF` (--color-brand)
- **悬停**: `#589AFF` (--color-brand-hover)
- **激活**: `#1F6DDB` (--color-brand-active)
- **浅色背景**: `#E6F1FF` (--color-brand-light)

### 1.2 语义色 (Semantic Colors)

#### 成功色 (Success)
- **主色**: `#27C46A` (--color-success)
- **悬停**: `#44D589` (--color-success-hover)
- **浅色背景**: `#E8FFF3` (--color-success-light)

#### 警告色 (Warning)
- **主色**: `#FFB020` (--color-warning)
- **悬停**: `#FFC348` (--color-warning-hover)
- **浅色背景**: `#FFF7E8` (--color-warning-light)

#### 错误色 (Error)
- **主色**: `#FF4D4F` (--color-error)
- **悬停**: `#FF6B6D` (--color-error-hover)
- **浅色背景**: `#FFECEC` (--color-error-light)

#### 信息色 (Info)
- **主色**: `#2B7FFF` (复用品牌色)
- **浅色背景**: `#E6F1FF` (--color-info-light)

### 1.3 中性色 (Neutrals)
- **gray-1**: `#FFFFFF` - 纯白
- **gray-2**: `#FAFAFA` - 背景色
- **gray-3**: `#F5F7FA` - 页面背景、悬停背景
- **gray-4**: `#E6E8EB` - 边框、分隔线
- **gray-5**: `#CBD0D6` - 次要边框、滚动条
- **gray-6**: `#8A9099` - 次要文字
- **gray-7**: `#4B4F55` - 描述文字
- **gray-8**: `#1C1F23` - 标题文字

### 1.4 文本颜色 (Text Colors)
- **primary**: `#1A1A1A` - 标题、主内容
- **regular**: `#333333` - 正文普通文本
- **secondary**: `#666666` - 次要信息
- **placeholder**: `#999999` - 占位文字
- **disabled**: `#C2C2C2` - 禁用状态
- **link**: `#2B7FFF` - 链接文字
- **success**: `#27C652` - 成功提示
- **warning**: `#FAAD14` - 警告提示
- **error**: `#FF4D4F` - 错误提示

### 1.5 使用规范
- ✅ 使用 CSS 变量（如 `var(--color-brand)`）或 Tailwind 类名（如 `bg-brand`）
- ✅ 按钮主色使用品牌色，悬停使用 hover 变体
- ✅ 背景色使用 gray-2 或 gray-3
- ✅ 边框使用 gray-4
- ❌ 禁止硬编码颜色值

## 二、文字系统 (Typography System)

### 2.1 字体家族 (Font Family)
```css
font-family: "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif;
```
- 优先使用思源黑体（Noto Sans SC）
- 回退到系统字体

### 2.2 字号与行高 (Font Size & Line Height)

| 类型 | 字号 | 行高 | 字重 | 用途 | CSS 类名 |
|------|------|------|------|------|----------|
| 页面标题 | 20px | 28px | 600 | 页面主标题 | `.text-title` |
| 区块标题 | 16px | 24px | 500 | 区块、卡片标题 | `.text-section` |
| 正文 | 14px | 22px | 400 | 正文内容 | `.text-body` |
| 辅助文字 | 12px | 18px | 400 | 提示、说明 | `.text-caption` |

### 2.3 字重 (Font Weight)
- **regular**: 400 - 正文、辅助文字
- **medium**: 500 - 区块标题
- **semibold**: 600 - 页面标题

### 2.4 使用规范
- ✅ 使用工具类：`.text-title`, `.text-section`, `.text-body`, `.text-caption`
- ✅ 标题使用 semibold，正文使用 regular
- ✅ 次要信息使用 `.text-secondary` 或 `.text-placeholder`
- ❌ 避免直接设置 `font-size`，使用预定义字号

## 三、间距系统 (Spacing System)

### 3.1 间距值
| 名称 | 值 | 用途 | Tailwind 类名 |
|------|-----|------|---------------|
| xxs | 4px | 图标间距、tag | `gap-xxs`, `p-xxs` |
| xs | 8px | 小组件内边距 | `gap-xs`, `p-xs` |
| sm | 12px | 表格、小表单间距 | `gap-sm`, `p-sm` |
| md | 16px | 常规内容间距（最常用） | `gap-md`, `p-md` |
| lg | 20px | 卡片内部 padding | `gap-lg`, `p-lg` |
| xl | 24px | 页面内边距（常用） | `gap-xl`, `p-xl` |
| xxl | 32px | 区块分隔、上方空白 | `gap-xxl`, `p-xxl` |
| xxxl | 40px | Banner、大块视觉区 | `gap-xxxl`, `p-xxxl` |

### 3.2 使用规范
- ✅ 页面内容区域统一使用 `p-xl` (24px)
- ✅ 卡片内部使用 `p-lg` (20px)
- ✅ 组件间距使用 `gap-md` (16px) 或 `gap-sm` (12px)
- ✅ 区块分隔使用 `mb-xxl` (32px)
- ❌ 避免使用非标准间距值（如 10px, 15px）

## 四、圆角系统 (Radius System)

### 4.1 圆角值
| 名称 | 值 | 用途 | Tailwind 类名 |
|------|-----|------|---------------|
| xs | 4px | icon 背景、小标签 | `rounded-xs` |
| sm | 6px | 输入框、按钮 | `rounded-sm` |
| md | 8px | 卡片、表格容器（推荐） | `rounded-md` |
| lg | 12px | 弹窗、较大块内容 | `rounded-lg` |
| xl | 16px | 登录框、Banner 卡片 | `rounded-xl` |

### 4.2 使用规范
- ✅ 按钮使用 `rounded-sm` (6px)
- ✅ 卡片使用 `rounded-md` (8px)
- ✅ 弹窗使用 `rounded-lg` (12px) 或 `rounded-xl` (16px)
- ✅ 小标签使用 `rounded-xs` (4px)

## 五、阴影系统 (Shadow System)

### 5.1 阴影值
| 名称 | 值 | 用途 | Tailwind 类名 |
|------|-----|------|---------------|
| light | `0 2px 6px rgba(0, 0, 0, 0.05)` | 轻微阴影 | `shadow-light` |
| base | `0 4px 12px rgba(0, 0, 0, 0.08)` | 常规阴影（推荐） | `shadow-base` |
| strong | `0 8px 24px rgba(0, 0, 0, 0.12)` | 强调阴影 | `shadow-strong` |

### 5.2 使用规范
- ✅ 卡片默认使用 `shadow-light`，悬停时使用 `shadow-base`
- ✅ 弹窗使用 `shadow-strong`
- ✅ 下拉菜单使用 `shadow-strong`

## 六、边框系统 (Border System)

### 6.1 边框颜色
- **light**: `#E6E8EB` (--border-light) - 常规边框
- **strong**: `#CBD0D6` (--border-strong) - 强调边框

### 6.2 使用规范
- ✅ 常规边框使用 `border-gray-4` 或 `border border-gray-4`
- ✅ 输入框默认边框使用 `border-gray-4`，聚焦时使用 `border-brand`

## 七、公共组件规范

### 7.1 Button 按钮
```jsx
<Button variant="primary" size="md">按钮文字</Button>
```

**变体 (variants)**:
- `primary`: 主按钮（品牌色背景）
- `secondary`: 次要按钮（白色背景，品牌色边框）
- `add`: 新增按钮（白色背景，品牌色边框和文字）
- `dashed`: 虚线按钮（透明背景，虚线边框）
- `danger`: 危险按钮（透明背景，错误色文字）
- `link`: 链接按钮（无背景，品牌色文字）

**尺寸 (sizes)**:
- `sm`: 小按钮（px-sm py-xxs text-caption）
- `md`: 中等按钮（px-md py-xs text-body）- 默认
- `lg`: 大按钮（px-lg py-sm text-section）

**规范**:
- ✅ 按钮使用 `rounded-sm` (6px)
- ✅ 主按钮使用品牌色，悬停使用 `hover:bg-brand-hover`
- ✅ 按钮文字使用 `font-medium`
- ✅ 按钮间距使用 `gap-xs` (8px)

### 7.2 Card 卡片
```jsx
<Card title="标题" action={<Button>操作</Button>}>
  内容
</Card>
```

**规范**:
- ✅ 使用 `rounded-md` (8px)
- ✅ 默认阴影 `shadow-light`，悬停 `shadow-base`
- ✅ 边框 `border-gray-4`
- ✅ 标题区域 `px-lg py-md`，内容区域 `p-lg`
- ✅ 标题使用 `.text-section`

### 7.3 Input 输入框
```jsx
<Input placeholder="请输入..." />
```

**规范**:
- ✅ 使用 `rounded-sm` (6px)
- ✅ 内边距 `px-sm py-xs`
- ✅ 边框 `border-gray-4`，聚焦 `border-brand`
- ✅ 聚焦时显示 `ring-4 ring-brand/10`
- ✅ 禁用状态：`bg-gray-2 text-text-disabled`

### 7.4 FormItem 表单项
```jsx
<FormItem label="标签" required hint="提示信息">
  <Input />
</FormItem>
```

**规范**:
- ✅ 标签使用 `.text-body font-medium`
- ✅ 必填项显示红色 `*`
- ✅ 提示信息使用 `.text-caption text-text-placeholder`
- ✅ 间距使用 `gap-xs`

### 7.5 DataTable 数据表格
```jsx
<DataTable
  columns={columns}
  data={data}
  sortBy={sortBy}
  sortOrder={sortOrder}
  onSortChange={handleSort}
  currentPage={page}
  pageSize={10}
  total={total}
  onPageChange={handlePageChange}
/>
```

**规范**:
- ✅ 表头背景 `bg-gray-2`
- ✅ 表头文字 `.text-body font-medium text-gray-7`
- ✅ 单元格内边距 `px-md py-sm`
- ✅ 排序图标使用品牌色
- ✅ 悬停行背景 `hover:bg-gray-2`

### 7.6 SearchFilterBar 搜索筛选栏
```jsx
<SearchFilterBar
  searchText={searchText}
  onSearchChange={handleSearch}
  sortOptions={sortOptions}
  sortBy={sortBy}
  sortOrder={sortOrder}
  onSortChange={handleSort}
  filterFields={filterFields}
  onFilterChange={handleFilter}
  onFilterReset={handleReset}
/>
```

**规范**:
- ✅ 搜索框背景 `bg-gray-2`
- ✅ 搜索框内边距 `pl-9 pr-4 py-2.5`
- ✅ 按钮使用 `bg-white border-gray-4`
- ✅ 下拉菜单使用 `shadow-strong`

### 7.7 PageBanner 页面横幅
```jsx
<PageBanner
  title="页面标题"
  description="页面描述"
  buttonText="新增"
  buttonIcon="add"
  onButtonClick={handleAdd}
  onHistoryClick={handleHistory}
/>
```

**规范**:
- ✅ 标题使用 `.text-title`
- ✅ 描述使用 `.text-body text-gray-7`
- ✅ 高度：移动端自适应，桌面端 `h-[120px]`
- ✅ 内边距 `px-xl py-lg`
- ✅ 背景装饰使用渐变圆形（blur 60px）

### 7.8 EditorLayout 编辑器布局
```jsx
<EditorLayout
  title="页面标题"
  description="页面描述"
  pageKey="unique-key"
  onSave={handleSave}
  onSaveDraft={handleSaveDraft}
  hasUnsavedChanges={hasChanges}
>
  编辑器内容
</EditorLayout>
```

**规范**:
- ✅ 自动包含 PageBanner 和 FloatingActionBar
- ✅ 内容区域 `px-xl py-lg`
- ✅ 底部占位 `h-20`（防止被悬浮栏遮挡）
- ✅ 状态管理：已发布、待发布、有未保存修改

## 八、布局规范

### 8.1 页面布局
- ✅ 主内容区域最大宽度：`max-w-[1160px]`，居中 `mx-auto`
- ✅ 页面内边距：`p-xl` (24px)
- ✅ 页面背景：`bg-gray-3`
- ✅ 内容区域背景：`bg-white`

### 8.2 响应式设计
- ✅ 移动端优先（Mobile First）
- ✅ 断点：`sm:` (640px), `md:` (768px), `lg:` (1024px)
- ✅ 侧边栏：移动端固定定位，桌面端静态定位
- ✅ 表格：移动端横向滚动，桌面端正常显示

### 8.3 滚动条
- ✅ 宽度/高度：6px
- ✅ 轨道背景：`bg-gray-2`
- ✅ 滑块背景：`bg-gray-5`，悬停 `bg-gray-6`
- ✅ 圆角：3px

## 九、交互规范

### 9.1 过渡动画
- ✅ 颜色过渡：`transition-colors`
- ✅ 阴影过渡：`transition-shadow duration-300`
- ✅ 变换过渡：`transition-transform duration-300`
- ✅ 悬停效果：使用 `hover:` 前缀

### 9.2 状态反馈
- ✅ 按钮点击：`active:scale-95`
- ✅ 输入框聚焦：`focus:ring-4 focus:ring-brand/10`
- ✅ 未保存状态：使用呼吸动画 `.animate-breathe`

### 9.3 禁用状态
- ✅ 背景：`bg-gray-2`
- ✅ 文字：`text-text-disabled`
- ✅ 光标：`cursor-not-allowed`
- ✅ 不响应交互事件

## 十、图标规范

### 10.1 图标库
- 使用 **Lucide React** 图标库
- 图标尺寸统一：`w-4 h-4` (16px) 或 `w-5 h-5` (20px)

### 10.2 图标颜色
- ✅ 默认：`text-text-placeholder` 或 `text-gray-6`
- ✅ 激活：`text-brand`
- ✅ 悬停：`text-text-secondary` 或 `text-brand`

### 10.3 图标间距
- ✅ 图标与文字间距：`gap-xs` (8px) 或 `gap-sm` (12px)

## 十一、代码规范

### 11.1 CSS 变量使用
```css
/* ✅ 正确 */
color: var(--text-primary);
background: var(--color-brand);
padding: var(--space-md);

/* ❌ 错误 */
color: #1A1A1A;
background: #2B7FFF;
padding: 16px;
```

### 11.2 Tailwind 类名使用
```jsx
// ✅ 正确
<div className="bg-brand text-white p-md rounded-md shadow-light">

// ❌ 错误
<div className="bg-[#2B7FFF] text-white p-[16px] rounded-[8px]">
```

### 11.3 组件样式
- ✅ 优先使用 Tailwind 工具类
- ✅ 复杂样式使用 CSS 变量
- ✅ 避免内联样式（装饰性元素除外）

## 十二、设计原则总结

1. **一致性**: 所有组件遵循统一的设计系统
2. **可访问性**: 确保足够的对比度和清晰的交互反馈
3. **响应式**: 适配移动端和桌面端
4. **性能**: 使用 CSS 变量和 Tailwind 优化性能
5. **可维护性**: 使用语义化的类名和组件

---

**最后更新**: 2025年
**维护者**: 开发团队