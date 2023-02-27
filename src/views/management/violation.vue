<template>
  <!-- 违规违纪 -->
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
          <template v-if="column.dataIndex === 'face'">
            <span>{{ politicalOutlook(text) }}</span>
          </template>
          <template v-else-if="column.dataIndex === 'status'">
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
        <a-form-item label="学期" v-bind="validateInfos.semesterId">
          <a-select v-model:value="formState.semesterId" placeholder="请选择学期" :disabled="preview">
            <a-select-option v-for="item in semesterList" :value="item.semesterId" :key="item.semesterId">
              {{ item.semesterName }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="调查人" v-bind="validateInfos.investigator">
          <a-input v-model:value="formState.investigator" placeholder="请填写调查人" :disabled="preview" />
        </a-form-item>
        <a-form-item label="调查部门" v-bind="validateInfos.ncvs">
          <a-input v-model:value="formState.ncvs" placeholder="请填写调查部门" :disabled="preview" />
        </a-form-item>
        <a-form-item label="填表时间" v-bind="validateInfos.fillTime">
          <a-date-picker class="col-100" v-model:value="formState.fillTime" valueFormat="YYYY-MM-DD" placeholder="请填写填表时间" :disabled="preview" />
        </a-form-item>
        <a-form-item label="姓名" v-bind="validateInfos.username">
          <a-input v-model:value="formState.username" placeholder="请填写姓名" :disabled="preview" />
        </a-form-item>
        <a-form-item label="学号" v-bind="validateInfos.sno">
          <a-input v-model:value="formState.sno" placeholder="请填写学号" :disabled="preview" />
        </a-form-item>
        <a-form-item label="班级" v-bind="validateInfos.className">
          <a-input v-model:value="formState.className" placeholder="请填写班级" :disabled="preview" />
        </a-form-item>
        <a-form-item label="年龄" v-bind="validateInfos.age">
          <a-input type="number" v-model:value="formState.age" placeholder="请填写年龄" :disabled="preview" />
        </a-form-item>
        <a-form-item label="性别" v-bind="validateInfos.sex">
          <a-radio-group v-model:value="formState.sex" :disabled="preview">
            <a-radio :value="1">男</a-radio>
            <a-radio :value="2">女</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="家长电话" v-bind="validateInfos.parentPhone">
          <a-input v-model:value="formState.parentPhone" placeholder="请填写家长电话" :disabled="preview" />
        </a-form-item>
        <a-form-item label="家庭住址" v-bind="validateInfos.address">
          <a-input v-model:value="formState.address" placeholder="请填写家庭住址" :disabled="preview" />
        </a-form-item>
        <a-form-item label="违规违纪事实" v-bind="validateInfos.eventDetails">
          <vEdit :value="formState.eventDetails" @change="(val) => handleChange('eventDetails', val)" :readonly="preview"></vEdit>
        </a-form-item>
        <a-form-item label="处理结果" v-bind="validateInfos.processingResults">
          <vEdit :value="formState.processingResults" @change="(val) => handleChange('processingResults', val)" :readonly="preview"></vEdit>
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
import { POLITICAL, APPROVAL, fileDownload } from '@/contents/utils';
import { Modal, Form, message } from 'ant-design-vue';
import { InboxOutlined } from '@ant-design/icons-vue';
import {
  getSemester,
  selectViolation,
  insertViolation,
  deleteViolation,
  updateViolation,
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
      address: '', // 家庭住址
      age: null, // 年龄
      className: '', // 班级
      eventDetails: '', // 违规违纪事实
      fillTime: '', // 填表时间
      id: 0, // 违纪ID
      investigator: '', // 调查人姓名
      ncvs: '', // 调查部门
      parentPhone: '', // 家长电话
      processingResults: '', // 处理结果
      sex: 1, // 性别(1男，2女)
      sno: '', // 学号
      status: 0, // 状态(1新建2审核中3审核通过4审核不通过)
      username: '',
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
          title: '家长电话',
          dataIndex: 'parentPhone',
        },
        {
          title: '家庭住址',
          dataIndex: 'address',
        },
        {
          title: '调查人姓名',
          dataIndex: 'investigator',
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
        return Promise.reject('请输入家长电话');
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
      username: [{ required: true, message: '请输入姓名' }],
      investigator: [{ required: true, message: '请输入调查人姓名' }],
      ncvs: [{ required: true, message: '请输入调查人部门' }],
      sno: [{ required: true, message: '请输入学号' }],
      eventDetails: [{ required: true, message: '请输入违规违纪事实' }],
      className: [{ required: true, message: '请输入班级名称' }],
      parentPhone: [{ required: true, validator: validatePhone }],
      address: [{ required: true, message: '请输入家庭住址' }],
      processingResults: [{ required: true, message: '请输入处理结果' }],
      fillTime: [{ required: true, message: '请输入填表时间' }],
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
      selectViolation(params).then(({ data }) => {
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
          updateViolation(data).then(({ code }) => {
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
          insertViolation(data).then(({ code }) => {
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
          updateViolation(data).then(({ code }) => {
            if (code === 200) {
              message.success('保存成功');
              resetValue();
              getTableData();
              state.visible = false;
            }
          });
        } else {
          insertViolation(data).then(({ code }) => {
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
          deleteViolation(params).then(({ code }) => {
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
      updateViolation(data).then((res) => {
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
      updateViolation(data).then((res) => {
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
      formState.status = 0;
      formState.username = '';
      formState.address = '';
      formState.age = null;
      formState.className = '';
      formState.eventDetails = '';
      formState.fillTime = '';
      formState.investigator = '';
      formState.ncvs = '';
      formState.parentPhone = '';
      formState.processingResults = '';
      formState.sex = 1;
      resetFields();
    };
    // 数据更改
    const handleChange = (type: string, val: any) => {
      switch (type) {
        case 'processingResults':
          formState[type] = val;
          break;
        case 'eventDetails':
          formState[type] = val;
          break;
        default:
          break;
      }
    };
    const politicalOutlook = (result: string) => {
      return (POLITICAL.find((e) => e.code === result) || {}).name;
    };
    // 移除
    const handleFileRemove = (file: any) => {
      const index = fileList.value.indexOf(file);
      const newFileList = fileList.value.slice();
      newFileList.splice(index, 1);
      fileList.value = newFileList;
      const materialist = state.material.slice();
      materialist.splice(index, 1);
      state.material = materialist;
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
      POLITICAL,
      fileList,
      formState,
      validateInfos,
      APPROVAL,
      formRules,
      isInstructor,
      isStudent,
      politicalOutlook,
      handleEdit,
      handleAdd,
      handlePass,
      handleBack,
      handleRemove,
      handleCancel,
      handleSaveAndSubmit,
      handleSave,
      handleFileRemove,
      handleGetData,
      handleView,
      handleOk,
      handleChange,
    };
  },
});
</script>
<style lang="scss" scoped>
.col-100 {
  width: 100%;
}
.container {
  margin: 8px 0;
  .top-operation {
    display: flex;
    justify-content: space-between;
  }
  .btn {
    margin-right: 8px;
  }
}
</style>