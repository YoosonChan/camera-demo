<script setup lang="ts">
import { ref } from 'vue'
import QrcodeVue from 'qrcode.vue'

const qrValue = ref('') // 初始值设为空字符串
const printArea = ref<HTMLElement | null>(null)

const handlePrint = () => {
  window.print()
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
    <div style="break-after: always;">hello</div>
    <div style="break-after: page;">gap</div>
    <div class="print-area" ref="printArea">
      <div class="print-item" v-for="i in 2" :key="i">
        <!-- <div class="print-item"> -->
        <qrcode-vue :value="qrValue" :size="300" level="H" renderAs="svg" />
        <div class="qr-info">
          <div>06.03.0010</div>
          <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">A01-03直线导轨/SSE2B1111116-22229
          </div>
          <div>直线导轨/SSE2B1111116-22230</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@page {
  size: 50mm 30mm;
  margin: 0;
}

.print-area {
  display: none;
}

@media print {
  body :not(.print-area) {
    display: none;
  }

  body :has(.print-area),
  .print-area,
  .print-area * {
    display: block !important;
  }

  body :has(.print-area),
  body {
    margin: 0 !important;
    padding: 0 !important;
    position: static !important;
    height: auto !important;
    overflow-y: auto !important;
  }

  .print-area .print-item {
    display: grid !important;
    grid-template-columns: 22mm 25mm;
    gap: 2mm;
    align-items: center;
    width: 50mm;
    height: 30mm;
    padding: 1mm;
    box-sizing: border-box;
    break-after: page;
  }

  .print-area .print-item:last-child {
    break-after: auto;
  }

  .print-area svg {
    display: block;
    width: 22mm !important;
    height: 22mm !important;
    margin: 0 auto;
  }

  .qr-info {
    width: 21mm;
  }

  .qr-info>div {
    margin-top: 0.9mm;
    font-size: 2.7mm;
    word-break: break-all;
  }

  .qr-info>div:first-child {
    margin-top: 0;
  }
}
</style>