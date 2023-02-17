<template>
  <!-- 助人为乐材料分保存  送审 -->
  <div>
    <!-- 填报按钮 -->
    <a-button @click="handleAdd">填报</a-button>
    <!-- 审批列表 -->
    <a-table :columns="columns" :data-source="data">
      <!-- 学生编辑材料，重新提交审批 -->
      <a-button @click="handleEdit">编辑</a-button>
      <!-- 保存未送审的展示该按钮 -->
      <a-button @click="hadnleSubmit">送审</a-button>
      <!-- 辅导员 -->
      <a-button type="text" @click="hadnleApproval">审批</a-button>
    </a-table>

    <!-- 材料填报弹窗 -->
    <a-model title="材料填写">
      <a-form >
        <a-form-item label="姓名" has-feedback validate-status="error" help="姓名不能为空">
          <a-input v-model.value="form.username" placeholder="请填写姓名" />
        </a-form-item>
        <a-form-item label="学号" has-feedback validate-status="error" help="学号不能为空">
          <a-input v-model.value="form.username" placeholder="请填写学号" />
        </a-form-item>
      </a-form>
      <!-- 操作按钮 -->
      <div>
        <a-button @click="handleCancel">取消</a-button>
        <a-button @click="handleSave">保存</a-button>
        <a-button @click="handleSaveAndSubmit">保存并送审</a-button>
        <a-button @click="hadnleSubmit">送审</a-button>
      </div>
    </a-model>
    <!-- 审批弹窗 -->
    <a-model title="审批">
      <!-- 申请详情 -->

      <!-- 审批操作 -->
      <a-button @click="handleBack">退回</a-button>
      <a-button @click="handlePass">通过</a-button>
    </a-model>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive } from 'vue'
export default defineComponent({
  setup() {
    const state = reactive({
      columns: [
      ],
      data: [], // 列表数据
    })
    // 获取列表数据  学生  辅导员
    const getTableData = () => {
      const params = {}
    }
    // 填报奖学金
    const handleAdd = () => {

    }
    // 保存填写材料
    const handleSave = () => {

    }
    // 取消填写
    const handleCancel = () => {

    }
    // 保存材料并提交审批
    const handleSaveAndSubmit = () => {

    }
    // 学生编辑材料
    const handleEdit = () => {

    }
    // 学生提交材料
    const hadnleSubmit = () => {

    }
    // 审批 
    const hadnleApproval = () => {

    }
    // 审批通过
    const handlePass = () => {

    }
    // 审批退回
    const handleBack = () => {

    }
    return {
      ...state,
      handleAdd,
      hadnleApproval,
      handleBack,
      handlePass,
      handleSave,
      handleCancel,
      handleSaveAndSubmit,
      handleEdit,
      hadnleSubmit
    }
  }
})
</script>