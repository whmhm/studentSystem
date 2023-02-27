<template>
  <div class="welcome">
    <span class="text">{{ person }}</span>
    欢迎登录，今天是
    <span class="text">{{ data }}</span>
    <div class="content">
      <p class="title">系统使用说明：</p>
      <div>1、学生综合测评成绩分为学科成绩、综合素质</div>
      <div>2、其中学科成绩占综合测评成绩的百分六十、综合素质占百分四十</div>
      <div>3、综合成绩按照学期汇总，大学期间一共汇总八次</div>
      <div>4、综合成绩汇总内容为本学期通过审批的助人为乐，违规违纪，班干部任职，奖学金，出版、发表论文，专利，表彰荣誉，竞赛的相关申请</div>
      <div>5、综合成绩按照每一项通过申请给10分（违规违纪扣十分）进行赋分</div>
      <div>6、汇算成绩前，未通过的申请需要及时联系辅导员进行审批。以免影响总成绩计算</div>
      <div>7、综合测评成绩 = 学科成绩（*60%）+ 综合素质【助人为乐，违规违纪，班干部任职，奖学金，出版、发表论文，专利，表彰荣誉，竞赛】（*40）</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from "vue";
import store from "@/store/index";
export default defineComponent({
  setup() {
    const state = reactive({
      person: "",
      data: "",
    });
    const userInfo = store.getters.userInfo
    const init = () => {
      const currentDate = new Date();
      state.data = `${currentDate.getFullYear()}年${
        currentDate.getMonth() + 1
      }月${currentDate.getDate()}日`;
      state.person = userInfo.username
    };
    onMounted(() => {
      init()
    })
    return {
      ...toRefs(state),
    };
  },
});
</script>

<style lang="scss">
.welcome {
  font-size: 18px;
  line-height: 32px;
  color: #333;
  .text {
    color: #262626;
  }
  .content {
    background: #fff;
    border-radius: 4px;
    padding: 16px;
    margin-top: 160px;
    text-align: left;
    .title {
      font-size: 18px;
    }
    div {
      font-size: 16px;
      color: #262626;
      line-height: 40px;
    }
  }
}
</style>