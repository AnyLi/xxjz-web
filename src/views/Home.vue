<template>
  <div class="home-page">
    <img :src="staticURL + 'adminBack.png'" class="backImg" alt="">
    <div class="contentWrap">
      <div class="panel">
        <h1 class="title">管理后台</h1>

        <div class="btn-group">
          <router-link to="/set-quantity" class="btn pc">
            <svg viewBox="0 0 24 24" class="btn-icon">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
              <line x1="12" y1="22.08" x2="12" y2="12"/>
            </svg>
            <span>库存管理</span>
          </router-link>

          <router-link to="/preview-quantity" class="btn pc">
            <svg viewBox="0 0 24 24" class="btn-icon">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            <span>库存预览</span>
          </router-link>

          <router-link to="/set-logistics" class="btn pc">
            <svg viewBox="0 0 24 24" class="btn-icon">
              <rect x="1" y="3" width="15" height="13"/>
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
              <circle cx="5.5" cy="18.5" r="2.5"/>
              <circle cx="18.5" cy="18.5" r="2.5"/>
            </svg>
            <span>物流设置</span>
          </router-link>

          <router-link to="/price" class="btn pc">
            <svg viewBox="0 0 24 24" class="btn-icon">
              <line x1="12" y1="1" x2="12" y2="23"/>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            <span>价格管理</span>
          </router-link>
        </div>

        <div class="divider"></div>

        <div class="btn-group">
          <router-link to="/aidc" class="btn mobile">
            <svg viewBox="0 0 24 24" class="btn-icon">
              <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/>
              <circle cx="8" cy="14" r="2"/>
              <circle cx="16" cy="14" r="2"/>
            </svg>
            <span>AIDC</span>
          </router-link>

          <router-link to="/fast-set-img" class="btn mobile">
            <svg viewBox="0 0 24 24" class="btn-icon">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
            <span>快速设图</span>
          </router-link>

          <router-link to="/group-img" class="btn mobile">
            <svg viewBox="0 0 24 24" class="btn-icon">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            <span>组合图片</span>
          </router-link>

          <router-link to="/set-img" class="btn mobile">
            <svg viewBox="0 0 24 24" class="btn-icon">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            <span>图片设置</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { staticURL } from "@/api/request";

export default {
  name: "Home",
  data() {
    return {
      staticURL,
    };
  },
};
</script>

<style scoped>
.home-page {
  position: relative;
  width: 100vw;
  min-height: 100vh;
}

.backImg {
  position: fixed;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  z-index: 0;
}

.contentWrap {
  position: relative;
  z-index: 1;
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  box-sizing: border-box;
}

.panel {
  background: rgba(255, 255, 255, 0.92);
  border-radius: 20px;
  padding: 48px 56px;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(12px);
}

.title {
  text-align: center;
  font-size: 28px;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 36px 0;
  letter-spacing: 3px;
}

.btn-group {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
  margin: 28px 0;
}

.btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  border-radius: 16px;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
}

.btn.pc {
  background: linear-gradient(145deg, #6366f1, #8b5cf6);
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
  color: #fff;
}

.btn.pc:hover {
  transform: translateY(-6px);
  box-shadow: 0 14px 36px rgba(99, 102, 241, 0.5);
}

.btn.mobile {
  background: linear-gradient(145deg, #10b981, #34d399);
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4);
  color: #fff;
}

.btn.mobile:hover {
  transform: translateY(-6px);
  box-shadow: 0 14px 36px rgba(16, 185, 129, 0.5);
}

.btn-icon {
  width: 36px;
  height: 36px;
  margin-bottom: 10px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.btn span {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 1px;
}

@media (max-width: 640px) {
  .panel {
    padding: 32px 24px;
  }

  .btn-group {
    gap: 12px;
  }

  .btn {
    width: 100px;
    height: 100px;
  }

  .btn-icon {
    width: 28px;
    height: 28px;
  }

  .btn span {
    font-size: 12px;
  }

  .title {
    font-size: 22px;
  }
}
</style>
