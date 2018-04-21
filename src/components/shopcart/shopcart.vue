<template>
  <div class="root">
    <div class="shop-cart">
      <div class="content">
        <!--左侧购物车按钮-->
        <div class="content-left" @click="toggleCarList">
          <div class="logo-wrapper">
            <div class="logo" :class="{'highlight':totalCount>0}">
              <span class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></span>
            </div>
            <div v-show="totalCount>0" class=" num">{{totalCount}}
            </div>
          </div>
          <div class="price" :class="{'highlight':totalCount>0}">¥{{totalPrice}}</div>
          <div class="desc">另需配送费¥{{deliveryPrice}}</div>
        </div>
        <!--右侧去支付按钮-->
        <div class="content-right" :class="{'enough':totalPrice>=minPrice,'not-enough':totalPrice<minPrice}"
             @click="toPay">
          <div class="pay">{{payDesc}}</div>
        </div>
      </div>
      <!--下落的小球控件-->
      <div class="ball-container">
        <div v-for="(ball,index) in balls" :key="index">
          <transition name="drop" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
            <div class="ball" v-show="ball.show">
              <div class="inner inner-hook"></div>
            </div>
          </transition>
        </div>
      </div>
      <!--购物车详情-->
      <transition name="fold">
        <div class="cart-list" v-show="showCartList">
          <div class="list-header">
            <div class="title">购物车</div>
            <div class="clean" @click="clean">清空</div>
          </div>
          <div class="list-content" ref="listContent">
            <ul>
              <li class="food border-1px" v-for="(food,index) in selectFoods" :key="index">
                <div class="name">{{food.name}}</div>
                <div class="price">
                  <span>¥{{food.price*food.count}}</span>
                </div>
                <div class="cart-control-wrapper">
                  <v-cartcontrol :food="food"></v-cartcontrol>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <!--购物车详情的背景遮罩-->
    <transition name="fade">
      <div class="list-mask" v-show="showCartList" @click="hideList"></div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import cartcontrol from 'components/cartcontrol/cartcontrol';
  import BScroll from 'better-scroll';

  export default {
    components: {
      'v-cartcontrol': cartcontrol
    },
    created() {
      // 注册监听商品添加的事件
      this.$root.eventHub.$on('add-cart', (target) => {
        this.$nextTick(() => {
          this.drop(target);
        });
      });
    },
    beforeDestroy() {
      this.$root.eventHub.$off('add-cart');
    },
    props: {
      selectFoods: {
        type: Array,
        default() {
          return [];
        }
      },
      deliveryPrice: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        balls: [{show: false}, {show: false}, {show: false}, {show: false}, {show: false}, {show: false}],
        dropBalls: [],
        fold: true
      };
    },
    computed: {
      totalPrice() {
        let total = 0;
        this.selectFoods.forEach((food) => {
          total += food.price * food.count;
        });
        return total;
      },
      totalCount() {
        let count = 0;
        this.selectFoods.forEach((food) => {
          count += food.count;
        });
        return count;
      },
      payDesc() {
        if (this.totalPrice === 0) {
          return `¥${this.minPrice}元起送`;
        } else if (this.totalPrice < this.minPrice) {
          let diff = this.minPrice - this.totalPrice;
          return `还差¥${diff}元起送`;
        } else {
          return '去结算';
        }
      },
      showCartList() {
        if (!this.totalCount) {
          // eslint-disable-next-line
          this.fold = true;
          return false;
        }
        if (!this.fold) {
          this.$nextTick(() => {
            if (!this.scroll) {
              // eslint-disable-next-line
              this.scroll = new BScroll(this.$refs.listContent, {
                click: true
              });
            } else {
              this.scroll.refresh();
            }
          });
        }
        return !this.fold;
      }
    },
    methods: {
      drop(el) {
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i];
          if (!ball.show) {
            ball.show = true;
            ball.el = el;
            this.dropBalls.push(ball);
            return;
          }
        }
      },
      beforeEnter(el) {
        let count = this.balls.length;
        while (count--) {
          let ball = this.balls[count];
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect();
            let x = rect.left - 32;
            let y = -(window.innerHeight - rect.top - 22);

            el.style.display = '';
            el.style.webkitTransform = `translateY(${y}px)`;
            el.style.transform = `translateY(${y}px)`;
            let inner = el.getElementsByClassName('inner-hook')[0];
            inner.style.webkitTransform = `translateX(${x}px)`;
            inner.style.transform = `translateX(${x}px)`;
          }
        }
      },
      enter(el, done) {
        // 手动触发界面重新绘制
        /* eslint-disable no-unused-vars */
        let rf = el.offsetHeight;
        this.$nextTick(() => {
          el.style.display = '';
          el.style.webkitTransform = 'translateY(0)';
          el.style.transform = 'translateY(0)';
          let inner = el.getElementsByClassName('inner-hook')[0];
          inner.style.webkitTransform = 'translateX(0)';
          inner.style.transform = 'translateX(0)';
          el.addEventListener('transitionend', done);
        });
      },
      afterEnter(el) {
        let ball = this.dropBalls.shift();
        if (ball.show) {
          ball.show = false;
          el.style.display = 'none';
        }
      },
      toggleCarList() {
        if (!this.totalCount) {
          return;
        }
        this.fold = !this.fold;
      },
      hideList() {
        this.fold = true;
      },
      clean() {
        this.selectFoods.forEach((food) => {
          food.count = 0;
        });
      },
      // 去支付
      toPay() {
        if (this.totalPrice < this.minPrice) {
          return;
        }
        window.alert(`支付${this.totalPrice}元`);
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .shop-cart
    position: fixed
    left 0
    bottom 0
    z-index 50
    width 100%
    height 48px
    .content
      display flex
      background #141d27
      font-size 0
      color rgba(255, 255, 255, 0.4)
      .content-left
        flex 1
        .logo-wrapper
          display inline-block
          position relative
          top -10px
          margin 0 12px
          padding 6px
          width 56px
          height 56px
          box-sizing border-box
          vertical-align center
          border-radius 50%
          background #141d27
          .logo
            width 100%
            height 100%
            border-radius 50%
            background #2b343c
            text-align center
            &.highlight
              background rgb(0, 160, 220)
            .icon-shopping_cart
              line-height 44px
              font-size 24px
              color #80858a
              &.highlight
                color #fff
          .num
            position absolute
            width 24px
            top: 0
            right 0
            height 16px
            line-height 16px
            text-align center
            border-radius 16px
            font-size 8px
            font-weight 700
            background rgb(240, 20, 20)
            box-shadow 0 4px 8px 0 rgba(0, 0, 0, 0.4)
            color #fff
        .price
          display inline-block
          vertical-align top
          line-height 24px
          font-size 16px
          font-weight 700
          margin-top 12px
          box-sizing border-box
          padding-right 12px
          border-right 1px solid rgba(255, 255, 255, 0.1)
          &.highlight
            color #fff
        .desc
          display inline-block
          vertical-align top
          margin 12px 0 0 12px
          line-height 24px
          font-size 12px
      .content-right
        flex 0 0 105px
        width 105px
        &.not-enough
          background #2b333b
        &.enough
          background #00b43c
          color #fff
        .pay
          height 48px
          line-height 48px
          text-align center
          font-size 12px
          font-weight 700
    .ball-container
      .ball
        position fixed
        left 32px
        bottom 22px
        padding 8px
        z-index 200
        transition all .5s cubic-bezier(0.49, -0.29, 0.75, 0.41)
        .inner
          width 16px
          height 16px
          border-radius 50%
          background rgb(0, 160, 220)
          transition all .5s linear
    .cart-list
      position absolute
      width 100%
      top 0
      left 0
      z-index -1
      transform translateY(-100%)
      &.fold-enter-active, &.fold-leave-active
        transition all .5s ease
      &.fold-enter, &.fold-leave-active
        transform translateY(0)
      .list-header
        height 40px
        line-height 40px
        padding 0 18px
        background #f3f5f7
        border-bottom 1px rgb(7, 17, 27, 0.1)
        .title
          float left
          font-size 14px
          color rgb(7, 17, 27)
        .clean
          float right
          font-size 12px
          color rgb(0, 160, 220)
      .list-content
        max-height 217px
        padding 0 18px
        background #fff
        overflow hidden
        .food
          position relative
          padding 12px 0
          box-sizing border-box
          border-1px(rgba(7, 17, 27, 0.1))
          .name
            line-height 24px
            font-size 14px
            color rgb(7, 17, 27)
          .price
            position absolute
            right 90px
            bottom 12px
            line-height 24px
            font-weight 700
            font-size 14px
            color rgb(240, 20, 20)
          .cart-control-wrapper
            position absolute
            right 0
            bottom 6px

  .list-mask
    position fixed
    left 0
    top 0
    width 100%
    height 100%
    z-index 40
    background rgba(7, 17, 27, 0.6)
    backdrop-filter blur(10px)
    &.fade-enter-active, &.fade-leave-active
      transition all .5s ease
    &.fade-enter, &.fade-leave-active
      opacity 0
      background rgba(7, 17, 27, 0)
</style>
