<template>
  <div class="price-page">
    <el-card class="main-card" shadow="hover">
      <div slot="header" class="card-header">
        <div class="header-left">
          <i class="el-icon-price-tag header-icon"></i>
          <span class="header-title">价格表</span>
        </div>
        <el-button type="primary" size="small" icon="el-icon-check" @click="submit">
          确认修改
        </el-button>
      </div>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-card class="table-card" shadow="never">
            <div slot="header" class="table-header">
              <span class="table-title">商家一</span>
              <el-tag size="small" type="success">{{ tableData1.length }} 条记录</el-tag>
            </div>
            <el-table
              :data="tableData1"
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
              <el-tag size="small" type="info">{{ tableData2.length }} 条记录</el-tag>
            </div>
            <el-table
              :data="tableData2"
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

export default {
  name: 'Price',
  data() {
    return {
      tableData: [],
      tableData1: [],
      tableData2: [],
      productList: [],
      merchantList: [],
      multipleSelection: []
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
      }).catch(err => {
        console.error(err)
      })
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
  padding: 10px;
}

.el-card__body,
.el-main {
  padding: 10px !important;
}

.price-input {
  border: none;
  padding: 0 10px;
  width: 100%;
  background: #f5f5f5;
}

.price-input:focus {
  outline: none;
}
</style>
