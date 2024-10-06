const app = getApp()
Page({
  data: {
    isAuthorized: false,
    scene:0
  },


  onLoad(options) {
    var scene = decodeURIComponent(options.scene);
    this.setData({
      scene: scene
    });
    console.log(scene)
  },
  
  login() {
    if(this.data.scene==0){
      wx.showToast({
        title: '点击太快啦',
        icon: 'none'
      });
      return;
    }
    wx.showLoading({
      title: '登录中...',
    });
    const that = this;
    wx.login({
        success(res) {
          console.log("abccc"+that.data.scene)
            wx.request({
                url: app.url + 'admin/okLogin',
                data: { "code1": res.code,"code2":that.data.scene},
                method: "GET",
                success(res) {
                  wx.hideLoading();
                  if (res.data.code == 200) {
                    that.setData({
                      isAuthorized: true 
                    });
                  }else{
                    wx.showToast({
                      title: '登录失败，二维码过期或已登录',
                      icon: 'none'
                    });
                  }
                }
            })
        }
    })
  },

  closeLogin(){
    wx.reLaunch({
      url: '/pages/home/index'
  });


  }




})
