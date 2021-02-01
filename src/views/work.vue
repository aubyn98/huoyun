<template>
  <div id="work">
    <el-container>
      <el-aside width="160px">
        <div class="lySoft">领域软件</div>
        <div id="selectMenu">
          <el-menu
            :default-active="editableTabsValue"
            class="el-menu-vertical-demo"
            @select="handleSelect"
            :collapse="false"
            text-color="#fff"
            background-color="#545c64"
            active-text-color="#ffd04b"
          >
            <el-submenu index="0">
              <template slot="title">
                <i class="el-icon-folder"></i>
                <span slot="title">档案</span>
              </template>
              <el-menu-item-group>
                <el-menu-item
                  index="customer"
                  v-if="permission(['all', 'customer', 'customerEdit'])"
                  >客户档案</el-menu-item
                >
                <el-menu-item
                  index="consignee"
                  v-if="permission(['all', 'consignee', 'consigneeEdit'])"
                  >收货人档案</el-menu-item
                >
                <el-menu-item
                  index="goodsUnit"
                  v-if="permission(['all', 'unit', 'unitEdit'])"
                  >货物单位</el-menu-item
                >
                <el-menu-item
                  index="goods"
                  v-if="permission(['all', 'goods', 'goodsEdit'])"
                  >货物档案</el-menu-item
                >
                <el-menu-item
                  index="goodsCar"
                  v-if="permission(['all', 'car', 'carEdit'])"
                  >货车档案</el-menu-item
                >
                <el-menu-item
                  index="admin"
                  v-if="permission(['all', 'user', 'userEdit'])"
                  >用户档案</el-menu-item
                >
                <el-menu-item
                  index="about"
                  v-if="
                    $store.state.account && $store.state.account.administrator
                  "
                  >公众号</el-menu-item
                >
                <el-menu-item
                  index="baseMsg"
                  v-if="
                    $store.state.account && $store.state.account.administrator
                  "
                  >基础信息</el-menu-item
                >
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-document"></i>
                <span slot="title">货运单</span>
              </template>
              <el-menu-item
                index="transport"
                v-if="permission(['all', 'transportEdit'])"
                key="transport"
                >货运单</el-menu-item
              >
              <el-menu-item
                index="transportStatistics"
                v-if="permission(['all', 'transport'])"
                key="transportStatistics"
                >货运单统计</el-menu-item
              >
              <el-menu-item index="integration" :disabled="true"
                >货运单整合</el-menu-item
              >
              <el-menu-item
                index="integrationStatistics"
                v-if="permission(['all', 'integration'])"
                >货运单整合统计</el-menu-item
              >
              <el-menu-item index="inventory" :disabled="true"
                >货运清单</el-menu-item
              >
              <el-menu-item
                index="inventoryStatistics"
                v-if="permission(['all', 'inventory'])"
                >货运清单列表</el-menu-item
              >
              <el-menu-item index="scan" v-if="$store.state.mobile"
                >扫码</el-menu-item
              >
              <!-- <el-menu-item index="scan">扫码</el-menu-item> -->
            </el-submenu>
          </el-menu>
        </div>
        <div class="dropdownBox">
          <el-dropdown trigger="click" style="cursor:pointer;">
            <span class="el-dropdown-link">
              {{ $store.state.account && $store.state.account.userName }}
              <i class="el-icon-setting el-icon-setting"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="cipherShowHandle"
                >更改密码</el-dropdown-item
              >
              <el-dropdown-item @click.native="ipShowHandle"
                >设置打印IP</el-dropdown-item
              >
              <el-dropdown-item v-if="$store.state.mobile" @click.native="setBluetoothPrinter"
                >设置蓝牙打印机</el-dropdown-item
              >
              <el-dropdown-item @click.native="tcdl">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-aside>
      <el-container>
        <!-- <el-header>

        </el-header> -->
        <el-main>
          <el-tabs
            v-model="editableTabsValue"
            type="card"
            closable
            @tab-remove="removeTab"
          >
            <el-tab-pane
              v-for="item in editableTabs"
              :key="item.name"
              :label="item.title"
              :name="item.name"
            >
              <component
                :is="item.name"
                @editable="handleSelect"
                :ref="item.name"
                :clear="clear"
                @refresh="refresh"
              ></component>
            </el-tab-pane>
          </el-tabs>
        </el-main>
      </el-container>
    </el-container>
    <transition>
      <changeCipher
        v-if="cipherShow"
        @cipherShowHandle="cipherShowHandle"
      ></changeCipher>
    </transition>
    <transition>
      <setIP v-if="ipShow" @ipShowHandle="ipShowHandle"></setIP>
    </transition>
    <!-- <transition>
      <bluetoothPage v-if="bluetoothPrinterShow" @ipShowPrinter="ipShowPrinter"></bluetoothPage>
    </transition> -->
    <el-dialog
      title="连接蓝牙打印机"
      :visible.sync="bluetoothPrinterShow"
      :close-on-click-modal="false"
      :show-close="true"
      :destroy-on-close="true"
    >
      <div
        style="height:300px;width:100%;display:flex;flex-direction:column;align-items:center"
      >
        <el-table
          :data="$store.state.bluetoothList"
          border
          height="250"
          class="card"
          key="列表"
          :row-class-name="$tableRowClassName"
        >
          <el-table-column prop="name" label="设备名称" width="180">
            <template slot-scope="scope">
              <span>{{ scope.row.name || "未知设备" }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="RSSI"
            label="设备信号强度"
            width="180"
          ></el-table-column>
          <el-table-column
            prop="deviceId"
            label="设备ID"
            width="180"
          ></el-table-column>
          <el-table-column label="操作" width="100" fixed="right">
            <template slot-scope="scope">
              <!-- slot-scope="scope" -->
              <el-button
                type="success"
                size="mini"
                @click="connectBluetooth(scope.row.deviceId)"
                >连接</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="$store.commit('startDiscovery')"
          >搜索蓝牙设备</el-button
        >
        <el-button @click="ipShowPrinter">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import transport from '@/views/bill/transport.vue'
import transportStatistics from '@/views/bill/transportStatistics.vue'
import integration from '@/views/bill/integration.vue'
import integrationStatistics from '@/views/bill/integrationStatistics.vue'
import inventory from '@/views/bill/inventory.vue'
import inventoryStatistics from '@/views/bill/inventoryStatistics.vue'
import about from '@/views/bill/about.vue'
import baseMsg from '@/views/bill/baseMsg.vue'
import changeCipher from '@/components/set/changeCipher.vue'
import setIP from '@/components/set/setIP.vue'
import customer from '@/components/customer.vue'
import consignee from '@/components/consignee.vue'
import goods from '@/components/goods.vue'
import goodsUnit from '@/components/goodsUnit.vue'
import goodsCar from '@/components/goodsCar.vue'
import admin from '@/components/admin.vue'
import Bluetooth from '../common/js/Bluetooth'
// import { Bluetooth } from 'aubyn-h5plus'
export default {
  name: 'work',
  async created() {
    window.scan = this.scan
  },
  mounted() {
    this.initMenu('货运单', 'transport')
  },
  data() {
    return {
      io: '',
      clear: false,
      bluetoothPrinterShow: false,
      editableTabsValue: '',
      editableTabs: [],
      activeArr: [],
      cipherShow: false,
      ipShow: false,
      webview: null
    }
  },
  watch: {
    activeArr: {
      handler(newValue, oldValue) {
        if (newValue.length === 0) {
          this.editableTabsValue = ''
        }
      },
      deep: true
    }
  },
  methods: {
    ipShowPrinter() {
      this.bluetoothPrinterShow = false
    },
    setBluetoothPrinter() {
      this.bluetoothPrinterShow = true
    },
    cb(d) {
      window.plus.nativeUI.toast(JSON.stringify(d, null, 4))
    },
    getBluetoothList() {
      alert(JSON.stringify(Bluetooth.getList(), null, 4))
    },
    async connectBluetooth(deviceId) {
       this.$store.dispatch('createBLEConnection', deviceId)
    },
    initMenu(name, index) {
      this.activeArr.push(index)
      this.addTab(name, index)
    },
    handleOpen(key, keyPath) {},
    refresh({ name }) {
      if (name) {
        if (this.$refs[name] && this.$refs[name][0]) {
          this.$nextTick(() => {
            this.$refs[name][0].refresh(true)
          })
        }
      }
    },
    tcdl() {
      JSON.parse(sessionStorage.getItem('account'))
      sessionStorage.removeItem('account')
      this.$router.push({ name: 'Login' })
      window.location.reload()
    },
    cipherShowHandle() {
      this.cipherShow = !this.cipherShow
    },
    ipShowHandle() {
      this.ipShow = !this.ipShow
    },
    async scan(e) {
      const { res } = JSON.parse(e)
      const position = JSON.parse(sessionStorage.getItem('account')).position
      const bm = res.toString().includes('-')
        ? res.toString().match(/-(.*)/)[1]
        : res.toString()
      let split = true
      const confirm = await this.$confirm(
        '是否将该运单，从清单中拆分出去！',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
      if (confirm !== 'confirm') {
        split = false
      }
      this.$req('scan', { bm, position, split }).then(res => {
        const { status, msg } = res
        if (status) {
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
    },
    goScan() {
      // eslint-disable-next-line
      this.webview = plus.webview
        .create(this.$baseURL + 'scan.html', 'scan', {
          backButtonAutoControl: 'close',
          titleNView: {
            type: 'float',
            backgroundColor: 'rgba(215,75,40,0)',
            titleText: '扫一扫',
            titleColor: '#FFFFFF',
            autoBackButton: true,
            buttons: [
              {
                text: '相册',
                fontSize: '16px',
                onclick: 'javascript:pick()'
              }
            ]
          }
        })
        .show('slide-in-right')
    },
    handleSelect(index, options) {
      if (!this.activeArr.includes(index)) {
        this.activeArr.push(index)
        switch (index) {
          case 'transport':
            this.addTab('货运单', index)
            break
          case 'transportStatistics':
            this.addTab('货运单统计', index)
            break
          case 'integration':
            this.addTab('货运单整合', index)
            break
          case 'integrationStatistics':
            this.addTab('货运单整合统计', index)
            break
          case 'inventory':
            this.addTab('货运清单', index)
            break
          case 'inventoryStatistics':
            this.addTab('货运清单统计', index)
            break
          case 'about':
            this.addTab('公众号', index)
            break
          case 'baseMsg':
            this.addTab('基础信息', index)
            break
          case 'scan':
            this.goScan()
            break
          case 'customer':
            this.addTab('客户档案', index)
            break
          case 'consignee':
            this.addTab('收货人档案', index)
            break
          case 'goods':
            this.addTab('货物档案', index)
            break
          case 'goodsUnit':
            this.addTab('货物单位', index)
            break
          case 'goodsCar':
            this.addTab('货车档案', index)
            break
          case 'admin':
            this.addTab('用户档案', index)
            break
        }
      } else {
        if (index === 'scan') {
          this.goScan()
          return
        }
        this.editableTabsValue = index
      }
      if (options.name) {
        this.$nextTick(() => {
          this.$refs[options.name][0].addMsg(options.msg)
        })
      }
    },
    addTab(title, name) {
      this.editableTabs.push({
        title: title,
        name: name
      })
      this.editableTabsValue = name
    },
    removeTab(targetName) {
      this.activeArr.splice(this.activeArr.indexOf(targetName), 1)
      const tabs = this.editableTabs
      let activeName = this.editableTabsValue
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            const nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              activeName = nextTab.name
            } else {
              activeName = '1'
            }
          }
        })
      }
      this.editableTabsValue = activeName
      this.editableTabs = tabs.filter(tab => tab.name !== targetName)
    }
  },
  components: {
    transport,
    changeCipher,
    setIP,
    // bluetoothPage,
    transportStatistics,
    integration,
    integrationStatistics,
    inventory,
    inventoryStatistics,
    about,
    customer,
    consignee,
    goods,
    goodsUnit,
    goodsCar,
    admin,
    baseMsg
  }
}
</script>

<style lang="scss">
#work {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}
.el-tabs__content {
  background: url("../assets/logo_blue.png") no-repeat center;
  background-size: contain;
  padding: 0 !important;
}
.el-tab-pane {
  background-color: white;
  padding: 12px;
  box-sizing: border-box;
}
.v-enter,
.v-leave-to {
  opacity: 0;
}

.v-enter-active,
.v-leave-active {
  transition: all 0.5s ease;
}
</style>
