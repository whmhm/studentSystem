<template>
  <!-- 成绩-学期-学科列表  -->
  <div>
    <!-- 学期，学科，用户等筛选 -->
    <div class="select-options">
      <!-- 学期选择 -->
      <a-select
        ref="select"
        v-model:value="filter.semesterId"
        @change="handleChange"
      >
        <a-select-option
          v-for="semester in semesterList"
          :key="semester.semesterId"
          :value="semester.semesterId"
          >{{ semester.semesterName }}</a-select-option
        >
      </a-select>
      <span>
        <a-button class="operations-btn" @click="openSubjectSet">学科管理</a-button>
        <a-button class="operations-btn" type="primary" @click="importAchievement">导入</a-button>
        <a-button class="operations-btn" type="text" @click="downloadTemplate">下载模板</a-button>
        <a-button class="operations-btn" type="primary" @click="exportAchievement">导出</a-button>
        <a-button class="operations-btn" type="primary" @click="insertAchievement">新增成绩</a-button>
      </span>
    </div>
    <a-table
      :columns="tableColumns"
      :data-source="achievementList"
      bordered
      :pagination="pagination"
    >
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex !== 'operation'">
          <span> {{ text }} </span>
        </template>
        <template v-else>
          <span class="operations-btn">
            <a @click="editAchievement(record)">修改</a>
          </span>
          <span>
            <a @click="removeAchievement(record)">移除</a>
          </span>
        </template>
      </template>
    </a-table>
    <!-- 学科弹窗 -->
    <a-drawer
      v-model:visible="visible"
      title="学科管理"
      width="800px"
      :footer="false"
    >
      <a-button type="primary" @click="openSubjectAdd">新增学科</a-button>
      <a-table
        class="subject-table"
        :columns="subjectColumns"
        :data-source="subjectList"
        bordered
        :pagination="false"
      >
        <template #bodyCell="{ column, text, record }">
          <template
            v-if="['subjectId', 'subjectName'].includes(column.dataIndex)"
          >
            <span> {{ text }} </span>
          </template>
          <template v-else-if="column.dataIndex === 'operation'">
            <span class="operations-btn">
              <a @click="edit(record)">修改</a>
            </span>
            <span>
              <a @click="remove(record.subjectId)">移除</a>
            </span>
          </template>
        </template>
      </a-table>
    </a-drawer>
    <!-- 新增学科 -->
    <a-modal
      v-model:visible="subVisible"
      title="新增学科"
      @ok="addSubject"
      okText="确认"
      cancelText="取消"
      @cancel="handleCancel"
    >
      <a-input v-model:value="formSubjectName"></a-input>
    </a-modal>
    <!-- 新增成绩 -->
    <a-modal
      v-model:visible="setSunjectScore"
      title="新增成绩"
      @ok="saveAchievement"
      okText="确认"
      cancelText="取消"
      @cancel="handleCancel"
    >
      <a-form
        :model="subjectAchievement"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-form-item
          v-for="(subject, index) in subjectAchievement"
          :label="subject.subjectName"
          :key="index"
        >
          <a-input
            v-model:value="subject.value"
            :type="
              ['sno', 'username'].includes(subject.subjectId)
                ? 'text'
                : 'number'
            "
          ></a-input>
        </a-form-item>
      </a-form>
    </a-modal>
    <!-- 文件上传 -->
    <a-modal
      v-model:visible="importExcel"
      title="成绩导入"
      okText="确认"
      cancelText="取消"
      @ok="handleOk"
    >
      <vUpload
        avatar="file"
        :accept-type="acceptType"
        @success="handleSuccess"
        :callBack="importAchievementSave"
      ></vUpload>
    </a-modal>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  reactive,
  ref,
  toRefs,
  toRaw,
  computed,
  onMounted,
} from "vue";
import {
  getSemester,
  getSubject,
  getAchievement,
  insertSubject,
  modifySubject,
  deleteSubject,
  addAchievement,
  deleteAchievement,
  modifyAchievement,
  importExcel,
} from "@/service/service";
import { message, Modal } from "ant-design-vue";
import { cloneDeep, reject, values } from "lodash";
import { baseURL } from "@/contents/utils";
import vUpload from "@/components/upload.vue";

export default defineComponent({
  components: {
    vUpload,
  },
  setup() {
    const state = reactive({
      acceptType: "excel",
      visible: false, // 学科弹窗
      subVisible: false, // 新增学科弹窗
      modify: 0, // 是否是学科新增弹窗
      modifyScore: false, // 是否是修改成绩
      setSunjectScore: false, // 新增成绩弹窗
      importExcel: false, // 文件倒入弹窗
      filter: {
        sno: "",
        subjectName: "",
        semesterId: 1, // 默认大一上学期
        subjectId: 0,
      },
      formSubjectName: "", // 新增学科字段
      formSubjectId: "", // 修改时学科id
      semesterList: [], // 学期
      subjectList: [], // 学科列表
      achievementList: [] as any, // 成绩列表
      subjectAchievement: [] as any, //学科成绩
      achievementResult: [] as any, //存放最初成绩
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
          getAchievementList();
        },
        onChange: function (current: any, size: any) {
          state.pagination.current = current;
          state.pagination.offset =
            (current - 1) * state.pagination.defaultPageSize;
          state.pagination.limit = current * state.pagination.defaultPageSize;
          getAchievementList();
        },
      },
      subjectColumns: [
        {
          title: "学科序号",
          dataIndex: "subjectId",
          width: "30%",
        },
        {
          title: "学科名称",
          dataIndex: "subjectName",
          width: "40%",
        },
        {
          title: "操作",
          dataIndex: "operation",
        },
      ], // 学科表格字段
      staticColumn: [
        {
          subjectName: "姓名",
          subjectId: "username",
          value: "",
        },
        {
          subjectName: "学号",
          subjectId: "sno",
          value: "",
        },
      ],
    });
    /**
     * 获取学期列表
     * 给对应的学期设置学科
     * 成绩导入给对应的学期的学科
     */
    const userInfo = JSON.parse(localStorage.getItem("info") || "");
    // 获取表格头部
    const tableColumns = computed(() => {
      if (state.subjectList.length) {
        const subjectColumns = state.subjectList.map((e: any) => {
          return {
            title: e.subjectName,
            dataIndex: e.subjectId,
          };
        });
        const constant = [
          {
            title: "姓名",
            dataIndex: "username",
          },
          {
            title: "学号",
            dataIndex: "sno",
          },
        ];
        return [
          ...constant,
          ...subjectColumns,
          { title: "操作", dataIndex: "operation" },
        ];
      }
    });
    // 获取学期
    const getSemesterList = () => {
      return new Promise((resolve, reject) => {
        getSemester()
          .then(({ data }) => {
            state.semesterList = data;
            resolve(data);
          })
          .catch((err) => {
            reject(err);
          });
      });
    };
    // 获取学科
    const getSubjectList = () => {
      return new Promise((resolve, reject) => {
        const params = {
          semesterId: state.filter.semesterId,
          start: 0,
          limit: 999,
        };
        getSubject(params)
          .then(({ data }) => {
            state.subjectList = data.result;
            resolve(data);
          })
          .catch((err) => {
            reject(err);
          });
      });
    };
    // 获取成绩列表
    const getAchievementList = () => {
      const params = {
        sno: userInfo.sno,
        subjectId: state.filter.subjectId,
        semesterId: state.filter.semesterId,
        start: 0,
        limit: 999,
      };
      getAchievement(params).then(({ data }) => {
        state.achievementResult = data.result;
        const achievementList = [];
        for (let index = 0; index < data.result.length; index++) {
          const element = data.result[index];
          const rowData: any = {};
          rowData.username = element[0].username;
          rowData.sno = element[0].sno;
          for (let index = 0; index < element.length; index++) {
            const item = element[index];
            rowData[item.subjectId] = item.achievementValue;
          }
          achievementList.push(rowData);
        }
        state.achievementList = achievementList;
      });
    };
    // 打开学期设置
    const openSubjectSet = () => {
      if (!state.filter.semesterId) {
        message.warning("请先选择学期");
      } else {
        // 获取学期对应的学科
        getSubjectList();
        state.visible = true;
      }
    };
    // 打开新增学科
    const openSubjectAdd = () => {
      state.formSubjectName = "";
      state.subVisible = true;
      state.modify = 0;
    };
    // 新增学科
    const addSubject = () => {
      if (!state.modify) {
        if (!state.formSubjectName) {
          message.success("学科名称不能为空");
          return;
        }
        const data = {
          subjectName: state.formSubjectName,
          semesterId: state.filter.semesterId,
        };
        insertSubject(data)
          .then(({ data }) => {
            if (data) {
              message.success("新增学科成功");
              getSubjectList();
              state.subVisible = false;
            }
          })
          .catch((err) => {
            message.success("新增学科失败");
            state.subVisible = false;
          });
      } else {
        handleSave();
      }
    };
    // 取消新增学科
    const handleCancel = () => {
      state.formSubjectName = "";
      state.subVisible = false;
    };
    // 修改学科
    const edit = (rowData: any) => {
      state.formSubjectName = rowData.subjectName;
      state.formSubjectId = rowData.subjectId;
      state.subVisible = true;
      state.modify = 1;
    };
    // 保存学科名称修改
    const handleSave = () => {
      const data = {
        subjectName: state.formSubjectName,
        subjectId: Number(state.formSubjectId),
      };
      modifySubject(data)
        .then((res) => {
          getSubjectList();
          state.subVisible = false;
        })
        .catch((err) => {
          message.warning("修改失败");
          state.subVisible = false;
        });
    };
    // 没有成绩可以移除学科
    const remove = (id: number) => {
      const params = {
        subjectId: id,
      };
      deleteSubject(params)
        .then((res) => {
          getSubjectList();
        })
        .catch((err) => {
          message.warning("删除失败");
        });
    };
    // 导入
    const importAchievement = () => {
      state.importExcel = true;
    };
    // 导出
    const exportAchievement = () => {
      const url = `${baseURL}/achievement/exportExcel?limit=65536&start=0&sno=${userInfo.sno}&semesterId=${state.filter.semesterId}`;
      window.open(url);
    };
    // 下载模板
    const downloadTemplate = () => {
      const url = `${baseURL}/achievement/exportExcel?limit=0&start=0&sno=${userInfo.sno}&semesterId=${state.filter.semesterId}`;
      window.open(url);
    };
    // 新增成绩
    const insertAchievement = () => {
      state.setSunjectScore = true;
      state.modifyScore = false;
      const subject = cloneDeep(state.subjectList);
      state.subjectAchievement = [...state.staticColumn, ...subject];
    };
    // 保存成绩
    const saveAchievement = () => {
      // 获取学号姓名
      const person = {
        username: state.subjectAchievement[0].value,
        sno: state.subjectAchievement[1].value,
      };
      const data = [];
      for (let index = 2; index < state.subjectAchievement.length; index++) {
        const element = state.subjectAchievement[index];
        const achievement: any = {};
        if (!["sno", "username"].includes(element.value)) {
          achievement.achievementValue = Number(element.value) || 0;
          achievement.semesterId = state.filter.semesterId;
          achievement.subjectId = element.subjectId;
          achievement.subjectName = element.subjectName;
          achievement.sno = person.sno;
          achievement.username = person.username;
          if (state.modifyScore) {
            achievement.achievementId = element.achievementId;
          }
        }
        data.push(achievement);
      }
      if (data.length && state.modifyScore) {
        modifyAchievement(data).then((res) => {
          getAchievementList();
          state.setSunjectScore = false;
        });
      }
      if (data.length && !state.modifyScore) {
        addAchievement(data).then((res) => {
          getAchievementList();
          state.setSunjectScore = false;
        });
      }
    };
    const handleChange = async (val: any) => {
      state.achievementList = [];
      state.filter.semesterId = val;
      await getSubjectList();
      getAchievementList();
    };
    // 编辑学生成绩
    const editAchievement = (rowData: any) => {
      state.modifyScore = true;
      // 找到原始数据中的成绩集合
      const result = state.achievementResult.find(
        (elem: any) => elem[0].sno === rowData.sno
      );
      const subjectScore = state.subjectList.map((e: any) => {
        const data = result.find((item: any) => item.subjectId === e.subjectId);
        if (data) {
          return {
            subjectId: data.subjectId,
            subjectName: data.subjectName,
            achievementId: data.achievementId,
            value: data.achievementValue,
          };
        } else {
          return {
            subjectName: e.subjectName,
            subjectId: e.subjectId,
            value: 0,
          };
        }
      });
      // 姓名
      const staticColumn = [
        {
          subjectName: "姓名",
          subjectId: "username",
          value: rowData.username,
        },
        {
          subjectName: "学号",
          subjectId: "sno",
          value: rowData.sno,
        },
      ];
      state.subjectAchievement = [...staticColumn, ...subjectScore];
      state.setSunjectScore = true;
    };
    // 移除学生成绩
    const removeAchievement = (rowData: any) => {
      Modal.confirm({
        title: "提示",
        content: "确定要移除该学生本学期成绩吗?",
        okText: "确定",
        cancelText: "取消",
        onOk() {
          const params = {
            sno: rowData.sno,
            semesterId: state.filter.semesterId,
          };
          deleteAchievement(params).then((res) => {
            getAchievementList();
          });
        },
        onCancel() {},
      });
    };
    // 文件上传
    const handleSuccess = () => {
      getAchievementList();
    };
    const handleOk = () => {
      state.importExcel = false;
    };
    // 文件上传路径
    const importAchievementSave = (info: any) => {
      return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append("file", info);

        const params = {
          semesterId: state.filter.semesterId,
        };
        importExcel(formData, params)
          .then((res) => resolve(res))
          .catch((err) => reject(err));
      });
    };
    // 初始化
    const init = async () => {
      await getSemesterList();
      await getSubjectList();
      getAchievementList();
    };
    onMounted(() => {
      init();
    });
    return {
      ...toRefs(state),
      tableColumns,
      openSubjectSet,
      openSubjectAdd,
      addSubject,
      handleCancel,
      edit,
      remove,
      importAchievement,
      downloadTemplate,
      exportAchievement,
      insertAchievement,
      handleChange,
      saveAchievement,
      editAchievement,
      removeAchievement,
      handleSuccess,
      importAchievementSave,
      handleOk,
    };
  },
});
</script>
<style lang="scss" scoped>
.select-options {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}
.operations-btn {
  margin-right: 8px;
}
.subject-table {
  height: 500px;
}
</style>