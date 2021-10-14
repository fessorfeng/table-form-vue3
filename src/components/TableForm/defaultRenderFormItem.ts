import {
  TFCOL,
  Obj,
  tableFormKey,
  TableFormContext,
  tableFormItemKey,
  TableFormItemContext,
} from './types';
import { VNode, h, defineComponent, PropType, inject } from 'vue';
import {
  ElCheckbox,
  ElCheckboxGroup,
  ElInput,
  ElOption,
  ElRadio,
  ElRadioGroup,
  ElSelect,
} from 'element-plus';
import { Option, TableFormRowItem } from './types';
import { TableColumnCtx } from 'element-plus/lib/el-table/src/table-column/defaults';
import { UPDATE_MODEL_EVENT } from 'element-plus/lib/utils/constants';

const defaultRenderFormItem = defineComponent({
  props: {
    row: {
      type: Object as PropType<TableFormRowItem>,
      required: true,
    },
    column: {
      type: Object as PropType<TableColumnCtx<Obj>>,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    col: {
      type: Object as PropType<TFCOL<Obj>>,
      required: true,
    },
  },
  // 一定要写这个不然emit出去的事件与数据 一直调试失败
  emits: ['change', 'update:modelValue', 'input'],
  setup() {
    return {};
  },
  render() {
    const { row, column, index: $index, col, $emit: emit } = this;
    // const rowVal = row[column.property];

    const {
      attrs = {} as Obj,
      formProps = {} as Obj,
      options = [] as Option[],
      // canEdit = false,
      renderFormItem = null,
    } = col;
    let res = row[column.property];

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const tableForm = inject(tableFormKey, {} as TableFormContext);
    const tableFormItem = inject(tableFormItemKey, {} as TableFormItemContext);

    const part = {
      modelValue: row[column.property],
      'onUpdate:modelValue': (val: any) => {
        emit('change', { val, row, column, $index, col });
        tableFormItem.validate('change');
      },
      ...formProps,
      ...attrs,
    };
    let vnode: VNode;
    let userFunc: (val: any) => any | null;
    switch (column.type) {
      case 'radio':
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
        res = h(ElInput, {
          type: col.type === 'textarea' ? 'textarea' : 'text',
          ...part,
        });
        break;
      case 'textarea':
        res = h(
          'div',
          {
            class: {
              'el-textarea': true,
            },
          },
          [
            h('textarea', {
              autocomplete: "off",
              ...part,
              value: row[column.property],
              class: {
                'el-textarea__inner': true,
                // 'el-input--small': true,
              },
              style: {
                resize: 'none',
                minHeight: '33px',
              },
              onInput: (event: Event) => {
                const val  = (event.target as HTMLInputElement).value;
                emit(UPDATE_MODEL_EVENT, val);
                emit('input', val);
                emit('change', { val, row, column, $index, col });
                tableFormItem.validate('change');
              },
            }),
          ]
        );

        break;
      case 'select':
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
        vnode =
          (renderFormItem && renderFormItem({ row, column, $index })) ||
          h('div');
        userFunc = (vnode.props as Obj)['onUpdate:modelValue'] || null;
        (vnode.props as Obj)['onUpdate:modelValue'] = (val: any) => {
          // TODO: val可能与原来数据类型不一样 看是否定义一个转换函数
          // (vm?.proxy as Obj)?.change(val, row, column, $index);
          part['onUpdate:modelValue'](val);
          userFunc && userFunc(val);
        };
        res = vnode;
        break;
      default:
        break;
    }
    return res;
  },
});

export { defaultRenderFormItem };
