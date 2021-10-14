<template>
  <div class="home" style="background-color: #fff">
    <l-text text="2222" font-size="55px"></l-text>
    <l-image src="https://img.alicdn.com/imgextra/i2/2096790679/O1CN01n65ip21Gt1cQRMcI1_!!2096790679.jpg" width="250px"></l-image>
    <uploader
      url="http://127.0.0.1:3001/upload"
      input-name="file"
      :beforeUpload="beforeUpload"
      :disabled="false"
      :showFileList="true"
      style="max-width: 360px"
      :autoUpload="true"
      ref="uploadRef"
      accept=""
      :multiple="true"
      @on-remove="onRemove"
      drag
      :extraData="{name: 'fjt'}"
      :uploadRequestHeader="{token: 'fesssa'}"
    >
      <template #tips>
        <span>只能上传 jpg/png 文件，且不超过 500kb</span>
      </template>
    </uploader>
    <el-button type="primary" @click="triggerUpload"> 手动触发上传 </el-button>
    <el-upload
      class="upload-demo"
      action="https://jsonplaceholder.typicode.com/posts/"
      multiple
      :limit="3"
      :autoUpload="false"
    >
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>
    <el-upload
      action="https://jsonplaceholder.typicode.com/posts/"
      list-type="picture-card"
      disabled
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <input type="color" v-model="color" @input="colorEvent" />
    <template-lists :templates="templates" v-if="0"></template-lists>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import { useStore } from 'vuex';
import { GlobalStoreStateProps } from '../store/index';
import TemplateLists from '@/components/TemplateLists.vue';
import Uploader from '@/components/Upload.vue';
import { ElMessage } from 'element-plus';

export default defineComponent({
  name: 'Home',
  components: {
    TemplateLists,
    Uploader,
  },
  setup() {
    const store = useStore<GlobalStoreStateProps>();

    // const templates = computed<TemplateListsProps>(
    //   () => store.getters['template/getLists']
    // );
    const templates = computed(() => store.state.template.lists);
    // const num = computed(() => store.state.template.num);
    const color = ref('');
    const colorEvent = (e): void => {
      console.log(e);
    };
    const beforeUpload = (file) => {
      const limitSize = 1; // 单位M
      if (!file.size) {
        ElMessage('禁止上传空文件！');
        return;
      }
      if (file.size > limitSize * 1024 * 1024) {
        ElMessage(`禁止上传超过${limitSize}M文件！`);
        return;
      }
      return true;
    };

    const uploadRef = ref();

    const triggerUpload = () => {
      uploadRef.value.fileUpload();
    };
    const onRemove = (file) => {
      console.log(file);
    };
    return {
      templates,
      color,
      colorEvent,
      beforeUpload,
      uploadRef,
      triggerUpload,
      onRemove
    };
  },
});
</script>
