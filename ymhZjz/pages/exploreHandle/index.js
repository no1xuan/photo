const app = getApp();

Page({
  data: {
    title: '', 
    title2: '', 
    description: '', 
    pic: '', 
    url: '', 
    type: '', 
    dpi: '',    
    kb: '',     
    width: '',  
    height: '', 
    showModal: false, 
    animationData: {}, 
  },

  onLoad: function (options) {
    this.setData({
      type: options.type,
      pic: '/images/home/' + options.type + '.png',
      title: options.title,
      title2: options.title2,
      description: options.description,
    });

    // 根据类型设置URL
    if (this.data.type == 4) {
      this.setData({ url: 'generateLayoutPhotos' });
    } else if (this.data.type == 5) {
      this.setData({ url: 'colourize' });
    } else if (this.data.type == 6) {
      this.setData({ url: 'matting' });
    } else if (this.data.type == 7) {
      this.setData({ url: '' });
    } else if (this.data.type == 8) {
      this.setData({ url: '' });
    } else {
      this.setData({ url: '' });
    }
  },

  // 显示底部弹框
  showBottomModal() {
    const animation = wx.createAnimation({
      duration: 400, 
      timingFunction: 'ease-out', 
    });
    animation.translateY(0).step(); 
    this.setData({
      animationData: animation.export(), 
    });
    setTimeout(() => {
      this.setData({ showModal: true }); 
    }, 100); 
  },

  // 隐藏底部弹框
  hideBottomModal() {
    const animation = wx.createAnimation({
      duration: 400, 
      timingFunction: 'ease-in',
    });
    animation.translateY('100%').step(); 
    this.setData({
      animationData: animation.export(),
      dpi: '',    
      kb: '',     
      width: '',  
      height: ''  
    });
    setTimeout(() => {
      this.setData({ showModal: false }); 
    }, 400); 
  },

  // DPI输入框
  onDpiInput(e) {
    let value = e.detail || '';
    // 移除非数字字符和移除前导0
    value = value.replace(/\D/g, '');
    value = value.replace(/^0+(\d)/, '$1');
    this.setData({
      dpi: value
    });
  },

  // KB输入框
  onKbInput(e) {
    let value = e.detail || '';
    // 移除非数字字符和移除前导0
    value = value.replace(/\D/g, '');
    value = value.replace(/^0+(\d)/, '$1');
    this.setData({
      kb: value
    });
  },

  // 宽度输入框
  onWidthInput(e) {
    let value = e.detail || '';
    // 移除非数字字符和移除前导0
    value = value.replace(/\D/g, '');
    value = value.replace(/^0+(\d)/, '$1');
    this.setData({
      width: value
    });
  },

  // 高度输入框
  onHeightInput(e) {
    let value = e.detail || '';
    // 移除非数字字符和移除前导0
    value = value.replace(/\D/g, ''); 
    value = value.replace(/^0+(\d)/, '$1');
    this.setData({
      height: value
    });
  },

  // 选择图片
  chooseImage() {

    if (wx.getStorageSync('token') === '') {
      wx.navigateTo({ url: '/pages/login/index' });
      return;
    }



    const width = parseInt(this.data.width, 10);
    const height = parseInt(this.data.height, 10);
    const dpi = parseInt(this.data.dpi, 10);
    const kb = parseInt(this.data.kb, 10);

    // type==4和6都需要处理DPI
    if(this.data.type==4 || this.data.type==6){
        if (!isNaN(dpi) && dpi < 72) {
          wx.showToast({
            title: 'DPI最低75哦~',
            icon: 'none',
            duration: 2000,
            mask: true
          });
          return;
        }
    
        if (!isNaN(dpi) && dpi > 1000) {
          wx.showToast({
            title: 'DPI最高只能1000哦~',
            icon: 'none',
            duration: 2000,
            mask: true
          });
          return;
        }
    }

    //type==4需要额外处理一些其它的
    if (this.data.type == 4) {
      // 处理宽高
      if (!isNaN(width) && width <= 0) {
        wx.showToast({
          title: '宽度必须大于0哦~',
          icon: 'none',
          duration: 2000,
          mask: true
        });
        return;
      }

      if (!isNaN(height) && height <= 0) {
        wx.showToast({
          title: '高度必须大于0哦~',
          icon: 'none',
          duration: 2000,
          mask: true
        });
        return;
      }

      if ((!isNaN(width) && isNaN(height)) || (isNaN(width) && !isNaN(height))) {
        wx.showToast({
          title: '宽度和高度必须同时填写哦~',
          icon: 'none',
          duration: 2000,
          mask: true
        });
        return;
      }

      // 处理KB
      if (!isNaN(kb) && kb <= 0) {
        wx.showToast({
          title: 'KB最低1哦~',
          icon: 'none',
          duration: 2000,
          mask: true
        });
        return;
      }

      if (!isNaN(kb) && kb > 1000) {
        wx.showToast({
          title: 'KB最高只能1000哦~',
          icon: 'none',
          duration: 2000,
          mask: true
        });
        return;
      }
    }


    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album'],
      sizeType: ['original'],
      success: (res) => {
        const file = res.tempFiles[0];
        const fileType = file.tempFilePath.split('.').pop().toLowerCase();
        const fileSizeMB = file.size / (1024 * 1024);

        if (!['png', 'jpg', 'jpeg'].includes(fileType)) {
          wx.showToast({
            title: '图片格式仅支持png、jpg、jpeg',
            icon: 'none',
            duration: 2000,
          });
          return;
        }

        if (fileSizeMB > 10) {
          wx.showToast({
            title: '图片大小不能超过10MB',
            icon: 'none',
            duration: 2000,
          });
          return;
        }

        this.imgUpload(file.tempFilePath);
      },
    });
  },

  
  // 上传图片
  imgUpload(filePath) {
    wx.showLoading({ title: '图片检测中' });

    wx.uploadFile({
      url: app.url + 'upload',
      filePath: filePath,
      name: 'file',
      header: {
        'content-type': 'multipart/form-data',
        token: wx.getStorageSync('token'),
      },
      useHighPerformanceMode: true,
      success: (res) => {
        wx.hideLoading();
        const data = JSON.parse(res.data);
        if (data.code == 200) {
          this.imageDivision(data.data);
        } else if (data.code == 404) {
          wx.showToast({
            title: data.data,
            icon: 'none',
          });
        } else {
          wx.navigateTo({ url: '/pages/login/index' });
        }
      },
    });
  },

  // 图片处理
  imageDivision(tu) {
    wx.showLoading({ title: '处理中...' });

    if (this.data.type === 6) {
      setTimeout(() => {
        wx.showLoading({ title: '正在处理细节...' });
      }, 1000);
    }


    wx.request({
      url: app.url + 'otherApi/' + this.data.url,
      data: {
        processedImage: tu,
        ...(this.data.type == 4 || this.data.type == 6 ? { dpi: this.data.dpi } : {}),
        ...(this.data.type == 4 ? { kb: this.data.kb } : {}),
        ...(this.data.type == 4 ? { width: this.data.width } : {}),
        ...(this.data.type == 4 ? { height: this.data.height } : {}),
      },
      header: {
        token: wx.getStorageSync('token'),
      },
      method: 'POST',
      success: (res) => {
        wx.hideLoading();
        if (res.data.code == 200) {
          wx.navigateTo({
            url: './complete/index?url=' + res.data.data,
          });
        } else if (res.data.code == 404) {
          wx.showToast({
            title: res.data.data,
            icon: 'none',
            duration: 2000,
          });
        } else {
          wx.navigateTo({ url: '/pages/login/index' });
        }
      },
    });
  },
});
