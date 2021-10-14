import {
  NormalObject,
} from './types';
import { VNode, h, defineComponent, PropType, cloneVNode } from 'vue';
import {
  ElCheckbox,
  ElCheckboxGroup,
  ElInput,
  ElOption,
  ElRadio,
  ElRadioGroup,
  ElSelect,
} from 'element-plus';
import { Option } from './types';

const funcRenderFormItem = defineComponent({
  name: 'FuncRenderFormItem',
  props: {
    type: {
      type: String,
      required: true,
    },
    modelValue: {
      required: true,
      type: [Object, Array, String, Number],
    },
    options: Array as PropType<Option[]>,
    formProps: {
      type: Object as PropType<NormalObject>,
    },
    vnode: {
      type: [Object, String] as PropType<VNode>,
    },
    vnodeFn: { type: Function as PropType<() => VNode> },
  },
  emits: ['change', 'update:modelValue', 'input', 'update:vnode'],
  setup() {
    return {};
  },
  render() {
    let res = this.modelValue;
    const {
      formProps = {},
      options = [],
      modelValue,
      type,
      $emit: emit,
      vnodeFn,
    } = this;
    const part = {
      modelValue: this.modelValue,
      'onUpdate:modelValue': (val: any) => {
        emit('update:modelValue', val);
      },
      ...formProps,
      type,
    };
    // 校验是否需要options数组
    const optionsValid = (need = true) => {
      if (need) {
        const res = Array.isArray(options) && options.length;
        if (!res) console.error('请传入options数组');
      }
    };
    let vnode: VNode;
    switch (type) {
      case 'radio':
        optionsValid();
        res = h(
          ElRadioGroup,
          {
            ...part,
          },
          {
            default: () =>
              options.map((o, i) =>
                h(
                  ElRadio,
                  {
                    key: i,
                    label: o.value,
                  },
                  {
                    default: () => o.label,
                  }
                )
              ),
          }
        );
        break;
      case 'checkbox':
        optionsValid();
        res = h(
          ElCheckboxGroup,
          {
            ...part,
          },
          {
            default: () =>
              options.map((o, i) =>
                h(
                  ElCheckbox,
                  {
                    key: i,
                    label: o.value,
                  },
                  {
                    default: () => o.label,
                  }
                )
              ),
          }
        );
        break;
      case 'input':
      case 'textarea':
        res = h(ElInput, {
          ...part,
          modelValue: modelValue as string | number,
        });
        break;
      case 'select':
        optionsValid();
        res = h(
          ElSelect,
          {
            ...part,
          },
          {
            default: () =>
              options.map((o, i) =>
                h(ElOption, {
                  key: i,
                  label: o.label,
                  value: o.value,
                })
              ),
          }
        );
        break;
      case 'render':
        if (vnodeFn || this.vnode) {
          const extraProps = {
            ...part,
          };
          
          if (this.vnode) {
            vnode = this.vnode;
          } else {
            // 如果不是用v-model传modelValue 就一定要onUpdate:modelValue 方法
            // if (!Object.keys(vnode.props as NormalObject).includes('onUpdate:modelValue')) {
            //   console.error('vnodeFn 请传入onUpdate:modelValue 方法才能双向绑定');
            // }
            const renderFn = vnodeFn as () => VNode;
            vnode = renderFn();
          }
          vnode = cloneVNode(vnode, extraProps);
          res = vnode;
        }
        break;
      default:
        break;
    }
    return res;
  },
});

export { funcRenderFormItem };
