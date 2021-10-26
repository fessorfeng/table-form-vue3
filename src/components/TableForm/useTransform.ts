import { NormalObject } from './types';
import { computed, ref, Ref, onMounted, onUnmounted, createApp, defineComponent, h } from 'vue';
import { uniqueId } from 'lodash-es';

interface transformProps {
  // list: NormalObject[];
  itemHeight: number;
  prevCacheNum: number;
  nextCacheNum: number;
  height: number;
  maxHeight: number;
}

const useTransform = (props: transformProps, scrollWrap: Ref<HTMLElement>, scrollView: Ref<HTMLElement>, list: NormalObject[]) => {
  // data
  const start = ref(0);
  const scrollTop = ref(0);
  // refDom
  const scrollList = scrollView;
  // computed
  const remain = computed(() => {
    return ~~((props.height || props.maxHeight) / props.itemHeight) + 2;
  });
  const total = computed(() => {
    return list.length;
  });
  const scrollBarHeight = computed(() => {
    return `${props.itemHeight * total.value}px`;
  });
  const end = computed(() => {
    const endeIndex = start.value + remain.value + props.nextCacheNum;
    const totalNum = total.value;
    return endeIndex > totalNum ? totalNum : endeIndex;
  });
  const showList = computed(() => {
    return list.slice(start.value, end.value);
  });

  // methods
  const getNewStartIndex = (expectStart: number) => {
    const start = expectStart - props.prevCacheNum;
    return start >= 0 ? start : 0;
  };
  const handleScroll = (e: Event) => {
    const ele = (e.srcElement || e.target) as HTMLElement;
    const { scrollTop: top } = ele;
    scrollTop.value = top;

    const num = Math.floor(top / props.itemHeight);
    const startIndex = getNewStartIndex(num);
    start.value = startIndex;
    // 因为起始start会变 就要 正值 填充砍掉的start个数高度
    scrollList.value.style.transform = `translateY(${
      startIndex * props.itemHeight
    }px)`;
  };
  const setScrollWrapStyle = () => {
    scrollWrap.value.style.cssText += `height: ${props.height || props.maxHeight}px;position: relative; overflow-y: auto;`;
  };
  const setScrollViewStyle = () => {
    scrollView.value.style.cssText += `position: absolute;left: 0;top: 0;`;
  };
  const renderBarDom = () => {
    const scrollbarId = uniqueId('table-form-scrollbar');
    const bar = document.createElement('div');
    bar.id = scrollbarId;
    bar.className = 'virtual-list__scrollbar';
    bar.style.cssText = `position: absolute;top: 0;right: 0;left: 0;width: 100%;z-index: -1;`;
    scrollWrap.value.appendChild(bar);
    createApp(defineComponent({
      render() {
        return h('div', {
          style: {
            height: scrollBarHeight.value
          }
        }, " ");
      }
    })).mount(`#${scrollbarId}`);
  };

  // lifeCycle
  onMounted(() => {
    setScrollWrapStyle();
    setScrollViewStyle();
    renderBarDom();
    scrollWrap.value.addEventListener('scroll', handleScroll);
  });
  onUnmounted(() => {
    scrollWrap.value.removeEventListener('scroll', handleScroll);
  });
  return {
    // data
    start,
    scrollTop,
    // refDom
    scrollWrap,
    scrollList,
    // computed,
    remain,
    showList,
    total,
    scrollBarHeight,
    end,

    // methods,
    getNewStartIndex,
    handleScroll,
    setScrollWrapStyle,
    setScrollViewStyle,
  };
};

export { useTransform };
