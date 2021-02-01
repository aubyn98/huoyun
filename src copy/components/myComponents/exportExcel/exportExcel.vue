<template>
  <div>
    <div class="container_excel" @click="(e)=>{exportData(e)}">
      <i class="el-icon-download"></i>
      <span class="export">导出excel</span>
      <a ref="down" :href="href" :download="`${title}.xlsx`"></a>
    </div>
  </div>
</template>

<script>
import XLSX from 'xlsx'
export default {
  name: 'exportAsExcel',
  props: {
    msg: {
      type: Array
    },
    format: {
      type: Object
    },
    title: {
      type: String,
      default: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`
    }
  },
  data() {
    return {
      href: undefined
    }
  },
  watch: {
    href(val) {
      if (val) {
        setTimeout(_ => {
          this.$refs.down.click()
        }, 1000)
      }
    }
  },
  methods: {
    exportData(ev) {
      if (ev.target === this.$refs.down) return
      if (this.format) {
        const baseKey = Object.keys(this.format)
        const arr = []
        baseKey.forEach(item => {
          arr.push(this.format[item])
        })
        const baseName = [arr]
        if (this.msg.length !== 0) {
          [...this.msg].splice(0).forEach(o => {
            const oneData = []
            baseKey.forEach((item, index, arr) => {
              oneData.push(o[item])
            })
            baseName.push(oneData)
          })
        }
        this.downExcel(baseName)
      } else {
        this.$notify.info('没有可以下载的信息')
      }
    },
    downExcel(msg) {
      if (!msg || msg.length < 2) return this.$notify.info('没有可以下载的信息')
      const worksheet = XLSX.utils.aoa_to_sheet(msg)
      /* worksheet['!merges'] = [{
        s: { // s为开始
          c: 0, // 开始列
          r: 1// 开始取值范围
        },
        e: { // e结束
          c: 0, // 结束列
          r: 2 // 结束范围
        }
      }, {
        s: { // s为开始
          c: 0, // 开始列
          r: 4// 开始取值范围
        },
        e: { // e结束
          c: 0, // 结束列
          r: 5 // 结束范围
        }
      }] */
      const newWorkbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(newWorkbook, worksheet, 'SheetJS')
      const s = XLSX.write(newWorkbook, { type: 'binary' })
      const tmpDown = new Blob([this.s2ab(s)], { type: '' })
      this.href = URL.createObjectURL(tmpDown)
      setTimeout(() => {
        URL.revokeObjectURL(tmpDown)
      }, 5000)
    },
    s2ab(s) {
      var buf = new ArrayBuffer(s.length)
      var view = new Uint8Array(buf)
      for (var i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
      return buf
    }
  }
}
</script>

<style>
.download {
  display: none;
}

.container_excel {
  background-color: #409eff;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  border: 1px solid #409eff;
  width: 100px;
  height: 36px;
  line-height: 36px;
  border-radius: 4px;
  padding-left: 5px;
  display: inline-block;
}
.container_excel:hover {
  color: #fff;
  background-color: #66b1ff;
}
.export {
  margin-left: 8px;
}
</style>
