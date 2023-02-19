<template>
  <div class="title">个人信息</div>
  <a-form ref="personForm" :model="formState" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" autocomplete="off">

    <a-form-item label="头像" name="avatar">
      <vUpload :url="avatar" :accept-type="acceptType" avatar="avatar" @success="handleSuccess"></vUpload>
    </a-form-item>
    <a-form-item label="教育Id" name="sno" :rules="[{ required: true, message: '请填写教育Id' }]">
      <a-input v-model:value="formState.sno" disabled />
    </a-form-item>

    <a-form-item label="用户名" name="username" :rules="[{ required: true, message: '请输入用户名' }]">
      <a-input v-model:value="formState.username" :disabled="edit" />
    </a-form-item>

    <a-form-item label="密码" name="password" :rules="[{ required: true, message: '请输入密码' }]">
      <a-input-password v-model:value="formState.password" :disabled="edit" />
    </a-form-item>

    <a-form-item label="手机号" name="phone" :rules="[{ required: true, message: '请输入手机号' }]">
      <a-input v-model:value="formState.phone" :disabled="edit" />
    </a-form-item>

    <a-form-item label="邮箱" name="email" :rules="[{ type: 'email', message: '请输入格式正确的邮箱',  }]">
      <a-input v-model:value="formState.email" :disabled="edit" />
    </a-form-item>

    <a-form-item label="角色" name="position" :rules="[{ required: true, message: '请选择角色', trigger: 'blur'}]">
      <a-select ref="select" v-model:value="formState.position"  disabled>
        <a-select-option v-for="role in POSITION" :key="role.code" :value="role.code">{{ role.label }}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="院系" name="departmentId" :rules="[{ required: true, message: '请选择院系', trigger: 'blur' }]" v-if="['INSTRUCTOR','STUDENT'].includes(formState.position)">
      <a-select ref="select" v-model:value="formState.departmentId"  @change="handleChange" :disabled="edit">
        <a-select-option v-for="departMent in departments" :key="departMent.id" :value="departMent.id">{{ `${departMent.deptName}${departMent.className}` }}</a-select-option>
      </a-select>
    </a-form-item>
    <!-- 学生才需要选择辅导员 -->
    <a-form-item label="辅导员" name="instructorId" :rules="[{ required: true, message: '请选择辅导员', trigger: 'blur' }]" v-if="['STUDENT'].includes(formState.position)">
      <a-select ref="select" v-model:value="formState.instructorId"  :disabled="edit">
        <a-select-option v-for="instructor in instructors" :key="instructor.id" :value="instructor.id">{{ `${instructor.deptName}${instructor.className}` }}</a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
      <a-button class="btn" @click="handleEdit">编辑</a-button>
      <a-button class="btn" type="primary" @click="handleSave" v-show="!edit">保存</a-button>
    </a-form-item>
  </a-form>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs, computed } from 'vue';
import { POSITION } from '@/contents/utils';
import { Form } from 'ant-design-vue';
import { toArray } from 'lodash';
import {
  departmentList,
  findInstructor,
  updateUserInfo,
} from '@/service/service';
import vUpload from '@/components/upload.vue';
interface FormState {
  avatar: string; // 头像
  departmentId: number | null; // 院系
  email: string; // 邮箱
  instructorId: number | null; // 辅导员
  password: string; // 密码
  phone: string; // 手机号
  position: string; // 角色
  sno: string; // 学号
  username: string; // 用户名
}
export default defineComponent({
  components: {
    vUpload,
  },
  setup() {
    const edit = ref<boolean>(true);
    const fileList = ref([]);
    const loading = ref<boolean>(false);
    const formState = reactive<FormState>({
      avatar: '',
      departmentId: null,
      email: '',
      instructorId: null,
      password: '',
      phone: '',
      position: '',
      sno: '',
      username: '',
    });
    const state = reactive({
      avatar: '',
      departments: [],
      instructors: [],
    });
    const acceptType: string = 'image/jpeg';
    const rulesRef = reactive({
      email: [{ required: true, message: '请输入邮箱' }],
      password: [{ required: true, message: '请输入密码' }],
      username: [{ required: true, message: '请输入用户名' }],
      phone: [{ required: true, message: '请输入手机号' }],
    });
    const personForm = Form.useForm;
    const { validate, validateInfos, mergeValidateInfo } = personForm(
      formState,
      rulesRef
    );
    const handleSave = () => {
      validate()
        .then(() => {
          updateUserInfo(formState).then(({ data }) => {
            localStorage.setItem('info', JSON.stringify(data));
            init();
            edit.value = true;
          });
        })
        .catch((err: any) => {
          console.error('error', err);
        });
    };

    const handleEdit = () => {
      edit.value = false;
    };
    // 切换选项 根据所选院
    const handleChange = (info: any) => {
      const params = {
        id: Number(formState.departmentId),
      };
      findInstructor(params).then(({ data }) => {
        state.instructors = data;
      });
    };
    const getDepartmentList = () => {
      departmentList().then(({ data }) => {
        state.departments = data;
      });
    };
    const handleSuccess = (val: any) => {
      state.avatar = val;
      formState.avatar = val;
    };
    // 表单报错信息
    const errorInfos = computed(() => {
      return mergeValidateInfo(toArray(validateInfos));
    });
    const init = () => {
      const userInfo = JSON.parse(localStorage.getItem('info') || '');
      Object.assign(formState, userInfo);
      state.avatar = formState.avatar;
      getDepartmentList();
    };
    onMounted(() => {
      init();
    });

    return {
      POSITION,
      edit,
      fileList,
      loading,
      formState,
      acceptType,
      ...toRefs(state),
      handleEdit,
      handleSave,
      handleChange,
      handleSuccess,
      errorInfos,
    };
  },
});
</script>

<style lang="scss" scoped>
.title {
  padding: 32px 0;
  font-size: 32px;
  line-height: 48px;
  text-align: center;
  color: #262626;
}
.btn {
  width: 130px;
  margin-right: 20px;
}
:deep(.ant-form-item-control-input-content) {
  text-align: left;
}
</style>