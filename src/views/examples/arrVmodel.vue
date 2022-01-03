<template>
  <div class="">
    <div class="item" v-for="item in list" :key="item.id">{{item.name}}</div>
  </div>
  <el-button @click="addRandom">里面添加</el-button>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue';
import { Random as r } from 'mockjs';
import { uniqueId } from 'lodash-es';

export default defineComponent({
  components: {},
  props: {
    modelValue: {
      type: Array as PropType<{ id: string; name: string }[]>,
      default: () => {
        return [];
      },
    },
  },
  emits: ['change', 'update:modelValue'],
  setup(props, { emit }) {
    const emitValChange = (vals: any) => {
      emit('update:modelValue', vals);
      emit('change', vals);
    };
    const list = ref(props.modelValue);
    const addItems = (data: { id: string; name: string }) => {
      list.value.push(data);
    };
    const addRandom = () => {
      const data = {
        id: uniqueId('array_'),
        name: r.cparagraph(1),
      };
      addItems(data);
    };
    watch(list, () => {
      emitValChange(list.value);
      console.log(list, list.value);
    }, {deep: true})
    return {
      emitValChange,
      list,
      addItems,
      addRandom,
    };
  },
});
</script>
<style lang="scss" scoped>
.item {
  border: 1px solid red;
  line-height: 30px;
}
</style>
