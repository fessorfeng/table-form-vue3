import { ImageComponentProps } from './../defaultProps';
import { computed } from 'vue';
import { pick } from 'lodash-es';
import { TextComponentProps } from '../defaultProps';


const useComponentsCommon = <T extends Readonly<Partial<TextComponentProps | ImageComponentProps>>>(props: T, styleNames: string[], isEdit = false) => {
  const styleProps = computed(() => pick(props, styleNames));
  const handleClick: () => void = () => {
    if (props.url && props.actionType && props.actionType === 'url' && !isEdit) {
      window.location.href = props.url;
      return;
    }
      
  };
  return {
    styleProps,
    handleClick
  }
};

export default useComponentsCommon;