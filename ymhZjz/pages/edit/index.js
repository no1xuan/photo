const app = getApp()
let canOnePointMove = false;
let onePoint = { x: 0, y: 0 };
let twoPoint = { x1: 0, y1: 0, x2: 0, y2: 0 };
Page({
  data: {
    imageData: {},
    showScale: 480 / 295,
    rpxRatio: 1,
    width: 0,
    height: 0,
    left: 0,
    top: 0,
    scale: 1,
    rotate: 0,
    bgc: '#ffffff',
    maskLeft: 0,
    maskTop: 0,
    maskScale: 1,
    maskRotate: 0,
    pick:false,
    color:"438edb",
    picUrl:""
    // downloadOne:1,
    // downloadTwo:2
  },

  onLoad: function (options) {
    this.getImageData();
    this.setRpxRatio();
    // this.getWeb();
  },

  getImageData() {
    const eventChannel = this.getOpenerEventChannel && this.getOpenerEventChannel();
    eventChannel &&
      eventChannel.on('sendImageData', (data) => {
        this.setData({ imageData: data });
        console.log(this.data);
        wx.setNavigationBarTitle({title: this.data.imageData.name+"（预览）"});
      });
  },

  setRpxRatio() {
    wx.getWindowInfo({
      success: (res) => {
        this.setData({ rpxRatio: res.screenWidth / 750 });
      },
    });
  },

  getWeb(){
    wx.request({
      url: app.url + 'api/getWeb',
      header: {
        "token": wx.getStorageSync("token")
      },
      method: "POST",
      success: (res) => { 
        this.setData({
          downloadOne: res.data.downloadOne,
          downloadTwo: res.data.downloadTwo
        });
      }
    });
  },

  // 点击换背景
  toggleBg(e) { 
        wx.showLoading({
            title: '制作中...',
          })
      this.setData({
        color:e.currentTarget.dataset.color
      })
    this.updateColor(this.data.color,this.data.imageData.kimg);
  },


    toPick: function () {
      this.setData({
        pick:true
      })
    },

    //自定义换背景
    pickColor(e) {
    wx.showLoading({
    title: '制作中...',
    })
     let color =  this.rgbStringToHex(e.detail.color);
     this.setData({color:color})
      this.updateColor(color,this.data.imageData.kimg);
    },

    //调用换背景
    updateColor(color,tu){
      wx.request({
        url: app.url + 'api/updateIdPhoto',
        data: {
          "image": tu,
          "colors": color
        },
        header: {
          "token": wx.getStorageSync("token")
        },
        method: "POST",
        success: (res) => { 
          if (res.data.code == 200) {
            this.setData({
              'imageData.cimg': res.data.data.cimg
            });
            wx.hideLoading();
          } else if (res.data.code == 404) {
            wx.hideLoading();
            wx.showToast({
            title: res.data.data,
            icon: 'error'
            })
          
          }
        }
      });
      
    },

//保存证件照
saveNormalPhoto(){
  wx.showLoading({
    title: '下载中...',
    })
  wx.request({
    url: app.url + 'api/updateUserPhonto',
    data: {"image": this.data.imageData.cimg,"photoId":  this.data.imageData.id2},
    header: {"token": wx.getStorageSync("token")},
    method: "POST",
    success: (res) => { 
      if (res.data.code == 200) {
        this.setData({
          'picUrl': res.data.data.picUrl
        });
        //调用保存
        this.savePicUrlAndImg();
      } else if (res.data.code == 404) {
        wx.showToast({
        title: res.data.data,
        icon: 'none'
        })
      
      }
    } 
  });
},

//保存高清照
saveHDPhoto(){
  this.setData({
    'picUrl': ""
  });
  this.updateColor(this.data.color,this.data.imageData.oimg);
  wx.nextTick(() => {
    this.saveNormalPhoto();
  });
},

// 根据图片url下载保存
savePicUrlAndImg() {
  const that = this;
  wx.downloadFile({
    url: this.data.picUrl,
    success: function(res) {
      wx.hideLoading();
      // 下载成功后将图片保存到本地
      wx.saveImageToPhotosAlbum({
        filePath: res.tempFilePath,
        success: function() {
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 2000
          });
        },
        fail: function() {
          that.checkq();  //解决用户拒绝相册
        }
      });
    },
    fail: function(res) {
      console.log(res)
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
                  this.savePicUrlAndImg();
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
},




  //去分享页面(待开发分享下载)
  async composeImage() {
    wx.showLoading({ title: '制作中...' });
    wx.redirectTo({
      url: './complete/index?msg=111&tempFilePath=pa&url=https://www.haimati.cn/img/1_7_1.98819809.jpg',
    });
  },

  


  
  rgbStringToHex(rgbString) {
    // 提取 rgb 值
    const rgbValues = rgbString.match(/\d+/g);

    // 将 rgb 值转换为十六进制
    const r = parseInt(rgbValues[0], 10);
    const g = parseInt(rgbValues[1], 10);
    const b = parseInt(rgbValues[2], 10);

    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
},

  bindload: function (e) {
    wx.hideLoading({});
    const { width, height } = e.detail;
    const { widthPx, heightPx } = this.data.imageData;
    const _width = widthPx;
    const _height = (_width * height) / width;

    const topOffset = wx.getWindowInfo().screenHeight * 0.1;

    const imgLoadSetData = {
      originImgWidth: width,
      originImgHeight: height,
      initImgWidth: _width,
      initImgHeight: _height,
      width: _width,
      height: _height,
      left: _width / 2,
      top: _height / 2 + heightPx - _height + topOffset - 86,
      maskLeft: _width / 2,
      maskTop: _height / 2 + heightPx - _height + topOffset - 86,
    };

    this.setData(imgLoadSetData);
  },

  touchstart: function (e) {
    if (e.touches.length < 2) {
      canOnePointMove = true;
      onePoint.x = e.touches[0].pageX * 2;
      onePoint.y = e.touches[0].pageY * 2;
    } else {
      twoPoint.x1 = e.touches[0].pageX * 2;
      twoPoint.y1 = e.touches[0].pageY * 2;
      twoPoint.x2 = e.touches[1].pageX * 2;
      twoPoint.y2 = e.touches[1].pageY * 2;
    }
  },

  touchmove: function (e) {
    const { data } = this;
    const thatData = data;

    if (e.touches.length < 2 && canOnePointMove) {
      // 单指移动
      const onePointDiffX = e.touches[0].pageX * 2 - onePoint.x;
      const onePointDiffY = e.touches[0].pageY * 2 - onePoint.y;

      this.setData({
        left: thatData.left + onePointDiffX,
        top: thatData.top + onePointDiffY,
        maskLeft: thatData.maskLeft + onePointDiffX,
        maskTop: thatData.maskTop + onePointDiffY,
      });

      onePoint.x = e.touches[0].pageX * 2;
      onePoint.y = e.touches[0].pageY * 2;
    } else if (e.touches.length > 1) {
      // 双指缩放/旋转
      const preTwoPoint = JSON.parse(JSON.stringify(twoPoint));
      twoPoint.x1 = e.touches[0].pageX * 2;
      twoPoint.y1 = e.touches[0].pageY * 2;
      twoPoint.x2 = e.touches[1].pageX * 2;
      twoPoint.y2 = e.touches[1].pageY * 2;

      const preAngle = Math.atan((preTwoPoint.y1 - preTwoPoint.y2) / (preTwoPoint.x1 - preTwoPoint.x2)) * 180 / Math.PI;
      const curAngle = Math.atan((twoPoint.y1 - twoPoint.y2) / (twoPoint.x1 - twoPoint.x2)) * 180 / Math.PI;

      const preDistance = Math.sqrt(Math.pow(preTwoPoint.x1 - preTwoPoint.x2, 2) + Math.pow(preTwoPoint.y1 - preTwoPoint.y2, 2));
      const curDistance = Math.sqrt(Math.pow(twoPoint.x1 - twoPoint.x2, 2) + Math.pow(twoPoint.y1 - twoPoint.y2, 2));

      const angleThreshold = 0.5;
      const distanceThreshold = 2;

      if (Math.abs(curAngle - preAngle) > angleThreshold || Math.abs(curDistance - preDistance) > distanceThreshold) {
        const smoothFactor = 0.2;
        let newScale = thatData.scale + (curDistance - preDistance) * 0.005 * smoothFactor;
        if (newScale < 0.5) newScale = 0.5;

        this.setData({
          scale: newScale,
          rotate: thatData.rotate + (curAngle - preAngle) * smoothFactor,
          maskScale: newScale,
          maskRotate: thatData.rotate + (curAngle - preAngle) * smoothFactor,
        });
      }
    }
  },

  touchend: function () {
    canOnePointMove = false;
  },
});