<template>
  <div class="clearfix">
    <!-- 头像 -->
    <a-upload
      v-model:file-list="fileList"
      name="avatar"
      list-type="picture-card"
      :class="{
        'avatar-uploader': avatar === 'avatar',
        'carousel-uploader': avatar === 'carousel',
      }"
      :show-upload-list="false"
      action="#"
      :before-upload="beforeUpload"
      :accept="acceptType"
      :customRequest="handleUpload"
      v-if="['avatar', 'carousel'].includes(avatar)"
    >
      <img
        class="avatar-img"
        v-if="imageUrl && avatar === 'avatar'"
        :src="imageUrl"
        alt="avatar"
      />
      <img
        class="carousel-img"
        v-else-if="imageUrl && avatar === 'carousel'"
        :src="imageUrl"
        alt="avatar"
      />
      <div v-else>
        <plus-outlined></plus-outlined>
      </div>
    </a-upload>
    <a-upload
      v-model:file-list="fileList"
      name="file"
      action="#"
      :customRequest="handleChange"
      :accept="acceptType"
      :showUploadList="false"
      v-else
    >
      <a-button> 选择文件上传 </a-button>
    </a-upload>
  </div>
</template>
<script lang="ts">
import { PlusOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { defineComponent, reactive, ref, toRefs, watchEffect } from "vue";
import type { UploadProps } from "ant-design-vue";
import { imagesUpload } from "@/service/service";
import { baseURL } from "@/contents/utils";
export default defineComponent({
  components: {
    PlusOutlined,
  },
  props: {
    avatar: {
      type: String,
      default: () => "",
    },
    url: {
      type: String,
      default: () => "",
    },
    // 上传类型
    acceptType: {
      type: String,
      default: () => "",
    },
    callBack: {
      type: Function,
    },
  },
  setup(props, context) {
    let fileList: any = reactive([]);
    const uploading = ref<boolean>(false);
    const imageUrl = ref<string>("");

    watchEffect(
      (onInvalidate) => {
        if (props.url) {
          imageUrl.value = `${baseURL}${props.url}`;
        } else {
          imageUrl.value = "";
        }
        onInvalidate(() => {});
      },
      {
        flush: "post",
      }
    );
    imageUrl.value = `${baseURL}${props.url}`;

    const beforeUpload: UploadProps["beforeUpload"] = (file) => {
      if (props.avatar === "avatar") {
        const isJpgOrPng =
          file.type === "image/jpeg" || file.type === "image/png";
        if (!isJpgOrPng) {
          message.error("只能上传jpg格式的图片!");
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          message.error("图片大小需要小于2MB!");
        }
        return isJpgOrPng && isLt2M;
      }
    };
    const handleUpload = (fileInfo: any) => {
      const formData = new FormData();
      formData.append("file", fileInfo.file);
      imagesUpload(formData)
        .then(({ data }) => {
          uploading.value = false;
          imageUrl.value = `${baseURL}${data}`;
          context.emit("success", data);
          message.success("上传文件成功");
        })
        .catch(() => {
          uploading.value = false;
          message.error("上传文件失败");
        });
    };
    const handleChange = (info: any) => {
      if (info.file.status !== "uploading") {
        if (props.callBack) {
          props
            .callBack(info.file)
            .then((res: any) => {
              context.emit("success");
              message.success(`${info.file.name} 文件上传成功`);
            })
            .catch(() => {
              message.error(`${info.file.name} 文件上传失败`);
            });
        }
      }
    };

    return {
      ...toRefs(props),
      fileList,
      imageUrl,
      uploading,
      beforeUpload,
      handleUpload,
      handleChange,
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
.carousel-uploader {
  :deep(.ant-upload.ant-upload-select-picture-card) {
    width: 300px;
    height: 150px;
  }
}
.carousel-img {
  width: 300px;
  height: 150px;
  border-radius: 4px;
}
</style>