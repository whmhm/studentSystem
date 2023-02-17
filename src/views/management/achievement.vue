<template>
  <!-- 成绩-学期-学科列表  -->
  <div>
    <!-- 学期，学科，用户等筛选 -->
    <div>
      <!-- 学期选择 -->
      <a-select ref="select" v-model:value="filter.semesterId">
        <a-select-option v-for="semester in semesterList" :key="semester.semesterId" :value="semester.semesterId">{{ semester.semesterName }}</a-select-option>
      </a-select>
      <a-button @click="openSubjectSet">学科管理</a-button>
      <a-button type="primary" @click="importAchievement">导入</a-button>
      <a-button type="text" @click="downloadTemplate">下载模板</a-button>
      <a-button type="primary" @click="exportAchievement">导出</a-button>
      <a-button type="primary" @click="addAchievement">新增成绩</a-button>
    </div>
    <!-- 学科弹窗 -->
    <a-drawer v-model:visible="visible" title="学科管理" width="800px" :footer="false">
      <a-button type="primary" @click="openSubjectAdd">新增学科</a-button>
      <a-table class="subject-table" :columns="subjectColumns" :data-source="subjectList" bordered :pagination="false">
        <template #bodyCell="{ column, text, record }">
          <template v-if="['subjectId','subjectName'].includes(column.dataIndex)">
            <span> {{ text }} </span>
          </template>
          <template v-else-if="column.dataIndex === 'operation'">
            <div>
              <span class="operations-btn">
                <a @click="edit(record)">修改</a>
              </span>
              <span>
                <a @click="remove(record.subjectId)">移除</a>
              </span>
            </div>
          </template>
        </template>
      </a-table>
    </a-drawer>
    <!-- 新增学科 -->
    <a-modal v-model:visible="subVisible" title="新增学科" @ok="addSubject" okText="确认" cancelText="取消" @cancel="handleCancel">
      <a-input v-model:value="formSubjectName"></a-input>
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
} from 'vue';
import {
  getSemester,
  getSubject,
  getAchievement,
  insertSubject,
  modifySubject,
  deleteSubject,
  addAchievement,
  deleteAchievement,
  modifyAchievement
} from '@/service/service';
import { message } from 'ant-design-vue';
export default defineComponent({
  setup() {
    const state = reactive({
      visible: false, // 学科弹窗
      subVisible: false, // 新增学科弹窗
      modify: 0, // 是否是学科新增弹窗
      filter: {
        sno: '',
        subjectName: '',
        semesterId: 1, // 默认大一上学期
        subjectId: 0,
      },
      formSubjectName: '', // 新增学科字段
      formSubjectId: '', // 修改时学科id
      semesterList: [], // 学期
      subjectList: [], // 学科列表
      achievementList: [], // 成绩列表
      subjectColumns: [
        {
          title: '学科序号',
          dataIndex: 'subjectId',
          width: '30%',
        },
        {
          title: '学科名称',
          dataIndex: 'subjectName',
          width: '40%',
        },
        {
          title: '操作',
          dataIndex: 'operation',
        },
      ], // 学科表格字段
    });
    /**
     * 获取学期列表
     * 给对应的学期设置学科
     * 成绩导入给对应的学期的学科
     */
    // 获取学期
    const getSemesterList = () => {
      getSemester().then(({ data }) => {
        state.semesterList = data;
      });
    };
    // 获取学科
    const getSubjectList = () => {
      const params = {
        semesterId: state.filter.semesterId,
        start: 0,
        limit: 999,
      };
      getSubject(params).then(({ data }) => {
        state.subjectList = data.result;
      });
    };
    // 获取成绩列表
    const getAchievementList = () => {
      const userInfo = JSON.parse(localStorage.getItem('info') || '')
      const params = {
        sno: userInfo.sno,
        subjectId: state.filter.subjectId,
        semesterId: state.filter.semesterId,
        start: 0,
        limit: 999,
      };
      getAchievement(params).then(({ data }) => {
        state.achievementList = data.result;
      });
    };
    // 打开学期设置
    const openSubjectSet = () => {
      if (!state.filter.semesterId) {
        message.warning('请先选择学期');
      } else {
        // 获取学期对应的学科
        getSubjectList();
        state.visible = true;
      }
    };
    // 打开新增学科
    const openSubjectAdd = () => {
      state.formSubjectName = '';
      state.subVisible = true;
      state.modify = 0;
    };
    // 新增学科
    const addSubject = () => {
      if (!state.modify) {
        if (!state.formSubjectName) {
          message.success('学科名称不能为空');
          return;
        }
        const data = {
          subjectName: state.formSubjectName,
          semesterId: state.filter.semesterId,
        };
        insertSubject(data)
          .then(({ data }) => {
            if (data) {
              message.success('新增学科成功');
              getSubjectList();
              state.subVisible = false;
            }
          })
          .catch((err) => {
            message.success('新增学科失败');
            state.subVisible = false;
          });
      } else {
        handleSave();
      }
    };
    // 取消新增学科
    const handleCancel = () => {
      state.formSubjectName = '';
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
      modifySubject(data).then((res) => {
        getSubjectList();
        state.subVisible = false;
      }).catch((err) => {
        message.warning('修改失败')
        state.subVisible = false;
      })
    };
    // 没有成绩可以移除学科
    const remove = (id: number) => {
      const params = {
        subjectId: id,
      };
      deleteSubject(params)
        .then((res) => {
          getSubjectList()
        })
        .catch((err) => {
          message.warning('删除失败')
        })
    };
    // 导入
    const importAchievement = () => {

    }
    // 导出
    const exportAchievement = () => {

    }
    // 下载模板
    const downloadTemplate = () => {

    }
    // 新增成绩
    const addAchievement = () => {

    }
    // 初始化
    const init = () => {
      getSemesterList();
      getAchievementList();
    };
    onMounted(() => {
      init();
    });
    return {
      ...toRefs(state),
      openSubjectSet,
      openSubjectAdd,
      addSubject,
      handleCancel,
      edit,
      remove,
      importAchievement,
      downloadTemplate,
      exportAchievement,
      addAchievement
    };
  },
});
</script>
<style lang="scss" scoped>
.operations-btn {
  margin-right: 8px;
}
.subject-table {
  height: 500px;
}
</style>