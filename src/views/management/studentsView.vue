<template>
  <!-- 学生管理页面 -->
  <div>
    <div class="notice-operation">
      <a-button type="primary" @click="add">新增</a-button>
    </div>
    <a-table :columns="columns" :data-source="studentList" bordered :pagination="pagination">
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
            <span>
              <a @click="remove(record.id)">移除</a>
            </span>
          </div>
        </template>
      </template>
    </a-table>
    <!-- 新增、编辑 -->
    <a-modal v-model:visible="visible" title="学生信息" :footer="false">
      <a-form ref="personForm" :model="formState" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" autocomplete="off">
        <a-form-item label="头像" name="avatar">
          <vUpload :url="avatar" :accept-type="acceptType" :avatar="true" @success="handleSuccess"></vUpload>
        </a-form-item>
        <a-form-item label="教育Id" name="sno" :rules="[{ required: true, message: '请填写教育Id' }]">
          <a-input v-model:value="formState.sno" />
        </a-form-item>

        <a-form-item label="用户名" name="username" :rules="[{ required: true, message: '请输入用户名' }]">
          <a-input v-model:value="formState.username" />
        </a-form-item>

        <a-form-item label="密码" name="password" :rules="[{ required: true, message: '请输入密码' }]">
          <a-input-password v-model:value="formState.password" />
        </a-form-item>

        <a-form-item label="手机号" name="phone" :rules="[{ required: true, message: '请输入手机号' }]">
          <a-input v-model:value="formState.phone" />
        </a-form-item>

        <a-form-item label="邮箱" name="email" :rules="[{ type: 'email', message: '请输入格式正确的邮箱',  }]">
          <a-input v-model:value="formState.email" />
        </a-form-item>

        <a-form-item label="院系" name="departmentId" :rules="[{ required: true, message: '请选择院系', trigger: 'blur' }]">
          <a-select ref="select" v-model:value="formState.departmentId" @focus="focus" @change="handleChange">
            <a-select-option v-for="departMent in departments" :key="departMent.id" :value="departMent.id">{{ `${departMent.deptName}${departMent.className}` }}</a-select-option>
          </a-select>
        </a-form-item>
        <!-- 学生才需要选择辅导员 -->
        <a-form-item label="辅导员" name="instructorId" :rules="[{ required: true, message: '请选择辅导员', trigger: 'blur' }]">
          <a-select ref="select" v-model:value="formState.instructorId" @focus="focus">
            <a-select-option v-for="instructor in instructors" :key="instructor.id" :value="instructor.id">{{ `${instructor.deptName}${instructor.className}` }}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
          <a-button class="btn" @click="handleCancel">取消</a-button>
          <a-button class="btn" type="primary" @click="handleSave">保存</a-button>
        </a-form-item>
      </a-form>

    </a-modal>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, toRefs, toRaw, computed } from 'vue';
import { departmentList, findInstructor } from '@/service/service';
import { Modal, Form, message } from 'ant-design-vue';
import { toArray } from 'lodash';
import vUpload from '@/components/upload.vue';
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
      password: string;
      phone: string;
      position: string;
      sno: string;
      username: string;
    }
    const dataList = reactive({
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
          title: '手机号',
          dataIndex: 'phone',
          width: '30%',
        },
        {
          title: '操作',
          dataIndex: 'operation',
        },
      ],
      formState: {
        avatar: '',
        departmentId: 0,
        email: '',
        id: 0,
        instructorId: 0,
        password: '',
        phone: '',
        position: '',
        sno: '',
        username: '',
      },
      collageList: [],
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
    });
    const formState = reactive({
      id: 0,
      deptName: '',
      className: '',
    });
    const modify = ref<boolean>(false);
    const rulesRef = reactive({
      name: [{ required: true, message: '请输入院系名称' }],
    });
    const useForm = Form.useForm;
    const { resetFields, validate, validateInfos, mergeValidateInfo } = useForm(
      formState,
      rulesRef
    );
    // 获取院系列表
    const getDepartmentList = () => {
      departmentList().then(({ data }) => {
        dataList.departments = data;
      });
    };
    // 切换选项 根据所选院
    const handleChange = () => {
      const params = {
        id: dataList.formState.departmentId,
      };
      findInstructor(params).then(({ data }) => {
        dataList.instructors = data;
      });
    };
    const getStudentList = () => {
      const params = {
        start: dataList.pagination.offset,
        limit: dataList.pagination.limit,
      };
    };
    // 移除
    const remove = (id: number) => {
      Modal.confirm({
        title: '提示',
        content: '确定要移除该学生吗?',
        okText: '确定',
        cancelText: '取消',
        onOk() {},
        onCancel() {},
      });
    };
    // 编辑
    const edit = (rowData: FormData) => {
      modify.value = true;
      dataList.visible = true;
    };
    // 新增院系班级
    const add = () => {
      modify.value = false;
      dataList.visible = true;
    };
    // 提交
    const handleSave = async () => {
      validate()
        .then(() => {
          if (modify.value) {
            // 修改学生信息
          } else {
            //  新增学生
          }
        })
        .catch((err) => {
          console.log('error', err);
        });
    };
    // 取消
    const handleCancel = () => {
      dataList.visible = false;
      resetFields();
    };
    const errorInfos = computed(() => {
      return mergeValidateInfo(toArray(validateInfos));
    });
    const init = () => {
      getStudentList();
      getDepartmentList();
    };

    return {
      init,
      ...toRefs(dataList),
      formState,
      rulesRef,
      edit,
      remove,
      add,
      handleSave,
      handleCancel,
      handleChange,
      errorInfos,
    };
  },
  mounted() {
    this.init();
  },
});
</script>

<style lang="scss" scoped>
.operations-btn {
  margin-right: 8px;
}
.notice-operation {
  padding: 16px 0;
  text-align: right;
}
</style>