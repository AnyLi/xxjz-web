<template>
  <div class="home-page">
    <img :src="staticURL + 'adminBack.png'" class="backImg" alt="">
    <div class="contentWrap flexCenter">
      <router-link to="/set-quantity">
        <button class="button">
          <div class="arrowContainer">
            <svg width="25" height="25" viewBox="0 0 45 38" fill="none"
              xmlns="http://www.w3.org/2000/svg" style="transform: rotate(180deg);">
              <path
                d="M43.7678 20.7678C44.7441 19.7915 44.7441 18.2085 43.7678 17.2322L27.8579 1.32233C26.8816 0.34602 25.2986 0.34602 24.3223 1.32233C23.346 2.29864 23.346 3.88155 24.3223 4.85786L38.4645 19L24.3223 33.1421C23.346 34.1184 23.346 35.7014 24.3223 36.6777C25.2986 37.654 26.8816 37.654 27.8579 36.6777L43.7678 20.7678ZM0 21.5L42 21.5V16.5L0 16.5L0 21.5Z"
                fill="black"></path>
            </svg>
          </div>
          <div class="bgContainer">
            <span>库存管理</span>
            <span>库存管理</span>
          </div>
        </button>
      </router-link>
      <router-link to="/preview-quantity">
        <button class="button">
          <div class="bgContainer">
            <span>库存预览</span>
            <span>库存预览</span>
          </div>
          <div class="arrowContainer">
            <svg width="25" height="25" viewBox="0 0 45 38" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M43.7678 20.7678C44.7441 19.7915 44.7441 18.2085 43.7678 17.2322L27.8579 1.32233C26.8816 0.34602 25.2986 0.34602 24.3223 1.32233C23.346 2.29864 23.346 3.88155 24.3223 4.85786L38.4645 19L24.3223 33.1421C23.346 34.1184 23.346 35.7014 24.3223 36.6777C25.2986 37.654 26.8816 37.654 27.8579 36.6777L43.7678 20.7678ZM0 21.5L42 21.5V16.5L0 16.5L0 21.5Z"
                fill="black"></path>
            </svg>
          </div>
        </button>
      </router-link>
    </div>
  </div>
</template>

<script>
import { staticURL } from '@/api/request'

export default {
  name: 'Home',
  data() {
    return {
      staticURL
    }
  }
}
</script>

<style scoped>
.home-page {
  position: relative;
  width: 100vw;
  height: 100vh;
}

.backImg {
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  display: block;
}

.contentWrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}
</style>
