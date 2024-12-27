<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import jsQR from 'jsqr'

const videoRef = ref<HTMLVideoElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const stream = ref<MediaStream | null>(null)
const isFrontCamera = ref(true)
const qrResult = ref('')
const scanInterval = ref<number | null>(null)

// 启动摄像头
const startCamera = async () => {
  try {
    if (stream.value) {
      stream.value.getTracks().forEach(track => track.stop())
    }
    stream.value = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: isFrontCamera.value ? 'user' : 'environment' },
      audio: false
    })
    if (videoRef.value) {
      videoRef.value.srcObject = stream.value
      // 开始实时扫描
      startQRScan()
    }
  } catch (err) {
    console.error('无法访问摄像头:', err)
  }
}

// 实时扫描二维码
const scanQRCode = () => {
  if (videoRef.value && canvasRef.value) {
    const context = canvasRef.value.getContext('2d')
    if (context && videoRef.value.videoWidth > 0) {
      canvasRef.value.width = videoRef.value.videoWidth
      canvasRef.value.height = videoRef.value.videoHeight
      context.drawImage(videoRef.value, 0, 0, canvasRef.value.width, canvasRef.value.height)

      const imageData = context.getImageData(0, 0, canvasRef.value.width, canvasRef.value.height)
      const code = jsQR(imageData.data, imageData.width, imageData.height)

      if (code) {
        qrResult.value = code.data
      }
    }
  }
}

// 开始扫描
const startQRScan = () => {
  if (scanInterval.value) {
    clearInterval(scanInterval.value)
  }
  scanInterval.value = setInterval(scanQRCode, 500) // 每500ms扫描一次
}

// 切换摄像头
const switchCamera = () => {
  isFrontCamera.value = !isFrontCamera.value
  if (scanInterval.value) {
    clearInterval(scanInterval.value)
  }
  startCamera()
}

// 组件挂载时启动摄像头
onMounted(() => {
  startCamera()
})

// 组件卸载时清理
onUnmounted(() => {
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop())
  }
  if (scanInterval.value) {
    clearInterval(scanInterval.value)
  }
})
</script>

<template>
  <div class="camera-container">
    <div class="video-container">
      <video ref="videoRef" autoplay playsinline></video>
      <canvas ref="canvasRef" style="display: none"></canvas>
    </div>

    <div class="button-container">
      <button class="switch-btn" @click="switchCamera">
        {{ isFrontCamera ? '切换到后置摄像头' : '切换到前置摄像头' }}
      </button>
    </div>

    <div v-if="qrResult" class="qr-result">
      <p>二维码内容: {{ qrResult }}</p>
    </div>
  </div>
</template>

<style scoped>
.camera-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.video-container {
  width: 100%;
  margin-bottom: 20px;
}

video {
  width: 100%;
  border-radius: 8px;
}

.button-container {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.switch-btn {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #2196F3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 10px 0;
}

.switch-btn:hover {
  background-color: #1976D2;
}

.qr-result {
  margin-top: 20px;
}

.qr-result p {
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 4px;
}
</style>
