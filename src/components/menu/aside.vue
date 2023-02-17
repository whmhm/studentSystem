<template>
  <a-menu class="backend-aside" mode="inline" theme="dark" @click="handleClick">
    <template v-for="(menu,index) in routerList" :key="index">
      <a-menu-item v-if="menu.name" :key="menu.path">
        <template #icon>
          <PieChartOutlined />
        </template>
        <span>{{ menu.name }}</span>
      </a-menu-item>
    </template>
  </a-menu>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from 'vue';
import { useRouter } from 'vue-router';
// import {
//   MenuFoldOutlined,
//   MenuUnfoldOutlined,
//   PieChartOutlined,
//   MailOutlined,
//   DesktopOutlined,
//   InboxOutlined,
//   AppstoreOutlined,
// } from '@ant-design/icons-vue';
export default defineComponent({
  // components: {
  //   MenuFoldOutlined,
  //   MenuUnfoldOutlined,
  //   PieChartOutlined,
  //   MailOutlined,
  //   DesktopOutlined,
  //   InboxOutlined,
  //   AppstoreOutlined,
  // },
  setup() {
    const state = reactive({
      routerList: [] as any,
    });
    const router = useRouter();

    const getRouterList = () => {
      const routerOptions = router.options.routes;
      state.routerList =
        routerOptions.find((e) => e.path === '/index')?.children || [];
    };

    const handleClick = (e: any) => {
      router.push(e.key);
    };
    onMounted(() => {
      getRouterList();
    });
    return {
      ...toRefs(state),
      handleClick,
    };
  },
});
</script>

<style lang="scss" scoped>
.backend-aside {
  position: relative;
  top: -1px;
  width: 240px;
  height: calc(100vh - 64px);
}
</style>