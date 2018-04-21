<template>
  <div class="ratings" ref="ratingContent">
    <div class="ratings-content">
      <div class="summary">
        <div class="summary-left">
          <h1 class="score">{{seller.score}}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <div class="summary-right">
          <!--服务态度-->
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <v-star :size="36" :score="seller.serviceScore"></v-star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <!--商品评分-->
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <v-star :size="36" :score="seller.score"></v-star>
            <span class="score">{{seller.score}}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery-time">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <v-split></v-split>
      <v-ratingselect :ratings="ratings" :selectType="selectType" :onlyContent="onlyContent"
                      @onlyContentToggle="onlyContentToggle"
                      @ratingTypeChange="ratingTypeChange"></v-ratingselect>
      <div class="ratings-list-wrapper">
        <ul>
          <li class="rating-item" v-for="(rating,index) in ratings" :key="index"
              v-show="filterRating(rating.rateType,rating.text)">
            <!--头像-->
            <div class="avatar"><img :src="rating.avatar" width="24" height="24"></div>
            <div class="content">
              <h1 class="username">{{rating.username}}</h1>
              <!--评价小星星-->
              <div class="start-wrapper">
                <v-star class="star" :size="24" :score="rating.score"></v-star>
                <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
              </div>
              <p class="text">{{rating.text}}</p>
              <!--推荐-->
              <div class="recommend" v-show="rating.recommend">
                <span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>
                <span class="item" v-for="(item,index) in rating.recommend" :key="index">{{item}}</span>
              </div>
              <!--评论时间-->
              <div class="time">{{rating.rateTime | formatDate}}</div>
            </div>
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
  import ratingSelect from 'components/ratingselect/ratingselect';
  import {formatDate} from '../../common/js/date';

  const ALL = 2;
  const ERR_OK = 0;

  export default {
    components: {
      'v-star': star,
      'v-split': split,
      'v-ratingselect': ratingSelect
    },
    props: {
      seller: {
        type: Object
      }
    },
    created() {
      this.$http.get('http://120.79.233.108:8080/springbootweb/ratings').then((response) => {
        response = response.body;
        if (response.errorNo === ERR_OK) {
          this.ratings = response.data;
          this.$nextTick(() => {
            this.scroll = new BScroll(this.$refs.ratingContent, {
              click: true
            });
          });
        }
      });
    },
    data() {
      return {
        ratings: [],
        selectType: ALL,
        onlyContent: false
      };
    },
    methods: {
      ratingTypeChange(type) {
        this.selectType = type;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      },
      onlyContentToggle() {
        this.onlyContent = !this.onlyContent;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      },
      filterRating(type, text) {
        if (this.onlyContent && !text) return false;
        if (this.selectType === ALL) {
          return true;
        } else {
          return this.selectType === type;
        }
      }
    },
    filters: {
      formatDate(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .ratings
    position: absolute;
    top 174px
    bottom 0
    left 0
    width 100%
    overflow hidden
    .summary
      display flex
      padding 8px
      .summary-left
        flex 0 0 137px
        width 137px
        border-right 1px solid rgba(7, 17, 27, 0.1)
        text-align center
        @media only screen and (max-width: 320px)
          flex 0 0 120px
          width 120px
        .score
          line-height 28px
          font-size 24px
          color rgb(255, 153, 0)
        .title
          margin-top 6px
          font-size 12px
          line-height 12px
          color rgb(7, 17, 27)
        .rank
          margin-top 8px
          line-height 10px
          font-size 10px
          color rgb(147, 153, 159)
          padding-bottom 6px
      .summary-right
        flex 1
        padding-left 12px
        @media only screen and (max-width: 320px)
          padding-left 6px
        .score-wrapper
          margin-bottom 8px
          font-size 0
          .title
            display inline-block
            vertical-align top
            line-height 18px
            font-size 12px
            color rgb(7, 17, 27)
          .star
            display inline-block
            vertical-align top
            margin 0 12px
            @media only screen and (max-width: 320px)
              margin 0 6px
          .score
            display inline-block
            vertical-align top
            line-height 18px
            font-size 12px
            color rgb(255, 153, 0)
        .delivery-wrapper
          font-size 0
          .title
            line-height 18px
            font-size 12px
            color rgb(7, 17, 27)
          .delivery-time
            margin-left 12px
            font-size 12px
            color rgb(147, 153, 159)
    .ratings-list-wrapper
      width 100%
      .rating-item
        display flex
        padding 12px
        border-1px(rgba(7, 17, 27, 0.1))
        .avatar
          flex 0 0 28px
          width 28px
          margin-right 12px
          img
            border-radius 50%
        .content
          position relative
          flex 1
          .name
            margin-bottom 4px
            line-height 12px
            font-size 10px
            color rgb(7, 17, 27)
          .start-wrapper
            margin-bottom 6px
            font-size 0
            .star
              display: inline-block
              margin-right 6px
              vertical-align top
            .delivery
              display inline-block
              line-height 12px
              font-size 10px
              color rgb(147, 153, 159)
          .text
            line-height 18px
            color rgb(7, 17, 27)
            margin-bottom 8px
            font-size 12px
          .recommend
            line-height 16px
            font-size 0
            .icon-thumb_up, .icon-thumb_down, .item
              display inline-block
              margin 0 8px 4px 0
              font-size 10px
            .icon-thumb_up
              color rgb(0, 160, 220)
            .icon-thumb_down
              color rgb(147, 153, 159)
            .item
              padding 0 6px
              background #fff
              border 1px solid rgba(7, 17, 27, 0.1)
              border-radius 2px
              color rgb(147, 153, 159)
          .time
            position absolute
            top 0
            right 0
            line-height 12px
            font-size 10px
            color rgb(147, 153, 159)
</style>
