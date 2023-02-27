<template>
  <!-- 登录日志 -->
  <div>
    <a-table
      :columns="columns"
      :data-source="newsList"
      bordered
      :pagination="pagination"
    >
      <template #bodyCell="{ column, text, record }">
        <template v-if="['name', 'age', 'address'].includes(column.dataIndex)">
          <div>
            <a-input
              v-if="editableData[record.key]"
              v-model:value="editableData[record.key][column.dataIndex]"
              style="margin: -5px 0"
            />
            <template v-else>
              {{ text }}
            </template>
          </div>
        </template>
      </template>
    </a-table>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs } from "vue";
import { loginLog } from "@/service/service";

export default defineComponent({
  name: "loginLog",
  setup() {
    const dataList = reactive({
      newsList: [
        {
          user: 12,
          time: "123132",
        },
      ],
      columns: [
        {
          title: "登陆账号",
          dataIndex: "userCode",
          width: "20%",
        },
        {
          title: "ip",
          dataIndex: "ip",
          width: "30%",
        },
        {
          title: "登录时间",
          dataIndex: "loginTime",
          width: "30%",
        },
        {
          title: "登录状态",
          dataIndex: "resMsg",
          width: "20%",
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
          getLog();
        },
        onChange: function (current: any, size: any) {
          dataList.pagination.current = current;
          dataList.pagination.offset =
            (current - 1) * dataList.pagination.defaultPageSize;
          dataList.pagination.limit =
            current * dataList.pagination.defaultPageSize;
          getLog();
        },
      },
      visible: false,
    });
    // 获取资讯
    const getLog = () => {
      const params = {
        start: dataList.pagination.offset,
        limit: dataList.pagination.limit,
      };
      loginLog(params).then(({ data }) => {
        dataList.newsList = data.result;
        dataList.pagination.total = data.total;
      });
    };

    const init = () => {
      getLog();
    };
    return {
      init,
      ...toRefs(dataList),
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
.new-operation {
  padding: 16px 0;
  text-align: right;
}
</style>