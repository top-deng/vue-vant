<template>
  <div class="home">
    <van-swipe :autoplay="3000">
      <van-swipe-item v-for="(image, index) in images" :key="index">
        <img v-lazy="image" />
      </van-swipe-item>
    </van-swipe>
    <van-button type="primary" @click="addOne">按钮</van-button>
  </div>
</template>

<script>
import { Swipe, SwipeItem, Button } from 'vant'
export default {
  name: 'Home',
  components: {
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [Button.name]: Button
  },
  data () {
    return {
      images: [
        'https://img.yzcdn.cn/vant/apple-1.jpg',
        'https://img.yzcdn.cn/vant/apple-2.jpg'
      ]
    }
  },
  methods: {
    // 添加按钮触发事件
    addOne () {
      console.log('点击了按钮')
    }
  }
}
</script>
<style scoped>
  img{
    width: 100%;
  }
</style>
