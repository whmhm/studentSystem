<template>
  <div class="carousel">
    <!-- 轮播图 -->
    <a-carousel autoplay arrows>
      <template #prevArrow>
        <div class="custom-slick-arrow" style="left: 10px; z-index: 1">
          <left-circle-outlined />
        </div>
      </template>
      <template #nextArrow>
        <div class="custom-slick-arrow" style="right: 10px">
          <right-circle-outlined />
        </div>
      </template>
      <div class="carousel-panel" v-for="image in srcList" :key="image.id">
        <img class="carousel-image" :src="baseURL+image.url">
      </div>
    </a-carousel>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons-vue'
import { baseURL } from '@/contents/utils'
export default defineComponent({
  name: 'carousel',
  components: {
    LeftCircleOutlined,
    RightCircleOutlined
  },
  props: {
    srcList: Array,
    default() {
      return []
    }
  },
  setup() {
    return {
      baseURL
    }
  },
  mounted() {
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.ant-carousel :deep(.slick-slide) {
  text-align: center;
  height: 400px;
  line-height: 400px;
  background: #364d79;
  overflow: hidden;
}
.ant-carousel :deep(.slick-arrow.custom-slick-arrow) {
  width: 25px;
  height: 25px;
  font-size: 25px;
  color: #fff;
  background-color: rgba(31, 45, 61, 0.11);
  opacity: 0.3;
  z-index: 1;
}
.ant-carousel :deep(.custom-slick-arrow:before) {
  display: none;
}
.ant-carousel :deep(.custom-slick-arrow:hover) {
  opacity: 0.5;
}
.carousel-panel {
  width: 100%;
  .carousel-image {
    width: 100%;
    height: 400px;
  }
}

</style>
