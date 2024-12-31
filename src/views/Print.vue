<script setup lang="ts">
import { ref } from 'vue'
import QrcodeVue from 'qrcode.vue'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

// landscape
const qrValue = ref('') // 初始值设为空字符串

const printArea = ref<HTMLElement | null>(null)

// portrait | landscape
const handlePrint = async () => {
  if (!printArea.value) return

  try {
    // 计算所需的 DPI（设置为 203 DPI）
    const targetDPI = 203
    const scaleFactor = targetDPI / 96  // 96 是浏览器的默认 DPI

    // 使用 html2canvas 将 DOM 转换为 canvas
    const canvas = await html2canvas(printArea.value, {
      scale: scaleFactor,
      useCORS: true,
      backgroundColor: '#ffffff',
      imageTimeout: 0,
      logging: false,
      removeContainer: true,
      allowTaint: true
    })

    // 创建 PDF
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [50, 30]
    })

    // 将 canvas 转换为图片
    const imgData = canvas.toDataURL('image/png', 1.0)

    // 计算图片在 PDF 中的位置和尺寸
    pdf.addImage(imgData, 'PNG', 0, 0, 50, 30, '', 'NONE')

    // 直接打印 PDF
    pdf.autoPrint()

    // 在隐藏的 iframe 中打开 PDF
    const iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    document.body.appendChild(iframe)

    // 将 PDF 转换为 Blob URL
    const pdfOutput = pdf.output('bloburl').toString()

    // 在 iframe 中加载 PDF
    iframe.src = pdfOutput

    // 等待 PDF 加载完成后打印
    iframe.onload = () => {
      iframe.contentWindow?.print()
      // 打印完成后清理
      // setTimeout(() => {
      //   document.body.removeChild(iframe)
      //   URL.revokeObjectURL(pdfOutput)
      // }, 1000)
    }
  } catch (error) {
    console.error('打印错误:', error)
    alert('打印失败，请重试')
  }
}

// 下载图片功能
const handleDownloadImage = async () => {
  const element = document.querySelector('.print-area') as HTMLElement
  if (!element) return

  try {
    // 计算所需的 DPI（设置为 203 DPI）
    const targetDPI = 203
    const scaleFactor = targetDPI / 96  // 96 是浏览器的默认 DPI
    // 使用 html2canvas 将 DOM 转换为 canvas
    const canvas = await html2canvas(element, {
      scale: scaleFactor,
      useCORS: true,
      backgroundColor: '#ffffff',
      imageTimeout: 0,
      logging: false,
      removeContainer: true,
      allowTaint: true
    })
    const url = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = `print-${new Date().getTime()}.png`
    link.href = url
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('下载图片失败:', error)
  }
}

</script>

<template>
  <div class="print-container">
    <div class="button-group">
      <button @click="handlePrint" class="print-button">打印</button>
      <button @click="handleDownloadImage" class="download-button">下载图片</button>
    </div>

    <div class="settings-panel">
      <div class="setting-item">
        <label>二维码内容:</label>
        <input v-model="qrValue" placeholder="请输入二维码内容" class="qr-input" />
      </div>
    </div>

    <div class="print-area" ref="printArea">
      <qrcode-vue :value="qrValue" :size="300" level="H" />
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

.download-button {
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.download-button:hover {
  background-color: #45a049;
}

.print-area {
  width: 50mm;
  height: 30mm;
  display: flex;
  align-items: center;
}

.print-area>>>canvas {
  display: block;
  width: 20mm !important;
  height: 20mm !important;
  margin: 0 auto;
}

.print-area>.qr-info>div {
  margin-top: 0.3mm;
  font-size: 3mm;
  text-align: center;
}

select {
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.qr-input {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 200px;
}
</style>