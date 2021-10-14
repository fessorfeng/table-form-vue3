import { mapValues, without } from 'lodash-es';

export interface CommonComponentProps {
  actionType: string;
  url: string;
  // size
  height: string;
  width: string;
  paddingLeft: string;
  paddingRight: string;
  paddingTop: string;
  paddingBottom: string;
  // border type
  borderStyle: string;
  borderColor: string;
  borderWidth: string;
  borderRadius: string;
  // shadow and opacity
  boxshadow: string;
  opacity: string;
  // position and x, y
  position: string;
  left: string;
  right: string;
  top: string;
}

export const commonDefaultProps: CommonComponentProps = {
  // actions
  actionType: '',
  url: '',
  // size
  height: '',
  width: '318px',
  paddingLeft: '0px',
  paddingRight: '0px',
  paddingTop: '0px',
  paddingBottom: '0px',
  // border type
  borderStyle: 'none',
  borderColor: '#000',
  borderWidth: '0',
  borderRadius: '0',
  // shadow and opacity
  boxshadow: '0 0 0 #000000',
  opacity: '1',
  // position and x, y
  position: 'absolute',
  left: '0',
  right: '0',
  top: '0',
};

export interface TextComponentProps extends CommonComponentProps {
  text: string;
  fontSize: string;
  fontFamily: string;
  fontWeight: string;
  fontStyle: string;
  textDecoration: string;
  lineHeight: string;
  textAlign: string;
  color: string;
  backgroundColor: string;
}
export const textDefaultProps: TextComponentProps = {
  // 通用属性
  ...commonDefaultProps,
  // 特有属性
  text: '正文内容',
  fontSize: '14px',
  fontFamily: '',
  fontWeight: 'normal',
  fontStyle: 'normal',
  textDecoration: 'none',
  lineHeight: '1',
  textAlign: 'left',
  color: '#000000',
  backgroundColor: '',
};

export const textStyleNames = without(
  Object.keys(textDefaultProps),
  'actionType',
  'url',
  'text'
);

export interface ImageComponentProps extends CommonComponentProps {
  src: string;
}

export const imageDefaultProps: ImageComponentProps = {
  ...commonDefaultProps,
  src: '',
};

export const imageStyleNames = without(
  Object.keys(imageDefaultProps),
  'actionType',
  'url',
  'text',
  'src'
);


export const transformToComponentProps = <T extends TextComponentProps | ImageComponentProps>(props: T) => {
  return mapValues(props, (item) => {
    return {
      type: (item as any).constructor as StringConstructor,
      default: item,
    };
  });
};
