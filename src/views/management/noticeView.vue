<template>
  <!-- 公告列表页面 -->
  <div>
    <div class="notice-operation">
      <a-button type="primary" @click="add">新增</a-button>
    </div>
    <a-table :columns="columns" :data-source="newsList" bordered :pagination="pagination">
      <template #bodyCell="{ column, text, record }">
        <template v-if="['name', 'age', 'address'].includes(column.dataIndex)">
          <div>
            <a-input v-if="editableData[record.key]" v-model:value="editableData[record.key][column.dataIndex]" style="margin: -5px 0" />
            <template v-else>
              {{ text }}
            </template>
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
    <a-modal v-model:visible="visible" title="公告" :footer="false">
      <a-form :model="formState" name="nest-messages" :validate-messages="validateMessages">
        <a-form-item name="noticeTitle" label="标题">
          <a-input v-model:value="formState.noticeTitle" />
        </a-form-item>
        <a-form-item name="noticeContent" label="内容">
          <a-textarea v-model:value="formState.noticeContent" />
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
  getNewsList,
  deleteNews,
  insertNews,
  modifyNews,
} from '@/service/service';
import { Modal, Form, message } from 'ant-design-vue';
import { toArray } from 'lodash';
export default defineComponent({
  name: 'newsView',
  setup() {
    interface news {
      id: number;
    }
    interface FormData {
      noticeContent: string;
      noticeTitle: string;
      noticeType: number;
      heat: string;
      createBy: string;
    }
    interface ModifyData {
      id: number;
      noticeContent: string;
      noticeTitle: string;
      noticeType: number;
      heat: string;
      createBy: string;
    }
    const dataList = reactive({
      newsList: [
        {
          id: 12,
          noticeTitle: '123132',
          noticeContent: '123123',
          heat: '123',
        },
      ],
      columns: [
        {
          title: '公告标题',
          dataIndex: 'noticeTitle',
          width: '20%',
        },
        {
          title: '自信内容',
          dataIndex: 'noticeContent',
          width: '40%',
        },
        {
          title: '阅读次数',
          dataIndex: 'heat',
          width: '10%',
        },
        {
          title: '创建人',
          dataIndex: 'createBy',
          width: '10%',
        },
        {
          title: '操作',
          dataIndex: 'operation',
        },
      ],
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
          getNewsData();
        },
        onChange: function (current: any, size: any) {
          dataList.pagination.current = current;
          dataList.pagination.offset =
            (current - 1) * dataList.pagination.defaultPageSize;
          dataList.pagination.limit =
            current * dataList.pagination.defaultPageSize;
          getNewsData();
        },
      },
      visible: false,
    });
    const formState = reactive({
      id: 0,
      noticeTitle: '',
      noticeContent: '',
      noticeType: 2,
      createBy: '',
    });
    const modify = ref<boolean>(false);
    const rulesRef = reactive({
      noticeTitle: [{ required: true, message: '请输入公告标题' }],
      noticeContent: [{ required: true, message: '请输入公告内容' }],
    });
    const useForm = Form.useForm;
    const { resetFields, validate, validateInfos, mergeValidateInfo } = useForm(
      formState,
      rulesRef
    );
    // 获取公告
    const getNewsData = () => {
      const params = {
        start: dataList.pagination.offset,
        limit: dataList.pagination.limit,
        noticeType: formState.noticeType,
      };
      getNewsList(params).then(({ data }) => {
        dataList.newsList = data.result;
        dataList.pagination.total = data.total;
      });
    };
    // 移除
    const remove = (id: number) => {
      Modal.confirm({
        title: '提示',
        content: '确定要移除本条公告吗?',
        okText: '确定',
        cancelText: '取消',
        onOk() {
          const params: news = {
            id: id,
          };
          deleteNews(params).then((res) => {
            getNewsData();
          });
        },
        onCancel() {},
      });
    };
    // 编辑
    const edit = (rowData: ModifyData) => {
      formState.id = rowData.id;
      formState.noticeTitle = rowData.noticeTitle;
      formState.noticeContent = rowData.noticeContent;
      modify.value = true;
      dataList.visible = true;
    };
    // 新增公告
    const add = () => {
      modify.value = false;
      formState.noticeTitle = '';
      formState.noticeContent = '';
      resetFields()
      dataList.visible = true;
    };
    // 提交
    const handleSubmit = async () => {
      validate()
        .then(() => {
          if (modify.value) {
            const data = {
              ...formState,
              updateBy: '',
            };
            modifyNews(data).then((res) => {
              message.success('修改成功');
              getNewsData();
              dataList.visible = false;
            });
          } else {
            insertNews(toRaw(formState)).then((res) => {
              message.success('发布成功');
              getNewsData();
              dataList.visible = false;
            });
          }
          getNewsData();
        })
        .catch((err) => {
          console.error('error', err);
        });
    };
    // 取消
    const handleCancel = () => {
      formState.noticeTitle = '';
      formState.noticeContent = '';
      dataList.visible = false;
      resetFields();
    };
    const errorInfos = computed(() => {
      return mergeValidateInfo(toArray(validateInfos));
    });
    const init = () => {
      getNewsData();
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