<template>
  <div class="virtual-list" @scroll="handleScroll">
    <div
      class="virtual-list__container"
      ref="container"
      :style="{ height:  containerHeight}"
    >
      <div
        class="virtual-list__list"
        ref="scrollList"
        :style="{ height:  srollBarHeight}"
      >
        <div
          :index="index"
          :vid="item.id"
          class="virtual-list__item"
          v-for="(item, index) in showList"
          :key="item.id"
          :style="{ height: `${size}px` }"
        >
          {{item}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    remain: Number,
    size: Number,
    prev: {
      type: Number,
      default: 3,
    },
    next: {
      type: Number,
      default: 3,
    },

    // prev: Number,
    // next: Number,
  },
  data() {
    return {
      start: 0,
      end: this.remain + this.next,
      scrollTop: 0,
    };
  },

  components: {},
  computed: {
    showList() {
      const start = this.start;
      const end = this.end;
      return this.list.slice(start, end);
    },
    srollBarHeight() {
      return `${this.size * this.total}px`;
    },
    containerHeight() {
      return `${this.size * this.remain}px`;
    },
    total() {
      return this.list.length;
    },
    prevCount() {
      return Math.min(this.start, this.prev);
    },
    nextCount() {
      return Math.min(this.total - this.end, this.next);
    },
  },
  // mounted() {},
  methods: {
    handleScroll(e) {
      // const scrollTop = this.$refs.container.scrollTop;
      const ele = e.srcElement || e.target;
      let { scrollTop, scrollLeft } = ele;
      this.scrollTop = scrollTop;
      const num = Math.floor(scrollTop / this.size);
      this.start = num;

      const { start, end } = this.getVisibleRange(num);
      this.start = start;
      this.end = end;
      // 因为起始start会变 就要 正值 填充砍掉的start个数高度
      this.$refs.scrollList.style.transform = `translateY(${
        start * this.size
      }px)`;
    },
    getVisibleRange(expectStart) {
      const start = expectStart - this.prevCount;
      return {
        start: start >= 0 ? start : 0,
        end: expectStart + this.remain + this.nextCount,
      };
    },
  },
};
</script>
<style lang="scss">
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
.virtual-list {
  overflow-y: auto;
  // &__container {
  //   overflow-y: scroll;
  //   position: relative;
  // }
  // &__list {
  //   position: absolute;
  //   left: 0;
  //   top: 0;
  //   width: 100%;
  // }
  &__item {
    padding: 10px;
    border: 1px solid red;
  }
}
</style>
