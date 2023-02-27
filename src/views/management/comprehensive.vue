<template>
  <!-- 综合测评成绩 -->
  <div class="container">
    <div class="top-operation">
      <a-radio-group v-model:value="status" @change="handleGetData">
        <a-radio-button :value="1" v-if="isStudent">新建</a-radio-button>
        <a-radio-button :value="2" v-if="isStudent || isInstructor">审核中</a-radio-button>
        <a-radio-button :value="3">通过</a-radio-button>
        <a-radio-button :value="4">退回</a-radio-button>
      </a-radio-group>
      <!-- 填报按钮 -->
      <a-button class="btn" type="primary" @click="handleAdd" v-if="isStudent">填报</a-button>
    </div>
    <!-- 审批列表 -->
    <a-table bordered :columns="columns" :data-source="data" :scroll="{ x: 1600 }" :pagination="pagination">
      <template #bodyCell="{ column, text, record }">
        <div>
          <template v-if="column.dataIndex === 'status'">
            <span>{{ APPROVAL[text] }}</span>
          </template>
          <template v-else>
            {{ text }}
          </template>
        </div>
        <template v-if="column.dataIndex === 'operation'">
          <div class="editable-row-operations">
            <a-button class="btn" type="link" @click="handleView(record)">查看详情</a-button>
            <!-- 辅导员 -->
            <template v-if="isInstructor && record.status === 2">
              <a-popconfirm title="确定通过吗" ok-text="是" cancel-text="否" @confirm="handlePass(record)">
                <a href="#">通过</a>
              </a-popconfirm>
              <a-popconfirm title="确定退回吗" ok-text="是" cancel-text="否" @confirm="handleBack(record)">
                <a href="#">退回</a>
              </a-popconfirm>
            </template>
            <!-- 学生 -->
            <template v-if="!isInstructor && record.status === 1">
              <!-- 学生编辑材料，重新提交审批 -->
              <a-button class="btn" @click="handleEdit(record)">编辑</a-button>
              <a-button class="btn" @click="handleRemove(record)">删除</a-button>
            </template>
          </div>
        </template>
      </template>
    </a-table>
    <!-- 材料填报弹窗 -->
    <a-modal :title="!preview ? '材料填写' : '详情'" width="1300px" v-model:visible="visible" destroyOnClose>
      <a-form ref="form" :model="formState" :rules="formRules" :label-col="{ span: 8 }" :wrapper-col="{ span: 8 }">
        <a-form-item label="姓名" v-bind="validateInfos.username">
          <a-input v-model:value="formState.username" placeholder="请填写姓名" :disabled="preview" />
        </a-form-item>
        <a-form-item label="学号" v-bind="validateInfos.sno">
          <a-input v-model:value="formState.sno" placeholder="请填写学号" :disabled="preview" />
        </a-form-item>
        <a-form-item label="学期" v-bind="validateInfos.semesterId">
          <a-select v-model:value="formState.semesterId" placeholder="请选择学期" @change="handleChange" :disabled="preview">
            <a-select-option v-for="item in semesterList" :value="item.semesterId" :key="item.semesterId">
              {{ item.semesterName }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="学科成绩" v-bind="validateInfos.achievementValue">
          <a-input type="number" v-model:value="formState.achievementValue" placeholder="请填写学科成绩" :disabled="preview" @blur="computedScore" />
        </a-form-item>
        <a-form-item label="竞赛成绩" v-bind="validateInfos.competitionValue">
          <a-input type="number" v-model:value="formState.competitionValue" placeholder="请填写竞赛成绩" :disabled="preview" @blur="computedScore" />
        </a-form-item>
        <a-form-item label="班干部任职" v-bind="validateInfos.classCadrePostValue">
          <a-input type="number" v-model:value="formState.classCadrePostValue" placeholder="请填写班干部任职得分" :disabled="preview" @blur="computedScore" />
        </a-form-item>
        <a-form-item label="奖学金" v-bind="validateInfos.scholarshipValue">
          <a-input type="number" v-model:value="formState.scholarshipValue" placeholder="请填写奖学金" :disabled="preview" @blur="computedScore" />
        </a-form-item>
        <a-form-item label="违规违纪（-）" v-bind="validateInfos.violationValue">
          <a-input type="number" v-model:value="formState.violationValue" placeholder="请填写违规违纪" :disabled="preview" @blur="computedScore" />
        </a-form-item>
        <a-form-item label="助人为乐" v-bind="validateInfos.helpGoodValue">
          <a-input type="number" v-model:value="formState.helpGoodValue" placeholder="请填写助人为乐" :disabled="preview" @blur="computedScore" />
        </a-form-item>
        <a-form-item label="表彰荣誉" v-bind="validateInfos.honorValue">
          <a-input type="number" v-model:value="formState.honorValue" placeholder="请填写表彰荣誉" :disabled="preview" @blur="computedScore" />
        </a-form-item>
        <a-form-item label="专利" v-bind="validateInfos.patentedInventionValue">
          <a-input type="number" v-model:value="formState.patentedInventionValue" placeholder="请填写专利" :disabled="preview" @blur="computedScore" />
        </a-form-item>
        <a-form-item label="出版/发表论文" v-bind="validateInfos.paperValue">
          <a-input type="number" v-model:value="formState.paperValue" placeholder="请填写出版/发表论文" :disabled="preview" @blur="computedScore" />
        </a-form-item>
        <a-form-item label="综合成绩" v-bind="validateInfos.totalScore">
          <a-input type="number" v-model:value="formState.totalScore" placeholder="综合成绩" :disabled="preview" @blur="computedScore" />
        </a-form-item>
      </a-form>
      <!-- 操作按钮 -->
      <template v-slot:footer>
        <template v-if="!preview">
          <a-button @click="handleCancel">取消</a-button>
          <a-button type="primary" @click="handleSave">保存</a-button>
          <a-button type="primary" @click="handleSaveAndSubmit">保存并送审</a-button>
        </template>
        <template v-if="preview">
          <a-button @click="handleOk">确定</a-button>
        </template>
      </template>
    </a-modal>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, onMounted, ref } from 'vue';
import store from '@/store/index';
import vEdit from '@/components/edit.vue';
import { cloneDeep } from 'lodash';
import { APPROVAL } from '@/contents/utils';
import { Modal, Form, message } from 'ant-design-vue';
import { InboxOutlined } from '@ant-design/icons-vue';
import {
  getSemester,
  selectComprehensive,
  insertComprehensive,
  deleteComprehensive,
  updateComprehensive,
  settleAccounts,
} from '@/service/service';
export default defineComponent({
  components: {
    vEdit,
    InboxOutlined,
  },
  setup() {
    const useForm = Form.useForm;
    const fileList = ref([]) as any;
    const formState = reactive({
      achievementValue: 0,
      classCadrePostValue: 0,
      competitionValue: 0,
      helpGoodValue: 0,
      honorValue: 0,
      id: 0,
      paperValue: 0,
      patentedInventionValue: 0,
      scholarshipValue: 0,
      semesterId: null,
      sno: '',
      status: 1,
      username: '',
      violationValue: 0,
      totalScore: 0,
    });
    const state = reactive({
      status: 3, // 单据状态
      ItemScore: 5,
      acceptType: '.doc,.docx,.pdf,image/*',
      modify: false,
      visible: false, // 填写弹窗
      preview: false, // 详情弹窗
      approvalVisible: false, // 材料上传
      columns: [
        {
          title: '姓名',
          dataIndex: 'username',
          width: 160,
        },
        {
          title: '学号',
          dataIndex: 'sno',
          width: 160,
        },
        {
          title: '学科成绩',
          dataIndex: 'achievementValue',
          width: 100,
        },
        {
          title: '班干部任职',
          dataIndex: 'classCadrePostValue',
          width: 100,
        },
        {
          title: '竞赛成绩',
          dataIndex: 'competitionValue',
          width: 100,
        },
        {
          title: '奖学金',
          dataIndex: 'scholarshipValue',
          width: 100,
        },
        {
          title: '违规违纪',
          dataIndex: 'violationValue',
          width: 100,
        },
        {
          title: '助人为乐',
          dataIndex: 'helpGoodValue',
          width: 100,
        },
        {
          title: '表彰荣誉',
          dataIndex: 'honorValue',
          width: 100,
        },
        {
          title: '专利',
          dataIndex: 'patentedInventionValue',
          width: 120,
        },
        {
          title: '出版/发表论文',
          dataIndex: 'paperValue',
          width: 120,
        },
        {
          title: '综合成绩',
          dataIndex: 'totalScore',
          width: 100,
        },
        {
          title: '操作',
          dataIndex: 'operation',
          fixed: 'right',
        },
      ],
      data: [],
      material: [] as any,
      semesterList: [], // 学期列表
      setScore: {}, // 学期对应综合成绩
      pagination: {
        // 分页
        total: 0,
        current: 1,
        start: 0,
        limit: 10,
        defaultPageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: [10, 15, 20, 25],
        showTotal: (total: any) => `共${total}条`,
        onShowSizeChange: function (page: any, pageSize: any) {
          state.pagination.defaultPageSize = pageSize;
          getTableData();
        },
        onChange: function (current: any, size: any) {
          state.pagination.current = current;
          state.pagination.start =
            (current - 1) * state.pagination.defaultPageSize;
          state.pagination.limit = current * state.pagination.defaultPageSize;
          getTableData();
        },
      },
    });
    const userInfo = store.getters.userInfo;
    // 获取当前登录人角色 ---- 是否是辅导员
    const isInstructor = userInfo.positions === 'INSTRUCTOR';
    const isStudent = userInfo.positions === 'STUDENT';
    // 表单校验规则
    const formRules = reactive({
      semesterId: [{ required: true, message: '请选择学期' }],
      sno: [{ required: true, message: '请输入学号' }],
      username: [{ required: true, message: '请输入用户名' }],
      achievementValue: [{ required: true, message: '请输入学科成绩' }],
      classCadrePostValue: [
        { required: true, message: '请输入班干部任职得分' },
      ],
      competitionValue: [{ required: true, message: '请输入竞赛得分' }],
      helpGoodValue: [{ required: true, message: '请输入助人为乐得分' }],
      honorValue: [{ required: true, message: '请输入表彰荣誉得分' }],
      paperValue: [{ required: true, message: '请输入出版/发表论文得分' }],
      patentedInventionValue: [{ required: true, message: '请输入专利得分' }],
      scholarshipValue: [{ required: true, message: '请输入奖学金得分' }],
      violationValue: [{ required: true, message: '请输入违规违纪扣分' }],
      comprehensive: [{ required: true, message: '综合成绩不能为空' }],
    });
    const { resetFields, validate, validateInfos } = useForm(
      formState,
      formRules
    );
    const getSemesterList = () => {
      getSemester().then(({ data }) => {
        state.semesterList = data;
      });
    };
    // 获取列表数据  学生  辅导员
    const getTableData = () => {
      const params = {
        sno: userInfo.sno,
        status: state.status,
        start: state.pagination.start,
        limit: state.pagination.limit,
      };
      selectComprehensive(params).then(({ data }) => {
        state.data = data.result;
        state.pagination.total = data.total;
      });
    };
    const handleGetData = () => {
      getTableData();
    };
    // 填报
    const handleAdd = () => {
      resetValue();
      state.preview = false;
      state.modify = false;
      state.material = [];
      state.visible = true;
    };
    // 取消填写
    const handleCancel = () => {
      state.visible = false;
      resetValue();
    };
    // 保存材料并提交审批
    const handleSaveAndSubmit = () => {
      validate().then(async () => {
        const data = cloneDeep(formState);
        data.status = 2;
        if (state.modify) {
          updateComprehensive(data).then(({ code }) => {
            if (code === 200) {
              message.success('保存并送审成功');
              getTableData();
              resetValue();
              state.visible = false;
            } else {
              message.success('保存并送审失败，请重试');
              resetValue();
              state.visible = false;
            }
          });
        } else {
          insertComprehensive(data).then(({ code }) => {
            if (code === 200) {
              message.success('保存并送审成功');
              getTableData();
              resetValue();
              state.visible = false;
            } else {
              message.success('保存并送审失败，请重试');
              resetValue();
              state.visible = false;
            }
          });
        }
      });
    };
    // 学生编辑材料
    const handleEdit = (record: any) => {
      Object.assign(formState, record);
      state.preview = false;
      state.modify = true;
      state.visible = true;
    };
    // 辅导员查看详情
    const handleView = (record: any) => {
      state.preview = true;
      Object.assign(formState, record);
      state.visible = true;
    };
    const handleOk = () => {
      state.preview = false;
      state.visible = false;
    };
    // 保存填写材料
    const handleSave = async () => {
      validate().then(async () => {
        const data = cloneDeep(formState);
        data.status = 1;
        if (state.modify) {
          updateComprehensive(data).then(({ code }) => {
            if (code === 200) {
              message.success('保存成功');
              resetValue();
              getTableData();
              state.visible = false;
            }
          });
        } else {
          insertComprehensive(data).then(({ code }) => {
            if (code === 200) {
              message.success('保存成功');
              resetValue();
              getTableData();
              state.visible = false;
            }
          });
        }
      });
    };
    // 删除未送审
    const handleRemove = (record: any) => {
      if (record.status !== 1) {
        message.error('当前材料处于流程中，不能删除');
        return;
      }
      Modal.confirm({
        title: '提示',
        content: '确定要移除本条记录吗?',
        okText: '确定',
        cancelText: '取消',
        onOk() {
          const params = {
            id: record.id,
          };
          deleteComprehensive(params).then(({ code }) => {
            if (code === 200) {
              message.success('删除成功');
              getTableData();
            } else {
              message.error('删除失败');
            }
          });
        },
        onCancel() {},
      });
    };
    // 审批通过
    const handlePass = (record: any) => {
      const data = cloneDeep(record);
      data.status = 3;
      updateComprehensive(data).then((res) => {
        if (res.code === 200) {
          getTableData();
          message.success('审批通过');
        }
      });
    };
    // 审批退回
    const handleBack = (record: any) => {
      const data = cloneDeep(record);
      data.status = 4;
      updateComprehensive(data).then((res) => {
        if (res.code === 200) {
          getTableData();
          message.success('退回成功');
        }
      });
    };
    const handleChange = (val: any) => {
      if (!formState.sno) {
        message.warning('请先填写学号再选择学期');
        return;
      }
      const params = {
        semesterIds: val,
        sno: formState.sno,
      };
      settleAccounts(params).then(({ data }) => {
        state.setScore = data;
        formState.achievementValue = data.achievementList.reduce(
          (total: number, e: any) => {
            if (e.achievementValue) {
              return (total += e.achievementValue);
            } else {
              return total;
            }
          },
          0
        );
        formState.classCadrePostValue =
          data.classCadrePostList.length * state.ItemScore;
        formState.competitionValue =
          data.competitionList.length * state.ItemScore;
        formState.helpGoodValue = data.helpGoodList.length * state.ItemScore;
        formState.honorValue = data.honorList.length * state.ItemScore;
        formState.paperValue = data.paperList.length * state.ItemScore;
        formState.patentedInventionValue =
          data.patentedInventionList.length * state.ItemScore;
        formState.scholarshipValue =
          data.scholarshipList.length * state.ItemScore;
        formState.violationValue = data.violationList.length * state.ItemScore;
        computedScore();
      });
    };
    // 计算分数
    const computedScore = () => {
      const otherScore =
        Number(formState.classCadrePostValue) +
        Number(formState.competitionValue) +
        Number(formState.helpGoodValue) +
        Number(formState.honorValue) +
        Number(formState.paperValue) +
        Number(formState.patentedInventionValue) +
        Number(formState.scholarshipValue) -
        Number(formState.violationValue);

      formState.totalScore =
        formState.achievementValue * 0.6 + otherScore * 0.4;
    };
    // 数据重置
    const resetValue = () => {
      formState.id = 0;
      formState.sno = '';
      formState.username = '';
      formState.status = 0;
      formState.semesterId = null;
      formState.achievementValue = 0;
      formState.classCadrePostValue = 0;
      formState.competitionValue = 0;
      formState.helpGoodValue = 0;
      formState.honorValue = 0;
      formState.paperValue = 0;
      formState.patentedInventionValue = 0;
      formState.scholarshipValue = 0;
      formState.violationValue = 0;
      formState.totalScore = 0;
      resetFields();
    };
    const init = () => {
      getSemesterList();
      getTableData();
    };
    onMounted(() => {
      init();
    });
    return {
      ...toRefs(state),
      fileList,
      formState,
      validateInfos,
      APPROVAL,
      formRules,
      isInstructor,
      isStudent,
      computedScore,
      handleEdit,
      handleAdd,
      handlePass,
      handleBack,
      handleRemove,
      handleCancel,
      handleSaveAndSubmit,
      handleSave,
      handleGetData,
      handleView,
      handleOk,
      handleChange,
    };
  },
});
</script>
<style lang="scss" scoped>
.container {
  margin: 8px 0;
  .top-operation {
    display: flex;
    justify-content: space-between;
  }
  .col-100 {
    width: 100%;
  }
  .btn {
    margin-right: 8px;
  }
}
</style>