<template>
  <div class="aidc-page">
    <!-- 返回主页按钮 -->
    <BackHomeButton />

    <div class="scroll-wrapper">
      <div class="container">
      <div class="header">
        <h1>智能文本识别工具</h1>
        <p>粘贴、清理、转换文本内容</p>
      </div>

      <div class="content">
        <div class="status-message status-error">
          <span>内容请按照此格式输入：<br>1放过新郎2(525 121代表)3新郎专属|王牌吹瓶员4滴滴代喝
            <br>区域中包含数字请用英文括号eg:2区 525 121代表请输入2(525 121代表)
            <br>3区需要换行请使用"|" 进行分隔 换行
            <div class="flexYCenter">
              <button class="btn btn-primary" @click="copyUnit('|')" :disabled="loading">
                <i class="fas fa-copy"></i>
                复制"|"
              </button>
              <button class="btn btn-primary" @click="copyUnit('(')" :disabled="loading">
                <i class="fas fa-copy"></i>
                复制"("
              </button>
              <button class="btn btn-primary" @click="copyUnit(')')" :disabled="loading">
                <i class="fas fa-copy"></i>
                复制")"
              </button>
            </div>
          </span>
        </div>

        <div class="textarea-container">
          <textarea class="textarea" v-model="inputText" placeholder="请在此处粘贴文本内容，或点击下方按钮进行操作..."
            @input="clearResult"></textarea>
          <div class="character-count" v-if="inputText">
            {{ inputText.length }} 字符
          </div>
        </div>

        <div class="button-group">
          <button class="btn btn-secondary" @click="clearText" :disabled="loading">
            清空
          </button>
          <button class="btn btn-secondary" @click="pasteFromClipboard" :disabled="loading">
            <i class="fas fa-paste"></i>
            粘贴
          </button>
          <button class="btn btn-primary" @click="processText" :disabled="!inputText || loading">
            <i class="fas fa-cogs"></i>
            识别
          </button>
          <button class="btn btn-primary" @click="pasteAndProcess" :disabled="loading">
            <i class="fas fa-bolt"></i>
            粘贴并识别
          </button>
        </div>

        <div class="theme-section">
          <div class="flexBtCenter">
            <h3 class="theme-title">颜色选择</h3>
            <div class="button-group">
              <button class="btn btn-primary" @click="showSheet=!showSheet" v-if="userId && shopList.length">
                加水印
              </button>
              <button class="btn btn-primary" @click="isCustom=!isCustom">
                切换底图
              </button>
            </div>
            <van-action-sheet v-model="showSheet" :actions="actions" @select="onSelect" />
          </div>
          <div class="theme-options">
            <div class="theme-option theme-black" :class="{ active: selectedTheme === 'black' }"
              @click="changeTheme('black')">
              <div class="theme-color"></div>
              <div class="theme-name">黑色</div>
            </div>
            <div class="theme-option theme-yellow" :class="{ active: selectedTheme === 'yellow' }"
              @click="changeTheme('yellow')">
              <div class="theme-color"></div>
              <div class="theme-name">黄色</div>
            </div>
            <div class="theme-option theme-orange" :class="{ active: selectedTheme === 'orange' }"
              @click="changeTheme('orange')">
              <div class="theme-color"></div>
              <div class="theme-name">橙色</div>
            </div>
            <div class="theme-option theme-red" :class="{ active: selectedTheme === 'red' }"
              @click="changeTheme('red')">
              <div class="theme-color"></div>
              <div class="theme-name">大红</div>
            </div>
          </div>

          <div class="theme-image" ref="themeImage">
            <img :key="selectedTheme" :src="getThemeImage(selectedTheme)"
              :alt="getThemeAlt(selectedTheme)">
            <img v-if="shopInfo && isShowWatermark" :src="shopInfo.backImg" class="backImg">
            <div class="textList">
              <div class="textItem" :class="getClass(item,i)" v-for="(item,i) in processedResult"
                :key="i" v-html="getText(item,i)"></div>
            </div>
          </div>
          <div class="btn btnBot btn-primary" @click="capture">保存</div>
          <div class="btn btnBot" @click="clearAll">清缓存</div>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
import html2canvas from 'html2canvas'
import { get } from '@/api/request'
import { Toast } from 'vant'
import BackHomeButton from '@/components/BackHomeButton.vue'

export default {
  name: 'Aidc',
  components: { BackHomeButton },
  data() {
    return {
      showSheet: false,
      shopList: [],
      actions: [],
      inputText: '',
      processedResult: null,
      loading: false,
      selectedTheme: 'black',
      status: {
        message: '',
        type: 'info',
        icon: ''
      },
      previewImg: '',
      isCustom: true,
      userId: null,
      isShowWatermark: false,
      shopInfo: null
    }
  },
  mounted() {
    // 优先从 Vue Router 获取参数，其次从 URL search 获取
    this.userId = this.$route?.query?.uid || this.getUrlParam('uid')
    this.showStatus('欢迎使用智能文本识别工具', 'info')
    this.getShopList()
  },
  methods: {
    getUrlParam(name) {
      const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
      const r = window.location.search.substr(1).match(reg)
      if (r != null) return decodeURIComponent(r[2])
      return null
    },
    clearAll() {
      sessionStorage.removeItem('shopList')
    },
    getShopList() {
      // 只有传了 userId 才调接口
      if (!this.userId) {
        return
      }

      let listStr = sessionStorage.getItem('shopList')

      // 检查缓存是否有效（非空数组）
      if (listStr) {
        try {
          let list = JSON.parse(listStr)
          if (Array.isArray(list) && list.length > 0) {
            this.shopList = list
            this.setAc()
            return
          }
        } catch (e) {
        }
      }

      // 调用接口获取数据
      get('shop/list').then(res => {
        let data = res.data || []
        this.shopList = data.filter(f => f.userId == this.userId && f.type == 1)
        this.setAc()
        if (this.shopList.length > 0) {
          sessionStorage.setItem('shopList', JSON.stringify(this.shopList))
        }
      }).catch(err => {
        console.error('接口调用失败:', err)
      })
    },
    setAc() {
      this.actions = [{
          name: '不显示水印',
          id: null,
        },
        ...this.shopList
      ]
    },
    onSelect(item) {
      this.showSheet = false
      if (item.id) {
        this.shopInfo = item
        this.isShowWatermark = true
      } else {
        this.isShowWatermark = false
      }
    },
    copyUnit(t) {
      navigator.clipboard.writeText(t)
        .then(() => Toast('复制成功'))
        .catch(err => console.error("复制失败", err))
    },
    getText(item, i) {
      item = String(item).trim()
      let ii = item.indexOf('|')
      if (ii == -1) {
        return item
      } else {
        let arr = item.split('|')
        return arr[0] + '<br>' + arr[1]
      }
    },
    getClass(item, i) {
      item = String(item).trim()
      let l = item.length
      let ii = item.indexOf('|')
      if (ii != -1) {
        let arr = item.split('|')
        let a = Math.max(arr[0].length, arr[1].length)
        l = a * 2
      }
      return ['textItem' + i, 'textItem' + i + l]
    },
    convertParenthesesArray(arr) {
      const result = {}

      arr.forEach(item => {
        const openParenIndex = item.indexOf('(')
        if (openParenIndex !== -1) {
          let keyEnd = openParenIndex
          let keyStart = 0

          const key = parseInt(item.substring(0, openParenIndex))

          const closeParenIndex = item.indexOf(')')
          if (closeParenIndex !== -1) {
            const content = item.substring(openParenIndex + 1, closeParenIndex)

            if (/^\d+$/.test(content.trim())) {
              result[key] = parseInt(content.trim())
            } else {
              result[key] = content.trim()
            }
          }
        }
      })

      return result
    },
    extractFullSegments(str) {
      const segments = []
      let currentIndex = 0

      while (currentIndex < str.length) {
        const openParen = str.indexOf('(', currentIndex)
        if (openParen === -1) break

        const closeParen = str.indexOf(')', openParen)
        if (closeParen === -1) break

        if (openParen > 0) {
          const startIndex = openParen - 1
          const endIndex = closeParen + 1

          const fullSegment = str.substring(startIndex, endIndex)
          segments.push(fullSegment.trim())

          currentIndex = closeParen + 1
        } else {
          currentIndex = openParen + 1
        }
      }

      return segments
    },
    parseString(input) {
      let result = {}
      let currentIndex = 0

      let value = input
      const openParenIndex = value.indexOf('(')
      const closeParenIndex = value.indexOf(')')

      if (openParenIndex !== -1 && closeParenIndex !== -1 && closeParenIndex > openParenIndex) {
        const parenContent = value.substring(openParenIndex + 1, closeParenIndex).trim()

        const beforeParen = value.substring(openParenIndex - 1, openParenIndex).trim()

        if (beforeParen) {
          result[beforeParen] = parenContent
        }
      }
      for (let i = 0; i < input.length; i++) {
        if (/\d/.test(input[i])) {
          const keyStart = i
          while (i < input.length && /\d/.test(input[i])) {
            i++
          }
          const key = parseInt(input.substring(keyStart, i))

          let valueEnd = input.length
          for (let j = i; j < input.length; j++) {
            if (j < input.length - 1 && /\d/.test(input[j + 1])) {
              valueEnd = j + 1
              break
            }

            result[key] = value

            i = valueEnd - 1
          }
        }
      }
      return result
    },
    capture(name, isSave, isFace) {
      this.$nextTick(() => {
        html2canvas(this.$refs['themeImage'], {
          scale: 2,
          useCORS: true,
          backgroundColor: null
        }).then(canvas => {
          let img = canvas.toDataURL('image/png')
          this.previewImg = img
          this.downloadImage(canvas)
        })
      })
    },
    downloadImage(canvas) {
      const link = document.createElement('a')
      link.download = 'screenshot-' + Date.now() + '.png'
      link.href = canvas.toDataURL()
      link.click()
    },
    removeAllParentheses(str) {
      let result = str
      let currentIndex = 0

      while (currentIndex < result.length) {
        const openParen = result.indexOf('(', currentIndex)
        if (openParen === -1) break

        const closeParen = result.indexOf(')', openParen)
        if (closeParen === -1) break

        if (openParen > 0) {
          const startIndex = openParen - 1
          const endIndex = closeParen + 1

          result = result.substring(0, startIndex) + result.substring(endIndex)
          currentIndex = startIndex
        } else {
          currentIndex = openParen + 1
        }
      }

      return result
    },
    smartStringToObject(str) {
      let result = {}
      let cleanedStr = str.replace(/["#$%&'*+\-./:;<=>@[\\\]^_`{}~。；：""''《》〈〉…·]/g, '')
      let result2 = this.extractFullSegments(cleanedStr)
      result = {
        ...this.convertParenthesesArray(result2)
      }
      cleanedStr = this.removeAllParentheses(cleanedStr)
      const regex = /(\d+)([^\d]+?)(?=\d|$)/g
      let match

      while ((match = regex.exec(cleanedStr)) !== null) {
        const key = parseInt(match[1])
        const value = match[2]
        let k = String(key)
        if (k.length > 1) {
          result[k[0]] = value
          result[k[1]] = value
        } else {
          result[key] = value
        }
      }

      return result
    },

    showStatus(message, type = 'info') {
      const icons = {
        info: 'fas fa-info-circle',
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-triangle'
      }

      this.status = {
        message: message,
        type: type,
        icon: icons[type]
      }

      setTimeout(() => {
        this.status = {
          message: '',
          type: 'info',
          icon: ''
        }
      }, 3000)
    },
    clearText() {
      this.inputText = ''
      this.processedResult = null
    },
    async pasteFromClipboard() {
      this.loading = true
      this.showStatus('正在读取剪贴板内容...', 'info')

      try {
        if (navigator.clipboard && navigator.clipboard.readText) {
          const text = await navigator.clipboard.readText()
          this.inputText = text
          this.showStatus('粘贴成功！', 'success')
        } else {
          const textarea = document.createElement('textarea')
          document.body.appendChild(textarea)
          textarea.focus()

          if (document.execCommand('paste')) {
            this.inputText = textarea.value
            this.showStatus('粘贴成功！', 'success')
          } else {
            throw new Error('浏览器不支持剪贴板API')
          }
          document.body.removeChild(textarea)
        }
      } catch (error) {
        console.error('粘贴失败:', error)
        this.showStatus('粘贴失败：' + error.message, 'error')
      } finally {
        this.loading = false
      }
    },

    processText() {
      if (!this.inputText.trim()) {
        this.showStatus('请输入要处理的文本内容', 'error')
        return
      }

      this.loading = true
      this.showStatus('正在处理文本内容...', 'info')

      setTimeout(() => {
        try {
          this.processedResult = this.smartStringToObject(this.inputText)
          if (Object.keys(this.processedResult).length === 0) {
            this.showStatus('未找到匹配的文本模式', 'error')
          } else {
            this.showStatus('处理完成！', 'success')
          }
        } catch (error) {
          console.error('处理失败:', error)
          this.showStatus('处理失败：' + error.message, 'error')
        } finally {
          this.loading = false
        }
      }, 600)
    },

    async pasteAndProcess() {
      await this.pasteFromClipboard()
      if (this.inputText.trim()) {
        setTimeout(() => {
          this.processText()
        }, 200)
      }
    },

    clearResult() {
      // this.processedResult = null
    },

    changeTheme(theme) {
      this.selectedTheme = theme
      this.showStatus(`已切换到${this.getThemeName(theme)}主题`, 'success')
    },

    getThemeImage(theme) {
      const images = {
        black: '',
        yellow: 'huang',
        orange: 'ju',
        red: 'hong',
      }
      return `https://anii-1303089700.cos.ap-chengdu.myqcloud.com/xxjz/hulu${images[theme]}${this.isCustom ? '1' : ''}.png`
    },

    getThemeAlt(theme) {
      const alts = {
        black: '黑葫芦',
        yellow: '黄葫芦',
        orange: '橙葫芦',
        red: '红葫芦'
      }
      return alts[theme]
    },

    getThemeName(theme) {
      const names = {
        black: '黑色',
        yellow: '荧光黄',
        orange: '橙色',
        red: '大红'
      }
      return names[theme]
    }
  }
}
</script>

<style scoped>
.aidc-page {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  height: 100vh;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.scroll-wrapper {
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 16px;
  padding-bottom: 100px;
  box-sizing: border-box;
}

.container {
  width: 375px;
  max-width: 100%;
  margin: 0 auto;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: visible;
  position: relative;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 24px 20px;
  text-align: center;
}

.header h1 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
}

.header p {
  font-size: 14px;
  opacity: 0.9;
}

.content {
  padding: 24px 20px;
}

.status-message {
  padding: 12px 16px;
  border-radius: 10px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
}

.status-info {
  background: #e8f4fd;
  color: #1971c2;
  border: 1px solid #a5d8ff;
}

.status-success {
  background: #d3f9d8;
  color: #2b8a3e;
  border: 1px solid #69db7c;
}

.status-error {
  background: #ffe3e3;
  color: #c92a2a;
  border: 1px solid #ffa8a8;
}

.textarea-container {
  position: relative;
  margin-bottom: 24px;
}

.textarea {
  width: 100%;
  height: 180px;
  padding: 16px;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  font-size: 16px;
  line-height: 1.5;
  resize: none;
  transition: all 0.3s ease;
  font-family: inherit;
  background: #f8f9fa;
}

.textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  background: white;
}

.button-group {
  display: flex;
  gap: 7px;
  justify-content: flex-end;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

.btn {
  padding: 7px 10px;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 70px;
  justify-content: center;
}

.btnBot {
  padding: 15px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-secondary {
  background: #f8f9fa;
  color: #495057;
  border: 1px solid #dee2e6;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.btn:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.theme-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
}

.theme-title {
  font-size: 16px;
  color: #495057;
  margin-bottom: 16px;
  font-weight: 600;
}

.theme-options {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.theme-option {
  flex: 1;
  padding: 12px;
  border: 2px solid #e1e5e9;
  border-radius: 10px;
  text-align: center;
  cursor: pointer;
  background: #f8f9fa;
}

.theme-option.active {
  border-color: #667eea;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.theme-color {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  margin: 0 auto 8px;
}

.theme-black .theme-color {
  background: linear-gradient(135deg, #2d3748 0%, #000000 100%);
}

.theme-yellow .theme-color {
  background: linear-gradient(135deg, #B6F32E 0%, #9BD210 100%);
}

.theme-orange .theme-color {
  background: linear-gradient(135deg, #FC3D1F 0%, #fb923c 100%);
}

.theme-red .theme-color {
  background: linear-gradient(135deg, #f00 0%, #FC3D1F 100%);
}

.theme-name {
  font-size: 12px;
  color: #495057;
  font-weight: 500;
}

.theme-option.active .theme-name {
  color: #667eea;
}

.theme-image {
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.theme-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.backImg {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  width: 100%;
  height: 100%;
}

.textItem {
  position: absolute;
  z-index: 100;
  font-weight: bold;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 黑葫芦前上标 */
.textItem1 {
  top: 145px;
  left: 33px;
  width: 102px;
  height: 16px;
  font-size: 12px;
}

.textItem19 {
  font-size: 11px;
  transform: scale(0.9, 1);
}

.textItem110 {
  font-size: 10px;
  transform: scale(1, 1.1);
}

.textItem111 {
  font-size: 9px;
  transform: scale(1, 1.2);
}

.textItem112,
.textItem113 {
  font-size: 8px;
  transform: scale(1, 1.2);
}

.textItem114,
.textItem115 {
  font-size: 7px;
  transform: scale(1, 1.4);
}

/* 黑葫芦主前标 */
.textItem2 {
  top: 172px;
  left: 23px;
  width: 122px;
  height: 26px;
  font-size: 16px;
}

.textItem21,
.textItem22 {
  font-size: 20px;
  letter-spacing: 10px;
  margin-left: 5px;
}

.textItem23 {
  font-size: 18px;
  letter-spacing: 2px;
}

.textItem26 {
  font-size: 16px;
}

.textItem27,
.textItem28 {
  font-size: 15px;
  transform: scale(0.9, 1.2);
}

.textItem29 {
  font-size: 12px;
  transform: scale(0.9, 1.5);
}

.textItem210 {
  font-size: 12px;
  transform: scale(0.9, 1.4);
}

.textItem211,
.textItem212 {
  font-size: 11px;
  transform: scale(0.9, 1.7);
}

.textItem213,
.textItem214 {
  font-size: 8px;
  transform: scale(1, 1.9);
}

/* 黑葫芦主后标 */
.textItem3 {
  top: 124px;
  left: 216px;
  width: 70px;
  height: 39px;
  font-size: 16px;
  line-height: 17px;
}

.textItem31 {
  font-size: 25px;
}

.textItem32 {
  font-size: 24px;
  letter-spacing: 10px;
  margin-left: 5px;
}

.textItem33 {
  font-size: 18px;
}

.textItem34 {
  font-size: 16px;
}

.textItem35,
.textItem39,
.textItem310 {
  font-size: 13px;
  transform: scale(1, 1.3);
  line-height: 14px;
}

.textItem36,
.textItem311,
.textItem312,
.textItem313,
.textItem314 {
  font-size: 10px;
  transform: scale(1, 1.6);
  line-height: 10px;
}

.textItem315,
.textItem316 {
  font-size: 8px;
  transform: scale(1, 1.9);
  line-height: 9px;
}

/* 黑葫芦后腰 */
.textItem4 {
  top: 173px;
  left: 190px;
  width: 123px;
  height: 16px;
  line-height: 16px;
  font-size: 12px;
}

/* 黑葫芦后腰2 */
.textItem5 {
  top: 213px;
  left: 190px;
  width: 123px;
  height: 16px;
  line-height: 16px;
  font-size: 12px;
}

.textItem410,
.textItem510 {
  transform: scale(0.9, 1);
}

.textItem411,
.textItem511 {
  font-size: 11px;
  transform: scale(0.9, 1);
}

.textItem412,
.textItem512 {
  font-size: 10px;
  transform: scale(0.9, 1);
}

.textItem413,
.textItem414 {
  font-size: 9px;
  transform: scale(1, 1.2);
}

.textItem415,
.textItem416 {
  font-size: 8px;
  transform: scale(1, 1.4);
}

.result-section {
  margin-top: 24px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  border-left: 4px solid #667eea;
}

.result-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.result-title {
  font-size: 16px;
  color: #495057;
  font-weight: 600;
}

.result-content {
  background: white;
  padding: 16px;
  border-radius: 8px;
  font-size: 14px;
  color: #495057;
  line-height: 1.5;
  overflow-x: auto;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #6c757d;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-text {
  font-size: 14px;
  margin-top: 8px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.loading {
  opacity: 0.7;
  pointer-events: none;
}

.character-count {
  position: absolute;
  bottom: 8px;
  right: 8px;
  font-size: 12px;
  color: #adb5bd;
}

.flexYCenter {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}

.flexBtCenter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}
</style>
