const app = getApp()
Page({
  data: {
    title:app.appName
  },
  


  
  onLoad() {},
  
  login(){
    wx.showLoading({
      title: '登录中...',
    });
    wx.login({
        success(res) {
            wx.request({
                url: app.url + 'user/login',
                data: { "code": res.code},
                method: "GET",
                success(res) {
                  wx.hideLoading();
                  if (res.data.code == 200) {
                    wx.setStorageSync('token', res.data.data.token)
                    wx.navigateBack({
                      delta: 1
                    });
                  }else{
                    console.log("登录失败原因："+res.data.data)
                    wx.showToast({
                      title: res.data.data,
                      duration: 3000,
                      icon: 'none'
                    });
                  }
                }
            })
        }
    })
  }





});
