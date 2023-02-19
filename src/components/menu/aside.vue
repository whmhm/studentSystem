<template>
  <a-menu class="backend-aside" mode="inline" theme="dark" v-model:selectedKeys="selectedKeys" @click="handleClick">
    <template v-for="(menu, index) in routerList" :key="index">
      <template v-if="menu.name">
        <a-sub-menu v-if="menu.children" :key="menu.path">
          <template #title>
            <span>{{ menu.name }}</span>
          </template>
          <a-menu-item v-for="submenu in menu.children" :key="submenu.path">
            <span>{{ submenu.name }}</span>
          </a-menu-item>
        </a-sub-menu>
        <a-menu-item v-else :key="menu.path">
          <span>{{ menu.name }}</span>
        </a-menu-item>
      </template>
    </template>
  </a-menu>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs, watch } from "vue";
import { useRouter } from "vue-router";
import  store from "@/store";
export default defineComponent({
  setup() {
    const state = reactive({
      routerList: [] as any,
      selectedKeys: [] as any,
    });
    const router = useRouter();
    watch(
      () => router.currentRoute.value,
      (newRouterName) => {
        state.selectedKeys = [newRouterName.path]
      },
      {immediate: true}
    );
    const getRouterList = async () => {
      const userInfo = JSON.parse(localStorage.getItem('info') || '')
      const accessRouter = await store.dispatch('generateRoutes', [userInfo.position])
      state.routerList =
        accessRouter.find((e: any) => e.path === "/index")?.children || [];
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