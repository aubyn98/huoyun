import exportExcel from './exportExcel'
import code from './code'
export default {
    install(Vue) {
        Vue.use(exportExcel)
        Vue.use(code)
    }
}
