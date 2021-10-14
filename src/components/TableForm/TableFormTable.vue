<script lang="ts">
import { ElTable } from 'element-plus';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'TableFormTable',
  extends: ElTable,
  methods: {
    filterSort(args:any){
      console.log(args);
    }
  }
});

</script>
