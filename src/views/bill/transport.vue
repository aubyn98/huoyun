<template>
  <!--eslint-disable-->
  <div class="page" :style="{ position: position }">
    <div class="pagecontent">
      <header style="display: flex; border-bottom: 1px solid #aaaaaa">
        <div style="width: 80px; flex-shrink: 0">货运单</div>
        <div class="headerBtn">
          <el-button
            :type="disabledAll ? 'primary' : 'success'"
            @click="
              () => {
                disabledAll ? openNew() : save();
              }
            "
            v-if="permission(['all', 'transportEdit'])"
            >{{ disabledAll ? "添加" : "保存" }}</el-button
          >
          <el-button
            type="warning"
            @click="
              () => {
                disabledAll ? (id ? (disabledAll = false) : '') : cancel();
              }
            "
            v-if="!state && permission(['all', 'transportEdit'])"
            >{{ disabledAll ? "修改" : "撤销" }}</el-button
          >
          <!-- <el-button
            size="mini"
            type="success"
            @click="save"
            v-if="!state && permission(['all', 'transportEdit'])"
            >保存</el-button
          > -->
          <el-button
            type="danger"
            @click="del"
            v-if="!state && permission(['all', 'transportEdit'])"
            :disabled="!this.id"
            >删除</el-button
          >
          <el-button
            type="danger"
            @click="clearTable"
            v-if="!state && permission(['all', 'transportEdit'])"
            :disabled="disabledAll"
            >清除列表</el-button
          >
          <el-button
            type="warning"
            @click="addLine(1)"
            v-if="!state && permission(['all', 'transportEdit'])"
            :disabled="disabledAll"
            >增加列表</el-button
          >
          <el-dropdown style="margin-left: 10px">
            <el-button type="primary" > 打　印 </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="print('contract', 'PrintReport')"
                >打印合同</el-dropdown-item
              >
              <el-dropdown-item @click.native="print('contract', 'ShowReport')"
                >合同预览</el-dropdown-item
              >
              <el-dropdown-item @click.native="print('qrcode', 'PrintReport')"
                >打印不干胶</el-dropdown-item
              >
              <el-dropdown-item @click.native="print('qrcode', 'ShowReport')"
                >不干胶预览</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown>
            <el-button type="primary"  style="width: 10px">
              <i
                class="el-icon-arrow-down el-icon--right"
                style="transform: translateX(-80%)"
              ></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                @click.native="print('contract', 'DesignReport')"
                v-if="
                  $store.state.account && $store.state.account.administrator
                "
                >编辑合同模板</el-dropdown-item
              >
              <el-dropdown-item
                @click.native="print('qrcode', 'DesignReport')"
                v-if="
                  $store.state.account && $store.state.account.administrator
                "
                >编辑不干胶模板</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
          <!-- <el-dropdown
            split-button
            type="primary"
            size="mini"
            @click="print('contract', 'PrintReport')"
            style="margin-left: 10px"
          >
            打印合同
            <el-dropdown-menu slot="dropdown" v-if="!$store.state.mobile">
              <el-dropdown-item @click.native="print('contract', 'ShowReport')"
                >合同预览</el-dropdown-item
              >
              <el-dropdown-item
                @click.native="print('contract', 'DesignReport')"
                v-if="
                  $store.state.account && $store.state.account.administrator
                "
                >编辑模板</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown
            split-button
            size="mini"
            type="primary"
            @click="print('qrcode', 'PrintReport')"
            style="margin-left: 10px"
          >
            打印不干胶
            <el-dropdown-menu slot="dropdown" v-if="!$store.state.mobile">
              <el-dropdown-item @click.native="print('qrcode', 'ShowReport')"
                >不干胶预览</el-dropdown-item
              >
              <el-dropdown-item
                @click.native="print('qrcode', 'DesignReport')"
                v-if="
                  $store.state.account && $store.state.account.administrator
                "
                >编辑模板</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown> -->
          <!-- <el-dropdown
            size="mini"
            v-if="!$store.state.mobile"
            split-button
            type="primary"
            @click="print('ticket', 'PrintReport')"
            style="margin-left: 10px"
          >
            打印小票
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="print('ticket', 'ShowReport')"
                >小票预览</el-dropdown-item
              >
              <el-dropdown-item
                @click.native="print('ticket', 'DesignReport')"
                v-if="
                  $store.state.account && $store.state.account.administrator
                "
                >编辑模板</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown> -->
          <el-button
            size="mini"
            v-if="$store.state.mobile"
            type="success"
            @click="bluetoothPrint"
            style="margin-left: 10px"
            >打印小票</el-button
          >
          <el-button
            size="mini"
            style="margin-left: 10px"
            @click="$emit('cancel')"
            v-if="propMsg"
            >返回上一级</el-button
          >
        </div>
      </header>
      <div class="saveForm2-exe">
        <el-form
          ref="form"
          label-position="left"
          class="saveForm2-exe-card1"
          :label-width="$store.state.mobile ? '' : ''"
        >
          <el-form-item label="始　发　站">
            <el-autocomplete
              :disabled="disabledAll"
              :highlight-first-item="true"
              ref="customerName"
              placeholder="请输入始发站"
              :style="{ width: '200px' }"
              v-model="msg.startStation"
              :fetch-suggestions="
                (str, cb) => {
                  $querySearchAsync(str, cb, 'startStation', 'startStation');
                }
              "
            ></el-autocomplete>
          </el-form-item>
          <el-form-item label="运　费　到">
            <el-autocomplete
              :disabled="disabledAll"
              :highlight-first-item="true"
              ref="storeName"
              placeholder="请输入地点"
              :style="{ width: '200px' }"
              v-model="msg.endStation"
              :fetch-suggestions="
                (str, cb) => {
                  $querySearchAsync(str, cb, 'endStation', 'endStation');
                }
              "
            ></el-autocomplete>
          </el-form-item>
          <div class="saveForm2-exe-card2">
            <div class="saveForm2-exe-card2-cell">
              <p class="saveForm2-exe-card2-cell-p">开单单号</p>
              <el-input
                :disabled="disabledAll"
                placeholder="请输入单号"
                clearable
                border="none"
                v-model="msg.dh"
              ></el-input>
            </div>
            <div class="saveForm2-exe-card2-cell">
              <p class="saveForm2-exe-card2-cell-p">开单日期</p>
              <el-date-picker
                :disabled="disabledAll"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                v-model="msg.date"
              ></el-date-picker>
            </div>
            <div class="saveForm2-exe-card2-cell">
              <p class="saveForm2-exe-card2-cell-p">流 水 号</p>
              <el-input
                placeholder
                clearable
                readonly
                v-model="msg.lsh"
              ></el-input>
            </div>
            <div class="saveForm2-exe-card2-cell">
              <p class="saveForm2-exe-card2-cell-p">制 单 人</p>
              <el-input
                v-model="msg.creator"
                readonly
                :disabled="disabledAll"
              ></el-input>
            </div>
          </div>
        </el-form>
        <el-form
          ref="form"
          label-position="left"
          class="saveForm2-exe-card1"
          style="position: relative"
          :label-width="$store.state.mobile ? '' : ''"
        >
          <el-form-item label="收　货　人">
            <el-input
              :style="{ width: '200px' }"
              @blur="tableBlur('consignee')"
              @focus="tableFocus('consignee')"
              @input="tableInput('consignee', $event)"
              @keypress.native.enter="tableKeypress('consignee')"
              :disabled="disabledAll"
              placeholder="请输入收货人"
              v-model="msg.consignee"
            ></el-input>
            <div
              class="fixedTable"
              :style="{
                display: consigneeTableShow,
              }"
            >
              <el-table
                border
                height="250"
                class="card table-exe"
                style="margin: 0"
                :data="consigneeList"
                @row-click="tableListClick('consignee', $event)"
              >
                <el-table-column
                  prop="consignee"
                  label="收货人"
                >
                <template slot-scope="scope">
                  <span style="font-size:16px;font-weight:600;">
                    {{scope.row.consignee}}
                  </span>
                </template>
                </el-table-column>
                <el-table-column prop="price" label="单价"></el-table-column>
                <el-table-column
                  prop="telephone"
                  label="手机"
                  width="110"
                ></el-table-column>
                <el-table-column prop="address" label="地址"></el-table-column>
              </el-table>
            </div>
            <!-- <el-autocomplete
              :disabled="disabledAll"
              :highlight-first-item="true"
              ref="storeName"
              placeholder="请输入收货人"
              :style="{ width: '200px' }"
              v-model="msg.consignee"
              @click.native="consigneeFocus"
              :fetch-suggestions="
                (str, cb) => {
                  $querySearchAsync2(
                    str,
                    cb,
                    'consignee',
                    'consignee',
                    'simpleCode',
                    consigneeSearchCb
                  );
                }
              "
              @select="consigneeSelect"
              clearable
            ></el-autocomplete> -->
          </el-form-item>
          <el-form-item label="收货人号码">
            <el-input
              :disabled="disabledAll"
              :style="{ width: '200px' }"
              placeholder="请输入收货人号码"
              v-model="msg.consigneePhone"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="收货人地址">
            <el-input
              :disabled="disabledAll"
              :style="{ width: '200px' }"
              placeholder="请输入收货人地址"
              v-model="msg.consigneeAddress"
              clearable
            ></el-input>
          </el-form-item>
        </el-form>
        <el-form
          ref="form"
          label-position="left"
          class="saveForm2-exe-card1"
          :label-width="$store.state.mobile ? '' : ''"
        >
          <el-form-item label="托　运　人">
            <el-input
              :style="{ width: '200px' }"
              @blur="tableBlur('customer')"
              @focus="tableFocus('customer')"
              @input="tableInput('customer', $event)"
              @keypress.native.enter="tableKeypress('customer')"
              :disabled="disabledAll"
              placeholder="请输入托运人"
              v-model="msg.customerName"
            ></el-input>
            <div
              class="fixedTable"
              :style="{
                display: customerTableShow,
              }"
            >
              <el-table
                border
                height="250"
                class="card table-exe"
                style="margin: 0"
                :data="customerList"
                @row-click="tableListClick('customer', $event)"
              >
                <el-table-column
                  prop="customerName"
                  label="客户"
                >
                <template slot-scope="scope">
                  <span style="font-size:16px;font-weight:600;">
                    {{scope.row.customerName}}
                  </span>
                </template>
                </el-table-column>
                <el-table-column
                  prop="telephone"
                  label="手机"
                  width="110"
                ></el-table-column>
                <el-table-column prop="address" label="地址"></el-table-column>
              </el-table>
            </div>
            <!-- <el-autocomplete
              :disabled="disabledAll"
              :highlight-first-item="true"
              ref="storeName"
              placeholder="请输入托运人"
              :style="{ width: '200px' }"
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
            ></el-autocomplete> -->
          </el-form-item>
          <el-form-item label="托运人号码">
            <el-input
              :disabled="disabledAll"
              :style="{ width: '200px' }"
              placeholder="请输入托运人号码"
              v-model="msg.customerPhone"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="托 运 地 址">
            <el-input
              :disabled="disabledAll"
              :style="{ width: '200px' }"
              placeholder="请输入托运地址"
              v-model="msg.customerAddress"
              clearable
            ></el-input>
          </el-form-item>
        </el-form>

        <el-form ref="form" label-position="left" class="saveForm2-exe-card3">
          <el-form-item label="备　　　注">
            <el-input
              :disabled="disabledAll"
              v-model="msg.remark"
              placeholder="请输入备注"
              style="width: 500px"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <div style="display: flex">
              <el-button
                type="primary"
                @click="unfigureNum"
                :disabled="disabledAll"
                >虚数量每件</el-button
              >
              <el-button
                type="primary"
                @click="unfigureP"
                :disabled="disabledAll"
                >虚数量百分比</el-button
              >
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div class="saveForm2-exe">
        <el-form ref="form" label-position="left" class="saveForm2-exe-card4">
          <el-form-item label="付 款 方 式">
            <el-select
              v-model="msg.payment"
              placeholder="请选择"
              :disabled="disabledAll"
            >
              <el-option
                v-for="item in [
                  { value: '已付' },
                  { value: '提付' },
                  { value: '厂付' },
                ]"
                :key="item.value"
                :label="item.value"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="保　价　金">
            <el-input
              type="number"
              :min="0"
              v-model="msg.insured"
              :disabled="disabledAll"
            ></el-input>
          </el-form-item>
          <el-form-item label="保 价 总 值">
            <el-input
              :disabled="disabledAll"
              type="number"
              :min="0"
              v-model="msg.insuredSum"
            ></el-input>
          </el-form-item>
          <el-form-item label="保价比例 ‰">
            <el-input
              :disabled="disabledAll"
              v-model="msg.insuredRatio"
              @input="insuredRatioC($event, msg)"
            ></el-input>
          </el-form-item>
          <el-form-item label="代 收 货 款">
            <el-input
              :disabled="disabledAll"
              type="number"
              :min="0"
              v-model="msg.collection"
            ></el-input>
          </el-form-item>
          <el-form-item label="总　合　计">
            <el-input
              type="number"
              :min="0"
              v-model="msg.sum"
              :disabled="disabledAll"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        :data="dataList"
        border
        height="250"
        class="card table-exe"
        @header-dragend="headerDragend"
      >
        <el-table-column prop="num" label="件数" :width="tableWidths['num']">
          <template slot-scope="scope">
            <el-input
              :disabled="disabledAll"
              :style="{ width: tableWidths['num'] - 20 + 'px' }"
              placeholder="请输入件数"
              type="number"
              :min="0"
              v-model="scope.row.num"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="quantity"
          label="数量"
          :width="tableWidths['quantity']"
        >
          <template slot-scope="scope">
            <el-input
              :disabled="disabledAll"
              :style="{ width: tableWidths['quantity'] - 20 + 'px' }"
              placeholder="请输入数量"
              type="number"
              :min="0"
              v-model="scope.row.quantity"
              @input="quantityC($event, scope.row)"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="otherPrice"
          label="其他金额"
          :width="tableWidths['otherPrice']"
        >
          <template slot-scope="scope">
            <el-input
              :disabled="disabledAll"
              :style="{ width: tableWidths['otherPrice'] - 20 + 'px' }"
              placeholder="请输入其他金额"
              type="number"
              :min="0"
              v-model="scope.row.otherPrice"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="goods"
          label="品名"
          :width="tableWidths['goods']"
        >
          <template slot-scope="scope">
            <el-autocomplete
              :disabled="disabledAll"
              :style="{ width: tableWidths['goods'] - 20 + 'px' }"
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
        <el-table-column prop="unit" label="单位" :width="tableWidths['unit']">
          <template slot-scope="scope">
            <el-autocomplete
              :disabled="disabledAll"
              :style="{ width: tableWidths['unit'] - 20 + 'px' }"
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
        <el-table-column
          prop="price"
          label="单价"
          :width="tableWidths['price']"
        >
          <template slot-scope="scope">
            <el-input
              :disabled="disabledAll"
              :style="{ width: tableWidths['price'] - 20 + 'px' }"
              placeholder="请输入单价"
              type="number"
              :min="0"
              v-model="scope.row.price"
              @input="priceC($event, scope.row)"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="money"
          label="金额"
          :width="tableWidths['money']"
        >
          <template slot-scope="scope">
            <el-input
              :disabled="disabledAll"
              :style="{ width: tableWidths['money'] - 20 + 'px' }"
              placeholder="请输入金额"
              type="number"
              :min="0"
              v-model="scope.row.money"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          :width="tableWidths['remark']"
        >
          <template slot-scope="scope">
            <el-input
              :disabled="disabledAll"
              :style="{ width: tableWidths['remark'] - 20 + 'px' }"
              placeholder="请输入备注"
              v-model="scope.row.remark"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="unfigure"
          label="虚数量"
          :width="tableWidths['unfigure']"
        >
          <template slot-scope="scope">
            <el-input
              :disabled="disabledAll"
              :style="{ width: tableWidths['unfigure'] - 20 + 'px' }"
              placeholder="请输入虚数量"
              type="number"
              :min="0"
              v-model="scope.row.unfigure"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="discount"
          label="折扣价"
          :width="tableWidths['discount']"
        >
          <template slot-scope="scope">
            <el-input
              :disabled="disabledAll"
              :style="{ width: tableWidths['discount'] - 20 + 'px' }"
              placeholder="请输入折扣价"
              type="number"
              :min="0"
              v-model="scope.row.discount"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="transferFee"
          label="中转费"
          :width="tableWidths['transferFee']"
        >
          <template slot-scope="scope">
            <el-input
              :disabled="disabledAll"
              :style="{ width: tableWidths['transferFee'] - 20 + 'px' }"
              placeholder="请输入中转费"
              type="number"
              :min="0"
              v-model="scope.row.transferFee"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="deliveryFee"
          label="送货费"
          :width="tableWidths['deliveryFee']"
        >
          <template slot-scope="scope">
            <el-input
              :disabled="disabledAll"
              :style="{ width: tableWidths['deliveryFee'] - 20 + 'px' }"
              placeholder="请输入送货费"
              type="number"
              :min="0"
              v-model="scope.row.deliveryFee"
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
            <el-button
              type="danger"
              @click="delLine(scope.$index)"
              :disabled="disabledAll"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
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
          this.id = data.id
          this.dataList = data.dataList
          this.oldId = this.id
          this.oldMsg = this.copy(this.msg)
          this.oldDataList = this.copy(this.dataList)
        }
      })
    } else if (this.dataType === '统计') {
      if (this.propMsg && this.propDataList) {
        this.msg = this.copy(this.propMsg)
        this.dataList = this.copy(this.propDataList)
        this.id = this.msg.id
        this.oldId = this.id
        this.oldMsg = this.copy(this.msg)
        this.oldDataList = this.copy(this.dataList)
      }
    } else {
      this.msg = this.copy(this.initMsg)
      this.oldMsg = this.copy(this.initMsg)
      this.addLine(1)
    }
    const tableWidths = localStorage.getItem('tableWidths')
    if (tableWidths) {
      this.tableWidths = JSON.parse(tableWidths)
    }
  },
  data() {
    return {
      url: '',
      discount: 0,
      codeFlag: false,
      disabledAll: true,
      id: '',
      tableWidths: {
        num: 100,
        quantity: 100,
        otherPrice: 100,
        goods: 150,
        unit: 80,
        price: 100,
        money: 100,
        remark: 180,
        unfigure: 100,
        discount: 100,
        transferFee: 100,
        deliveryFee: 100
      },
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
        num: 1,
        quantity: 1,
        unfigure: 1,
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
      oldId: '',
      oldMsg: {},
      oldDataList: [],
      dataList: [],
      addLineNum: 1,
      consigneeTableShow: 'none',
      consigneeList: [],
      customerTableShow: 'none',
      customerList: []
    }
  },
  methods: {
    tableQuery(key, val) {
      this.$querySearchAsync2(
        val,
        (res) => {
          this.searchCb(key, res)
        },
        key,
        key === 'customer' ? key + 'Name' : key,
        'simpleCode'
      )
    },
    tableKeypress(key) {
      this[key + 'TableShow'] = 'flex'
    },
    tableInput(key, val) {
      this.tableQuery(key, val)
    },
    tableFocus(key) {
      this.tableQuery(key, this.msg.consignee)
    },
    tableBlur(key) {
      setTimeout(() => {
        this[key + 'TableShow'] = 'none'
      }, 250)
    },
    tableListClick(key, row) {
      this[key + 'TableShow'] = 'none'
      this[key + 'Select'](row)
    },
    searchCb(key, res) {
      this[key + 'List'] = res
    },
    headerDragend(newWidth, oldWidth, column, event) {
      this.tableWidths[column.property] = newWidth
      localStorage.setItem('tableWidths', JSON.stringify(this.tableWidths))
    },
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
      this.dataList.forEach((item) => {
        item.unfigure || (item.unfigure = 0)
        item.unfigure = this.$add(parseFloat(item.unfigure), num)
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
      this.dataList.forEach((item) => {
        item.unfigure || (item.unfigure = 0)
        item.unfigure = this.$add(
          parseFloat(item.unfigure),
          this.$multiply(parseFloat(item.unfigure), this.$divide(num, 100))
        )
        /* item.unfigure =
          parseFloat(item.unfigure) + parseFloat(item.unfigure) * (num / 100) */
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
      this.msg.customerName = e.customerName
      this.msg.customerPhone = e.phone
      this.msg.customerAddress = e.address
      this.msg.startStation = e.freight
    },
    consigneeSelect(e) {
      if (e.discount) {
        this.discount = e.discount ? e.discount : 0
        this.dataList.forEach((item) => {
          item.discount = this.$multiply(
            item.unfigure,
            this.$multiply(item.price, this.$divide(this.discount, 100))
          )
          // item.discount = item.unfigure * item.price * (this.discount / 100)
        })
      }
      this.msg.consignee = e.consignee
      this.msg.endStation = e.freight
      this.msg.consigneePhone = e.telephone
      this.msg.consigneeAddress = e.address
      this.$req(
        '/consignee/lastData',
        { consignee: this.msg.consignee },
        { method: 'get' }
      ).then((res) => {
        const flag = res && res.status && res.res.length > 0
        const item = this.dataList[0]
        const data = res.res[0]
        item.goods = flag ? data.goods : (e.goodsType || '')
        item.price = flag ? data.price : 0
        item.unit = flag ? data.unit : ''
      })
    },
    goodsSelect(e, i) {
      this.dataList[i].unit = e.unit
    },
    cancel() {
      this.id = this.oldId
      if (!this.id) {
        this.openNew()
      }
      this.msg = { ...this.oldMsg }
      this.dataList = this.copy(this.oldDataList)
      this.disabledAll = true
    },
    del() {
      if (this.dataList.some((item) => item.state === 1)) {
        this.$message.error('该单有记录被整合无法删除，请先删除整合单！')
        return
      }
      this.$confirm('确认删除？').then((_) => {
        this.$req('/transport/delete', { id: this.id }).then((res) => {
          if (res.status === 1) {
            this.$message({
              message: '删除成功！',
              type: 'success'
            })
            if (this.id2 || this.propMsg) {
              this.$emit('del', this.id, this.dataType)
            } else {
              this.openNew()
              this.disabledAll = true
            }
          } else {
            this.openNew()
            this.disabledAll = true
          }
        })
      })
    },
    save() {
      // 保证float类型 不为空 而是为0
      Object.keys(this.initMsg).forEach((key) => {
        if (this.msg[key] === '' && this.initMsg[key] === 0) {
          this.msg[key] = 0
        }
      })
      this.dataList.forEach((item) => {
        Object.keys(this.initItem).forEach((key) => {
          if (item[key] === '' && this.initItem[key] === 0) {
            item[key] = 0
          }
        })
      })
      // 判断头部信息
      if (
        Object.keys(this.msg).some((key) => {
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
        this.dataList = this.dataList.filter((item) => item.goods !== '')
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
        }).then((data) => {
          const { res, status, msg } = data
          if (status === 1) {
            this.id = res.id
            this.msg.lsh = res.lsh
            this.$message({
              message: msg,
              type: 'success'
            })
            this.oldId = this.id
            this.oldMsg = this.copy(this.msg)
            this.oldDataList = this.copy(this.dataList)

            this.disabledAll = true
            this.print('contract', 'ShowReport')
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
        }).then((data) => {
          const { status, msg, lsh } = data
          if (status === 1) {
            if (lsh) {
              this.msg.lsh = lsh
            }
            this.$message({
              message: msg,
              type: 'success'
            })
            this.oldId = this.id
            this.oldMsg = this.copy(this.msg)
            this.oldDataList = this.copy(this.dataList)
            this.disabledAll = true
            if (this.propMsg && this.propDataList) {
              this.$emit('change', {
                ...this.copy(this.msg),
                dataList: this.copy(this.dataList),
                id: this.id
              })
            }
            this.print('contract', 'ShowReport')
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
      this.dataList = [this.copy(this.initItem)]
    },
    openNew() {
      this.disabledAll = false
      this.dataList = [this.copy(this.initItem)]
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
      return this.dataList.some((item) => {
        return item.state === 1
      })
    }
  },
  watch: {
    'msg.insured': function(val) {
      let num = 0
      this.dataList.forEach((item) => {
        // num += parseFloat(item.num) * 10000
        num = this.$add(num, parseFloat(item.num))
      })
      // num = num / 10000
      // this.msg.insuredSum = val * num * 1000
      this.msg.insuredSum = this.$multiply(val, this.$multiply(num, 1000))
    },
    'msg.insuredSum': function(val) {
      let num2 = 0
      this.dataList.forEach((item) => {
        num2 = this.$add(num2, parseFloat(item.money))
        // num2 += parseFloat(item.money) * 10000
      })
      // num2 = num2 / 10000
      /* this.msg.sum =
        num2 + val * (this.msg.insuredRatio / 1000) + this.msg.collection */
      this.msg.sum = this.$add(
        num2,
        this.$add(
          this.msg.collection,
          this.$multiply(val, this.$divide(this.msg.insuredRatio, 1000))
        )
      )
    },
    'msg.insuredRatio': function(val) {
      let num2 = 0
      this.dataList.forEach((item) => {
        num2 = this.$add(num2, parseFloat(item.money))
        // num2 += parseFloat(item.money) * 10000
      })
      // num2 = num2 / 10000
      /* this.msg.sum =
        num2 + this.msg.insuredSum * (val / 1000) + this.msg.collection */
      this.msg.sum = this.$add(
        num2,
        this.$add(
          this.msg.collection,
          this.$multiply(this.msg.insuredSum, this.$divide(val, 1000))
        )
      )
    },
    'msg.collection': function(val) {
      let num2 = 0
      this.dataList.forEach((item) => {
        num2 = this.$add(num2, parseFloat(item.money))
        // num2 += parseFloat(item.money) * 10000
      })
      // num2 = num2 / 10000
      /* this.msg.sum =
        num2 + this.msg.insuredSum * (this.msg.insuredRatio / 1000) + val */
      this.msg.sum = this.$add(
        num2,
        this.$add(
          val,
          this.$multiply(
            this.msg.insuredSum,
            this.$divide(this.msg.insuredRatio, 1000)
          )
        )
      )
    },
    dataList: {
      handler(val) {
        let num = 0
        let num2 = 0
        val.forEach((item) => {
          num = this.$add(num, parseFloat(item.num))
          // num += parseFloat(item.num) * 10000
          if (item.unfigure * item.price > item.money) {
            item.money = this.$multiply(item.unfigure, item.price)
            // item.money = item.unfigure * item.price
          }
          item.discount = this.$multiply(
            item.unfigure,
            this.$multiply(item.price, this.$divide(this.discount, 100))
          )
          // item.discount = item.unfigure * item.price * (this.discount / 100)
          // num2 += parseFloat(item.money) * 10000
          num2 = this.$add(num2, parseFloat(item.money))
        })
        // num = num / 10000
        // num2 = num2 / 10000
        this.msg.insuredSum = this.$multiply(this.msg.insured, num) * 1000
        // this.msg.insuredSum = this.msg.insured * num * 1000
        this.msg.sum = this.$add(
          num2,
          this.$add(
            this.msg.collection,
            this.$multiply(
              this.msg.insuredSum,
              this.$divide(this.msg.insuredRatio, 1000)
            )
          )
        )
        /* this.msg.sum =
          num2 +
          this.msg.insuredSum * (this.msg.insuredRatio / 1000) +
          this.msg.collection */
      },
      deep: true
    }
  }
}
</script>
<style lang="scss">
.table-exe {
  .el-input__inner {
    border: none;
  }
}
.saveForm2-exe {
  display: flex;
  flex-wrap: wrap;
  flex-shrink: 0;
  border-bottom: solid 1px #aaaaaa;
  .saveForm2-exe-card1 {
    width: 100%;
    flex-wrap: nowrap;
    justify-content: flex-start;
    flex-shrink: 0;
    .el-form-item {
      margin: 0;
      display: flex;
      min-width: 300px;
      justify-content: center;
      margin: 8px 0 8px 0;
      flex-shrink: 0;
    }
  }
  .saveForm2-exe-card2 {
    margin-top: 4px;
    width: 100%;
    height: 60px;
    display: flex;
    border-top: 1px solid #111;
    border-left: 1px solid #111;
    box-sizing: border-box;
    .saveForm2-exe-card2-cell {
      width: 25%;
      height: 100%;
      display: block;
      text-align: center;
      .saveForm2-exe-card2-cell-p {
        height: 50%;
        line-height: 29px;
        border-right: 1px solid #111;
        border-bottom: 1px solid #111;
        box-sizing: border-box;
      }
    }
    .el-input {
      width: 100%;
      height: 50%;
      line-height: 29px;
      border-right: 1px solid #111;
      border-bottom: 1px solid #111;
      box-sizing: border-box;
    }
    .el-input__inner {
      height: 50%;
      line-height: 29px;
      border: none;
      padding: 0;
      text-align: center;
    }
    .el-input__icon {
      line-height: 29px;
    }
  }
  .saveForm2-exe-card3 {
    display: flex;
    flex-wrap: nowrap;
    .el-form-item {
      margin: 0;
      display: flex;
      min-width: 300px;
      justify-content: flex-start;
      margin: 8px 0 8px 0;
      flex-shrink: 0;
    }
    .el-form-item:last-child {
      margin-left: 20px;
    }
  }
  .saveForm2-exe-card4 {
    flex-wrap: wrap;
    .el-form-item__label {
      width: 100px;
      padding: 0;
    }
    .el-form-item {
      margin: 0;
      display: flex;
      width: 16%;
      justify-content: center;
      margin: 8px 0 8px 0;
      flex-shrink: 0;
    }
    .el-form-item:nth-child(n + 2) {
      margin-left: 5px;
    }
  }
}
</style>
