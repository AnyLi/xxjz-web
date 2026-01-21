<template>
  <div class="preview-quantity-page">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>低库存预警</span>
      </div>
      <div class="lowInventoryList flexWrap" v-if="lowInventoryList.length">
        <div class="lowInventoryItem" v-for="(item, index) in lowInventoryList" :key="index">
          <div class="lowWrap lightgrayBack">
            <div class="name">{{ item.name }}</div>
            <div class="countList flexCenter" v-if="!item.isOne">
              <div class="countItem" v-for="(cIt, ci) in item.lowData" :key="item.name + cIt">
                <div class="countLabel" :class="getColor(cIt, item.lowCount)">{{ cIt }}</div>
                <div class="countCount">{{ ci }}</div>
              </div>
            </div>
            <div class="count" :class="getColor(item.lowData.default, item.lowCount)" v-else>
              {{ item.lowData.default }}
            </div>
          </div>
        </div>
      </div>
    </el-card>
    <el-row>
      <el-col :span="14">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>尺码衣服统计</span>
          </div>
          <el-table :data="tableData1" :span-method="objectSpanMethod1" stripe border
            height="calc(100vh - 80px)" style="width: 100%;">
            <el-table-column align="center" prop="productName" label="分类"></el-table-column>
            <el-table-column prop="name" label="衣服名称"></el-table-column>
            <el-table-column align="center" prop="L" label="L"></el-table-column>
            <el-table-column align="center" prop="XL" label="XL"></el-table-column>
            <el-table-column align="center" prop="2XL" label="2XL"></el-table-column>
            <el-table-column align="center" prop="3XL" label="3XL"></el-table-column>
            <el-table-column align="center" prop="4XL" label="4XL"></el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="5">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>葫芦统计</span>
          </div>
          <el-table :data="tableData2" :span-method="objectSpanMethod2" stripe border
            height="calc(100vh - 80px)" style="width: 100%">
            <el-table-column prop="productName" label="分类"></el-table-column>
            <el-table-column prop="name" label="名称"></el-table-column>
            <el-table-column prop="count" label="数量"></el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="5">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>其他均码衣服统计</span>
          </div>
          <el-table :data="tableData3" :span-method="objectSpanMethod3" stripe border
            height="calc(100vh - 80px)" style="width: 100%">
            <el-table-column prop="productName" label="分类"></el-table-column>
            <el-table-column prop="name" label="名称"></el-table-column>
            <el-table-column prop="count" label="数量"></el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { get } from '@/api/request'
import { sizeList } from '@/utils/dict'
import { ImagePreview } from 'vant'

export default {
  name: 'PreviewQuantity',
  data() {
    return {
      tableData1: [],
      tableData2: [],
      tableData3: [],
      clothesList: [],
      itemInventoryList: [],
      lowInventoryList: [],
      sizeList: sizeList,
      lightList: ['高亮', '普亮', '中亮'],
      itemLen1: {},
      itemLen2: {},
      itemLen3: {}
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getColor(count, low) {
      if (low / count >= 2) return 'darkred'
      return 'orange'
    },
    getCount(item) {
      if (Object.keys(item).includes('default')) {
        return item.default
      } else {
        let c = Object.entries(item)
          .map(([key, value]) => `${key}-${value}`)
          .join('/')
        return c
      }
    },
    objectSpanMethod1({ rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return {
          rowspan: this.itemLen1[rowIndex] || 0,
          colspan: 1
        }
      }
    },
    objectSpanMethod2({ rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return {
          rowspan: this.itemLen2[rowIndex] || 0,
          colspan: 1
        }
      }
    },
    objectSpanMethod3({ rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return {
          rowspan: this.itemLen3[rowIndex] || 0,
          colspan: 1
        }
      }
    },
    lookImg(url) {
      ImagePreview({
        images: [url],
        closeable: true
      })
    },
    getList() {
      get('product/list')
        .then(res => {
          this.clothesList = res.data
          this.getItemCount()
        })
        .catch(() => {})
    },
    getItemCount() {
      this.itemInventoryList = []
      get('inventory/list', {})
        .then(res => {
          this.itemInventoryList = res.data
          this.setData()
          this.checkLow()
        })
        .catch(() => {})
    },
    checkLow() {
      let cl = this.clothesList.map(m => m.itemList).flat()
      let il = this.itemInventoryList
      let list = []
      let noColor = ['大红', '金黄', '橘红', '宝蓝']
      for (let it of cl) {
        it.lowData = {}
        for (let jt of il) {
          if (
            it.id == jt.productItemId &&
            it.lowCount &&
            jt.quantity <= it.lowCount &&
            (!noColor.includes(it.colorName) || jt.sizeStr == 'XL' || !jt.sizeStr)
          ) {
            let n = jt.sizeStr || 'default'
            it.lowData[n] = it.lowData[n] ? it.lowData[n] + jt.quantity : jt.quantity
            it.isOne = n == 'default'
          }
        }
        list.push(it)
      }
      let newList = list.filter(f => Object.keys(f.lowData).length > 0)
      this.lowInventoryList = newList
    },
    setData() {
      let cl = this.clothesList.filter(f => f.count > 0)
      let il = this.itemInventoryList
      let sl = this.sizeList
      let td1 = [],
        td2 = [],
        td3 = [],
        itemLen1 = {},
        itemLen2 = {},
        itemLen3 = {}
      for (let it1 of cl) {
        let itemList = it1.itemList.filter(f => f.count > 0)
        for (let i2 in itemList) {
          let it2 = itemList[i2]
          // 有尺寸
          if (it1.hasSize == 1) {
            if (i2 == 0) {
              itemLen1[td1.length] = itemList.length
            }
            let info = {
              productName: it1.name,
              name: it2.colorName + it2.styleName
            }
            let infoIl = il.filter(f => f.productId == it1.id && f.productItemId == it2.id)
            for (let sIt of sl) {
              info[sIt] = infoIl
                .filter(f => f.sizeStr == sIt && f.quantity > 0)
                .map(m => m.brightnessStr + m.quantity)
                .join('/')
            }
            td1.push(info)
          } else {
            let info = {
              productName: it1.name,
              name: it2.colorName,
              count: 0
            }
            info.count = il.find(f => f.productId == it1.id && f.productItemId == it2.id)?.quantity
            if (it1.name.includes('葫芦')) {
              if (i2 == 0) {
                itemLen2[td2.length] = itemList.length
              }
              td2.push(info)
            } else {
              if (i2 == 0) {
                itemLen3[td3.length] = itemList.length
              }
              td3.push(info)
            }
          }
        }
      }
      this.tableData1 = td1
      this.tableData2 = td2
      this.tableData3 = td3
      this.itemLen1 = itemLen1
      this.itemLen2 = itemLen2
      this.itemLen3 = itemLen3
    }
  }
}
</script>

<style scoped>
.preview-quantity-page {
  padding: 10px;
}

.lowInventoryItem {
  border-radius: 5px;
}

.lowWrap {
  padding: 10px;
  text-align: center;
  height: 100px;
  margin: 5px;
}

.name {
  color: #333;
  margin-bottom: 10px;
}

.countItem {
  width: 35px;
  padding: 5px;
}

.countItem + .countItem {
  margin-left: 1px;
}

.countLabel {
  font-size: 25px;
}

.countCount {
  color: #666;
  font-size: 12px;
}

.count {
  font-size: 30px;
  margin-top: 15px;
}

.el-card__body,
.el-main {
  padding: 10px !important;
}
</style>
