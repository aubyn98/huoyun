<template>
  <div class="page">
    <!-- <header>货运单统计</header> -->
    <div class="pagecontent" style="flex-direction: row;">
      <div class="pagecontent-left-box">
        <el-table
          ref="multipleTable"
          :data="tableData"
          border
          show-summary
          :summary-method="() => autoSums"
          height="250"
          class="saveTable-exe-card"
          key="统计"
          v-if="dataType === '列表'"
          @selection-change="handleSelectionChange"
          :row-class-name="$tableRowClassName"
          :cell-class-name="$tableCellClassName"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column
            :prop="item.type"
            :label="item.name"
            v-for="item in tablecolumns"
            :key="item.type"
            :width="item.type === 'date' && 100"
          >
            <template slot-scope="scope">
              <div v-if="item.type === 'state'">
                <span>{{scope.row.state == 0 ? '未结单' : '已结单'}}</span>
              </div>
              <div v-else>
                <span>{{scope.row[item.type]}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="150">
            <template slot-scope="scope">
              <div style="display:flex;flex-direction: column;">
                <el-button type="primary" @click="go(scope.row.kddh)" size="mini">查看</el-button>
                <el-dropdown
                  size="mini"
                  split-button
                  type="primary"
                  @click="print('integration','PrintReport',scope.row.kddh)"
                  style="margin-top:5px;width:100%"
                >
                  打印
                  <el-dropdown-menu slot="dropdown" v-if="!$store.state.mobile">
                    <el-dropdown-item
                      @click.native="print('integration','ShowReport',scope.row.kddh)"
                    >预览</el-dropdown-item>
                    <el-dropdown-item
                      @click.native="print('integration','DesignReport',scope.row.kddh)"
                      v-if="$store.state.account && $store.state.account.administrator"
                    >编辑模板</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-table
          :data="tableData2"
          border
          height="250"
          class="saveTable-exe-card"
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
          <el-table-column label="操作" width="150" fixed="right">
            <template slot-scope="scope">
              <div style="display:flex;flex-direction: column;">
                <el-button type="primary" @click="go2(scope.$index)" size="mini">查看</el-button>
                <el-dropdown
                  size="mini"
                  split-button
                  type="primary"
                  @click="print('integration','PrintReport',scope.row.kddh)"
                  style="margin-top:5px;width:100%"
                >
                  打印
                  <el-dropdown-menu slot="dropdown" v-if="!$store.state.mobile">
                    <el-dropdown-item
                      @click.native="print('integration','ShowReport',scope.row.kddh)"
                    >预览</el-dropdown-item>
                    <el-dropdown-item
                      @click.native="print('integration','DesignReport',scope.row.kddh)"
                      v-if="$store.state.account && $store.state.account.administrator"
                    >编辑模板</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <el-button
                  size="mini"
                  type="danger"
                  @click="remove(scope.$index)"
                  v-if="permission(['all','integrationEdit'])"
                  style="margin-top:5px;width:100%"
                >删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="saveForm-exe">
        <el-form
          ref="form"
          label-position="left"
          class="saveForm-exe-card"
          :label-width="$store.state.mobile ? '' : ''"
        >
          <!--eslint-disable-->
          <el-form-item label="开 始 日 期">
            <el-date-picker
              :style="{width:'100%'}"
              type="date"
              placeholder="选择开始日期"
              value-format="yyyy-MM-dd"
              v-model="searchMsg.startDate"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="结 束 日 期">
            <el-date-picker
              :style="{width:'100%'}"
              type="date"
              placeholder="选择结束日期"
              value-format="yyyy-MM-dd"
              v-model="searchMsg.endDate"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="运　单　号">
            <el-input :style="{width:'100%'}" v-model="searchMsg.dh" placeholder="请输入运单号" clearable></el-input>
          </el-form-item>
          <el-form-item label="始　发　站">
            <!-- <el-autocomplete
              :highlight-first-item="true"
              ref="customerName"
              placeholder="请输入始发站"
              :style="{width:'100%'}"
              v-model="searchMsg.startStation"
              :fetch-suggestions="(str,cb)=>{$querySearchAsync(str,cb,'startStation','startStation')}"
            ></el-autocomplete>-->
            <el-select
              clearable
              :style="{width:'100%'}"
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
              :style="{width:'100%'}"
              v-model="searchMsg.endStation"
              :fetch-suggestions="(str,cb)=>{$querySearchAsync(str,cb,'endStation','endStation')}"
            ></el-autocomplete>-->
            <el-select
              :style="{width:'100%'}"
              v-model="searchMsg.endStation"
              clearable
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
              :style="{width:'100%'}"
              v-model="searchMsg.customerName"
              :fetch-suggestions="(str,cb)=>{$querySearchAsync2(str,cb,'customer','customerName','simpleCode')}"
            ></el-autocomplete>
          </el-form-item>
          <el-form-item label="收　货　人">
            <el-autocomplete
              :highlight-first-item="true"
              ref="storeName"
              placeholder="请输入收货人"
              :style="{width:'100%'}"
              v-model="searchMsg.consignee"
              :fetch-suggestions="(str,cb)=>{$querySearchAsync2(str,cb,'consignee','consignee','simpleCode')}"
            ></el-autocomplete>
          </el-form-item>
          <el-form-item label="付 款 方 式">
            <el-select v-model="searchMsg.payment" placeholder="请选择" :style="{width:'100%'}">
              <el-option
                v-for="item in [{label:'全部',value:''},{label:'已付',value:'已付'},{label:'提付',value:'提付'},{label:'厂付',value:'厂付'}]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="结 单 状 态">
            <el-select v-model="searchMsg.state" placeholder="请选择" :style="{width:'100%'}">
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
              :style="{width:'100%'}"
              v-model="searchMsg.goods"
              :fetch-suggestions="(str,cb)=>{$querySearchAsync(str,cb,'goods','goods')}"
            ></el-autocomplete>
          </el-form-item>
          <el-form-item>
            <el-form-item style="width:100%;margin-top:5px">
              <el-button type="primary" @click="refresh(true)">查询</el-button>
            </el-form-item>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="pagecontent-bottm">
      <el-pagination
        background
        layout="prev, pager, next"
        style="margin-top:10px"
        :total="total"
        :current-page.sync="searchMsg.i"
        :page-size="20"
        @current-change="currentChange"
      ></el-pagination>
      <div class="pagecontent-bottm-right">
        <el-button type="warning" @click="changeType">{{dataType}}</el-button>
        <el-button
          type="success"
          @click="goInventory"
          v-if="dataType==='列表' && permission(['all','inventoryEdit'])"
        >生成清单</el-button>
        <exportExcel
          style="margin-left:10px"
          :format="format"
          :msg="selectData"
          v-if="dataType==='列表' && !$store.state.mobile"
        ></exportExcel>
        <el-button
          type="info"
          @click="dialogVisible = true"
          style="margin-left:10px"
          v-if="dataType==='列表'"
        >表格显示列</el-button>
        <el-dialog title="表格显示列" :visible.sync="dialogVisible" width="30%" append-to-body>
          <el-checkbox-group v-model="checkList">
            <el-checkbox
              :label="item.name"
              v-for="item in formatTable"
              :key="item.type"
              v-model="item.flag"
            ></el-checkbox>
          </el-checkbox-group>
        </el-dialog>
      </div>
    </div>

    <transition>
      <integration
        position="absolute"
        v-if="show"
        :kddh="kddh"
        :propMsg="msg"
        :dataType="dataType"
        :propDataList="dataList"
        @change="changeTransport"
        @cancel="show = false"
        @del="remove"
      ></integration>
    </transition>
  </div>
</template>

<script type="text/javascript">
import integration from '@/views/bill/integration.vue'
export default {
  created() {
    this.refresh(true)
    const checkList = JSON.parse(localStorage.getItem('inteTableC'))
    if (checkList && checkList.length > 0) {
      this.checkList = checkList
    } else {
      this.checkList = this.formatTable.map((item) => item.name)
    }
  },
  data() {
    return {
      sum: [],
      tablecolumns: [],
      checkList: [],
      dialogVisible: false,
      endStationArr: [],
      startStationArr: [],
      dh: '',
      dataType: '列表',
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
      },
      formatTable: [
        { type: 'kddh', name: '开单单号', i: 0 }, // ----
        { type: 'dh', name: '运单号', i: 1 },
        { type: 'date', name: '日期', i: 2 },
        { type: 'startStation', name: '发货地址', i: 3 },
        { type: 'endStation', name: '运费到', i: 4 },
        { type: 'customerName', name: '托运人', i: 5 },
        // customerAddress',name: '托运地址',i:0},
        { type: 'consignee', name: '收货人', i: 6 },
        { type: 'consigneeAddress', name: '收货地址', i: 7 },
        { type: 'payment', name: '付款方式', i: 8 },
        { type: 'goods', name: '货物', i: 9 },
        { type: 'num', name: '件数', i: 10 },
        { type: 'quantity', name: '数量', i: 11 },
        { type: 'collection', name: '代收货款', i: 12 },
        { type: 'unit', name: '单位', i: 13 },
        // price',name: '单价',i:0},
        // money',name: '金额',i:0},
        { type: 'insured', name: '保价金额', i: 14 },
        // insuredSum',name: '保价总值',i:0},
        // insuredRatio',name: '比例',i:0},
        { type: 'otherPrice', name: '其他金额', i: 15 },
        { type: 'discount', name: '折扣价', i: 16 },
        { type: 'transferFee', name: '中转费', i: 17 },
        { type: 'deliveryFee', name: '送货费', i: 18 },
        { type: 'carNumber', name: '车号', i: 19 }, // ----
        { type: 'driver', name: '司机', i: 20 }, // ----
        { type: 'register', name: '挂号', i: 21 }, // ----
        { type: 'sum', name: '总合计', i: 22 },
        { type: 'state', name: '结单', i: 23 },
        { type: 'remark', name: '备注', i: 24 }
      ]
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
    checkListH(val) {
      this.tablecolumns = val.map((item) => {
        return this.formatTable.filter((it) => {
          if (item === it.name) {
            return true
          }
        })[0]
      })
      this.tablecolumns.sort((a, b) => {
        return a.i - b.i
      })
      localStorage.setItem('inteTableC', JSON.stringify(val))
      this.$nextTick(() => {
        this.$refs.multipleTable.doLayout()
      })
    },
    remove() {
      this.refresh(true)
      this.$emit('refresh', { name: 'transportStatistics' })
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
    goInventory() {
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
      Object.keys(this.tableData2[i]).forEach((key) => {
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
      this.$req('/integration/join', this.searchMsg).then((res) => {
        if (res && res.status === 1) {
          this.tableData = res.res
          this.total = res.total
          this.sum = res.sum[0]
        } else {
          this.tableData = []
          this.sum = []
          this.$message({
            message: '服务器错误！',
            type: 'error'
          })
        }
        this.$nextTick(() => {
          this.$refs.multipleTable.doLayout()
        })
      })
    },
    get2(flag) {
      if (flag) {
        this.searchMsg.i = 1
      }
      this.$req('/integration', this.searchMsg).then((res) => {
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
  computed: {
    autoSums() {
      const sumt = ['合计']
      this.tablecolumns.forEach((it, i) => {
        if (Object.keys(this.sum).includes(it.type)) {
          sumt[i + 1] = this.sum[it.type]
        } else {
          sumt[i + 1] = ''
        }
      })
      return sumt
    }
  },
  watch: {
    checkList: {
      handler: 'checkListH',
      deep: true
    },
    dataType(val) {
      if (val === '列表') {
        this.get(true)
      } else {
        this.get2(true)
      }
    }
  },
  components: {
    integration
  }
}
</script>

<style lang="scss" scoped>
</style>
