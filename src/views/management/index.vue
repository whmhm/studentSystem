<template>
  <div>{{person}}欢迎登录，今天是{{data}}</div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
export default defineComponent({
  setup() {
    const userInfo = JSON.parse(localStorage.getItem("info") || "");
    const currentDate = new Date()
    const data = `${currentDate.getFullYear()}年${currentDate.getMonth() + 1}月${currentDate.getDate()}日`
    const state = reactive({
      person: userInfo.username || '',
      data: data
    })
    return {
      ...state
    }
  },
});
</script>

<style>
</style>