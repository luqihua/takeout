<template>
  <transition name="move">
    <div class="food-root" v-show="showFlag" ref="foodRoot">
      <div class="food-content">
        <div class="header">
          <img :src="food.image">
          <div class="back" @click="dismiss">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="content">
          <h1 class="title">{{food.name}}</h1>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}份</span>
            <span class="rating">好评率{{food.rating}}%</span>
          </div>
          <!--价格-->
          <div class="price">
            <span class="now">¥{{food.price}}</span>
            <span class="old" v-show="food.oldPrice">¥{{food.oldPrice}}</span>
          </div>
          <div class="cart-control-wrapper">
            <v-cartcontrol :food="food"></v-cartcontrol>
          </div>
          <!--加入购物车按钮-->
          <transition name="fade">
            <div class="buy" v-show="!food.count" @click="addFirst($event)">加入购物车</div>
          </transition>
        </div>
        <!--分割线-->
        <v-split v-show="food.info"></v-split>
        <!--商品介绍-->
        <div class="food-info-wrapper" v-show="food.info">
          <h1 class="title">商品信息</h1>
          <p class="info">{{food.info}}</p>
        </div>
        <!--分割线-->
        <v-split v-show="food.info"></v-split>
        <!--商品介绍-->
        <div class="food-rating-wrapper" v-show="food.info">
          <h1 class="title">商品评价</h1>
          <p class="info">{{food.info}}</p>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';
  import BScroll from 'better-scroll';
  import cartcontrol from 'components/cartcontrol/cartcontrol';
  import split from 'components/tools/split';

  export default {
    components: {
      'v-cartcontrol': cartcontrol,
      'v-split': split
    },
    props: {
      food: {
        type: Object
      }
    },
    data() {
      return {
        showFlag: false
      };
    },
    methods: {
      show() {
        this.showFlag = true;
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.foodRoot, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      },
      dismiss() {
        this.showFlag = false;
      },
      addFirst(event) {
        if (!event._constructed) {
          return;
        }
        Vue.set(this.food, 'count', 1);
        // 全局分发一个添加商品的事件
        this.$root.eventHub.$emit('add-cart', event.target);
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .food-root
    position fixed
    left 0
    top 0
    bottom 48px
    z-index 30
    width 100%
    background #fff
    &.move-enter-active, &.move-leave-active
      transition all .5s
    &.move-enter, &.move-leave-active
      transform translateX(100%)
      opacity 0
    .header
      position: relative
      width 100%
      height 0
      padding-top 100%
      img
        position absolute
        top 0
        left 0
        width 100%
        height 100%
      .back
        position absolute
        top 10px
        left 0
        .icon-arrow_lift
          display block
          padding 10px
          font-size 20px
          color #fff
    .content
      padding 18px
      position relative
      .title
        line-height 14px
        margin-bottom 8px
        font-size 14px
        font-weight 700
        color rgb(7, 17, 27)
      .detail
        height 10px
        margin-bottom 18px
        line-height 10px
        font-size 0
        .sell-count, .rating
          font-size 10px
          color rgb(147, 153, 159)
        .sell-count
          margin-right 12px
      .price
        font-weight 700
        line-height 24px
        .now
          margin-right 8px
          font-size 14px
          color rgb(240, 20, 20)
        .old
          text-decoration line-through
          font-size 10px
          color rgb(147, 153, 159)
      .cart-control-wrapper
        position absolute
        right 12px
        bottom 12px
      .buy
        position absolute
        right 18px
        bottom 18px
        z-index 10
        line-height 24px
        padding 0 12px
        box-sizing border-box
        font-size 10px
        border-radius 12px
        color #fff
        background rgb(0, 160, 220)
      &.fade-enter-active, &.fade-leave-active
        transition .5s
      &.fade-enter, &.fade-leave-active
        opacity 0
    .food-info-wrapper
      padding 18px
      .title
        line-height 14px
        margin-bottom 6px
        font-size 14px
        font-weight 700
        color rgb(7, 17, 27)
      .info
        padding 0 8px
        line-height 24px
        font-size 12px
        color rgb(77, 85, 93)
</style>
