<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const videoRef = ref<HTMLVideoElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const photoRef = ref<string>('')
const stream = ref<MediaStream | null>(null)

// 启动摄像头
const startCamera = async () => {
  try {
    stream.value = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false
    })
    if (videoRef.value) {
      videoRef.value.srcObject = stream.value
    }
  } catch (err) {
    console.error('无法访问摄像头:', err)
  }
}

// 拍照
const takePhoto = () => {
  if (videoRef.value && canvasRef.value) {
    const context = canvasRef.value.getContext('2d')
    if (context) {
      canvasRef.value.width = videoRef.value.videoWidth
      canvasRef.value.height = videoRef.value.videoHeight
      context.drawImage(videoRef.value, 0, 0, canvasRef.value.width, canvasRef.value.height)
      photoRef.value = canvasRef.value.toDataURL('image/png')
    }
  }
}

// 组件挂载时启动摄像头
onMounted(() => {
  startCamera()
})

// 组件卸载时关闭摄像头
onUnmounted(() => {
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop())
  }
})
</script>

<template>
  <div class="camera-container">
    <div class="video-container">
      <video ref="videoRef" autoplay playsinline></video>
      <canvas ref="canvasRef" style="display: none"></canvas>
    </div>

    <button class="capture-btn" @click="takePhoto">拍照</button>

    <div v-if="photoRef" class="photo-container">
      <img :src="photoRef" alt="拍摄的照片" />
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

.capture-btn {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 10px 0;
}

.capture-btn:hover {
  background-color: #45a049;
}

.photo-container {
  margin-top: 20px;
}

.photo-container img {
  max-width: 100%;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
