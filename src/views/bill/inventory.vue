<template>
  <div class="page" :style="{ position: position }">
    <div class="pagecontent">
      <header>货运清单</header>
      <div class="saveForm" style="width: 100%">
        <el-form
          ref="form"
          label-position="left"
          class="card"
          :label-width="$store.state.mobile ? '' : ''"
        >
          <!--eslint-disable-->
          <el-form-item label="发　货　点">
            <!-- <el-input placeholder="请输入发货点" clearable :style="{width:$store.state.mobile ? '150px' : '200px'}"></el-input> -->
            <el-autocomplete
              :disabled="disabled"
              :highlight-first-item="true"
              ref="customerName"
              placeholder="请输入始发站"
              :style="{ width: $store.state.mobile ? '150px' : '200px' }"
              v-model="msg.startStation"
              :fetch-suggestions="
                (str, cb) => {
                  $querySearchAsync(str, cb, 'startStation', 'startStation');
                }
              "
            ></el-autocomplete>
          </el-form-item>
          <el-form-item label="卸　货　点">
            <!-- <el-input placeholder="请输入卸货点" clearable readonly :style="{width:$store.state.mobile ? '150px' : '200px'}"></el-input> -->
            <el-autocomplete
              :disabled="disabled"
              :highlight-first-item="true"
              ref="storeName"
              placeholder="请输入地点"
              :style="{ width: $store.state.mobile ? '150px' : '200px' }"
              v-model="msg.endStation"
              :fetch-suggestions="
                (str, cb) => {
                  $querySearchAsync(str, cb, 'endStation', 'endStation');
                }
              "
            ></el-autocomplete>
          </el-form-item>
          <el-form-item label="车　　　号">
            <!-- <el-input placeholder="请输入单号" clearable :style="{width:$store.state.mobile ? '150px' : '200px'}"></el-input> -->
            <el-autocomplete
              :disabled="disabled"
              :highlight-first-item="true"
              ref="storeName"
              placeholder="请输入地点"
              :style="{ width: $store.state.mobile ? '150px' : '200px' }"
              v-model="msg.carNumber"
              :fetch-suggestions="
                (str, cb) => {
                  $querySearchAsync(str, cb, 'car', 'carNumber');
                }
              "
              @select="carSelect"
            ></el-autocomplete>
          </el-form-item>
          <el-form-item label="挂　　　号">
            <el-input
              :disabled="disabled"
              clearable
              :style="{ width: $store.state.mobile ? '150px' : '200px' }"
              v-model="msg.register"
            ></el-input>
          </el-form-item>
          <el-form-item label="备　　　注">
            <el-input
              :disabled="disabled"
              type="textarea"
              :style="{ width: $store.state.mobile ? '150px' : '200px' }"
              v-model="msg.remark"
            ></el-input>
          </el-form-item>
          <el-form-item label="开 单 单 号">
            <el-input
              readonly
              clearable
              :style="{ width: $store.state.mobile ? '150px' : '200px' }"
              v-model="msg.kddh"
            ></el-input>
          </el-form-item>
          <el-form-item label="日　　　期">
            <el-date-picker
              :style="{ width: $store.state.mobile ? '150px' : '200px' }"
              type="date"
              :disabled="disabled"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              v-model="msg.date"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="制　单　人">
            <el-input
              readonly
              clearable
              :style="{ width: $store.state.mobile ? '150px' : '200px' }"
              v-model="msg.creator"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        :data="dataList"
        border
        height="250"
        class="card"
        :row-class-name="$tableRowClassName"
      >
        <el-table-column
          prop="customerName"
          label="托运人"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="consignee"
          label="收货人"
          width="180"
        ></el-table-column>
        <el-table-column prop="dh" label="运单号" width="180"></el-table-column>
        <el-table-column
          prop="endStation"
          label="运费到"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="consigneeAddress"
          label="收货地址"
          width="180"
        ></el-table-column>
        <el-table-column prop="num" label="件数" width="180"></el-table-column>
        <el-table-column
          prop="quantity"
          label="数量"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="collection"
          label="代收货款"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="insured"
          label="保价金额"
          width="180"
        ></el-table-column>
        <el-table-column prop="otherPrice" label="其他金额" width="180">
          <template slot-scope="scope">
            <el-input
              :style="{ width: $store.state.mobile ? '150px' : '200px' }"
              type="number"
              :min="0"
              v-model="scope.row.otherPrice"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="payee" label="收款人" width="180">
          <template slot-scope="scope">
            <el-input
              :style="{ width: $store.state.mobile ? '150px' : '200px' }"
              v-model="scope.row.payee"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="receipts" label="实收金额" width="180">
          <template slot-scope="scope">
            <el-input
              :style="{ width: $store.state.mobile ? '150px' : '200px' }"
              type="number"
              :min="0"
              v-model="scope.row.receipts"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="payeeDate" label="收款日期" width="180">
          <template slot-scope="scope">
            <el-date-picker
              :style="{ width: $store.state.mobile ? '150px' : '200px' }"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              v-model="scope.row.payeeDate"
            ></el-date-picker>
          </template>
        </el-table-column>
        <el-table-column
          prop="sum"
          label="总合计"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="transferFee"
          label="中转费"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="deliveryFee"
          label="送货费"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="discount"
          label="折扣价"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="payment"
          label="付款方式"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          width="180"
        ></el-table-column>
        <!-- <el-table-column label="操作" width="100" fixed="right">
        <template slot-scope="scope">
          <el-button type="danger" @click="delLine(scope.$index)">删除</el-button>
        </template>
        </el-table-column>-->
      </el-table>
    </div>
    <div class="bottomBtn-right">
      <!-- <el-button type="danger" @click="clearTable">清除列表</el-button> -->
      <!-- <el-button type="warning" @click="addLine(addLineNum)">增加</el-button> -->
      <!-- <div style="margin:0 10px">
        <el-input-number v-model="addLineNum" label="请输入增加行数" type="number" :min="1"></el-input-number>
        <span style="margin:0 10px">行</span>
      </div>-->
      <!-- <el-button type="primary" @click="openNew">新建</el-button> -->
      <el-button
        :type="disabled ? 'primary' : 'success'"
        @click="disabled ? (disabled = false) : save()"
        v-if="!state && permission(['all', 'inventoryEdit'])"
        >{{disabled ? '修改' : '保存'}}</el-button
      >
      <el-button type="danger" @click="del" v-if="!$listeners.refresh">删除该单</el-button>
      <el-button
        type="danger"
        @click="delPrice"
        v-if="!state && permission(['all', 'inventoryEdit'])"
        >一键删除其他金额</el-button
      >
      <!-- <el-button type="primary">结单</el-button> -->
      <el-dropdown
        split-button
        type="primary"
        @click="print('inventory', 'PrintReport')"
        style="margin-left: 10px"
      >
        打印
        <el-dropdown-menu slot="dropdown" v-if="!$store.state.mobile">
          <el-dropdown-item @click.native="print('inventory', 'ShowReport')"
            >预览</el-dropdown-item
          >
          <el-dropdown-item
            @click.native="print('inventory', 'DesignReport')"
            v-if="$store.state.account && $store.state.account.administrator"
            >编辑模板</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
      <a style="display: none" ref="a" :href="'ChuLinPrint:' + url"></a>
      <!-- <exportExcel style="margin-left:10px"></exportExcel> -->
      <el-button
        style="margin-left: 10px"
        @click="$emit('cancel')"
        v-if="propMsg"
        >取消</el-button
      >
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  props: {
    position: {
      default: 'relative'
    },
    propMsg: {
      default: null
    },
    propDataList: {
      default: null
    },
    kddh: {
      default: null
    },
    dataType: {
      default: null
    }
  },
  created() {
    if (!this.id) {
      this.msg.creator =
        this.$store.state.account && this.$store.state.account.userName
    }
    if (this.dataType === '列表') {
      this.$req(
        '/inventory/findByDh',
        { kddh: this.kddh },
        { method: 'get' }
      ).then((res) => {
        const { res: data, status } = res
        if (data && status === 1) {
          const o = {}
          Object.keys(data).forEach((key) => {
            if (key !== 'dataList' && key !== 'id') {
              o[key] = data[key]
            }
          })
          this.msg = o
          this.dataList = data.dataList
        }
      })
    } else if (this.dataType === '统计') {
      if (this.propMsg && this.propDataList) {
        this.msg = this.copy(this.propMsg)
        this.dataList = this.copy(this.propDataList)
        this.id = this.msg.id
      }
    } else {
      this.disabled = false
      this.msg = this.copy(this.initMsg)
      this.addLine(1)
    }
  },
  data() {
    return {
      url: '',
      id: '',
      disabled: true,
      initMsg: {
        kddh: '',
        date: this.$moment(new Date()),
        creator: this.$store.state.account.userName,
        startStation:
          this.$store.state.account && this.$store.state.account.position,
        endStation: '',
        carNumber: '',
        driver: '',
        register: '',
        state: 0,
        remark: ''
      },
      initItem: {
        jlid: '',
        id2: '',
        dh: '',
        kddh2: '',
        kddhdate: '',
        startStation: '',
        endStation: '',
        customerName: '',
        customerAddress: '',
        consignee: '',
        consigneeAddress: '',
        payment: '',
        goods: '',
        num: 0,
        quantity: 0,
        collection: 0,
        unit: '',
        price: 0,
        money: 0,
        insured: 0,
        insuredSum: 0,
        insuredRatio: 0,
        otherPrice: 0,
        payee: '',
        receipts: '',
        payeeDate: '',
        discount: 0,
        transferFee: 0,
        deliveryFee: 0,
        sum: 0,
        state: 0,
        remark: ''
      },
      msg: {},
      dataList: [],
      addLineNum: 1
    }
  },
  methods: {
    del() {
      if (this.dataList.some((item) => item.state === 1)) {
        this.$message.error('该单已结单无法删除！')
        return
      }
      this.$confirm('确认删除？').then((_) => {
        const jlidArr = this.dataList.map((item) => {
          return item.jlid
        })
        this.$req('/inventory/delete', {
          kddh: this.msg.kddh,
          jlidArr
        }).then((res) => {
          if (res.status === 1) {
            this.$emit('del')
            this.$emit('cancel')
            this.$message({
              message: '删除成功！',
              type: 'success'
            })
            this.$message({
              message: '删除成功！',
              type: 'success'
            })
          }
        })
      })
    },
    delPrice() {
      this.dataList.forEach((item) => {
        item.otherPrice = 0
      })
    },
    print(type, method) {
      if (!this.msg.kddh) {
        this.$message.error('请先保存再打印！')
        return
      }
      this.$postPrint({
        type,
        data: { kddh: this.msg.kddh, type, method },
        method,
        that: this
      })
    },
    save() {
      /* console.log(this.dataList)
      const flag = true
      if (flag) {
        return
      } */
      if (
        Object.keys(this.msg).some((key) => {
          const flag = !this.msg[key]
          switch (true) {
            case key === 'date' && flag:
              this.$message.error('日期不能为空！')
              return true
            case key === 'startStation' && flag:
              this.$message.error('发货点不能为空！')
              return true
            case key === 'endStation' && flag:
              this.$message.error('卸货点不能为空！')
              return true
            case key === 'carNumber' && flag:
              this.$message.error('车号不能为空！')
              return true
            case key === 'register' && flag:
              this.$message.error('挂号不能为空！')
              return true
          }
        })
      ) {
        return
      }
      if (!this.id) {
        this.$req('/inventory/add', {
          ...this.msg,
          dataList: this.dataList
        }).then((data) => {
          const { res, status, msg } = data
          if (status === 1) {
            this.id = res.id
            this.msg.kddh = res.kddh
            this.$emit('refresh', { name: 'integrationStatistics' })
            this.$message({
              message: msg,
              type: 'success'
            })
            this.disabled = true
          } else {
            this.$message({
              message: msg,
              type: 'error'
            })
          }
        })
      } else {
        this.msg.creator =
          this.$store.state.account && this.$store.state.account.userName
        this.$req('/inventory/update', {
          ...this.msg,
          dataList: this.dataList
        }).then((data) => {
          const { status, msg } = data
          if (status === 1) {
            this.$message({
              message: msg,
              type: 'success'
            })
            this.disabled = true
          } else {
            this.$message({
              message: msg + '单据已被删除！',
              type: 'error'
            })
          }
        })
      }
    },
    carSelect(e) {
      this.msg.driver = e.driver
      this.msg.register = e.register
    },
    async addMsg(msg) {
      this.id = ''
      this.dataList = []
      this.disabled = false
      this.msg = this.copy(this.initMsg)
      msg = msg.map((item) => item.kddh)
      msg = Array.from(new Set(msg))
      const { res, status } = await this.$req('/integration/join', {})
      if (res && status) {
        msg = res.filter((item) => {
          return msg.includes(item.kddh)
        })
        this.msg.carNumber = msg[0].carNumber
        msg.forEach((item) => {
          const o = {}
          Object.keys(this.initItem).forEach((key) => {
            if (key === 'kddh2') {
              o.kddh2 = item.kddh
            } else if (key === 'kddhdate') {
              o.kddhdate = item.date
            } else if (
              key === 'payee' ||
              key === 'receipts' ||
              key === 'payeeDate'
            ) {
              o[key] = ''
            } else {
              o[key] = item[key]
            }
          })
          this.dataList.push(o)
        })
      }
    },
    addLine(len) {
      for (let i = 0; i < len; i++) {
        this.dataList.push(this.copy(this.initItem))
      }
    },
    delLine(i) {
      this.dataList.splice(i, 1)
    },
    clearTable() {
      this.dataList = [this.copy(this.initItem)]
    },
    openNew() {
      this.dataList = [this.copy(this.initItem)]
      this.msg = this.copy(this.initMsg)
      this.id = ''
    }
  },
  computed: {
    state() {
      return this.dataList.some((item) => {
        return item.state === 1
      })
    }
  },
  components: {}
}
</script>

<style lang="scss">
</style>
