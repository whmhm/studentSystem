<template>
  <div class="login-container">
    <!-- 系统标题 -->
    <div class="title">学生综合测评</div>
    <!-- 用户登录 -->
    <div class="login-panel">
      <p class="panel-title">用户登录</p>
      <a-form :model="formState" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }" autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed">
        <a-form-item label="用户名" name="sno" :rules="[{ required: true, message: '请输入用户名!' }]">
          <a-input v-model:value="formState.sno" />
        </a-form-item>

        <a-form-item label="密码" name="password" :rules="[{ required: true, message: '请输入密码!' }]">
          <a-input-password v-model:value="formState.password" />
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 2, span: 20 }">
          <a-button class="submit-btn" type="primary" html-type="submit">登录</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { login, getUserInfo } from '@/service/service';
interface FormState {
  sno: string;
  password: string;
}
interface userInfo {
  sno: string
}
// remember: boolean;
export default defineComponent({
  setup() {
    // 路由
    const router = useRouter();
    // 用户登录表单
    const formState = reactive<FormState>({
      sno: '',
      password: '',
    });
    // 提交表单
    const onFinish = (value: FormState): void => {
      login(value).then((res: any) => {
        if (res.code === 200) {
          localStorage.setItem('system_token', res.data);
          router.push('/index');
          getUser({sno: formState.sno})

        } else {
          message.warning(res.msg);
        }
      });
    };
    // 获取个人信息
    const getUser = (value: userInfo):void => {
      getUserInfo(value).then((res: any) => {
        localStorage.setItem('info', JSON.stringify(res.data));
      })
    }
    return {
      formState,
      onFinish,
    };
  },
});
</script>
<style lang="scss" scoped>
.login-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 100vh;
  background-color: #2c3e50;
  .title {
    width: 500px;
    height: 300px;
    color: #fff;
    font-size: 64px;
    font-weight: 600;
    letter-spacing: 10px;
  }
  :deep(.ant-input) {
    height: 32px;
  }
  .login-panel {
    width: 400px;
    height: 360px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.5);
    padding: 16px;
    .panel-title {
      height: 32px;
      font-size: 24px;
    }
    .submit-btn {
      width: 100%;
    }
  }
}
</style>