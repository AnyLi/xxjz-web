<template>
  <div class="page-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">
        <i class="el-icon-truck"></i>
        物流结算管理
      </h2>
      <BackHomeButton in-header />
    </div>

    <!-- 操作卡片 -->
    <el-card class="box-card" shadow="hover">
      <div slot="header" class="card-header">
        <span><i class="el-icon-upload2"></i> 数据导入</span>
      </div>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item>
          <div class="flexYCenter">
            <!-- 上传物流账单 -->
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
              <el-button type="primary" icon="el-icon-document">
                上传物流账单
              </el-button>
            </el-upload>

            <!-- 分隔线 -->
            <el-divider direction="vertical"></el-divider>

            <!-- 用户选择 -->
            <el-select
              v-model="selectedUserId"
              placeholder="请选择用户"
              clearable
              filterable
              style="width: 200px"
              @change="handleUserChange"
            >
              <el-option
                v-for="item in userList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>

            <!-- 上传查询单号 -->
            <el-upload
              class="upload-xls-btn"
              :action="baseURL + 'waybillSettlement/import2'"
              :headers="uploadHeaders"
              :data="uploadData"
              :file-list="fileList2"
              :before-upload="beforeUpload2"
              :on-success="handleSuccess"
              :on-error="handleError"
              :on-progress="handleProgress"
              :on-remove="handleRemove2"
              :limit="1"
              :on-exceed="handleExceed"
              accept=".xls,.xlsx"
            >
              <el-button type="success" icon="el-icon-search">
                上传查询单号
              </el-button>
            </el-upload>
          </div>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 筛选卡片 -->
    <el-card class="box-card filter-card" shadow="hover">
      <div slot="header" class="card-header">
        <span><i class="el-icon-filter"></i> 数据筛选</span>
      </div>
      <el-form :inline="true" :model="params" class="filter-form">
        <el-form-item label="订单号">
          <el-input
            v-model="params.waybillNo"
            placeholder="请输入订单号"
            clearable
            style="width: 200px"
            @keyup.enter.native="handleSearch"
          >
            <i slot="prefix" class="el-input__icon el-icon-tickets"></i>
          </el-input>
        </el-form-item>
        <el-form-item label="账单日期">
          <el-date-picker
            v-model="params.billDateStr"
            type="month"
            placeholder="选择月份"
            value-format="yyyy-MM"
            clearable
            style="width: 180px"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="用户">
          <el-select
            v-model="params.userId"
            placeholder="请选择用户"
            clearable
            filterable
            style="width: 180px"
          >
            <el-option
              v-for="item in userList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
          <el-button icon="el-icon-refresh" @click="handleReset">重置</el-button>
          <el-button type="warning" icon="el-icon-download" @click="handleExport">导出</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <div class="tableData">
      <el-table
        :data="tableData"
        border
        stripe
        style="width: 100%"
        :default-sort="{ prop: 'createTime', order: 'descending' }"
      >
        <!-- 运单号 -->
        <el-table-column prop="waybillNo" label="运单号" width="180" align="center" />

        <!-- 账单日期 -->
        <el-table-column prop="billDate" label="账单日期" width="120" align="center">
          <template slot-scope="scope">
            {{ scope.row.billDate ? scope.row.billDate : '-' }}
          </template>
        </el-table-column>

        <!-- 扫描时间 -->
        <el-table-column prop="scanTime" label="扫描时间" width="200" align="center">
          <template slot-scope="scope">
            {{ scope.row.scanTime ? scope.row.scanTime : '-' }}
          </template>
        </el-table-column>

        <!-- 面单账号名称 -->
        <el-table-column prop="faceBillNo" label="面单账号名称" width="150" align="center" />

        <!-- 结算对象 -->
        <el-table-column prop="settlementObject" label="结算对象" width="120" align="center" />

        <!-- 目的省 -->
        <el-table-column prop="destProvince" label="目的省" width="100" align="center" />

        <!-- 目的市 -->
        <el-table-column prop="destCity" label="目的市" width="100" align="center" />

        <!-- 结算重量 -->
        <el-table-column prop="settlementWeight" label="结算重量" width="120" align="right">
          <template slot-scope="scope">
            {{ scope.row.settlementWeight ? scope.row.settlementWeight.toFixed(3) : '0.000' }}
          </template>
        </el-table-column>

        <!-- 客户快递费（应计） -->
        <el-table-column prop="customerExpressFee" label="客户快递费（应计）" width="140" align="right">
          <template slot-scope="scope">
            {{ scope.row.customerExpressFee ? scope.row.customerExpressFee.toFixed(2) : '0.00' }}
          </template>
        </el-table-column>

        <!-- 预付面单 -->
        <el-table-column prop="prepaidAmount" label="预付面单" width="100" align="right">
          <template slot-scope="scope">
            {{ scope.row.prepaidAmount ? scope.row.prepaidAmount.toFixed(2) : '0.00' }}
          </template>
        </el-table-column>

        <!-- 客户应补运费 -->
        <el-table-column prop="customerPayFreight" label="客户应补运费" width="120" align="right">
          <template slot-scope="scope">
            {{ scope.row.customerPayFreight ? scope.row.customerPayFreight.toFixed(2) : '0.00' }}
          </template>
        </el-table-column>

        <!-- 转件费 -->
        <el-table-column prop="transferFee" label="转件费" width="100" align="right">
          <template slot-scope="scope">
            {{ scope.row.transferFee ? scope.row.transferFee.toFixed(2) : '0.00' }}
          </template>
        </el-table-column>

        <!-- 不规范罚款 -->
        <el-table-column prop="irregularPenalty" label="不规范罚款" width="120" align="right">
          <template slot-scope="scope">
            {{ scope.row.irregularPenalty ? scope.row.irregularPenalty.toFixed(2) : '0.00' }}
          </template>
        </el-table-column>

        <!-- 客户应付合计金额 -->
        <el-table-column prop="customerPayTotal" label="客户应付合计金额" width="140" align="right">
          <template slot-scope="scope">
            {{ scope.row.customerPayTotal ? scope.row.customerPayTotal.toFixed(2) : '0.00' }}
          </template>
        </el-table-column>

        <!-- 运单发放 -->
        <el-table-column prop="shipment" label="运单发放" width="120" align="center" />

        <!-- 寄件人 -->
        <el-table-column prop="sender" label="寄件人" width="100" align="center" />

        <!-- 售后原因 -->
        <el-table-column prop="afterSaleReason" label="售后原因" min-width="180" align="center" />

        <!-- 售后金额 -->
        <el-table-column prop="afterSaleAmount" label="售后金额" width="100" align="right">
          <template slot-scope="scope">
            {{ scope.row.afterSaleAmount ? scope.row.afterSaleAmount.toFixed(2) : '0.00' }}
          </template>
        </el-table-column>

        <!-- 是否有订单 -->
        <el-table-column prop="hasOrder" label="是否有订单" width="100" align="center">
          <template slot-scope="scope">
            {{ scope.row.hasOrder === '1' ? '有' : '没有' }}
          </template>
        </el-table-column>

        <!-- 实际发货人ID -->
        <el-table-column prop="userId" label="实际发货人ID" width="100" align="center" />

        <!-- 实际发货人名称 -->
        <el-table-column prop="userName" label="实际发货人名称" width="120" align="center" />

        <!-- 创建时间 -->
        <el-table-column prop="createTime" label="创建时间" width="200" align="center">
          <template slot-scope="scope">
            {{ scope.row.createTime ? scope.row.createTime : '-' }}
          </template>
        </el-table-column>

        <!-- 更新时间 -->
        <el-table-column prop="updateTime" label="更新时间" width="200" align="center">
          <template slot-scope="scope">
            {{ scope.row.updateTime ? scope.row.updateTime : '-' }}
          </template>
        </el-table-column>

        <!-- 操作列 -->
        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="warning" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="pages flexXEnd">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50]"
        :page-size="params.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      />
    </div>

    <!-- 编辑弹窗 -->
    <el-dialog
      title="编辑信息"
      :visible.sync="editDialogVisible"
      width="800px"
      :close-on-click-modal="false"
    >
      <el-form :model="editForm" label-width="140px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="运单号">
              <el-input v-model="editForm.waybillNo" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="账单日期">
              <el-date-picker
                v-model="editForm.billDate"
                type="date"
                value-format="yyyy-MM-dd"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="用户">
              <el-select v-model="editForm.userId" style="width: 100%" @change="handleEditUserChange">
                <el-option
                  v-for="item in userList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结算重量">
              <el-input-number v-model="editForm.settlementWeight" :precision="3" :step="0.1" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="客户快递费">
              <el-input-number v-model="editForm.customerExpressFee" :precision="2" :step="0.1" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预付面单">
              <el-input-number v-model="editForm.prepaidAmount" :precision="2" :step="0.1" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="客户应补运费">
              <el-input-number v-model="editForm.customerPayFreight" :precision="2" :step="0.1" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="转件费">
              <el-input-number v-model="editForm.transferFee" :precision="2" :step="0.1" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="不规范罚款">
              <el-input-number v-model="editForm.irregularPenalty" :precision="2" :step="0.1" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="售后金额">
              <el-input-number v-model="editForm.afterSaleAmount" :precision="2" :step="0.1" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="售后原因">
              <el-input v-model="editForm.afterSaleReason" type="textarea" :rows="2" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEdit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 删除确认弹窗 -->
    <el-dialog
      title="删除确认"
      :visible.sync="deleteDialogVisible"
      width="500px"
    >
      <el-form :model="deleteForm" label-width="100px">
        <el-form-item label="用户" required>
          <el-select v-model="deleteForm.userId" placeholder="请选择用户" style="width: 100%">
            <el-option
              v-for="item in userList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="账单日期" required>
          <el-date-picker
            v-model="deleteForm.billDateStr"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <p style="color: #E6A23C; margin-top: 10px;">
        <i class="el-icon-warning"></i> 将删除该用户在该日期的所有物流结算记录，请谨慎操作！
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">取 消</el-button>
        <el-button type="danger" @click="submitDelete">确认删除</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { get, post, baseURL } from '@/api/request'
import BackHomeButton from '@/components/BackHomeButton.vue'

export default {
  name: 'SetLogistics',
  components: { BackHomeButton },
  data() {
    return {
      baseURL: baseURL,
      tableData: [],
      formInline: {
        user: '',
        region: ''
      },
      currentPage: 1,
      total: 0,
      fileList: [],
      fileList2: [],
      uploadPercent: 0,
      uploadHeaders: {},
      uploadResult: {
        show: false,
        msg: '',
        type: 'success'
      },
      params: {
        pageNo: 1,
        pageSize: 10,
        waybillNo: null,
        billDateStr: '',
        userId: null
      },
      // 用户相关
      userList: [],
      selectedUserId: '',
      selectedUserName: '',
      // 上传查询单号附带参数
      uploadData: {
        userId: '',
        userName: '',
        flag: ''
      },
      // 编辑弹窗
      editDialogVisible: false,
      editForm: {},
      // 删除弹窗
      deleteDialogVisible: false,
      deleteForm: {
        userId: null,
        billDateStr: ''
      }
    }
  },
  mounted() {
    this.getList()
    this.getUserList()
    // 设置上传请求头，携带token
    const token = localStorage.getItem('token')
    if (token) {
      this.uploadHeaders = {
        Authorization: `Bearer ${token}`
      }
    }
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
        // 清空文件列表
        this.fileList = []
        this.fileList2 = []
        // 重新获取列表数据
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
          this.tableData = res.data.records || []
          this.total = res.data.total || 0
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
      this.editForm = { ...row }
      this.editDialogVisible = true
    },

    // 编辑弹窗中用户变化
    handleEditUserChange(val) {
      const user = this.userList.find(item => item.id === val)
      if (user) {
        this.editForm.userName = user.name
      }
    },

    // 提交编辑
    submitEdit() {
      post('waybillSettlement/saveOrUpdate', this.editForm)
        .then(res => {
          this.$message.success('保存成功')
          this.editDialogVisible = false
          this.getList()
        })
        .catch(err => {
          console.error('保存失败:', err)
          this.$message.error('保存失败：' + (err || '服务器异常'))
        })
    },

    // 删除
    handleDelete(index, row) {
      this.deleteForm = {
        userId: row.userId,
        billDateStr: row.billDate
      }
      this.deleteDialogVisible = true
    },

    // 提交删除
    submitDelete() {
      if (!this.deleteForm.userId || !this.deleteForm.billDateStr) {
        this.$message.warning('请选择用户和账单日期')
        return
      }
      get('waybillSettlement/delete', this.deleteForm)
        .then(res => {
          this.$message.success('删除成功')
          this.deleteDialogVisible = false
          this.getList()
        })
        .catch(err => {
          console.error('删除失败:', err)
          this.$message.error('删除失败：' + (err || '服务器异常'))
        })
    },

    // 获取用户列表
    getUserList() {
      get('user/list')
        .then(res => {
          this.userList = res.data || []
        })
        .catch(err => {
          console.error('获取用户列表失败:', err)
        })
    },

    // 用户选择变化
    handleUserChange(val) {
      const user = this.userList.find(item => item.id === val)
      if (user) {
        this.selectedUserName = user.name
        this.uploadData = {
          userId: user.id,
          userName: user.name,
          flag: '1'
        }
      } else {
        this.selectedUserName = ''
        this.uploadData = {
          userId: '',
          userName: '',
          flag: ''
        }
      }
    },

    // 上传查询单号前校验
    beforeUpload2(file) {
      if (!this.selectedUserId) {
        this.$message.warning('请先选择用户！')
        return false
      }
      return this.beforeUpload(file)
    },

    // 移除查询单号文件
    handleRemove2(file, fileList) {
      this.fileList2 = fileList
      this.uploadPercent = 0
      this.uploadResult.show = false
      this.$message.info(`已移除文件 ${file.name}`)
    },

    // 查询
    handleSearch() {
      this.currentPage = 1
      this.params.pageNo = 1
      this.getList()
    },

    // 重置
    handleReset() {
      this.params = {
        pageNo: 1,
        pageSize: this.params.pageSize,
        waybillNo: null,
        billDateStr: '',
        userId: null
      }
      this.currentPage = 1
      this.getList()
    },

    // 导出
    handleExport() {
      const params = new URLSearchParams()
      params.append('pageNo', 1)
      params.append('pageSize', 999)
      if (this.params.waybillNo) {
        params.append('waybillNo', this.params.waybillNo)
      }
      if (this.params.billDateStr) {
        params.append('billDateStr', this.params.billDateStr)
      }
      if (this.params.userId) {
        params.append('userId', this.params.userId)
      }

      const token = localStorage.getItem('token')
      const url = `${this.baseURL}waybillSettlement/export?${params.toString()}`

      // 使用 fetch 下载文件
      fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('导出失败')
          }
          return response.blob()
        })
        .then(blob => {
          const downloadUrl = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = downloadUrl
          a.download = `物流结算数据_${new Date().toLocaleDateString()}.xlsx`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          window.URL.revokeObjectURL(downloadUrl)
          this.$message.success('导出成功')
        })
        .catch(err => {
          console.error('导出失败:', err)
          this.$message.error('导出失败，请稍后重试')
        })
    }
  }
}
</script>

<style scoped>
.page-container {
  padding: 24px;
  background: #f5f7fa;
  min-height: 100vh;
}

/* 页面标题 */
.page-header {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  color: #303133;
  display: flex;
  align-items: center;
}

.page-title i {
  margin-right: 10px;
  color: #409EFF;
  font-size: 26px;
}

/* 卡片样式 */
.box-card {
  border-radius: 8px;
  margin-bottom: 20px;
}

.card-header {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.card-header i {
  margin-right: 8px;
  color: #409EFF;
}

/* 表格容器 */
.tableData {
  height: calc(100vh - 280px);
  padding: 0 20px;
  overflow: auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

/* 分页样式 */
.pages {
  padding: 20px;
  background: #fff;
  border-radius: 0 0 8px 8px;
  margin-top: -1px;
}

/* 上传按钮 */
.upload-xls-btn {
  margin-right: 16px;
}

.upload-xls-btn:last-child {
  margin-right: 0;
}

.flexYCenter {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.flexXEnd {
  display: flex;
  justify-content: flex-end;
}

/* 表格样式优化 */
.el-table {
  border-radius: 8px;
}

.el-table >>> .el-table__header th {
  background-color: #f5f7fa !important;
  color: #303133;
  font-weight: 600;
}

.el-table >>> .el-table__row:hover > td {
  background-color: #ecf5ff !important;
}

/* 操作按钮间距 */
.el-table >>> .el-button + .el-button {
  margin-left: 8px;
}

/* 按钮图标样式 */
.el-button i {
  margin-right: 4px;
}
</style>
