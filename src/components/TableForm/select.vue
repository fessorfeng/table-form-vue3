<template>
  <el-popper
    ref="popper"
    v-model:visible="popperVisible"
    :offset="5"
    :placement="placement"
    :show-arrow="false"
    :stop-popper-mouse-event="false"
    effect="light"
    pure
    manual-mode
    popper-class="custom-select"
    append-to-body
  >
    <template #default>
      <div v-if="options.length">
        <div class="custom-select__top">
          <el-input
            ref="search"
            v-model="filterInput"
            type="text"
            size="mini"
            :validate-event="false"
            placeholder="输入关键字过滤"
          >
          </el-input>
        </div>
        <el-scrollbar wrap-class="custom-select__content">
          <!-- 多选 -->
          <el-checkbox-group
            v-model="checkedValue"
            class="custom-select__checkbox-group"
            @change="handleCheckedChange"
            v-if="multiple"
          >
            <el-checkbox
              v-for="option in filterOptions"
              :key="option.value"
              :label="option.value"
            >
              {{ option.label }}
            </el-checkbox>
          </el-checkbox-group>
          <!-- 单选 -->
          <el-radio-group
            v-model="radioValue"
            class="custom-select__radio-group"
            @change="handleRadioChange"
            v-else
          >
            <el-radio
              v-for="option in filterOptions"
              :key="option.value"
              :label="option.value"
              >{{ option.label }}</el-radio
            >
          </el-radio-group>
        </el-scrollbar>
        <div class="custom-select__bottom">
          <el-checkbox
            class="check-all"
            v-model="checkAll"
            @change="handleCheckAllChange"
            v-if="multiple"
            >全选</el-checkbox
          >
          <span v-else></span>
          <button type @click="handleReset">重置</button>
        </div>
      </div>
      <template v-if="options.length === 0">
        <slot v-if="$slots.empty" name="empty"></slot>
        <p v-else class="el-select-dropdown__empty">
          {{ emptyText || '暂无数据' }}
        </p>
      </template>
    </template>
    <template #trigger>
      <div
        v-click-outside:[popperPaneRef]="hideFilterPanel"
        @click="showFilterPanel"
        class="custom-select__trigger"
      >
        <div
          ref="tags"
          class="el-select__tags"
          :style="{ 'max-width': inputWidth - 32 + 'px', width: '100%' }"
        >
          <span v-if="collapseTags && filterCheckedOptons.length">
            <el-tag
              :closable="!selectDisabled && !filterCheckedOptons[0]?.isDisabled"
              :size="collapseTagSize"
              :hit="filterCheckedOptons[0].hitState"
              type="info"
              disable-transitions
              @close="deleteTag($event, filterCheckedOptons[0])"
            >
              <span
                class="el-select__tags-text"
                :style="{ 'max-width': inputWidth - 123 + 'px' }"
                >{{ filterCheckedOptons[0].label }}</span
              >
            </el-tag>
            <el-tag
              v-if="filterCheckedOptons.length > 1"
              :closable="false"
              :size="collapseTagSize"
              type="info"
              disable-transitions
            >
              <span class="el-select__tags-text"
                >+ {{ filterCheckedOptons.length - 1 }}</span
              >
            </el-tag>
          </span>
        </div>
        <el-input
          ref="reference"
          :modelValue=" !collapseTags ? selectedLabel : ''"
          type="text"
          :size="size"
          :readonly="true"
          :disabled="disabled"
          :validate-event="false"
          class="custom-select__input"
          :placeholder="
            Array.isArray(modelValue) && modelValue.length ? '' : placeholder
          "
        >
          <template v-if="$slots.prefix" #prefix>
            <div
              style="
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
              "
            >
              <slot name="prefix"></slot>
            </div>
          </template>
          <template #suffix>
            <i
              v-show="!showClose"
              :class="[
                'el-select__caret',
                'el-input__icon',
                'el-icon-' + iconClass,
              ]"
            ></i>
            <i
              v-if="showClose"
              :class="`el-select__caret el-input__icon ${clearIcon}`"
              @click="handleClearClick"
            ></i>
          </template>
        </el-input>
      </div>
    </template>
  </el-popper>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  PropType,
  Ref,
  ref,
  watch,
} from 'vue';
import { ClickOutside } from 'element-plus/es/directives';
import {
  ElPopper,
  ElScrollbar,
  ElCheckboxGroup,
  ElCheckbox,
  ElRadioGroup,
  ElRadio,
  ElTag,
} from 'element-plus';
import { Option } from 'element-plus/lib/el-select-v2/src/select.types';

export default defineComponent({
  name: 'CustomSelect',
  components: {
    ElPopper,
    ElScrollbar,
    ElCheckboxGroup,
    ElCheckbox,
    ElRadioGroup,
    ElRadio,
    ElTag,
  },
  directives: {
    ClickOutside,
  },
  props: {
    modelValue: [Array, String, Number, Boolean, Object],
    placement: {
      type: String,
      default: 'bottom-start',
    },
    size: {
      type: String as PropType<'medium' | 'small' | 'mini'>,
      default: 'mini',
      required: true,
    },
    disabled: Boolean,
    clearable: Boolean,
    multiple: {
      type: Boolean,
      default: false,
    },
    emptyText: String,
    options: {
      type: Array as PropType<Option<string | number>[]>,
      default: () => {
        return [];
      },
    },
    clearIcon: {
      type: String,
      default: 'el-icon-circle-close',
    },
    collapseTags: {
      type: Boolean,
      default: true,
    },
    placeholder: String,
    delInvalidValue: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['change', 'update:modelValue', 'clear', 'remove-tag'],
  /* beforeCreate -> use setup()
  created -> use setup() */
  setup(props, { emit }) {
    const popperVisible = ref(false);
    
    const popper = ref(null);
    const initialCheckedValue: Ref<Array<string | number>> = ref([]);

    const showFilterPanel = (e: MouseEvent) => {
      e.stopPropagation();
      popperVisible.value = !popperVisible.value;
    };
    const hideFilterPanel = () => {
      popperVisible.value = false;
    };
    const popperPaneRef = computed(() => {
      return popper.value?.popperRef;
    });

    const checkedValue: Ref<Array<string | number>> = ref([]);
    const radioValue: Ref<string | number> = ref('');

    // TODO是否需要记录用户基础值传入已emit也是字符串值出
    const valueBindInit = () => {
      let val = props.modelValue;
      // 是否数组
      if (Array.isArray(val)) {
        // 是
        return val as Array<string | number>;
      } else {
        // 否：单选 or 多选（'1,2'）
        return (props.multiple ? (val as string).split(',') : [val]) as Array<
          string | number
        >;
      }
    };
    const optionsMap = computed(() => {
      const options = props.options;
      if (!options.length) return null;
      let obj = new Map();
      options.forEach((o) => {
        obj.set(o.value, o);
      });
      return obj;
    });
    const emitValChange = (vals: any) => {
      emit('update:modelValue', vals);
      emit('change', vals);
    };
    const getValidVals = (arr: Array<string | number>) => {
      const res: Array<string | number> = [];
      // 解决实现叉掉tag对应勾选项删掉的问题
      if (Array.isArray(arr) && arr.length) {
        let obj = optionsMap.value as Map<any, any>;
        const values = Array.from(obj.keys());
        arr.forEach((v) => {
          if (values.includes(v)) {
            res.push(v);
          }
        });
      }
      if (props.delInvalidValue && arr.length !== res.length) {
        emitValChange(res);
      }
      return res;
    };
    const checkAll = ref(false);
    const initial = getValidVals(valueBindInit());
    initialCheckedValue.value = initial;
    checkedValue.value = initial;
    if (!props.multiple) {
      if (initial.length > 1) {
        throw new Error('数组长度不能大于1');
      }
      radioValue.value = initial.length ? initial[0] : '';
    }

    const handleCheckAllChange = (res: boolean) => {
      checkedValue.value = res
        ? (props.options as Option[]).map((o) => o.value)
        : [];
      handleCheckedChange(checkedValue.value);
    };
    const handleReset = () => {
      const initialVal = initialCheckedValue.value;

      if (props.multiple) {
        checkedValue.value = initialVal;
      } else {
        radioValue.value = initialVal.length ? initialVal[0] : '';
      }

      handleCheckedChange(props.multiple ? initialVal : radioValue.value);
    };
    // 筛选文本
    const filterInput = ref('');
    // 过滤后的选项
    const filterOptions = computed(() => {
      const txt = filterInput.value;
      if (txt.length) {
        return props.options.filter((o) => o.label.indexOf(txt) > -1);
      }
      return props.options;
    });

    const getFilterCheckedOptions = (vals: Array<string | number> ) => {
      const txt = filterInput.value as string;
      let obj = optionsMap.value as Map<any, Option>;
      let valsOptions = vals.map(v => obj.get(v) as Option);
      valsOptions = txt.length
        ? valsOptions.filter((v) => `${v.label}`.indexOf(txt) > -1)
        : valsOptions;
        return valsOptions;
    };

    // 过滤后的勾选项
    const filterCheckedOptons = computed(() => {
      const arr = valueBindInit();
      const res: Option[] = [];
      // 解决实现叉掉tag对应勾选项删掉的问题
      if (Array.isArray(arr) && arr.length) {
        let obj = optionsMap.value as Map<any, any>;
        const values = Array.from(obj.keys());
        arr.forEach(v => {
          if (values.includes(v)) {
            res.push(obj.get(v));
          }
        });
      }
      // 前面设置初始化过滤无效值就会去掉无效值
      if (arr.length !== res.length) console.error('请检查modelValue值是否有效');
      return res;
    });

    // TODO: 是否考虑数组','连接emit 但是string, number有问题 除非规定传入都是string option

    // 勾选 更新过滤后的值, 全选状态
    const handleCheckedChange = (e: any) => {
      let vals;

      if (Array.isArray(e)) {
        vals = e.length ? (e as Array<string | number>) : [];
      } else {
        vals = [e] as Array<string | number>;
      }

      const valsOptions = getFilterCheckedOptions(vals);
      const filterVals = valsOptions.map(v => v.value);

      emitValChange(filterVals);

      // 更新全选状态
      if (props.multiple) {
        const checkedCount = filterVals.length;
        const options = filterOptions.value;
        const countIsSame = checkedCount === options.length;
        checkAll.value = !checkedCount
          ? false
          : countIsSame &&
            filterVals.every((v) => options.map((o) => o.value).includes(v));
      }
    };
    const selectedLabel = computed(() => {
      const vals = getValidVals(valueBindInit());
      const valsOptions = getFilterCheckedOptions(vals);
      return valsOptions.map(v => v.label).join(',');
    });

    watch(filterInput, () => {
      const vals = props.multiple ? checkedValue.value : radioValue.value;
      handleCheckedChange(vals);
    });

    const handleRadioChange = (e: string | number) => {
      handleCheckedChange(e);
    };

    const selectDisabled = computed(() => props.disabled);
    const showClose = computed(() => {
      const hasValue = props.multiple
        ? Array.isArray(props.modelValue) && props.modelValue.length > 0
        : props.modelValue !== undefined &&
          props.modelValue !== null &&
          props.modelValue !== '';

      const criteria =
        props.clearable &&
        !selectDisabled.value &&
        hasValue;
      return criteria;
    });
    const iconClass = computed(() =>
      popperVisible.value ? 'arrow-up is-reverse' : 'arrow-up'
    );
    const deleteTag = (event: Event, tag: Option) => {
      const index = filterCheckedOptons.value.indexOf(tag);
      if (index > -1 && !selectDisabled.value) {
        const value = (props.modelValue as Array<string | number>).slice();
        value.splice(index, 1);
        if (props.multiple) {
          checkedValue.value = value;
        } else {
          radioValue.value = '';
        }

        handleCheckedChange(value);
        emit('remove-tag', tag.value);
      }
      event.stopPropagation();
    };
    const deleteSelected = (event: Event) => {
      event.stopPropagation();
      const value = props.multiple ? [] : '';
      // let value: Array<string | number> = [];
      // TODO:后面再考虑这里的逻辑
      /* if (typeof value !== 'string') {
        for (const item of states.selected) {
          if (item.isDisabled) value.push(item.value);
        }
      } */
      if (props.multiple) {
        checkedValue.value = [];
      } else {
        radioValue.value = '';
      }
      handleCheckedChange(value);
      // TODO 可以考虑做成props
      popperVisible.value = false;
      emit('clear');
    };

    const handleClearClick = (event: Event) => {
      deleteSelected(event);
    };
    const reference = ref();
    const inputWidth = ref(0);
    const resetInputWidth = () => {
      inputWidth.value = reference.value?.$el.getBoundingClientRect().width;
    };
    onMounted(() => {
      resetInputWidth();
    });
    const selectSize = computed(() => props.size);

    const collapseTagSize = computed(() =>
      ['small', 'mini'].indexOf(selectSize.value) > -1 ? 'mini' : 'small'
    );
    return {
      popperVisible,
      selectedLabel,
      showFilterPanel,
      hideFilterPanel,
      popperPaneRef,
      popper,
      handleCheckedChange,
      checkedValue,
      checkAll,
      handleCheckAllChange,
      handleReset,
      filterInput,
      filterOptions,
      initialCheckedValue,
      radioValue,
      handleRadioChange,

      selectDisabled,
      showClose,
      iconClass,
      handleClearClick,
      filterCheckedOptons,
      inputWidth,
      resetInputWidth,
      selectSize,
      collapseTagSize,
      deleteTag,
      reference,
      optionsMap,
    };
  },
});
</script>

<style lang="scss">
.custom-select {
  max-width: 200px;
  &__checkbox-group {
    padding: 8px 10px 0;
    label.el-checkbox {
      display: block;
      margin-right: 5px;
      margin-bottom: 8px;
      margin-left: 5px;
    }
  }
  &__radio-group {
    padding: 8px 10px 0;
    label.el-radio {
      display: block;
      margin-right: 5px;
      margin-bottom: 8px;
      margin-left: 5px;
    }
  }
  &__content {
    max-height: 280px;
  }
  &__top {
    padding: 10px 10px 0;
  }
  &__bottom {
    border-top: 1px solid var(--el-border-color-lighter);
    padding: 8px 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .check-all {
      margin-left: 5px;
    }

    button {
      background: transparent;
      border: none;
      // color: var(--el-text-color-regular);
      cursor: pointer;
      font-size: var(--el-font-size-small);
      padding: 0 3px;

      &,
      &:hover {
        color: var(--el-color-primary);
      }
    }
  }
  &__input {
    &.el-input .el-select__caret {
      color: var(--el-select-input-color);
      font-size: var(--el-select-input-font-size);
      transition: transform var(--el-transition-duration);
      transform: rotate(180deg);
      cursor: pointer;
      &.is-reverse {
        transform: rotate(0deg);
      }
    }
  }
  &__trigger {
    position: relative;
    .el-tag__close {
      margin-top: -2px;
    }

    .el-select__tags .el-tag {
      box-sizing: border-box;
      border-color: transparent;
      margin: 2px 0 2px 6px;
      background-color: #f0f2f5;

      .el-icon-close {
        background-color: var(--el-text-color-placeholder);
        right: -7px;
        top: 0;
        color: #fff;
      }

      .el-icon-close:hover {
        background-color: var(--el-text-color-secondary);
      }
      .el-icon-close:before {
        display: block;
        transform: translateY(0.5px);
      }
    }
  }
}
</style>
