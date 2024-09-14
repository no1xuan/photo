const app = getApp()
Page({
  data: {
    //轮播图配置
    autoplay: true,
    interval: 3000,
    duration: 1200,
    detail: {},
    detailtow:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const sizeDetail = JSON.parse(decodeURIComponent(options.data))
    this.setData({
      detail: sizeDetail
    })
    const data = {
      "swiperDatas": [{
          "id": 1,
          "imgurl": "./needs/1.jpg"
        },
        {
          "id": 2,
          "imgurl": "./needs/2.jpg"
        },
        {
          "id": 3,
          "imgurl": "./needs/3.jpg"
        }
      ]
    };
    this.setData({
      swiperDatas: data.swiperDatas
    })
  },

  // 相册选择
  chooseImage() {
    if(wx.getStorageSync("token")==""){
      wx.navigateTo({
        url: '/pages/login/index',
      });
      return;
    }
    wx.chooseMedia({
      count: 1,
      mediaType: 'image',
      sourceType: ['album'],
      sizeType: 'original',
      camera: 'back',
      success: (res) => {
      const file = res.tempFiles[0];
      const fileType = file.tempFilePath.split('.').pop().toLowerCase();
      const fileSizeMB = file.size / (1024 * 1024);

      // 检查文件格式
      if (fileType !== 'png' && fileType !== 'jpg' && fileType !== 'jpeg') {
        wx.showToast({
          title: '不支持该图片格式',
          icon: 'none',
          duration: 2000
        });
        return;
      }

      // 检查文件大小
      if (fileSizeMB > 15) {
        wx.showToast({
          title: '图片太大啦，不能超15M哦',
          icon: 'none',
          duration: 2000
        });
        return;
      }
       this.imgUpload(res.tempFiles[0].tempFilePath)
      }
    })
  },

  // 相机拍照
  chooseCamera() {
    if(wx.getStorageSync("token")==""){
      wx.navigateTo({
        url: '/pages/login/index',
      });
      return;
    }
    const {
      category,
      heightMm,
      heightPx,
      id,
      name,
      widthMm,
      widthPx
    } = this.data.detail
    //选择相机拍照
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.camera']) {
          wx.navigateTo({
            url: '/pages/camera/index',
            success: function (res) {
              res.eventChannel.emit('chooseCamera', {
                category,
                heightMm,
                heightPx,
                id,
                name,
                widthMm,
                widthPx
              })
            }
          })
        } else {
          wx.authorize({
            scope: 'scope.camera',
            success() {},
            fail() {
              that.openConfirm()
            }
          })
        }
      },
      fail() {}
    })
  },

  // 开启摄像头
  openConfirm() {
    wx.showModal({
      content: '检测到您没打开访问摄像头权限，是否打开？',
      confirmText: "确认",
      cancelText: "取消",
      success: function (res) {
        console.log(res);
        if (res.confirm) {
          wx.openSetting({
            success: (res) => {}
          })
        }
      }
    });
  },

  // 上传原图
  imgUpload(filePath) {
    wx.showLoading({
      title: '图片检测中',
    })
    wx.uploadFile({
      url: app.url+'upload',
      filePath: filePath, 
      name: 'file', 
      header: {
        'content-type': 'multipart/form-data', 
        "token": wx.getStorageSync("token")
      },
      useHighPerformanceMode:true,
      success: (res) => {
        wx.hideLoading();
        let data = JSON.parse(res.data);
        if (data.code == 200) {
          this.imageDivision(data.data);
        } else if (data.code == 404) {
          wx.showToast({
            title: data.data,
            icon: "none",
          });
        } else {
          wx.navigateTo({
            url: '/pages/login/index',
          });
        }
      }
    })

   
  },

  imageDivision(tu) {
    wx.showLoading({
      title: '制作中...',
    });
    wx.request({
      url: app.url + 'api/createIdPhoto',
      data: {
        "image": tu,
        "type":  this.data.detail.category == 4 ? 0 : 1,
        "itemId": this.data.detail.id
      },
      header: {
        "token": wx.getStorageSync("token")
      },
      method: "POST",
      success: (res) => {
        wx.hideLoading();
        if (res.data.code == 200) {
          this.goEditPage(res.data.data);
        } else if (res.data.code == 404) {
          console.log(res.data);
          wx.showToast({
            title: res.data.data,
            icon: 'error'
          });
        } else {
          wx.navigateTo({
            url: '/pages/login/index',
          });
        }
      }
    });
  },  

  // 制作页面
  goEditPage(data) {
    const {
      category,
      heightMm,
      heightPx,
      id,
      name,
      widthMm,
      widthPx
    } = this.data.detail
    wx.navigateTo({
      url: '/pages/edit/index',
      success: function (res) {
        res.eventChannel.emit('sendImageData', {
          ...data,
          category,
          heightMm,
          heightPx,
          id,
          name,
          widthMm,
          widthPx
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})