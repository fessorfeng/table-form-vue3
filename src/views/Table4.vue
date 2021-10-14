<template>
  <my-table :data="tableData" style="width: 100%">
    <el-table-column prop="date" label="Date" width="180" />
    <el-table-column prop="name" label="Name" width="180" />
    <el-table-column prop="address" label="Address" />
  </my-table>
</template>

<script lang="ts">
import TableFormTable from '@/components/TableForm/TableFormTable.vue';
import { ref } from 'vue';

export default {
  components: {
    MyTable: TableFormTable,
  },
  setup () {
    const tableData = ref([
        {
          date: '2016-05-03',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles',
        },
        {
          date: '2016-05-02',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles',
        },
        {
          date: '2016-05-04',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles',
        },
        {
          date: '2016-05-01',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles',
        },
      ]);
    
    return {
      tableData,
    };
  },
}
</script>
<style lang='scss'>
</style>
`