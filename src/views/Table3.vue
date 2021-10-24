<template>
  <table-form
    v-model="tableData2"
    :cols="cols"
    @change="changeHandler"
    :readonly="false"
    class="case-mock"
    :wrapHeight="409"
  ></table-form>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
} from 'vue';
import TableForm from '@/components/TableForm/index.vue';

import {caseMock, priorityOptions, testResultsOptions} from './mock';
export default defineComponent({
  props: {},
  components: {
    TableForm,
  },
  setup() {
    const cols = ref([
      {
        type: 'selection',
        width: 55,
        name: '',
      },
      {
        type: 'index',
        width: 60,
        label: '序号',
        align: 'center',
      },
      {
        label: '功能描述',
        name: 'function',
        minWidth: '150px',
        type: 'textarea',
        rules: [
          { required: true, message: '该项必填' },
          // { validator: validateFunc, trigger: 'change' },
        ],
        attrs: { placeholder: '请输入', wrap: 'hard', resize: 'none' },
        formProps: { rows: '2', wrap: 'hard' },
      },
      {
        label: '前置条件',
        name: 'precondition',
        minWidth: '150px',
        type: 'textarea',
        rules: [{ required: true, message: '该项必填' }],
        attrs: { placeholder: '请输入', wrap: 'hard', resize: 'none' },
        formProps: {},
      },
      {
        label: '步骤描述',
        name: 'steps',
        minWidth: '150px',
        type: 'textarea',
        rules: [{ required: true, message: '该项必填' }],
        attrs: { placeholder: '请输入', wrap: 'hard', resize: 'none' },
        formProps: { rows: '2', wrap: 'hard' },
      },
      {
        label: '预期结果',
        name: 'expectedResults',
        minWidth: '150px',
        type: 'textarea',
        rules: [{ required: true, message: '该项必填' }],
        attrs: { placeholder: '请输入', wrap: 'hard', resize: 'none' },
        formProps: { type: 'textarea', rows: '2', wrap: 'hard' },
      },
      {
        label: '优先级',
        name: 'priority',
        type: 'select',
        filterInitialValue: [],
        rules: [{ required: true, message: '该项必填' }],
        attrs: { placeholder: '请输入' },
        options: priorityOptions,
      },
      {
        label: '测试结果',
        name: 'testResults',
        type: 'select',
        filterInitialValue: [],
        rules: [{ required: true, message: '该项必填' }],
        attrs: { placeholder: '请输入' },
        options: testResultsOptions,
        // TODO: 左固定注意头部 有部分gutter空白样式要处理
        // fixed: "left" 
        fixed: "right"
      },
    ]);
    const tableData = ref([
      {
        isTested: '1',
        functionList: ['1'],
        percentage: 60,
        testResults: [],
        precondition: '前置条件',
        priority: '0ed09e44-0fd0-4f8b-81d9-ef60139877a3',
        // priority: '',
        steps: '步骤描述',
        function: '功能描述',
        modifyTime: null,
        id: '9a57b914-3fcb-4b40-878f-b6357787cafd',
        sn: null,
        expectedResults: '预期结果',
        tranformSteps: null,
        testCaseId: '38584329-3187-4475-a272-ff455d24b480',
        // readonly: true,
      },
      {
        isTested: '1',
        functionList: ['1'],
        percentage: 60,
        testResults: [],
        precondition: '前置条件',
        priority: 'ac9739ce-b575-4f8a-b4c2-e4102f2b10d0',
        steps: '步骤描述',
        function: '功能描述',
        modifyTime: null,
        id: '9a57b914-3fcb-4b40-878f-b6357787cafd2',
        sn: null,
        expectedResults: '预期结果',
        tranformSteps: null,
        testCaseId: '38584329-3187-4475-a272-ff455d24b480',
        readonly: true,
      },
    ]);

    const changeHandler = (e: any) => {
      console.log(e);
    };

    const tableData2 = ref(caseMock);

    return {
      tableData,
      tableData2,
      cols,
      changeHandler,

    };
  },
});
</script>
<style lang="scss">
.case-mock {
  width: 1200px;
  margin: 20px auto;
} 
</style>