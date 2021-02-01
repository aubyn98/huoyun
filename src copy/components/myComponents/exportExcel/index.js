import exportExcel from './exportExcel.vue'
export default {
    install(Vue) {
        Vue.component('exportExcel', exportExcel)
    }
}
