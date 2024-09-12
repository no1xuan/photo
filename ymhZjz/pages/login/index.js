const app = getApp()
Page({
  data: {},
  


  
  onLoad() {
  
  },
  
  noempower(){
    wx.showLoading({
      title: '登录中...',
    });
    wx.login({
        success(res) {
            wx.request({
                url: app.url + 'user/login',
                data: { "code": res.code },
                method: "GET",
                success(res) {
                  wx.hideLoading();
                  if (res.data.code == 200) {
                    app.token = res.data.data.token
                    wx.navigateBack({
                      delta: 1
                    });
                  }else{
                    wx.showToast({
                      title: '登录失败,当前系统维护中...',
                      icon: 'none'
                    });
                  }

                  //   wx.navigateTo({
                  //     url: "pages/home/index",
                  // })
                }
            })
        }
    })
  }





});
