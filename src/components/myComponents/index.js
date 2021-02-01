import exportExcel from './exportExcel'
// import fixedTable from './fixedTable.vue'
export default {
    install(Vue) {
        Vue.use(exportExcel)
        // Vue.component('fixedTable', fixedTable)
    }
}
