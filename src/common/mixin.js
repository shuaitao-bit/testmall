import {debounce} from 'common/utils'
import BackTop from "components/content/backTop/BackTop";
import { POP, NEW, SELL } from "./const";
export const itemImgListenerMixin={
    data(){
        return {
            itemImgListener: null,
            newRefresh:null,
        }
    },
    mounted(){
        // this.itemImgListener = () => {
        //     refresh();
        // }
        this.newRefresh = debounce(this.$refs.scroll.refresh, 100)
        this.itemImgListener=()=>{
            this.newRefresh()
        }
        // const refresh = debounce(this.$refs.scroll.refresh, 50);
        // this.$bus.$on("itemImageLoad", () => {
        //     refresh();
        // });
        this.$bus.$on('itemImageLoad',this.itemImgListener)
    }
}
export const backTopMixin={
    components:{
        BackTop,
    },
    data(){
        return {
            isShowBackTop: false,
        }
    },
    methods:{
       backClick(position){
            this.$refs.scroll.scrollTo(0, 0, 500);
       }
    }
}

export const tabControlMixin = {
    data: function () {
        return {
            currentType: POP
        }
    },
    methods: {
        tabClick(index) {
            switch (index) {
                case 0:
                    this.currentType = POP
                    break
                case 1:
                    this.currentType = NEW
                    break
                case 2:
                    this.currentType = SELL
                    break
            }
            console.log(this.currentType);
        }
    }
}