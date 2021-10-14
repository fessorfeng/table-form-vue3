import { h, VNode } from 'vue';
import { TextComponentProps } from './defaultProps';
export interface PropToForm {
  component: string;
  value?: string;
  text?: string;
  extraProps?: { [key: string]: any };
  initalValFunc?: (val: any) => any;
  subComponent?: string;
  options?: Array<{
    label: string | VNode;
    value: any;
  }>;
  valueKey?: string; // 传参的Key
  changeEventName?: string; // 值变化emit触发的事件
  // 值更新后 需要转换到方法
  afterChangeValTransfrom?: (val: any) => any;
  subComponentLabelBindKey?: 'label' | 'value';
}

export type PropsToForm = {
  [P in keyof TextComponentProps]?: PropToForm
}

const fontFamilyOptions = [
  { label: 'Arial', value: 'Arial' },
  { label: 'Times New Roman', value: 'Times New Roman' },
  { label: '微软雅黑', value: 'Microsoft YaHei' },
  { label: 'serif', value: 'serif' },
  { label: '仿宋', value: 'fangsong' },
];
const fontFamilyOptionsVNode = fontFamilyOptions.map(o => {
  const { label, value } = o;
  const vNode = h('span', {style: {fontFamily: value}}, label) as VNode;
  return {
    value,
    label: vNode
  };
});
export const propsMapToForm: PropsToForm = {
  text: {
    component: 'el-input',
    text: '文本',
    extraProps: {
      type: 'textarea',
      rows: 2,
      autosize: false,
    },
  },
  lineHeight: {
    component: 'el-slider',
    text: '行高',
    extraProps: {
      min: 0,
      max: 3,
      step: 0.1,
    },
    initalValFunc: (val) => {
      return parseFloat(val);
    },
    afterChangeValTransfrom: e => `${e}`,
  },
  fontSize: {
    component: 'el-input-number',
    text: '字号',
    extraProps: {
      min: 12,
      max: 100,
      controlsPosition: 'right',
      size: 'small'
    },
    initalValFunc: (val) => {
      return parseFloat(val);
    },
    afterChangeValTransfrom: e => `${e}px`,
  },
  textAlign: {
    component: 'el-radio-group',
    text: '对齐方式',
    options: [
      { label: '左对齐', value: 'left' },
      { label: '居中', value: 'center' },
      { label: '右对齐', value: 'right' },
    ],
    subComponent: 'el-radio-button',
    subComponentLabelBindKey: 'value',
  },
  fontFamily: {
    component: 'el-select',
    text: '字体',
    options: fontFamilyOptionsVNode,
    subComponent: 'el-option',
    // changeEventName: 'change'
  },
  color: {
    component: 'color-picker',
    text: '文字颜色',
    extraProps: {
      size: 'small',
      showAlpha: true,
      predefine: [
        '#ffffff',
        '#F5222D',
        '#FA541C',
        '#FADB14',
        '#52C41A',
        '#1890FF',
        '#722ED1',
        '#8C8C8C',
        '#000000',
        'rgba(255,255,255, 0)'
      ]
    }
  },
  backgroundColor: {
    component: 'el-color-picker',
    text: '背景颜色',
    extraProps: {
      size: 'small',
      showAlpha: true,
      predefine: [
        '#ffffff',
        '#F5222D',
        '#FA541C',
        '#FADB14',
        '#52C41A',
        '#1890FF',
        '#722ED1',
        '#8C8C8C',
        '#000000',
        'rgba(255,255,255, 0)'
      ]
    }
  },
  opacity: {
    component: 'el-slider',
    text: '透明度',
    extraProps: {
      min: 0,
      max: 100,
      step: -1,
      formatTooltip: (val: number) => {
        // console.log(typeof val);
        return `${100 - val}`;
      },
      class: ['reverse']
    },
    initalValFunc: (val) => {
      return parseFloat(val) * 100;
    },
    afterChangeValTransfrom: e => {
      const v = (e / 100) as number;
      return `${v.toFixed(2)}`;
    },
  }
}