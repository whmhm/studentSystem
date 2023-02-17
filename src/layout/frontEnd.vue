<template>
  <v-header></v-header>
  <div class="system-container">
    <router-view />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import vHeader from '@/components/menu/header.vue';
export default defineComponent({
  name: 'frontEnd',
  components: {
    vHeader,
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
