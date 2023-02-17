<template>
  <div class="home">
    <carousel :src-list="srcList" />
    <div class="home-info">
      <a-card class="info-card" title="校园资讯">
        <div class="card-body">
          <p class="news-items" v-for="news in newsList" :key="news.id" @click="handleView(news)">
            <span>{{ news.noticeTitle}}</span>
            <span class="read-count">阅读次数：{{ news.heat}}</span>
          </p>
        </div>
      </a-card>
      <a-card class="info-card" title="系统公告">
        <div class="card-body">
          <p class="news-items" v-for="notice in noticeList" :key="notice.id" @click="handleView(notice)">
            <span>{{ notice.noticeTitle}}</span>
            <span class="read-count">阅读次数：{{ notice.heat}}</span>
          </p>
        </div>
      </a-card>
    </div>
    <!-- 查看 -->
    <a-modal class="details" v-model:visible="visible" mask :footer="null" :title="`${rowDetails.noticeType===1 ? '资讯' : '公告'}详情`">
      <p class="details-title">
        {{ rowDetails.noticeTitle }}
      </p>
      <div>{{ rowDetails.noticeContent }}</div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';
import carousel from '@/components/carousel.vue';
import { getCarousel, getNews, addHeat } from '@/service/service';
export default defineComponent({
  name: 'HomeView',
  components: {
    carousel,
  },
  setup() {
    interface details {
      id: number;
      noticeTitle: string;
      noticeType: string;
      noticeContent: string;
      status: number;
    }
    const dataList = reactive({
      visible: false,
      srcList: [],
      newsList: [],
      noticeList: [],
      rowDetails: {},
    });
    // 获取轮播图
    const getSrcList = (): void => {
      getCarousel().then((res) => {
        dataList.srcList = res.data;
      });
    };
    // 获取资讯 ，公告
    const getNewsList = () => {
      getNews().then(({ data }) => {
        dataList.newsList = data[1];
        dataList.noticeList = data[2];
      });
    };
    // 查看详情
    const handleView = (row: details) => {
      dataList.rowDetails = row;
      const params = {
        id: row.id,
      };
      // 增加访问次数
      addHeat(params).then((_) => {});
      dataList.visible = true;
    };
    // 关闭详情弹窗
    const handleConfirm = () => {
      dataList.visible = false;
    };
    const init = () => {
      getNewsList();
      getSrcList();
    };
    return {
      init,
      handleView,
      handleConfirm,
      ...toRefs(dataList),
    };
  },
  mounted() {
    this.init();
  },
});
</script>
<style lang="scss" scoped>
.home-info {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  .info-card {
    width: 500px;
    height: 380px;
    .card-body {
      height: 260px;
      overflow: auto;
      padding-right: 20px;
    }
    .news-items {
      display: flex;
      justify-content: space-between;
      font-size: 16px;
    }
  }
  .read-count {
    font-size: 12px;
    color: #595959;
  }
}
.details {
  .details-title {
    font-size: 18px;
    color: #262626;
  }
}
</style>
