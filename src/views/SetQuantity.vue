<template>
  <div class="set-quantity-page">
    <!-- 返回按钮 -->
    <div class="top-btns">
      <BackHomeButton in-header />
      <div class="reset-btn" @click="resetCalcPosition">
        <i class="el-icon-refresh"></i>
        <span>重置计算器位置</span>
      </div>
    </div>

    <!-- 左侧商品列表 - 普通滚动 -->
    <div class="side">
      <div class="side-scroll">
        <!-- 骨架屏 -->
        <template v-if="loading">
          <div class="skeleton-item" v-for="n in 5" :key="'skeleton-' + n">
            <div class="skeleton-img skeleton-animate"></div>
            <div class="skeleton-content">
              <div class="skeleton-title skeleton-animate"></div>
              <div class="skeleton-count skeleton-animate"></div>
            </div>
          </div>
        </template>
        <!-- 实际内容 -->
        <template v-else>
          <div v-for="(item, index) in clothesList" :key="index"
            :class="item.name == info.name ? 'itemActive' : ''" class="item" @click="handleItem(index)">
            <img :src="item.coverImage" alt="" class="img">
            <div class="countWrap">
              <div class="name">{{ item.name }}</div>
              <div class="count">{{ item.count || 0 }}件</div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- 主区域 -->
    <div class="main">
      <div class="imgWrap">
        <div class="headerImg">
          <div v-for="(item, index) in itemList" :key="index"
            :class="item.id == itemInfo.id ? 'itemActive' : ''" class="colorItem"
            @click="handleColorItem(item)">
            <img :src="item.imageUrl" alt="" class="colorItemImg" />
            <div class="countLabel">{{ item.count || 0 }}</div>
            <div class="itemName">{{ item.colorName }}{{ item.styleName }}</div>
          </div>
        </div>
      </div>
      <div class="mainWrap">
        <div class="computedWrapPage flexBtCenter">
          <div class="infoText">
            <div class="groupWrap">
              <div class="formLabel">尺寸</div>
              <el-radio-group v-model="params.sizeStr" class="groupList"
                @input="changeRadio($event, 'sizeStr')">
                <el-radio-button :label="item" v-for="(item, index) in showSizeList" :key="index">
                  <div class="radioTop">{{ item }}</div>
                  <div>{{ getCount(item, 'sizeStr') || 0 }}</div>
                </el-radio-button>
              </el-radio-group>
            </div>
            <div class="groupWrap">
              <div class="formLabel">亮度</div>
              <el-radio-group v-model="params.brightnessStr" class="groupList"
                @input="changeRadio($event, 'brightnessStr')">
                <el-radio-button :label="item" v-for="(item, index) in showLightList" :key="index">
                  <div class="radioTop">{{ item }}</div>
                  <div>{{ getCount(item, 'brightnessStr', params.sizeStr) || 0 }}</div>
                </el-radio-button>
              </el-radio-group>
            </div>
            <div class="infoItem" v-if="itemInfo.imageUrl">
              <img :src="itemInfo.imageUrl" @click="lookImg(itemInfo.imageUrl)" alt="" class="img">
              <div class="countWrap">
                <div class="name showName">
                  {{ itemInfo.productName }}{{ itemInfo.colorName }}{{ itemInfo.styleName }}{{ info.hasBrightness == 1 ? params.brightnessStr : '' }}{{ info.hasSize == 1 ? params.sizeStr : '' }}
                </div>
                <div class="count" v-if="childInfo.id">当前库存：{{ childInfo.quantity }}件</div>
                <div class="count" :class="setType == 1 ? 'count-decrease' : 'count-increase'" v-if="childInfo.id && setInventoryNum">
                  {{ setType == 1 ? '减少' : '增加' }}后库存：{{ getResultCount() }}件
                </div>
              </div>
            </div>
            <van-empty v-else class="custom-image"
              image="https://img01.yzcdn.cn/vant/custom-empty-image.png" description="请选择需要更改库存的衣服" />
          </div>
        </div>
      </div>
    </div>

    <!-- 悬浮可拖拽计算器 -->
    <div class="floating-calculator"
      ref="calculator"
      :style="{ left: calcPosition.x + 'px', top: calcPosition.y + 'px' }"
      @mousedown="startDrag"
      @touchstart="startTouchDrag">
      <div class="calc-header">
        <i class="el-icon-s-operation"></i>
        <span>库存计算器</span>
        <i class="el-icon-rank drag-icon"></i>
      </div>
      <el-card class="calc-card">
        <el-radio-group v-model="setType" class="type-radio">
          <el-radio-button :label="1">减少</el-radio-button>
          <el-radio-button :label="2">增加</el-radio-button>
        </el-radio-group>
        <div class="showNumWrap">
          <div class="showNum">{{ setInventoryNum || '请输入' }}</div>
        </div>
        <el-card class="keypad-card" shadow="never">
          <div class="computedTextWrap">
            <div class="cList">
              <div class="cItem" @click="handleComputed(1)">1</div>
              <div class="cItem" @click="handleComputed(2)">2</div>
              <div class="cItem" @click="handleComputed(3)">3</div>
              <div class="cItem" @click="handleComputed(4)">4</div>
              <div class="cItem" @click="handleComputed(5)">5</div>
              <div class="cItem" @click="handleComputed(6)">6</div>
              <div class="cItem" @click="handleComputed(7)">7</div>
              <div class="cItem" @click="handleComputed(8)">8</div>
              <div class="cItem" @click="handleComputed(9)">9</div>
              <div class="cItem" @click="handleComputed('00')">00</div>
              <div class="cItem" @click="handleComputed('0')">0</div>
              <div class="cItem clear" @click="handleClear(1)"><i class="el-icon-back"></i></div>
              <div class="cItem quick" @click="handleQuick(25)">25</div>
              <div class="cItem quick" @click="handleQuick(50)">50</div>
              <div class="cItem quick" @click="handleQuick(100)">100</div>
            </div>
            <div class="btnWrap">
              <div class="cItem clear clear1" @click="handleClear(2)">清空</div>
              <div class="btn" @click="handleConfirm">确认修改</div>
            </div>
          </div>
        </el-card>
      </el-card>
    </div>
  </div>
</template>

<script>
import { get, post } from '@/api/request'
import { Toast, ImagePreview } from 'vant'
import BackHomeButton from '@/components/BackHomeButton.vue'

const CALC_POSITION_KEY = 'setQuantity_calcPosition'

export default {
  name: 'SetQuantity',
  components: { BackHomeButton },
  data() {
    return {
      loading: true,
      visible: false,
      current: 0,
      staticUrl: 'https://anii-1303089700.cos.ap-chengdu.myqcloud.com/xxjz/',
      setType: 1,
      clothesList: [],
      computedList: [],
      itemList: [],
      colorList: [],
      showLightList: [],
      showSizeList: [],
      itemInventoryList: [],
      setInventoryNum: '',
      setColor: '',
      setSize: '',
      info: {},
      params: {},
      itemInfo: {},
      childInfo: {},
      colorIndex: 0,
      lightList: ['高亮', '普亮', '中亮'],
      // 拖拽相关
      calcPosition: { x: 0, y: 0 },
      isDragging: false,
      dragOffset: { x: 0, y: 0 }
    }
  },
  mounted() {
    this.loadCalcPosition()
    this.getList()
    // 添加全局鼠标事件
    document.addEventListener('mousemove', this.onDrag)
    document.addEventListener('mouseup', this.stopDrag)
    // 添加触摸事件支持
    document.addEventListener('touchmove', this.onTouchDrag, { passive: false })
    document.addEventListener('touchend', this.stopDrag)
  },
  beforeDestroy() {
    document.removeEventListener('mousemove', this.onDrag)
    document.removeEventListener('mouseup', this.stopDrag)
    document.removeEventListener('touchmove', this.onTouchDrag)
    document.removeEventListener('touchend', this.stopDrag)
  },
  methods: {
    // 加载保存的计算器位置
    loadCalcPosition() {
      try {
        const saved = localStorage.getItem(CALC_POSITION_KEY)
        const calcWidth = 380
        const calcHeight = 500
        if (saved) {
          const pos = JSON.parse(saved)
          // 确保位置在可视区域内
          const maxX = window.innerWidth - calcWidth
          const maxY = window.innerHeight - calcHeight
          this.calcPosition = {
            x: Math.min(Math.max(0, pos.x), Math.max(0, maxX)),
            y: Math.min(Math.max(0, pos.y), Math.max(0, maxY))
          }
        } else {
          // 默认位置：屏幕中间
          this.calcPosition = {
            x: Math.max(0, (window.innerWidth - calcWidth) / 2),
            y: Math.max(0, (window.innerHeight - calcHeight) / 2)
          }
        }
      } catch (e) {
        // 出错时默认居中
        this.calcPosition = {
          x: Math.max(0, (window.innerWidth - 380) / 2),
          y: Math.max(0, (window.innerHeight - 500) / 2)
        }
      }
    },
    // 重置计算器位置到屏幕中间
    resetCalcPosition() {
      const calcWidth = 380
      const calcHeight = 500
      this.calcPosition = {
        x: Math.max(0, (window.innerWidth - calcWidth) / 2),
        y: Math.max(0, (window.innerHeight - calcHeight) / 2)
      }
      this.saveCalcPosition()
    },
    // 保存计算器位置
    saveCalcPosition() {
      try {
        localStorage.setItem(CALC_POSITION_KEY, JSON.stringify(this.calcPosition))
      } catch (e) {
        console.error('保存位置失败', e)
      }
    },
    // 开始拖拽（鼠标）
    startDrag(e) {
      // 只允许从头部拖拽
      if (!e.target.closest('.calc-header')) return
      this.isDragging = true
      const rect = this.$refs.calculator.getBoundingClientRect()
      this.dragOffset = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      }
      document.body.style.cursor = 'grabbing'
      document.body.style.userSelect = 'none'
    },
    // 开始触摸拖拽
    startTouchDrag(e) {
      if (!e.target.closest('.calc-header')) return
      const touch = e.touches[0]
      this.isDragging = true
      const rect = this.$refs.calculator.getBoundingClientRect()
      this.dragOffset = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      }
    },
    // 鼠标拖拽中
    onDrag(e) {
      if (!this.isDragging) return
      const newX = e.clientX - this.dragOffset.x
      const newY = e.clientY - this.dragOffset.y
      // 限制在可视区域内
      const maxX = Math.max(0, window.innerWidth - 380)
      const maxY = Math.max(0, window.innerHeight - 100)
      this.calcPosition = {
        x: Math.min(Math.max(0, newX), maxX),
        y: Math.min(Math.max(0, newY), maxY)
      }
    },
    // 触摸拖拽中
    onTouchDrag(e) {
      if (!this.isDragging) return
      e.preventDefault()
      const touch = e.touches[0]
      const newX = touch.clientX - this.dragOffset.x
      const newY = touch.clientY - this.dragOffset.y
      // 限制在可视区域内
      const maxX = Math.max(0, window.innerWidth - 380)
      const maxY = Math.max(0, window.innerHeight - 100)
      this.calcPosition = {
        x: Math.min(Math.max(0, newX), maxX),
        y: Math.min(Math.max(0, newY), maxY)
      }
    },
    // 停止拖拽
    stopDrag() {
      if (this.isDragging) {
        this.isDragging = false
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
        this.saveCalcPosition()
      }
    },
    getResultCount() {
      let tc = this.childInfo.quantity
      let sc = Number(this.setInventoryNum)
      let c = this.setType == 1 ? tc - sc : tc + sc
      if (c < 0) {
        c = 0
      }
      return c
    },
    getCount(val, name, ps) {
      if (val == '默认') val = ''
      if (ps == '默认') ps = ''
      return this.itemInventoryList
        .filter(f => f[name] == val && (!ps || f.sizeStr == ps))
        .map(m => m.quantity)
        .reduce((acc, curr) => acc + curr, 0)
    },
    handleConfirm() {
      let iif = this.itemInfo
      let ci = this.childInfo
      let p = this.params
      if (!iif?.id) {
        return Toast('请选择具体衣服款式')
      }
      if (!p?.brightnessStr) {
        return Toast('请选择亮度')
      }
      if (!p?.sizeStr) {
        return Toast('请选择尺码')
      }
      if (!Number(this.setInventoryNum)) {
        return Toast('请输入要增减的库存')
      }
      ci.quantity = this.getResultCount()
      post('inventory/saveOrUpdate', ci)
        .then(() => {
          Toast('修改成功')
          this.setInventoryNum = ''
          this.getList(null, true)
        })
        .catch(() => {})
    },
    lookImg(url) {
      ImagePreview({
        images: [url],
        closeable: true
      })
    },
    getList(e, isSave) {
      this.loading = true
      get('product/list')
        .then(res => {
          this.clothesList = res.data?.filter(f => f.name != '帽子')
          this.getInfo(e, isSave)
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false
        })
    },
    getInfo(e, isSave) {
      let i = this.current
      let item = this.clothesList[i]
      this.info = item
      this.showLightList = item.hasBrightness == 1 ? this.lightList : ['默认']
      this.showSizeList =
        item.hasSize == 1 ? (item.sizeList ? item.sizeList.split(',') : ['默认']) : ['默认']
      let b = this.params?.brightnessStr
      let s = this.params?.sizeStr
      if (!isSave) {
        this.itemInfo = {}
        this.childInfo = {}
        this.params.brightnessStr = item.hasBrightness == 2 ? '默认' : ''
        this.params.sizeStr = item.hasSize == 2 ? '默认' : ''
        this.changeRadio()
      } else {
        if (this.itemInfo?.id) {
          this.getItemCount()
        }
        this.params.brightnessStr = item.hasBrightness == 2 ? '默认' : b
        this.params.sizeStr = item.hasSize == 2 ? '默认' : s
        this.changeRadio()
      }
      this.$forceUpdate()
      if (item.itemList) {
        this.itemList = item.itemList
        return
      }
      get('product/' + item.id, { id: item.id }).then(res => {
        let info = res.data
        if (!info.itemList?.length) {
          info.itemList = [
            {
              colorName: info.name,
              imageUrl: info.coverImage,
              styleName: ''
            }
          ]
        }
        this.clothesList[i] = {
          ...item,
          ...info
        }
        this.itemList = info.itemList
        this.$forceUpdate()
      })
    },
    changeSwiper(e) {
      this.current = e
      this.handleItem(e)
    },
    handleColorItem(item) {
      this.itemInfo = item
      this.getItemCount()
    },
    getItemCount() {
      this.itemInventoryList = []
      get('inventory/list', { productItemId: this.itemInfo.id })
        .then(res => {
          this.itemInventoryList = res.data
          this.changeRadio()
        })
        .catch(() => {})
    },
    handleItem(i) {
      this.current = i
      this.getInfo()
    },
    handleClear(type) {
      if (type == 1) {
        this.setInventoryNum = this.setInventoryNum.slice(0, -1)
      } else {
        this.setInventoryNum = ''
      }
    },
    changeRadio(e, name) {
      if (e && name) {
        this.params[name] = e
        this.$forceUpdate()
      }
      let p = this.params
      if (p.sizeStr && p.brightnessStr) {
        let s = p.sizeStr == '默认' ? '' : p.sizeStr
        let b = p.brightnessStr == '默认' ? '' : p.brightnessStr
        this.childInfo =
          this.itemInventoryList.find(f => f.sizeStr == s && f.brightnessStr == b) || {}
        this.$forceUpdate()
      }
    },
    handleComputed(i) {
      if (!Number(this.setInventoryNum) && !Number(i)) return
      this.setInventoryNum = `${this.setInventoryNum}${i}`
    },
    handleQuick(num) {
      this.setInventoryNum = String(num)
    }
  }
}
</script>

<style scoped>
.set-quantity-page {
  display: flex;
  background: #f0f2f5;
  min-height: 100vh;
}

/* 顶部按钮组 */
.top-btns {
  position: fixed;
  top: 16px;
  right: 20px;
  z-index: 100;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
}

.back-btn {
  display: flex;
  align-items: center;
  padding: 10px 18px;
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
  color: #fff;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
  transition: all 0.3s;
}

.back-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(64, 158, 255, 0.5);
}

.back-btn i {
  margin-right: 6px;
  font-size: 16px;
}

.reset-btn {
  display: flex;
  align-items: center;
  padding: 10px 18px;
  background: linear-gradient(135deg, #67c23a 0%, #85ce61 100%);
  color: #fff;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(103, 194, 58, 0.4);
  transition: all 0.3s;
}

.reset-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(103, 194, 58, 0.5);
}

.reset-btn i {
  margin-right: 6px;
  font-size: 16px;
}

.side {
  width: 270px;
  min-width: 270px;
  height: 100vh;
  overflow: hidden;
  overflow-y: auto;
  background: linear-gradient(180deg, #e8f4ff 0%, #d4e8ff 100%);
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.08);
}

.side-scroll {
  padding: 8px 0;
}

.item {
  border-radius: 12px;
  overflow: hidden;
  margin: 8px 10px;
  background: #fff;
  cursor: pointer;
  width: 250px;
  position: relative;
  border: 3px solid transparent;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
}

.item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.item .img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  display: block;
}

.main {
  flex: 1;
  height: 100vh;
  overflow: hidden;
  overflow-y: scroll;
  background: #f5f7fa;
}

.imgWrap {
  flex: 1;
  overflow-x: scroll;
}

.headerImg {
  display: flex;
  padding: 12px 16px;
  background: linear-gradient(135deg, #e8f4ff 0%, #d4e8ff 100%);
  border-bottom: 1px solid #e4e7ed;
}

.colorItem+.colorItem {
  margin-left: 12px;
}

.item {
  border-radius: 12px;
  overflow: hidden;
  margin: 8px;
  background: #fff;
  cursor: pointer;
  width: 250px;
  position: relative;
  border: 3px solid transparent;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
}

.item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.img {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.countWrap {
  padding: 8px 12px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.02) 100%);
}

.mainWrap {
  height: calc(100vh - 160px);
  position: relative;
  padding: 16px;
}

.count {
  font-size: 24px;
  color: #409eff;
  font-weight: 600;
}

.name {
  margin-bottom: 4px;
  font-size: 24px;
  color: #303133;
  font-weight: 500;
}

.colorItem {
  cursor: pointer;
  border-radius: 12px;
  text-align: center;
  background: #fff;
  position: relative;
  border: 3px solid transparent;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s;
  padding-bottom: 8px;
}

.colorItem:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.countLabel {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  text-align: center;
  line-height: 32px;
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
  color: #fff;
  position: absolute;
  top: 65px;
  right: -5px;
  font-size: 16px;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.4);
}

.itemName {
  font-size: 18px;
  color: #606266;
  margin-top: 4px;
}

.colorItemImg {
  width: 120px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}

.formLabel {
  font-size: 18px;
  margin-right: 12px;
  font-weight: 600;
  color: #303133;
  min-width: 50px;
}

.groupWrap {
  padding: 8px 12px 12px;
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 10px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.groupList {
  flex: 1;
}

.flexBtCenter {
  display: flex;
  justify-content: space-between;
}

.showName {
  font-weight: 600;
  font-size: 26px;
  color: #303133;
}

.itemActive {
  border-color: #409eff;
  background: linear-gradient(135deg, #ecf5ff 0%, #d9ecff 100%);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

.itemActive .name,
.itemActive .itemName {
  color: #409eff;
}

.radioTop {
  margin-bottom: 4px;
  font-weight: 500;
}

.infoText {
  width: 100%;
}

.infoItem {
  text-align: left;
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.infoItem .img {
  width: 180px;
  height: 180px;
  object-fit: contain;
  border-radius: 8px;
  flex-shrink: 0;
}

.infoItem .img {
  object-fit: contain;
  height: 180px;
  border-radius: 8px;
}

.infoText .countWrap {
  display: block;
  text-align: left;
  background: transparent;
}

.count-decrease {
  color: #f56c6c !important;
}

.count-increase {
  color: #67c23a !important;
}

/* 悬浮计算器样式 */
.floating-calculator {
  position: fixed;
  z-index: 1000;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  background: #fff;
  overflow: hidden;
}

.calc-header {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
  color: #fff;
  cursor: grab;
  user-select: none;
}

.calc-header:active {
  cursor: grabbing;
}

.calc-header i:first-child {
  font-size: 18px;
  margin-right: 8px;
}

.calc-header span {
  flex: 1;
  font-size: 15px;
  font-weight: 600;
}

.drag-icon {
  font-size: 16px;
  opacity: 0.8;
}

.calc-card {
  border-radius: 0;
  border: none;
}

.calc-card :deep(.el-card__body) {
  padding: 12px;
}

.keypad-card {
  border-radius: 8px;
  border: none;
  background: #fafbfc;
}

.keypad-card :deep(.el-card__body) {
  padding: 8px;
}

.type-radio :deep(.el-radio-button__inner) {
  font-size: 16px;
  padding: 12px 30px;
}

.computedTextWrap {
  display: flex;
  width: 360px;
  height: 420px;
}

.cList {
  display: flex;
  flex-wrap: wrap;
  width: 270px;
}

.cItem {
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 28px;
  background: linear-gradient(135deg, #fff 0%, #f5f7fa 100%);
  margin: 2px;
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid #e4e7ed;
  color: #303133;
  font-weight: 500;
  transition: all 0.2s;
}

.cItem:hover {
  background: linear-gradient(135deg, #ecf5ff 0%, #d9ecff 100%);
  border-color: #409eff;
  color: #409eff;
}

.cItem:active {
  transform: scale(0.95);
}

.clear {
  background: linear-gradient(135deg, #f5f5f5 0%, #e4e7ed 100%);
  color: #909399;
}

.clear:hover {
  background: linear-gradient(135deg, #fef0f0 0%, #fde2e2 100%);
  border-color: #f56c6c;
  color: #f56c6c;
}

.clear1 {
  background: linear-gradient(135deg, #f56c6c 0%, #f78989 100%);
  color: #fff;
  border-color: #f56c6c;
}

.clear1:hover {
  background: linear-gradient(135deg, #f78989 0%, #f56c6c 100%);
}

.quick {
  background: linear-gradient(135deg, #67c23a 0%, #85ce61 100%);
  color: #fff;
  border-color: #67c23a;
  font-size: 22px;
}

.quick:hover {
  background: linear-gradient(135deg, #85ce61 0%, #67c23a 100%);
  border-color: #67c23a;
  color: #fff;
}

.showNum {
  text-align: right;
  padding: 0 20px;
  font-size: 32px;
  border: 2px solid #e4e7ed;
  background: linear-gradient(135deg, #fff 0%, #fafbfc 100%);
  border-radius: 8px;
  height: 70px;
  line-height: 70px;
  color: #303133;
  font-weight: 600;
  margin: 12px 0;
}

.btnWrap {
  width: 80px;
  height: 366px;
}

.btn {
  width: 80px;
  height: 245px;
  font-size: 28px;
  padding: 0 20px;
  color: #FFF;
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-top: 4px;
  cursor: pointer;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
  transition: all 0.3s;
}

.btn:hover {
  background: linear-gradient(135deg, #66b1ff 0%, #409eff 100%);
  box-shadow: 0 6px 16px rgba(64, 158, 255, 0.4);
}

.btn:active {
  transform: scale(0.98);
}

/* 单选按钮样式优化 */
:deep(.el-radio-button__inner) {
  border-radius: 6px !important;
  border: 1px solid #dcdfe6 !important;
  margin: 0 4px;
}

:deep(.el-radio-button__orig-radio:checked + .el-radio-button__inner) {
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
  border-color: #409eff !important;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
}

/* 滚动条美化 */
.main::-webkit-scrollbar,
.imgWrap::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.main::-webkit-scrollbar-thumb,
.imgWrap::-webkit-scrollbar-thumb {
  background: #c0c4cc;
  border-radius: 3px;
}

.main::-webkit-scrollbar-thumb:hover,
.imgWrap::-webkit-scrollbar-thumb:hover {
  background: #909399;
}

/* 骨架屏样式 */
.skeleton-item {
  border-radius: 12px;
  overflow: hidden;
  margin: 8px 10px;
  background: #fff;
  width: 250px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.skeleton-img {
  width: 100%;
  height: 120px;
  background: #e9ecef;
}

.skeleton-content {
  padding: 12px;
}

.skeleton-title {
  height: 20px;
  width: 60%;
  background: #e9ecef;
  border-radius: 4px;
  margin-bottom: 8px;
}

.skeleton-count {
  height: 16px;
  width: 40%;
  background: #e9ecef;
  border-radius: 4px;
}

.skeleton-animate {
  background: linear-gradient(90deg, #e9ecef 25%, #f5f5f5 50%, #e9ecef 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
