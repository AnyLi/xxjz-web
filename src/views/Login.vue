<template>
  <div class="login-page">
    <!-- 背景装饰 -->
    <div class="bg-decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>

    <div class="login-container">
      <!-- 左侧装饰区域 -->
      <div class="login-left">
        <div class="brand-area">
          <div class="logo-icon">
            <img src="/favicon.ico" alt="小熊记账" class="logo-img" />
          </div>
          <h1>小熊记账</h1>
          <p>简单记账，轻松生活</p>
        </div>
        <div class="feature-list">
          <div class="feature-item">
            <i class="el-icon-coin"></i>
            <span>轻松记录收支</span>
          </div>
          <div class="feature-item">
            <i class="el-icon-pie-chart"></i>
            <span>智能分类统计</span>
          </div>
          <div class="feature-item">
            <i class="el-icon-data-line"></i>
            <span>收支趋势分析</span>
          </div>
        </div>
      </div>

      <!-- 右侧登录表单 -->
      <div class="login-right">
        <div class="login-form-container">
          <div class="welcome-text">
            <h2>欢迎回来</h2>
            <p>请登录您的账号继续操作</p>
          </div>

          <el-form ref="loginForm" :model="form" :rules="rules" class="login-form">
            <el-form-item prop="phone">
              <div class="input-wrapper">
                <div class="input-icon">
                  <i class="el-icon-mobile-phone"></i>
                </div>
                <el-input
                  v-model="form.phone"
                  placeholder="请输入手机号"
                  @keyup.enter.native="handleLogin"
                />
              </div>
            </el-form-item>

            <el-form-item prop="password">
              <div class="input-wrapper">
                <div class="input-icon">
                  <i class="el-icon-lock"></i>
                </div>
                <el-input
                  v-model="form.password"
                  type="password"
                  placeholder="请输入密码"
                  show-password
                  @keyup.enter.native="handleLogin"
                />
              </div>
            </el-form-item>

      
            <el-form-item>
              <button
                type="button"
                class="login-btn"
                :class="{ loading: loading }"
                :disabled="loading"
                @click="handleLogin"
              >
                <span v-if="!loading">登 录</span>
                <span v-else>
                  <i class="el-icon-loading"></i> 登录中...
                </span>
              </button>
            </el-form-item>
          </el-form>

          <div class="login-footer">
            <p>© 2026 小熊记账 · 安全登录</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { login } from '@/api/request'

export default {
  name: 'Login',
  data() {
    return {
      form: {
        phone: '',
        password: ''
      },
      rules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 4, message: '密码长度不能少于4位', trigger: 'blur' }
        ]
      },
      loading: false,
      rememberMe: false
    }
  },
  mounted() {
    // 检查是否有记住的账号
    const savedPhone = localStorage.getItem('rememberedPhone')
    if (savedPhone) {
      this.form.phone = savedPhone
      this.rememberMe = true
    }
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(async valid => {
        if (!valid) return

        this.loading = true
        try {
          const res = await login(this.form.phone, this.form.password)

          // 保存 token 和用户信息
          localStorage.setItem('token', res.data.token)
          localStorage.setItem('user', JSON.stringify(res.data.user))

          // 记住账号
          if (this.rememberMe) {
            localStorage.setItem('rememberedPhone', this.form.phone)
          } else {
            localStorage.removeItem('rememberedPhone')
          }

          this.$message.success(`欢迎回来，${res.data.user.name}！`)

          // 跳转到首页
          this.$router.push('/')
        } catch (error) {
          this.$message.error(error || '登录失败，请检查账号密码')
        } finally {
          this.loading = false
        }
      })
    }
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #FDF6E3 0%, #F5EDDC 50%, #EDE4D3 100%);
  position: relative;
  overflow: hidden;
}

/* 背景装饰圆 */
.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(212, 165, 116, 0.15), rgba(200, 150, 100, 0.15));
  animation: float 6s ease-in-out infinite;
}

.circle-1 {
  width: 400px;
  height: 400px;
  top: -100px;
  right: -100px;
  animation-delay: 0s;
}

.circle-2 {
  width: 300px;
  height: 300px;
  bottom: -50px;
  left: -50px;
  animation-delay: 2s;
}

.circle-3 {
  width: 200px;
  height: 200px;
  top: 50%;
  left: 10%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
}

/* 登录容器 */
.login-container {
  display: flex;
  width: 900px;
  min-height: 520px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  position: relative;
  z-index: 10;
}

/* 左侧区域 */
.login-left {
  flex: 1;
  background: linear-gradient(135deg, #D4A574 0%, #C9956C 100%);
  padding: 50px 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.login-left::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%);
  animation: rotate 20s linear infinite;
}

@keyframes rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.brand-area {
  text-align: center;
  color: #fff;
  position: relative;
  z-index: 1;
  margin-bottom: 40px;
}

.logo-icon {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 20px;
  font-size: 40px;
  backdrop-filter: blur(10px);
  padding: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.brand-area h1 {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 10px;
  letter-spacing: 2px;
}

.brand-area p {
  font-size: 14px;
  opacity: 0.8;
}

.feature-list {
  position: relative;
  z-index: 1;
}

.feature-item {
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.9);
  padding: 12px 20px;
  margin-bottom: 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;
}

.feature-item:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateX(5px);
}

.feature-item i {
  font-size: 20px;
  margin-right: 12px;
}

.feature-item span {
  font-size: 14px;
}

/* 右侧登录表单 */
.login-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 50px 40px;
}

.login-form-container {
  width: 100%;
  max-width: 320px;
}

.welcome-text {
  margin-bottom: 35px;
}

.welcome-text h2 {
  font-size: 28px;
  color: #1a1a2e;
  font-weight: 600;
  margin-bottom: 8px;
}

.welcome-text p {
  color: #888;
  font-size: 14px;
}

/* 输入框样式 */
.input-wrapper {
  display: flex;
  align-items: center;
  background: #f5f7fa;
  border-radius: 12px;
  padding: 0 15px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.input-wrapper:focus-within {
  background: #fff;
  border-color: #FFB300;
  box-shadow: 0 0 0 4px rgba(255, 179, 0, 0.1);
}

.input-icon {
  width: 40px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  font-size: 18px;
}

.input-wrapper:focus-within .input-icon {
  color: #FFB300;
}

.input-wrapper .el-input {
  flex: 1;
}

.input-wrapper ::v-deep .el-input__inner {
  border: none !important;
  background: transparent !important;
  height: 50px;
  font-size: 15px;
  padding-left: 5px;
}

.input-wrapper ::v-deep .el-input__suffix {
  right: 0;
}

/* 登录按钮 */
.login-btn {
  width: 100%;
  height: 52px;
  background: linear-gradient(135deg, #D4A574 0%, #C9956C 100%);
  border: none;
  border-radius: 12px;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.login-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s ease;
}

.login-btn:hover::before {
  left: 100%;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
}

.login-btn:active {
  transform: translateY(0);
}

.login-btn.loading {
  opacity: 0.8;
  cursor: not-allowed;
}

.login-btn.loading:hover {
  transform: none;
  box-shadow: none;
}

/* 底部 */
.login-footer {
  margin-top: 30px;
  text-align: center;
}

.login-footer p {
  color: #bbb;
  font-size: 12px;
}

/* 表单项调整 */
.login-form ::v-deep .el-form-item {
  margin-bottom: 20px;
}

.login-form ::v-deep .el-form-item__error {
  padding-top: 5px;
  padding-left: 55px;
}

/* 响应式 */
@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
    width: 90%;
    max-width: 400px;
  }

  .login-left {
    padding: 30px;
  }

  .brand-area {
    margin-bottom: 20px;
  }

  .feature-list {
    display: none;
  }

  .logo-icon {
    width: 60px;
    height: 60px;
    font-size: 30px;
  }

  .brand-area h1 {
    font-size: 22px;
  }

  .login-right {
    padding: 30px;
  }

  .welcome-text h2 {
    font-size: 22px;
  }
}
</style>
