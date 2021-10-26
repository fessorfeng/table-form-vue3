<template>
  <div class="">
    <transfrom
      :list="list"
      :itemHeight="80"
      :maxHeight="500"
      :height="500"
    ></transfrom>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Random as r } from 'mockjs';
import Transfrom from './Transfrom.vue';

export default defineComponent({
  components: {
    Transfrom,
  },
  props: {},
  setup() {
    const list = ref(
      new Array(100).fill(0).map((v, i) => {
        return {
          id: i + 1,
          name: Date.now(),
          date: r.date('T'),
          text: r.cparagraph(1),
        };
      })
    );

    return {
      list,
    };
  },
});
</script>
<style lang="scss">
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
.virtual-list {
  width: 500px;
  margin: 0 auto;
  &__container {
    // position: relative;
    // overflow-y: auto;
  }
  &__list {
    // position: absolute;
    // left: 0;
    // top: 0;
    width: 100%;
    text-align: left;
  }
  &__scrollbar {
    // position: absolute;
    // left: 0;
    // top: 0;
    // right: 0;
    // width: 100%;
    // z-index: -1;
  }
  &__item {
    padding: 10px;
    border: 1px solid red;
    height: 80px;
  }
}
</style>
