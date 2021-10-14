import { Obj, TableFormTable, TableFormProps } from './types';
import { Table } from 'element-plus/lib/el-table/src/table/defaults';
import { ref, computed, Ref, onMounted, reactive } from 'vue';
const useVirtualScroll = (
  props: TableFormProps,
  filteredData: Ref<Obj[]>,
  tableRef: Ref<TableFormTable<Obj>>
) => {
  // 虚拟滚动
  const realScrollTop = ref(0);
  const size = computed(() => props.visibleItemCount);
  const extra = 4;
  const itemHeight = computed(() => props.itemHeight);
  const scrollBarHeight = computed(
    () => filteredData.value.length * itemHeight.value
  );
  const scrollbar = ref();
  const scrollbarWrap = computed(() => {
    return scrollbar.value?.wrap;
  });
  // const tableRef = ref();

  const start = computed(() => {
    let begin = Math.ceil(realScrollTop.value / itemHeight.value) - extra;
    begin = begin > 0 ? begin : 0;
    return begin;
  });
  const end = computed(() => {
    const total = filteredData.value.length;
    let stop = start.value + size.value + extra;
    stop = stop > total - 1 ? total - 1 : stop;
    return stop;
  });

  const tableDataVirtual = computed(() => {
    return filteredData.value.slice(start.value, end.value);
  });
  const tableFormTableStyle = computed(() => ({
    width: '100%',
    ...(props.virtualScroll
      ? {
          transform: `translateY(${start.value * itemHeight.value}px)`,
          position: 'absolute',
        }
      : {}),
  }));
  onMounted(() => {
    const table = tableRef.value as TableFormTable<Obj>;
    const tableBody = table.$refs.bodyWrapper;
    tableBody.style.overflowY = 'hidden';
  });
  const handleScroll = (e: { scrollLeft: number; scrollTop: number }) => {
    const { scrollTop } = e;
    const top = (scrollTop * scrollbarWrap.value.clientHeight) / 100;
    // if (top >= scrollBarHeight.value) return;
    realScrollTop.value = top;

    if (tableRef.value) {
      const table = tableRef.value as TableFormTable<Obj>;
      const tableHeader = table.$refs.headerWrapper;
      const tableBody = table.$refs.bodyWrapper;
      tableHeader.style.position = 'reactive';
      tableHeader.style.top = '0';

      const tableHeaderHeight = tableHeader.clientHeight;
      if (top) {
        tableBody.style.position = 'absolute';
        tableBody.style.zIndex = '100';
        // TODO: 注意这里逻辑 调试了很久
        tableBody.style.transform = `-translateY(${
          start.value * itemHeight.value
        }px)`;

        // (tableRef.value.$el as HTMLElement).style.paddingTop =
        //   tableHeaderHeight + 'px';
      } else {
        tableBody.style.position = 'static';
        tableBody.style.top = '0px';
        // (tableRef.value.$el as HTMLElement).style.paddingTop = '0px';
      }
    }
  };
  return {
    handleScroll,
    tableDataVirtual,
    realScrollTop,
    start,
    end,
    scrollBarHeight,
    scrollbar,
    scrollbarWrap,
    size,
    itemHeight,
  };
};

export { useVirtualScroll };
