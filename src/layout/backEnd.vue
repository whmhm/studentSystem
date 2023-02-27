<template>
  <sysHeader></sysHeader>
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
import sysHeader from '@/components/menu/sysHeader.vue';
import vAside from '@/components/menu/aside.vue';
export default defineComponent({
  name: 'backEnd',
  components: {
    sysHeader,
    vAside,
  },
});
</script>
<style lang="scss">
.backend-container {
  width: 90%;
  margin-left: 50px;
  margin-top: 20px;
}
</style>
