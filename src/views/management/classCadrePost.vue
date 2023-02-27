<template>
  <!-- 竞赛参赛 -->
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
    <a-table bordered :columns="columns" :data-source="data" :pagination="pagination">
      <template #bodyCell="{ column, text, record }">
        <div>
          <template v-if="column.dataIndex === 'status'">
            <span>{{ APPROVAL[text] }}</span>
          </template>
          <template v-else-if="column.dataIndex === 'runForOffice1'">
            <span>{{ runForOffice(text) }}</span>
          </template>
          <template v-else-if="column.dataIndex === 'runForOffice2'">
            <span>{{ runForOffice(text) }}</span>
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
              <a-button type="link" class="btn" @click="handleEdit(record)">编辑</a-button>
              <a-button type="link" danger class="btn" @click="handleRemove(record)">删除</a-button>
            </template>
          </div>
        </template>
      </template>
    </a-table>
    <!-- 材料填报弹窗 -->
    <a-modal :title="!preview ? '材料填写' : '详情'" width="1300px" v-model:visible="visible" destroyOnClose>
      <a-form ref="form" :model="formState" :rules="formRules" :label-col="{ span: 8 }" :wrapper-col="{ span: 8 }">
        <a-form-item label="学期" v-bind="validateInfos.semesterId">
          <a-select v-model:value="formState.semesterId" placeholder="请选择学期" :disabled="preview">
            <a-select-option v-for="item in semesterList" :value="item.semesterId" :key="item.semesterId">
              {{ item.semesterName }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="姓名" v-bind="validateInfos.username">
          <a-input v-model:value="formState.username" placeholder="请填写姓名" :disabled="preview" />
        </a-form-item>
        <a-form-item label="学号" v-bind="validateInfos.sno">
          <a-input v-model:value="formState.sno" placeholder="请填写学号" :disabled="preview" />
        </a-form-item>
        <a-form-item label="性别" v-bind="validateInfos.sex">
          <a-radio-group v-model:value="formState.sex" :disabled="preview">
            <a-radio :value="1">男</a-radio>
            <a-radio :value="2">女</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="所在班级" v-bind="validateInfos.className">
          <a-input v-model:value="formState.className" placeholder="请填写所在班级" :disabled="preview" />
        </a-form-item>
        <a-form-item label="手机号" v-bind="validateInfos.phone">
          <a-input v-model:value="formState.phone" placeholder="请填写手机号" :disabled="preview" />
        </a-form-item>
        <a-form-item label="宿舍" v-bind="validateInfos.dormitory">
          <a-input v-model:value="formState.dormitory" placeholder="请填写宿舍" :disabled="preview" />
        </a-form-item>
        <a-form-item label="政治面貌" v-bind="validateInfos.politicalOutlook">
          <a-select v-model:value="formState.politicalOutlook" placeholder="请选择政治面貌" :disabled="preview">
            <a-select-option v-for="item in POLITICAL" :value="item.code" :key="item.code">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="综测排名" v-bind="validateInfos.ranking">
          <a-input v-model:value="formState.ranking" placeholder="综测排名" :disabled="preview" />
        </a-form-item>
        <a-form-item label="上学期补考情况">
          <a-input v-model:value="formState.lastMake" placeholder="请填写补考情况" :disabled="preview" />
        </a-form-item>
        <a-form-item label="现任职务">
          <a-select v-model:value="formState.currentPosition" placeholder="请选择职务" :disabled="preview">
            <a-select-option v-for="item in STUDENT_POSITION" :value="item.code" :key="item.code">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="是否服从调剂" v-bind="validateInfos.adjustment">
          <a-radio-group v-model:value="formState.adjustment" :disabled="preview">
            <a-radio :value="1">是</a-radio>
            <a-radio :value="0">否</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="竞选职务1" v-bind="validateInfos.runForOffice1">
          <a-select v-model:value="formState.runForOffice1" placeholder="请选择职务" :disabled="preview">
            <a-select-option v-for="item in STUDENT_POSITION" :value="item.code" :key="item.code">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="竞选职务2">
          <a-select v-model:value="formState.runForOffice2" placeholder="请选择职务" :disabled="preview">
            <a-select-option v-for="item in STUDENT_POSITION" :value="item.code" :key="item.code">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="对竞选职务认识">
          <a-input v-model:value="formState.jobAwareness" placeholder="请填写对竞选职务认识" :disabled="preview" />
        </a-form-item>
        <a-form-item label="主要事迹">
          <vEdit :value="formState.mainDeeds" @change="(val) => handleChange('mainDeeds', val)" :readonly="preview"></vEdit>
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
import { POLITICAL, STUDENT_POSITION, APPROVAL } from '@/contents/utils';
import { Modal, Form, message } from 'ant-design-vue';
import { InboxOutlined } from '@ant-design/icons-vue';
import {
  getSemester,
  selectClassCadrePost,
  insertClassCadrePost,
  deleteClassCadrePost,
  updateClassCadrePost,
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
      semesterId: '',
      adjustment: 1, // 服从调剂(1是，2否)
      className: '', // 班级名称
      currentPosition: '', // 现任职务
      dormitory: '', // 宿舍
      id: 0, // 班干部任职id
      jobAwareness: '', // 对竞选职务认识
      lastMake: '', // 上学期补考情况
      mainDeeds: '', // 主要事迹
      opinion: '', // 意见
      phone: '', // 手机号码
      politicalOutlook: '', // 政治面貌
      ranking: '', // 综测排名
      runForOffice1: '', // 竞选职务1
      runForOffice2: '', // 竞选职务2
      sex: 1, // 性别(1男，2女)
      sno: '', // 学号
      speciality: '',
      status: 0, // 状态(1新建2审核中3审核通过4审核不通过)
      username: '', // 姓名
    });
    const state = reactive({
      status: 3, // 单据状态
      acceptType: '.doc,.docx,.pdf,image/*',
      modify: false,
      visible: false, // 填写弹窗
      preview: false, // 详情弹窗
      approvalVisible: false, // 材料上传
      columns: [
        {
          title: '姓名',
          dataIndex: 'username',
        },
        {
          title: '学号',
          dataIndex: 'sno',
        },
        {
          title: '竞选职务1',
          dataIndex: 'runForOffice1',
        },
        {
          title: '竞选职务2',
          dataIndex: 'runForOffice2',
        },
        {
          title: '审核状态',
          dataIndex: 'status',
        },
        {
          title: '操作',
          dataIndex: 'operation',
        },
      ],
      data: [],
      material: [] as any,
      semesterList: [], // 学期列表
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
    // 校验手机号方法
    const validatePhone = async (rule: any, value: any) => {
      if (!value) {
        return Promise.reject('请输入手机号');
      }
      const reg =
        /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      // 查是否输入的是手机号 11位数字
      if (reg.test(value)) {
        return Promise.resolve();
      } else {
        return Promise.reject('请输入有效的手机号');
      }
    };
    // 表单校验规则
    const formRules = reactive({
      semesterId: [{ required: true, message: '请选择学期' }],
      sno: [{ required: true, message: '请输入学号' }],
      username: [{ required: true, message: '请输入用户名' }],
      phone: [{ required: true, validator: validatePhone }],
      politicalOutlook: [{ required: true, message: '请选择政治面貌' }],
      dormitory: [{ required: true, message: '请输入宿舍' }],
      className: [{ required: true, message: '请输入班级' }],
      ranking: [{ required: true, message: '请输入综合排名' }],
      adjustment: [{ required: true, message: '请选择是否服从调剂' }],
      runForOffice1: [{ required: true, message: '请选择竞选职务' }],
    });
    const { resetFields, validate, validateInfos } = useForm(
      formState,
      formRules
    );
    const runForOffice = (value: any) => {
      return (STUDENT_POSITION.find((e) => e.code === value) || {}).name;
    };
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
      selectClassCadrePost(params).then(({ data }) => {
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
    // 数据更改
    const handleChange = (type: string, val: any) => {
      switch (type) {
        case 'mainDeeds':
          formState[type] = val;
          break;
        default:
          break;
      }
    };
    // 保存材料并提交审批
    const handleSaveAndSubmit = () => {
      validate().then(async () => {
        const data = cloneDeep(formState);
        data.status = 2;
        if (state.modify) {
          updateClassCadrePost(data).then(({ code }) => {
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
          insertClassCadrePost(data).then(({ code }) => {
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
          updateClassCadrePost(data).then(({ code }) => {
            if (code === 200) {
              message.success('保存成功');
              resetValue();
              getTableData();
              state.visible = false;
            }
          });
        } else {
          insertClassCadrePost(data).then(({ code }) => {
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
          deleteClassCadrePost(params).then(({ code }) => {
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
      updateClassCadrePost(data).then((res) => {
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
      updateClassCadrePost(data).then((res) => {
        if (res.code === 200) {
          getTableData();
          message.success('退回成功');
        }
      });
    };
    // 数据重置
    const resetValue = () => {
      formState.id = 0;
      formState.sno = '';
      formState.status = 1;
      formState.adjustment = 1;
      formState.className = '';
      formState.currentPosition = '';
      formState.dormitory = '';
      formState.jobAwareness = '';
      formState.lastMake = '';
      formState.mainDeeds = '';
      formState.opinion = '';
      formState.phone = '';
      formState.politicalOutlook = '';
      (formState.ranking = ''), (formState.runForOffice1 = '');
      formState.runForOffice2 = '';
      (formState.sex = 1), (formState.speciality = '');
      formState.username = '';
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
      runForOffice,
      STUDENT_POSITION,
      POLITICAL,
      APPROVAL,
      formRules,
      isInstructor,
      isStudent,
      handleChange,
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