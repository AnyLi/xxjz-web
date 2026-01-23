<template>
  <div id="app" class="page-container" :class="loaded ? 'page' : 'none'">
    <BackHomeButton theme="gradient" />
    <van-collapse accordion v-model="activeNames">
      <van-collapse-item name="1">
        <template #title>
          <div class="chooseTitle">选择衣服<span v-if="chooseClothesList.length">（已选{{ chooseClothesList.length }}）</span></div>
        </template>
        <div class="imgWrap">
          <div class="imgList" v-for="(item, index) in clothesList" :key="index">
            <div class="flexBtCenter">
              <div class="title">{{ item.name }}</div>
            </div>
            <div class="imgListWrap flexWrap">
              <div class="imgItem" :class="chooseClothesList.includes(pItem.imageUrl) ? 'mainBorder' : ''"
                v-for="(pItem, pIndex) in item.itemList" :key="pItem.id"
                @click="handleCheck(pItem.imageUrl, 'chooseClothesList', 'chooseClothesInfoList', pItem)">
                <img :src="pItem.imageUrl" class="productImg" alt="">
                <div class="productName">{{ pItem.colorName || pItem.name }}{{ pItem.styleName || '' }}</div>
              </div>
            </div>
          </div>
        </div>
      </van-collapse-item>
      <van-collapse-item name="2">
        <template #title>
          <div>选择文字<span v-if="tl()">（已选{{ tl() }}）</span></div>
        </template>
        <div class="textWrap flexWrap">
          <div class="textItem" @click="handleCheckText(index)"
            :class="chooseTextList[index] ? 'mainBack white' : 'lightgrayBack'"
            v-for="(item, index) in textObjList" :key="index">
            {{ index }}
          </div>
        </div>
      </van-collapse-item>
      <van-collapse-item name="22">
        <template #title>
          <div>自定义文字</div>
        </template>
        <div class="textWrap flexWrap">
          <div class="inputText">
            <van-field v-for="(item, index) in tempText" :key="index" v-model="item.value" :name="item.label"
              :label="item.label" :placeholder="item.placeholder" :error-message="item.placeholder" />
          </div>
          <div class="btns flexYCenter">
            <div class="btn mainLightBack main" @click="clearText">清空内容</div>
            <div class="btn mainBack white" @click="addText">添加</div>
          </div>
        </div>
      </van-collapse-item>
      <van-collapse-item name="3">
        <template #title>
          <div>选择店铺</div>
        </template>
        <div class="textWrap flexWrap">
          <div class="textItem" @click="handleCheckShop(item)"
            :class="shopInfo.id == item.id ? 'mainBack white' : 'lightgrayBack'"
            v-for="(item, index) in shopList" :key="index">
            {{ item.name }}-{{ storeTypeStr[item.type] }}
          </div>
        </div>
      </van-collapse-item>
      <van-collapse-item name="4">
        <template #title>
          <div class="chooseTitle">选择logo</div>
        </template>
        <div class="imgWrap diyTextWrap flexWrap">
          <div class="imgListWrap flexWrap">
            <div class="imgItem lightgrayBack" v-for="(item, index) in materialList"
              :class="itemCheck.id == item.id ? 'mainBorder' : ''" :key="index" @click="handleCheckImg(item)">
              <img :src="item.img" class="productImg" alt="">
              <div class="productImgName clamp1">{{ item.name }}</div>
            </div>
          </div>
          <div class="formItem flexBtCenter">
            <div class="name black">规格名称</div>
            <van-field v-model="imgSkuTitle" placeholder="输入规格名称" error-message="当前选择的logo对应的规格名称" />
          </div>
          <div class="btn mainBack white" @click="handleAddCheckImg()">添加</div>
        </div>
      </van-collapse-item>
    </van-collapse>
    <div class="formItem flexBtCenter">
      <div class="name">点击清除缓存</div>
      <div class="main" @click="handleClear">清缓存</div>
    </div>
    <div class="formItem flexBtCenter">
      <div class="name">是否包含赠品</div>
      <van-switch v-model="hasGift" />
    </div>
    <div class="formItem flexBtCenter">
      <div class="name">特定衣服颜色是否使用蓝字</div>
      <van-switch v-model="isBlue" />
    </div>
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
      <div class="name">是否显示规格自定义文字</div>
      <van-switch v-model="hasDIYText" />
    </div>
    <div class="formItem flexBtCenter">
      <div class="name">是否使用店铺自带背景</div>
      <van-switch v-model="useShopBack" />
    </div>
    <div class="formItem flexBtCenter">
      <div class="name">显示规格名称</div>
      <van-switch v-model="showSku" />
    </div>
    <div class="formItem flexBtCenter" v-if="showSku">
      <div class="name">规格名称在侧面展示</div>
      <van-switch v-model="isSkuRight" />
    </div>
    <div class="formItem flexBtCenter">
      <div class="name">规格名称前缀</div>
      <van-field v-model="skuTitleStart" placeholder="请输入链接规格前缀" error-message="输入链接规格前缀，复制时自动拼接在规格名称前面" />
    </div>
    <div class="formItem flexBtCenter">
      <div class="name">规格名称后缀</div>
      <van-field v-model="skuTitleEnd" placeholder="请输入链接规格后缀" error-message="输入链接规格后缀，复制时自动拼接在规格名称后面" />
    </div>
    <div class="btns flexYCenter" v-if="chooseClothesList.length && tl()">
      <div class="btn mainLightBack main" @click="captureAll">全部生成图片</div>
      <div class="btn yellowBack white" @click="lookImg" v-if="pic">查看({{ pic }})</div>
      <div class="btn mainBack white" @click="saveImg" v-if="pic">全部保存</div>
    </div>
    <div class="showListWrap">
      <div class="showList" v-for="(item, index) in chooseClothesInfoList" :key="index">
        <div class="showItemWrap " :class="[isSkuRight ? 'skuInfoRightWrap' : '', 'showItemWrap' + skuStyle]"
          v-for="(tList, i) in chooseTextList" :key="index + '-' + i">
          <div class="resultWrap whiteBack" :ref="'captureArea' + index + i">
            <div class="showItem" :class="showSku ? 'showSkuItem' : ''">
              <img :src="item.imageUrl" crossOrigin="anonymous" class="productShowImg" alt="">
              <div class="textIt" v-if="it.length" :style="getStyle((item.productId + '' + ti), it, tList, item)"
                v-for="(it, ti) in tList"
                :class="['textItem' + item.productId + ti, 'textItem' + item.productId, ti == 1 && tList[2] && tList[2].length ? 'textItem1611' : '']"
                :key="index + '-' + i + '-' + ti" v-html="getText(it)">
              </div>
            </div>
            <img :src="shopInfo.backImg" v-if="useShopBack && shopInfo.backImg" class="backImg" alt="">
            <div class="skuInfoWrap flexCenter" v-if="showSku">
              <div class="shopInfo flexYCenter" :class="showColor + 'Back'">
                <img :src="shopInfo.avatar" class="face" alt="">
                <div class="showName">{{ shopInfo.name }}</div>
              </div>
              <div class="skuBorder" :class="showColor + 'Border'"></div>
              <div class="skuWrap flexCenter"
                :class="[skuStyle == 1 && isSkuRight ? (showColor + 'LightBack ' + showColor) : '', skuStyle == 3 ? (showColor + 'Back white') : '']">
                <div class="skuText" :class="skuStyle == 1 && !isSkuRight ? (showColor + 'Border') : ''">
                  <span class="skuName"
                    :class="skuStyle == 1 && !isSkuRight ? [showColor + 'LightBack'] : []">{{ item.colorName || '' }}{{ item.styleName || '' }}</span>
                  <span class="skuName" v-if="hasDIYText"
                    :class="skuStyle == 1 ? (showColor + 'Back white') : skuStyle == 2 ? showColor : 'bd whiteBorder white'">{{ i }}</span>
                </div>
              </div>
              <div class="textFixedImgItem textFixedImgItemSku" v-if="hasGift">
                <img :src="giftIcon" class="giftIcon" alt="">
                <img :src="giftImg" class="giftImg" alt="">
                <div class="giftText">耐脏棉线手套一双</div>
              </div>
            </div>
          </div>
          <div class="showShopItemWrap" :ref="'showShopItemWrap' + index + i" :class="showColor + 'Back'"
            v-if="isFace && captureName == ('captureArea' + index + i)">
            <div class="shopInfo flexYCenter" :class="showColor + 'Back'">
              <img :src="shopInfo.avatar" class="face" alt="">
              <div class="showName">{{ shopInfo.name }}</div>
            </div>
            <div class="imgWrap whiteBack">
              <img :src="showPreviewImg" crossOrigin="anonymous" class="showPreviewImg" alt="">
              <img :src="showPreviewImg" crossOrigin="anonymous" class="showPreviewImgShow" alt="">
            </div>
            <div class="textFixedItem" v-for="(styleItem, styleI) in styleShowList" :key="styleI"
              :style="styleItem.style" :class="styleItem.class">
              {{ styleItem.text }}
            </div>
            <div class="textFixedImgItem" v-if="hasGift">
              <img :src="giftIcon" class="giftIcon" alt="">
              <img :src="giftImg" class="giftImg" alt="">
            </div>
          </div>
          <div class="skuNameText">{{ copy(item, i, true) }}</div>
          <div class="btns flexYCenter">
            <div class="btn mainLightBack main" @click="capture('captureArea' + index + i, false, true)">生成封面</div>
            <div class="btn yellowBack white"
              v-if="showPreviewImg && isFace && previewImg['captureArea' + index + i]"
              @click="capture('showShopItemWrap' + index + i, true)">保存封面</div>
            <div class="btn mainBack white" @click="capture('captureArea' + index + i, true)">保存</div>
            <div class="btn grayBack darkgray" @click="copy(item, i)">复制规格名</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import html2canvas from 'html2canvas'
import { get } from '@/api/request'
import { Toast, ImagePreview } from 'vant'
import BackHomeButton from '@/components/BackHomeButton.vue'

// 字典数据
const dict = {
  textList: [],
  textObjList: {},
  storeTypeStr: {}
}

export default {
  name: 'SetImg',
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
      hasDIYText: true,
      colorList: [
        { label: '蓝色', color: 'blue' },
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
      pic: 0,
      materialList: [],
      itemCheck: {},
      giftIcon: 'https://anii-1303089700.cos.ap-chengdu.myqcloud.com/xxjz/20250717/3e29a18334ce4d84959fc6789fa9383e.dat'
    }
  },
  mounted() {
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
      let s = item.styleName || ''
      let text = s ? item.colorName + s : item.colorName
      let t = this.skuTitleStart + i + '-' + text + this.skuTitleEnd
      console.log('t ------', t)
      if (isReturn) return t
      navigator.clipboard.writeText(t)
        .then(() => Toast('复制成功'))
        .catch(err => console.error("复制失败", err))
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
      this.pic = list?.length
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
      if ((list.length - 1) < i) {
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
      console.log('data -product-list-', list)
      if (list?.length) {
        list = JSON.parse(list)
        console.log('data -product-list-', list)
        this.shopList = list
        this.shopInfo = this.shopList[0]
        return
      }
      get('shop/list').then(res => {
        this.shopList = res.data || []
        this.shopInfo = this.shopList[0]
        sessionStorage.setItem('shopList', JSON.stringify(this.shopList))
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
        n = n - leL + (leL / 2)
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
          let x = 1 - (0.24 * c)
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
      for (let index in this.chooseClothesInfoList) {
        for (let i in this.chooseTextList) {
          this.capture('captureArea' + index + i)
        }
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
      get('product/list', { sortType: 2 }).then(res => {
        let data = res.data
        for (let i in data) {
          for (let j in data[i].itemList) {
            if (data[i].itemList[j].productId == 25) data[i].itemList[j].productId = 16
          }
        }
        console.log('data -product--', data)
        sessionStorage.setItem('productList', JSON.stringify(data))
        this.setList(list)
      }).catch(err => {})
    },
    setList(data) {
      this.clothesList = data
      this.sd('textObjList')
      this.sd('chooseTextList')
      this.sd('chooseClothesList')
      this.sd('chooseClothesInfoList')
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
* {
  box-sizing: border-box;
}

.page-container {
  font-size: 14px;
  position: relative;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
  min-height: 100vh;
  padding-bottom: 20px;
}

.none {
  display: none;
}

.page {
  display: block;
  animation: fadeIn 0.4s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.chooseTitle {
  font-weight: 600;
  color: #333;
}

.capture-box {
  background: white;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 12px;
}

.imgWrap {
  padding: 10px;
}

.imgList {
  background: #fff;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.title {
  font-weight: 600;
  color: #333;
  font-size: 15px;
  padding: 8px 0;
  border-bottom: 2px solid #667eea;
  margin-bottom: 12px;
  display: inline-block;
}

.imgItem {
  width: calc((100% / 4) - 12px);
  margin: 6px;
  border: 2px solid #f0f0f0;
  border-radius: 10px;
  background: #fafafa;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
}

.imgItem:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.imgListWrap {
  text-align: center;
}

.productImg {
  width: 100%;
  height: 60px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.imgItem:hover .productImg {
  transform: scale(1.05);
}

.productName {
  font-size: 12px;
  color: #666;
  padding: 6px 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.textWrap {
  padding: 10px;
}

.textItem {
  padding: 10px 16px;
  margin: 6px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.textItem:hover {
  transform: scale(1.02);
}

.btn {
  width: 85%;
  margin: 15px auto;
  height: 48px;
  line-height: 48px;
  text-align: center;
  font-size: 15px;
  font-weight: 600;
  border-radius: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.btn:active {
  transform: translateY(0);
}

.showListWrap {
  padding: 15px;
}

.showList {
  background: #fff;
  border-radius: 16px;
  padding: 15px;
  margin-bottom: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.showItemWrap {
  position: relative;
  margin-bottom: 20px;
  border-radius: 12px;
  overflow: hidden;
}

.showItem {
  position: relative;
}

.textIt {
  position: absolute;
  z-index: 100;
  font-weight: bold;
}

.productShowImg {
  width: 100%;
  height: auto;
  object-fit: contain;
}

.textItem16,
.textItem2 {
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 黑葫芦主前标 */
.textItem160 {
  top: 52vw;
  left: 7.5vw;
  width: 35vw;
  height: 6.5vw;
}

/* 黑葫芦主后标 */
.textItem161 {
  top: 37.5vw;
  left: 65vw;
  width: 20vw;
  height: 11.5vw;
  line-height: 1;
}

/* 黑葫芦主后标含字母上文字 */
.textItem1611 {
  top: 38.5vw;
  left: 64.5vw;
  width: 21vw;
  height: 6.5vw;
}

/* 黑葫芦后主标下行字母 */
.textItem162 {
  top: 44.5vw;
  left: 64vw;
  width: 22vw;
  height: 4vw;
}

/* 黑葫芦后腰 */
.textItem163 {
  top: 52vw;
  left: 56.5vw;
  width: 37vw;
  height: 3.8vw;
  font-size: 3vw;
  letter-spacing: 0.5vw;
}

/* 黑葫芦前上标 */
.textItem164 {
  top: 44vw;
  left: 10vw;
  width: 30vw;
  height: 3.8vw;
  font-size: 3vw;
  letter-spacing: 0.5vw;
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
  line-height: 1.1;
}

.textItem22 {}

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

.formItem {
  padding: 12px 16px;
  font-size: 14px;
  background: #fff;
  margin: 8px 12px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.formItem .name {
  font-weight: 500;
  color: #333;
}

.btns {
  width: 100%;
  padding: 10px;
  gap: 10px;
}

.btns .btn {
  flex: 1;
  width: auto;
  margin: 5px;
  height: 42px;
  line-height: 42px;
  font-size: 13px;
  border-radius: 21px;
}

.showShopItemWrap {
  position: relative;
  padding: 2vw;
}

.shopInfo {
  position: absolute;
  top: 0;
  left: 0;
  padding: 0 5vw 0 2vw;
  border-radius: 0 0 10vw 0;
  z-index: 1;
}

.face {
  width: 5vw;
  height: 5vw;
  border-radius: 1px;
  margin-right: 1vw;
  object-fit: contain;
}

.showName {
  font-size: 0.8rem;
  padding: 2vw;
  color: #fff;
}

.textFixedItem {
  position: absolute;
  font-size: 5vw;
  text-align: center;
}

.imgWrap {
  position: relative;
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

.btns {
  width: 100%;
}

.tip {
  font-size: 0.8rem;
  color: gray;
}

.diyTextWrap {
  margin: -12px -16px;
}

.inputText {
  width: 100%;
}

.skuInfoWrap {}

.showSkuItem {
  transform: scale(0.8);
  transform-origin: top;
}

.skuBorder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vw;
  border: 8px solid;
}

.skuWrap {
  position: absolute;
  top: 78vw;
  left: 0;
  width: 100%;
}

.skuText {
  text-align: center;
  border-radius: 2px;
  overflow: hidden;
}

.skuName {
  font-size: 1rem;
  font-weight: bold;
  display: block;
  padding: 5px 10px;
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
  font-size: 1.3rem;
  line-height: 1;
}

.skuInfoRightWrap {}

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
  height: 100vw;
  padding: 10px;
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
  margin-left: -1.5vw;
}

.showItemWrap3 .skuWrap {
  top: 85vw;
  height: max-content;
  padding: 3vw;
}

.skuInfoRightWrap.showItemWrap3 .skuWrap {
  top: 0;
  height: 100vw;
}

.resultWrap {
  height: 100vw;
  position: relative;
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
  font-size: 3vw;
}

.textFixedImgItem {
  position: absolute;
  bottom: 5vw;
  left: 2vw;
  padding: 10px;
  border-radius: 50%;
  background: #f1dfaa;
  box-shadow: 0 0 10px 2px #0002;
}

.giftText {
  position: absolute;
  left: 3vw;
  bottom: -2vw;
  font-size: 3vw;
  font-weight: bold;
  width: 18vw;
  text-align: center;
  line-height: 1;
  background: #fe1601 !important;
  padding: 2px 8px;
  border-radius: 19px;
  color: #fff;
}

.giftIcon {
  width: 14vw;
  height: 14vw;
  object-fit: contain;
  position: absolute;
  left: -2vw;
  bottom: 18vw;
}

.giftImg {
  width: 18vw;
  height: 18vw;
  object-fit: contain;
}

.showShopItemWrap .textFixedImgItem {
  left: auto;
  right: 2vw;
  bottom: 8vw;
}

.skuInfoRightWrap .textFixedImgItemSku {
  top: 8vw;
  left: auto;
  right: 2vw;
  bottom: auto;
}

.showShopItemWrap .giftIcon,
.skuInfoRightWrap .giftIcon {
  left: 10vw;
}

.skuNameText {
  text-align: center;
  margin-top: 3vw;
  color: #666;
  font-size: 4vw;
  font-weight: bold;
}

.clothesImg {
  width: 100%;
  object-fit: contain;
}

:deep(.van-cell.van-field) {
  flex: 1;
  margin-left: 12px;
  padding: 0;
}

:deep(.van-radio-group--horizontal) {
  flex: 1;
  margin: 1vw 0 0 3vw;
}

:deep(.van-radio--horizontal) {
  margin: 1vw;
}
</style>
