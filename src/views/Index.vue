<template>
  <layout class="app-container">
    <router-view></router-view>
  </layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Layout from '@/components/Layout.vue';
export default defineComponent({
  components: {
    Layout,
  },
});
</script>
