<template>
  <div class="not-found-container">
    <div class="not-found">¯\_(ツ)_/¯</div>
    <p class="not-found">404 Not Found</p>
    <a-button @click="home">返回上一页</a-button>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router'
export default defineComponent({
  setup() {
    const router = useRouter()
    const goHome = ():void => {
      router.go(-1)
    }
    return {
      goHome
    }
  },
})
</script>
<style lang="scss" scoped>
.not-found-container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  .not-found {
    font-size: 32px;
    margin-bottom: 20px;
  }
}
</style>
