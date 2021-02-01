<template>
  <!--eslint-disable-->
  <div class="page" :style="{ position: position }">
    <div class="pagecontent">
      <header>货运单</header>
      <div class="saveForm2">
        <el-form
          ref="form"
          label-position="left"
          class="card2"
          :label-width="$store.state.mobile ? '' : ''"
        >
          <el-form-item label="收　货　人">
            <el-autocomplete
              :highlight-first-item="true"
              ref="storeName"
              placeholder="请输入收货人"
              :style="{ width: $store.state.mobile ? '150px' : '200px' }"
              v-model="msg.consignee"
              :fetch-suggestions="
                (str, cb) => {
                  $querySearchAsync2(
                    str,
                    cb,
                    'consignee',
                    'consignee',
                    'simpleCode'
                  );
                }
              "
              @select="consigneeSelect"
              clearable
            ></el-autocomplete>
          </el-form-item>
          <el-form-item label="运　单　号">
            <el-input
              placeholder="请输入单号"
              clearable
              :style="{ width: $store.state.mobile ? '150px' : '200px' }"
              v-model="msg.dh"
            ></el-input>
          </el-form-item>
          <el-form-item label="收货人号码">
            <el-input
              :style="{ width: $store.state.mobile ? '150px' : '200px' }"
              placeholder="请输入收货人号码"
              v-model="msg.consigneePhone"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="收货人地址">
            <el-input
              :style="{ width: $store.state.mobile ? '150px' : '200px' }"
              placeholder="请输入收货人地址"
              v-model="msg.consigneeAddress"
              clearable
            ></el-input>
          </el-form-item>
        </el-form>
        <el-form
          ref="form"
          label-position="left"
          class="card2"
          :label-width="$store.state.mobile ? '' : ''"
        >
          <el-form-item label="托　运　人">
            <el-autocomplete
              :highlight-first-item="true"
              ref="storeName"
              placeholder="请输入托运人"
              :style="{ width: $store.state.mobile ? '150px' : '200px' }"
              v-model="msg.customerName"
              clearable
              :fetch-suggestions="
                (str, cb) => {
                  $querySearchAsync2(
                    str,
                    cb,
                    'customer',
                    'customerName',
                    'simpleCode'
                  );
                }
              "
              @select="customerSelect"
            ></el-autocomplete>
          </el-form-item>
          <el-form-item label="托运人号码">
            <el-input
              :style="{ width: $store.state.mobile ? '150px' : '200px' }"
              placeholder="请输入托运人号码"
              v-model="msg.customerPhone"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="托 运 地 址">
            <el-input
              :style="{ width: $store.state.mobile ? '150px' : '200px' }"
              placeholder="请输入托运地址"
              v-model="msg.customerAddress"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="始　发　站">
            <el-autocomplete
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
        </el-form>
        <el-form
          ref="form"
          label-position="left"
          class="card2"
          :label-width="$store.state.mobile ? '' : ''"
        >
          <el-form-item label="运　费　到">
            <el-autocomplete
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
          <el-form-item label="流　水　号">
            <el-input
              placeholder
              clearable
              readonly
              :style="{ width: $store.state.mobile ? '150px' : '200px' }"
              v-model="msg.lsh"
            ></el-input>
          </el-form-item>
          <el-form-item label="日　　　期">
            <el-date-picker
              :style="{ width: $store.state.mobile ? '150px' : '200px' }"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              v-model="msg.date"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="制　单　人">
            <el-input
              :style="{ width: $store.state.mobile ? '150px' : '200px' }"
              v-model="msg.creator"
              readonly
            ></el-input>
          </el-form-item>
        </el-form>
        <el-form
          ref="form"
          label-position="left"
          class="card2"
          :label-width="$store.state.mobile ? '' : ''"
        >
          <el-form-item label="备　　　注">
            <el-input
              type="textarea"
              :style="{ width: $store.state.mobile ? '150px' : '200px' }"
              v-model="msg.remark"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="saveForm">
        <el-form
          ref="form"
          label-position="left"
          class="card"
          :label-width="$store.state.mobile ? '' : ''"
        >
          <el-form-item label="付 款 方 式">
            <el-select
              v-model="msg.payment"
              placeholder="请选择"
              :style="{ width: $store.state.mobile ? '150px' : '200px' }"
            >
              <el-option
                v-for="item in [
                  { value: '已付' },
                  { value: '提付' },
                  { value: '厂付' }
                ]"
                :key="item.value"
                :label="item.value"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="保　价　金">
            <el-input
              :style="{ width: $store.state.mobile ? '150px' : '200px' }"
              type="number"
              :min="0"
              v-model="msg.insured"
            ></el-input>
          </el-form-item>
          <el-form-item label="保 价 总 值">
            <el-input
              :style="{ width: $store.state.mobile ? '150px' : '200px' }"
              type="number"
              :min="0"
              v-model="msg.insuredSum"
            ></el-input>
          </el-form-item>
          <el-form-item label="保价比例 ‰">
            <el-input
              :style="{ width: $store.state.mobile ? '150px' : '200px' }"
              v-model="msg.insuredRatio"
              @input="insuredRatioC($event, msg)"
            ></el-input>
          </el-form-item>
          <el-form-item label="代 收 货 款">
            <el-input
              :style="{ width: $store.state.mobile ? '150px' : '200px' }"
              type="number"
              :min="0"
              v-model="msg.collection"
            ></el-input>
          </el-form-item>
          <el-form-item label="总　合　计">
            <el-input
              :style="{ width: $store.state.mobile ? '150px' : '200px' }"
              type="number"
              :min="0"
              v-model="msg.sum"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <div style="display:flex">
              <el-button type="primary" @click="unfigureNum"
                >虚数量每件</el-button
              >
              <el-button type="primary" @click="unfigureP"
                >虚数量百分比</el-button
              >
            </div>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="dataList" border height="250" class="card">
        <el-table-column prop="num" label="件数" width="100">
          <template slot-scope="scope">
            <el-input
              style="width:80px"
              placeholder="请输入件数"
              type="number"
              :min="0"
              v-model="scope.row.num"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="quantity" label="数量" width="100">
          <template slot-scope="scope">
            <el-input
              style="width:80px"
              placeholder="请输入数量"
              type="number"
              :min="0"
              v-model="scope.row.quantity"
              @input="quantityC($event, scope.row)"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="otherPrice" label="其他金额" width="100">
          <template slot-scope="scope">
            <el-input
              style="width:80px"
              placeholder="请输入其他金额"
              type="number"
              :min="0"
              v-model="scope.row.otherPrice"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="goods" label="品名" width="150">
          <template slot-scope="scope">
            <el-autocomplete
              :highlight-first-item="true"
              :ref="'goodsNameFocus' + scope.$index"
              v-model="scope.row.goods"
              placeholder="请输入品名"
              clearable
              :fetch-suggestions="
                (str, cb) => {
                  $querySearchAsync(str, cb, 'goods', 'goods');
                }
              "
              @select="goodsSelect($event, scope.$index)"
            ></el-autocomplete>
          </template>
        </el-table-column>
        <el-table-column prop="unit" label="单位" width="80">
          <template slot-scope="scope">
            <el-autocomplete
              style="width:60px"
              :highlight-first-item="true"
              :ref="'goodsNameFocus' + scope.$index"
              v-model="scope.row.unit"
              placeholder="请输入单位"
              clearable
              :fetch-suggestions="
                (str, cb) => {
                  $querySearchAsync(str, cb, 'unit', 'unit');
                }
              "
            ></el-autocomplete>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="单价" width="100">
          <template slot-scope="scope">
            <el-input
              style="width:80px"
              placeholder="请输入单价"
              type="number"
              :min="0"
              v-model="scope.row.price"
              @input="priceC($event, scope.row)"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="money" label="金额" width="100">
          <template slot-scope="scope">
            <el-input
              style="width:80px"
              placeholder="请输入金额"
              type="number"
              :min="0"
              v-model="scope.row.money"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="unfigure" label="虚数量" width="100">
          <template slot-scope="scope">
            <el-input
              style="width:80px"
              placeholder="请输入虚数量"
              type="number"
              :min="0"
              v-model="scope.row.unfigure"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="discount" label="折扣价" width="100">
          <template slot-scope="scope">
            <el-input
              style="width:80px"
              placeholder="请输入折扣价"
              type="number"
              :min="0"
              v-model="scope.row.discount"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="transferFee" label="中转费" width="100">
          <template slot-scope="scope">
            <el-input
              style="width:80px"
              placeholder="请输入中转费"
              type="number"
              :min="0"
              v-model="scope.row.transferFee"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="deliveryFee" label="送货费" width="100">
          <template slot-scope="scope">
            <el-input
              style="width:80px"
              placeholder="请输入送货费"
              type="number"
              :min="0"
              v-model="scope.row.deliveryFee"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" width="180">
          <template slot-scope="scope">
            <el-input
              style="width:160px"
              placeholder="请输入备注"
              v-model="scope.row.remark"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="100"
          fixed="right"
          v-if="!state && permission(['all', 'transportEdit'])"
        >
          <template slot-scope="scope">
            <el-button type="danger" @click="delLine(scope.$index)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="bottomBtn-right">
      <el-button
        type="danger"
        @click="clearTable"
        v-if="!state && permission(['all', 'transportEdit'])"
        >清除列表</el-button
      >
      <el-button
        type="warning"
        @click="addLine(1)"
        v-if="!state && permission(['all', 'transportEdit'])"
        >增加</el-button
      >
      <el-button
        type="primary"
        @click="openNew"
        v-if="!propMsg && permission(['all', 'transportEdit'])"
        >新建</el-button
      >
      <el-button
        type="success"
        @click="save"
        v-if="!state && permission(['all', 'transportEdit'])"
        >保存</el-button
      >
      <el-dropdown
        split-button
        type="primary"
        @click="print('contract', 'PrintReport')"
        style="margin-left:10px"
      >
        打印合同
        <el-dropdown-menu slot="dropdown" v-if="!$store.state.mobile">
          <el-dropdown-item @click.native="print('contract', 'ShowReport')"
            >合同预览</el-dropdown-item
          >
          <el-dropdown-item
            @click.native="print('contract', 'DesignReport')"
            v-if="$store.state.account && $store.state.account.administrator"
            >编辑模板</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown
        split-button
        type="primary"
        @click="print('qrcode', 'PrintReport')"
        style="margin-left:10px"
      >
        打印不干胶
        <el-dropdown-menu slot="dropdown" v-if="!$store.state.mobile">
          <el-dropdown-item @click.native="print('qrcode', 'ShowReport')"
            >不干胶预览</el-dropdown-item
          >
          <el-dropdown-item
            @click.native="print('qrcode', 'DesignReport')"
            v-if="$store.state.account && $store.state.account.administrator"
            >编辑模板</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown
        v-if="!$store.state.mobile"
        split-button
        type="primary"
        @click="print('ticket', 'PrintReport')"
        style="margin-left:10px"
      >
        打印小票
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="print('ticket', 'ShowReport')"
            >小票预览</el-dropdown-item
          >
          <el-dropdown-item
            @click.native="print('ticket', 'DesignReport')"
            v-if="$store.state.account && $store.state.account.administrator"
            >编辑模板</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
      <el-button
        v-if="$store.state.mobile"
        type="success"
        @click="bluetoothPrint"
        style="margin-left:10px"
        >打印小票</el-button
      >
      <el-button
        style="margin-left:10px"
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
    id2: {
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
        '/transport/findById',
        { id: this.id2 },
        { method: 'get' }
      ).then(res => {
        const { res: data, status } = res
        if (data && status === 1) {
          const o = {}
          Object.keys(data).forEach(key => {
            if (key !== 'dataList' && key !== 'id') {
              o[key] = data[key]
            }
          })
          this.msg = o
          this.id = data.id
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
      this.msg = this.copy(this.initMsg)
      this.addLine(2)
    }
  },
  data() {
    return {
      url: '',
      discount: 0,
      codeFlag: false,
      id: '',
      initMsg: {
        dh: '',
        date: this.$moment(new Date()),
        lsh: '',
        creator:
          this.$store.state.account && this.$store.state.account.userName,
        startStation:
          this.$store.state.account && this.$store.state.account.position,
        endStation: '',
        consignee: '',
        consigneePhone: '',
        consigneeAddress: '',
        customerName: '',
        customerPhone: '',
        customerAddress: '',
        remark: '',
        imaginaryPiece: 0,
        imaginaryPercent: 0,
        payment: '提付',
        insured: 0,
        insuredSum: 0,
        insuredRatio: 2,
        collection: 0,
        sum: 0,
        position: ''
      },
      initItem: {
        goods: '',
        unit: '',
        num: 0,
        quantity: 0,
        unfigure: 0,
        price: 0,
        money: 0,
        discount: 0,
        transferFee: 0,
        deliveryFee: 0,
        otherPrice: 0,
        remark: '',
        state: 0
      },
      msg: {},
      dataList: [],
      addLineNum: 1
    }
  },
  methods: {
    bluetoothPrint() {
      let corporate = localStorage.getItem('corporate')
      corporate && (corporate = JSON.parse(corporate))
      this.$store.dispatch('sendData', {
        value: this.$data2printData({
          msg: {
            id: this.id,
            ...this.msg,
            corporateName: corporate.corporateName
          },
          list: this.dataList
        })
      })
    },
    unfigureNum() {
      let num = prompt('请输入要增加数量')
      if (num === null) {
        return
      }
      num = parseFloat(num)
      if (isNaN(num)) {
        return this.$message.error('请输入数字！')
      }
      this.dataList.forEach(item => {
        item.unfigure || (item.unfigure = 0)
        item.unfigure = parseFloat(item.unfigure) + num
      })
    },
    unfigureP() {
      let num = prompt('请输入要增加百分比')
      if (num === null) {
        return
      }
      num = parseFloat(num)
      if (isNaN(num)) {
        return this.$message.error('请输入数字！')
      }
      this.dataList.forEach(item => {
        item.unfigure || (item.unfigure = 0)
        item.unfigure =
          parseFloat(item.unfigure) + parseFloat(item.unfigure) * (num / 100)
      })
    },
    print(type, method) {
      if (!this.id) {
        this.$message.error('请先保存再打印！')
        return
      }
      this.$postPrint({
        type,
        data: { id: this.id2 || this.id, type, method },
        method,
        that: this
      })
    },
    customerSelect(e) {
      this.msg.customerPhone = e.phone
      this.msg.customerAddress = e.address
      this.msg.startStation = e.freight
    },
    consigneeSelect(e) {
      if (e.discount) {
        this.discount = e.discount ? e.discount : 0
        this.dataList.forEach(item => {
          item.discount = item.unfigure * item.price * (this.discount / 100)
        })
      }
      this.msg.endStation = e.freight
      this.msg.consigneePhone = e.phone
      this.msg.consigneeAddress = e.address
      this.$req(
        '/consignee/lastData',
        { consignee: this.msg.consignee },
        { method: 'get' }
      ).then(res => {
        const flag = res && res.status && res.res.length > 0
        const item = this.dataList[0]
        const data = res.res[0]
        item.goods = flag ? data.goods : ''
        item.price = flag ? data.price : 0
        item.unit = flag ? data.unit : ''
      })
    },
    goodsSelect(e, i) {
      this.dataList[i].unit = e.unit
    },
    save() {
      // 保证float类型 不为空 而是为0
      Object.keys(this.initMsg).forEach(key => {
        if (this.msg[key] === '' && this.initMsg[key] === 0) {
          this.msg[key] = 0
        }
      })
      this.dataList.forEach(item => {
        Object.keys(this.initItem).forEach(key => {
          if (item[key] === '' && this.initItem[key] === 0) {
            item[key] = 0
          }
        })
      })
      // 判断头部信息
      if (
        Object.keys(this.msg).some(key => {
          const flag = !this.msg[key]
          switch (true) {
            case key === 'dh' && flag:
              this.$message.error('单号不能为空！')
              return true
            case key === 'date' && flag:
              this.$message.error('日期不能为空！')
              return true
            case key === 'startStation' && flag:
              this.$message.error('始发站不能为空！')
              return true
            case key === 'endStation' && flag:
              this.$message.error('到货地点不能为空！')
              return true
            case key === 'consignee' && flag:
              this.$message.error('收货人不能为空！')
              return true
            case key === 'consigneeAddress' && flag:
              this.$message.error('收货地址不能为空！')
              return true
          }
        })
      ) {
        return
      }
      // 判断记录
      if (this.dataList.length === 0) {
        this.addLine(1)
        return this.$message.error('请至少填入一行数据！')
      } else {
        this.dataList = this.dataList.filter(item => item.goods !== '')
        if (this.dataList.length === 0) {
          this.addLine(1)
        }
        if (
          this.dataList.some((item, i) => {
            if (item.goods === '') {
              this.$message.error(`第${i + 1}行品名不能为空！`)
              return true
              // eslint-disable-next-line
            } else if (item.quantity == 0) {
              this.$message.error(`第${i + 1}行数量不能为0！`)
              return true
            }
          })
        ) {
          return
        }
      }
      // id不存在则为添加  id存在则为修改
      if (!this.id) {
        this.$req('/transport/add', {
          ...this.msg,
          dataList: this.dataList
        }).then(data => {
          const { res, status, msg } = data
          if (status === 1) {
            this.id = res.id
            this.msg.lsh = res.lsh
            this.$message({
              message: msg,
              type: 'success'
            })
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
        this.$req('/transport/update', {
          ...this.msg,
          id: this.id,
          dataList: this.dataList
        }).then(data => {
          const { status, msg, lsh } = data
          if (status === 1) {
            if (lsh) {
              this.msg.lsh = lsh
            }
            this.$message({
              message: msg,
              type: 'success'
            })
            if (this.propMsg && this.propDataList) {
              this.$emit('change', {
                ...this.copy(this.msg),
                dataList: this.copy(this.dataList)
              })
            }
          } else {
            this.id = ''
            this.$message({
              message: msg + '或单号已被删除',
              type: 'error'
            })
          }
        })
      }
    },
    addLine(len) {
      if (this.dataList.length === 2) {
        return this.$message.error('列表最多两行！')
      }
      for (let i = 0; i < len; i++) {
        this.dataList.push(this.copy(this.initItem))
      }
    },
    delLine(i) {
      this.dataList.splice(i, 1)
    },
    clearTable() {
      this.dataList = [this.copy(this.initItem), this.copy(this.initItem)]
    },
    openNew() {
      this.dataList = [this.copy(this.initItem), this.copy(this.initItem)]
      const {
        startStation,
        endStation,
        customerName,
        customerPhone,
        customerAddress
      } = this.msg
      this.msg = this.copy(this.initMsg)
      this.msg = {
        ...this.msg,
        startStation,
        endStation,
        customerName,
        customerPhone,
        customerAddress
      }
      this.id = ''
    },
    quantityC(val, it) {
      it.money = val * it.price
      it.unfigure = val
    },
    priceC(val, it) {
      it.money = val * it.quantity
    },
    insuredRatioC(val, it) {
      if (val) {
        if (!/^\d*\.?\d*$/.test(val)) {
          it.insuredRatio = ''
          return
        }
        it.insuredRatio = val
      }
    }
  },
  computed: {
    state() {
      return this.dataList.some(item => {
        return item.state === 1
      })
    }
  },
  watch: {
    'msg.insured': function(val) {
      let num = 0
      this.dataList.forEach(item => {
        num += parseFloat(item.num) * 10000
      })
      num = num / 10000
      this.msg.insuredSum = val * num
    },
    'msg.insuredSum': function(val) {
      let num2 = 0
      this.dataList.forEach(item => {
        num2 += parseFloat(item.money) * 10000
      })
      num2 = num2 / 10000
      this.msg.sum =
        num2 + val * (this.msg.insuredRatio / 1000) + this.msg.collection
    },
    'msg.insuredRatio': function(val) {
      let num2 = 0
      this.dataList.forEach(item => {
        num2 += parseFloat(item.money) * 10000
      })
      num2 = num2 / 10000
      this.msg.sum =
        num2 + this.msg.insuredSum * (val / 1000) + this.msg.collection
    },
    'msg.collection': function(val) {
      let num2 = 0
      this.dataList.forEach(item => {
        num2 += parseFloat(item.money) * 10000
      })
      num2 = num2 / 10000
      this.msg.sum =
        num2 + this.msg.insuredSum * (this.msg.insuredRatio / 1000) + val
    },
    dataList: {
      handler(val) {
        let num = 0
        let num2 = 0
        val.forEach(item => {
          num += parseFloat(item.num) * 10000
          if (item.unfigure * item.price > item.money) {
            item.money = item.unfigure * item.price
          }
          item.discount = item.unfigure * item.price * (this.discount / 100)
          num2 += parseFloat(item.money) * 10000
        })
        num = num / 10000
        num2 = num2 / 10000
        this.msg.insuredSum = this.msg.insured * num
        this.msg.sum =
          num2 +
          this.msg.insuredSum * (this.msg.insuredRatio / 1000) +
          this.msg.collection
      },
      deep: true
    }
  }
}
</script>
