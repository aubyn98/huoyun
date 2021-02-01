<template>
  <!-- eslint-disable -->
  <div class="Record">
    <div class="searchTop">
      <div class="topBox" style="flex-wrap:wrap;height:80px;justify-content:flex-start">
        <el-form
          ref="form"
          label-position="right"
          class="card2"
          style="flex-wrap:nowrap;width:100%"
          :label-width="$store.state.mobile ? '80px' : '80px'"
        >
          <el-form-item label="货车种类">
            <el-input placeholder="请输入种类关键字" v-model="searchMsg.carType" clearable></el-input>
          </el-form-item>
          <el-form-item label="货车车号">
            <el-input placeholder="请输入车号关键字" v-model="searchMsg.carNumber" clearable></el-input>
          </el-form-item>
          <el-form-item label="货车挂号">
            <el-input placeholder="请输入挂号关键字" v-model="searchMsg.register" clearable></el-input>
          </el-form-item>
          <el-form-item label="司机名称">
            <el-input placeholder="请输入司机名称关键字" v-model="searchMsg.driver" clearable></el-input>
          </el-form-item>
          <el-form-item label="司机手机">
            <el-input placeholder="请输入司机手机号码" v-model="searchMsg.phone" clearable></el-input>
          </el-form-item>
        </el-form>
        <div style="display:flex;height:38px">
          <el-button
            type="primary"
            icon="el-icon-search"
            style="margin-left:20px"
            @click="search"
          >搜索</el-button>
          <el-button
            type="success"
            icon="el-icon-circle-plus-outline"
            style="margin-left:20px"
            v-if="permission(['all','carEdit'])"
            @click="add"
          >添加</el-button>
          <exportExcel
            style="margin-left:10px"
            :format="format"
            :msg="tableData"
            v-if="!$store.state.mobile"
          ></exportExcel>
        </div>
      </div>
      <!-- <header>货车档案</header> -->
    </div>
    <div class="elTable">
      <el-table :data="tableData" height="250">
        <el-table-column prop="carType" label="车种"></el-table-column>
        <el-table-column prop="carNumber" label="车号"></el-table-column>
        <el-table-column prop="register" label="挂号"></el-table-column>
        <el-table-column prop="driver" label="司机"></el-table-column>
        <el-table-column prop="phone" label="手机号"></el-table-column>
        <el-table-column prop="license" label="驾驶证号"></el-table-column>
        <el-table-column prop="company" label="车属单位"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column label="操作" width="150" v-if="permission(['all','carEdit'])" fixed="right">
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
      <span>确认删除该货车吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmDel">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="货车信息"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      :show-close="true"
      :destroy-on-close="true"
    >
      <div style="height:300px;width:100%;display:flex;flex-direction:column;align-items:center">
        <el-form
          label-position="right"
          :label-width="$store.state.mobile ? '80px' : '80px'"
          :model="form"
          :rules="rules"
          ref="ruleForm"
        >
          <el-form-item label="车　　种" prop="carType">
            <el-input v-model.trim="form.carType" placeholder="请输入货车车种"></el-input>
          </el-form-item>
          <el-form-item label="车　　号" prop="carNumber">
            <el-input v-model.trim="form.carNumber" placeholder="请输入货车车号"></el-input>
          </el-form-item>
          <el-form-item label="挂　　号" prop="register">
            <el-input v-model.trim="form.register" placeholder="请输入货车挂号"></el-input>
          </el-form-item>
          <el-form-item label="司　机" prop="driver">
            <el-input v-model.trim="form.driver" placeholder="请输入货车司机"></el-input>
          </el-form-item>
          <el-form-item label="手 机 号" prop="phone" width="110">
            <el-input v-model.number="form.phone" placeholder="请输入司机电话"></el-input>
          </el-form-item>
          <el-form-item label="驾驶证号" prop="license">
            <el-input v-model.trim="form.license" placeholder="请输入司机驾驶证号"></el-input>
          </el-form-item>
          <el-form-item label="车属单位" prop="company">
            <el-input v-model.trim="form.company" placeholder="请输入车属单位"></el-input>
          </el-form-item>
          <el-form-item label="备　注">
            <el-input v-model.trim="form.remark" placeholder="请输入备注" type="textarea"></el-input>
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
        carType: '车种',
        carNumber: '车号',
        register: '挂号',
        driver: '司机',
        phone: '手机号',
        company: '车属单位',
        license: '驾驶证号',
        remark: '备注'
      },
      Initform: {
        id: '',
        carType: '',
        carNumber: '',
        register: '',
        driver: '',
        phone: '',
        company: '',
        license: '',
        remark: ''
      },
      form: {},
      oldForm: {},
      type: 'add',
      total: 1,
      searchMsg: {
        carType: '',
        carNumber: '',
        register: '',
        company: '',
        driver: '',
        phone: '',
        i: 1
      },
      tableData: [],
      dialogVisible: false,
      dialogFormVisible: false,
      rules: {
        carType: [
          { required: true, message: '请输入货车车种', trigger: 'blur' }
        ],
        carNumber: [
          { required: true, message: '请输入货车车号', trigger: 'blur' }
        ],
        /* register: [
          { required: true, message: '请输入货车挂号', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入货车电话', trigger: 'blur' },
          { type: 'number', message: '电话必须为数字值', trigger: 'blur' }
        ], */
        driver: [{ required: true, message: '请输入货车司机', trigger: 'blur' }]
      }
    }
  },
  methods: {
    get() {
      this.$req('car', this.searchMsg, {
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
          if (this.form.phone.toString().length !== 11) {
            return this.$message.error('请填入11位数字的手机号码')
          }
          if (this.type === 'add') {
            this.$req('car/add', this.form).then(data => {
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
            this.$req('car/update', this.form).then(data => {
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
      this.$req('car/delete', {
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
