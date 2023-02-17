<template>
  <div class="clearfix">
    <a-upload v-model:file-list="fileList" name="avatar" list-type="picture-card" class="avatar-uploader" :show-upload-list="false" action="#" :before-upload="beforeUpload" :accept="acceptType" :customRequest="handleUpload" v-if="avatar">
      <img class="avatar-img" v-if="imageUrl" :src="imageUrl" alt="avatar" />
      <div v-else>
        <loading-outlined v-if="loading"></loading-outlined>
        <plus-outlined v-else></plus-outlined>
        <div class="ant-upload-text">Upload</div>
      </div>
    </a-upload>
    <a-upload :file-list="fileList" action="#" :accept="acceptType" :customRequest="handleUpload" @remove="handleRemove" v-else>
      <a-button>
        <upload-outlined></upload-outlined>
        选择文件上传
      </a-button>
    </a-upload>
  </div>
</template>
<script lang="ts">
import { UploadOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { defineComponent, ref, toRefs, watchEffect } from 'vue';
import type { UploadProps } from 'ant-design-vue';
import { imagesUpload } from '@/service/service';
import { baseURL } from '@/contents/utils';
export default defineComponent({
  components: {
    UploadOutlined,
  },
  props: {
    avatar: {
      type: Boolean,
      default: () => false,
    },
    url: {
      type: String,
      default: () => '',
    },
    // 上传类型
    acceptType: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, context) {
    const fileList = ref<UploadProps['fileList']>([]);
    const uploading = ref<boolean>(false);
    const imageUrl = ref<string>('');
    watchEffect(
      (onInvalidate) => {
        imageUrl.value = `${baseURL}${props.url}`;
        onInvalidate(() => {});
      },
      {
        flush: 'post',
      }
    );
    imageUrl.value = `${baseURL}${props.url}`;
    const handleRemove: UploadProps['onRemove'] = (file) => {
      // const index = fileList.value.indexOf(file);
      // const newFileList = fileList.value.slice();
      // newFileList.splice(index, 1);
      // fileList.value = newFileList;
    };

    const beforeUpload: UploadProps['beforeUpload'] = (file) => {
      if (props.avatar) {
        const isJpgOrPng =
          file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
          message.error('只能上传jpg格式的图片!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          message.error('图片大小需要小于2MB!');
        }
        return isJpgOrPng && isLt2M;
      }
    };
    const handleUpload = (fileInfo: any) => {
      const formData = new FormData();

      formData.append('file', fileInfo.file);
      if (props.avatar) {
        imagesUpload(formData)
          .then(({ data }) => {
            uploading.value = false;
            imageUrl.value = `${baseURL}${data}`;
            context.emit('success', data);
            message.success('上传文件成功');
          })
          .catch(() => {
            uploading.value = false;
            message.error('上传文件失败');
          });
      }
    };

    return {
      ...toRefs(props),
      fileList,
      imageUrl,
      uploading,
      handleRemove,
      beforeUpload,
      handleUpload,
    };
  },
});
</script>
<style lang="scss" scoped>
.avatar-img {
  width: 100px;
  height: 100px;
  border-radius: 4px;
}
</style>