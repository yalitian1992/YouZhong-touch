<template>
<div class="sideBar">
<div @click="openSideBar">打开</div>
  <div class="side-box" :class="{'open': isOpen}" v-show="isSelectShow" @click="closeSideBar">
      <div class="side-content" :class="{'open': isOpen}" @click="stopPropagation">
        <slot name="content"></slot>
        <span @click="closeSideBar">关闭</span>
      </div>
  </div>
</div>
</template>

<script>
  export default {
    data(){
      return {
        isOpen: false,
        isSelectShow: false,
      }
    },
    methods: {
      openSideBar: function(){
        var _this = this;
        _this.isSelectShow = true;
        setTimeout(function () {
          _this.isOpen = true;
        }, 0)
      },
      closeSideBar: function(){
        event.stopPropagation();
        var _this = this;
          _this.isOpen = false;
        setTimeout(function () {
        _this.isSelectShow = false;
        }, 500)
      },
      stopPropagation: function(event){
        event.stopPropagation();
      },
    }
  }
</script>

<style scoped>
.side-box {
  z-index: 101;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.4);
  opacity: 0;
  transition: all .5s;
}
.side-box.open {
  opacity: 1;
}
.side-box.open .side-content {
  right: 0;
}
.side-content {
  padding-top: .2rem;
  font-size: .14rem;
  color: #911573;
  text-align: center;
  position: absolute;
  right: -65%;
  top: 0;
  width: 65%;
  height: 100%;
  background: #fff;
  transition: all .5s;
}
</style>
