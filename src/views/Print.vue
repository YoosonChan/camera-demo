<script setup lang="ts">
import { ref } from 'vue'
import QrcodeVue from 'qrcode.vue'
// landscape
const qrValue = ref('') // 初始值设为空字符串

const printArea = ref<HTMLElement | null>(null)

// portrait | landscape
const handlePrint = () => {
  const style = document.createElement('style')
  style.innerHTML = `
    @page {
      size: 40mm 30mm portrait;
      margin: 0;
    }
    @media print {
      body {
        position: relative;
      }
      body * {
        visibility: hidden;
      }
      .print-area, .print-area * {
        visibility: visible;
      }
      .print-area {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(-90deg);
        width: 30mm;
        height: 40mm;
      }
    }
  `
  document.head.appendChild(style)
  window.print()
  document.head.removeChild(style)
}
</script>

<template>
  <div class="print-container">
    <div class="settings-panel">
      <div class="setting-item">
        <label>二维码内容：</label>
        <input v-model="qrValue" placeholder="请输入二维码内容" class="qr-input" />
      </div>
      <button @click="handlePrint" class="print-button">打印</button>
    </div>

    <div class="print-area" ref="printArea">
      <qrcode-vue :value="qrValue" :size="300" level="H" />
      <div>06.03.0010</div>
      <div>直线导轨/SSE2B1111116-22230</div>
      <div>A01区03柜ABCDEFG</div>
    </div>
  </div>
</template>

<style scoped>
.print-container {
  padding: 20px;
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

.print-area>>>canvas {
  display: block;
  width: 24mm !important;
  height: 24mm !important;
  margin: 0 auto;
}

.print-area>div {
  margin-top: 0.3mm;
  font-size: 2.4mm;
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