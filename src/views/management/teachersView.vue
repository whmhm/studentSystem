<template>
  <!-- 辅导员管理页面 -->
  <div>
    <div class="notice-operation">
      <a-button type="primary" @click="add">新增</a-button>
    </div>
    <a-table
      :columns="columns"
      :data-source="studentList"
      bordered
      :pagination="pagination"
    >
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
    <a-modal
      v-model:visible="visible"
      :rules="rulesRef"
      title="辅导员信息填写"
      :footer="false"
    >
      <a-form
        ref="personForm"
        :model="formState"
        :rules="rulesRef"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        autocomplete="off"
      >
        <a-form-item label="头像" name="avatar">
          <vUpload
            :url="formState.avatar"
            :accept-type="acceptType"
            avatar="avatar"
            @success="handleSuccess"
          ></vUpload>
        </a-form-item>
        <a-form-item label="教育Id" name="sno">
          <a-input v-model:value="formState.sno" :disabled="modify" />
        </a-form-item>

        <a-form-item label="用户名" name="username">
          <a-input v-model:value="formState.username" />
        </a-form-item>

        <a-form-item label="密码" name="password">
          <a-input-password v-model:value="formState.password" />
        </a-form-item>

        <a-form-item label="手机号" name="phone">
          <a-input v-model:value="formState.phone" />
        </a-form-item>

        <a-form-item label="邮箱" name="email">
          <a-input v-model:value="formState.email" />
        </a-form-item>

        <a-form-item label="院系" name="departmentId" required>
          <a-select ref="select" v-model:value="formState.departmentId">
            <a-select-option
              v-for="departMent in departments"
              :key="departMent.id"
              :value="departMent.id"
              >{{
                `${departMent.deptName}${departMent.className}`
              }}</a-select-option
            >
          </a-select>
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
          <a-button class="btn" @click="handleCancel">取消</a-button>
          <a-button class="btn" type="primary" @click="handleSubmit"
            >保存</a-button
          >
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, toRaw } from "vue";
import {
  departmentList,
  selectUser,
  addUser,
  modifyUser,
  deleteUser,
} from "@/service/service";
import { Modal, Form, message } from "ant-design-vue";
import vUpload from "@/components/upload.vue";
export default defineComponent({
  name: "collageView",
  components: {
    vUpload,
  },
  setup() {
    interface FormData {
      id: number;
      deptName: string;
      className: string;
    }
    const dataList = reactive({
      acceptType: "image/jpeg",
      columns: [
        {
          title: "教师编号",
          dataIndex: "sno",
          width: "15%",
        },
        {
          title: "姓名",
          dataIndex: "username",
          width: "10%",
        },
        {
          title: "手机号",
          dataIndex: "phone",
          width: "10%",
        },
        {
          title: "邮箱",
          dataIndex: "email",
          width: "10%",
        },
        {
          title: "学院",
          dataIndex: "department",
          width: "15%",
        },
        {
          title: "班级",
          dataIndex: "className",
          width: "10%",
        },
        {
          title: "操作",
          dataIndex: "operation",
          width: "10%",
        },
      ],
      studentList: [],
      departments: [],
      formState: {
        avatar: "",
        departmentId: 0,
        email: "",
        id: 0,
        instructorId: 0,
        password: "",
        phone: "",
        positions: "INSTRUCTOR",
        sno: "",
        username: "",
      },
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
          getTeacherList();
        },
        onChange: function (current: any, size: any) {
          dataList.pagination.current = current;
          dataList.pagination.offset =
            (current - 1) * dataList.pagination.defaultPageSize;
          dataList.pagination.limit =
            current * dataList.pagination.defaultPageSize;
          getTeacherList();
        },
      },
      modify: false,
      visible: false,
    });
    const rulesRef = reactive({
      departmentId: [
        { required: true, message: "请选择院系", trigger: "change" },
      ],
      email: [
        {
          required: true,
          type: "email",
          message: "请输入格式正确的邮箱",
          trigger: "blur",
        },
      ],
      phone: [{ required: true, message: "请输入手机号", trigger: "blur" }],
      sno: [{ required: true, message: "请输入教师编号", trigger: "blur" }],
      username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
      password: [{ required: true, message: "请输入密码", trigger: "blur" }],
    });
    const useForm = Form.useForm;
    const { resetFields, validate } = useForm(dataList.formState, rulesRef);
    // 获取院系列表
    const getDepartmentList = () => {
      departmentList().then(({ data }) => {
        dataList.departments = data;
      });
    };
    // 获取辅导员列表
    const getTeacherList = () => {
      const info = JSON.parse(localStorage.getItem("info") || "{}");
      const params = {
        sno: info.sno,
        positions: "INSTRUCTOR",
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
        title: "提示",
        content: "确定要移除该用户吗?",
        okText: "确定",
        cancelText: "取消",
        onOk() {
          const params = {
            id,
          };
          deleteUser(params)
            .then((res) => {
              message.success("移除成功");
              getTeacherList();
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
              getTeacherList();
              dataList.visible = false;
            });
          } else {
            //  新增教师
            addUser(toRaw(dataList.formState))
              .then(({ code }) => {
                message.success("新增成功");
                getTeacherList();
                dataList.visible = false;
              })
              .catch((err) => {
                message.error(err);
              });
          }
        })
        .catch((err) => {
          console.error("error", err);
        });
    };
    // 取消
    const handleCancel = () => {
      dataList.visible = false;
      dataList.formState.id = 0;
      dataList.formState.departmentId = 0;
      dataList.formState.instructorId = 0;
      dataList.formState.avatar = "";
      dataList.formState.email = "";
      dataList.formState.password = "";
      dataList.formState.phone = "";
      dataList.formState.username = "";
      resetFields();
    };
    const handleSuccess = (val: any) => {
      dataList.formState.avatar = val;
    };
    const init = () => {
      getDepartmentList();
      getTeacherList();
    };

    return {
      init,
      ...toRefs(dataList),
      rulesRef,
      edit,
      remove,
      add,
      handleSubmit,
      handleCancel,
      handleSuccess,
    };
  },
  mounted() {
    this.init();
  },
});
</script>

<style lang="scss" scoped>
.btn {
  width: 120px;
  margin-right: 10px;
}
:deep(.ant-table-cell) {
  padding: 8px;
  height: 50px;
}
.operations-btn {
  margin-right: 8px;
}
.notice-operation {
  padding: 16px 0;
  text-align: right;
}
</style>