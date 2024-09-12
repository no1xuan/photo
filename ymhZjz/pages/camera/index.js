const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cameraPostion: 'back',
    cameraImg: false,
    photoSrc: '',
    detail: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getEmitData()
  },

  // 接受参数
  getEmitData() {
    const eventChannel = this.getOpenerEventChannel && this.getOpenerEventChannel()
    eventChannel && eventChannel.on('chooseCamera', (data) => {
      console.log(data)
      this.setData({
        detail: data
      })
    })
  },


  // 反转相机
  reverseCamera() {
    if (this.data.cameraPostion === 'back') {
      this.setData({
        cameraPostion: 'front'
      })
      return
    }
    if (this.data.cameraPostion === 'front') {
      this.setData({
        cameraPostion: 'back'
      })
      return
    }
  },

  // 拍照
  photo() {
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.setData({
          photoSrc: res.tempImagePath,
          cameraImg: true,
        })
      }
    })
  },

  // 去上传抠图编辑
  goEditPhoto() {
    if (this.data.photoSrc) {
      this.Uploadimg(this.data.photoSrc)
    }
  },

  // 返回拍照
  goBackPhoto() {
    this.setData({
      cameraImg: false,
      photoSrc: ''
    })

  },

  // 上传原图
  Uploadimg(filePath) {
    wx.showLoading({
      title: '图像检测中...',
    })
    const fileSizeMB = filePath.size / (1024 * 1024);
    // 检查文件大小
    if (fileSizeMB > 15) {
      wx.showToast({
        title: '图片太大啦，不能超15M哦',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    this.imgUpload(filePath)
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
        "token": app.token
      },
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
  
    let type = this.data.detail.category == 4 ? 0 : 1;
    wx.request({
      url: app.url + 'api/createIdPhoto',
      data: {
        "image": tu,
        "type": type,
        "itemId": this.data.detail.id
      },
      header: {
        "token": app.token
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



  /**
   * 去编辑页面
   */
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