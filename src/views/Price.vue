<template>
  <div class="price-page">
    <el-card class="main-card" shadow="hover">
      <div slot="header" class="card-header">
        <div class="header-left">
          <i class="el-icon-price-tag header-icon"></i>
          <span class="header-title">价格表</span>
        </div>
        <div class="header-right">
          <BackHomeButton in-header />
          <el-button type="primary" size="small" icon="el-icon-check" @click="submit">
            确认修改
          </el-button>
        </div>
      </div>

      <!-- 筛选区域 -->
      <div class="filter-section">
        <el-form :inline="true" :model="filterForm" class="filter-form">
          <el-form-item label="产品">
            <el-select v-model="filterForm.productId" placeholder="全部产品" clearable size="small">
              <el-option
                v-for="item in productList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="颜色">
            <el-select v-model="filterForm.colorName" placeholder="全部颜色" clearable size="small" filterable>
              <el-option
                v-for="item in colorList"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="款式">
            <el-select v-model="filterForm.styleName" placeholder="全部款式" clearable size="small">
              <el-option
                v-for="item in styleList"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="尺码">
            <el-select v-model="filterForm.sizeStr" placeholder="全部尺码" clearable size="small">
              <el-option
                v-for="item in sizeList"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" icon="el-icon-search" @click="handleFilter">筛选</el-button>
            <el-button size="small" icon="el-icon-refresh" @click="resetFilter">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-card class="table-card" shadow="never">
            <div slot="header" class="table-header">
              <span class="table-title">商家一</span>
              <el-tag size="small" type="success">{{ filteredData1.length }} 条记录</el-tag>
            </div>
            <el-table
              :data="filteredData1"
              border
              stripe
              size="small"
              :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }"
              @selection-change="handleSelectionChange">
              <el-table-column align="center" prop="id" label="ID" width="60"></el-table-column>
              <el-table-column align="center" prop="clotheMerchantId" label="商家" width="100" :formatter="formatName2"></el-table-column>
              <el-table-column align="center" prop="productId" label="产品名称" width="100" :formatter="formatName"></el-table-column>
              <el-table-column align="center" prop="colorName" label="颜色名称" min-width="80"></el-table-column>
              <el-table-column align="center" prop="styleName" label="款式名称" min-width="80"></el-table-column>
              <el-table-column align="center" prop="brightnessStr" label="亮度等级" min-width="80"></el-table-column>
              <el-table-column align="center" prop="sizeStr" label="尺码" width="70"></el-table-column>
              <el-table-column align="center" prop="price" label="价格（元）" width="120">
                <template slot-scope="scope">
                  <div class="price-input-wrapper">
                    <span class="price-prefix">¥</span>
                    <input type="number" class="price-input" v-model="scope.row.price">
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="updateTime" label="更新时间" width="160"></el-table-column>
            </el-table>
          </el-card>
        </el-col>

        <el-col :span="12">
          <el-card class="table-card" shadow="never">
            <div slot="header" class="table-header">
              <span class="table-title">其他商家</span>
              <el-tag size="small" type="info">{{ filteredData2.length }} 条记录</el-tag>
            </div>
            <el-table
              :data="filteredData2"
              border
              stripe
              size="small"
              :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }"
              @selection-change="handleSelectionChange">
              <el-table-column align="center" type="index" label="序号" width="60"></el-table-column>
              <el-table-column align="center" prop="clotheMerchantId" label="商家" width="100" :formatter="formatName2"></el-table-column>
              <el-table-column align="center" prop="productId" label="产品名称" width="100" :formatter="formatName"></el-table-column>
              <el-table-column align="center" prop="colorName" label="颜色名称" min-width="80"></el-table-column>
              <el-table-column align="center" prop="styleName" label="款式名称" min-width="80"></el-table-column>
              <el-table-column align="center" prop="brightnessStr" label="亮度等级" min-width="80"></el-table-column>
              <el-table-column align="center" prop="sizeStr" label="尺码" width="70"></el-table-column>
              <el-table-column align="center" prop="price" label="价格（元）" width="120">
                <template slot-scope="scope">
                  <div class="price-input-wrapper">
                    <span class="price-prefix">¥</span>
                    <input type="number" class="price-input" v-model="scope.row.price">
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="updateTime" label="更新时间" width="160"></el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { get, post } from '@/api/request'
import { colorList, styleList, sizeList } from '@/utils/dict'
import BackHomeButton from '@/components/BackHomeButton.vue'

export default {
  name: 'Price',
  components: { BackHomeButton },
  data() {
    return {
      tableData: [],
      tableData1: [],
      tableData2: [],
      filteredData1: [],
      filteredData2: [],
      productList: [],
      merchantList: [],
      multipleSelection: [],
      colorList,
      styleList,
      sizeList,
      filterForm: {
        productId: '',
        colorName: '',
        styleName: '',
        sizeStr: ''
      }
    }
  },
  mounted() {
    Promise.all([this.getProductList(), this.getMerchantList()]).then(() => {
      this.getList()
    })
  },
  methods: {
    submit() {
      post('priceSetting/batchSaveOrUpdate', {
        priceList: [...this.tableData1, ...this.tableData2]
      }).then(() => {
        this.$message.success('更新成功')
      }).catch(err => {
        this.$message.error(err || '更新失败')
      })
    },
    getList() {
      get('priceSetting/list').then(res => {
        this.tableData = res.data
        this.tableData1 = this.tableData.filter(f => f.clotheMerchantId == 13)
        this.tableData2 = this.tableData.filter(f => f.clotheMerchantId != 13)
        this.handleFilter()
      }).catch(err => {
        console.error(err)
      })
    },
    handleFilter() {
      const { productId, colorName, styleName, sizeStr } = this.filterForm
      const filterFn = (item) => {
        if (productId && item.productId != productId) return false
        if (colorName && !item.colorName?.includes(colorName)) return false
        if (styleName && !item.styleName?.includes(styleName)) return false
        if (sizeStr && !item.sizeStr?.includes(sizeStr)) return false
        return true
      }
      this.filteredData1 = this.tableData1.filter(filterFn)
      this.filteredData2 = this.tableData2.filter(filterFn)
    },
    resetFilter() {
      this.filterForm = {
        productId: '',
        colorName: '',
        styleName: '',
        sizeStr: ''
      }
      this.handleFilter()
    },
    getProductList() {
      return get('product/list').then(res => {
        this.productList = res.data
      }).catch(err => {
        console.error(err)
      })
    },
    getMerchantList() {
      return get('merchant/list').then(res => {
        this.merchantList = res.data
      }).catch(err => {
        console.error(err)
      })
    },
    formatPrice(row, column, cellValue) {
      return '¥' + cellValue.toFixed(2)
    },
    formatName(row, column, cellValue) {
      return this.productList.find(f => f.id == cellValue)?.name
    },
    formatName2(row, column, cellValue) {
      return this.merchantList.find(f => f.id == cellValue)?.name
    },
    handleEdit(index, row) {
      console.log(index, row)
    },
    handleDelete(index, row) {
      console.log(index, row)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>

<style scoped>
.price-page {
  padding: 20px;
  background: #f0f2f5;
  min-height: calc(100vh - 60px);
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

.table-card {
  border-radius: 6px;
  margin-bottom: 10px;
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

.filter-section {
  background: #fafbfc;
  padding: 16px;
  border-radius: 6px;
  margin-bottom: 16px;
  border: 1px solid #ebeef5;
}

.filter-form {
  margin-bottom: -18px;
}

.filter-form :deep(.el-form-item) {
  margin-bottom: 10px;
}

.filter-form :deep(.el-form-item__label) {
  color: #606266;
  font-weight: 500;
}

.price-input-wrapper {
  display: flex;
  align-items: center;
  background: #f5f7fa;
  border-radius: 4px;
  padding: 4px 8px;
  border: 1px solid #dcdfe6;
  transition: all 0.3s;
}

.price-input-wrapper:hover {
  border-color: #c0c4cc;
}

.price-input-wrapper:focus-within {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.price-prefix {
  color: #909399;
  font-size: 14px;
  margin-right: 4px;
}

.price-input {
  border: none;
  background: transparent;
  width: 70px;
  font-size: 14px;
  color: #303133;
  text-align: right;
}

.price-input:focus {
  outline: none;
}

.price-input::-webkit-inner-spin-button,
.price-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
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
