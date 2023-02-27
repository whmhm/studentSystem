<template>
  <div class="title">个人信息</div>
  <a-form ref="personForm" :model="formState" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" autocomplete="off">

    <a-form-item label="头像" name="avatar">
      <vUpload :url="avatar" :accept-type="acceptType" avatar="avatar" @success="handleSuccess" :disabled="edit"></vUpload>
    </a-form-item>
    <a-form-item label="教育Id" name="sno" :rules="[{ required: true, message: '请填写教育Id' }]">
      <a-input v-model:value="formState.sno" disabled />
    </a-form-item>

    <a-form-item label="用户名" name="username" :rules="[{ required: true, message: '请输入用户名' }]">
      <a-input v-model:value="formState.username" :disabled="edit" />
    </a-form-item>

    <a-form-item label="手机号" name="phone" :rules="[{ required: true, message: '请输入手机号' }]">
      <a-input v-model:value="formState.phone" :disabled="edit" />
    </a-form-item>

    <a-form-item label="邮箱" name="email" :rules="[{ type: 'email', message: '请输入格式正确的邮箱',  }]">
      <a-input v-model:value="formState.email" :disabled="edit" />
    </a-form-item>

    <a-form-item label="角色" name="position" :rules="[{ required: true, message: '请选择角色', trigger: 'blur'}]">
      <a-select ref="select" v-model:value="formState.positions" disabled>
        <a-select-option v-for="role in POSITION" :key="role.code" :value="role.code">{{ role.label }}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="院系" name="departmentId" :rules="[{ required: true, message: '请选择院系', trigger: 'blur' }]" v-if="['INSTRUCTOR','STUDENT'].includes(formState.positions)">
      <a-select ref="select" v-model:value="formState.departmentId" @change="handleChange" :disabled="edit">
        <a-select-option v-for="departMent in departments" :key="departMent.id" :value="departMent.id">{{ `${departMent.deptName}${departMent.className}` }}</a-select-option>
      </a-select>
    </a-form-item>
    <!-- 学生才需要选择辅导员 -->
    <a-form-item label="辅导员" name="instructorId" :rules="[{ required: true, message: '请选择辅导员', trigger: 'blur' }]" v-if="['STUDENT'].includes(formState.positions)">
      <a-select ref="select" v-model:value="formState.instructorId" :disabled="edit">
        <a-select-option v-for="instructor in instructors" :key="instructor.id" :value="instructor.id">{{ `${instructor.deptName}${instructor.className}` }}</a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
      <a-button class="btn" @click="handleEdit" v-show="edit">编辑</a-button>
      <a-button class="btn" @click="modifyPassword">修改密码</a-button>
      <a-button class="btn" type="primary" @click="handleSave" v-show="!edit">保存</a-button>
    </a-form-item>
  </a-form>
  <!-- 修改密码 -->
  <a-modal title="修改密码" v-model:visible="modifyPwd" width="600px">
    <a-input-password v-model:value="password" />
    <span>默认密码：111111，如需修改请重置密码</span>
    <template v-slot:footer>
      <a-button class="btn" @click="handleCancel">取消</a-button>
      <a-button class="btn" type="primary" @click="handleSavePwd">确定</a-button>
    </template>
  </a-modal>
</template>
<script lang="ts">
import {
  defineComponent,
  onMounted,
  reactive,
  ref,
  toRefs,
  computed,
} from 'vue';
import { POSITION } from '@/contents/utils';
import store from '@/store/index';
import { Modal, Form } from 'ant-design-vue';
import { useRouter } from "vue-router";
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
    const router = useRouter();
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
      modifyPwd: false,
      password: '111111',
      departments: [],
      instructors: [],
    });
    const acceptType: string = 'image/jpeg';
    const rulesRef = reactive({
      email: [{ required: true, message: '请输入邮箱' }],
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
            sessionStorage.setItem('info', JSON.stringify(data));
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
    const modifyPassword = () => {
      state.modifyPwd = true;
    };
    const handleSavePwd = () => {
      const userInfo = store.getters.userInfo;
      const data = {
        id: userInfo.id,
        password: state.password,
      };
      updateUserInfo(data).then(({ data }) => {
        Modal.confirm({
          title: '提示',
          content: '修改密码成功请重新登录',
          okText: '确定',
          onOk() {
            sessionStorage.removeItem('info');
            sessionStorage.removeItem('system_token');
            store.commit('DEL_INFO');
            router.go(0);
          },
        });
      });
    };
    const handleCancel = () => {
      state.modifyPwd = false;
      state.password = '111111';
    };
    // 表单报错信息
    const errorInfos = computed(() => {
      return mergeValidateInfo(toArray(validateInfos));
    });
    const init = () => {
      const userInfo = store.getters.userInfo;
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
      handleCancel,
      handleSavePwd,
      modifyPassword,
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