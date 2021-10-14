<template>
  <layout class="edit" :hasFooter="false">
    <el-row :gutter="20" class="full-height">
      <el-col :span="7" class="edit-left">
        <div class="edit-left-wrapper">
        <ComponentsList :list="coms" @leftComponentClick="leftComponentClick" />
        </div>
      </el-col>
      <el-col :span="10" class="edit-canvas">
        <div class="edit-canvas-wrapper">
          <EditItem
            v-for="item in components"
            :key="item.id"
            :id="item.id"
            @setActive="setActive"
            :active="currentElement && currentElement.id === item.id"
          >
            <component :is="item.name" v-bind="item.props" :is-edit="true"></component>
          </EditItem>
        </div>
      </el-col>
      <el-col :span="7" class="edit-props">
        <div class="edit-props-wrapper">
        
        <PropsTable
          v-if="currentElement && currentElement.props"
          :props="currentElement.props"
          @updateProps="updateProps"
        ></PropsTable>
        <pre>
          {{ currentElement && currentElement.props }}
        </pre>
        </div>
      </el-col>
    </el-row>
  </layout>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from 'vue';
import Layout from '@/components/Layout.vue';
// import LText from '@/components/LText.vue';
// import LImage from '@/components/LImage.vue';
import { useStore } from 'vuex';
import { GlobalStoreStateProps } from '@/store';
import ComponentsList from '@/components/ComponentsList.vue';
import { componentsList } from '@/componentsList';
import EditItem from '@/components/EditItem.vue';
import { ComponentsData } from '@/store/editor';
import PropsTable from '@/components/PropsTable.vue';


export default defineComponent({
  components: {
    Layout,
    // LText,
    // LImage,
    ComponentsList,
    EditItem,
    PropsTable,
    
  },
  setup() {
    const store = useStore<GlobalStoreStateProps>();
    const components = computed(() => store.state.editor.components);
    const coms = reactive(componentsList);

    const leftComponentClick = <T extends { [key: string]: any }>(e: T) => {
      store.commit('editor/addComponent', e);
    };

    const setActive = (componentId: string): void => {
      store.commit('editor/setActive', componentId);
    };

    // 对比上面定义 泛型写法 与下面 赋值 引用另外定义好的函数 泛型写法
    const currentElement = computed<ComponentsData | null>(
      () => store.getters['editor/getCurrentElement']
    );

    const updateProps = (data: { key: string; value: any }): void => {
      store.commit('editor/updateComponentProps', data);
    };
    // const color = ref('#ff0000');
    // const predefine = reactive([
    //     '#ffffff',
    //     '#F5222D',
    //     '#FA541C',
    //     '#FADB14',
    //     '#52C41A',
    //     '#1890FF',
    //     '#722ED1',
    //     '#8C8C8C',
    //     '#000000',
    //     'rgba(255,255,255, 0)'
    //   ]);
    return {
      // 画布上组件
      components,
      // 左边可选组件
      coms,
      // 左边组件单击触发的事件
      leftComponentClick,
      setActive,
      currentElement,
      updateProps,
      // color,
      // predefine
    };
  },
});
</script>
<style lang="scss">
.edit {
  $parts: left, canvas, props;
  @each $part in $parts {
    &-#{$part}-wrapper {
      height: 100%;
      background: #fff;
      padding: 10px;
    }
  }
  .reverse.el-slider {
    .el-slider__bar {
      background-color: #E4E7ED;
    }
    .el-slider__runway {
      background-color: #409EFF;
    }
    
  }
}
</style>
