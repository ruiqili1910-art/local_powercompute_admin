import { useState } from 'react';
import { User, Lock, Eye, EyeOff, QrCode, Check } from 'lucide-react';

const LoginPage = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    captcha: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [captchaCode, setCaptchaCode] = useState(generateCaptcha());
  const [activeTab, setActiveTab] = useState('account'); // account | qrcode
  const [errorMsg, setErrorMsg] = useState('');

  // 默认账号信息
  const DEFAULT_USERNAME = 'admin';
  const DEFAULT_PASSWORD = '1234';

  // 生成随机验证码
  function generateCaptcha() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let result = '';
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // 刷新验证码
  const refreshCaptcha = () => {
    setCaptchaCode(generateCaptcha());
  };

  // 处理登录
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (!formData.username) {
      setErrorMsg('请输入用户名');
      return;
    }
    if (!formData.password) {
      setErrorMsg('请输入密码');
      return;
    }
    if (formData.captcha.toLowerCase() !== captchaCode.toLowerCase()) {
      setErrorMsg('验证码错误');
      refreshCaptcha();
      return;
    }
    
    // 验证账号密码
    if (formData.username !== DEFAULT_USERNAME || formData.password !== DEFAULT_PASSWORD) {
      setErrorMsg('用户名或密码错误');
      return;
    }
    
    // 登录成功
    onLogin && onLogin(formData);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-brand-light to-[#DBEAFE] font-sans">
      {/* 背景网格纹理 */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* 装饰性弥散圆形 - 左上 */}
      <div 
        className="absolute pointer-events-none"
        style={{
          left: '-100px',
          top: '-50px',
          width: '550px',
          height: '380px',
          borderRadius: '50%',
          background: 'rgba(190, 219, 255, 0.3)',
          filter: 'blur(80px)',
        }}
      />
      
      {/* 装饰性弥散圆形 - 右下 */}
      <div 
        className="absolute pointer-events-none"
        style={{
          right: '-50px',
          bottom: '-50px',
          width: '440px',
          height: '300px',
          borderRadius: '50%',
          background: 'rgba(198, 210, 255, 0.3)',
          filter: 'blur(80px)',
        }}
      />

      {/* 主容器 */}
      <div className="relative z-10 flex items-center gap-xxl px-md sm:px-xl">
        {/* 左侧插图区域 */}
        <div className="hidden lg:flex flex-col items-center justify-center">
          <img 
            src="./login-illustration.png" 
            alt="CMS系统插图"
            className="w-[480px] h-auto object-contain"
          />
        </div>

        {/* 右侧登录表单卡片 */}
        <div className="bg-white rounded-xl shadow-strong w-[300px] overflow-hidden relative">
          {/* 扫码登录角标 */}
          <button 
            className="absolute top-0 right-0 w-xxxl h-xxxl bg-brand-light flex items-center justify-center rounded-bl-lg hover:bg-brand-light/80 transition-colors group"
            title="扫码登录"
          >
            <QrCode className="w-4 h-4 text-brand" />
            {/* 提示气泡 */}
            <div className="absolute right-12 top-2 bg-white border border-gray-4 px-xs py-xxs rounded-xs text-caption text-text-primary opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-light">
              Scan to Login
            </div>
          </button>

          {/* 表单区域 */}
          <div className="p-lg">
            {/* 切换标签 */}
            <div className="flex items-center gap-lg mb-lg border-b border-transparent">
              <button 
                onClick={() => setActiveTab('account')}
                className="relative pb-xs"
              >
                <span className={`text-body font-medium transition-colors ${
                  activeTab === 'account' ? 'text-text-primary' : 'text-text-placeholder'
                }`}>
                  账号登录
                </span>
                {activeTab === 'account' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand rounded-full" />
                )}
              </button>
              <button 
                onClick={() => setActiveTab('qrcode')}
                className="relative pb-xs"
              >
                <span className={`text-body font-medium transition-colors ${
                  activeTab === 'qrcode' ? 'text-text-primary' : 'text-text-placeholder'
                }`}>
                  扫码登录
                </span>
                {activeTab === 'qrcode' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand rounded-full" />
                )}
              </button>
            </div>

            {activeTab === 'account' ? (
              <form onSubmit={handleSubmit} className="space-y-md">
                {/* 错误提示 */}
                {errorMsg && (
                  <div className="text-caption text-error bg-error-light px-sm py-xs rounded-sm">
                    {errorMsg}
                  </div>
                )}

                {/* 用户名输入框 */}
                <div className="relative">
                  <div className="absolute left-sm top-1/2 -translate-y-1/2 text-text-placeholder">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="用户名"
                    value={formData.username}
                    onChange={e => setFormData({...formData, username: e.target.value})}
                    className="w-full h-[36px] pl-xxxl pr-sm bg-gray-3 rounded-sm text-body text-text-primary placeholder:text-text-placeholder focus:outline-none focus:ring-2 focus:ring-brand/20 focus:bg-white transition-all"
                  />
                </div>

                {/* 密码输入框 */}
                <div className="relative">
                  <div className="absolute left-sm top-1/2 -translate-y-1/2 text-text-placeholder">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="密码"
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    className="w-full h-[36px] pl-xxxl pr-xxxl bg-gray-3 rounded-sm text-body text-text-primary placeholder:text-text-placeholder focus:outline-none focus:ring-2 focus:ring-brand/20 focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-sm top-1/2 -translate-y-1/2 text-text-placeholder hover:text-text-secondary transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* 验证码输入框 */}
                <div className="flex gap-xs">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="验证码"
                      value={formData.captcha}
                      onChange={e => setFormData({...formData, captcha: e.target.value})}
                      maxLength={4}
                      className="w-full h-[36px] px-sm bg-gray-3 rounded-sm text-body text-text-primary placeholder:text-text-placeholder focus:outline-none focus:ring-2 focus:ring-brand/20 focus:bg-white transition-all"
                    />
                  </div>
                  {/* 验证码图片 */}
                  <button
                    type="button"
                    onClick={refreshCaptcha}
                    className="w-[85px] h-[36px] border border-gray-4 rounded-sm flex items-center justify-center bg-gradient-to-r from-gray-3 to-white relative overflow-hidden hover:border-brand/50 transition-colors"
                  >
                    {/* 噪点装饰 */}
                    <div className="absolute inset-0">
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-0.5 h-0.5 rounded-full bg-text-placeholder"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            opacity: 0.3 + Math.random() * 0.3
                          }}
                        />
                      ))}
                    </div>
                    <span 
                      className="text-section font-semibold italic text-text-primary tracking-[1.5px] select-none relative z-10"
                      style={{ fontFamily: 'Courier New, monospace' }}
                    >
                      {captchaCode}
                    </span>
                  </button>
                </div>

                {/* 记住密码 & 忘记密码 */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-xs cursor-pointer group">
                    <div 
                      className={`w-3.5 h-3.5 rounded-xs border flex items-center justify-center transition-all ${
                        formData.rememberMe 
                          ? 'bg-brand border-brand' 
                          : 'border-gray-5 bg-white group-hover:border-brand/50'
                      }`}
                      onClick={() => setFormData({...formData, rememberMe: !formData.rememberMe})}
                    >
                      {formData.rememberMe && <Check className="w-2.5 h-2.5 text-white" />}
                    </div>
                    <span className="text-caption text-text-secondary">记住密码</span>
                  </label>
                  <button type="button" className="text-caption text-text-placeholder hover:text-brand transition-colors">
                    忘记密码
                  </button>
                </div>

                {/* 登录按钮 */}
                <button
                  type="submit"
                  className="w-full h-[36px] bg-brand hover:bg-brand-active text-white text-body font-medium rounded-full transition-colors shadow-base"
                >
                  登 录
                </button>

                {/* 新用户注册 */}
                <div className="text-center">
                  <button type="button" className="text-caption font-medium text-brand hover:underline">
                    新用户注册
                  </button>
                </div>

                {/* 默认账号提示 */}
                <div className="text-center pt-xs border-t border-gray-4">
                  <p className="text-[11px] text-text-placeholder">
                    默认账号: <span className="text-text-secondary font-medium">admin</span> / <span className="text-text-secondary font-medium">1234</span>
                  </p>
                </div>
              </form>
            ) : (
              /* 扫码登录内容 */
              <div className="flex flex-col items-center justify-center py-md">
                <div className="w-xxl h-xxl bg-gray-3 rounded-md flex items-center justify-center mb-md border border-gray-4" style={{ width: '128px', height: '128px' }}>
                  <QrCode className="w-20 h-20 text-text-primary" />
                </div>
                <p className="text-caption text-text-secondary">请使用手机扫描二维码登录</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 底部版权信息 */}
      <div className="absolute bottom-lg left-0 right-0 text-center text-caption text-text-placeholder">
        © 2024 企业内容管理系统 · All Rights Reserved
      </div>
    </div>
  );
};

export default LoginPage;
