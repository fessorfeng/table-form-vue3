<script lang="ts">
import { NormalObject } from '@/components/TableForm/types';
import {
  ElButton,
  ElOption,
  ElSelect,
  ElTable,
  ElTableColumn,
} from 'element-plus';
import { Table } from 'element-plus/lib/el-table/src/table/defaults';
import { TableColumnCtx } from 'element-plus/lib/el-table/src/table-column/defaults';
import { defineComponent, h, ref, watch } from 'vue';
import MySelect from '@/components/TableForm/select.vue';

export default defineComponent({
  components: {
    MySelect,
  },
  setup() {
    const tableData = ref([
      {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
        tag: '家',
      },
      {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄',
        tag: '公司',
      },
      {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄',
        tag: '家',
      },
      {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄',
        tag: '公司',
      },
    ]);
    function filterHandler(value: any, row: any, column: any) {
      console.log(value, row, column);
      const property = column['property'];
      return row[property] === value;
    }
    const filterValInfo = ref({
      date: [],
    });
    const selectVal = ref([2, 3]);
    // const selectVal = ref([3]);
    // const selectVal = ref('2,3');
    watch(
      selectVal,
      (newVal) => {
        console.log(newVal);
      },
      {
        deep: true,
      }
    );
    return {
      tableData,
      filterHandler,
      filterValInfo,
      selectVal,
    };
  },
  methods: {
    filterTag(value: any, row: { [key: string]: any }) {
      return row.tag === value;
    },
  },
  render() {
    const col = {
      prop: 'date',
      label: '日期',
      sortable: true,
      width: '180',
      columnKey: 'date',
      filters: [
        { text: '2016-05-01', value: '2016-05-01' },
        { text: '2016-05-02', value: '2016-05-02' },
        { text: '2016-05-03', value: '2016-05-03' },
        { text: '2016-05-04', value: '2016-05-04' },
      ],
      filterMultiple: false,
      filterMethod: this.filterHandler,
      // filterValue: filterValInfo?.date,
      renderHeader: ({
        column,
        $index,
      }: {
        column: TableColumnCtx<NormalObject>;
        $index: number;
      }) => {
        return h(
          ElSelect,
          {
            modelValue: '',
            'onUpdate:modelValue': (e: any) => {
              (this.$refs.tableRef as Table<NormalObject>).store.commit(
                'filterChange',
                {
                  column,
                  values: [e],
                }
              );
            },
          },
          {
            default: () =>
              [
                { text: '2016-05-01', value: '2016-05-01' },
                { text: '2016-05-02', value: '2016-05-02' },
                { text: '2016-05-03', value: '2016-05-03' },
                { text: '2016-05-04', value: '2016-05-04' },
              ].map((o, i) =>
                h(ElOption, {
                  key: i,
                  label: o.text,
                  value: o.value,
                })
              ),
          }
        );
      },
    };
    return h(
      'div',
      {
        style: { textAlign: 'center' },
      },
      [ 
        // h('div', null, sele),
        h(MySelect, {
          size: 'mini',
          options: new Array(100).fill(0).map((v, i) => ({
            value: i + 1,
            label: '测试' + (i + 1),
          })),
          // options: [],
          modelValue: this.selectVal,
          'onUpdate:modelValue': (val: any) => {
            this.selectVal = val;
          },
          multiple: true,
          // multiple: false,
          style: {width: '200px'},
          clearable: true,
          collapseTags: false,
        }),
        // h(
        //   ElTable,
        //   {
        //     rowKey: 'date',
        //     data: this.tableData,
        //     style: { width: '100%' },
        //     ref: 'tableRef',
        //     // onFilterChange: (filters: any) => {
        //     //   console.log(filters);
        //     // },
        //   },
        //   () => {
        //     return [
        //       h(ElTableColumn, col),
        //       h(ElTableColumn, {
        //         prop: 'name',
        //         label: '姓名',
        //         width: '180',
        //         columnKey: 'name',
        //       }),
        //       h(ElTableColumn, {
        //         prop: 'tag',
        //         label: '标签',
        //         width: '100',
        //         filters: new Array(100).fill(0).map((v, i) => ({
        //           value: i + 1,
        //           text: '测试' + (i + 1),
        //         })),
        //         filterMethod: this.filterTag,
        //       }),
        //     ];
        //   }
        // ),
      ]
    );
  },
});
</script>

<style></style>
