<template>
  <div class="cart-control">
    <transition name="move">
      <div class="cart-decrease" v-show="food.count>0" @click.stop.prevent="decreaseCart($event)">
        <span class="inner icon-remove_circle_outline"></span>
      </div>
    </transition>
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="icon-add_circle cart-increase" @click.stop.prevent="addCart($event)"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';

  export default {
    props: {
      food: {
        type: Object
      }
    },
    methods: {
      addCart(event) {
        if (!event._constructed) {
          return;
        }
        if (!this.food.count) {
          Vue.set(this.food, 'count', 1);
        } else {
          this.food.count++;
        }
        // 全局分发一个添加商品的事件
        this.$root.eventHub.$emit('add-cart', event.target);
      },
      decreaseCart(event) {
        if (!event._constructed) {
          return;
        }
        if (this.food.count) {
          this.food.count--;
        }
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .cart-control
    font-size 0
    .cart-decrease
      display inline-block
      padding 6px
      opacity 1
      &.move-enter-active, &.move-leave-active
        transition all .5s ease
      &.move-enter, &.move-leave-to
        opacity 0
        transform translateX(24px)
        .inner
          transform rotate(180deg)
      .inner
        display inline-block
        line-height 24px
        font-size 24px
        transition all .5s linear
        color rgb(0, 160, 220)
    .cart-count
      display inline-block
      width 12px
      vertical-align top
      font-size 10px
      line-height 24px
      padding 6px 0
      text-align center
      color rgb(147, 153, 159)
    .cart-increase
      display inline-block
      padding 6px
      line-height 24px
      font-size 24px
      color rgb(0, 160, 220)
</style>
