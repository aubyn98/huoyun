import Vue from 'vue'
import Vuex from 'vuex'
// import { Bluetooth } from 'aubyn-h5plus'
import Bluetooth from '../common/js/Bluetooth'
Vue.use(Vuex)
window.addEventListener('resize', () => {
  store.commit('changeMobile')
})
function isMobile() {
  if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)
  ) return true
  return false
}
const store = new Vuex.Store({
  state: {
    account: JSON.parse(sessionStorage.getItem('account')),
    qx: (JSON.parse(sessionStorage.getItem('account')) && JSON.parse(sessionStorage.getItem('account')).qx) || [],
    mobile: isMobile(),
    printPostUrl: localStorage.getItem('IP') || 'http://127.0.0.1',
    bluetoothList: [],
    bluetoothDeviceMsg: {
      deviceId: '',
      serviceId: '',
      characteristicId: ''
    }
  },
  mutations: {
    setBluetoothId(state, msg) {
      state.bluetoothDeviceMsg = msg
    },
    startDiscovery(state) {
      state.bluetoothList = []
      Bluetooth.startBluetoothDevicesDiscovery()
    },
    addBluetooth(state, list) {
      const obj = {}
      const arr = [...state.bluetoothList, ...list]
      const filterArr = []
      arr.forEach(item => {
        if (!obj[item.deviceId]) {
          obj[item.deviceId] = item
        }
      })
      Object.keys(obj).forEach(key => {
        filterArr.push(obj[key])
      })
      state.bluetoothList = filterArr
    },
    initBluetoothList(state) {
      state.bluetoothList = []
    },
    changeAccount(state, account) {
      state.qx = account.qx || []
      state.account = account
    },
    changeMobile(state) {
      state.mobile = isMobile()
    },
    changePrintPostUrl(state, url) {
      state.printPostUrl = url
    }
  },
  actions: {
    async sendData({ state, commit }, { value, chunkedLength = 180 }) {
      let { deviceId, serviceId, characteristicId } = state.bluetoothDeviceMsg
      if (!serviceId || !characteristicId) {
        const {
          serviceId: sId,
          writeId: cId
        } = await Bluetooth.getAllId(deviceId)
        serviceId = sId
        characteristicId = cId
        commit('setBluetoothId', { deviceId, serviceId, characteristicId })
      }
      await Bluetooth.sendDataChunkedToDevice({
        deviceId,
        serviceId,
        characteristicId,
        chunkedLength,
        value,
        success() {
          alert('发送打印数据成功！')
        }
      })
    },
    async createBLEConnection({ commit }, deviceId) {
      await Bluetooth.createBLEConnection(deviceId)
      commit('setBluetoothId', { deviceId })
    },
    async getConnectedBluetoothDevices({ state }) {
      try {
        const services = await Bluetooth.getBLEDeviceServices(state.bluetoothId)
        const devices = await Bluetooth.getConnectedBluetoothDevices(services)
        return devices
      } catch (e) {
        window.plus.nativeUI.toast('未连接设备!')
      }
    }
  },
  modules: {
  }
})
document.addEventListener('plusready', async function(e) {
  await Bluetooth.openBluetoothAdapter()
  Bluetooth.onBluetoothDeviceFound((devices) => {
    store.commit('addBluetooth', devices)
  })
})
export default store
