const app = getApp()
Page({
  data: {},

 // 相册选择
 chooseImage() {
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
      if (fileSizeMB > 10) {
        wx.showToast({
          title: '图片太大啦，不能超10M哦',
          icon: 'none',
          duration: 2000
        });
        return;
      }
      this.imgUpload(res.tempFiles[0].tempFilePath)
    }
  })
},
  // 上传原图
  imgUpload(filePath) {
    wx.showLoading({
      title: '图片检测中',
    })
    wx.uploadFile({
      url: app.url + 'upload',
      filePath: filePath,
      name: 'file',
      header: {
        'content-type': 'multipart/form-data',
        "token": wx.getStorageSync("token")
      },
      useHighPerformanceMode: true,
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
      title: 'AI上色中...',
    });
    wx.request({
      url: app.url + 'otherApi/colourize',
      data: {
        "image": tu
      },
      header: {
        "token": wx.getStorageSync("token")
      },
      method: "POST",
      success: (res) => {
        wx.hideLoading();
        if (res.data.code == 200) {
          wx.navigateTo({
            url: './complete/index?url='+res.data.data,
          });
        } else if (res.data.code == 404) {
          wx.showToast({
            title: res.data.data,
            icon: 'none'
          });
        } else {
          wx.navigateTo({
            url: '/pages/login/index',
          });
        }
      }
    });
  },







});
