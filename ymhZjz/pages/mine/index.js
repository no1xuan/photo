const app = getApp();
Page({
  data: {
    modalType: null, // 用于控制显示哪个模态框
    authorized: false,
    days: 0,
    avatarUrl: '../../images/tx.jpg', // 默认头像
    nickname: '陌生人', // 默认昵称
    avatarFile: '../../images/tx.jpg', // 修改头像
    nicknameFile: '',
  },

  onLoad: function () {
  },

  // 获取用户信息，同时解决跳转登录后页面还是旧数据问题
  onShow: function () {
    if (wx.getStorageSync("token") != "") {
      wx.request({
        url: app.url + 'user/userInfo',
        method: "GET",
        header: {
          token: wx.getStorageSync("token")
        },
        success: (res) => {
          if (res.data.code == 200) {
            this.calculateDays(res.data.data.createTime)
            this.setData({
              authorized: true
            });
            if (res.data.data.avatarUrl != null) {
              this.setData({
                avatarUrl: res.data.data.avatarUrl,
                avatarFile: res.data.data.avatarUrl
              });
            }
            if (res.data.data.nickname != null) {
              this.setData({
                nickname: res.data.data.nickname,
                nicknameFile: res.data.data.nickname
              });
            }
          }
        }
      });
    }
  },

  // 修改用户信息
  updateUserInfo: function () {
    const avatarChanged = this.data.avatarFile != this.data.avatarUrl;
    const nicknameChanged = this.data.nicknameFile != this.data.nickname;

    //如果只修改了头像
    if (avatarChanged) {
      wx.uploadFile({
        url: app.url + 'user/updateUserInfo',
        filePath: this.data.avatarFile,
        name: 'file',
        header: {
          'content-type': 'multipart/form-data',
          "token": wx.getStorageSync("token")
        },
        useHighPerformanceMode: true,
        success: (res) => {
          wx.hideLoading()
          const data = JSON.parse(res.data);
          if (data.code == 200) {
            this.setData({
              avatarUrl: this.data.avatarFile
            });
          } else {
            wx.showToast({
              title: data.data,
              duration: 2000,
              icon: "none",
              mask: true
            })
          }
        }
      })
    } 

    //如果只修改了昵称
    if(nicknameChanged) {
     if(this.data.nicknameFile.trim()==""){
      wx.hideLoading()
      this.setData({
        modalType: null
      });
        return;
     }
      wx.request({
        url: app.url + 'user/updateUserInfo',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          "token": wx.getStorageSync("token")
        },
        data: {
          nickname: this.data.nicknameFile
        },
        success: (res) => {
          wx.hideLoading()
          console.log(res)
          if (res.data.code == 200) {
            this.setData({
              nickname: this.data.nicknameFile
            });
          } else {
            wx.showToast({
              title: res.data.data,
              duration: 2000,
              icon: "none",
              mask: true
            })
          }
        }
      })
    }
    wx.hideLoading()
    this.setData({
      modalType: null
    });
  },

  // 计算天数的函数
  calculateDays: function (time) {
    // 将时间字符串中的 '-' 替换为 '/'，以兼容 IOS 系统
    const formattedStartTimeStr = time.replace(/-/g, '/');
    const startDate = new Date(formattedStartTimeStr);
    const currentDate = new Date();
    const diffTime = currentDate - startDate;
    const diffDays = Math.abs(Math.floor(diffTime / (1000 * 60 * 60 * 24)));
    this.setData({
      days: diffDays,
    });
  },

  goLogin: function () {
    wx.navigateTo({
      url: "/pages/login/index",
    });
  },

  // 打开编辑个人资料的模态框
  openEditProfileModal: function () {
    this.setData({
      modalType: 'editProfile'
    });
  },

  // 获取用户头像临时地址
  onChooseAvatar(e) {
    console.log(e.detail);
    const { avatarUrl } = e.detail
    this.setData({
      avatarFile: avatarUrl
    });
  },

  // 监听昵称输入
  onNicknameInput(e) {
    this.setData({
      nicknameFile: e.detail.value,
    });
  },

  // 关闭模态框
  closeModal: function () {
    this.setData({
      modalType: null
    });
  },

  // 我的作品
  mywork() {
    if (wx.getStorageSync("token") == "") {
      wx.navigateTo({
        url: "/pages/login/index",
      });
    } else {
      wx.navigateTo({
        url: "/pages/works/index",
      });
    }
  },

  // 赏好评
  evaluate() {
    if (wx.openBusinessView) {
      wx.openBusinessView({
        businessType: 'servicecommentpage',
        success: (res) => {
          console.log(res)
        },
        fail: (res) => {
          wx.showToast({
            title: res.errMsg,
            duration: 3000,
            icon: "none"
          })
        }
      });
    }
  },

  // 我的权益弹框
  navigateToEdit: function () {
    this.setData({
      modalType: 'rights'
    });
  },

  // 常见问题弹框
  navigateToFree: function () {
    this.setData({
      modalType: 'questions'
    });
  },

  // 分享设置
  onShareAppMessage() {
    return {
      title: '哇塞，这个证件照小程序也太好用了吧！好清晰，还免费',
      path: 'pages/home/index',
      imageUrl: '../../images/share.jpg'
    }
  }
});
