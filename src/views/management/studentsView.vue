<template>
  <!-- 学生管理页面 -->
  <div>
    <div class="notice-operation">
      <a-button type="primary" @click="add">新增</a-button>
    </div>
    <a-table class="table" :columns="columns" :data-source="studentList" bordered :pagination="pagination">
      <template #bodyCell="{ column, text, record }">
        <template v-if="['id', 'name'].includes(column.dataIndex)">
          <div>
            {{ text }}
          </div>
        </template>
        <template v-else-if="column.dataIndex === 'operation'">
          <div class="editable-row-operations">
            <span class="operations-btn">
              <a @click="edit(record)">修改</a>
            </span>
            <span class="operations-btn">
              <a @click="modifyPwd(record)">重置密码</a>
            </span>
            <span>
              <a @click="remove(record.id)">移除</a>
            </span>
          </div>
        </template>
      </template>
    </a-table>
    <!-- 新增、编辑 -->
    <a-modal v-model:visible="visible" title="学生信息" :footer="false">
      <a-form ref="personForm" :model="formState" :rules="rulesRef" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" autocomplete="off">
        <a-form-item label="头像" name="avatar">
          <vUpload :url="formState.avatar" :accept-type="acceptType" avatar="avatar" @success="handleSuccess"></vUpload>
        </a-form-item>
        <a-form-item label="学号" name="sno">
          <a-input v-model:value="formState.sno" />
        </a-form-item>

        <a-form-item label="用户名" name="username">
          <a-input v-model:value="formState.username" />
        </a-form-item>

        <a-form-item label="密码" name="password" v-if="!modify">
          <a-input-password placeholder="初始密码为111111" disabled />
        </a-form-item>

        <a-form-item label="手机号" name="phone">
          <a-input v-model:value="formState.phone" />
        </a-form-item>

        <a-form-item label="邮箱" name="email">
          <a-input v-model:value="formState.email" />
        </a-form-item>

        <a-form-item label="院系" name="departmentId">
          <a-select ref="select" v-model:value="formState.departmentId" @change="handleChange">
            <a-select-option v-for="departMent in departments" :key="departMent.id" :value="departMent.id">{{
                `${departMent.deptName}${departMent.className}`
              }}</a-select-option>
          </a-select>
        </a-form-item>
        <!-- 学生才需要选择辅导员 -->
        <a-form-item label="辅导员" name="instructorId">
          <a-select ref="select" v-model:value="formState.instructorId">
            <a-select-option v-for="instructor in instructors" :key="instructor.id" :value="instructor.id">{{ `${instructor.username}` }}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
          <a-button class="btn" @click="handleCancel">取消</a-button>
          <a-button class="btn" type="primary" @click="handleSubmit">保存</a-button>
        </a-form-item>
      </a-form>
    </a-modal>
    <!-- 修改密码 -->
    <a-modal title="修改密码" v-model:visible="modifyPassword" width="600px">
      <a-input-password v-model:value="password" />
      <span>默认密码：111111，如需修改请重置密码</span>
      <template v-slot:footer>
        <a-button class="btn" @click="handleCancelModify">取消</a-button>
        <a-button class="btn" type="primary" @click="handleSavePwd">确定</a-button>
      </template>
    </a-modal>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, toRaw } from 'vue';
import {
  departmentList,
  findInstructor,
  selectUser,
  deleteUser,
  addUser,
  modifyUser,
  updateUserInfo,
} from '@/service/service';
import { Modal, Form, message } from 'ant-design-vue';
import vUpload from '@/components/upload.vue';
import { cloneDeep } from 'lodash';
export default defineComponent({
  name: 'studentsView',
  components: {
    vUpload,
  },
  setup() {
    interface FormData {
      avatar: string;
      departmentId: number;
      email: string;
      id: number;
      instructorId: number;
      phone: string;
      position: string;
      sno: string;
      username: string;
    }
    const dataList = reactive({
      acceptType: 'image/jpeg',
      columns: [
        {
          title: '学号',
          dataIndex: 'sno',
          width: '10%',
        },
        {
          title: '姓名',
          dataIndex: 'username',
          width: '10%',
        },
        {
          title: '邮箱',
          dataIndex: 'email',
          width: '10%',
        },
        {
          title: '学院',
          dataIndex: 'department',
          width: '12%',
        },
        {
          title: '班级',
          dataIndex: 'className',
          width: '12%',
        },
        {
          title: '辅导员',
          dataIndex: 'instructor',
          width: '12%',
        },
        {
          title: '手机号',
          dataIndex: 'phone',
          width: '10%',
        },
        {
          title: '操作',
          dataIndex: 'operation',
        },
      ],
      formState: {
        avatar: '',
        departmentId: null,
        email: '',
        id: 0,
        instructorId: null,
        phone: '',
        positions: 'STUDENT',
        sno: '',
        username: '',
      },
      userId: '',
      modifyPassword: false,
      password: '111111',
      studentList: [],
      departments: [], // 院系下拉列表
      instructors: [], // 辅导员列表
      pagination: {
        total: 0,
        current: 1,
        offset: 0,
        limit: 10,
        defaultPageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: [10, 15, 20, 25],
        showTotal: (total: any) => `共${total}条`,
        onShowSizeChange: function (page: any, pageSize: any) {
          dataList.pagination.defaultPageSize = pageSize;
          getStudentList();
        },
        onChange: function (current: any, size: any) {
          dataList.pagination.current = current;
          dataList.pagination.offset =
            (current - 1) * dataList.pagination.defaultPageSize;
          dataList.pagination.limit =
            current * dataList.pagination.defaultPageSize;
          getStudentList();
        },
      },
      visible: false,
      modify: false,
    });
    // 校验手机号方法
    const validatePhone = async (rule: any, value: any) => {
      if (!value) {
        return Promise.reject('请输入手机号');
      }
      const reg =
        /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      // 查是否输入的是手机号 11位数字
      if (reg.test(value)) {
        return Promise.resolve();
      } else {
        return Promise.reject('请输入有效的手机号');
      }
    };
    const rulesRef = reactive({
      departmentId: [
        { required: true, message: '请选择院系', trigger: 'change' },
      ],
      instructorId: [
        { required: true, message: '请选择辅导员', trigger: 'change' },
      ],
      email: [
        {
          required: true,
          type: 'email',
          message: '请输入格式正确的邮箱',
          trigger: 'blur',
        },
      ],
      phone: [{ required: true, validator: validatePhone, trigger: 'blur' }],
      sno: [{ required: true, message: '请输入学号', trigger: 'blur' }],
      username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    });
    const useForm = Form.useForm;
    const { resetFields, validate } = useForm(dataList.formState, rulesRef);
    // 获取院系列表
    const getDepartmentList = () => {
      departmentList().then(({ data }) => {
        dataList.departments = data;
      });
    };
    // 切换选项 根据所选院
    const handleChange = () => {
      const params = {
        id: dataList.formState.departmentId || 0,
      };
      findInstructor(params).then(({ data }) => {
        dataList.instructors = data;
      });
    };
    const getStudentList = () => {
      const info = JSON.parse(sessionStorage.getItem('info') || '{}');
      const params = {
        sno: info.sno,
        positions: 'STUDENT',
        start: dataList.pagination.offset,
        limit: dataList.pagination.limit,
      };
      selectUser(params).then(({ data }) => {
        dataList.studentList = data.result;
        dataList.pagination.total = data.total;
      });
    };
    // 移除
    const remove = (id: number) => {
      Modal.confirm({
        title: '提示',
        content: '确定要移除该用户吗?',
        okText: '确定',
        cancelText: '取消',
        onOk() {
          const params = {
            id,
          };
          deleteUser(params)
            .then((res) => {
              message.success('移除成功');
              getStudentList();
            })
            .catch((err) => {
              message.error(err);
            });
        },
        onCancel() {},
      });
    };
    // 编辑
    const edit = (rowData: FormData) => {
      dataList.modify = true;
      Object.assign(dataList.formState, rowData);
      dataList.visible = true;
    };
    // 新增院系班级
    const add = () => {
      handleCancel();
      dataList.modify = false;
      dataList.visible = true;
    };
    // 提交
    const handleSubmit = async () => {
      validate()
        .then(() => {
          if (dataList.modify) {
            // 修改学生信息
            modifyUser(dataList.formState).then(({ msg }) => {
              message.success(msg);
              getStudentList();
              dataList.visible = false;
            });
          } else {
            const data = {
              ...cloneDeep(dataList.formState),
              password: '111111',
            };
            //  新增教师
            addUser(toRaw(data))
              .then(({ code }) => {
                message.success('新增成功');
                getStudentList();
                dataList.visible = false;
              })
              .catch((err) => {
                message.error(err);
              });
          }
        })
        .catch((err) => {
          console.error('error', err);
        });
    };
    // 取消
    const handleCancel = () => {
      dataList.visible = false;
      dataList.formState.id = 0;
      dataList.formState.departmentId = null;
      dataList.formState.instructorId = null;
      dataList.formState.avatar = '';
      dataList.formState.email = '';
      dataList.formState.phone = '';
      dataList.formState.username = '';
      resetFields();
    };
    const handleSuccess = (val: any) => {
      dataList.formState.avatar = val;
    };
    const modifyPwd = (record: any) => {
      dataList.userId = record.id;
      dataList.modifyPassword = true;
    };
    const handleCancelModify = () => {
      dataList.userId = '';
      dataList.modifyPassword = false;
    };
    const handleSavePwd = () => {
      const data = {
        id: dataList.userId,
        password: dataList.password,
      };
      updateUserInfo(data).then(({ data }) => {
        message.success('重置密码成功，请通知相关人员');
        dataList.modifyPassword = false;
      });
    };
    const init = () => {
      getStudentList();
      getDepartmentList();
    };

    return {
      init,
      ...toRefs(dataList),
      rulesRef,
      edit,
      remove,
      add,
      modifyPwd,
      handleCancelModify,
      handleSavePwd,
      handleSubmit,
      handleCancel,
      handleChange,
      handleSuccess,
    };
  },
  mounted() {
    this.init();
  },
});
</script>

<style lang="scss" scoped>
.table {
  height: 600px;
}
:deep(.ant-table-cell) {
  padding: 8px;
  height: 50px;
}
.btn {
  width: 120px;
  margin-right: 10px;
}
.operations-btn {
  margin-right: 8px;
}
.notice-operation {
  padding: 16px 0;
  text-align: right;
}
</style>