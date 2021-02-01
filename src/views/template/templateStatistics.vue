<template>
  <div class="page">
    <!-- <header>货运单统计</header> -->
    <div class="saveForm">
      <el-form ref="form" label-position="left" class="card">
        <!--eslint-disable-->
        <el-form-item label="开 始 日 期">
          <el-date-picker
            style="width:200px"
            type="date"
            placeholder="选择开始日期"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结 束 日 期">
          <el-date-picker
            style="width:200px"
            type="date"
            placeholder="选择结束日期"
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
        <el-form-item label="托运人号码">
          <el-autocomplete
            :highlight-first-item="true"
            ref="storeName"
            placeholder="请输入托运人号码"
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
        <el-form-item label="托运人号码">
          <el-autocomplete
            :highlight-first-item="true"
            ref="storeName"
            placeholder="请输入托运人号码"
            style="width:200px"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item>
          <div style="width:100%;display:flex">
            <el-button type="primary">查询</el-button>
            <el-button type="success">生成整合单</el-button>
            <exportExcel style="margin-left:10px" :format="{name:'11'}" :msg="tableData"></exportExcel>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="tableData" border height="250" class="card">
      <el-table-column prop="dh" label="单号"></el-table-column>
      <el-table-column prop="customerName" label="客户"></el-table-column>
      <!-- <el-table-column prop="date2" label="开单日期"></el-table-column> -->
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      style="margin-top:10px"
      :total="100"
      :current-page.sync="searchMsg.i"
      :page-size="20"
    ></el-pagination>
  </div>
</template>

<script type="text/javascript">
import exportExcel from '@/components/exportExcel.vue'
export default {
  data() {
    return {
      searchMsg: {
        i: 1
      },
      tableData: [{ name: 1 }]
    }
  },
  methods: {

  },
  components: {
    exportExcel
  }
}
</script>

<style lang="scss" scoped>
</style>
