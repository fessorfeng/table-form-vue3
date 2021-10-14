<template>
  <div class="table">
    <div class="scroll">666666666</div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue';
import { uniqueId } from 'lodash-es';
export default {
  name: '',
  setup() {
    const tableData3 = ref(
      new Array(100).fill(0).map((k, i) => ({
        date: i + 1,
        id: uniqueId('fri_'),
      }))
    );
    return {
      tableData3,
    };
  },
};
</script>
<style lang="scss">
.table {
  position: relative;
  overflow-y: scroll;
  height: 480px;
}
.scroll {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: -1;
  height: 4800px;
}
</style>
