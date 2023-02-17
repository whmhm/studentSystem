<template>
  <!-- 辅导员管理页面 -->
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
    <a-modal v-model:visible="visible" title="辅导员信息填写" :footer="false">
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
    const dataList = reactive({
      columns: [
        {
          title: '学号',
          dataIndex: 'id',
          width: '20%',
        },
        {
          title: '姓名',
          dataIndex: 'deptName',
          width: '30%',
        },
        {
          title: '性别',
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
    const getTeacherList = () => {
      const params = {
        start: dataList.pagination.offset,
        limit: dataList.pagination.limit,
      };

    };
    // 移除
    const remove = (id: number) => {
      Modal.confirm({
        title: '提示',
        content: '确定要移除该院校吗?',
        okText: '确定',
        cancelText: '取消',
        onOk() {
        
        },
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
    const handleSubmit = async () => {
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
      getTeacherList();
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