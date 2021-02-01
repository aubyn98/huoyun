<template>
  <!-- eslint-disable -->
  <div class="Record">
    <div class="searchTop">
      <div class="topBox">
        <el-form
          ref="form"
          label-position="left"
          class="card2"
          :label-width="$store.state.mobile ? '' : ''"
        >
          <el-form-item label="单位名称">
            <el-input placeholder="请输入单位关键字" v-model="searchMsg.unit" clearable></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-search" style="margin-left:20px" @click="search">搜索</el-button>
        <el-button
          type="success"
          icon="el-icon-circle-plus-outline"
          style="margin-left:20px"
          v-if="permission(['all','unitEdit'])"
          @click="add"
        >添加</el-button>
        <exportExcel
          style="margin-left:10px"
          :format="format"
          :msg="tableData"
          v-if="!$store.state.mobile"
        ></exportExcel>
      </div>
      <!-- <header>单位档案</header> -->
    </div>
    <div class="elTable">
      <el-table :data="tableData" height="250">
        <el-table-column prop="unit" label="单位名称"></el-table-column>
        <el-table-column label="操作" width="150" v-if="permission(['all','unitEdit'])" fixed="right">
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
      <span>确认删除该单位吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmDel">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="单位信息"
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
          <el-form-item label="单　位" prop="unit">
            <el-input v-model.trim="form.unit" placeholder="请输入单位名称"></el-input>
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
        unit: '单位名称'
      },
      Initform: {
        id: '',
        unit: ''
      },
      form: {},
      oldForm: {},
      type: 'add',
      total: 1,
      searchMsg: {
        unit: '',
        i: 1
      },
      tableData: [],
      dialogVisible: false,
      dialogFormVisible: false,
      rules: {
        unit: [
          { required: true, message: '请输入单位名称', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    get() {
      this.$req('unit', this.searchMsg, {
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
          if (this.type === 'add') {
            this.$req('unit/add', this.form).then(data => {
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
            this.$req('unit/update', this.form).then(data => {
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
      this.$req('unit/delete', {
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
