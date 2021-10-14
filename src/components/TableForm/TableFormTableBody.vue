<script >

// import TableBody from 'element-plus/lib/el-table/src/table-body/index';
// import { hColgroup } from 'element-plus/lib/el-table/src//h-helper'
import { defineComponent, h } from 'vue';
import { ElTable } from 'element-plus';
const TableBody = ElTable.components.TableBody;

export default {
  name: 'TableFormTableBody',
  extends: TableBody,
  render() {
    // const data = this.store.states.data.value || [];
    // console.log(this);
    // return h(
    //   'table',
    //   {
    //     class: 'el-table__body',
    //     cellspacing: '0',
    //     cellpadding: '0',
    //     border: '0',
    //   },
    //   [
    //     hColgroup(this.store.states.columns.value),
    //     h('tbody', {}, [
    //       data.reduce((acc, row) => {
    //         return acc.concat(this.wrappedRowRender(row, acc.length));
    //       }, []),
    //     ]),
    //   ]
    // );
    TableBody.render.call(this);
  },
};
</script>
