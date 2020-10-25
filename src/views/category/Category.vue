<template>
  <div id="category">
    <nav-bar class="nav-bar">
      <div slot="center">商品分类</div>
    </nav-bar>
    <div class="content">
      <tab-menu :categories="categories" @seletItem="selectItem"></tab-menu>
      <scroll id="tab-content" :data="[categoryData]" ref="scroll">
        <div>
          <tab-content-category :subcategories="showSubcategory" />
          <tab-control
            :titles="['综合', '新品', '销量']"
            @itemClick="tabClick"
          />
          <!-- <tab-content-detail :category-detail="showCategoryDetail"></tab-content-detail> -->
          <goods-list :goods="showCategoryDetail"></goods-list>
        </div>
      </scroll>
    </div>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";
import TabControl from "components/content/tabControl/TabControl";
import GoodsList from "components/content/goods/GoodsList";
import TabContentCategory from "./childComps/TabContentCategory";
// import TabContentDetail from './childComps/TabContentDetail'
import TabMenu from "./childComps/TabMenu";
import Scroll from "components/common/scroll/Scroll";
import { tabControlMixin } from "common/mixin";
 import {POP, SELL, NEW} from "common/const";

import {
  getCategory,
  getSubcategory,
  getCategoryDetail,
} from "network/category";
export default {
  name: "Category",
  components: {
    NavBar,
    TabMenu,
    TabControl,
    Scroll,
    TabContentCategory,
    GoodsList,
  },
  data() {
    return {
      categories: [],
      categoryData: {},
      currentIndex: -1,
    };
  },
  mixins: [tabControlMixin],
  created() {
    this._getCategory();
    this.$bus.$on("imgLoad", () => {
      this.$refs.scroll.refresh();
    });
  },
  computed: {
    showSubcategory() {
      if (this.currentIndex === -1) return {};
      return this.categoryData[this.currentIndex].subcategories;
    },
    showCategoryDetail() {
      if (this.currentIndex === -1) return [];
      return this.categoryData[this.currentIndex].categoryDetail[
        this.currentType
      ];
    },
  },
  methods: {
    _getCategory() {
      //1.获取分类数据
      getCategory().then((res) => {
        // console.log(res);
        this.categories = res.data.category.list;
        //2.初始化每个类别的数据
        for (let i = 0; i < this.categories.length; i++) {
          this.categoryData[i] = {
            subcategories: {},
            categoryDetail: {
              'pop': [],
              'new': [],
              'sell': [],
            },
          };
        }
        this._getSubcategories(0);
      });
    },
    _getSubcategories(index) {
      this.currentIndex = index;
      const mailKey = this.categories[index].maitKey;
      getSubcategory(mailKey).then((res) => {
        console.log(res);
        this.categoryData[index].subcategories = res.data;
        this.categoryData = { ...this.categoryData };
        this._getCategoryDetail(POP)
          this._getCategoryDetail(SELL)
          this._getCategoryDetail(NEW)
      });
    },
    _getCategoryDetail(type) {
      // 1.获取请求的miniWallkey
      const miniWallkey = this.categories[this.currentIndex].miniWallkey;
      getCategoryDetail(miniWallkey, type).then((res) => {
        console.log(res);
        // 3.将获取的数据保存下来
        this.categoryData[this.currentIndex].categoryDetail[type] = res;
        this.categoryData = { ...this.categoryData };
      });
    },
    selectItem(index) {
      this._getSubcategories(index);
    },
  },
};
</script>

<style scoped>
#category {
  height: 100vh;
}
.nav-bar {
  background-color: var(--color-tint);
  font-weight: 700;
  color: #fff;
}
.content {
  position: absolute;
  left: 0;
  right: 0;
  top: 44px;
  bottom: 49px;

  display: flex;
}

#tab-content {
  height: 100%;
  flex: 1;
}
</style>