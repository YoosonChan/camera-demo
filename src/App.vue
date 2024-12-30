<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import jsQR from 'jsqr'

const videoRef = ref<HTMLVideoElement | null>(null)
const stream = ref<MediaStream | null>(null)
const qrResult = ref('')
const scanInterval = ref<number | null>(null)

// 启动摄像头
const startCamera = async () => {
  try {
    if (stream.value) {
      stream.value.getTracks().forEach(track => track.stop())
    }
    // 先尝试使用后置摄像头
    try {
      stream.value = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false
      })
    } catch (err) {
      // 如果后置摄像头失败，尝试使用前置摄像头
      console.log('后置摄像头启动失败，尝试前置摄像头:', err)
      stream.value = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false
      })
    }

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
  if (videoRef.value && videoRef.value.videoWidth > 0) {
    const canvas = document.createElement('canvas')
    canvas.width = videoRef.value.videoWidth
    canvas.height = videoRef.value.videoHeight
    const context = canvas.getContext('2d')
    if (context) {
      context.drawImage(videoRef.value, 0, 0, canvas.width, canvas.height)
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
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

.qr-result {
  margin-top: 20px;
}

.qr-result p {
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 4px;
}
</style>
