<template>
  <div class="sys-header">
    <div class="sys-title">学生综合测评</div>
    <a-menu class="menu" v-model:selectedKeys="current" @click="handleClick" mode="horizontal">
      <a-sub-menu key="operation">
        <template #title>
          <a-avatar size="large" :src="avatar" @click="home">
            <template #icon>
              <UserOutlined />
            </template>
          </a-avatar>
        </template>
        <a-menu-item-group title="系统管理">
          <a-menu-item key="/login">系统管理</a-menu-item>
        </a-menu-item-group>
        <a-menu-item-group title="退出登录" v-if="canLogout">
          <a-menu-item key="/logout">退出登录</a-menu-item>
        </a-menu-item-group>
      </a-sub-menu>
    </a-menu>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import store from '@/store/index';
import { useRouter } from 'vue-router';
import { UserOutlined } from '@ant-design/icons-vue';
import { baseURL } from '@/contents/utils';
export default defineComponent({
  name: 'sysHeader',
  components: {
    UserOutlined,
  },
  setup() {
    const router = useRouter();
    const current = ref<string[]>(['operation']);
    const userInfo = computed(() => {
      return store.getters.userInfo;
    });
    const avatar = computed(() => {
      return `${baseURL}${userInfo.value.avatar}` || '';
    });
    // 是否可以退出登录
    const canLogout = computed(() => {
      return Object.keys(userInfo.value).length;
    });
    const handleClick = (e: any) => {
      if (e.key === '/logout') {
        handleLogout();
      } else {
        router.push(e.key);
      }
    };
    const handleLogout = () => {
      sessionStorage.removeItem('info');
      sessionStorage.removeItem('system_token');
      store.commit('DEL_INFO');
      router.go(0);
    };
    const home = () => {
      router.push('/');
    };
    return {
      current,
      handleClick,
      home,
      avatar,
      canLogout,
    };
  },
});
</script>

<style lang="scss" scoped>
.sys-header {
  position: relative;
  height: 64px;
  background-color: #001529;

  .sys-title {
    letter-spacing: 5px;
    position: absolute;
    top: 6px;
    left: 16px;
    font-size: 32px;
    color: #fff;
  }
}
.menu {
  position: absolute;
  right: 10px;
  text-align: right;
  height: 64px;
  background-color: #001529;
}
</style>