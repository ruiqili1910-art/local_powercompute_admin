import { useState, useRef, useCallback } from 'react';
import { 
  Bold, Italic, Underline, Link, Quote, Code, 
  List, ListOrdered, Table, Image, Heading1, Heading2,
  AtSign, Hash, Maximize2, HelpCircle, Eye, Edit3, Palette
} from 'lucide-react';

/**
 * 富文本编辑器组件
 * 支持 Markdown 语法和工具栏操作
 */
const RichTextEditor = ({ 
  value = '', 
  onChange, 
  placeholder = '在此输入描述内容（支持 Markdown）',
  minHeight = 200 
}) => {
  const [mode, setMode] = useState('edit'); // 'edit' | 'preview'
  const [showColorPicker, setShowColorPicker] = useState(false);
  const editorRef = useRef(null);

  // 颜色选项
  const colorOptions = [
    { label: '默认', value: '#1A1A1A' },
    { label: '蓝色', value: '#155DFC' },
    { label: '金色', value: '#D4A017' },
    { label: '绿色', value: '#16A34A' },
    { label: '红色', value: '#DC2626' },
    { label: '橙色', value: '#EA580C' },
    { label: '紫色', value: '#9333EA' },
    { label: '灰色', value: '#6B7280' },
  ];

  // 插入文本
  const insertText = useCallback((before, after = '', placeholder = '') => {
    const textarea = editorRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || placeholder;
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    
    onChange(newText);
    
    // 设置光标位置
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  }, [value, onChange]);

  // 工具栏操作
  const toolbarActions = [
    { 
      icon: Heading1, 
      title: '标题 H1', 
      action: () => insertText('# ', '', '标题文字'),
      group: 'heading'
    },
    { 
      icon: Bold, 
      title: '粗体', 
      action: () => insertText('**', '**', '粗体文字'),
      group: 'format'
    },
    { 
      icon: Italic, 
      title: '斜体', 
      action: () => insertText('*', '*', '斜体文字'),
      group: 'format'
    },
    { 
      icon: Link, 
      title: '链接', 
      action: () => insertText('[', '](url)', '链接文字'),
      group: 'insert'
    },
    { 
      icon: Quote, 
      title: '引用', 
      action: () => insertText('> ', '', '引用内容'),
      group: 'insert'
    },
    { 
      icon: Code, 
      title: '代码', 
      action: () => insertText('`', '`', 'code'),
      group: 'insert'
    },
    { 
      icon: Table, 
      title: '表格', 
      action: () => insertText('\n| 列1 | 列2 | 列3 |\n| --- | --- | --- |\n| 内容 | 内容 | 内容 |\n', ''),
      group: 'block'
    },
    { 
      icon: List, 
      title: '无序列表', 
      action: () => insertText('- ', '', '列表项'),
      group: 'list'
    },
    { 
      icon: ListOrdered, 
      title: '有序列表', 
      action: () => insertText('1. ', '', '列表项'),
      group: 'list'
    },
    { 
      icon: AtSign, 
      title: '提及', 
      action: () => insertText('@', '', '用户名'),
      group: 'special'
    },
    { 
      icon: Hash, 
      title: '标签', 
      action: () => insertText('#', ' ', '标签'),
      group: 'special'
    },
  ];

  // 插入颜色文字
  const insertColorText = (color) => {
    insertText(`<span style="color:${color}">`, '</span>', '彩色文字');
    setShowColorPicker(false);
  };

  // 简单的 Markdown 渲染（用于预览）
  const renderMarkdown = (text) => {
    if (!text) return '';
    
    let html = text
      // 转义 HTML
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      // 标题
      .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold text-gray-8 mt-4 mb-2">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 class="text-xl font-semibold text-gray-8 mt-4 mb-2">$1</h2>')
      .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-gray-8 mt-4 mb-2">$1</h1>')
      // 粗体和斜体
      .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // 行内代码
      .replace(/`(.+?)`/g, '<code class="px-1 py-0.5 bg-gray-100 rounded text-sm font-mono text-red-600">$1</code>')
      // 链接
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-brand hover:underline">$1</a>')
      // 引用
      .replace(/^&gt; (.+)$/gm, '<blockquote class="pl-4 border-l-4 border-brand text-gray-6 my-2">$1</blockquote>')
      // 列表
      .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
      .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>')
      // 水平线
      .replace(/^---$/gm, '<hr class="my-4 border-gray-300">')
      // 换行
      .replace(/\n/g, '<br>');
    
    // 恢复 span 标签（用于颜色）
    html = html.replace(/&lt;span style="color:(.+?)"&gt;/g, '<span style="color:$1">');
    html = html.replace(/&lt;\/span&gt;/g, '</span>');
    
    return html;
  };

  return (
    <div className="border border-gray-4 rounded-md overflow-hidden">
      {/* 工具栏 */}
      <div className="flex items-center justify-between px-sm py-xs bg-gray-2 border-b border-gray-4">
        {/* 左侧：模式切换 */}
        <div className="flex items-center border border-gray-4 rounded-sm overflow-hidden">
          <button
            onClick={() => setMode('edit')}
            className={`px-sm py-xxs text-caption font-medium transition-colors ${
              mode === 'edit' 
                ? 'bg-white text-gray-8' 
                : 'text-gray-6 hover:text-gray-8'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5 inline mr-1" />
            编辑
          </button>
          <button
            onClick={() => setMode('preview')}
            className={`px-sm py-xxs text-caption font-medium transition-colors ${
              mode === 'preview' 
                ? 'bg-white text-gray-8' 
                : 'text-gray-6 hover:text-gray-8'
            }`}
          >
            <Eye className="w-3.5 h-3.5 inline mr-1" />
            预览
          </button>
        </div>

        {/* 中间：格式工具 */}
        <div className="flex items-center gap-xxs">
          {toolbarActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              title={action.title}
              className="p-xs text-gray-6 hover:text-gray-8 hover:bg-gray-3 rounded transition-colors"
            >
              <action.icon className="w-4 h-4" />
            </button>
          ))}
          
          {/* 颜色选择器 */}
          <div className="relative">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              title="文字颜色"
              className={`p-xs rounded transition-colors ${
                showColorPicker ? 'text-brand bg-brand-light' : 'text-gray-6 hover:text-gray-8 hover:bg-gray-3'
              }`}
            >
              <Palette className="w-4 h-4" />
            </button>
            
            {showColorPicker && (
              <div className="absolute top-full right-0 mt-1 p-sm bg-white rounded-md shadow-strong border border-gray-4 z-10">
                <div className="grid grid-cols-4 gap-xs">
                  {colorOptions.map(color => (
                    <button
                      key={color.value}
                      onClick={() => insertColorText(color.value)}
                      title={color.label}
                      className="w-6 h-6 rounded-sm border border-gray-4 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color.value }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="w-px h-4 bg-gray-4 mx-xs" />
          
          <button
            title="全屏编辑"
            className="p-xs text-gray-6 hover:text-gray-8 hover:bg-gray-3 rounded transition-colors"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            title="帮助"
            className="p-xs text-gray-6 hover:text-gray-8 hover:bg-gray-3 rounded transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>

        {/* 右侧：模板 */}
        <button className="px-sm py-xxs text-caption text-gray-6 hover:text-gray-8 border border-gray-4 rounded-sm hover:bg-gray-3 transition-colors">
          模板
        </button>
      </div>

      {/* 编辑区域 */}
      {mode === 'edit' ? (
        <textarea
          ref={editorRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-md py-sm text-body text-gray-8 placeholder-gray-5 resize-none focus:outline-none"
          style={{ minHeight: `${minHeight}px` }}
        />
      ) : (
        <div 
          className="w-full px-md py-sm text-body text-gray-8 overflow-auto"
          style={{ minHeight: `${minHeight}px` }}
          dangerouslySetInnerHTML={{ __html: renderMarkdown(value) || `<span class="text-gray-5">${placeholder}</span>` }}
        />
      )}
    </div>
  );
};

export default RichTextEditor;




