<template>
  <div class="preview-quantity-page">
    <el-card class="main-card" shadow="hover">
      <div slot="header" class="card-header">
        <div class="header-left">
          <i class="el-icon-data-analysis header-icon"></i>
          <span class="header-title">库存预览</span>
        </div>
        <div class="header-right">
          <el-button size="small" icon="el-icon-back" @click="$router.push('/')">
            返回主页
          </el-button>
        </div>
      </div>

      <!-- 低库存预警区域 -->
      <div class="section-card" v-if="lowInventoryList.length">
        <div class="section-header">
          <i class="el-icon-warning-outline section-icon warning"></i>
          <span class="section-title">低库存预警</span>
          <el-tag size="small" type="warning">{{ lowInventoryList.length }} 项</el-tag>
        </div>
        <div class="lowInventoryList">
          <div class="lowInventoryItem" v-for="(item, index) in lowInventoryList" :key="index">
            <div class="lowWrap">
              <div class="name">{{ item.name }}</div>
              <div class="countList" v-if="!item.isOne">
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
      </div>

      <!-- 表格区域 - 可拖动分隔 -->
      <div class="split-container" v-if="dataReady" ref="splitContainer">
        <!-- 第一个面板：尺码衣服统计 -->
        <div class="split-panel" :style="{ width: panelWidths[0] + '%' }">
          <el-card class="table-card" shadow="never">
            <div slot="header" class="table-header">
              <span class="table-title">尺码衣服统计</span>
              <el-tag size="small" type="primary">{{ tableData1.length }} 条</el-tag>
            </div>
            <el-table
              :data="tableData1"
              :span-method="objectSpanMethod1"
              stripe
              border
              size="small"
              max-height="500"
              :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }"
              style="width: 100%;">
              <el-table-column align="center" prop="productName" label="分类" width="100"></el-table-column>
              <el-table-column prop="name" label="衣服名称" min-width="120"></el-table-column>
              <el-table-column align="center" prop="L" label="L" width="80"></el-table-column>
              <el-table-column align="center" prop="XL" label="XL" width="80"></el-table-column>
              <el-table-column align="center" prop="2XL" label="2XL" width="80"></el-table-column>
              <el-table-column align="center" prop="3XL" label="3XL" width="80"></el-table-column>
              <el-table-column align="center" prop="4XL" label="4XL" width="80"></el-table-column>
            </el-table>
          </el-card>
        </div>

        <!-- 第一个分隔条 -->
        <div class="split-divider" @mousedown="startDrag($event, 0)">
          <div class="divider-line"></div>
        </div>

        <!-- 第二个面板：葫芦统计 -->
        <div class="split-panel" :style="{ width: panelWidths[1] + '%' }">
          <el-card class="table-card" shadow="never">
            <div slot="header" class="table-header">
              <span class="table-title">葫芦统计</span>
              <el-tag size="small" type="success">{{ tableData2.length }} 条</el-tag>
            </div>
            <el-table
              :data="tableData2"
              :span-method="objectSpanMethod2"
              stripe
              border
              size="small"
              max-height="500"
              :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }"
              style="width: 100%">
              <el-table-column prop="productName" label="分类" width="80"></el-table-column>
              <el-table-column prop="name" label="名称" min-width="80"></el-table-column>
              <el-table-column prop="count" label="数量" width="60" align="center"></el-table-column>
            </el-table>
          </el-card>
        </div>

        <!-- 第二个分隔条 -->
        <div class="split-divider" @mousedown="startDrag($event, 1)">
          <div class="divider-line"></div>
        </div>

        <!-- 第三个面板：其他均码统计 -->
        <div class="split-panel" :style="{ width: panelWidths[2] + '%' }">
          <el-card class="table-card" shadow="never">
            <div slot="header" class="table-header">
              <span class="table-title">其他均码统计</span>
              <el-tag size="small" type="info">{{ tableData3.length }} 条</el-tag>
            </div>
            <el-table
              :data="tableData3"
              :span-method="objectSpanMethod3"
              stripe
              border
              size="small"
              max-height="500"
              :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }"
              style="width: 100%">
              <el-table-column prop="productName" label="分类" width="80"></el-table-column>
              <el-table-column prop="name" label="名称" min-width="80"></el-table-column>
              <el-table-column prop="count" label="数量" width="60" align="center"></el-table-column>
            </el-table>
          </el-card>
        </div>
      </div>

      <!-- 加载中状态 -->
      <div class="loading-wrapper" v-else>
        <i class="el-icon-loading"></i>
        <span>数据加载中...</span>
      </div>
    </el-card>
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
      itemLen3: {},
      dataReady: false,
      // 分隔面板宽度百分比 (三个面板)
      panelWidths: [58, 20, 20],
      // 拖动状态
      isDragging: false,
      dragIndex: -1,
      startX: 0,
      startWidths: []
    }
  },
  mounted() {
    this.getList()
    // 添加全局鼠标事件监听
    document.addEventListener('mousemove', this.onDrag)
    document.addEventListener('mouseup', this.stopDrag)
  },
  beforeDestroy() {
    // 移除全局鼠标事件监听
    document.removeEventListener('mousemove', this.onDrag)
    document.removeEventListener('mouseup', this.stopDrag)
  },
  methods: {
    // 开始拖动
    startDrag(e, index) {
      this.isDragging = true
      this.dragIndex = index
      this.startX = e.clientX
      this.startWidths = [...this.panelWidths]
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    },
    // 拖动中
    onDrag(e) {
      if (!this.isDragging) return
      const container = this.$refs.splitContainer
      if (!container) return

      const containerWidth = container.offsetWidth
      const deltaX = e.clientX - this.startX
      const deltaPercent = (deltaX / containerWidth) * 100

      const minWidth = 10 // 最小宽度百分比

      if (this.dragIndex === 0) {
        // 拖动第一个分隔条：调整面板1和面板2的宽度
        let newWidth0 = this.startWidths[0] + deltaPercent
        let newWidth1 = this.startWidths[1] - deltaPercent

        if (newWidth0 >= minWidth && newWidth1 >= minWidth) {
          this.panelWidths = [newWidth0, newWidth1, this.startWidths[2]]
        }
      } else if (this.dragIndex === 1) {
        // 拖动第二个分隔条：调整面板2和面板3的宽度
        let newWidth1 = this.startWidths[1] + deltaPercent
        let newWidth2 = this.startWidths[2] - deltaPercent

        if (newWidth1 >= minWidth && newWidth2 >= minWidth) {
          this.panelWidths = [this.startWidths[0], newWidth1, newWidth2]
        }
      }
    },
    // 停止拖动
    stopDrag() {
      if (this.isDragging) {
        this.isDragging = false
        this.dragIndex = -1
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
      }
    },
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
      this.$nextTick(() => {
        this.dataReady = true
      })
    }
  }
}
</script>

<style scoped>
.preview-quantity-page {
  padding: 20px;
  background: #f0f2f5;
  min-height: calc(100vh - 40px);
}

.main-card {
  border-radius: 8px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-icon {
  font-size: 20px;
  color: #409eff;
  margin-right: 10px;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

/* 低库存预警区域 */
.section-card {
  background: #fafbfc;
  padding: 16px;
  border-radius: 6px;
  margin-bottom: 16px;
  border: 1px solid #ebeef5;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.section-icon {
  font-size: 18px;
  margin-right: 8px;
}

.section-icon.warning {
  color: #e6a23c;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #606266;
  margin-right: 10px;
}

.lowInventoryList {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.lowInventoryItem {
  border-radius: 6px;
  overflow: hidden;
}

.lowWrap {
  padding: 12px 16px;
  text-align: center;
  min-width: 100px;
  background: linear-gradient(135deg, #fff 0%, #f5f7fa 100%);
  border: 1px solid #ebeef5;
  border-radius: 6px;
  transition: all 0.3s;
}

.lowWrap:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.name {
  color: #303133;
  font-weight: 500;
  margin-bottom: 8px;
  font-size: 14px;
}

.countList {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.countItem {
  padding: 4px 8px;
}

.countLabel {
  font-size: 22px;
  font-weight: 600;
}

.countCount {
  color: #909399;
  font-size: 12px;
  margin-top: 2px;
}

.count {
  font-size: 28px;
  font-weight: 600;
  margin-top: 8px;
}

.darkred {
  color: #f56c6c;
}

.orange {
  color: #e6a23c;
}

/* 表格卡片 */
.table-card {
  border-radius: 6px;
  margin-bottom: 10px;
}

/* 可拖动分隔容器 */
.split-container {
  display: flex;
  width: 100%;
  min-height: 400px;
}

.split-panel {
  overflow: hidden;
  min-width: 0;
}

.split-divider {
  width: 12px;
  background: transparent;
  cursor: col-resize;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.2s;
}

.split-divider:hover {
  background: rgba(64, 158, 255, 0.1);
}

.divider-line {
  width: 4px;
  height: 40px;
  background: linear-gradient(180deg, #dcdfe6 0%, #c0c4cc 50%, #dcdfe6 100%);
  border-radius: 2px;
  transition: all 0.2s;
}

.split-divider:hover .divider-line {
  background: linear-gradient(180deg, #409eff 0%, #66b1ff 50%, #409eff 100%);
  height: 60px;
}

.table-card :deep(.el-card__header) {
  padding: 12px 16px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7ed 100%);
  border-bottom: 1px solid #ebeef5;
}

.table-card :deep(.el-card__body) {
  padding: 12px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-title {
  font-size: 15px;
  font-weight: 600;
  color: #606266;
}

/* 加载状态 */
.loading-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  color: #909399;
}

.loading-wrapper i {
  font-size: 32px;
  margin-bottom: 12px;
  color: #409eff;
}

.loading-wrapper span {
  font-size: 14px;
}

/* 表格斑马纹优化 */
:deep(.el-table--striped .el-table__body tr.el-table__row--striped td) {
  background: #fafbfc;
}

/* 表格悬停效果 */
:deep(.el-table__body tr:hover > td) {
  background-color: #ecf5ff !important;
}
</style>
