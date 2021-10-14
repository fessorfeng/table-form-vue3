<template>
  <div class="table-form-item" :class="formItemClass">
    <div class="table-form-item__content">
      <slot></slot>
      <transition name="el-zoom-in-top">
      <slot v-if="shouldShowError" name="error" :error="validateMessage">
        <div
          class="table-form-item__error"
          :class="{
            'table-form-item__error--inline':
              typeof inlineMessage === 'boolean'
                ? inlineMessage : false,
          }"
        >
          {{ validateMessage }}
        </div>
      </slot>
      </transition>
    </div>
  </div>
</template>
<script lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FormItemRule } from 'element-plus/lib/el-form/src/form.type';
import {
  computed,
  defineComponent,
  PropType,
  ref,
  nextTick,
  inject,
  watch,
  Ref,
  reactive,
  toRefs,
  onMounted,
  onBeforeUnmount,
  provide,
} from 'vue';
import {
  NormalObject,
  Obj,
  ROW,
  TableFormContext,
  tableFormItemKey,
  tableFormKey,
  TableFormRowItem,
  ValidateFieldCallback,
} from './types';
import AsyncValidator from 'async-validator';

import { TableColumnCtx } from 'element-plus/lib/el-table/src/table-column/defaults';
import mitt from 'mitt';
import { noop } from 'lodash-es';

export default defineComponent({
  name: 'TableFormItem',
  props: {
    prop: {
      type: String,
      required: true,
    },
    required: {
      type: Boolean,
      default: false,
    },
    rules: {
      type: Array as PropType<FormItemRule[] | []>,
    },
    error: String,
    validateStatus: String,
    // for: String,
    inlineMessage: {
      type: [String, Boolean],
      default: '',
    },
    showMessage: {
      type: Boolean,
      default: true,
    },
    // size: {
    //   types: String as PropType<ComponentSize>,
    //   validator: isValidComponentSize,
    // },
    row: {
      type: Object as PropType<TableFormRowItem>,
      required: true,
    },
    column: {
      type: Object as PropType<TableColumnCtx<Obj>>,
      required: true,
    },
  },
  setup(props) {
    const formItemMitt = mitt();

    const tableForm = inject(tableFormKey, {} as TableFormContext);
    const validateState: Ref<string | undefined> = ref('');
    const validateMessage: Ref<string | undefined> = ref('');
    const validateDisabled = ref(false);
    const isRequired = computed(() => {
      let rules = getRules();
      let required = false;

      if (rules && rules.length) {
        rules.every((rule) => {
          if (rule.required) {
            required = true;
            return false;
          }
          return true;
        });
      }
      return required;
    });
    let initialValue: any | undefined = undefined;

    watch(
      () => props.error,
      (val) => {
        validateMessage.value = val;
        validateState.value = val ? 'error' : '';
      },
      {
        immediate: true,
      }
    );
    watch(
      () => props.validateStatus,
      (val) => {
        validateState.value = val;
      }
    );
    // eslint-disable-next-line vue/no-setup-props-destructure
    const row = props.row;
    // eslint-disable-next-line vue/no-setup-props-destructure
    const column = props.column;
    const itemVal = row[column.property];
    const fieldValue = computed(() => {
      return row[props.column.property];
    });

    const validate = (
      trigger: string,
      callback: ValidateFieldCallback = noop
    ) => {
      validateDisabled.value = false;
      const rules = getFilteredRule(trigger);
      if ((!rules || rules.length === 0) && props.required === undefined) {
        callback();
        return;
      }
      validateState.value = 'validating';
      const descriptor = {} as NormalObject;
      if (rules && rules.length > 0) {
        rules.forEach((rule) => {
          delete rule.trigger;
        });
      }
      descriptor[props.prop] = rules;
      const validator = new AsyncValidator(descriptor);
      const model = {} as NormalObject;
      model[props.prop] = fieldValue.value;
      validator.validate(
        model,
        { firstFields: true },
        (errors, invalidFields) => {
          validateState.value = !errors ? 'success' : 'error';
          validateMessage.value = errors ? errors[0].message : '';
          if (validateMessage.value) {
            console.log(
              validateMessage.value,
              validateState.value,
              shouldShowError,
              errors,
              invalidFields
            );
          }
          callback(!!validateMessage.value, invalidFields);
          // TODO:暂时没有用上
          // elForm.emit?.(
          //   'validate',
          //   props.prop,
          //   !errors,
          //   validateMessage.value || null
          // );
        }
      );
    };

    const clearValidate = () => {
      validateState.value = '';
      validateMessage.value = '';
      validateDisabled.value = false;
    };
    const resetField = () => {
      validateState.value = '';
      validateMessage.value = '';
      let model = tableForm.modelValue;
      let value = fieldValue.value;
      let name = column.property;
      // let path = props.prop;
      // if (path.indexOf(':') !== -1) {
      //   path = path.replace(/:/, '.');
      // }
      // let prop = getPropByPath(model, path, true);
      // validateDisabled.value = true;
      const rowIndex = tableForm.getIndexInData(row.ITEMUUUID);
      if (Array.isArray(value)) {
        model[rowIndex][name] = [].concat(initialValue);
      } else {
        model[rowIndex][name] = initialValue;
      }
      // reset validateDisabled after onFieldChange triggered
      nextTick(() => {
        validateDisabled.value = false;
      });
    };

    const getRules = () => {
      return props.rules || [];
    };
    const getFilteredRule = (trigger: string) => {
      const rules = getRules();

      return rules
        .filter((rule) => {
          if (!rule.trigger || trigger === '') return true;
          if (Array.isArray(rule.trigger)) {
            return rule.trigger.indexOf(trigger) > -1;
          } else {
            return rule.trigger === trigger;
          }
        })
        .map((rule) => ({ ...rule }));
    };

    const onFieldBlur = () => {
      validate('blur');
    };

    const onFieldChange = () => {
      if (validateDisabled.value) {
        validateDisabled.value = false;
        return;
      }

      validate('change');
    };

    const addValidateEvents = () => {
      const rules = getRules();

      if (rules.length || props.required !== undefined) {
        formItemMitt.on('table.form.blur', onFieldBlur);
        formItemMitt.on('table.form.change', onFieldChange);
      }
    };

    const removeValidateEvents = () => {
      formItemMitt.off('table.form.blur', onFieldBlur);
      formItemMitt.off('table.form.change', onFieldChange);
    };

    const tableFormItem = reactive({
      ...toRefs(props),
      // size: sizeClass,
      validateState,
      removeValidateEvents,
      addValidateEvents,
      resetField,
      clearValidate,
      validate,
      formItemMitt,
      // updateComputedLabelWidth,
    });

    onMounted(() => {
      if (props.prop) {
        // elForm.formMitt?.emit(elFormEvents.addField, tableFormItem)

        let value = fieldValue.value;
        initialValue = Array.isArray(value) ? [...value] : value;

        addValidateEvents();
      }
    });
    onBeforeUnmount(() => {
      // 暂时没有用到
      // tableForm.formMitt?.emit(tableFormEvents.removeField, tableFormItem);
    });

    provide(tableFormItemKey, tableFormItem);

    const formItemClass = computed(() => [
      {
        // 'el-form-item--feedback': elForm.statusIcon,
        'is-error': validateState.value === 'error',
        'is-validating': validateState.value === 'validating',
        'is-success': validateState.value === 'success',
        'is-required': isRequired.value || props.required,
        // 'is-no-asterisk': elForm.hideRequiredAsterisk,
      },
      // sizeClass.value ? 'el-form-item--' + sizeClass.value : '',
    ]);

    const shouldShowError = computed(() => {
      return (
        validateState.value === 'error' &&
        props.showMessage &&
        tableForm.showMessage
      );
    });
    return {
      formItemClass,
      shouldShowError,
      tableForm,
      validateMessage,
      resetField,
      clearValidate,
    };
  },
});
/* eslint-enable @typescript-eslint/no-unused-vars */
</script>
