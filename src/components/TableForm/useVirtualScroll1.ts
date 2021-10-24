import { Obj,TableFormTable } from '@/components/TableForm/types';
import { computed, ref, Ref, onMounted, onUnmounted, createApp, defineComponent, h } from 'vue';
import { uniqueId } from 'lodash-es';

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

  const startIndex = ref(0);
  const wrap = () => {
    const dom = props.isTable ? (scrollWrap.value as TableFormTable<Obj>).$refs.bodyWrapper : (scrollWrap as Ref<HTMLElement>).value;
    return dom;
  };
  const visibleMaxNum = ref(0);
  const scrollTop = ref(0);

  const getStartIndex = () => {
    const top = scrollTop.value;
    const currentIndex = Math.ceil( top / props.itemHeight);
    // if (currentIndex === startIndex.value) return;
    if (
      currentIndex + visibleMaxNum.value >= dataList.value.length - 1 &&
      isRequest && !isRequest.value
    ) {
      console.log('滚动底了');
      isRequest.value = true;
      getDataCallBack && getDataCallBack();
    }
    let start = currentIndex;
    start = start - visibleMaxNum.value;
    start = start >= 0 ? start : 0;
    startIndex.value = start;
  };
  const endIndex = computed(() => {
    const start = startIndex.value;
    let end = start + visibleMaxNum.value * (start > 0 ? 3 : 3);
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
  const onScroll = (e: Event) => {
    // console.log(e);
    const dom = (e.target || e.srcElement) as HTMLElement;
    const top = dom.scrollTop;
    scrollTop.value = top;
    // 没用用去掉 查询会触发重排
    // const scrollTop = wrap().scrollTop;
    

    const fps = 30;
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
  const scrollBarHeight = computed(() => {
    return props.itemHeight * dataList.value.length;
  });
  const scrollbarId = uniqueId('table-form-scrollbar');
  const renderBarDom = () => {
    const bar = document.createElement('div');
    bar.id = scrollbarId;
    // bar.style.cssText = `position: absolute;top: 0;right: 0;left: 0;z-index: -1;`;
    wrap().appendChild(bar);
    createApp(defineComponent({
      render() {
        return h('div', {
          style: {
            height: `${scrollBarHeight.value}px`
          }
        }, " ");
      }
    })).mount(`#${scrollbarId}`);
  };
  const setWrapStyle = () => {
    // wrap().style.overflowY = wrapStyle.value.overflowY;
    // wrap().style.height = wrapStyle.value.height;
    wrap().style.cssText += `overflow-y: ${wrapStyle.value.overflowY};height: ${wrapStyle.value.height};position: relative;`;
    renderBarDom();
  };
  const setScrollViewStyle = (init = false) => {
    const scrollContainer = wrap();
    const { paddingTop, paddingBottom } = viewStyle.value;
    const scrollView = scrollContainer.children[0] as HTMLElement;
    // 判断元素是否为HTMLElement元素我们经常使用nodeType==1判断元素是否是一个HMTLElement元素。
    //
    const translateY = !startIndex.value ? (0 - scrollTop.value) : (scrollTop.value - startIndex.value * props.itemHeight);
    if (scrollView.nodeType === 1) {
      // scrollView.style.padding = `${paddingTop} 0 ${paddingBottom}`;
      // 用scrollBar高度撑开了
      // scrollView.style.transform = `translateY(${startIndex.value * props.itemHeight}px)`
      // const transFormCss = `transform: translate(0, ${scrollTop.value - startIndex.value * props.itemHeight}px);`;
      const transFormCss = `transform: translateY(${translateY}px);`;
      scrollView.style.cssText += `position: absolute;top: 0;right: 0;left: 0;${transFormCss}`;
    }

    // TODO: 这里可以考虑优化重构代码
    if (props.isTable && !init) {
      const table = scrollWrap.value as TableFormTable<Obj>;
      const { fixedBodyWrapper, rightFixedBodyWrapper } = table.$refs;
      [fixedBodyWrapper, rightFixedBodyWrapper].forEach(v => {
        if (!v) return;
        const dom = v.children[0] as HTMLElement;
        if (dom.nodeType === 1) {
          dom.style.transform = `translate(0, -${scrollTop.value - startIndex.value * props.itemHeight}px)`;    
        }
      });
    }

    console.log(scrollTop.value, startIndex.value, endIndex.value, translateY, visibleMaxNum.value);
  };
  onMounted(() => {
    setWrapStyle();
    wrap().addEventListener('scroll', onScroll);
    getContainSize();
    setScrollViewStyle(true);
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
    scrollBarHeight,
    scrollTop,

    renderBarDom,
  };
};

export { useVirtualScroll };
