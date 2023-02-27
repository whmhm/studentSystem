<template>
  <sysHeader></sysHeader>
  <div class="system-container">
    <router-view />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import sysHeader from '@/components/menu/sysHeader.vue';
export default defineComponent({
  name: 'frontEnd',
  components: {
    sysHeader,
  },
});
</script>
<style lang="scss">
.system-container {
  width: 1200px;
  margin: 0 auto;
}
nav {
  padding: 30px;
}
</style>
