<template>
   <a-menu class="menu" v-model:selectedKeys="current" @click="handleClick" mode="horizontal">
    <a-sub-menu key="operation">
      <template #title>
        <a-avatar size="large" :src="avatar" @click="home">
          <template #icon><UserOutlined /></template>
        </a-avatar>
      </template>
      <a-menu-item-group title="系统管理">
        <a-menu-item key="/login">系统管理</a-menu-item>
      </a-menu-item-group>
    </a-sub-menu>
  </a-menu>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { UserOutlined } from '@ant-design/icons-vue';
import { baseURL } from "@/contents/utils";
export default defineComponent({
  name: 'header',
  components: {
    UserOutlined
  },
  setup() {
    const router = useRouter()
    const current =  ref<string[]>(['operation']);
    const avatar = computed(() => {
      const userInfo = JSON.parse(localStorage.getItem('info') || '')
      return `${baseURL}${userInfo.avatar}` || ''
    })
    const handleClick = (e: any) => {
      router.push(e.key)
    }
    const home = () => {
      router.push('/')
    }
    return {
      current,
      handleClick,
      home,
      avatar
    };
  }
});
</script>

<style lang="scss" scoped>
.menu {
  background-color: #001529;
  height: 64px;
}
</style>