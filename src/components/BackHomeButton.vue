<template>
  <div class="back-home-btn" :class="[theme, { 'in-header': inHeader }]" @click="goHome">
    <van-icon v-if="!inHeader" name="wap-home-o" />
    <i v-else class="el-icon-house"></i>
    <span>返回主页</span>
  </div>
</template>

<script>
export default {
  name: 'BackHomeButton',
  props: {
    // 主题风格: 'light' 白底紫字, 'gradient' 渐变紫底白字
    theme: {
      type: String,
      default: 'light',
      validator: (val) => ['light', 'gradient'].includes(val)
    },
    // 是否在页面头部内使用（非固定定位）
    inHeader: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    goHome() {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
/* ==================== 基础样式 ==================== */
.back-home-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
}

/* 固定定位模式（默认） */
.back-home-btn:not(.in-header) {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 999;
}

/* ==================== 浅色主题（白底紫字） ==================== */
.back-home-btn.light {
  background: #fff;
  color: #667eea;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
}

.back-home-btn.light:hover {
  background: #667eea;
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
}

.back-home-btn.light:active {
  transform: translateY(0);
}

/* ==================== 渐变主题（渐变紫底白字） ==================== */
.back-home-btn.gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.back-home-btn.gradient:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
}

.back-home-btn.gradient:active {
  transform: translateY(0);
  background: linear-gradient(135deg, #5a6fd6 0%, #6a4190 100%);
}

/* ==================== 头部内嵌模式 ==================== */
.back-home-btn.in-header {
  padding: 8px 16px;
  font-size: 13px;
}

/* ==================== 图标样式 ==================== */
.back-home-btn .van-icon,
.back-home-btn i {
  font-size: 18px;
}

.back-home-btn.in-header .van-icon,
.back-home-btn.in-header i {
  font-size: 16px;
}
</style>
