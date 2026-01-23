<template>
  <div id="app" class="none" :class="loaded ? 'page' : ''">
    <!-- 返回主页按钮 -->
    <BackHomeButton />

    <van-collapse accordion v-model="activeNames">
      <van-collapse-item name="1">
        <template #title>
          <div class="chooseTitle">选择衣服<span v-if="chooseClothesList.length">（已选{{ chooseClothesList.length }}）</span></div>
        </template>
        <div class="imgWrap">
          <div class="imgList" v-for="(item, index) in clothesList" :key="index">
            <div class="flexBtCenter">
              <div class="title">{{ item.name }}</div>
              <div class="main" @click="checkAll(index)">全选</div>
            </div>
            <div class="imgListWrap flexWrap">
              <div
                class="imgItem"
                :class="chooseClothesList.includes(pItem.imageUrl) ? 'mainBorder' : ''"
                v-for="(pItem, pIndex) in item.itemList"
                :key="pItem.id"
                @click="handleCheck(pItem.imageUrl, 'chooseClothesList', 'chooseClothesInfoList', pItem)"
              >
                <img :src="pItem.imageUrl" class="productImg" alt="" />
                <div class="productName">{{ pItem.colorName || pItem.name }}{{ pItem.styleName || '' }}</div>
              </div>
            </div>
          </div>
        </div>
      </van-collapse-item>
    </van-collapse>

    <div class="formItem flexBtCenter">
      <div class="name">规格样式</div>
      <van-radio-group v-model="skuStyle" direction="horizontal">
        <van-radio name="1">样式 1</van-radio>
        <van-radio name="2">样式 2</van-radio>
        <van-radio name="3">样式 3</van-radio>
      </van-radio-group>
    </div>
    <div class="formItem flexBtCenter">
      <div class="name">主题色</div>
      <van-radio-group v-model="showColor" direction="horizontal">
        <van-radio v-for="(item, index) in colorList" :key="index" :name="item.color">{{ item.label }}</van-radio>
      </van-radio-group>
    </div>
    <div class="formItem flexBtCenter">
      <div class="name">是否使用店铺自带背景</div>
      <van-switch v-model="useShopBack" />
    </div>
    <div class="formItem flexBtCenter">
      <div class="name">显示店铺样式</div>
      <van-switch v-model="showSku" />
    </div>
    <div class="formItem flexBtCenter">
      <div class="name">显示规格名称</div>
      <van-switch v-model="showSkuText" />
    </div>
    <div class="formItem flexBtCenter" v-if="showSku">
      <div class="name">规格名称在侧面展示</div>
      <van-switch v-model="isSkuRight" />
    </div>
    <div class="formItem flexBt">
      <div class="name">规格名称前缀</div>
      <van-field v-model="skuTitleStart" placeholder="请输入链接规格前缀" error-message="输入链接规格前缀，复制时自动拼接在规格名称前面" />
    </div>
    <div class="formItem flexBt">
      <div class="name">规格名称后缀</div>
      <van-field v-model="skuTitleEnd" placeholder="请输入链接规格后缀" error-message="输入链接规格后缀，复制时自动拼接在规格名称后面" />
    </div>

    <div class="btns flexYCenter" v-if="chooseClothesList.length && tl()">
      <div class="btn mainLightBack main" @click="captureAll">{{ pic ? '重新生成全部' : '全部生成图片' }}</div>
      <div class="btn yellowBack white" @click="lookImg" v-if="pic">查看({{ pic }})</div>
      <div class="btn mainBack white" @click="saveImg" v-if="pic">全部保存</div>
    </div>

    <div class="showListWrap">
      <div class="showList" v-for="(item, index) in chooseClothesInfoList" :key="index">
        <div
          class="showItemWrap"
          :class="[isSkuRight ? 'skuInfoRightWrap' : '', 'showItemWrap' + skuStyle]"
          v-for="(tList, i) in chooseTextList"
          :key="index + '-' + i"
        >
          <div class="resultWrap whiteBack" :ref="'captureArea' + index + i">
            <div class="showItem" :class="[showSku ? 'showSkuItem' : '', !showSkuText ? 'noShowSkuItem' : '']">
              <img :src="item.imageUrl" crossOrigin="anonymous" class="productShowImg" alt="" />
              <div
                class="textIt"
                v-if="it.length"
                :style="getStyle(item.productId + '' + ti, it, tList, item)"
                v-for="(it, ti) in tList"
                :class="['textItem' + item.productId + ti, 'textItem' + item.productId, ti == 1 && tList[2] && tList[2].length ? 'textItem1611' : '']"
                :key="index + '-' + i + '-' + ti"
                v-html="getText(it)"
              ></div>
            </div>
            <img :src="shopInfo.backImg" v-if="useShopBack && shopInfo.backImg" class="backImg" alt="" />
            <div class="skuInfoWrap flexCenter" v-if="showSku">
              <div class="shopInfo flexYCenter" v-if="shopInfo && shopInfo.id" :class="showColor + 'Back'">
                <img :src="shopInfo.avatar" class="face" alt="" />
                <div class="showName">{{ shopInfo.name }}</div>
              </div>
              <div class="skuBorder" :class="showColor + 'Border'"></div>
              <div
                class="skuWrap flexCenter"
                :class="[skuStyle == 1 && isSkuRight ? showColor + 'LightBack ' + showColor : '', skuStyle == 3 ? showColor + 'Back white' : '']"
                v-if="showSkuText"
              >
                <div class="skuText flexYCenter" :class="skuStyle == 1 && !isSkuRight ? showColor + 'Border' : ''">
                  <span class="skuName" :class="skuStyle == 1 && !isSkuRight ? [showColor + 'LightBack'] : []">{{ item.colorName || '' }}{{ item.styleName || '' }}</span>
                  <span
                    class="skuName"
                    v-if="hasDIYText && i != 0"
                    :class="skuStyle == 1 ? showColor + 'Back white' : skuStyle == 2 ? showColor : 'bd whiteBorder white'"
                  >{{ i }}</span>
                </div>
              </div>
              <div class="textFixedImgItem textFixedImgItemSku" v-if="hasGift">
                <img :src="giftIcon" class="giftIcon" alt="" />
                <img :src="giftImg" class="giftImg" alt="" />
                <div class="giftText">耐脏棉线手套一双</div>
              </div>
            </div>
          </div>
          <div
            class="showShopItemWrap"
            :ref="'showShopItemWrap' + index + i"
            :class="showColor + 'Back'"
            v-if="isFace && captureName == 'captureArea' + index + i"
          >
            <div class="shopInfo flexYCenter" :class="showColor + 'Back'">
              <img :src="shopInfo.avatar" class="face" alt="" />
              <div class="showName">{{ shopInfo.name }}</div>
            </div>
            <div class="imgWrap whiteBack">
              <img :src="showPreviewImg" crossOrigin="anonymous" class="showPreviewImg" alt="" />
              <img :src="showPreviewImg" crossOrigin="anonymous" class="showPreviewImgShow" alt="" />
            </div>
            <div class="textFixedItem" v-for="(styleItem, styleI) in styleShowList" :key="styleI" :style="styleItem.style" :class="styleItem.class">
              {{ styleItem.text }}
            </div>
            <div class="textFixedImgItem" v-if="hasGift">
              <img :src="giftIcon" class="giftIcon" alt="" />
              <img :src="giftImg" class="giftImg" alt="" />
            </div>
          </div>
          <div class="skuNameText">{{ copy(item, i, true) }}</div>
          <div class="btns flexYCenter">
            <div class="btn mainLightBack main" @click="capture('captureArea' + index + i, false, true)">生成封面</div>
            <div
              class="btn yellowBack white"
              v-if="showPreviewImg && isFace && previewImg['captureArea' + index + i]"
              @click="capture('showShopItemWrap' + index + i, true)"
            >保存封面</div>
            <div class="btn mainBack white" @click="capture('captureArea' + index + i, true)">保存</div>
            <div class="btn grayBack darkgray" @click="copy(item, i)">复制规格名</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部占位，确保移动端可以滚动到底部 -->
    <div class="bottom-spacer"></div>
  </div>
</template>

<script>
import html2canvas from 'html2canvas'
import { get, getUrlParam } from '@/api/request'
import dict from '@/utils/dict'
import { Toast, ImagePreview } from 'vant'
import BackHomeButton from '@/components/BackHomeButton.vue'

export default {
  name: 'FastSetImg',
  components: { BackHomeButton },
  data() {
    return {
      loaded: false,
      currentTime: new Date().toLocaleString(),
      previewImg: {},
      showPreviewImg: '',
      clothesList: [],
      activeNames: '1',
      chooseClothesList: [],
      chooseTextList: {},
      chooseClothesInfoList: [],
      shopList: [],
      textList: dict.textList,
      textObjList: dict.textObjList,
      storeTypeStr: dict.storeTypeStr,
      isBlue: false,
      isFace: false,
      shopInfo: {},
      showColor: 'blue',
      giftImg: '',
      hasGift: false,
      useShopBack: false,
      showSkuText: false,
      hasDIYText: true,
      colorList: [
        { label: '蓝色', color: 'blue' },
        { label: '深蓝色', color: 'darkblue' },
        { label: '橘色', color: 'orange' },
        { label: '荧光黄', color: 'lightgreen' },
        { label: '浅红', color: 'red' },
        { label: '紫色', color: 'purple' },
        { label: '黄色', color: 'yellow' },
        { label: '大红', color: 'darkred' },
        { label: '绿色', color: 'green' }
      ],
      showSku: false,
      isSkuRight: false,
      skuTitleStart: '',
      skuTitleEnd: '',
      imgSkuTitle: '',
      skuStyle: '1',
      tempText: [
        { label: '前主标', placeholder: '多口袋左胸小字/黑葫芦前下大字', value: '内容1' },
        { label: '后主标', placeholder: '后背大字 换行用逗号,隔开', value: '内容2' },
        { label: '后主标下方', placeholder: '黑葫芦含字母时字母的内容（仅限黑葫芦）', value: '内容3' },
        { label: '后腰内容', placeholder: '多口袋后腰大字/黑葫芦后背下反光条小字', value: '内容4' },
        { label: '前小标', placeholder: '多口袋右胸小字/黑葫芦前上小字', value: '内容5' }
      ],
      styleShowList: [
        {
          text: '支持定制 一件发货',
          class: 'orangeBack white',
          style: { padding: '2vw', top: '2vw', right: '2vw' }
        },
        {
          text: '全国包邮',
          class: 'bold',
          style: {
            padding: '3vw 1vw 1vw',
            top: '0vw',
            right: '45vw',
            background: '#E8D9BA',
            border: '1px solid #FDF0D4',
            borderRadius: '0 0 1vw 1vw ',
            fontSize: '5vw',
            width: '14vw',
            zIndex: '10',
            lineHeight: 1.1
          }
        },
        {
          text: '灵活开票',
          class: 'bold',
          style: {
            padding: '5vw 5vw 2vw 2vw',
            bottom: '0',
            left: '0',
            background: '#E8D9BA',
            border: '1px solid #FDF0D4',
            borderRadius: '0 10vw 0 0 ',
            fontSize: '6vw',
            width: '20vw',
            zIndex: '10'
          }
        },
        {
          text: '多款多色 量大价优',
          class: 'white bold',
          style: {
            padding: '3vw 2vw',
            bottom: '0vw',
            right: '0vw',
            background: '#094DAE',
            fontSize: '5vw',
            zIndex: '1'
          }
        },
        {
          text: '多款多色 量大价优',
          class: 'white bold',
          style: {
            padding: '3vw 2vw',
            bottom: '0vw',
            right: '0vw',
            background: '#094DAE',
            fontSize: '5vw',
            zIndex: '1'
          }
        },
        {
          text: '高亮反光极速发货',
          class: 'darkredBack white bold',
          style: {
            padding: '2vw 3vw 1vw 6vw',
            bottom: '0vw',
            right: '43vw',
            fontSize: '7vw',
            width: '42vw',
            zIndex: '1',
            lineHeight: 1.1
          }
        }
      ],
      captureName: '',
      shopId: '',
      pic: 0,
      materialList: [],
      itemCheck: {},
      giftIcon: 'https://anii-1303089700.cos.ap-chengdu.myqcloud.com/xxjz/20250717/3e29a18334ce4d84959fc6789fa9383e.dat'
    }
  },
  mounted() {
    this.shopId = getUrlParam('shopId') || this.$route.query.shopId
    this.loaded = true
    this.getInfo()
    this.getShopList()
    this.getMaterialList()
  },
  methods: {
    getInfo() {
      get('dictList/listInfo').then(res => {
        let data = res.data || {}
        for (let i in data) {
          dict[i] = JSON.parse(data[i].itemValue)
        }
        this.setData()
        this.getList()
      })
    },
    setData() {
      this.textList = dict.textList
      this.textObjList = dict.textObjList
      this.storeTypeStr = dict.storeTypeStr
    },
    handleClear() {
      let { cc } = this
      cc('productList')
      cc('shopList')
      cc('textObjList')
      cc('chooseTextList')
      cc('chooseClothesList')
      cc('chooseClothesInfoList')
      this.getInfo()
      this.getShopList()
      this.getMaterialList()
    },
    sd(name) {
      let data = sessionStorage.getItem(name)
      if (data?.length) {
        this[name] = JSON.parse(data)
      }
    },
    tl() {
      return Object.keys(this.chooseTextList).length
    },
    copy(item, i, isReturn) {
      i = i == 0 ? '' : i
      let s = item.styleName || ''
      let text = s ? item.colorName + s : item.colorName
      let st = this.skuTitleStart + i
      let t = st + (st ? '-' : '') + text + this.skuTitleEnd
      console.log('t ------', t)
      if (isReturn) return t
      navigator.clipboard
        .writeText(t)
        .then(() => Toast('复制成功'))
        .catch(err => console.error('复制失败', err))
    },
    handleCheckImg(item) {
      this.imgSkuTitle = item.name
      this.itemCheck = item
    },
    handleAddCheckImg() {
      let { img } = this.itemCheck || {}
      let name = this.imgSkuTitle
      if (!img) {
        return Toast('请选择logo')
      }
      if (!name) {
        return Toast('请输入规格名称')
      }
      let l = [img, img]
      this.textObjList[name] = l
      this.chooseTextList[name] = l
      this.saveData()
      this.$forceUpdate()
      Toast('添加成功')
    },
    saveData() {
      let { ss } = this
      ss('textObjList')
      ss('chooseTextList')
      ss('chooseClothesList')
      ss('chooseClothesInfoList')
    },
    ss(name) {
      sessionStorage.setItem(name, JSON.stringify(this[name]))
    },
    cc(name) {
      sessionStorage.removeItem(name)
    },
    getMaterialList() {
      get('material/list').then(res => {
        let data = res.data || []
        this.materialList = data.filter(f => f.type == 1)
        this.giftImg = data.find(f => f.name == '去底手套')?.img
      })
    },
    clearText() {
      for (let i in this.tempText) {
        this.tempText[i].value = ''
      }
    },
    lookImg() {
      let list = Object.values(this.previewImg)
      console.log('list ----', list, this.previewImg)
      ImagePreview(list)
    },
    gl() {
      let list = Object.values(this.previewImg)
      console.log('list -------', list)
      this.pic = list?.length
      if (this.pic) {
        Toast.clear()
      }
    },
    saveImg() {
      let list = Object.values(this.previewImg)
      console.log('list ---', list)
      this.saveItem(list, 0)
    },
    downloadImg(imgUrl) {
      return new Promise((resolve, reject) => {
        const tempImg = new Image()
        tempImg.onload = function () {
          const link = document.createElement('a')
          link.download = 'screenshot-' + Date.now() + '.png'
          link.href = imgUrl
          link.addEventListener('click', function () {
            setTimeout(() => {
              resolve('下载已触发')
            }, 100)
          })
          link.click()
        }
        tempImg.onerror = function () {
          reject(new Error('图片加载失败，无法下载'))
        }
        tempImg.src = imgUrl
        if (tempImg.complete) {
          tempImg.onload()
        }
      })
    },
    saveItem(list, i) {
      console.log('list ---', list, i)
      if (list.length - 1 < i) {
        return
      }
      let img = list[i]
      if (img?.length) {
        return this.downloadImg(img)
          .then(message => {
            this.saveItem(list, i + 1)
          })
          .catch(error => console.error(error))
      }
      this.saveItem(list, i + 1)
    },
    addText() {
      let text = ''
      for (let i in this.tempText) {
        let val = this.tempText[i].value
        if (val.includes('内容')) {
          return Toast('请删除无用内容')
        }
        if (!text && val) {
          text = val
        }
      }
      if (!text) {
        return Toast('请至少输入一个内容')
      }
      let name = text
      if (this.textObjList[text]) {
        name = text + '1'
      }
      let textL = this.tempText.map(m => m.value)
      this.textObjList[name] = textL
      this.chooseTextList[name] = textL
      this.saveData()
      setTimeout(() => {
        this.clearText()
      }, 1000)
      return Toast.success('添加成功')
    },
    handleCheckShop(item) {
      this.shopInfo = item || {}
    },
    handleCheckText(index) {
      if (this.chooseTextList[index]?.length) {
        delete this.chooseTextList[index]
      } else {
        this.chooseTextList[index] = this.textObjList[index]
      }
      this.$forceUpdate()
      this.saveData()
    },
    getShopList() {
      let list = sessionStorage.getItem('shopList')
      let shopInfo = sessionStorage.getItem('shopInfo')
      console.log('data -product-list-', list)
      if (list?.length) {
        list = JSON.parse(list)
        console.log('data -product-list-', list)
        this.shopList = list
        this.shopInfo = JSON.parse(shopInfo)
        return
      }
      get('shop/list').then(res => {
        this.shopList = res.data || []
        this.shopInfo = this.shopList.find(f => f.id == this.shopId)
        sessionStorage.setItem('shopList', JSON.stringify(this.shopList))
        sessionStorage.setItem('shopInfo', JSON.stringify(this.shopInfo))
      })
    },
    scaleFont(container) {
      const baseRatio = 5 / 35
      const fontSize = 35 * baseRatio
      return `${Math.min(fontSize, container.offsetHeight * 0.8)}vw`
    },
    quickFontSize(n, width, height) {
      const widthRatio = width / (n * 1)
      const heightRatio = height / 1.1
      return Math.min(widthRatio, heightRatio)
    },
    getText(text) {
      text = text.replaceAll('，', ',')
      if (text.includes(',')) {
        return text.replace(',', '<br>')
      }
      if (text.includes('https')) {
        return `<img src="${text}" class="clothesImg" alt="">`
      }
      return text
    },
    filterLetters(str) {
      return [...str].filter(c => /[a-zA-Z]/.test(c))
    },
    getStyle(name, val, list, item) {
      let leL = this.filterLetters(val)?.length
      console.log('leL ---', val, leL)
      let n = val.length
      if (leL > 0) {
        n = n - leL + leL / 2
      }
      let color = '#000'
      let style = {}
      if (item.productId == 16) {
        if (['荧光黄'].includes(item.colorName)) {
          color = this.isBlue ? '#10228C' : '#000'
        }
      }
      if (item.productId == 2) {
        if (['荧光黄', '金黄'].includes(item.colorName)) {
          color = this.isBlue ? '#1a86f5' : '#000'
        }
        if (['橘红'].includes(item.colorName)) {
          color = this.isBlue ? '#1a86f5' : 'white'
        }
        if (['宝蓝', '大红'].includes(item.colorName)) {
          color = 'white'
          if (list[0].includes('https')) {
            style.filter = 'brightness(0) invert(1)'
          }
        }
      }
      style.color = color

      console.log('num name---', name, val)
      if (name == '160') {
        let num = this.quickFontSize(n, 35, 6.5)
        num = num > 5.2 ? 5.2 : num
        if (n <= 3) {
          style.letterSpacing = (n == 3 ? 1 : 2) + 'vw'
          style.textIndent = (n == 3 ? 1 : 2) + 'vw'
        }
        if (n > 5) {
          style.transform = 'scale(0.9,1)'
          num = 4.8
        }
        style.fontSize = num + 'vw'
        return style
      }
      if (name == '161') {
        console.log('num name---val', val, val.includes('/n'))
        if (val.includes(',') && n > 5) {
          n = 5
        }
        let num = this.quickFontSize(n, 20, 11.5)
        num = num > 5 ? 5 : num
        if (n <= 3) {
          style.letterSpacing = (n == 3 ? 0.5 : 2.5) + 'vw'
          style.textIndent = (n == 3 ? 0.5 : 2.5) + 'vw'
          num = 6
        }
        if (val.length == 5) {
          style.transform = 'scale(0.8,1)'
          style.left = '62.7vw'
          style.width = '25vw'
          num = 5
        }
        style.fontSize = num + 'vw'
        return style
      }
      if (name == '1611') {
        let num = this.quickFontSize(n, 20, 6)
        num = num > 6 ? 6 : num
        if (n <= 3) {
          style.letterSpacing = (n == 3 ? 0.5 : 2.5) + 'vw'
          style.textIndent = (n == 3 ? 0.5 : 2.5) + 'vw'
        }
        style.fontSize = num + 'vw'
        return style
      }
      if (name == '162') {
        let num = this.quickFontSize(n, 20, 4)
        num = num > 6 ? 6 : num
        num = num < 3.5 ? 3.5 : num
        if (n > 5) {
          let c = Math.ceil(n - 5)
          let x = 1 - 0.24 * c
          x = x < 0.55 ? 0.55 : x
          style.transform = `scale(${x},1)`
        }
        if (n == 3) {
          style.transform = 'scale(1,0.8)'
          style.top = 'scale(1,0.8)'
          num = 4.5
        }
        style.fontSize = num + 'vw'
        return style
      }
      if (name == '20') {
        let num = this.quickFontSize(n, 12, 3.8)
        style.fontSize = num + 'vw'
        return style
      }
      if (name == '21') {
        if (val.includes(',') && n > 5) {
          n = 5
        }
        let num = this.quickFontSize(n, 25, 12)
        num = num > 7 ? 7 : num
        if (n <= 3) {
          num = n == 3 ? 7 : 8
          style.letterSpacing = (n == 3 ? 1 : 2.5) + 'vw'
          style.textIndent = (n == 3 ? 1 : 2.5) + 'vw'
        }
        style.fontSize = num + 'vw'
        return style
      }
      if (name == '23') {
        let num = this.quickFontSize(n, 41.5, 6)
        if (n <= 3) {
          style.letterSpacing = (n == 3 ? 1 : 2.5) + 'vw'
          style.textIndent = (n == 3 ? 1 : 2.5) + 'vw'
        }
        style.fontSize = num + 'vw'
        return style
      }
      if (name == '24') {
        let num = this.quickFontSize(n, 12, 3.8)
        style.fontSize = num + 'vw'
        return style
      }
      return style
    },
    creatImg() {},
    captureAll() {
      this.previewImg = {}
      this.pic = 0
      Toast.loading({
        message: '生成中不要退出...',
        forbidClick: true,
        duration: 0
      })
      this.$nextTick(() => {
        for (let index in this.chooseClothesInfoList) {
          for (let i in this.chooseTextList) {
            this.capture('captureArea' + index + i)
          }
        }
      })
    },
    checkAll(categoryIndex) {
      const category = this.clothesList[categoryIndex]
      if (!category) return

      const isAllSelected = category.itemList.every(pItem => this.chooseClothesList.includes(pItem.imageUrl))

      if (isAllSelected) {
        category.itemList.forEach(pItem => {
          const index = this.chooseClothesList.indexOf(pItem.imageUrl)
          if (index !== -1) {
            this.chooseClothesList.splice(index, 1)
            const infoIndex = this.chooseClothesInfoList.findIndex(info => info.imageUrl === pItem.imageUrl)
            if (infoIndex !== -1) {
              this.chooseClothesInfoList.splice(infoIndex, 1)
            }
          }
        })
      } else {
        category.itemList.forEach(pItem => {
          if (!this.chooseClothesList.includes(pItem.imageUrl)) {
            this.chooseClothesList.push(pItem.imageUrl)
            this.chooseClothesInfoList.push(pItem)
          }
        })
      }
    },
    handleCheck(val, name, infoName, item) {
      console.log('val ---', val)
      let i = this[name].indexOf(val)
      if (i == -1) {
        this[name].push(val)
        if (infoName) {
          this[infoName].push(item)
        }
      } else {
        this[name].splice(i, 1)
        if (infoName) {
          this[infoName].splice(i, 1)
        }
      }
    },
    getList(e, isSave) {
      let list = sessionStorage.getItem('productList')
      if (list?.length) {
        list = JSON.parse(list)
        return this.setList(list)
      }
      get('product/list', {}).then(res => {
        let data = res.data
        for (let i in data) {
          for (let j in data[i].itemList) {
            if (data[i].itemList[j].productId == 25) data[i].itemList[j].productId = 16
          }
        }
        sessionStorage.setItem('productList', JSON.stringify(data))
        this.setList(data)
      }).catch(err => {})
    },
    setList(data) {
      this.clothesList = data
      this.$forceUpdate()
      this.sd('textObjList')
      this.sd('chooseTextList')
      this.sd('chooseClothesList')
      this.sd('chooseClothesInfoList')
      setTimeout(() => {
        this.handleCheckText(0)
      }, 1000)
    },
    gt(n) {
      let t = this.textObjList
      return { [n]: t[n] }
    },
    capture(name, isSave, isFace) {
      if (isFace) {
        this.captureName = name
      }
      let saveF = this.showSku
      if (!isSave && isFace && saveF) {
        this.showSku = false
        this.$forceUpdate()
      }
      this.$nextTick(() => {
        html2canvas(this.$refs[name][0], {
          scale: 2,
          useCORS: true,
          backgroundColor: null
        }).then(canvas => {
          let img = canvas.toDataURL('image/png')
          this.previewImg[name] = img
          this.gl()
          if (isSave) this.downloadImage(canvas)
          if (isFace) {
            this.showPreviewImg = img
            this.isFace = true
            if (saveF) {
              setTimeout(() => {
                this.showSku = true
                this.$forceUpdate()
              }, 200)
            }
          }
        })
      })
    },
    downloadImage(canvas) {
      const link = document.createElement('a')
      link.download = 'screenshot-' + Date.now() + '.png'
      link.href = canvas.toDataURL()
      link.click()
    }
  }
}
</script>

<style scoped>
/* ==================== CSS 变量定义 ==================== */
:root {
  --primary-color: #1989fa;
  --primary-light: #e8f4ff;
  --success-color: #07c160;
  --warning-color: #ff976a;
  --danger-color: #ee0a24;
  --text-color: #323233;
  --text-secondary: #969799;
  --border-color: #ebedf0;
  --bg-color: #f7f8fa;
  --card-shadow: 0 2px 12px rgba(100, 101, 102, 0.12);
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 16px;
}

* {
  box-sizing: border-box;
}

/* ==================== 基础布局 ==================== */
#app {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
  padding-bottom: 120px;
  position: relative;
}

.none {
  display: none;
}

.page {
  display: block;
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
}

/* ==================== 折叠面板优化 ==================== */
.chooseTitle {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color);
  display: flex;
  align-items: center;
  gap: 8px;
}

.chooseTitle span {
  background: var(--primary-light);
  color: var(--primary-color);
  padding: 2px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

/* ==================== 图片选择区域 ==================== */
.imgWrap {
  position: relative;
  background: #fff;
  border-radius: var(--radius-md);
  padding: 16px;
}

.imgList {
  margin-bottom: 20px;
  background: var(--bg-color);
  border-radius: var(--radius-md);
  padding: 16px;
}

.imgList:last-child {
  margin-bottom: 0;
}

.imgList .flexBtCenter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.title {
  font-weight: 600;
  color: var(--text-color);
  font-size: 15px;
  position: relative;
  padding-left: 12px;
}

.title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 16px;
  background: var(--primary-color);
  border-radius: 2px;
}

.main {
  color: var(--primary-color);
  font-size: 13px;
  cursor: pointer;
  padding: 4px 12px;
  border-radius: 20px;
  background: var(--primary-light);
  transition: all 0.3s ease;
}

.main:hover {
  background: var(--primary-color);
  color: #fff;
}

.imgListWrap {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.imgItem {
  background: #fff;
  border: 2px solid transparent;
  border-radius: var(--radius-md);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.imgItem:hover {
  transform: translateY(-2px);
  box-shadow: var(--card-shadow);
}

.mainBorder {
  border-color: var(--primary-color) !important;
  box-shadow: 0 0 0 3px var(--primary-light);
}

.productImg {
  width: 100%;
  height: 80px;
  object-fit: cover;
  display: block;
}

.productName {
  padding: 8px;
  font-size: 12px;
  color: var(--text-color);
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background: #fafafa;
}

/* ==================== 表单项优化 ==================== */
.formItem {
  background: #fff;
  border-radius: var(--radius-md);
  padding: 16px 20px;
  margin: 12px 0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.formItem .name {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-color);
  min-width: 140px;
}

.formItem :deep(.van-radio-group) {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-end;
}

.formItem :deep(.van-radio) {
  margin: 0;
  padding: 6px 12px;
  background: var(--bg-color);
  border-radius: 20px;
  transition: all 0.3s ease;
}

.formItem :deep(.van-radio--checked) {
  background: var(--primary-light);
}

.formItem :deep(.van-switch) {
  transform: scale(0.9);
}

.formItem :deep(.van-field) {
  flex: 1;
  max-width: 300px;
  background: var(--bg-color);
  border-radius: var(--radius-sm);
  padding: 8px 12px;
}

.formItem.flexBt {
  flex-direction: column;
  align-items: flex-start;
}

.formItem.flexBt .name {
  margin-bottom: 8px;
}

.formItem.flexBt :deep(.van-field) {
  width: 100%;
  max-width: none;
}

/* ==================== 按钮组优化 ==================== */
.btns {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  padding: 20px 16px;
  background: #fff;
  border-radius: var(--radius-lg);
  margin: 16px 0;
  box-shadow: var(--card-shadow);
}

.btn {
  min-width: 120px;
  padding: 0 24px;
  height: 44px;
  line-height: 44px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  border-radius: 22px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  margin: 0;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn:active {
  transform: translateY(0);
}

.mainLightBack {
  background: linear-gradient(135deg, #e8f4ff 0%, #d4e8ff 100%);
}

.yellowBack {
  background: linear-gradient(135deg, #ff976a 0%, #ff6034 100%);
}

.mainBack {
  background: linear-gradient(135deg, #1989fa 0%, #0d6efd 100%);
}

.grayBack {
  background: linear-gradient(135deg, #f2f3f5 0%, #e5e6e8 100%);
}

.white {
  color: #fff !important;
}

.darkgray {
  color: #646566 !important;
}

/* ==================== 展示列表区域 ==================== */
.showListWrap {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.showList {
  display: contents;
}

.showItemWrap {
  position: relative;
  background: #fff;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--card-shadow);
  transition: all 0.3s ease;
}

.showItemWrap:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.showItem {
  position: relative;
}

.resultWrap {
  height: 320px;
  position: relative;
  background: #fff;
  overflow: hidden;
}

.textIt {
  position: absolute;
  z-index: 100;
  font-weight: bold;
}

.productShowImg {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.skuNameText {
  text-align: center;
  padding: 12px;
  color: var(--text-color);
  font-size: 14px;
  font-weight: 600;
  background: var(--bg-color);
}

.showItemWrap .btns {
  margin: 0;
  padding: 12px;
  border-radius: 0;
  background: linear-gradient(180deg, transparent 0%, #fff 100%);
  gap: 8px;
}

.showItemWrap .btn {
  min-width: auto;
  flex: 1;
  padding: 0 12px;
  height: 36px;
  line-height: 36px;
  font-size: 12px;
  border-radius: 18px;
}

/* ==================== 文本位置相关样式 ==================== */
.textItem16,
.textItem2 {
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 黑葫芦主前标 */
.textItem160 {
  top: 52%;
  left: 7.5%;
  width: 35%;
  height: 6.5%;
}

/* 黑葫芦主后标 */
.textItem161 {
  top: 37.5%;
  left: 65%;
  width: 20%;
  height: 11.5%;
  line-height: 1;
}

/* 黑葫芦主后标含字母上文字 */
.textItem1611 {
  top: 38.5%;
  left: 64.5%;
  width: 21%;
  height: 6.5%;
}

/* 黑葫芦后腰 */
.textItem162 {
  top: 44.5%;
  left: 64%;
  width: 22%;
  height: 4%;
}

/* 黑葫芦后腰 */
.textItem163 {
  top: 52%;
  left: 56.5%;
  width: 37%;
  height: 3.8%;
  font-size: 0.9em;
  letter-spacing: 0.5%;
}

/* 黑葫芦前上标 */
.textItem164 {
  top: 44%;
  left: 10%;
  width: 30%;
  height: 3.8%;
  font-size: 0.9em;
  letter-spacing: 0.5%;
}

/* 多口袋 */
.textItem16 {
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
}

/* 多口袋前上标 */
.textItem20 {
  top: 33.8%;
  left: 28.5%;
  width: 12.5%;
  height: 3.8%;
  font-size: 0.9em;
}

.textItem21 {
  top: 28.5%;
  left: 62%;
  width: 25%;
  height: 11.5%;
  line-height: 1.1;
}

.textItem22 {
}

.textItem23 {
  top: 60%;
  left: 53.5%;
  width: 41.5%;
  height: 6%;
  letter-spacing: 0.5%;
}

.textItem24 {
  top: 30.8%;
  left: 8%;
  width: 12%;
  height: 3.8%;
}

/* ==================== 店铺信息区域 ==================== */
.showShopItemWrap {
  position: relative;
  padding: 8px;
}

.shopInfo {
  position: absolute;
  top: 0;
  left: 0;
  padding: 0 16px 0 8px;
  border-radius: 0 0 20px 0;
  z-index: 1;
  display: flex;
  align-items: center;
}

.face {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  margin-right: 6px;
  object-fit: contain;
}

.showName {
  font-size: 12px;
  padding: 8px;
  color: #fff;
}

.textFixedItem {
  position: absolute;
  font-size: 14px;
  text-align: center;
}

.showPreviewImg {
  width: 100%;
  height: 100%;
  object-fit: contain;
  opacity: 0;
}

.showPreviewImgShow {
  position: absolute;
  top: 6%;
  left: 10%;
  object-fit: contain;
  width: 80%;
  height: 80%;
}

.tip {
  font-size: 12px;
  color: var(--text-secondary);
}

.diyTextWrap {
  margin: -12px -16px;
}

.inputText {
  width: 100%;
}

/* ==================== SKU 样式 ==================== */
.skuInfoWrap {
}

.showSkuItem {
  transform: scale(0.8);
  transform-origin: top;
}

.skuBorder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 8px solid;
}

.skuWrap {
  position: absolute;
  bottom: 20px;
  left: 0;
  width: 100%;
}

.skuText {
  text-align: center;
  border-radius: 2px;
  overflow: hidden;
}

.skuName {
  font-size: 14px;
  font-weight: bold;
  display: block;
  padding: 0 10px;
  height: 28px;
  line-height: 28px;
}

.showItemWrap1 .skuText {
  border-radius: 20px;
  border: 1px solid;
}

.showItemWrap1 .skuName,
.showItemWrap3 .skuName {
  display: inline-block;
}

.showItemWrap3 .skuName {
  border-radius: 20px;
}

.showItemWrap2 .skuName {
  font-size: 16px;
  line-height: 1;
}

.skuInfoRightWrap {
}

.skuInfoRightWrap .showSkuItem {
  transform: scale(0.6);
  transform-origin: 10% 50%;
}

.skuInfoRightWrap .skuWrap {
  position: absolute;
  top: 0;
  right: 8px;
  width: 30%;
  left: auto;
  height: 100%;
  padding: 10px;
  bottom: auto;
}

.skuInfoRightWrap .skuText {
  border: none;
  border-radius: 0;
}

.skuInfoRightWrap .skuName {
  border-radius: 20px;
  padding: 5px;
}

.skuName + .skuName {
  margin-left: -6px;
}

.showItemWrap3 .skuWrap {
  bottom: 0;
  top: auto;
  height: max-content;
  padding: 12px;
}

.skuInfoRightWrap.showItemWrap3 .skuWrap {
  top: 0;
  height: 100%;
  bottom: auto;
}

.backImg {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  width: 100%;
  height: 100%;
}

.productImgName {
  font-size: 12px;
}

/* ==================== 礼品区域 ==================== */
.textFixedImgItem {
  position: absolute;
  bottom: 20px;
  left: 8px;
  padding: 10px;
  border-radius: 50%;
  background: #f1dfaa;
  box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.1);
}

.giftText {
  position: absolute;
  left: 12px;
  bottom: -8px;
  font-size: 10px;
  font-weight: bold;
  width: 60px;
  text-align: center;
  line-height: 1;
  background: #fe1601 !important;
  padding: 2px 8px;
  border-radius: 19px;
  color: #fff;
}

.giftIcon {
  width: 48px;
  height: 48px;
  object-fit: contain;
  position: absolute;
  left: -8px;
  bottom: 60px;
}

.giftImg {
  width: 60px;
  height: 60px;
  object-fit: contain;
}

.showShopItemWrap .textFixedImgItem {
  left: auto;
  right: 8px;
  bottom: 32px;
}

.skuInfoRightWrap .textFixedImgItemSku {
  top: 32px;
  left: auto;
  right: 8px;
  bottom: auto;
}

.showShopItemWrap .giftIcon,
.skuInfoRightWrap .giftIcon {
  left: 40px;
}

.clothesImg {
  width: 100%;
  object-fit: contain;
}

.noShowSkuItem {
  transform: scale(0.9);
  transform-origin: center;
}

/* ==================== 颜色变量 ==================== */
.darkblue {
  color: #104192;
}

.darkblueBack {
  background: #104192;
}

.darkblueBorder {
  border-color: #104192 !important;
}

/* ==================== 响应式设计 ==================== */
/* 平板端 */
@media screen and (min-width: 768px) {
  .page {
    padding: 24px;
  }

  .imgListWrap {
    grid-template-columns: repeat(6, 1fr);
    gap: 16px;
  }

  .productImg {
    height: 100px;
  }

  .formItem {
    padding: 20px 24px;
  }

  .showListWrap {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }

  .resultWrap {
    height: 380px;
  }
}

/* PC端 */
@media screen and (min-width: 1024px) {
  .page {
    padding: 32px;
  }

  .imgListWrap {
    grid-template-columns: repeat(8, 1fr);
  }

  .productImg {
    height: 120px;
  }

  .formItem {
    max-width: 800px;
    margin: 12px auto;
  }

  .btns:not(.showItemWrap .btns) {
    max-width: 600px;
    margin: 20px auto;
  }

  .showListWrap {
    grid-template-columns: repeat(3, 1fr);
  }

  .resultWrap {
    height: 400px;
  }
}

/* 大屏PC */
@media screen and (min-width: 1400px) {
  .imgListWrap {
    grid-template-columns: repeat(10, 1fr);
  }

  .showListWrap {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* 手机端优化 */
@media screen and (max-width: 767px) {
  #app {
    padding-bottom: 150px;
    min-height: auto;
    overflow-x: hidden;
  }

  .page {
    padding: 12px;
    padding-top: 60px; /* 为固定的返回按钮留出空间 */
    padding-bottom: 150px;
  }

  .home-btn {
    top: 12px;
    right: 12px;
    padding: 6px 12px;
    font-size: 12px;
  }

  .home-btn .van-icon {
    font-size: 16px;
  }

  .imgListWrap {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .productImg {
    height: 60px;
  }

  .productName {
    font-size: 11px;
    padding: 6px 4px;
  }

  .formItem {
    padding: 12px 16px;
    margin: 8px 0;
  }

  .formItem .name {
    font-size: 13px;
    min-width: auto;
    flex: 1;
  }

  .formItem :deep(.van-radio-group) {
    justify-content: flex-start;
  }

  .formItem :deep(.van-radio) {
    padding: 4px 10px;
    font-size: 12px;
  }

  .showListWrap {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .resultWrap {
    height: 100vw;
  }

  .btns {
    padding: 12px;
    gap: 8px;
  }

  .btn {
    min-width: 80px;
    padding: 0 16px;
    height: 38px;
    line-height: 38px;
    font-size: 13px;
  }

  .showItemWrap .btn {
    font-size: 11px;
    height: 32px;
    line-height: 32px;
    padding: 0 8px;
  }

  /* 恢复移动端vw单位用于图片生成 */
  .textItem160 {
    top: 52vw;
    left: 7.5vw;
    width: 35vw;
    height: 6.5vw;
  }

  .textItem161 {
    top: 37.5vw;
    left: 65vw;
    width: 20vw;
    height: 11.5vw;
  }

  .textItem1611 {
    top: 38.5vw;
    left: 64.5vw;
    width: 21vw;
    height: 6.5vw;
  }

  .textItem162 {
    top: 44.5vw;
    left: 64vw;
    width: 22vw;
    height: 4vw;
  }

  .textItem163 {
    top: 52vw;
    left: 56.5vw;
    width: 37vw;
    height: 3.8vw;
    font-size: 3vw;
    letter-spacing: 0.5vw;
  }

  .textItem164 {
    top: 44vw;
    left: 10vw;
    width: 30vw;
    height: 3.8vw;
    font-size: 3vw;
    letter-spacing: 0.5vw;
  }

  .textItem20 {
    top: 33.8vw;
    left: 28.5vw;
    width: 12.5vw;
    height: 3.8vw;
    font-size: 3vw;
  }

  .textItem21 {
    top: 28.5vw;
    left: 62vw;
    width: 25vw;
    height: 11.5vw;
  }

  .textItem23 {
    top: 60vw;
    left: 53.5vw;
    width: 41.5vw;
    height: 6vw;
    letter-spacing: 0.5vw;
  }

  .textItem24 {
    top: 30.8vw;
    left: 8vw;
    width: 12vw;
    height: 3.8vw;
  }

  .skuBorder {
    height: 100vw;
  }

  .skuWrap {
    top: 78vw;
    bottom: auto;
  }

  .skuInfoRightWrap .skuWrap {
    height: 100vw;
  }

  .showItemWrap3 .skuWrap {
    top: 85vw;
    bottom: auto;
  }

  .skuInfoRightWrap.showItemWrap3 .skuWrap {
    top: 0;
    height: 100vw;
  }
}

/* ==================== Vant 组件样式覆盖 ==================== */
:deep(.van-collapse) {
  background: transparent;
}

:deep(.van-collapse-item) {
  margin-bottom: 12px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--card-shadow);
}

:deep(.van-collapse-item__title) {
  padding: 16px 20px;
  background: #fff;
}

:deep(.van-collapse-item__content) {
  padding: 0;
  background: #fff;
}

:deep(.van-cell::after) {
  display: none;
}

/* ==================== 底部占位 ==================== */
.bottom-spacer {
  height: 200px;
  width: 100%;
  pointer-events: none;
}

@media screen and (max-width: 767px) {
  .bottom-spacer {
    height: 250px;
  }
}
</style>
