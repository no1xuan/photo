const app = getApp()

Page({
  data: {
    zjzCount: 0,
    colourizeCount: 0,
    mattingCount: 0,
    generateLayoutCount: 0
  },

  onShow() {
    this.getExploreData()
  },

  getExploreData() {
    wx.request({
      url: app.url + 'otherApi/exploreCount', 
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'token': wx.getStorageSync('token')
      },
      success: (res) => {
        this.setData({
          zjzCount: res.data.data.zjzCount,
          generateLayoutCount: res.data.data.generateLayoutCount,
          colourizeCount: res.data.data.colourizeCount,
          mattingCount: res.data.data.mattingCount
        })
      }
    })
  },

  sizeListTo(){
    wx.navigateTo({
      url: "/pages/sizeList/index"
    });
  },

  wait(){
    wx.showToast({
      title: '该功能正在内测中，即将上线，敬请期待',
      icon: 'none', 
      duration: 3000
    })
  },
  stop(){
    wx.showToast({
      title: '该功能维护中，暂停使用',
      icon: 'none', 
      duration: 3000
    })
  },

  navigateTo(e) {
   const type = e.currentTarget.dataset.type;
   let title;
   let title2;
   let description;
    if(type==4){
      title = '六寸排版照';
      title2 = '一键生成精美排版照';
      description = '适用于生成证件照后进行六寸排版，支持自定义宽/高/KB/DPI，让您的照片更加精美大方';
    }else if(type==5){
      title = '老照片上色';
      title2 = '一键让图片充满色彩';
      description = '适用于老照片，旧照片，黑白照片等，进行AI上色';
    }else if(type==6){
      title = '智能抠图';
      title2 = '一键轻松抠出图像';
      description = '适用于人像，宠物，物品，植物等照片进行抠图';
    }else if(type==7){
      title = '照片清晰度增强';
      title2 = '一键让模糊图片变清晰';
      description = '适用于模糊图变清晰，老照片清晰化，质量低照片，无损放大';
    }else if(type==8){
      title = '照片转卡通形象';
      title2 = '';
      description = '';
    }
    wx.navigateTo({
      url: '/pages/exploreHandle/index?type='+type+'&title='+title+'&title2='+title2+'&description='+description,
    });
  }




})
