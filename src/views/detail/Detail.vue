<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"></detail-nav-bar>
    <scroll class="contenty" ref="scroll" @scroll="contentScroll" :probe-type="3">
        <!-- <ul>
            <li v-for="(item,index) in $store.state.cartList" :key="index">{{item}}</li>
        </ul> -->
      <detail-swiper :topImages="topImages"></detail-swiper>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info
        :detail-info="detailInfo"
        @imageLoad="imageLoad"
      ></detail-goods-info>
      <detail-param-info :param-info="paramInfo" ref="params"></detail-param-info>
      <detail-comment-info :comment-info="commentInfo" ref="comment"></detail-comment-info>
      <goods-list :goods="recommends" ref="recommend"></goods-list>
    </scroll>
    <detail-bottom-bar @addCart="addToCart"></detail-bottom-bar>
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
import DetailNavBar from "./childComps/DetailNavBar";
import DetailSwiper from "./childComps/DetailSwiper";
import DetailBaseInfo from "./childComps/DetailBaseInfo";
import DetailShopInfo from "./childComps/DetailShopInfo";
import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
import DetailParamInfo from "./childComps/DetailParamInfo";
import DetailCommentInfo from "./childComps/DetailCommentInfo";
import DetailBottomBar from './childComps/DetailBottomBar'

import Scroll from "components/common/scroll/Scroll";
import GoodsList from "components/content/goods/GoodsList";
// import BackTop from "components/content/backTop/BackTop";


import {
  getDetail,
  Goods,
  Shop,
  GoodsParams,
  getRecommend,
} from "network/detail";
import { debounce } from "common/utils";
import {itemImgListenerMixin,backTopMixin} from 'common/mixin'

export default {
  name: "Detail",
  mixins:[itemImgListenerMixin,backTopMixin],
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopYs:[],
      getThemeTopY:null,
      currentIndex:0,

    };
  },
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    Scroll,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,
    GoodsList,

  },
  created() {
    //保存传入的iid
    this.iid = this.$route.params.iid;
    //根据iid请求详情数据
    getDetail(this.iid).then((res) => {
      // console.log(res);
      //获取顶部图片轮播数据
      const data = res.result;
      this.topImages = data.itemInfo.topImages;

      //获取商品信息
      this.goods = new Goods(
        data.itemInfo,
        data.columns,
        data.shopInfo.services
      );
      //创建店铺的信息
      this.shop = new Shop(data.shopInfo);
      //  保存商品的详情数据
      this.detailInfo = data.detailInfo;
      //获取参数的信息
      this.paramInfo = new GoodsParams(
        data.itemParams.info,
        data.itemParams.rule
      );
      //获取评论信息
      if (data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0];
      }
    });
    //获取推荐数据
    getRecommend().then((res) => {
      this.recommends = res.data.list;
    });
     this.getThemeTopY=debounce(()=>{
        this.themeTopYs=[];
        this.themeTopYs.push(0);
        this.themeTopYs.push(this.$refs.params.$el.offsetTop);
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
        this.themeTopYs.push(Number.MAX_VALUE)
        // console.log(this.themeTopYs);
    },100)
  },
  mounted() {
   
  },
  methods: {
    imageLoad() {
    //   this.$refs.scroll.refresh();
    this.newRefresh()
     this.getThemeTopY()
    },
    titleClick(index){
        this.$refs.scroll.scrollTo(0,-this.themeTopYs[index],50)
    },
    // backClick() {
    //   // this.$refs.scroll.scroll.scrollTo(0,0,500)
    //   this.$refs.scroll.scrollTo(0, 0, 500);
    // },
    contentScroll(position){
        // console.log(position);
        const positionY=-position.y
        let length=this.themeTopYs.length
        for(let i=0;i<length-1;i++){
           if(this.currentIndex!==i&&(positionY>this.themeTopYs[i]&&positionY<this.themeTopYs[i+1])){
                this.currentIndex=i
                console.log(this.currentIndex);
                this.$refs.nav.currentIndex=this.currentIndex
            }
        }
        //1.判断backTop是否显示
      this.isShowBackTop = -position.y > 1000;

    },
    addToCart(){
        //1.获取购物车需要展示的信息
      const product={}
      product.image=this.topImages[0]
      product.title=this.goods.title
      product.desc=this.goods.desc
      product.price=this.goods.realPrice
      product.iid=this.iid
      //2.将商品添加到购物车里
    //   this.$store.commit('addCart',product)
    this.$store.dispatch('addCart',product).then((res)=>{
      // console.log(res);
      this.$toast.show(res)
    })
  }
  },
  
};
</script>

<style scoped>
#detail {
  position: relative;
  z-index: 9;
  background-color: #fff;
  height: 100vh;
}
.detail-nav {
  position: relative;
  z-index: 9;
  background-color: #fff;
}
.contenty {
  /* position: absolute;
    top: 44px;
    bottom: 58px;
    left: 0;
    right: 0; */
  height: calc(100% - 93px);
}
</style>