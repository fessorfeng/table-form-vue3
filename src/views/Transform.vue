<template>
  <div class="virtual-list">
    <h2>虚拟滚动测试</h2>
    <div
      class="virtual-list__container"
      ref="scrollWrap"
    >
      <div class="virtual-list__list" ref="scrollList">
        <div
          :index="index"
          :vid="item.id"
          class="virtual-list__item"
          v-for="(item, index) in showList"
          :key="item.id"
          ref="items"
        >
          <div class="virtual-list-item">
            {{ item.id }} -- {{ item.date }} -- {{ item.text }}
          </div>
        </div>
      </div>
      <!-- <div
        class="virtual-list__scrollbar"
        ref="scrollbar"
        :style="{ height: scrollBarHeight }"
      ></div> -->
    </div>
  </div>
</template>

<script lang="ts">
// import { NormalObject } from '@/components/TableForm/types';
import { computed, defineComponent, onMounted, PropType, Ref, ref } from 'vue';
import {useTransform as useVirtualScroll} from '@/components/TableForm/useTransform';
import { NormalObject } from '@/components/TableForm/types';
export default defineComponent({
  components: {},
  props: {
    list: {
      type: Array as PropType<NormalObject[]>,
      default: () => ([]),
    },
    // remain: Number,
    itemHeight: {
      type: Number,
      required: true,
      default: 10,
    },
    prevCacheNum: {
      type: Number,
      default: 3,
    },
    nextCacheNum: {
      type: Number,
      default: 3,
    },
    wrapHeight: {
      type: Number,
      required: true,
      default: 500,
    },
    maxHeight: {
      type: Number,
      required: true,
      default: 500,
    },
  },
  setup(props) {
    // ref
    const scrollWrap = ref() as Ref<HTMLElement>;
    const dataList = computed(() => {
      return props.list;
    });
    const useTransfrom = useVirtualScroll(props, scrollWrap, dataList); 
    return {
      dataList,
      ...useTransfrom
    };
  },
});
</script>
<style lang="scss"></style>
