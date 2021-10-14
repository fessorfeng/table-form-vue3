import {
  ElButton,
  ElLink,
  ElContainer,
  ElHeader,
  ElMain,
  ElFooter,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElCol,
  ElRow,
  ElCard,
  ElIcon,
  ElInput,
  ElFormItem,
  ElForm,
  ElSlider,
  ElInputNumber,
  ElRadioGroup,
  ElRadioButton,
  ElSelect,
  ElOption,
  ElColorPicker,
  ElUpload,
  ElTable,
  ElTableColumn,
  
} from 'element-plus';

const components = [
  ElButton,
  ElLink,
  ElContainer,
  ElHeader,
  ElMain,
  ElFooter,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElCol,
  ElRow,
  ElCard,
  ElIcon,
  ElInput,
  ElFormItem,
  ElForm,
  ElSlider,
  ElInputNumber,
  ElRadioGroup,
  ElRadioButton,
  ElSelect,
  ElOption,
  ElColorPicker,
  ElUpload,
  ElTable,
  ElTableColumn
];

interface plugin {
  install: (Vue: any) => void;
}
const ElementPlus: plugin = {
  install(Vue: any): void {
    components.forEach((com) => {
      Vue.component(com.name, com);
    });
  },
};
export default ElementPlus;