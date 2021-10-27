import { Obj } from '@/components/TableForm/types';
import { NormalObject, TableFormTable } from './types';
import {
  computed,
  ref,
  Ref,
  onMounted,
  onUnmounted,
  createApp,
  defineComponent,
  h,
} from 'vue';
import { uniqueId } from 'lodash-es';

interface transformProps {
  itemHeight: number;
  prevCacheNum: number;
  nextCacheNum: number;
  wrapHeight: number;
  maxHeight: number;
  isTable?: boolean;
}

const useTransform = (
  props: transformProps,
  scrollWrap: Ref<HTMLElement | TableFormTable<Obj>>,
  dataList: Ref<Obj[]>,
  isRequest?: Ref<boolean>,
  getDataCallBack?: (...args: any[]) => void
) => {
  // data
  const start = ref(0);
  const scrollTop = ref(0);
  // const list = Array.isArray(dataList) ? dataList : dataList.value;
  // refDom
  const wrap = () => {
    const dom = props.isTable
      ? (scrollWrap.value as TableFormTable<Obj>).$refs.bodyWrapper
      : (scrollWrap as Ref<HTMLElement>).value;
    return dom;
  };
  const scrollList = () => wrap().children[0] as HTMLElement;

  // computed
  const remain = computed(() => {
    return ~~((props.wrapHeight || props.maxHeight) / props.itemHeight) + 2;
  });
  const total = computed(() => {
    return dataList.value.length;
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
    return dataList.value.slice(start.value, end.value);
  });

  const showDataList = computed(() => {
    return dataList.value.slice(start.value, end.value);
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

    const isrAF = false;
    // 是否做成配置
    if (!isrAF) {
      const num = Math.floor(top / props.itemHeight);
      const startIndex = getNewStartIndex(num);
      start.value = startIndex;
      setScrollViewStyle();
    } else {
      const fps = 60;
      const interVal = 1000 / fps;
      let oldTime = Date.now();
      const requestAnimationFrame =
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window?.mozRequestAnimationFrame ||
        window?.oRequestAnimationFrame ||
        window?.msRequestAnimationFrame ||
        function (callback) {
          window.setTimeout(callback, 1000 / 60);
        };

      const func = () => {
        const now = Date.now();
        const num = Math.floor(top / props.itemHeight);
        start.value = getNewStartIndex(num);
        setScrollViewStyle();
        if (now - oldTime > interVal) {
          oldTime = now;
          requestAnimationFrame(func);
        }
      };
      requestAnimationFrame(func);
    }
  };

  const setScrollInitStyle = () => {
    wrap().style.cssText += `height: ${
      props.wrapHeight || props.maxHeight
    }px;position: relative; overflow-y: auto;`;
    scrollList().style.cssText += `position: absolute;left: 0;top: 0;`;
  };
  const setScrollViewStyle = () => {
    // 因为起始start会变 就要 正值 填充砍掉的start个数高度
    scrollList().style.transform = `translateY(${
      start.value * props.itemHeight
    }px)`;

    if (props.isTable) {
      const table = scrollWrap.value as TableFormTable<Obj>;
      const { fixedBodyWrapper, rightFixedBodyWrapper } = table.$refs;
      [fixedBodyWrapper, rightFixedBodyWrapper].forEach((v) => {
        if (!v) return;
        const dom = v.children[0] as HTMLElement;
        if (dom.nodeType === 1) {
          dom.style.transform = `translate(0, -${
            scrollTop.value - start.value * props.itemHeight
          }px)`;
        }
      });
    }
  };
  const renderBarDom = () => {
    const scrollbarId = uniqueId('table-form-scrollbar');
    const bar = document.createElement('div');
    bar.id = scrollbarId;
    bar.className = 'virtual-list__scrollbar';
    bar.style.cssText = `position: absolute;top: 0;right: 0;left: 0;width: 100%;z-index: -1;`;
    wrap().appendChild(bar);
    createApp(
      defineComponent({
        render() {
          return h(
            'div',
            {
              style: {
                height: scrollBarHeight.value,
              },
            },
            ' '
          );
        },
      })
    ).mount(`#${scrollbarId}`);
  };

  // lifeCycle
  onMounted(() => {
    setScrollInitStyle();
    // setScrollViewStyle();
    renderBarDom();
    wrap().addEventListener('scroll', handleScroll);
  });
  onUnmounted(() => {
    wrap().removeEventListener('scroll', handleScroll);
  });
  return {
    // data
    start,
    scrollTop,
    // refDom
    scrollWrap,
    // computed,
    remain,
    showList,
    showDataList,
    total,
    scrollBarHeight,
    end,

    // methods,
    getNewStartIndex,
    handleScroll,
    setScrollInitStyle,
    setScrollViewStyle,
  };
};

export { useTransform };
