<template>
  <div class="">
    <ArrayVmodel v-model="list" @change="change"/>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Random as r } from 'mockjs';
import ArrayVmodel from './arrVmodel.vue';

export default defineComponent({
  components: {
    ArrayVmodel
  },
  props: {},
  setup() {
    const list = ref(
      new Array(10).fill(0).map((v, i) => {
        return {
          id: i + 1,
          name: r.cparagraph(1),
          date: r.date('T'),
          text: r.cparagraph(1),
        };
      })
    );
    const change = () => {
      console.log(4444444, list.value);
    }

    return {
      list,
      change
    };
  },
});
</script>
<style lang="scss">

</style>
