Page({

    /**
     * 页面的初始数据
     */
    data: {
        //轮播图配置
        autoplay: true,
        interval: 3000,
        duration: 1200,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const that = this;
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
        that.setData({
            swiperDatas: data.swiperDatas
        })
    },

    // 路由跳转
    navigateTo(e) {
        wx.navigateTo({
            url: e.currentTarget.dataset.url,
        })
    },
    examineTo(){
          wx.navigateTo({
              url: '/pages/preEdit/index?index=15&data={"id":759,"name":"中考报名","widthPx":240,"heightPx":320,"widthMm":20,"heightMm":27,"icon":1,"sort":100,"category":1,"dpi":300}',
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

   //即将上线项目弹出
   toBeLaunched(){
    wx.showToast({
      title: "您未解锁本功能",
      icon: 'none',
      duration: 1500
    });
   },

    onShareAppMessage() {
      return {
        title: '哇塞，这个证件照小程序也太好用了吧！好清晰，还免费',
        path: 'pages/home/index',
        imageUrl: '../../images/share.jpg'
      } 
    }


    
})