Page({
  data: {
    url: ''
  },

  onLoad: function (options) {
    this.setData({
      url: options.url
    })
  },
  
  preView() {
    wx.previewImage({
      urls: [this.data.url]
    })
  },


  goHome() {
    wx.navigateBack();
  },


  downloadPic(){
    const that = this;
    wx.downloadFile({
      url: this.data.url,
      success: function (res) {
        wx.hideLoading();
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function () {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            });
          },
          fail: function () {
            that.checkq(); 
          }
        });
      },
      fail: function () {
        wx.showToast({
          title: '下载图片失败，请重试',
          icon: 'none',
          duration: 2000
        });
      }
    });

  },
    // 解决用户拒绝相册问题
    checkq() {
      wx.getSetting({
        success: (res) => {
          if (!res.authSetting['scope.writePhotosAlbum']) {
            wx.showModal({
              title: '提示',
              content: '保存图片需要授权哦',
              success: (res) => {
                if (res.confirm) {
                  wx.openSetting({
                    success: (res) => {
                      this.downloadPic();
                    },
                    fail: (res) => {
                      console.log(res);
                    }
                  });
                }
              }
            });
          }
        }
      });
    }



})