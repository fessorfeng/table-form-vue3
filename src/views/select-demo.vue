<script lang="ts">
import { defineComponent, h, ref, watch } from 'vue';
import MySelect from '@/components/TableForm/select.vue';

export default defineComponent({
  components: {
    MySelect,
  },
  setup() {
    function filterHandler(value: any, row: any, column: any) {
      console.log(value, row, column);
      const property = column['property'];
      return row[property] === value;
    }
    const filterValInfo = ref({
      date: [],
    });
    const selectVal = ref([2, 3]);

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
    return h(
      'div',
      {
        style: { textAlign: 'center' },
      },
      [ 
        h(MySelect, {
          size: 'mini',
          options: new Array(100).fill(0).map((v, i) => ({
            value: i + 1,
            label: '测试' + (i + 1),
          })),
          modelValue: this.selectVal,
          'onUpdate:modelValue': (val: any) => {
            this.selectVal = val;
          },
          multiple: true,
          style: {width: '200px'},
          clearable: true,
          collapseTags: false,
        }),
      ]
    );
  },
});
</script>

<style></style>
