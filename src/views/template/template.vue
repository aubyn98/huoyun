<template>
  <div class="page" :style="{position:position}">
    <header>货运单</header>
    <div class="saveForm">
      <el-form ref="form" label-position="left" class="card">
        <!--eslint-disable-->
        <el-form-item label="单　　　号">
          <el-input placeholder="请输入单号" clearable style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="流　水　号">
          <el-input placeholder clearable readonly style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="日　　　期">
          <el-date-picker
            style="width:200px"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="始　发　站">
          <el-autocomplete
            :highlight-first-item="true"
            ref="customerName"
            placeholder="请输入始发站"
            style="width:200px"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="运　费　到">
          <el-autocomplete
            :highlight-first-item="true"
            ref="storeName"
            placeholder="请输入地点"
            style="width:200px"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="托　运　人">
          <el-autocomplete
            :highlight-first-item="true"
            ref="storeName"
            placeholder="请输入托运人"
            style="width:200px"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="托运人号码">
          <el-autocomplete
            :highlight-first-item="true"
            ref="storeName"
            placeholder="请输入托运人号码"
            style="width:200px"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="托 运 地 址">
          <el-autocomplete
            :highlight-first-item="true"
            ref="storeName"
            placeholder="请输入托运人地址"
            style="width:200px"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="收　货　人">
          <el-autocomplete
            :highlight-first-item="true"
            ref="storeName"
            placeholder="请输入收货人"
            style="width:200px"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="收货人号码">
          <el-autocomplete
            :highlight-first-item="true"
            ref="storeName"
            placeholder="请输入收货人号码"
            style="width:200px"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="收货人地址">
          <el-autocomplete
            :highlight-first-item="true"
            ref="storeName"
            placeholder="请输入收货人地址"
            style="width:200px"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="备　　　注">
          <el-input type="textarea" style="width:200px"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="saveForm">
      <el-form ref="form" label-position="left" class="card">
        <el-form-item label="付 款 方 式">
          <el-input style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="保　价　金">
          <el-input style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="保 价 总 值">
          <el-input style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="保 价 比 例">
          <el-input style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="代 收 货 款">
          <el-input style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="总　合　计">
          <el-input style="width:200px"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="dataList" border height="250" class="card">
      <el-table-column prop="goodsName" label="品名" width="180">
        <template slot-scope="scope">
          <!-- v-if="scope.$index === 0" -->
          <el-autocomplete
            :highlight-first-item="true"
            :ref="'goodsNameFocus' + scope.$index"
            v-model="scope.row.goodsName"
            placeholder="请输入品名"
          ></el-autocomplete>
          <!-- <el-input v-else readonly v-model="scope.row.goodsName" placeholder="请在第一行选择品名"></el-input> -->
        </template>
      </el-table-column>
      <el-table-column prop="goodsName" label="单位" width="180"></el-table-column>
      <el-table-column prop="goodsName" label="件数" width="180"></el-table-column>
      <el-table-column prop="goodsName" label="数量" width="180"></el-table-column>
      <el-table-column prop="goodsName" label="虚数量" width="180"></el-table-column>
      <el-table-column prop="goodsName" label="单价" width="180"></el-table-column>
      <el-table-column prop="goodsName" label="金额" width="180"></el-table-column>
      <el-table-column prop="goodsName" label="折扣价" width="180"></el-table-column>
      <el-table-column prop="goodsName" label="中转费" width="180"></el-table-column>
      <el-table-column prop="goodsName" label="送货费" width="180"></el-table-column>
      <el-table-column prop="goodsName" label="其他金额" width="180"></el-table-column>
      <el-table-column prop="goodsName" label="备注" width="180"></el-table-column>
      <el-table-column prop="goodsName" label="操作" width="100" fixed="right">
        <template slot-scope="scope">
          <el-button type="danger" @click="delLine(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="bottomBtn-right">
      <el-button type="danger" @click="clearTable">清除列表</el-button>
      <el-button type="warning" @click="addLine(addLineNum)">增加</el-button>
      <div style="margin:0 10px">
        <el-input-number v-model="addLineNum" label="请输入增加行数" type="number" :min="1"></el-input-number>
        <span style="margin:0 10px">行</span>
      </div>
      <el-button type="primary" @click="openNew">新建</el-button>
      <el-button type="success">保存</el-button>
      <el-button type="primary">结单</el-button>
      <el-button type="info">打印</el-button>
      <exportExcel style="margin-left:10px"></exportExcel>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  props: {
    position: {
      default: 'relative'
    }
  },
  created() {
    this.msg = this.copy(this.initMsg)
    this.addLine(1)
  },
  data() {
    return {
      id: '',
      initMsg: {
        dh: '',
        date: '',
        lsh: '',
        creator: '',
        startStation: '',
        endStation: '',
        consignee: '',
        consigneePhone: '',
        consigneeAddress: '',
        customer: '',
        customerPhone: '',
        customerAddress: '',
        remark: '',
        imaginaryPiece: 0,
        imaginaryPercent: 0,
        payment: '',
        insured: 0,
        insuredSum: 0,
        insuredRatio: 0,
        collection: 0,
        sum: 0,
        state: '',
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
        remark: ''
      },
      msg: {},
      dataList: [],
      addLineNum: 1
    }
  },
  methods: {
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
  components: {

  }
}
</script>

<style lang="scss">
</style>
