<script setup lang="ts">
import { h, ref, render } from 'vue'
import QrcodeVue from 'qrcode.vue'

const qrValue = ref('') // 初始值设为空字符串
const printArea = ref<HTMLElement | null>(null)

const handlePrint = () => {
  if (!printArea.value) return

  try {
    // 创建一个隐藏的 iframe
    const iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    document.body.appendChild(iframe)
    // 写入打印内容
    const doc = iframe.contentWindow?.document
    if (!doc) return
    const qrcodeContainer = doc.createElement('div')
    render(h(QrcodeVue, { value: qrValue.value, size: 300, level: 'H', renderAs: 'svg' }), qrcodeContainer)
    console.log(qrcodeContainer.innerHTML);

    doc.open()
    doc.write(`
      <html>
        <head>
          <style>
            @page {
              size: 50mm 30mm;
              margin: 0;
            }
            @media print {
              body {
                position: relative;
              }
              .print-area {
                position: fixed;
                top: 0;
                left: 0;
                width: 50mm;
                height: 30mm;
                display: flex;
                align-items: center;
                box-sizing: border-box;
                padding: 0.3mm;
              }
              .print-area svg {
                display: block;
                width: 24mm !important;
                height: 24mm !important;
                margin: 0 auto;
              }
              .qr-info > div {
                margin-top: 0.3mm;
                font-size: 2.7mm;
                text-align: center;
              }
            }
          </style>
        </head>
        <body>
          <div class="print-area" ref="printArea">
            ${qrcodeContainer.innerHTML}
            <div class="qr-info">
              <div>06.03.0010</div>
              <div>直线导轨/SSE2B1111116-22230</div>
              <div>A01区03柜ABCDEFG</div>
            </div>
          </div>
        </body>
      </html>
    `)
    doc.close()

    // 等待图片加载完成后打印
    iframe.onload = () => {
      iframe.contentWindow?.print()
      // 打印完成后移除 iframe
      setTimeout(() => {
        document.body.removeChild(iframe)
      }, 1000)
    }
  } catch (error) {
    console.error('打印错误:', error)
    alert('打印失败，请重试')
  }
}
</script>

<template>
  <div class="print-container">
    <div class="button-group">
      <button @click="handlePrint" class="print-button">打印</button>
    </div>

    <div class="settings-panel">
      <div class="setting-item">
        <label>二维码内容:</label>
        <input v-model="qrValue" placeholder="请输入二维码内容" class="qr-input" />
      </div>
    </div>

    <div class="print-area" ref="printArea">
      <qrcode-vue :value="qrValue" :size="300" level="H" renderAs="svg" />
      <div class="qr-info">
        <div>06.03.0010</div>
        <div>直线导轨/SSE2B1111116-22230</div>
        <div>A01区03柜ABCDEFG</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.print-container {
  padding: 20px;
}

.button-group {
  margin-bottom: 20px;
  display: flex;
  gap: 20px;
  align-items: center;
}

.settings-panel {
  margin-bottom: 20px;
  display: flex;
  gap: 20px;
  align-items: center;
}

.setting-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.print-button {
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.print-button:hover {
  background-color: #45a049;
}

.print-area {
  width: 50mm;
  height: 30mm;
  display: flex;
  align-items: center;
}

.print-area :deep(svg) {
  display: block;
  width: 24mm !important;
  height: 24mm !important;
  margin: 0 auto;
}

.qr-info>div {
  margin-top: 0.3mm;
  font-size: 3mm;
  text-align: center;
}
</style>