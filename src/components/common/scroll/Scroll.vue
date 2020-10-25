<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BScroll from '@better-scroll/core'
  import Pullup from '@better-scroll/pull-up'

BScroll.use(Pullup)
export default {
  name: "Scroll",
  data() {
    return {
      scroll: null,
    };
  },
  props: {
    probeType: {
      type: Number,
      default: 0,
    },
    pullUpLoad:{
        type:Boolean,
        default:false
    }
  },
  mounted() {
    //1.创建scroll对象
    this.scroll = new BScroll(this.$refs.wrapper, {
      click: true,
      probeType: this.probeType,
      pullUpLoad: this.pullUpLoad,
    })

    //监听滚动位置
    if(this.probeType===2||this.probeType===3){
        this.scroll.on("scroll", (position) => {
      // console.log(position);
      this.$emit("scroll", position);
    })
    }

    //监听scroll滚动到底部
    if(this.pullUpLoad===true){
        this.scroll.on('pullingUp',()=>{
            // console.log('上拉加载');
            this.$emit('pullingUp')
        })
    }
  },
  methods: {
    scrollTo(x, y, time = 300) {
      this.scrollTo && this.scroll.scrollTo(x, y, time);
    },
    // finishPullUp(){
    //     this.scroll.finishPullUp()
    // },
    refresh(){
      this.scroll && this.scroll.refresh()
    },
    finishPullUp(){
        this.scroll && this.scroll.finishPullUp()
    },
    getScrollY(){
        return this.scroll ? this.scroll.y:0
    },
  },
};
</script>

<style scoped>
.wrapper{
  overflow: hidden;
}
</style>>

