<template>
  <div :style="{ width: containerWidth }">
    <!-- 富文本编辑器 -->
    <textarea
      :id="tinymceId"
      :style="{ visibility: 'hidden' }"
      ref="textEdit"
    ></textarea>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  unref,
  computed,
  onDeactivated,
  onBeforeUnmount,
  onMounted,
  watch,
} from "vue";
import tinymce from "tinymce/tinymce";
import type { Editor } from 'tinymce';
import {
  buildShortUUID,
  toolbar,
  plugins,
  checkValueType,
  PUBLIC_PATH,
} from "@/contents/utils";
// css
import "tinymce/themes/silver";
import "tinymce/icons/default/icons";
import "tinymce/plugins/advlist";
import "tinymce/plugins/anchor";
import "tinymce/plugins/autolink";
import "tinymce/plugins/autosave";
import "tinymce/plugins/code";
import "tinymce/plugins/codesample";
import "tinymce/plugins/directionality";
import "tinymce/plugins/fullscreen";
import "tinymce/plugins/hr";
import "tinymce/plugins/insertdatetime";
import "tinymce/plugins/link";
import "tinymce/plugins/lists";
import "tinymce/plugins/media";
import "tinymce/plugins/nonbreaking";
import "tinymce/plugins/noneditable";
import "tinymce/plugins/pagebreak";
import "tinymce/plugins/paste";
import "tinymce/plugins/preview";
import "tinymce/plugins/print";
import "tinymce/plugins/save";
import "tinymce/plugins/searchreplace";
import "tinymce/plugins/spellchecker";
import "tinymce/plugins/tabfocus";
import "tinymce/plugins/template";
import "tinymce/plugins/textpattern";
import "tinymce/plugins/visualblocks";
import "tinymce/plugins/visualchars";
import "tinymce/plugins/wordcount";

export default defineComponent({
  props: {
    // 编辑器高
    height: {
      type: [String, Number],
      default: 400,
    },
    // 编辑器宽
    width: {
      type: [String, Number],
      default: 800,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
      default: "",
    },
  },
  setup(props, { emit, attrs }) {
    type Nullable<T> = T | null;
    const tinymceId = ref<string>(buildShortUUID("tiny"));
    const editorRef = ref<Nullable<Editor>>(null);
    const textEdit = ref<Nullable<HTMLElement>>(null);
    const containerWidth = computed(() => {
      const width = props.width;
      if (checkValueType(width, "Number")) {
        return `${width}px`;
      }
      return width;
    });
    const Options = computed(() => {
      return {
        selector: `#${unref(tinymceId)}`,
        readonly: props.readonly,
        plugins,
        toolbar,
        language: "zh_CN",
        language_url: PUBLIC_PATH + "tinymce/langs/zh_CN.js",
        skin_url: PUBLIC_PATH + "tinymce/skins/ui/oxide",
        content_css: PUBLIC_PATH + "tinymce/skins/ui/oxide/content.min.css",
        branding: false,
        menu: {
          file: { title: "文件", items: "newdocument" },
          edit: {
            title: "编辑",
            items: "undo redo | cut copy paste pastetext | selectall",
          },
          insert: { title: "插入", items: "link media | template hr" },
          view: { title: "查看", items: "visualaid" },
          format: {
            title: "格式",
            items:
              "bold italic underline strikethrough superscript subscript | formats | removeformat",
          },
          table: {
            title: "表格",
            items: "inserttable tableprops deletetable | cell row column",
          },
          tools: { title: "工具", items: "spellchecker code" },
        },
        setup: (editor: any) => {
          editorRef.value = editor;
          editor.on("init", (e: any) => initSetup(e));
        },
      };
    });
    // 初始化赋值
    const initSetup = (e: any) => {
      const editor = unref(editorRef);
      if (!editor) return;
      bindModelHandlers(editor);
    };

    const bindModelHandlers = (editor: any) => {
      const modelEvents = attrs.modelEvents ? attrs.modelEvents : null;
      const normalizedEvents = Array.isArray(modelEvents)
        ? modelEvents.join(" ")
        : modelEvents;
      watch(
        () => props.value,
        (val, prevVal) => {
          setValue(editor, val, prevVal);
        },
        {
          immediate: true,
        }
      );
      editor.on(
        normalizedEvents ? normalizedEvents : "change keyup undo redo",
        () => {
          const content = editor.getContent({ format: attrs.outputFormat });
          emit("update:modelValue", content);
          emit("change", content);
        }
      );
    };
    function setValue(editor: any, val: string, prevVal?: string) {
      if (
        editor &&
        typeof val === "string" &&
        val !== prevVal &&
        val !== editor.getContent({ format: attrs.outputFormat })
      ) {
        editor.setContent(val);
      }
    }
    // 初始化富文本编辑器
    const init = () => {
      const el = unref(textEdit);
      if (el) {
        el.style.visibility = "";
      }
      tinymce
        .init(unref(Options))
        .then((editor) => {
          emit("inited", editor);
        })
        .catch((err) => {
          emit("init-error", err);
        });
    };
    function destory() {
      if (tinymce !== null) {
        tinymce?.remove?.(unref(Options).selector!);
      }
    }
    onBeforeUnmount(() => {
      destory();
    });

    onDeactivated(() => {
      destory();
    });
    onMounted(() => {
      init();
    });
    return {
      tinymceId,
      containerWidth,
      textEdit,
    };
  },
});
</script>