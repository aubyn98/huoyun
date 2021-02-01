import html2canvas from 'html2canvas'
import moment from 'moment'
import JsBarcode from 'jsbarcode'
import QRCode from 'qrcodejs2'
import CPCL from './printCPCL'
import gbk from './gbk_util'
function digitUppercase(n) {
  const fraction = ['角', '分']
  const digit = [
    '零', '壹', '贰', '叁', '肆',
    '伍', '陆', '柒', '捌', '玖'
  ]
  const unit = [
    ['元', '万', '亿'],
    ['', '拾', '佰', '仟']
  ]
  const head = n < 0 ? '欠' : ''
  n = Math.abs(n)
  let s = ''
  for (let i = 0; i < fraction.length; i++) {
    s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '')
  }
  s = s || '整'
  n = Math.floor(n)
  for (let i = 0; i < unit[0].length && n > 0; i++) {
    let p = ''
    for (let j = 0; j < unit[1].length && n > 0; j++) {
      p = digit[n % 10] + unit[1][j] + p
      n = Math.floor(n / 10)
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s
  }
  return head + s.replace(/(零.)*零元/, '元')
    .replace(/(零.)+/g, '零')
    .replace(/^整$/, '零元整')
}
export default {
  install(Vue) {
    Vue.prototype.$data2printData = ({ msg, list }) => {
      const itemHeight = 120
      const listLen = list.length
      const difference = (listLen - 1) * itemHeight
      const strArr = []
      strArr.push(CPCL.CreatCPCLPage(800, 1200 + difference, 1, 0))
      strArr.push(CPCL.addCPCLSETMAG(4, 4))
      strArr.push(CPCL.addCPCLText(25, 50, '55', '0', 0, `${msg.corporateName}`))
      strArr.push(CPCL.addCPCLSETMAG(0, 0))

      strArr.push(CPCL.addCPCLBarCode(200, 150, '128', 100, 0, 1, 1, msg.id))
      strArr.push(CPCL.addCPCLQRCode(0, 130, 'M', 2, 6, msg.id))
      strArr.push(CPCL.addCPCLText(0, 270, '3', '18', 0, `运单号：${msg.dh}`))
      strArr.push(CPCL.addCPCLText(325, 270, '3', '18', 0, `开单日期：${msg.date}`))
      strArr.push(CPCL.addCPCLText(0, 285, '55', '0', 0, ''.padEnd(310, '_'))) // 275

      strArr.push(CPCL.addCPCLText(0, 310, '3', '18', 0, `始发站：${msg.startStation}`)) // 300
      strArr.push(CPCL.addCPCLText(325, 310, '3', '18', 0, `运费到：${msg.endStation}`)) // 300
      strArr.push(CPCL.addCPCLText(0, 325, '55', '0', 0, ''.padEnd(310, '_'))) // 325

      strArr.push(CPCL.addCPCLText(0, 350, '3', '18', 0, `收货人：${msg.consignee}`)) // 350
      strArr.push(CPCL.addCPCLText(325, 350, '3', '18', 0, `电话：${msg.consigneePhone}`)) // 350
      strArr.push(CPCL.addCPCLText(0, 390, '3', '18', 0, `地址：${msg.consigneeAddress}`)) // 400

      strArr.push(CPCL.addCPCLText(0, 430, '3', '18', 0, `托运人：${msg.customerName}`)) // 450
      strArr.push(CPCL.addCPCLText(325, 430, '3', '18', 0, `电话：${msg.customerPhone}`)) // 450
      strArr.push(CPCL.addCPCLText(0, 470, '3', '18', 0, `地址：${msg.customerAddress}`)) // 500
      strArr.push(CPCL.addCPCLText(0, 485, '55', '0', 0, ''.padEnd(310, '_'))) // 525

      for (let i = 0; i < listLen; i++) {
        const item = list[i]
        const addHeight = i * itemHeight
        strArr.push(CPCL.addCPCLText(0, 510 + addHeight, '3', '18', 0, `货物：${item.goods}`)) // 550
        strArr.push(CPCL.addCPCLText(325, 510 + addHeight, '3', '18', 0, `单位：${item.unit}`)) // 550
        strArr.push(CPCL.addCPCLText(0, 550 + addHeight, '3', '18', 0, `件数：${item.num}`)) // 600
        // strArr.push(CPCL.addCPCLText(325, 600 + addHeight, '3', '18', 0, `数量：${item.quantity}`))
        strArr.push(CPCL.addCPCLText(325, 550 + addHeight, '3', '18', 0, `单价：${item.price}`)) // 600
        strArr.push(CPCL.addCPCLText(0, 590 + addHeight, '3', '18', 0, `总金额：${item.money}`)) // 650
        // strArr.push(CPCL.addCPCLText(0, 700 + addHeight, '3', '18', 0, `折扣：${item.discount}`))
        // strArr.push(CPCL.addCPCLText(325, 700 + addHeight, '3', '18', 0, `中转费：${item.transferFee}`))
        strArr.push(CPCL.addCPCLText(325, 590 + addHeight, '3', '18', 0, `送货费：${item.deliveryFee}`)) // 650
        // strArr.push(CPCL.addCPCLText(325, 750 + addHeight, '3', '18', 0, `其他金额：${item.otherPrice}`))
        // strArr.push(CPCL.addCPCLText(0, 800 + addHeight, '3', '18', 0, `备注：${item.remark}`))
        strArr.push(CPCL.addCPCLText(0, 605 + addHeight, '55', '0', 0, ''.padEnd(310, '_'))) // 675
      }

      strArr.push(CPCL.addCPCLText(0, 630 + difference, '3', '18', 0, `保价费：${msg.insured}`)) // 700
      // strArr.push(CPCL.addCPCLText(325, 850 + difference, '3', '18', 0, `保价总值：${msg.insuredSum}`))
      // strArr.push(CPCL.addCPCLText(0, 900 + difference, '3', '18', 0, `代收货款：${msg.collection}`))
      strArr.push(CPCL.addCPCLText(325, 630 + difference, '3', '18', 0, `付费方式：${msg.payment}`)) // 700
      strArr.push(CPCL.addCPCLText(0, 670 + difference, '3', '18', 0, `合计：${msg.sum}  ${digitUppercase(msg.sum)}`)) // 750
      // strArr.push(CPCL.addCPCLText(0, 750 + difference, '3', '18', 0, `大写：${digitUppercase(msg.sum)}`))
      strArr.push(CPCL.addCPCLText(0, 710 + difference, '3', '18', 0, `备注：${msg.remark}`)) // 800
      strArr.push(CPCL.addCPCLText(0, 725 + difference, '55', '0', 0, ''.padEnd(310, '_'))) // 825

      strArr.push(CPCL.addCPCLText(0, 750 + difference, '3', '18', 0, '托运注意事项：')) // 850
      strArr.push(CPCL.addCPCLText(0, 790 + difference, '3', '18', 0, '1、托运货物必须按规定包装完好。')) // 900
      strArr.push(CPCL.addCPCLText(0, 830 + difference, '3', '18', 0, '2、不得假报货名，不得在托运货物内夹带危险品，')) // 950
      strArr.push(CPCL.addCPCLText(0, 870 + difference, '3', '18', 0, '   禁运物品，否则一切责任由托运人负责。')) // 1000
      strArr.push(CPCL.addCPCLText(0, 910 + difference, '3', '18', 0, '3、路途运输事故均在本站处理、查询货物限30日内。')) // 1050
      strArr.push(CPCL.addCPCLText(0, 950 + difference, '3', '18', 0, '4、货损货差部分按托运人声明保价计赔。')) // 1100
      strArr.push(CPCL.addCPCLText(0, 990 + difference, '3', '18', 0, '5、未保价者，按货物运费1：15赔偿。')) // 1150

      strArr.push(CPCL.addCPCLText(0, 1030 + difference, '3', '18', 0, '货物查询电话：')) // 1200
      strArr.push(CPCL.addCPCLText(0, 1070 + difference, '3', '18', 0, '郑州总部：15838392611')) // 1250
      strArr.push(CPCL.addCPCLText(300, 1070 + difference, '3', '18', 0, '郑州火车站：13073712169')) // 1250
      // strArr.push(CPCL.addCPCLText(0, 1500 + difference, '3', '18', 0, '洛阳：13303797131'))
      // strArr.push(CPCL.addCPCLText(325, 1500 + difference, '3', '18', 0, '商丘：0370-2678783'))
      // strArr.push(CPCL.addCPCLText(0, 1550 + difference, '3', '18', 0, '南阳：0377-61567751'))
      // strArr.push(CPCL.addCPCLText(325, 1550 + difference, '3', '18', 0, '安阳：13193511948'))
      // strArr.push(CPCL.addCPCLText(0, 1600 + difference, '3', '18', 0, '西平：0396-3231108'))
      // strArr.push(CPCL.addCPCLText(325, 1600 + difference, '3', '18', 0, '漯河：0395-2153335'))
      strArr.push(CPCL.addCPCLPrint())

      return gbk.strToGBKByte(strArr.join(''))
    }
    Vue.prototype.$barcode = (el, str) => {
      JsBarcode(el, str, {
        format: 'CODE128',
        displayValue: true,
        textPosition: 'bottom',
        fontSize: 20,
        width: 2,
        height: 40
      })
    }
    Vue.prototype.$qrcode = (el, str) => {
      const qrcode = new QRCode(el, {
        text: str,
        width: 128,
        height: 128,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
      })
      return qrcode
    }
    Vue.prototype.permission = function(arr) {
      if (arr && arr instanceof Array) {
        return this.$store.state.qx.some(item => arr.includes(item))
      } else {
        return false
      }
    }
    Vue.prototype.$tableCellClassName = function({ row, rowIndex }) {
      if (row.state) {
        return 'danger-cell'
      }
    }
    Vue.prototype.$tableRowClassName = function({
      row,
      rowIndex
    }) {
      if ((rowIndex + 1) % 4 === 2) {
        return 'success-row'
      }
      if ((rowIndex + 1) % 2 === 0) {
        return 'warning-row' // warning-row
      }
      return ''
    }

    Vue.prototype.$printer = async function(ref, that) {
      if (!that.$refs[ref]) {
        throw new Error('没有可以使用的元素')
      }
      const e = that.$refs[ref].$el || that.$refs[ref]
      const iframe = document.createElement('iframe')
      document.body.appendChild(iframe)
      iframe.setAttribute('style', 'position:absolute;width:0;height:0;left:0;top:0;display:none')
      const canvas = await html2canvas(e, {
        dpi: 458
      })
      const src = canvas.toDataURL('image/png')
      iframe.contentWindow.document.body.innerHTML = ''
      iframe.contentWindow.document.write(`<body style="margin:0;width:100%;height:100%;"><img src="${src}"/></body>`)
      iframe.contentWindow.document.close()
      iframe.onload = () => {
        iframe.contentWindow.print()
      }
    }

    Vue.prototype.copy = (data) => {
      return JSON.parse(JSON.stringify(data))
    }

    Vue.prototype.$moment = (value) => {
      return moment(value).format('YYYY-MM-DD')
    }

    Vue.prototype.$base64ToBlob = function(url) {
      const arr = url.split(',')
      const data = window.atob(arr[1])
      const mime = arr[0].match(/:(.*?);/)[1]
      const ia = new Uint8Array(data.length)
      for (var i = 0; i < data.length; i++) {
        ia[i] = data.charCodeAt(i)
      }
      return new Blob([ia], {
        type: mime
      })
    }

    Vue.prototype.$blobToBase64 = function(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = (e) => {
          if (e) {
            resolve(e.target.result)
          } else {
            reject(e)
          }
        }
      })
    }
  }
}
