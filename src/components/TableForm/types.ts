import { VNode, InjectionKey, ComponentPublicInstance } from 'vue';
import { TableColumnCtx } from 'element-plus/lib/el-table/src/table-column/defaults';
import { FormItemRule } from 'element-plus/lib/el-form/src/form.type';
import type { Emitter } from 'mitt';
import type { FieldErrorList } from 'async-validator';
import { TableHeaderProps } from 'element-plus/lib/el-table/src/table-header';
import { Table } from 'element-plus/lib/el-table/src/table/defaults';

export type ROW = any;
export type CI<T> = { column: TableColumnCtx<T>; $index: number };
export type RCI<T> = { row: T; column: COL<T>; $index: number };
export type RCOLI<T> = { row: T; column: COL<T>; $index: number };

export type TableColumnDefaultSlotRender<T> = (data: {
  row: TableFormRowItem;
  column: TableColumnCtx<T>;
  $index: number;
}) => VNode;
export type TableColumnSlot<T> = {
  // 查看源码，其实还有 store:tableHeader的store（看源码 传的是table的 store）, _self: Table实例
  header: (
    data: CI<T> & { store: TableHeaderProps<T>['store']; _self: TableFormTable<T> }
  ) => VNode;
  default?: TableColumnDefaultSlotRender<T>;
};
export interface Option {
  value: any;
  label: string;
}
export type NormalObject = { [key: string]: any };
export type Obj = NormalObject;

export type COL<T> = TableColumnCtx<T> & {
  name: string;
  renderFormItem?: TableColumnDefaultSlotRender<T>;
  formProps?: NormalObject;
  attrs?: NormalObject;
  options?: Option[];
  // 表单子组件
  subFormProps?: NormalObject;
  readonly?: boolean | undefined;
  // 校验规则
  rules?: FormItemRule[];
  required?: boolean;
  hasFilter?: boolean;
  filterInitialValue?: any;
};
export type TableFormCol<T> = {
  name: string;
  type: string;
  renderFormItem?: TableColumnDefaultSlotRender<T>;
  formProps?: NormalObject;
  attrs?: NormalObject;
  options?: Option[];
  // 表单子组件
  subFormProps?: NormalObject;
  readonly?: boolean | undefined;
  // 校验规则
  rules?: FormItemRule[];
  required?: boolean;
  hasFilter?: boolean;
  filterInitialValue?: any;
} & Partial<TableColumnCtx<T>>;

export type TFCOL<T> = TableFormCol<T>;

export type TableFormRowItem = NormalObject & { ITEMUUUID: string };

export type NOOP = () => void;

export interface ValidateFieldCallback {
  (isValid?: boolean, invalidFields?: FieldErrorList): void;
}
export interface TableFormContext {
  formMitt: Emitter;
  modelValue: NormalObject[];
  cols: TFCOL<any>[];
  emit: (evt: 'change' | 'update:modelValue', ...args: any[]) => void;
  size?: string;
  showMessage?: boolean;
  disabled?: boolean;
  getIndexInData(uuid: string): number;
  filterSort: (val: any, col: TFCOL<Obj>) => void;
  virtualScroll: boolean;
}

export interface TableFormProps {
  modelValue: Obj[];
  cols: TFCOL<Obj>[];
  showMessage?: boolean;
  disabled?: boolean;
  virtualScroll: boolean;
  visibleItemCount: number;
  itemHeight: number;
}
export type ElementType = ComponentPublicInstance | HTMLElement;

export interface TableFormItemContext {
  prop: string;
  formItemMitt: Emitter;
  // size: ComponentSize
  validateState: string | undefined;
  validate(trigger: string, callback?: ValidateFieldCallback): void;
  // updateComputedLabelWidth(width: number): void
  addValidateEvents(): void;
  removeValidateEvents(): void;
  resetField(): void;
  clearValidate(): void;
}

export const tableFormKey: InjectionKey<TableFormContext> = 'tableForm' as any;

export const tableFormItemKey: InjectionKey<TableFormItemContext> =
  'tableFormItem' as any;

export const tableFormEvents = {
  addField: 'table.form.addField',
  removeField: 'table.form.removeField',
} as const;

export type tableFormColFilters = Array<
  NormalObject & { text: string; value: any }
>;

export type tableFormHeaderRender<T> = ({
  col,
  column,
  $index,
  store,
  parent,
}: {
  col: TFCOL<T>;
  column: TableColumnCtx<T>;
  $index: number;
  store: TableHeaderProps<T>['store'];
  parent: TableFormTable<T>;
}) => VNode;

export type tableFormFilterMethod<T> = (
  value: any,
  row: T,
  column: TableColumnCtx<T>
) => boolean;

export interface TableFormTable<T> extends Table<T> {
  $parent: TableFormContext;
  $el: HTMLElement;
  $refs: {
    headerWrapper: HTMLElement;
    footerWrapper: HTMLElement;
    fixedBodyWrapper: HTMLElement;
    rightFixedBodyWrapper: HTMLElement;
    bodyWrapper: HTMLElement;
    [key: string]: any;
  }
}
