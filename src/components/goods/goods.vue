<template>
  <div class="goods">
    <!--左侧菜单栏-->
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li v-for="(item,index) in goods" :key="index" class="menu-item" :class="{'current':currentIndex===index}"
            @click="selectMenu(index,$event)">
          <span class="text border-1px"><span v-show="item.type>0" :class="classMap[item.type]"
                                              class="icon"></span>{{item.name}}</span>
        </li>
      </ul>
    </div>
    <!--右侧商品列表-->
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <li v-for="item in goods" :key="item.index" class="food-list food-list-hook">
          <!--食物类别-->
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li v-for="food in item.foods" :key="food.index" class="food-item border-1px"
                @click="clickFoodItem(food,$event)">
              <div class="icon">
                <img width="57" height="57" :src="food.icon">
              </div>
              <!--名称描述-->
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <!--销售信息-->
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span>
                  <span>好评率{{food.rating}}%</span>
                </div>
                <!--价格-->
                <div class="price">
                  <span class="now">¥{{food.price}}</span>
                  <span class="old" v-show="food.oldPrice">¥{{food.oldPrice}}</span>
                </div>
                <!--加入或删除购物车-->
                <div class="cart-control-wrapper">
                  <v-cartcontrol :food="food"></v-cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <!--购物组件-->
    <v-shopcart ref="shopcart" :selectFoods="selectFoods" :delivery-price="seller.deliveryPrice"
                :min-price="seller.minPrice"></v-shopcart>
    <!--商品详情-->
    <v-food :food="clickFood" ref="food"></v-food>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import shopcart from 'components/shopcart/shopcart';
  import cartcontrol from 'components/cartcontrol/cartcontrol';
  import food from 'components/food/food';

  const ERR_OK = 0;
  export default {
    components: {
      'v-shopcart': shopcart,
      'v-cartcontrol': cartcontrol,
      'v-food': food
    },
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        goods: [],
        listHeight: [],
        scrollY: 0,
        clickFood: {}
      };
    },
    created() {
      this.classMap = ['decrease', 'discount', 'guarantee', 'invoice', 'special'];
      this.$http.get('/api/goods').then((response) => {
        response = response.body;
        if (response.errorNo === ERR_OK) {
          this.goods = response.data;
          this.$nextTick(() => {
            this._initScroll();
            this._calculateHeight();
          });
        }
      });
    },
    methods: {
      _initScroll() {
        this.menuScroll = new BScroll(this.$refs.menuWrapper, {
          click: true
        });
        this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
          probeType: 3,
          click: true
        });
        this.foodsScroll.on('scroll', (pos) => {
          this.scrollY = Math.abs(Math.round(pos.y));
        });
      },
      _calculateHeight() {
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
        let height = 0;
        this.listHeight.push(height);
        for (let i = 0; i < foodList.length; i++) {
          let item = foodList[i];
          height += item.clientHeight;
          this.listHeight.push(height);
        }
      },
      selectMenu(index, event) {
        if (!event._constructed) {
          return;
        }
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
        let el = foodList[index];
        this.foodsScroll.scrollToElement(el, 300);
      },
      clickFoodItem(food, event) {
        if (!event._constructed) {
          return;
        }
        this.$refs.food.show();
        this.clickFood = food;
      }
    },
    computed: {
      currentIndex() {
        for (let i = 0; i < this.listHeight.length; i++) {
          if (i === this.listHeight.length - 1) {
            return i;
          }
          let h1 = this.listHeight[i];
          let h2 = this.listHeight[i + 1];
          if (this.scrollY >= h1 && this.scrollY < h2) {
            return i;
          }
        }
        return 0;
      },
      selectFoods() {
        let foods = [];
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count) {
              foods.push(food);
            }
          });
        });
        return foods;
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .goods
    display flex
    position absolute
    top 174px
    bottom 46px
    width 100%
    overflow hidden
    .menu-wrapper
      flex 0 0 80px
      width 80px
      background #f3f5f7
      .menu-item
        display table
        width 56px
        height 54px
        padding 0 12px
        line-height 14px
        &.current
          position relative
          z-index 10
          margin-top -1px
          background #fff
          font-weight 700
          .text
            border-none()
        .text
          display table-cell
          width 56px
          vertical-align middle
          font-size 12px
          border-1px(rgba(7, 17, 27, 0.1))
          .icon
            display inline-block
            vertical-align top
            width 12px
            height 12px
            margin-right 2px
            background-size 12px 12px
            background-repeat no-repeat
            &.decrease
              bg-image('decrease_3')
            &.discount
              bg-image('discount_3')
            &.guarantee
              bg-image('guarantee_3')
            &.invoice
              bg-image('invoice_3')
            &.special
              bg-image('special_3')
    .foods-wrapper
      flex 1
      .title
        padding-left 14px
        height 26px
        line-height 26px
        border-left 2px solid #d9dde1
        font-size 12px
        color rgb(147, 153, 159)
        background #f3f5f7
      .food-item
        display flex
        padding 16px
        border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
        .icon
          flex 0 0 57px
          margin-right: 10px;
        .content
          flex 1
          font-size 0
          .name
            margin 2px 0 8px 0
            height 14px
            line-height 14px
            font-size 14px
            color rgb(7, 17, 27)
          .desc, .extra
            line-height 10px
            font-size 10px
            color rgb(147, 153, 159)
          .desc
            margin-bottom 8px
            line-height 12px
          .extra
            .count
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
            right 0
            bottom 12px
</style>
