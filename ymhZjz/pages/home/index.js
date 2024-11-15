Page({
  data: {
      autoplay: true,
      interval: 3000,
      duration: 1200,
      authorized: false
  },

  onLoad: function () {
      const data = {
          "swiperDatas": [{
                  "id": 1,
                  "imgurl": "../../images/home/1.jpg"
              },
              {
                  "id": 2,
                  "imgurl": "../../images/home/2.jpg"
              }
          ]
      };
      this.setData({
          swiperDatas: data.swiperDatas
      })
  },


  onShow: function () {
    if (wx.getStorageSync("token") == "") {
      this.setData({
        authorized: false
    });
    }else{
      this.setData({
        authorized: true
    });
    }
  },



  navigateTo(e) {
      wx.navigateTo({
          url: e.currentTarget.dataset.url,
      })
  },


  examineTo(){
        wx.navigateTo({
            url: '/pages/preEdit/index?category=1&data={"id":759,"name":"中考报名","widthPx":240,"heightPx":320,"widthMm":20,"heightMm":27,"icon":1,"sort":100,"category":1,"dpi":300}',
          });
  },
  
  loginJump(e){
    if (wx.getStorageSync("token") == "") {
      wx.navigateTo({
        url: "/pages/login/index",
      });
    }else{
      wx.navigateTo({
        url: e.currentTarget.dataset.url,
      });
    }
  },

  onShareAppMessage() {
    return {
      title: '哇塞，这个证件照小程序也太好用了吧！好清晰，还免费',
      path: 'pages/home/index',
      imageUrl: '../../images/share.jpg'
    } 
  }


  
})