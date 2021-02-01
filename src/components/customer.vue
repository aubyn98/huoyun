<template>
  <!-- eslint-disable -->
  <div class="Record">
    <div class="searchTop">
      <div class="topBox">
        <el-form
          ref="form"
          label-position="left"
          class="card2"
          style="flex-wrap:nowrap;width:750px"
          :label-width="$store.state.mobile ? '' : ''"
        >
          <el-form-item label="客户名称">
            <el-input placeholder="请输入客户关键字" v-model="searchMsg.customerName" clearable></el-input>
          </el-form-item>
          <el-form-item label="客户简码">
            <el-input placeholder="请输入客户简码关键字" v-model="searchMsg.simpleCode" clearable></el-input>
          </el-form-item>
          <el-form-item label="手机号码">
            <el-input placeholder="请输入客户手机号码" v-model="searchMsg.telephone" clearable></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-search" style="margin-left:20px" @click="search">搜索</el-button>
        <el-button
          type="success"
          icon="el-icon-circle-plus-outline"
          style="margin-left:20px"
          v-if="permission(['all','customerEdit'])"
          @click="add"
        >添加</el-button>
        <exportExcel
          style="margin-left:10px"
          :format="format"
          :msg="tableData"
          v-if="!$store.state.mobile"
        ></exportExcel>
      </div>
      <!-- <header>客户档案</header> -->
    </div>
    <div class="elTable">
      <el-table :data="tableData" height="250">
        <el-table-column prop="customerName" label="客户名称"></el-table-column>
        <el-table-column prop="freight" label="运费到"></el-table-column>
        <el-table-column prop="address" label="位置"></el-table-column>
        <el-table-column prop="telephone" label="手机" width="110"></el-table-column>
        <el-table-column prop="phone" label="电话"></el-table-column>
        <el-table-column prop="liaison" label="联系人"></el-table-column>
        <el-table-column prop="fax" label="传真"></el-table-column>
        <el-table-column prop="simpleCode" label="简码"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column
          label="操作"
          width="150"
          v-if="permission(['all','customerEdit'])"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="change(scope.$index)">修改</el-button>
            <el-button size="mini" type="danger" @click="remove(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      background
      layout="prev, pager, next"
      style="margin-top:10px"
      :total="total"
      :current-page.sync="searchMsg.i"
      :page-size="20"
      @current-change="currentChange"
    ></el-pagination>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" close-on-click-modal>
      <span>确认删除该客户吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmDel">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="客户信息"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      :show-close="true"
      :destroy-on-close="true"
    >
      <div style="height:300px;width:100%;display:flex;flex-direction:column;align-items:center">
        <el-form
          label-position="right"
          :label-width="$store.state.mobile ? '70px' : '70px'"
          :model="form"
          :rules="rules"
          ref="ruleForm"
        >
          <el-form-item label="客　户" prop="customerName">
            <el-input v-model.trim="form.customerName" placeholder="请输入客户名称"></el-input>
          </el-form-item>
          <el-form-item label="运费到" prop="freight">
            <el-input v-model.trim="form.freight" placeholder="请输入运费到"></el-input>
          </el-form-item>
          <el-form-item label="位　置" prop="address">
            <el-input v-model.trim="form.address" placeholder="请输入客户地址"></el-input>
          </el-form-item>
          <el-form-item label="手　机" prop="telephone">
            <el-input v-model.number="form.telephone" placeholder="请输入客户手机"></el-input>
          </el-form-item>
          <el-form-item label="电　话" prop="phone">
            <el-input v-model.number="form.phone" placeholder="请输入客户电话"></el-input>
          </el-form-item>
          <el-form-item label="联系人" prop="liaison">
            <el-input v-model.trim="form.liaison" placeholder="请输入联系人"></el-input>
          </el-form-item>
          <el-form-item label="传　真">
            <el-input v-model.trim="form.fax" placeholder="请输入传真号码"></el-input>
          </el-form-item>
          <el-form-item label="简　码" prop="simpleCode">
            <el-input v-model.trim="form.simpleCode" placeholder="请输入简码"></el-input>
          </el-form-item>
          <el-form-item label="备　注">
            <el-input v-model.trim="form.remark" placeholder="请输入客户备注" type="textarea"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
export default {
  created() {
    this.initFormData()
    this.get()
  },
  data() {
    return {
      index: 0,
      format: {
        customerName: '客户名称',
        freight: '运费到',
        address: '位置',
        telephone: '手机',
        phone: '电话',
        liaison: '联系人',
        fax: '传真',
        simpleCode: '简码',
        remark: '备注'
      },
      Initform: {
        id: '',
        customerName: '',
        freight: '',
        address: '',
        telephone: '',
        phone: '',
        liaison: '',
        fax: '',
        simpleCode: '',
        remark: ''
      },
      form: {},
      oldForm: {},
      type: 'add',
      total: 1,
      searchMsg: {
        customerName: '',
        simpleCode: '',
        telephone: '',
        i: 1
      },
      tableData: [],
      dialogVisible: false,
      dialogFormVisible: false,
      rules: {
        customerName: [
          { required: true, message: '请输入客户名称', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入客户地址', trigger: 'blur' }
        ],
        freight: [{ required: true, message: '请输入运费到', trigger: 'blur' }],
        phone: [
          { required: true, message: '请输入客户电话', trigger: 'blur' },
          { type: 'number', message: '电话必须为数字值', trigger: 'blur' }
        ],
        telephone: [
          { required: true, message: '请输入客户手机', trigger: 'blur' },
          { type: 'number', message: '手机必须为数字值', trigger: 'blur' }
        ],
        liaison: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
        simpleCode: [{ required: true, message: '请输入简码', trigger: 'blur' }]
      }
    }
  },
  watch: {
    'form.customerName'(value) {
      this.form.simpleCode = this.py.getCamelChars(value)
    }
  },
  methods: {
    get() {
      this.$req('customer', this.searchMsg, {
        method: 'get'
      }).then(data => {
        this.tableData = data.res
        this.total = data.total
      })
    },
    search() {
      this.searchMsg.i = 1
      this.get()
    },
    add() {
      this.type = 'add'
      this.initFormData()
      this.dialogFormVisible = true
    },
    change(i) {
      this.index = i
      this.type = 'change'
      this.tableData[i].phone = parseInt(this.tableData[i].phone)
      this.tableData[i].telephone = parseInt(this.tableData[i].telephone)
      this.form = this.copy(this.tableData[i])
      this.oldForm = this.copy(this.form)
      this.dialogFormVisible = true
    },
    remove(i) {
      this.index = i
      this.dialogVisible = true
    },
    confirm() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (this.form.telephone.toString().length !== 11) {
            return this.$message.error('请填入11位数字的手机号码')
          }
          if (this.type === 'add') {
            this.$req('customer/add', this.form).then(data => {
              if (data.status === 1) {
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })
                this.tableData.unshift(data.res)
                this.initFormData()
              } else if (data.status === 0) {
                this.$message.error('添加失败')
              }
            })
          } else {
            this.$req('customer/update', this.form).then(data => {
              if (data.status === 1) {
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
                this.tableData.splice(this.index, 1, this.form)
              } else if (data.status === 0) {
                this.$message.error('修改失败')
              }
            })
          }
        }
      })
    },
    cancel() {
      this.dialogFormVisible = false
    },
    confirmDel() {
      this.$req('customer/delete', {
        id: this.tableData[this.index].id
      }).then(data => {
        if (data.status === 1) {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.tableData.splice(this.index, 1)
        } else if (data.status === 0) {
          this.$message.error('删除失败')
        }
        this.dialogVisible = false
      })
    },
    currentChange(i) {
      this.searchMsg.i = i
      this.get()
    },
    initFormData() {
      this.form = this.copy(this.Initform)
    }
  }
}
</script>
