<template>
  <!-- 公告列表页面 -->
  <div>
    <div class="notice-operation">
      <a-button type="primary" @click="add">新增</a-button>
    </div>
    <a-table bordered :columns="columns" :data-source="collageList" :pagination="pagination">
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
    <a-modal v-model:visible="visible" title="院系信息" :footer="false">
      <a-form :model="formState" name="nest-messages" :validate-messages="validateMessages">
        <a-form-item name="name" label="院系名称">
          <a-input v-model:value="formState.deptName" />
        </a-form-item>
        <a-form-item name="name" label="班级名称">
          <a-input v-model:value="formState.className" />
        </a-form-item>
        <a-form-item class="error-infos" :wrapper-col="{ span: 14, offset: 4 }" v-bind="errorInfos">
          <a-button type="primary" @click.prevent="handleSubmit">提交</a-button>
          <a-button style="margin-left: 10px" @click="handleCancel">取消</a-button>
        </a-form-item>
      </a-form>

    </a-modal>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, toRefs, toRaw, computed } from 'vue';
import {
  departmentsPage,
  deleteDepartment,
  insertDepartment,
  modifyDepartment,
} from '@/service/service';
import { Modal, Form, message } from 'ant-design-vue';
import { toArray } from 'lodash';
export default defineComponent({
  name: 'collageView',
  setup() {
    interface FormData {
      id: number;
      deptName: string;
      className: string;
    }
    interface departMent {
      id: number;
    }
    const dataList = reactive({
      columns: [
        {
          title: '院系Id',
          dataIndex: 'id',
          width: '20%',
        },
        {
          title: '院系名称',
          dataIndex: 'deptName',
          width: '30%',
        },
        {
          title: '班级名称',
          dataIndex: 'className',
          width: '30%',
        },
        {
          title: '操作',
          dataIndex: 'operation',
        },
      ],
      collageList: [],
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
          getDepartmentList();
        },
        onChange: function (current: any, size: any) {
          dataList.pagination.current = current;
          dataList.pagination.offset =
            (current - 1) * dataList.pagination.defaultPageSize;
          dataList.pagination.limit =
            current * dataList.pagination.defaultPageSize;
          getDepartmentList();
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
      const params = {
        start: dataList.pagination.offset,
        limit: dataList.pagination.limit,
      };
      departmentsPage(params).then(({ data }) => {
        dataList.collageList = data.result;
        dataList.pagination.total = data.total;
      });
    };
    // 移除
    const remove = (id: number) => {
      Modal.confirm({
        title: '提示',
        content: '确定要移除该院校吗?',
        okText: '确定',
        cancelText: '取消',
        onOk() {
          const data: any = {
            id: id,
          };
          deleteDepartment(data)
            .then((res) => {
              getDepartmentList();
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
      formState.id = rowData.id;
      formState.deptName = rowData.deptName;
      formState.className = rowData.className;
      modify.value = true;
      dataList.visible = true;
    };
    // 新增院系班级
    const add = () => {
      modify.value = false;
      dataList.visible = true;
    };
    // 提交或修改院系班级
    const handleSubmit = async () => {
      validate()
        .then(() => {
          if (modify.value) {
            const data: FormData = {
              id: formState.id,
              deptName: formState.deptName,
              className: formState.className,
            };
            modifyDepartment(data).then((res) => {
              message.success('修改成功');
              getDepartmentList();
              dataList.visible = false;
            });
          } else {
            insertDepartment(toRaw(formState)).then((res) => {
              message.success('新增成功');
              getDepartmentList();
              dataList.visible = false;
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
      resetFields();
    };
    const errorInfos = computed(() => {
      return mergeValidateInfo(toArray(validateInfos));
    });
    const init = () => {
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
      handleSubmit,
      handleCancel,
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