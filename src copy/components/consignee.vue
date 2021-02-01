<template>
  <!-- eslint-disable -->
  <div class="Record">
    <div class="searchTop">
      <div class="topBox">
        <el-form
          ref="form"
          label-position="left"
          class="card2"
          style="flex-wrap:nowrap;width:850px"
          :label-width="$store.state.mobile ? '' : ''"
        >
          <el-form-item label="收货人名称">
            <el-input placeholder="请输入收货人关键字" v-model="searchMsg.consignee" clearable></el-input>
          </el-form-item>
          <el-form-item label="收货人简码">
            <el-input placeholder="请输入收货人简码关键字" v-model="searchMsg.simpleCode" clearable></el-input>
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
          v-if="permission(['all','consigneeEdit'])"
          @click="add"
        >添加</el-button>
        <exportExcel
          style="margin-left:10px"
          :format="format"
          :msg="tableData"
          v-if="!$store.state.mobile"
        ></exportExcel>
      </div>
      <!-- <header>收货人档案</header> -->
    </div>
    <div class="elTable">
      <el-table :data="tableData" height="250">
        <el-table-column prop="consignee" label="收货人名称" width="90"></el-table-column>
        <el-table-column prop="address" label="收货地址"></el-table-column>
        <el-table-column prop="freight" label="运费到"></el-table-column>
        <el-table-column prop="price" label="单价"></el-table-column>
        <el-table-column prop="insured" label="保价金"></el-table-column>
        <el-table-column prop="discount" label="折扣"></el-table-column>
        <el-table-column prop="telephone" label="手机" width="110"></el-table-column>
        <el-table-column prop="phone" label="电话"></el-table-column>
        <el-table-column prop="goodsType" label="货物类型"></el-table-column>
        <el-table-column prop="payment" label="付款方式"></el-table-column>
        <el-table-column prop="line" label="线路"></el-table-column>
        <el-table-column prop="simpleCode" label="简码"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column
          label="操作"
          width="150"
          v-if="permission(['all','consigneeEdit'])"
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
      <span>确认删除该收货人吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmDel">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="收货人信息"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      :show-close="true"
    >
      <div
        style="height:300px;width:100%;display:flex;flex-direction:column;align-items:center;overflow:auto"
      >
        <el-form
          label-position="right"
          :label-width="$store.state.mobile ? '80px' : '80px'"
          :model="form"
          :rules="rules"
          ref="ruleForm"
        >
          <el-form-item label="收 货 人" prop="consignee">
            <el-input v-model.trim="form.consignee" placeholder="请输入收货人名称"></el-input>
          </el-form-item>
          <el-form-item label="运 费 到" prop="freight">
            <el-input v-model.trim="form.freight" placeholder="请输入运费到"></el-input>
          </el-form-item>
          <el-form-item label="收货地址" prop="address">
            <el-input v-model.trim="form.address" placeholder="请输入收货人地址"></el-input>
          </el-form-item>
          <el-form-item label="单　　价" prop="price">
            <el-input v-model.trim="form.price" placeholder="请输入单价"></el-input>
          </el-form-item>
          <el-form-item label="保 价 金" prop="insured">
            <el-input v-model.trim="form.insured" placeholder="请输入保价金"></el-input>
          </el-form-item>
          <el-form-item label="折　　扣" prop="discount">
            <el-input v-model.trim="form.discount" placeholder="请输入保价金"></el-input>
          </el-form-item>
          <el-form-item label="手　　机" prop="telephone">
            <el-input v-model.number="form.telephone" placeholder="请输入收货人手机"></el-input>
          </el-form-item>
          <el-form-item label="电　　话" prop="phone">
            <el-input v-model.number="form.phone" placeholder="请输入收货人电话"></el-input>
          </el-form-item>
          <el-form-item label="货物类型" prop="goodsType">
            <el-input v-model.trim="form.goodsType" placeholder="请输入货物类型"></el-input>
          </el-form-item>
          <el-form-item label="付款方式">
            <el-select v-model="form.payment" style="width:100%" placeholder="请选择付款方式">
              <el-option v-for="item in paymentList" :label="item" :key="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="线　　路">
            <el-input v-model.trim="form.line" placeholder="请输入线路"></el-input>
          </el-form-item>
          <el-form-item label="简　　码" prop="simpleCode">
            <el-input v-model.trim="form.simpleCode" placeholder="请输入简码"></el-input>
          </el-form-item>
          <el-form-item label="备　　注">
            <el-input v-model.trim="form.remark" placeholder="请输入收货人备注" type="textarea"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-dropdown
          style="margin-left:10px"
          @command="(command)=>updatePrice(command,'price')"
          trigger="click"
        >
          <el-button type="primary">
            更新单价
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="一致">同地区一致</el-dropdown-item>
            <el-dropdown-item command="增加">同地区增加</el-dropdown-item>
            <el-dropdown-item command="减少">同地区减少</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown
          style="margin:10px"
          @command="(command)=>updatePrice(command,'insured')"
          trigger="click"
        >
          <el-button type="primary">
            更新保价
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="一致">同地区一致</el-dropdown-item>
            <el-dropdown-item command="增加">同地区增加</el-dropdown-item>
            <el-dropdown-item command="减少">同地区减少</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
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
        consignee: '收货人',
        freight: '运费到',
        address: '收货地址',
        price: '单价',
        insured: '保价金',
        discount: '折扣',
        telephone: '手机',
        phone: '电话',
        goodsType: '货物类型',
        payment: '付款方式',
        line: '线路',
        simpleCode: '简码',
        remark: '备注'
      },
      Initform: {
        id: '',
        consignee: '',
        freight: '',
        address: '',
        price: '',
        insured: '',
        discount: '',
        telephone: '',
        phone: '',
        goodsType: '',
        line: '',
        payment: '',
        simpleCode: '',
        remark: ''
      },
      form: {},
      oldForm: {},
      type: 'add',
      total: 1,
      searchMsg: {
        consignee: '',
        telephone: '',
        simpleCode: '',
        i: 1
      },
      paymentList: ['已付', '提付', '厂付', '月结'],
      tableData: [],
      dialogVisible: false,
      dialogFormVisible: false,
      rules: {
        consignee: [
          { required: true, message: '请输入收货人名称', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入收货人地址', trigger: 'blur' }
        ],
        freight: [
          { required: true, message: '请输入运费到', trigger: 'blur' }
        ],
        payment: [
          { required: true, message: '请选择付款方式', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入收货人电话', trigger: 'blur' },
          { type: 'number', message: '电话必须为数字值', trigger: 'blur' }
        ],
        telephone: [
          { required: true, message: '请输入收货人手机', trigger: 'blur' },
          { type: 'number', message: '手机必须为数字值', trigger: 'blur' }
        ],
        simpleCode: [{ required: true, message: '请输入简码', trigger: 'blur' }]
      }
    }
  },
  watch: {
    'form.consignee'(value) {
      this.form.simpleCode = this.py.getCamelChars(value)
    }
  },
  methods: {
    async updatePrice(command, field) {
      try {
        let positionType
        let text
        let fieldValue = parseFloat(this.form[field])
        let positionValue
        let promptValue = 0
        let type
        if (field === 'price') {
          text = '单价'
        } else {
          text = '保价'
        }
        if (command === '一致') {
          type = 'same'
          positionType = 'address'
          positionValue = this.form.address
          const confirm = await this.$confirm(
            `你确定要更新 ${positionValue} 同地区货运${text}为一致吗?`,
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }
          )
          if (confirm !== 'confirm') {
            return
          }
        } else {
          text += command
          positionType = 'freight'
          positionValue = this.form.freight
          let { value } = await this.$prompt(
            `请输入${positionValue}地区需要在原有${text}的值`,
            text,
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              inputPattern: /^(\d*)(\.)?(\d*)?$/,
              inputErrorMessage: '请填入数字'
            }
          )
          value = parseFloat(value)
          if (isNaN(value)) {
            return this.$message.error('请填入数字！')
          }
          promptValue = value
          switch (command) {
            case '增加':
              type = 'add'
              fieldValue += value
              break
            case '减少':
              type = 'reduce'
              fieldValue -= value
              break
          }
        }
        this.$req('consignee/updatePrice', {
          fieldValue,
          positionValue,
          field,
          positionType,
          promptValue,
          type
        }).then(data => {
          if (data.status !== 0) {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
          } else if (data.status === 0) {
            this.$message.error('修改失败')
          }
        })
      } catch (e) {
        console.log(e)
      }
    },
    get() {
      this.$req('consignee', this.searchMsg, {
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
            this.$req('consignee/add', this.form).then(data => {
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
            this.$req('consignee/update', this.form).then(data => {
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
      this.$req('consignee/delete', {
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
