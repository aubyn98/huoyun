<template>
  <div class="code">
    <canvas id="ca" ref="txm" width="300" height="300"></canvas>
    <div ref="qr" style="transform:translateX(70%)"></div>
  </div>
</template>

<script type="text/javascript">
export default {
  props: [
    'barcode',
    'qrcode'
  ],
  data() {
    return {
      qrcodeInstance: null
    }
  },
  created() {
  },
  mounted() {
    if (!this.qrcodeInstance) {
      this.qrcodeInstance = this.$qrcode(this.$refs.qr, this.qrcode.toString())
    }
    this.print()
  },
  methods: {
    print() {
      this.$barcode(this.$refs.txm, this.barcode)
      this.qrcodeInstance.clear()
      this.qrcodeInstance.makeCode(this.qrcode.toString())
    }
  },
  components: {

  }
}
</script>

<style lang="scss" scoped>
.code {
  position: fixed;
  top: 100%;
  transform: translateY(100%);
  left: 0;
  width: 500px;
  background-color: white;
  height: 500px;
}
</style>
