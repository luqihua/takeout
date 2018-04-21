<template>
  <div class="seller-root" ref="sellerRoot">
    <div class="seller-content">
      <div class="summary">
        <h1 class="title">{{seller.name}}</h1>
        <div class="desc border-1px">
          <v-star class="star" :size="36" :score="seller.score"></v-star>
          <span class="text">({{seller.ratingCount}})</span>
          <span class="text">月售{{seller.sellCount}}单</span>
        </div>
        <ul class="remark">
          <li class="block">
            <h2>起送价</h2>
            <div class="content">
              <span class="stress">{{seller.minPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>商家配送</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>平均配送时间</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryTime}}</span>分钟
            </div>
          </li>
        </ul>
        <!--收藏按钮-->
        <div class="collect" @click="toggleCollect($event)">
          <div class="icon-favorite" :class="{'active':isCollect}"></div>
          <div class="text">{{collectText}}</div>
        </div>
      </div>
      <v-split></v-split>
      <!--商家公告小标题-->
      <div class="bulletin">
        <h1 class="title">商家公告</h1>
        <!--商家公告-->
        <p class="content">{{seller.bulletin}}</p>
      </div>
      <!--优惠活动列表-->
      <ul v-if="seller.supports" class="support-wrapper">
        <li class="support-item border-1px" v-for="(item,index) in seller.supports" :key="index">
          <span class="icon" :class="classMap[item.type]"></span>
          <span class="text">{{item.description}}</span>
        </li>
      </ul>
      <v-split></v-split>
      <!--商家实景-->
      <div class="seller-pictures">
        <h1 class="title">商家实景</h1>
        <div class="pic-wrapper" ref="picWrapper">
          <ul class="pic-list" ref="picList">
            <li class="pic-item" v-for="(picture,index) in seller.pics" :key="index">
              <img :src="picture" width="120" height="90">
            </li>
          </ul>
        </div>
      </div>
      <!--商家信息-->
      <v-split></v-split>
      <div class="seller-info">
        <h1 class="title border-1px">商家信息</h1>
        <ul class="info-list">
          <li class="info-item border-1px" v-for="(info,index) in seller.infos" :key="index">
            {{info}}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import star from 'components/star/star';
  import split from 'components/tools/split';
  import {saveToLocal, loadFromLocal} from '../../common/js/storage';

  export default {
    components: {
      'v-split': split,
      'v-star': star
    },
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        isCollect: (() => {
          return loadFromLocal(this.seller.id, 'isCollect', false);
        })()
      };
    },
    watch: {
      'seller'() {
        this._initScroll();
        this._initPics();
      }
    },
    mounted() {
      this._initScroll();
      this._initPics();
    },
    created() {
      this.classMap = ['decrease', 'discount', 'guarantee', 'invoice', 'special'];
    },
    methods: {
      _initScroll() {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.sellerRoot, {click: true});
        } else {
          this.scroll.refresh();
        }
      },
      _initPics() {
        // 计算图片容器横向宽度
        if (this.seller.pics) {
          let picWidth = 120;
          let margin = 6;
          let width = ((picWidth + margin) * this.seller.pics.length) - margin;
          this.$refs.picList.style.width = width + 'px';
        }
        this.$nextTick(() => {
          this.picScroll = new BScroll(this.$refs.picWrapper, {
            click: true,
            scrollX: true,
            eventPassthrough: 'vertical'
          });
        });
      },
      toggleCollect(event) {
        if (!event._constructed) return;
        this.isCollect = !this.isCollect;
        saveToLocal(this.seller.id, 'isCollect', this.isCollect);
        console.log(window.localStorage);
      }
    },
    computed: {
      collectText() {
        return this.isCollect ? '已收藏' : '收藏';
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .seller-root
    position absolute
    top 174px
    bottom 0
    left 0
    width 100%
    overflow hidden
    .summary
      padding 18px
      .title
        margin-bottom 8px
        line-height 14px
        font-size 14px
        color rgb(7, 17, 27)
      .desc
        padding-bottom 18px
        border-1px(rgba(7, 17, 27, 0.1))
        font-size 0
        .star
          display inline-block
          margin-right 8px
          vertical-align top
        .text
          display inline-block
          margin-right 12px
          line-height 18px
          font-size 10px
          vertical-align top
          color rgb(77, 85, 93)
      .remark
        display flex
        padding-top 18px
        .block
          flex 1
          text-align center
          border-right 1px solid rgba(7, 17, 27, 0.1)
          &:last-child
            border none
          h2
            margin-bottom 4px
            line-height 10px
            font-size 10px
            color rgb(147, 153, 159)
          .content
            line-height 24px
            font-size 10px
            color rgb(7, 17, 27)
            .stress
              font-size 24px
      .collect
        position absolute
        width 50px
        right 18px
        top 18px
        text-align center
        .icon-favorite
          margin-bottom 4px
          line-height 24px
          font-size 24px
          color #d4d6d9
          &.active
            color rgb(240, 20, 20)
        .text
          line-height 10px
          font-size 10px
          color rgb(77, 85, 93)
    .bulletin
      margin 18px 18px 0 18px
      padding-bottom 18px
      border-1px(rgba(7, 17, 27, 0.1))
      .title
        margin-bottom 8px
        font-weight 700
        font-size 14px
        color rgb(7, 17, 27)
      .content
        padding 0 12px
        line-height 24px
        font-size 12px
        color rgb(240, 20, 20)
    .support-wrapper
      margin 0 18px
      .support-item
        padding 16px 12px
        font-size 0
        border-1px(rgba(7, 17, 27, .1))
        .icon
          display inline-block
          height 16px
          width 16px
          vertical-align top
          margin-right 6px
          background-size 16px 16px
          background-repeat no-repeat
          &.decrease
            bg-image('decrease_4')
          &.discount
            bg-image('discount_4')
          &.guarantee
            bg-image('guarantee_4')
          &.invoice
            bg-image('invoice_4')
          &.special
            bg-image('special_4')
        .text
          line-height 16px
          font-size 12px
          color rgb(7, 17, 27)
    .seller-pictures
      padding 18px
      .title
        margin-bottom 12px
        font-weight 700
        font-size 14px
        color rgb(7, 17, 27)
      .pic-wrapper
        width 100%
        overflow hidden
        white-space nowrap
        .pic-list
          font-size 0
          .pic-item
            display inline-block
            margin-right 6px
            width 120px
            height 90px
            &:last-child
              margin-right 0
    .seller-info
      padding 18px
      .title
        padding-bottom 12px
        font-size 14px
        font-weight 700
        color rgb(7, 17, 27)
        border-1px(rgba(7, 17, 27, 0.1))
      .info-item
        padding 16px 12px
        line-height 16px
        font-size 12px
        color rgb(7, 17, 27, 0.8)
        border-1px(rgba(7, 17, 27, 0.1))
</style>
