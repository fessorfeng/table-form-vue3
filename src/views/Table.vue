<template>
  <el-scrollbar
    wrap-class="scrollbar__wrap"
    style="max-width: 360px; background: yellow;position:relative;"
    :viewStyle="`height: ${scrollBarHeight}px;`"
    @scroll="handleScroll"
    ref="scrollbar"
  >
    <el-table
      :data="tableData4"
      :style="{
        width: '100%',
      }"
      ref="tableRef"
    >
      <el-table-column
        prop="date"
        label="日期"
        width="180"
        :filters="[
          { text: '2016-05-01', value: '2016-05-01' },
          { text: '2016-05-02', value: '2016-05-02' },
        ]"
      >
      </el-table-column>
      <el-table-column prop="id" label="id" width="180"> </el-table-column>
    </el-table>
  </el-scrollbar>
  
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
} from 'vue';
import { NormalObject, TableFormTable } from '@/components/TableForm/types';
import { ElScrollbar } from 'element-plus';
import { uniqueId } from 'lodash-es';

export default defineComponent({
  props: {},
  components: {
    ElScrollbar,
  },
  setup(props, { emit }) {
    const tableData3 = ref(
      new Array(100).fill(0).map((k, i) => ({
        date: i + 1,
        id: uniqueId('fri_'),
      }))
    );
    const realScrollTop = ref(0);
    // const start = ref(0);
    // const end = ref(0);
    const size = ref(10);
    const extra = 4;
    const itemHeight = ref(48);
    const scrollBarHeight = computed(
      () => tableData3.value.length * itemHeight.value
    );

    const scrollbarWrap = computed(() => {
      return scrollbar.value?.wrap;
    });
    const tableRef = ref();
    const handleScroll = (e: { scrollLeft: number; scrollTop: number }) => {
      const { scrollTop } = e;
      const top = (scrollTop * scrollbarWrap.value.clientHeight) / 100;
      realScrollTop.value = top;

      if (tableRef.value) {
        const table = (tableRef.value as TableFormTable<NormalObject>);
        const tableHeader = table.$refs.headerWrapper;
        const tableBody = table.$refs.bodyWrapper;
        
        const tableHeaderHeight = tableHeader.clientHeight;
        tableHeader.style.position = 'absolute';
        tableHeader.style.top = '0';
        if (top) {
          // tableHeader.style.position = 'absolute';
          tableHeader.style.zIndex = '100';
          // // TODO: 注意这里逻辑 调试了很久
          // tableHeader.style.top = `${top - (start.value * itemHeight.value)}px`;
          
          // (tableRef.value.$el as HTMLElement).style.paddingTop =
          //   tableHeaderHeight + 'px';
          tableBody.style.transform = `translateY(${start.value * itemHeight.value}px)`;
        } else {
          tableBody.style.position = 'static';
          tableBody.style.transform = `translateY(0px)`;
        }
      }
    };
    const start = computed(() => {
      let begin = Math.ceil(realScrollTop.value / itemHeight.value) - extra;
      begin = begin > 0 ? begin : 0;
      return begin;
    });
    const end = computed(() => {
      let total = tableData3.value.length;
      let stop = start.value + size.value + extra;
      stop = stop > total - 1 ? total - 1 : stop;
      return stop;
    });

    const tableData4 = computed(() => {
      return tableData3.value.slice(start.value, end.value);
    });
    const scrollbar = ref(null);

    return {

      handleScroll,
      tableData3,
      tableData4,
      realScrollTop,
      start,
      end,
      scrollBarHeight,
      scrollbar,
      scrollbarWrap,
      size,
      itemHeight,
      tableRef,
    };
  },
});
</script>
<style lang="scss">
.scrollbar__wrap {
  max-height: 400px;
}
.el-table__body-wrapper {
  // position: absolute;
}
</style>
