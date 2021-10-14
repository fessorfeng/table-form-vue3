<template>
  <div>
    <virtual :remain="10" :size="39" :list="data">
    </virtual>
  </div>
</template>

<script>
import virtual from '@/components/virtual.vue';
import { ref } from 'vue';

export default {
  name: '',
  components: {
    virtual,
  },
  setup() {
    const tableData = new Array(100).fill(0).map((k, i) => i + 1);
    const data = ref(tableData);
    return {
      data,
    };
  },
};
</script>
<style lang="scss"></style>
