<template>
  <v-header></v-header>
  <a-row type="flex" justify="center" align="top">
    <a-col :span="4">
      <v-aside></v-aside>
    </a-col>
    <a-col :span="20">
      <div class="backend-container">
        <router-view />
      </div>
    </a-col>
  </a-row>

</template>
<script lang="ts">
import { defineComponent } from 'vue';
import vHeader from '@/components/menu/header.vue';
import vAside from '@/components/menu/aside.vue';
export default defineComponent({
  name: 'backEnd',
  components: {
    vHeader,
    vAside,
  },
});
</script>
<style lang="scss">
.backend-container {
  width: calc(100% - 240px);
  margin: 0 auto;
}
</style>
