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
          <template v-else-if="column.dataIndex === 'politicalOutlook'">
            <span>{{ politicalOutlook(text) }}</span>
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
        <a-form-item label="出生年月" v-bind="validateInfos.birth">
          <a-date-picker class="col-100" v-model:value="formState.birth" valueFormat="YYYY-MM-DD" placeholder="请选择出生年月" :disabled="preview" />
        </a-form-item>
        <a-form-item label="学校" v-bind="validateInfos.school">
          <a-input v-model:value="formState.school" placeholder="请填写所在学校" :disabled="preview" />
        </a-form-item>
        <a-form-item label="所在班级" v-bind="validateInfos.className">
          <a-input v-model:value="formState.className" placeholder="请填写所在班级" :disabled="preview" />
        </a-form-item>
        <a-form-item label="民族" v-bind="validateInfos.nation">
          <a-select v-model:value="formState.nation" placeholder="请选择民族" :disabled="preview">
            <a-select-option v-for="item in NATION" :value="item.code" :key="item.code">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="入学时间" v-bind="validateInfos.admissionTime">
          <a-date-picker class="col-100" v-model:value="formState.admissionTime" valueFormat="YYYY-MM-DD" placeholder="请选择入学时间" :disabled="preview" />
        </a-form-item>
        <a-form-item label="身份证号" v-bind="validateInfos.cardId">
          <a-input v-model:value="formState.cardId" placeholder="请填写身份证号" :disabled="preview" />
        </a-form-item>
        <a-form-item label="政治面貌" v-bind="validateInfos.politicalOutlook">
          <a-select v-model:value="formState.politicalOutlook" placeholder="请选择政治面貌" @change="handleChange" :disabled="preview">
            <a-select-option v-for="item in POLITICAL" :value="item.code" :key="item.code">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="联系电话" v-bind="validateInfos.telephone">
          <a-input v-model:value="formState.telephone" placeholder="请填写联系电话" :disabled="preview" />
        </a-form-item>
        <a-form-item label="学习等情况">
          <vEdit :value="formState.learning" @change="(val) => handleChange('learning', val)" :readonly="preview"></vEdit>
        </a-form-item>
        <a-form-item label="大学期间主要获奖情况">
          <vEdit :value="formState.awards" @change="(val) => handleChange('awards', val)" :readonly="preview"></vEdit>
        </a-form-item>
        <a-form-item label="申请理由">
          <vEdit :value="formState.applyReason" @change="(val) => handleChange('applyReason', val)" :readonly="preview"></vEdit>
        </a-form-item>
        <a-form-item label="材料">
          <a-upload-dragger :value="formState.material" :file-list="fileList" name="file" :multiple="true" action="#" :before-upload="beforeUpload" @remove="handleFileRemove" v-if="!preview">
            <p class="ant-upload-drag-icon">
              <inbox-outlined></inbox-outlined>
            </p>
            <p class="ant-upload-text">点击或者拖拽上传</p>
            <p class="ant-upload-hint">支持单个或批量上传</p>
          </a-upload-dragger>
          <div v-else>
            <div class="poi" v-for="(file, index) in fileList" :key="index" @click="hanldeDownload(file)">
              {{ file.name }}
            </div>
          </div>
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
import {
  POLITICAL,
  STUDENT_POSITION,
  NATION,
  SEX,
  APPROVAL,
  fileDownload,
} from '@/contents/utils';
import { Modal, Form, message } from 'ant-design-vue';
import { InboxOutlined } from '@ant-design/icons-vue';
import {
  getSemester,
  selectScholarship,
  insertScholarship,
  deleteScholarship,
  modifyScholarship,
  fileUpload,
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
      username: '', // 姓名
      sno: '', // 学号
      sex: 1, // (1男，2女)
      position: '',
      admissionTime: '', // 入学时间
      applyReason: '', // 申请理由
      applyType: 0, // 申请类型 (1.填报，2.文件)
      awards: '', // 获奖情况
      birth: '', // 出生年月
      cardId: '', // 身份证号
      className: '', // 班级
      id: 0, // 奖学金id
      learning: '', //学习情况
      material: '', // 相关材料地址，可用小写,号分割
      nation: '', // 民族
      politicalOutlook: '', //政治面貌
      school: '', // 学校
      status: 1, // 状态(1新建2审核中3审核通过4审核不通过)
      telephone: '', // 联系电话
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
          title: '政治面貌',
          dataIndex: 'politicalOutlook',
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
    // 校验身份证号
    const validateCardId = (rule: any, value: any) => {
      if (!value) {
        return Promise.reject('请输入身份证号');
      }
      const id_18 =
        /^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
      const id_15 =
        /^([1-6][1-9]|50)\d{4}\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}$/;
      if (id_18.test(value) || id_15.test(value)) {
        return Promise.resolve();
      } else {
        return Promise.reject('请输入正确的身份证号');
      }
    };
    // 表单校验规则
    const formRules = reactive({
      semesterId: [{ required: true, message: '请选择学期' }],
      sno: [{ required: true, message: '请输入学号' }],
      sex: [{ required: true, message: '请选择性别' }],
      username: [{ required: true, message: '请输入用户名' }],
      telephone: [{ required: true, validator: validatePhone }],
      learning: [{ required: true, message: '请输入学习情况' }],
      nation: [{ required: true, message: '请选择民族' }],
      politicalOutlook: [{ required: true, message: '请选择政治面貌' }],
      school: [{ required: true, message: '请输入学校' }],
      className: [{ required: true, message: '请输入班级' }],
      cardId: [
        {
          required: true,
          message: '请输入身份证号',
          validator: validateCardId,
        },
      ],
      birth: [{ required: true, message: '请选择出生日期' }],
      applyReason: [{ required: true, message: '请输入申请原因' }],
      admissionTime: [{ required: true, message: '请选择入学时间' }],
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
      selectScholarship(params).then(({ data }) => {
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
        case 'learning':
          formState[type] = val;
          break;
        case 'awards':
          formState[type] = val;
          break;
        case 'applyReason':
          formState[type] = val;
          break;
        case 'sex':
          break;
        default:
          break;
      }
    };
    // 保存材料并提交审批
    const handleSaveAndSubmit = () => {
      validate().then(async () => {
        await handleUpload();
        formState.material = state.material.reduce(
          (sum: string, item: any, index: any) => {
            return (sum +=
              state.material.length - 1 === index ? item : item + ',');
          },
          ''
        );
        const data = cloneDeep(formState);
        data.status = 2;
        if (state.modify) {
          modifyScholarship(data).then(({ code }) => {
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
          insertScholarship(data).then(({ code }) => {
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
    const politicalOutlook = (result: string) => {
      return (POLITICAL.find((e) => e.code === result) || {}).name;
    };
    // 学生编辑材料
    const handleEdit = (record: any) => {
      state.material = [];
      fileList.value = [];
      Object.assign(formState, record);
      state.material =
        formState.material.length > 0 ? formState.material.split(',') : [];
      state.material.forEach((element: string) => {
        const arr = element.split('/');
        const name = arr[arr.length - 1];
        fileList.value = [
          ...fileList.value,
          { name: name, url: element, success: true },
        ];
      });
      state.preview = false;
      state.modify = true;
      state.visible = true;
    };
    // 辅导员查看详情
    const handleView = (record: any) => {
      state.material = [];
      fileList.value = [];
      state.preview = true;
      Object.assign(formState, record);
      state.material =
        formState.material.length > 0 ? formState.material.split(',') : [];
      state.material.forEach((element: string) => {
        const arr = element.split('/');
        const name = arr[arr.length - 1];
        fileList.value = [
          ...fileList.value,
          { name: name, url: element, success: true },
        ];
      });
      state.visible = true;
    };
    const handleOk = () => {
      state.preview = false;
      state.visible = false;
    };
    // 下载材料
    const hanldeDownload = (file: any) => {
      fileDownload(file.url);
    };
    // 保存填写材料
    const handleSave = async () => {
      validate().then(async () => {
        await handleUpload();
        formState.material = state.material.reduce(
          (sum: string, item: any, index: any) => {
            return (sum +=
              state.material.length - 1 === index ? item : item + ',');
          },
          ''
        );
        const data = cloneDeep(formState);
        data.status = 1;
        if (state.modify) {
          modifyScholarship(data).then(({ code }) => {
            if (code === 200) {
              message.success('保存成功');
              resetValue();
              getTableData();
              state.visible = false;
            }
          });
        } else {
          insertScholarship(data).then(({ code }) => {
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
          deleteScholarship(params).then(({ code }) => {
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
      modifyScholarship(data).then((res) => {
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
      modifyScholarship(data).then((res) => {
        if (res.code === 200) {
          getTableData();
          message.success('退回成功');
        }
      });
    };
    // 数据重置
    const resetValue = () => {
      formState.username = '';
      formState.sno = '';
      formState.sex = 1;
      formState.position = '';
      formState.admissionTime = '';
      formState.applyReason = '';
      formState.applyType = 1;
      formState.awards = '';
      formState.birth = '';
      formState.cardId = '';
      formState.className = '';
      formState.id = 0;
      formState.learning = '';
      formState.material = '';
      formState.nation = '';
      formState.politicalOutlook = '';
      formState.school = '';
      formState.status = 1;
      formState.telephone = '';
      resetFields();
    };
    // 上传前
    const beforeUpload = (file: any) => {
      fileList.value = [...fileList.value, file];
      return false;
    };
    // 上传
    const handleUpload = async () => {
      for (let index = 0; index < fileList.value.length; index++) {
        const file = fileList.value[index];
        if (!file.success) {
          const formData = new FormData();
          formData.append('file', file);
          await fileUpload(formData)
            .then((res) => {
              if (res.code === 200 && res.data) {
                state.material = [...state.material, res.data];
              }
            })
            .catch((err) => {
              message.error(`第${index + 1}个文件上传失败，请重试`);
            });
        }
      }
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
      STUDENT_POSITION,
      NATION,
      SEX,
      fileList,
      politicalOutlook,
      formState,
      validateInfos,
      APPROVAL,
      formRules,
      isInstructor,
      isStudent,
      beforeUpload,
      handleChange,
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
      hanldeDownload,
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