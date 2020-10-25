<template>
  <div class="cart-list">
    <scroll class="content" ref="scroll">
      <cart-list-item v-for="(item,index) in cartList" :key="index" :item-info="item"></cart-list-item>
    </scroll>
  </div>
</template>

<script>
import Scroll from "components/common/scroll/Scroll";
import CartListItem from './CartListItem'
import { mapGetters } from "vuex";
export default {
  name: "CartList",
  components: {
    Scroll,
    CartListItem
  },
  computed: {
    ...mapGetters(["cartList"]),
  },
  activated(){
      this.$refs.scroll.refresh()
  }
};
</script>

<style scoped>
.cart-list {
  height: 100vh 
  /* height: calc(100vh-133px); */
  /* height: calc(100% - 133px); */
} 
.content {
  height: calc(100% - 137px);
  /* height: 100%; */
  overflow: hidden;
}
/* .content{
    position: absolute;
    top: 44px;
    height: 400px;
    left: 0;
    right: 0;
    bottom: 93px;
} */
</style>