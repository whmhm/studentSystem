<template>
  <!-- 公告列表页面 -->
  <div>
    <div class="notice-operation">
      <a-button type="primary" @click="handleAdd">新增</a-button>
    </div>
    <a-table
      :columns="columns"
      :data-source="carouselList"
      :pagination="pagination"
      bordered
    >
      <template #bodyCell="{ column, text, record }">
        <template v-if="['id', 'title'].includes(column.dataIndex)">
          <div>
            {{ text }}
          </div>
        </template>
        <template v-else-if="column.dataIndex === 'status'">
          <div>{{ text ? "是" : "否" }}</div>
        </template>
        <template v-else-if="column.dataIndex === 'url'">
          <div>
            <img class="mini-img" :src="`${baseURL}${text}`" />
          </div>
        </template>
        <template v-else-if="column.dataIndex === 'operation'">
          <div class="editable-row-operations">
            <span class="operations-btn">
              <a @click="handleEdit(record)">修改</a>
            </span>
            <span>
              <a @click="remove(record.id)">删除</a>
            </span>
          </div>
        </template>
      </template>
    </a-table>
    <!-- 新增、编辑 -->
    <a-modal v-model:visible="visible" title="上传图片" :footer="false">
      <a-form :model="formData" name="nest-messages">
        <a-form-item label="图片" name="img">
          <vUpload
            :url="formData.url"
            :accept-type="acceptType"
            avatar="carousel"
            @success="handleSuccess"
          ></vUpload>
        </a-form-item>
        <a-form-item name="title" label="标题">
          <a-input v-model:value="formData.title" />
        </a-form-item>
        <a-form-item name="status" label="状态">
          <a-radio-group v-model:value="formData.status">
            <a-radio :value="1">启用</a-radio>
            <a-radio :value="0">禁用</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button type="primary" @click.prevent="handleSubmit">提交</a-button>
          <a-button style="margin-left: 10px" @click="handleCancel"
            >取消</a-button
          >
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs } from "vue";
import {
  carouselUpload,
  deleteCarousel,
  selectCarousel,
  modifyCarousel,
} from "@/service/service";
import { baseURL } from '@/contents/utils'
import { Modal, message } from "ant-design-vue";
import vUpload from "@/components/upload.vue";
export default defineComponent({
  name: "carouselView",
  components: {
    vUpload,
  },
  setup() {
    const state = reactive({
      acceptType:"image/jpeg,image/png",
      columns: [
        {
          title: "序号",
          dataIndex: "id",
          width: "10%",
        },
        {
          title: "轮播图标题",
          dataIndex: "title",
          width: "20%",
        },
        {
          title: "轮播图链接",
          dataIndex: "url",
          width: "30%",
        },
        {
          title: "应用状态",
          dataIndex: "status",
          width: "10%",
        },
        {
          title: "操作",
          dataIndex: "operation",
        },
      ],
      formData: {
        id: 0,
        title: "",
        status: 0,
        url: "",
      },
      carouselList: [],
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
          state.pagination.defaultPageSize = pageSize;
          getCarousel();
        },
        onChange: function (current: any, size: any) {
          state.pagination.current = current;
          state.pagination.offset =
            (current - 1) * state.pagination.defaultPageSize;
          state.pagination.limit = current * state.pagination.defaultPageSize;
          getCarousel();
        },
      },
      visible: false,
      modify: false, // 是否是修改
    });

    // 获取轮播图列表
    const getCarousel = () => {
      const data = {
        start: state.pagination.offset,
        limit: state.pagination.limit,
      };
      selectCarousel(data).then(({ data }) => {
        state.carouselList = data.result;
        state.pagination.total = data.total;
      });
    };
    // 移除
    const remove = (id: number) => {
      Modal.confirm({
        title: "提示",
        content: "确定要移除该图片吗?",
        okText: "确定",
        cancelText: "取消",
        onOk() {
          const params = {
            id: id,
          };
          deleteCarousel(params).then(({ code }) => {
            if (code === 200) {
              message.success("删除成功");
              getCarousel();
            } else {
              message.error("删除失败");
            }
          });
        },
        onCancel() {},
      });
    };
    // 修改轮播图
    const handleEdit = (record: any) => {
      Object.assign(state.formData, record);
      state.modify = true;
      state.visible = true;
    };
    // 添加轮播图
    const handleAdd = () => {
      handleCancel();
      state.modify = false;
      state.visible = true;
    };
    // 处理轮播图上传
    const handleSuccess = (val: any) => {
      state.formData.url = val;
    };
    // 处理保存
    const handleSubmit = () => {
      if (state.modify) {
        // 修改
        modifyCarousel(state.formData).then(({ code }) => {
          if (code === 200) {
            message.success("修改成功");
            getCarousel();
          } else {
            message.error("上传失败");
          }
          handleCancel();
          state.visible = false;
        });
      } else {
        // 新增
        carouselUpload(state.formData).then(({ code }) => {
          if (code === 200) {
            message.success("上传成功");
            getCarousel();
          } else {
            message.error("上传失败");
          }
          handleCancel();
          state.visible = false;
        });
      }
    };
    const handleCancel = () => {
      state.formData.id = 0;
      state.formData.status = 0;
      state.formData.title = "";
      state.formData.url = "";
    };
    const init = () => {
      getCarousel();
    };
    return {
      ...toRefs(state),
      baseURL,
      init,
      handleAdd,
      handleEdit,
      remove,
      handleSuccess,
      handleSubmit,
      handleCancel,
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
.mini-img{
  width: 100px;
  height: 50px;
}
</style>