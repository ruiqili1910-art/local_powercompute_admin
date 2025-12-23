/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      /* ==========================================
         字体系统 Typography System
      ========================================== */
      fontFamily: {
        sans: ['"Noto Sans SC"', '"PingFang SC"', '"Microsoft YaHei"', 'sans-serif'],
      },
      fontSize: {
        'title': ['20px', { lineHeight: '28px', fontWeight: '600' }],   // 页面标题
        'section': ['16px', { lineHeight: '24px', fontWeight: '500' }], // 区块标题
        'body': ['14px', { lineHeight: '22px', fontWeight: '400' }],    // 正文
        'caption': ['12px', { lineHeight: '18px', fontWeight: '400' }], // 辅助文字
      },
      fontWeight: {
        regular: '400',
        medium: '500',
        semibold: '600',
      },
      /* ==========================================
         间距系统 Spacing System
      ========================================== */
      spacing: {
        'xxs': '4px',   // 图标间距、tag
        'xs': '8px',    // 小组件内边距
        'sm': '12px',   // 表格、小表单间距
        'md': '16px',   // 常规内容间距（最常用）
        'lg': '20px',   // 卡片内部 padding
        'xl': '24px',   // 页面内边距（常用）
        'xxl': '32px',  // 区块分隔、上方空白
        'xxxl': '40px', // Banner、大块视觉区
      },
      /* ==========================================
         圆角系统 Radius System
      ========================================== */
      borderRadius: {
        'xs': '4px',   // icon 背景、小标签
        'sm': '6px',   // 输入框、按钮
        'md': '8px',   // 卡片、表格容器（推荐）
        'lg': '12px',  // 弹窗、较大块内容
        'xl': '16px',  // 登录框、Banner 卡片
      },
      /* ==========================================
         颜色系统 Color System
      ========================================== */
      colors: {
        // 品牌色 Brand Colors
        brand: {
          DEFAULT: '#2B7FFF',
          hover: '#589AFF',
          active: '#1F6DDB',
          light: '#E6F1FF',
        },
        // 成功色 Success
        success: {
          DEFAULT: '#27C46A',
          hover: '#44D589',
          light: '#E8FFF3',
        },
        // 警告色 Warning
        warning: {
          DEFAULT: '#FFB020',
          hover: '#FFC348',
          light: '#FFF7E8',
        },
        // 错误色 Error
        error: {
          DEFAULT: '#FF4D4F',
          hover: '#FF6B6D',
          light: '#FFECEC',
        },
        // 辅助色 Auxiliary
        aux: {
          highlight: '#5EA8FF',
          light: '#A5CDFF',
          indigo: '#204ECF',
          cyan: '#34D5FF',
        },
        // 中性色 Neutrals
        gray: {
          1: '#FFFFFF',
          2: '#FAFAFA',
          3: '#F5F7FA',
          4: '#E6E8EB',
          5: '#CBD0D6',
          6: '#8A9099',
          7: '#4B4F55',
          8: '#1C1F23',
        },
        // 文本颜色 Text Colors
        text: {
          primary: '#1A1A1A',
          regular: '#333333',
          secondary: '#666666',
          placeholder: '#999999',
          disabled: '#C2C2C2',
          link: '#2B7FFF',
          success: '#27C652',
          warning: '#FAAD14',
          error: '#FF4D4F',
        },
      },
      /* ==========================================
         阴影系统 Shadow System
      ========================================== */
      boxShadow: {
        'base': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'light': '0 2px 6px rgba(0, 0, 0, 0.05)',
        'strong': '0 8px 24px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [],
}
