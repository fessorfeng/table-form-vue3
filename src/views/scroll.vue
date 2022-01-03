<template>
  <div class="virtual-demo">
    <h3>虚拟滚动测试案例</h3>
    <div class="virtual__wrap" ref="scrollWrap">
      <div class="virtual__view" ref="scrollList">
        <div
          class="virtual__view-item"
          v-for="(item, i) in showList"
          :key="i"
          :style="{ height: `${itemHeight}px` }"
        >
          {{ item.id }} -- {{ item.date }} -- {{ item.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Random as r } from 'mockjs';
import { Ref, ref } from 'vue';
// import { useVirtualScroll } from './useVirtualScroll';
import { useTransform as useVirtualScroll} from '@/components/TableForm/useTransform';

export default {
  props: {
    wrapHeight: {
      type: Number,
      default: 480,
    },
    itemHeight: {
      type: Number,
      default: 59,
    },
    isTable: {
      type: Boolean,
      default: false,
    },
    prevCacheNum: {
      type: Number,
      default: 3,
    },
    nextCacheNum: {
      type: Number,
      default: 3,
    },
    maxHeight: {
      type: Number,
      default: 500,
    },
  },
  setup(props) {
    interface DataType {
      date: string;
      text: string;
      id: number;
    }
    const func = (num: number) => {
      return {
        date: r.date('T'),
        text: r.cparagraph(1),
        id: num,
      };
    };

    const dataList: Ref<DataType[]> = ref([]);
    const isRequest = ref(false);
    const getData = (num: number) => {
      const data = new Array(num).fill(0).map((v, i) => {
        return func(i + 1);
      });
      dataList.value = dataList.value.concat(data).map((v, i) => {
        v.id = i + 1;
        return v;
      });
      isRequest.value = false;
    };
    getData(70);
    const scrollWrap = ref();
    const useScrollProps = useVirtualScroll(
      props,
      scrollWrap,
      dataList,
      isRequest,
      () => {
        getData(70);
      }
    );

    return {
      getData,
      ...useScrollProps,
    };
  },
};
</script>
<style lang="scss">
.virtual {
  &-demo {
    text-align: left;
  }
  &__wrap {
    border-top: 1px solid blue;
    width: 500px;
    margin: 0 auto;
  }
  &__view {
    &-item {
      display: flex;
      align-items: center;
      box-sizing: border-box;
      border-bottom: 1px solid red;
    }
  }
}
</style>
