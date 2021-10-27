import {
  NormalObject,
  Option,
  tableFormColFilters,
  tableFormHeaderRender,
  tableFormFilterMethod,
} from './types';
import { h, reactive, VNode } from 'vue';
import { funcRenderFormItem as CommonFormItem } from './funcRenderFormItem';
import CustomSelect from './select.vue';
import { TFCOL, Obj, CI, TableFormContext } from './types';

const renderHeader = (cols: TFCOL<NormalObject>[]) => {
  const hasFilter = (col: TFCOL<NormalObject>) => {
    return (
      !['selection', 'index', 'expand'].includes(col.type) || col?.hasFilter
    );
  };

  const initFilterObj: NormalObject = {};

  cols.forEach((col) => {
    if (hasFilter(col)) {
      // TODO初始值不对会造成改变不了筛选值
      const filterInitialValue =
        col.filterInitialValue !== undefined ? col.filterInitialValue : '';
      initFilterObj[col.name] = filterInitialValue;
    }
  });

  const filterValInfo = reactive(initFilterObj);

  const renderNoFilterHeader = (col: TFCOL<NormalObject>) => {
    return h(
      'div',
      {
        class: 'table-form__filter-label',
      },
      [
        h('span', {
          class: 'ellipsis',
          innerHTML: col?.label,
          title: col?.label,
        }),
      ]
    );
  };
  const renderHeaderFilter: tableFormHeaderRender<Obj> = ({
    col,
    column,
    $index,
    store,
    parent,
  }) => {
    const {
      type = '',
      attrs = {} as NormalObject,
      options = [] as Option[],
      renderHeader = null,
    } = col;
    let { formProps = {} as NormalObject } = col;
    // 某些type做特殊处理
    let newType = type;
    switch (type) {
      case 'textarea':
        newType = 'input';
        break;
      case 'radio':
      case 'checkbox':
      case 'select':
        newType = 'custom-select';
        break;
      default:
        break;
    }
    const isCustomSelect = newType === 'custom-select';
    // 策略模式加额外属性
    const extraProps: { [key: string]: NormalObject } = {
      input: {
        clearable: true,
      },
      'input|select|custom-select': {
        size: 'mini',
      },
    };
    Object.keys(extraProps).forEach((key) => {
      const arr = key.split('|');
      if (arr.includes(newType)) {
        formProps = {
          ...formProps,
          ...extraProps[key],
        };
      }
    });
    const commonProps = {
      modelValue: filterValInfo[col.name],
      options,
      'onUpdate:modelValue': (val: any) => {
        filterValInfo[col.name] = val;
        const tableFormVm = parent.$parent as TableFormContext;
        
        if (!tableFormVm.virtualScroll) {
          store.commit('filterChange', {
            column: column,
            values: getFilterVals(val),
          });
          store.updateAllSelected();
        } else {
          parent.$refs.bodyWrapper.scrollTop = 0;
          tableFormVm.filterSort(val, col);
        }       
      },
    };
    return h(
      'div',
      {
        class: 'table-form__filter-item',
      },
      [
        h('span', null, col?.label),
        isCustomSelect
          ? h(CustomSelect, {
            ...commonProps,
            ...formProps,
            ...attrs,
            multiple: true,
            options,
            collapseTags: false,
            clearable: true,
          })
          : h(CommonFormItem, {
            ...commonProps,
            formProps: {
              ...formProps,
              ...attrs,
            },
            type: newType,
            // 这里如果type render 自己传入renderHeader
            vnode: renderHeader
              ? (renderHeader as (data: CI<Obj>) => VNode)({ column, $index })
              : h('div'),
          }),
      ]
    );
  };

  const headerRender: tableFormHeaderRender<Obj> = ({
    col,
    column,
    $index,
    store,
    parent,
  }) => {
    return hasFilter(col)
      ? renderHeaderFilter({ col, column, $index, store, parent })
      : renderNoFilterHeader(col);
  };

  const filterText: tableFormFilterMethod<NormalObject> = (
    value,
    row,
    column
  ) => {
    return (row[column.property] + '').indexOf(value) > -1;
  };
  const filterCustomSelect: tableFormFilterMethod<NormalObject> = (
    value,
    row,
    column
  ) => {
    const val = row[column.property];
    // 视情况判断，数组是多选，基础值单选
    return Array.isArray(val) ? val.includes(value) : val === value;
  };

  const filterMethod = (col: TFCOL<NormalObject>) => {
    let func: null | tableFormFilterMethod<NormalObject> = null;
    switch (col.type) {
      case 'input':
      case 'textarea':
        func = filterText;
        break;
      case 'radio':
      case 'checkbox':
      case 'select':
        func = filterCustomSelect;
        break;
      default:
        break;
    }
    return func;
  };

  return {
    filterValInfo,
    hasFilter,
    headerRender,
    filterText,
    filterMethod,
    filterCustomSelect,
  };
};
function getFilterVals(v: tableFormColFilters | any) {
  return Array.isArray(v) ? v : v ? [v] : [];
}

export { renderHeader, getFilterVals };
