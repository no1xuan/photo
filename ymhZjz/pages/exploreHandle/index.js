import Dialog from '@vant/weapp/dialog/dialog'
const app = getApp();

Page({
  data: {
    title: '', 
    title2: '', 
    description: '', 
    pic: '', 
    url: '', 
    type: '', 
    type2: '', 
    dpi: '',    
    kb: '',     
    width: '',  
    height: '', 
    count:'',
    showModal: false, 
    animationData: {}, 
    authorized: false,
    videoUnitId: 0,
    rewardedVideoAd: null,
    tupic:''
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
      this.setData({ url: 'generateLayoutPhotos',type2:7});
    } else if (this.data.type == 5) {
      this.setData({ url: 'colourize',type2:5});
    } else if (this.data.type == 6) {
      this.setData({ url: 'matting',type2:6});
    } else if (this.data.type == 7) {
      this.setData({ url: '',type2:9});
    } else if (this.data.type == 8) {
      this.setData({ url: 'cartoon',type2:8});
    } else {
      this.setData({ url: '' });
    }
  },

  onShow: function () {
    this.setData({tupic: ''});
    this.checkTheFreeQuota(this.data.type,this.data.type2);
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

  
  //获取这个功能用户剩余次数，没token/token过期了就不显示
  checkTheFreeQuota(type,type2) {
    if (wx.getStorageSync('token') == '') {
      return;
    }
    this.getvideoUnit();
    this.setData({authorized: true});
    wx.request({
      url: app.url + 'otherApi/checkTheFreeQuota',
      method: 'GET',
      header: {
        'token': wx.getStorageSync('token')
      },
      data: {
        type: type,
        type2: type2
      }, 
      success: (res) => {
        this.setData({
          count:res.data.data
        })
      },
      fail: () => {
        this.setData({
          authorized: false
        });
      }
    })
  },


  // 选择图片
  chooseImage() {

    if (wx.getStorageSync('token') == '') {
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
          //检查是否还有次数，有次数继续,没次数看广告
          //为什么在这里检查？是因为只有所有图片判断通过后才能进行检查，不然一个错误看一个广告，用户就要骂人了
          this.checkCotun(data.data)  
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

  //检查是可以免费下载还是看广告下载
  checkCotun(tu){
    if(this.data.count==0){  //能跑到这个方法一定有token，所以不用担心值为空
      Dialog.confirm({
        title: '提示',
        message: '您今日免费次数已用完，需要看一次广告后才能继续使用或等明天再来',
      })
      .then(() => {
        this.setData({
          tupic:tu
        })
        const rewardedVideoAd = this.data.rewardedVideoAd;
        if (rewardedVideoAd) {
          // 尝试播放广告
          rewardedVideoAd.show().catch(() => {
            // 如果广告未加载成功，则重新加载并播放广告
            this.loadRewardedVideoAd(tu);
          });
        } else {
          console.error('广告实例不存在');
          // 防止广告权限被封或无广告权限导致用户无法下载
          this.imageDivision(tu);
        }
      })
      .catch(() => {
        // 用户取消观看广告
      });
      
    }else{
      this.imageDivision(tu);  //可以免费下载
    }

 
  },

  // 图片处理
  imageDivision(tu) {
    wx.showLoading({ title: '处理中...' });

    if (this.data.type == 6) {
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

  getvideoUnit() {
    wx.request({
      url: app.url + 'api/getvideoUnit',
      header: {
        "token": wx.getStorageSync("token")
      },
      method: "POST",
      success: (res) => {
        this.setData({
          videoUnitId: res.data.data.videoUnitId
        });
        this.initRewardedVideoAd(res.data.data.videoUnitId);
      }
    });
  },

    // 初始化激励视频广告
    initRewardedVideoAd(adUnitId) {
      if (wx.createRewardedVideoAd) {
        const rewardedVideoAd = wx.createRewardedVideoAd({
          adUnitId: adUnitId
        });
  
        // 确保广告事件只监听一次
        rewardedVideoAd.offLoad();
        rewardedVideoAd.offError();
        rewardedVideoAd.offClose();
  
        // 监听广告加载成功
        rewardedVideoAd.onLoad(() => {
          console.log('重新拉取广告成功');
        });
  
        // 监听广告加载失败
        rewardedVideoAd.onError((err) => {
          console.error('激励视频广告加载失败', err);
          // 用户可能观看广告上限，防止无法下载，仍发放奖励
          this.imageDivision(this.data.tupic);
        });
  
        // 监听广告关闭事件
        rewardedVideoAd.onClose((res) => {
          if (res && res.isEnded) {
            // 发放奖励
            this.imageDivision(this.data.tupic);
          } else {
            console.log('没看完广告，不发奖励');
            wx.showToast({
              title: "需要看完广告才能制作哦~",
              icon: 'none',
              duration: 1500
            });
          }
        });
        this.setData({
          rewardedVideoAd: rewardedVideoAd
        });
      } else {
        console.error('微信版本太低不支持激励视频广告');
        // 防止无法下载，所以仍然发放奖励
        this.imageDivision(this.data.tupic);
      }
    },
  
    // 加载激励视频广告
    loadRewardedVideoAd(tu) {
      const rewardedVideoAd = this.data.rewardedVideoAd;
      rewardedVideoAd
        .load()
        .then(() => rewardedVideoAd.show())
        .catch((err) => {
          console.error('广告加载失败', err);
          // 看广告上限/网络失败，为了防止无法制作，仍发放奖励
          this.imageDivision(tu);
        });
    }




});
