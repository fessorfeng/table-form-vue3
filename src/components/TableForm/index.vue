<script lang="ts">
/* eslint-disable vue/no-setup-props-destructure */
import {
  computed,
  defineComponent,
  h,
  PropType,
  provide,
  reactive,
  Ref,
  ref,
  toRefs,
  VNode,
} from 'vue';
import { ElTableColumn, ElTable } from 'element-plus';

import {
  NormalObject,
  Obj,
  TableColumnSlot,
  TableFormCol,
  tableFormKey,
  TableFormRowItem,
  TableFormTable,
  TFCOL,
} from './types';
import { defaultRenderFormItem } from './defaultRenderFormItem';
import { uniqueId } from 'lodash-es';
import { TableColumnCtx } from 'element-plus/lib/el-table/src/table-column/defaults';
import { renderHeader } from './useRenderHeader';

import mitt from 'mitt';
import TableFormItem from './form-item.vue';
// import { useVirtualScroll } from './useVirtualScroll';
import { useTransform as useVirtualScroll } from './useTransform';
export default defineComponent({
  name: 'TableForm',
  props: {
    modelValue: {
      type: Array as PropType<NormalObject[]>,
      default: () => {
        return [];
      },
    },
    cols: {
      type: Array as PropType<TableFormCol<Obj>[]>,
      default: () => {
        return [];
      },
    },
    showMessage: {
      type: Boolean,
      default: true,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    virtualScroll: {
      type: Boolean,
      default: true,
    },
    visibleItemCount: {
      type: Number,
      default: 10,
    },
    itemHeight: {
      type: Number,
      default: 79,
    },
    wrapHeight: {
      type: Number,
      default: 500,
    },
    maxHeight: {
      type: Number,
      default: 500,
    },
    isTable: {
      type: Boolean,
      default: true,
    },
    prevCacheNum: {
      type: Number,
      default: 3,
    },
    nextCacheNum: {
      type: Number,
      default: 3,
    },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    let multipleSelection = ref([]);
    const tableFormRef = ref() as Ref<TableFormTable<Obj>>;

    // tableForm勾选值变化监听
    const handleSelectionChange = (val: Ref<never[]>) => {
      // val是row对象数组
      multipleSelection = val;
    };

    props.modelValue.forEach((v) => {
      // 注意 v是个对象
      // 新增一个唯一的UUID 为了后面找到指定数据源的index
      v.ITEMUUUID = uniqueId('tf_');
    });

    /**
     *通过row 唯一id定位数据真实索引，-1找不到
     */
    const getIndexInData = (uuid: string) => {
      return props.modelValue.findIndex((item) => item.ITEMUUUID === uuid);
    };
    // 某列某个表单变化了事件
    const customFormItemChangeHandle = (
      val: any,
      row: TableFormRowItem,
      column: TableColumnCtx<any>,
      $index: number
    ) => {
      const rowIndex = getIndexInData(row.ITEMUUUID);
      const data = props.modelValue;
      if (rowIndex >= 0) {
        // TODO: 确认column.property 外面传进来
        data[rowIndex][column.property] = val;
        const col = props.cols.find((c) => c.name === column.property);

        emit('update:modelValue', data);
        emit('change', { val, row, column, $index: rowIndex, col });
      }
    };

    const { filterValInfo, headerRender, filterMethod } = renderHeader(
      props.cols
    );

    const colFuncMap = computed(() => {
      const map = {} as NormalObject;
      const keys = Object.keys(filterValInfo);
      keys.forEach((k) => {
        const val = filterValInfo[k];
        if (!val || (Array.isArray(val) && !val.length)) {
          map[k] = () => true;
        } else {
          map[k] = (args: any) => {
            return Array.isArray(val)
              ? val.some((v) => v === args)
              : val === args;
          };
        }
      });
      return map;
    });

    const filteredData: Ref<NormalObject[]> = ref(props.modelValue);

    const filterSort = (val: any, col: TFCOL<Obj>) => {
      // 参考Table.store execFilter的
      const store = (tableFormRef.value as TableFormTable<Obj>).store;
      const columns = store.states.columns.value;
      let sourceData = props.modelValue;
      console.log(filterValInfo);
      Object.keys(filterValInfo).forEach((colName) => {
        let values = filterValInfo[colName];
        if (!values || values.length === 0) {
          return;
        }
        values = Array.isArray(values) ? values : [values];
        const column = columns.find((c) => colName === c.property);
        // 兼容写法，col.filterMethod可以外传进去
        if (column && column.filterMethod) {
          sourceData = sourceData.filter((row) => {
            return values.some((value: any) =>
              column.filterMethod.call(null, value, row, column)
            );
          });
        }
      });
      filteredData.value = sourceData;
    };

    const formMitt = mitt();
    const tableForm = reactive({
      formMitt,
      ...toRefs(props),
      emit,
      getIndexInData,
      filterSort,
    });
    provide(tableFormKey, tableForm);

    const scrollStates = useVirtualScroll(props, tableFormRef, filteredData);

    return {
      tableFormRef,
      getIndexInData,
      multipleSelection,
      handleSelectionChange,
      customFormItemChangeHandle,

      filterValInfo,
      headerRender,
      filterMethod,
      filterSort,
      colFuncMap,
      filteredData,

      ...scrollStates,
    };
  },
  render() {
    const tableData = this.modelValue;
    const filterValInfo = this.filterValInfo;
    const { getIndexInData, $emit: emit, cols } = this;
    const renderTableColumn = (col: TFCOL<Obj>, index: number) => {
      const {
        name = '',
        renderHeader = null,
        // renderFormItem = null,
        rules = null,
        filteredValue = [],
        filterInitialValue = '',
        filterMethod = null,
        filters = null,
        ...other
      } = col;

      const slots: TableColumnSlot<Obj> = {
        header: ({ column, $index, store, _self: parent }) => {
          return this.headerRender({ col, column, $index, store, parent });
        },
      };
      if (col.type === 'index') {
        slots.default = ({ row }) => {
          let index = getIndexInData(row.ITEMUUUID);
          return h('div', index + 1);
        };
      }
      // 对应列的类型。如果设置了 selection 则显示多选框；如果设置了 index 则显示该行的索引（从 1 开始计算）；如果设置了 expand 则显示为一个可展开的按钮
      if (!['selection', 'index', 'expand'].includes(col.type)) {
        slots.default = ({ row, column, $index }) => {
          // 不能 只读模式直接返回h('div', 文本)ELTableBody会提示内存溢出 有空再深究，直接返回文本就不会报错的
          const rowVal = row[column.property];

          const { options = [], readonly: colReadonly } = col;
          const tableReadonly = this.readonly;
          let res = row[column.property];
          // row 数据readonly属性可以是布尔也可以对象指定某个只读
          const rowReadonly = row?.readonly as
            | undefined
            | boolean
            | { [key: string]: boolean };
          const onlyRead =
            rowReadonly === undefined
              ? typeof colReadonly === 'boolean'
                ? colReadonly
                : tableReadonly
              : typeof rowReadonly === 'boolean'
              ? rowReadonly
              : rowReadonly[column.property] || false;
          if (onlyRead) {
            if (options && options.length) {
              const arr = Array.isArray(rowVal) ? rowVal : [rowVal];
              res = arr
                .reduce((strArr, v) => {
                  const item = options.find((o) => o.value === v);
                  if (item) strArr.push(item.label);
                  return strArr;
                }, [])
                .join('、');
            }
            return res;
          }

          type RENDER = (data: {
            row: TableFormRowItem;
            column: TableColumnCtx<Obj>;
            $index: number;
            col: TFCOL<Obj>;
          }) => VNode;

          let _renderFunc: RENDER = ({ row, column, $index, col }) => {
            return h(defaultRenderFormItem, {
              row,
              column,
              index: $index,
              col,
              // TODO: 注意index如果虚拟滚动是否会有问题的
              onChange: (e: { val: any }) => {
                const { val } = e;
                this.customFormItemChangeHandle(val, row, column, $index);
              },
            });
          };
          return h(
            TableFormItem,
            {
              prop: column.property,
              rules: rules || [],
              row,
              column,
            },
            () => _renderFunc({ row, column, $index, col })
          );
        };
      }
      const filterProps = {} as NormalObject;
      const _filterMethod = filterMethod || this.filterMethod(col);
      if (_filterMethod) {
        filterProps.filterMethod = _filterMethod;
      }
      return h(
        ElTableColumn,
        {
          key: index,
          ...other,
          prop: name, // 很重要，因为column源码column.property 取prop || property
          ...filterProps,
        },
        {
          ...slots,
        }
      );
    };
    const renderTable = () => {
      return h(
        ElTable,
        {
          ref: 'tableFormRef',
          data: this.virtualScroll ? this.showDataList : this.filteredData,
          tooltipEffect: 'dark',
          border: true,
          style: { width: '100%' },
          onSelectionChange: this.handleSelectionChange,
          /* onFilterChange: (filters: any) => {
              console.log(filters);
            }, */
        },
        {
          default: () => cols.map((col, i) => renderTableColumn(col, i)),
        }
      );
    };
    return h(
      'div',
      {
        class: ['table-form'],
        style: { position: 'relative' },
      },
      [renderTable()]
    );
  },

  methods: {},
});
/* eslint-enable vue/no-setup-props-destructure */
</script>
<style lang="scss">
@import './table-form';
</style>
