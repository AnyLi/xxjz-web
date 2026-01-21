<template>
  <div class="set-quantity-page">
    <div class="side">
      <van-swipe style="height: 100vh;" ref="swiper" :loop="false" :show-indicators="false" v-model="current"
        :height="210" vertical @change="changeSwiper">
        <van-swipe-item v-for="(item, index) in clothesList" :key="index">
          <div :class="item.name == info.name ? 'itemActive' : ''" class="item" @click="handleItem(index)">
            <img :src="item.coverImage" alt="" class="img">
            <div class="countWrap">
              <div class="name">{{ item.name }}</div>
              <div class="count">{{ item.count || 0 }}件</div>
            </div>
          </div>
        </van-swipe-item>
      </van-swipe>
    </div>
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
                <div class="count" v-if="childInfo.id && setInventoryNum">
                  {{ setType == 1 ? '减少' : '增加' }}后库存：{{ getResultCount() }}件
                </div>
              </div>
            </div>
            <van-empty v-else class="custom-image"
              image="https://img01.yzcdn.cn/vant/custom-empty-image.png" description="请选择需要更改库存的衣服" />
          </div>
          <div class="computedWrap">
            <el-card>
              <el-radio-group v-model="setType">
                <el-radio-button :label="1">减少</el-radio-button>
                <el-radio-button :label="2">增加</el-radio-button>
              </el-radio-group>
              <div class="showNumWrap">
                <div class="showNum">{{ setInventoryNum || '请输入' }}</div>
              </div>
              <el-card class="">
                <div class="computedTextWrap">
                  <div class="cList">
                    <div class="cItem" v-for="i in 9" :key="i" @click="handleComputed(i)">{{ i }}</div>
                    <div class="cItem" @click="handleComputed('00')">00</div>
                    <div class="cItem" @click="handleComputed('0')">0</div>
                    <div class="cItem clear" @click="handleClear(1)"><i class="el-icon-close"></i></div>
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
      </div>
    </div>
  </div>
</template>

<script>
import { get, post } from '@/api/request'
import { Toast, ImagePreview } from 'vant'

export default {
  name: 'SetQuantity',
  data() {
    return {
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
      lightList: ['高亮', '普亮', '中亮']
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
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
      get('product/list')
        .then(res => {
          this.clothesList = res.data?.filter(f => f.name != '帽子')
          this.getInfo(e, isSave)
        })
        .catch(() => {})
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
      this.$refs.swiper.swipeTo(i)
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
    }
  }
}
</script>

<style scoped>
.set-quantity-page {
  display: flex;
}

.side {
  height: 100vh;
  overflow: hidden;
  overflow-y: scroll;
  background: #409EFF22;
}

.main {
  flex: 1;
  height: 100vh;
  overflow: hidden;
  overflow-y: scroll;
}

.imgWrap {
  flex: 1;
  overflow-x: scroll;
}

.headerImg {
  display: flex;
  padding: 10px;
  background: #409EFF22;
}

.colorItem+.colorItem {
  margin-left: 10px;
}

.listWrap {
  width: 400px;
}

.setWrap {
  position: relative;
}

.mainWrapCard {
  display: flex;
}

.list {
  display: flex;
  flex-wrap: wrap;
  height: calc(100vh - 50px);
  overflow: hidden;
  overflow-y: scroll;
}

.swiper {
  width: 300px;
}

.item {
  border-radius: 10px;
  overflow: hidden;
  margin: 6px;
  background: #fff;
  cursor: pointer;
  width: 250px;
  position: relative;
  border: 5px solid #fff;
}

.img {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.countWrap {
  padding: 2px 10px;
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.mainWrap {
  height: calc(100vh - 160px);
  position: relative;
  padding: 10px;
}

.count {
  font-size: 25px;
}

.name {
  margin-bottom: 5px;
  font-size: 26px;
}

.computedTextWrap {
  display: flex;
  width: 330px;
  height: 330px;
}

.cList {
  display: flex;
  flex-wrap: wrap;
  width: 250px;
}

.cItem {
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  background: #f7f8f9;
  margin: 1px;
  border-radius: 5px;
  cursor: pointer;
}

.clear {
  background: #ccc;
}

.clear1 {
  background: #F8666B;
  color: #fff;
}

.showNum {
  text-align: right;
  padding: 0 20px;
  font-size: 35px;
  border: 1px solid #e3e3e3;
  background: #f7f8f9;
  border-radius: 5px;
  height: 75px;
  line-height: 75px;
}

.colorItem {
  cursor: pointer;
  border-radius: 10px;
  text-align: center;
  background: #fff;
  position: relative;
}

.countLabel {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  text-align: center;
  line-height: 30px;
  background: #409EFF;
  color: #fff;
  position: absolute;
  top: 68px;
  right: 0;
  font-size: 18px;
}

.itemName {
  font-size: 20px;
}

.colorItemImg {
  width: 120px;
  height: 100px;
  object-fit: cover;
}

.formLabel {
  font-size: 20px;
  margin-right: 10px;
  font-weight: bold;
}

.groupWrap {
  padding: 0 10px 10px;
  display: flex;
  align-items: center;
}

.groupList {
  flex: 1;
}

.btnWrap {
  width: 80px;
  height: 366px;
}

.btn {
  width: 80px;
  height: 245px;
  font-size: 30px;
  padding: 0 22px;
  color: #FFF;
  background-color: #409EFF;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-top: 3px;
  cursor: pointer;
}

.showName {
  font-weight: bold;
  font-size: 28px;
}

.itemActive {
  border-color: #409EFF;
  background: #409EFF;
  color: #fff;
}

.radioTop {
  margin-bottom: 5px;
}

.infoText {
  width: 100%;
}

.infoItem {
  text-align: center;
}

.infoItem .img {
  object-fit: contain;
  height: 180px;
}

.infoText .countWrap {
  display: block;
  text-align: center;
}
</style>
