import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import styleImport from 'vite-plugin-style-import';
import path from 'path';

export default defineConfig({
  plugins: [
    vue(),
    styleImport({
      libs: [
        {
          libraryName: 'element-plus',
          esModule: true,
          ensureStyleFile: true,
          resolveStyle: (name) => {
            name = name.slice(3);
            return `element-plus/packages/theme-chalk/src/${name}.scss`;
          },
          resolveComponent: (name) => {
            return `element-plus/lib/${name}`;
          },
        },
      ],
    }),
  ],
  resolve: {
    // 导入文件夹别名
    alias: {
      '@': path.resolve(__dirname, './src'),
      // views: path.resolve(__dirname, '/src/views'),
      // components: path.resolve(__dirname, './src/components'),
      // utils: path.resolve(__dirname, './src/utils'),
      // less: path.resolve(__dirname, './src/less'),
      // assets: path.resolve(__dirname, './src/assets'),
      // com: path.resolve(__dirname, './src/components'),
      // store: path.resolve(__dirname, './src/store'),
      // mixins: path.resolve(__dirname, './src/mixins'),
    },
  },
});
