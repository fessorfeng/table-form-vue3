import { Obj,TableFormTable } from './../components/TableForm/types';
import { computed, ref, Ref, onMounted, onUnmounted } from 'vue';

interface scrollProps {
  wrapHeight: number;
  itemHeight: number;
  isTable: boolean;
}
const useVirtualScroll = (props: scrollProps, scrollWrap: Ref<HTMLElement | TableFormTable<Obj>>, dataList: Ref<any[]>, isRequest?: Ref<boolean>, getDataCallBack?: (...args:any[])=> void)=> {
  const wrapStyle = computed(() => {
    return {
      overflowY: 'auto',
      height: `${props.wrapHeight}px`,
    };
  });

  // const scrollWrap = ref();
  const startIndex = ref(0);
  const wrap = () => {
    const dom = props.isTable ? (scrollWrap.value as TableFormTable<Obj>).$refs.bodyWrapper : (scrollWrap as Ref<HTMLElement>).value;
    return dom;
  };
  const visibleMaxNum = ref(0);
  const getStartIndex = () => {
    const currentIndex = Math.ceil(wrap().scrollTop / props.itemHeight);
    if (currentIndex === startIndex.value) return;
    if (
      currentIndex + visibleMaxNum.value >= dataList.value.length - 1 &&
      isRequest && !isRequest.value
    ) {
      console.log('滚动底了');
      isRequest.value = true;
      // getData(70);
      getDataCallBack && getDataCallBack();
    }
    let start = currentIndex;
    start = start - visibleMaxNum.value;
    start = start >= 0 ? start : 0;
    startIndex.value = start;
  };
  const endIndex = computed(() => {
    const start = startIndex.value;
    let end = start + visibleMaxNum.value * (start > 0 ? 3 : 2);
    const total = dataList.value.length;
    end = end > total ? total : end;
    return end;
  });
  const showDataList = computed(() => {
    return dataList.value.slice(startIndex.value, endIndex.value);
  });
  const viewStyle = computed(() => {
    const total = dataList.value.length;
    return {
      paddingTop: startIndex.value * props.itemHeight + 'px',
      paddingBottom: (total - endIndex.value) * props.itemHeight + 'px',
    };
  });
  const onScroll = () => {
    const scrollTop = wrap().scrollTop;
    console.log(scrollTop);

    const fps = 30;
    const interVal = 1000 / fps;
    let oldTime = Date.now();
    // let requestAnimationFrame = (function () {
    //   return (
    //     window.requestAnimationFrame ||
    //     window.webkitRequestAnimationFrame ||
    //     window?.mozRequestAnimationFrame ||
    //     window?.oRequestAnimationFrame ||
    //     window?.msRequestAnimationFrame ||
    //     function (callback) {
    //       window.setTimeout(callback, 1000 / 60);
    //     }
    //   );
    // })();
    const requestAnimationFrame =
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      function (callback) {
        window.setTimeout(callback, 1000 / 60);
      };
    const func = () => {
      const now = Date.now();
      getStartIndex();
      setScrollViewStyle();
      if (now - oldTime > interVal) {
        oldTime = now;
        requestAnimationFrame(func);
      }
    };
    // 使用arguements.callee报错
    /* requestAnimationFrame(() => {
      const now = Date.now();
      getStartIndex();
      if (now - oldTime > interVal) {
        oldTime = now;
        requestAnimationFrame(arguments.callee);
      }
    }); */
    requestAnimationFrame(func);
  };

  // 滚动容器最大可视数量
  const getContainSize = () => {
    visibleMaxNum.value = ~~(wrap().offsetHeight / props.itemHeight) + 2;
  };
  const setWrapStyle = () => {
    // wrap().style.overflowY = wrapStyle.value.overflowY;
    // wrap().style.height = wrapStyle.value.height;
    wrap().style.cssText += `overflow-y: ${wrapStyle.value.overflowY};height: ${wrapStyle.value.height}`;
  };
  const setScrollViewStyle = () => {
    const scrollContainer = wrap();
    const { paddingTop, paddingBottom } = viewStyle.value;
    const scrollView = scrollContainer.children[0] as HTMLElement;
    // 判断元素是否为HTMLElement元素我们经常使用nodeType==1判断元素是否是一个HMTLElement元素。
    // 
    if (scrollView.nodeType === 1) {
      // scrollView.style.paddingTop = paddingTop;
      // scrollView.style.paddingBottom = paddingBottom;
      scrollView.style.padding = `${paddingTop} 0 ${paddingBottom}`;
    }

    // TODO: 这里可以考虑优化重构代码
    if (props.isTable) {
      const table = scrollWrap.value as TableFormTable<Obj>;
      const { fixedBodyWrapper, rightFixedBodyWrapper } = table.$refs;
      [fixedBodyWrapper, rightFixedBodyWrapper].forEach(v => {
        if (!v) return;
        const dom = v.children[0] as HTMLElement;
        if (dom.nodeType === 1) {
          dom.style.transform = `translate(0, -${scrollContainer.scrollTop - startIndex.value * props.itemHeight}px)`;    
        }
      });
    }
  };
  onMounted(() => {
    setWrapStyle();
    wrap().addEventListener('scroll', onScroll);
    getContainSize();
  });
  onUnmounted(() => {
    const dom = wrap();
    dom && dom.removeEventListener('scroll', onScroll);
  });

  return {
    dataList,
    wrapStyle,
    onScroll,
    scrollWrap,
    visibleMaxNum,
    getContainSize,
    startIndex,
    getStartIndex,
    endIndex,
    showDataList,
    viewStyle,
  };
};

export { useVirtualScroll };
