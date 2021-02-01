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
          <el-form-item label="用户名称">
            <el-input placeholder="请输入用户关键字" v-model="searchMsg.userName" clearable></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-search" style="margin-left:20px" @click="search">搜索</el-button>
        <el-button
          type="success"
          icon="el-icon-circle-plus-outline"
          style="margin-left:20px"
          v-if="permission(['all','userEdit'])"
          @click="add"
        >添加</el-button>
        <exportExcel
          style="margin-left:10px"
          :format="format"
          :msg="tableData"
          v-if="!$store.state.mobile && permission(['all','userEdit'])"
        ></exportExcel>
      </div>
      <!-- <header>用户档案</header> -->
    </div>
    <div class="elTable">
      <el-table :data="tableData" height="250">
        <el-table-column prop="userName" label="用户名称"></el-table-column>
        <el-table-column prop="password" label="密码" v-if="permission(['all','userEdit'])">
          <template slot-scope="scope">
            <span
              v-if="scope.row.administrator == $store.state.account.administrator || !scope.row.administrator"
            >{{scope.row.password}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="position" label="位置"></el-table-column>
        <el-table-column prop="auth" label="权限">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.authStr}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column label="操作" width="150" v-if="permission(['all','userEdit'])" fixed="right">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="change(scope.$index)"
              v-if="scope.row.administrator == $store.state.account.administrator || !scope.row.administrator"
            >修改</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="remove(scope.$index)"
              v-if="scope.row.userName != $store.state.account.userName && !scope.row.administrator"
            >删除</el-button>
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
      <span>确认删除该用户吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmDel">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="用户信息"
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
          <el-form-item label="用　户" prop="userName">
            <el-input v-model.trim="form.userName" placeholder="请输入用户名称"></el-input>
          </el-form-item>
          <el-form-item label="密　码" prop="password" v-if="permission(['all','userEdit'])">
            <el-input v-model.trim="form.password" placeholder="请输入用户名称"></el-input>
          </el-form-item>
          <el-form-item label="权　限" prop="auth">
            <el-checkbox-group v-model="form.authArr">
              <el-checkbox
                v-for="item in auths"
                :label="item.name"
                :key="item.auth"
                @change="handleCheckedAuthChange"
              >{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="位　置" prop="position">
            <el-input v-model.trim="form.position" placeholder="请输入用户所属位置"></el-input>
          </el-form-item>
          <el-form-item label="备　注">
            <el-input v-model.trim="form.remark" placeholder="请输入用户备注" type="textarea"></el-input>
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
  async created() {
    this.initFormData()
    await this.getAuth()
    this.get()
  },
  data() {
    return {
      auths: [],
      authKey: {},
      index: 0,
      format: {
        userName: '用户名',
        password: '密码',
        authStr: '权限',
        position: '位置',
        remark: '备注'
      },
      Initform: {
        id: '',
        userName: '',
        password: '',
        auth: '',
        position: '',
        remark: '',
        authArr: ['全部权限']
      },
      form: {},
      oldForm: {},
      type: 'add',
      total: 1,
      searchMsg: {
        userName: '',
        i: 1
      },
      tableData: [],
      dialogVisible: false,
      dialogFormVisible: false,
      rules: {
        userName: [
          { required: true, message: '请输入用户名称', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' }
        ],
        position: [
          { required: true, message: '请输入用户所属位置', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleCheckedAuthChange(value, e) {
      if (e.target.defaultValue === '全部权限') {
        while (this.form.authArr.pop()) {}
        this.form.authArr.push('全部权限')
      } else {
        if (this.form.authArr.includes('全部权限')) {
          this.form.authArr.splice(this.form.authArr.indexOf('全部权限'), 1)
        }
      }
    },
    get() {
      this.$req('user', this.searchMsg, {
        method: 'get'
      }).then(data => {
        if (data) {
          this.tableData = []
          this.tableData = data.res.map(item => {
            item.authArr = []
            const authArr = item.auth.split(',')
            if (authArr.includes('Administrator')) {
              authArr.splice(1, 1)
            }
            authArr.forEach(key => {
              item.authArr.push(this.authKey[key])
            })
            item.authStr = item.authArr.join(',')
            return item
          })
          this.total = data.total
        }
      })
    },
    async getAuth() {
      const authKeys = await this.$req(
        'auth',
        {},
        {
          method: 'get'
        }
      )
      const authKey = {}
      const sortArr = []
      const authKeysSorted = []
      authKeys.forEach(item => {
        authKey[item.auth] = item.name
        sortArr.push(item.name)
      })
      sortArr.sort()
      sortArr.forEach(item => {
        authKeysSorted.push(...authKeys.filter(it => item === it.name))
      })
      this.auths = authKeysSorted
      this.authKey = authKey
      return 1
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
          const arr = []
          Object.keys(this.authKey).forEach(key => {
            this.form.authArr.some(item => {
              if (item === this.authKey[key]) {
                arr.push(key)
                return true
              }
            })
          })
          this.form.auth = arr.join(',')
          if (this.type === 'add') {
            this.$req('user/add', this.form).then(data => {
              if (data.status === 1) {
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })
                this.tableData.unshift({ ...this.form, authStr: this.form.authArr.join(','), ...data.res })
                this.initFormData()
              } else if (data.status === 0) {
                this.$message.error('添加失败')
              }
            })
          } else {
            this.$req('user/update', this.form).then(data => {
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
      this.$req('user/delete', {
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
