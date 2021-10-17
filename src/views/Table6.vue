<template>
  <div class="table" :id="domId">
    <div class="scroll">666666666</div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, h, createApp, defineComponent } from 'vue';
import { uniqueId } from 'lodash-es';
export default {
  name: '',
  setup() {
    const domId = ref(uniqueId('domId_'));
    onMounted(() => {
      createApp(defineComponent({
        render() {
          return h('div', null, '测试');
        }
      })).mount(`#${domId.value} .scroll`);
    });
    return {
      domId,
    };
  },
};
</script>
<style lang="scss">

</style>
