<template>
  <div class="page-container">
    <el-card class="box-card">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item>
          <div class="flexYCenter">
            <el-upload
              class="upload-xls-btn"
              :action="baseURL + 'waybillSettlement/import2'"
              :headers="uploadHeaders"
              :file-list="fileList"
              :before-upload="beforeUpload"
              :on-success="handleSuccess"
              :on-error="handleError"
              :on-progress="handleProgress"
              :on-remove="handleRemove"
              :limit="1"
              :on-exceed="handleExceed"
              accept=".xls,.xlsx"
            >
              <el-button type="primary">上传物流账单</el-button>
            </el-upload>
            <el-upload
              class="upload-xls-btn"
              :action="baseURL + 'waybillSettlement/import'"
              :headers="uploadHeaders"
              :file-list="fileList"
              :before-upload="beforeUpload"
              :on-success="handleSuccess"
              :on-error="handleError"
              :on-progress="handleProgress"
              :on-remove="handleRemove"
              :limit="1"
              :on-exceed="handleExceed"
              accept=".xls,.xlsx"
            >
              <el-button type="primary">上传查询单号</el-button>
            </el-upload>
          </div>
        </el-form-item>
      </el-form>
    </el-card>

    <div class="tableData">
      <el-table
        :data="tableData"
        border
        stripe
        style="width: 100%"
        :default-sort="{ prop: 'create_time', order: 'descending' }"
      >
        <!-- 主键 -->
        <el-table-column prop="id" label="主键" width="80" align="center" />

        <!-- 运单号 -->
        <el-table-column prop="waybill_no" label="运单号" width="180" align="center" />

        <!-- 账单日期 -->
        <el-table-column prop="bill_date" label="账单日期" width="120" align="center">
          <template slot-scope="scope">
            {{ scope.row.bill_date ? scope.row.bill_date : '-' }}
          </template>
        </el-table-column>

        <!-- 扫描时间 -->
        <el-table-column prop="scan_time" label="扫描时间" width="200" align="center">
          <template slot-scope="scope">
            {{ scope.row.scan_time ? scope.row.scan_time : '-' }}
          </template>
        </el-table-column>

        <!-- 面单账号名称 -->
        <el-table-column prop="face_bill_no" label="面单账号名称" width="150" align="center" />

        <!-- 结算对象 -->
        <el-table-column prop="settlement_object" label="结算对象" width="120" align="center" />

        <!-- 目的省 -->
        <el-table-column prop="dest_province" label="目的省" width="100" align="center" />

        <!-- 目的市 -->
        <el-table-column prop="dest_city" label="目的市" width="100" align="center" />

        <!-- 结算重量 -->
        <el-table-column prop="settlement_weight" label="结算重量" width="120" align="right">
          <template slot-scope="scope">
            {{ scope.row.settlement_weight ? scope.row.settlement_weight.toFixed(3) : '0.000' }}
          </template>
        </el-table-column>

        <!-- 客户快递费（应计） -->
        <el-table-column prop="customer_express_fee" label="客户快递费（应计）" width="140" align="right">
          <template slot-scope="scope">
            {{ scope.row.customer_express_fee ? scope.row.customer_express_fee.toFixed(2) : '0.00' }}
          </template>
        </el-table-column>

        <!-- 预付面单 -->
        <el-table-column prop="prepaid_amount" label="预付面单" width="100" align="right">
          <template slot-scope="scope">
            {{ scope.row.prepaid_amount ? scope.row.prepaid_amount.toFixed(2) : '0.00' }}
          </template>
        </el-table-column>

        <!-- 客户应补运费 -->
        <el-table-column prop="customer_pay_freight" label="客户应补运费" width="120" align="right">
          <template slot-scope="scope">
            {{ scope.row.customer_pay_freight ? scope.row.customer_pay_freight.toFixed(2) : '0.00' }}
          </template>
        </el-table-column>

        <!-- 转件费 -->
        <el-table-column prop="transfer_fee" label="转件费" width="100" align="right">
          <template slot-scope="scope">
            {{ scope.row.transfer_fee ? scope.row.transfer_fee.toFixed(2) : '0.00' }}
          </template>
        </el-table-column>

        <!-- 不规范罚款 -->
        <el-table-column prop="irregular_penalty" label="不规范罚款" width="120" align="right">
          <template slot-scope="scope">
            {{ scope.row.irregular_penalty ? scope.row.irregular_penalty.toFixed(2) : '0.00' }}
          </template>
        </el-table-column>

        <!-- 客户应付合计金额 -->
        <el-table-column prop="customer_pay_total" label="客户应付合计金额" width="140" align="right">
          <template slot-scope="scope">
            {{ scope.row.customer_pay_total ? scope.row.customer_pay_total.toFixed(2) : '0.00' }}
          </template>
        </el-table-column>

        <!-- 运单发放 -->
        <el-table-column prop="shipment" label="运单发放" width="120" align="center" />

        <!-- 寄件人 -->
        <el-table-column prop="sender" label="寄件人" width="100" align="center" />

        <!-- 售后原因 -->
        <el-table-column prop="after_sale_reason" label="售后原因" min-width="180" align="center" />

        <!-- 售后金额 -->
        <el-table-column prop="after_sale_amount" label="售后金额" width="100" align="right">
          <template slot-scope="scope">
            {{ scope.row.after_sale_amount ? scope.row.after_sale_amount.toFixed(2) : '0.00' }}
          </template>
        </el-table-column>

        <!-- 是否有订单 -->
        <el-table-column prop="has_order" label="是否有订单" width="100" align="center">
          <template slot-scope="scope">
            {{ scope.row.has_order === '1' ? '有' : '没有' }}
          </template>
        </el-table-column>

        <!-- 实际发货人ID -->
        <el-table-column prop="user_id" label="实际发货人ID" width="100" align="center" />

        <!-- 实际发货人名称 -->
        <el-table-column prop="user_name" label="实际发货人名称" width="120" align="center" />

        <!-- 备注 -->
        <el-table-column prop="remark" label="备注" min-width="180" align="center" />

        <!-- 创建时间 -->
        <el-table-column prop="create_time" label="创建时间" width="200" align="center">
          <template slot-scope="scope">
            {{ scope.row.create_time ? scope.row.create_time : '-' }}
          </template>
        </el-table-column>

        <!-- 更新时间 -->
        <el-table-column prop="update_time" label="更新时间" width="200" align="center">
          <template slot-scope="scope">
            {{ scope.row.update_time ? scope.row.update_time : '-' }}
          </template>
        </el-table-column>

        <!-- 操作列 -->
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleView(scope.$index, scope.row)">查看</el-button>
            <el-button size="mini" type="warning" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="pages flexXEnd">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="params.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      />
    </div>
  </div>
</template>

<script>
import { get } from '@/api/request'

export default {
  name: 'SetLogistics',
  data() {
    return {
      baseURL: process.env.VUE_APP_BASE_API || '',
      tableData: [],
      formInline: {
        user: '',
        region: ''
      },
      currentPage: 1,
      total: 0,
      fileList: [],
      uploadPercent: 0,
      uploadHeaders: {},
      uploadResult: {
        show: false,
        msg: '',
        type: 'success'
      },
      params: {
        pageNo: 1,
        pageSize: 100,
        waybillNo: null,
        billDateStr: '',
        userId: null
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    // 上传前校验
    beforeUpload(file) {
      const isXls =
        file.type === 'application/vnd.ms-excel' ||
        file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.name.endsWith('.xls') ||
        file.name.endsWith('.xlsx')
      if (!isXls) {
        this.$message.error('请上传 .xls 或 .xlsx 格式的表格文件！')
        return false
      }

      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isLt10M) {
        this.$message.error('文件大小不能超过 10MB！')
        return false
      }

      this.uploadPercent = 0
      this.uploadResult.show = false
      return true
    },

    // 上传进度回调
    handleProgress(event, file, fileList) {
      this.uploadPercent = Math.round(event.percent)
    },

    // 上传成功回调
    handleSuccess(response, file, fileList) {
      this.uploadPercent = 100
      if (response.code === 200) {
        this.uploadResult = {
          show: true,
          msg: `文件 ${file.name} 上传成功！${response.msg || ''}`,
          type: 'success'
        }
        this.$message.success(this.uploadResult.msg)
        this.getList()
      } else {
        this.uploadResult = {
          show: true,
          msg: `文件上传失败：${response.msg || '服务器异常'}`,
          type: 'error'
        }
        this.$message.error(this.uploadResult.msg)
      }
    },

    // 上传失败回调
    handleError(error, file, fileList) {
      this.uploadResult = {
        show: true,
        msg: `文件 ${file.name} 上传失败：${error.message || '网络异常'}`,
        type: 'error'
      }
      this.$message.error(this.uploadResult.msg)
      this.uploadPercent = 0
    },

    // 移除文件回调
    handleRemove(file, fileList) {
      this.fileList = fileList
      this.uploadPercent = 0
      this.uploadResult.show = false
      this.$message.info(`已移除文件 ${file.name}`)
    },

    // 超出文件数量限制回调
    handleExceed(files, fileList) {
      this.$message.warning('最多只能上传 1 个表格文件，请先移除已选择的文件')
    },

    // 分页大小改变
    handleSizeChange(val) {
      this.params.pageSize = val
      this.getList()
    },

    // 当前页改变
    handleCurrentChange(val) {
      this.currentPage = val
      this.params.pageNo = val
      this.getList()
    },

    // 获取列表数据
    getList() {
      get('waybillSettlement/page', this.params)
        .then(res => {
          this.tableData = res.data || []
          this.total = res.total || 0
        })
        .catch(err => {
          console.error('获取数据失败:', err)
        })
    },

    // 查看
    handleView(index, row) {
      console.log('查看:', index, row)
    },

    // 编辑
    handleEdit(index, row) {
      console.log('编辑:', index, row)
    },

    // 删除
    handleDelete(index, row) {
      console.log('删除:', index, row)
    }
  }
}
</script>

<style scoped>
.page-container {
  padding: 20px;
}

.el-card__body,
.el-main {
  padding: 10px !important;
}

.tableData {
  height: calc(100vh - 200px);
  padding: 20px;
  overflow: auto;
}

.pages {
  padding: 20px;
}

.upload-xls-btn {
  margin-right: 20px;
}

.flexYCenter {
  display: flex;
  align-items: center;
}

.flexXEnd {
  display: flex;
  justify-content: flex-end;
}

/* 表格样式 */
.el-table {
  --el-table-header-text-color: #333;
  --el-table-row-hover-bg-color: #f8f9fa;
}
</style>
