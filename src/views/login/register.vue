<template>
  <div class="register-container">
    <!-- 表单 -->
    <div class="title">用户注册</div>
    <a-form class="register-form" :model="formState" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }" autocomplete="off">
      <a-form-item label="用户名" name="username" :rules="[{ required: true, message: '请输入用户名!' }]">
        <a-input v-model:value="formState.username" />
      </a-form-item>
      <a-form-item label="密码" name="password" :rules="[{ required: true, message: '请输入密码!' }]">
        <a-input-password v-model:value="formState.password" />
      </a-form-item>
      <a-form-item label="身份证号" name="identity" :rules="[{ required: true, message: '请输入身份证号!' }]">
        <a-input v-model:value="formState.identity" />
      </a-form-item>
      <a-form-item label="手机号" name="phone" :rules="[{ required: true, message: '请输入手机号!' }]">
        <a-input v-model:value="formState.phone" />
      </a-form-item>
      <a-form-item label="邮箱" name="email" :rules="[{ required: true, message: '请输入邮箱!' }]">
        <a-input v-model:value="formState.email" />
      </a-form-item>
      <a-form-item label="院系" name="faculties" :rules="[{ required: true, message: '请输入院系!' }]">
        <a-input v-model:value="formState.faculties" />
      </a-form-item>
      <a-form-item label="专业" name="specialty" :rules="[{ required: true, message: '请输入专业!' }]">
        <a-input v-model:value="formState.specialty" />
      </a-form-item>
      <!-- <a-form-item label="状态" name="status" :rules="[{ required: true, message: '请输入用户名!' }]">
        <a-input v-model:value="formState.status" />
      </a-form-item> -->
      <a-form-item :wrapper-col="{ offset: 2, span: 20 }">
        <a-button class="form-button" @click="resetForm">取消</a-button>
        <a-button class="form-button" type="primary" @click="onFinish">提交</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive } from 'vue';
interface FormState {
  username: string;
  password: string;
  identity: string;
  phone: string;
  email: string;
  faculties: string;
  specialty: string;
}
export default defineComponent({
  setup() {

    const formState = reactive<FormState>({
      username: '',
      password: '',
      identity: '',
      phone: '',
      email: '',
      faculties: '',
      specialty: '',
    })
    // 提交注册表单
    const onFinish = () => {
      console.log(formState);
      
    }
    const resetForm = ()=> {

    }
    return {
      formState,
      onFinish,
      resetForm
    }
  }
})
</script>
<style lang="scss" scoped>
.register-container {
  width: 1200px;
  margin: 0 auto;
  border-radius: 4px;
  background-color: #fff;
  .title {
    padding: 40px 0;
    line-height: 40px;
    font-size: 32px;
  }
  .register-form {
    padding: 24px;
    .form-button {
      width: 80px;
      margin: 0 10px;
    }
  }

}
</style>