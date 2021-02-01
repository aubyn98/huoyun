<template>
  <div class="page">
    <!-- <header>货运单统计</header> -->
    <div class="pagecontent">
      <div class="saveForm">
        <el-form
          ref="form"
          label-position="left"
          class="card"
          :label-width="$store.state.mobile ? '' : ''"
        >
          <!--eslint-disable-->
          <el-form-item label="开 始 日 期">
            <el-date-picker
              :style="{width:$store.state.mobile ? '150px' : '200px'}"
              type="date"
              placeholder="选择开始日期"
              value-format="yyyy-MM-dd"
              v-model="searchMsg.startDate"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="结 束 日 期">
            <el-date-picker
              :style="{width:$store.state.mobile ? '150px' : '200px'}"
              type="date"
              placeholder="选择结束日期"
              value-format="yyyy-MM-dd"
              v-model="searchMsg.endDate"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="运　单　号">
            <el-input
              :style="{width:$store.state.mobile ? '150px' : '200px'}"
              v-model="searchMsg.dh"
              placeholder="请输入运单号"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="始　发　站">
            <!-- <el-autocomplete
              :highlight-first-item="true"
              ref="customerName"
              placeholder="请输入始发站"
              :style="{width:$store.state.mobile ? '150px' : '200px'}"
              v-model="searchMsg.startStation"
              :fetch-suggestions="(str,cb)=>{$querySearchAsync(str,cb,'startStation','startStation')}"
            ></el-autocomplete>-->
            <el-select
              :style="{width:$store.state.mobile ? '150px' : '200px'}"
              v-model="searchMsg.startStation"
              multiple
              filterable
              reserve-keyword
              placeholder="请选择始发站"
              @focus="$remoteMethod('','startStation','startStation',(arr)=>{startStationArr = arr})"
            >
              <el-option
                v-for="item in startStationArr"
                :key="item.startStation"
                :label="item.startStation"
                :value="item.startStation"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="运　费　到">
            <!-- <el-autocomplete
              :highlight-first-item="true"
              ref="storeName"
              placeholder="请输入地点"
              :style="{width:$store.state.mobile ? '150px' : '200px'}"
              v-model="searchMsg.endStation"
              :fetch-suggestions="(str,cb)=>{$querySearchAsync(str,cb,'endStation','endStation')}"
            ></el-autocomplete>-->
            <el-select
              :style="{width:$store.state.mobile ? '150px' : '200px'}"
              v-model="searchMsg.endStation"
              multiple
              filterable
              reserve-keyword
              placeholder="请选择"
              @focus="$remoteMethod('','endStation','endStation',(arr)=>{endStationArr = arr})"
            >
              <el-option
                v-for="item in endStationArr"
                :key="item.endStation"
                :label="item.endStation"
                :value="item.endStation"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="托　运　人">
            <el-autocomplete
              :highlight-first-item="true"
              ref="storeName"
              placeholder="请输入托运人"
              :style="{width:$store.state.mobile ? '150px' : '200px'}"
              v-model="searchMsg.customerName"
              :fetch-suggestions="(str,cb)=>{$querySearchAsync2(str,cb,'customer','customerName','simpleCode')}"
            ></el-autocomplete>
          </el-form-item>
          <el-form-item label="收　货　人">
            <el-autocomplete
              :highlight-first-item="true"
              ref="storeName"
              placeholder="请输入收货人"
              :style="{width:$store.state.mobile ? '150px' : '200px'}"
              v-model="searchMsg.consignee"
              :fetch-suggestions="(str,cb)=>{$querySearchAsync2(str,cb,'consignee','consignee','simpleCode')}"
            ></el-autocomplete>
          </el-form-item>
          <el-form-item label="付 款 方 式">
            <el-select
              v-model="searchMsg.payment"
              placeholder="请选择"
              :style="{width:$store.state.mobile ? '150px' : '200px'}"
            >
              <el-option
                v-for="item in [{label:'全部',value:''},{label:'已付',value:'已付'},{label:'提付',value:'提付'},{label:'厂付',value:'厂付'}]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="结 单 状 态">
            <el-select
              v-model="searchMsg.state"
              placeholder="请选择"
              :style="{width:$store.state.mobile ? '150px' : '200px'}"
            >
              <el-option
                v-for="item in [{label:'全部',value:''},{label:'未结单',value:0},{label:'已结单',value:1}]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="货　　　物">
            <el-autocomplete
              :highlight-first-item="true"
              ref="storeName"
              placeholder="请输入货物"
              :style="{width:$store.state.mobile ? '150px' : '200px'}"
              v-model="searchMsg.goods"
              :fetch-suggestions="(str,cb)=>{$querySearchAsync(str,cb,'goods','goods')}"
            ></el-autocomplete>
          </el-form-item>
          <el-form-item>
            <div style="width:100%;display:flex">
              <el-button type="primary" @click="refresh(true)">查询</el-button>
              <!-- <el-button type="warning" @click="changeType">{{dataType}}</el-button> -->
              <el-button type="success" @click="goinventory" v-if="dataType==='列表'">生成清单</el-button>
              <exportExcel
                style="margin-left:10px"
                :format="format"
                :msg="selectData"
                v-if="dataType==='列表'"
              ></exportExcel>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        :data="tableData"
        border
        height="250"
        class="card"
        key="统计"
        v-if="dataType === '列表'"
        @selection-change="handleSelectionChange"
        :row-class-name="$tableRowClassName"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="kddh" label="开单单号"></el-table-column>
        <el-table-column prop="dh" label="运单号"></el-table-column>
        <el-table-column prop="date" label="日期" width="100"></el-table-column>
        <el-table-column prop="startStation" label="发货地址"></el-table-column>
        <el-table-column prop="endStation" label="运费到"></el-table-column>
        <el-table-column prop="customerName" label="托运人"></el-table-column>
        <!-- <el-table-column prop="customerAddress" label="托运地址"></el-table-column> -->
        <el-table-column prop="consignee" label="收货人"></el-table-column>
        <el-table-column prop="consigneeAddress" label="收货地址"></el-table-column>
        <el-table-column prop="payment" label="付款方式"></el-table-column>
        <el-table-column prop="goods" label="货物"></el-table-column>
        <el-table-column prop="num" label="件数"></el-table-column>
        <el-table-column prop="quantity" label="数量"></el-table-column>
        <el-table-column prop="collection" label="代收货款"></el-table-column>
        <el-table-column prop="unit" label="单位"></el-table-column>
        <!-- <el-table-column prop="price" label="单价"></el-table-column> -->
        <!-- <el-table-column prop="money" label="金额"></el-table-column> -->
        <el-table-column prop="insured" label="保价金额"></el-table-column>
        <!-- <el-table-column prop="insuredSum" label="保价总值"></el-table-column> -->
        <!-- <el-table-column prop="insuredRatio" label="比例"></el-table-column> -->
        <el-table-column prop="otherPrice" label="其他金额"></el-table-column>
        <el-table-column prop="discount" label="折扣价"></el-table-column>
        <el-table-column prop="transferFee" label="中转费"></el-table-column>
        <el-table-column prop="deliveryFee" label="送货费"></el-table-column>
        <el-table-column prop="sum" label="总合计"></el-table-column>
        <el-table-column prop="carNumber" label="车号"></el-table-column>
        <el-table-column prop="driver" label="司机"></el-table-column>
        <el-table-column prop="register" label="挂号"></el-table-column>
        <el-table-column prop="state" label="挂号">
          <template slot-scope="scope">
            <div>
              <span>{{scope.row.state == 0 ? '未结单' : '已结单'}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column label="操作" fixed="right" width="100">
          <template slot-scope="scope">
            <el-button type="primary" @click="go(scope.row.kddh)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-table
        :data="tableData2"
        border
        height="250"
        class="card"
        key="列表"
        v-if="dataType === '统计'"
        :row-class-name="$tableRowClassName"
      >
        <el-table-column prop="date" label="日期" width="180"></el-table-column>
        <el-table-column prop="kddh" label="开单单号" width="180"></el-table-column>
        <el-table-column prop="startStation" label="发货点" width="180"></el-table-column>
        <el-table-column prop="endStation" label="卸货点" width="180"></el-table-column>
        <el-table-column prop="carNumber" label="车号"></el-table-column>
        <el-table-column prop="creator" label="制单人" width="180"></el-table-column>
        <el-table-column label="操作" width="280" fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" @click="go2(scope.$index)">查看</el-button>
            <el-dropdown
              split-button
              type="primary"
              @click="print('inventory','PrintReport',scope.row.kddh)"
              style="margin:0 10px"
            >
              打印
              <el-dropdown-menu slot="dropdown" v-if="!$store.state.mobile">
                <el-dropdown-item @click.native="print('inventory','ShowReport',scope.row.kddh)">预览</el-dropdown-item>
                <el-dropdown-item
                  @click.native="print('inventory','DesignReport',scope.row.kddh)"
                  v-if="$store.state.account && $store.state.account.administrator"
                >编辑模板</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-button
              type="danger"
              @click="remove(scope.$index)"
              v-if="permission(['all','inventoryEdit'])"
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
    <transition>
      <inventory
        position="absolute"
        v-if="show"
        :kddh="kddh"
        :propMsg="msg"
        :dataType="dataType"
        :propDataList="dataList"
        @change="changeTransport"
        @cancel="show = false"
      ></inventory>
    </transition>
  </div>
</template>

<script type="text/javascript">
import inventory from '@/views/bill/inventory.vue'
export default {
  created() {
    this.refresh(true)
  },
  data() {
    return {
      endStationArr: [],
      startStationArr: [],
      kddh: '',
      dataType: '统计',
      total: 0,
      searchMsg: {
        startDate: this.$moment(
          new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        ),
        endDate: this.$moment(new Date()),
        startStation: '',
        endStation: '',
        customerName: '',
        consignee: '',
        payment: '',
        state: '',
        goods: '',
        dh: '',
        i: 1
      },
      tableData: [],
      tableData2: [],
      msg: {},
      dataList: [],
      show: false,
      showI: 0,
      selectData: [],
      format: {
        kddh: '开单单号', // ----
        dh: '运单号',
        date: '日期',
        startStation: '发货地址',
        endStation: '运费到',
        customerName: '托运人',
        // customerAddress: '托运地址',
        consignee: '收货人',
        consigneeAddress: '收货地址',
        payment: '付款方式',
        goods: '货物',
        num: '件数',
        quantity: '数量',
        collection: '代收货款',
        unit: '单位',
        // price: '单价',
        // money: '金额',
        insured: '保价金额',
        // insuredSum: '保价总值',
        // insuredRatio: '比例',
        otherPrice: '其他金额',
        discount: '折扣价',
        transferFee: '中转费',
        deliveryFee: '送货费',
        carNumber: '车号', // ----
        driver: '司机', // ----
        register: '挂号', // ----
        sum: '总合计',
        state: '结单',
        remark: '备注'
      }
    }
  },
  methods: {
    print(type, method, kddh) {
      this.$postPrint({
        type,
        data: { kddh, type, method },
        method,
        that: this
      })
    },
    remove(i) {
      if (this.tableData2[i].dataList.some(item => item.state === 1)) {
        this.$message.error('该单已结单无法删除！')
        return
      }
      this.$confirm('确认删除？').then(_ => {
        const jlidArr = this.tableData2[i].dataList.map(item => {
          return item.jlid
        })
        this.$req('/inventory/delete', {
          kddh: this.tableData2[i].kddh,
          jlidArr
        }).then(res => {
          if (res.status === 1) {
            this.tableData2.splice(i, 1)
            this.$emit('refresh', { name: 'integrationStatistics' })
            this.$message({
              message: '删除成功！',
              type: 'success'
            })
          }
        })
      })
    },
    refresh(flag) {
      if (this.dataType === '列表') {
        this.get(flag)
      } else if (this.dataType === '统计') {
        this.get2(flag)
      }
    },
    changeType() {
      if (this.dataType === '列表') {
        this.dataType = '统计'
      } else if (this.dataType === '统计') {
        this.dataType = '列表'
      }
    },
    goinventory() {
      if (this.selectData.length === 0) {
        return this.$message.error('请先选择要整合的记录！')
      }
      if (
        this.selectData.some((item, i) => {
          // eslint-disable-next-line
          if (item.state == 1) {
            this.$message.error(
              `选中的第${i + 1}项运单号为${item.dh}的记录已经被整合！`
            )
            return true
          }
        })
      ) {
        return
      }
      this.$emit('editable', 'inventory', {
        name: 'inventory',
        msg: this.selectData
      })
    },
    changeTransport(e) {
      this.$set(this.tableData, this.showI, e)
    },
    handleSelectionChange(e) {
      this.selectData = e
    },
    go(kddh) {
      this.show = true
      this.kddh = kddh
    },
    go2(i) {
      this.showI = i
      this.show = true
      const obj = {}
      Object.keys(this.tableData2[i]).forEach(key => {
        if (key !== 'dataList') {
          obj[key] = this.tableData2[i][key]
        }
      })
      this.msg = obj
      this.dataList = this.tableData2[i].dataList
    },
    currentChange(e) {
      this.refresh()
    },
    get(flag) {
      if (flag) {
        this.searchMsg.i = 1
      }
      this.$req('/inventory/join', this.searchMsg).then(res => {
        if (res && res.status === 1) {
          this.tableData = res.res
          this.total = res.total
        } else {
          this.tableData = []
          this.$message({
            message: '服务器错误！',
            type: 'error'
          })
        }
      })
    },
    get2(flag) {
      if (flag) {
        this.searchMsg.i = 1
      }
      this.$req('/inventory', this.searchMsg).then(res => {
        if (res && res.status === 1) {
          this.tableData2 = res.res
          this.total = res.total
        } else {
          this.tableData = []
          this.$message({
            message: '服务器错误！',
            type: 'error'
          })
        }
      })
    }
  },
  watch: {
    dataType(val) {
      if (val === '列表') {
        this.get(true)
      } else {
        this.get2(true)
      }
    }
  },
  components: {
    inventory
  }
}
</script>

<style lang="scss" scoped>
</style>
