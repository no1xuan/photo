import tool from '././util'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    width: 0,
    height: 0,
    name: '',
    px: '295*413 px',
    size: '25*35'
  },

  changeName: tool.debounce(function (e) {
    if (e[0].detail) {
      this.setData({
        name: e[0].detail
      })
    }
  }, 500),

  changeWidth: tool.debounce(function (e) {
    if (e[0].detail) {
      this.setData({
        width: Number(e[0].detail),
        px: `${Number(e[0].detail)}*${this.data.height} px`,
        size: `${Math.floor(Number(e[0].detail)/11.8)}*${Math.floor(this.data.height/11.8)}`
      })
    }
  }, 500),

  changeHeight: tool.debounce(function (e) {
    if (e[0].detail) {
      this.setData({
        height: Number(e[0].detail),
        px: `${this.data.width}*${Number(e[0].detail)} px`,
        size: `${Math.floor(this.data.width/11.8)}*${Math.floor(Number(e[0].detail)/11.8)}`
      })
    }
  }, 500),

  addSize() {
    if(app.token == ""){
      wx.navigateTo({
        url: '/pages/login/index',
      });
    }
    if(this.data.width==0 || this.data.height==0){
      wx.showToast({
        title: '宽或高不能为0',
        icon: 'error',
        duration: 2000,
        mask: true
      })
      return;
    }
    if(this.data.name==''){
      wx.showToast({
        title: '名字为必填',
        icon: 'error',
        duration: 2000,
        mask: true
      })
      return;
    }
    if (!this.isNull(this.data)) {
      wx.showToast({
        title: '不能有特殊符号',
        icon: 'error',
        duration: 2000,
        mask: true
      })
    } else {
      wx.request({
        url: app.url + 'item/saveCustom',
        method: "POST",
        data:{
          "name":this.data.name,
          "widthPx":this.data.width,
          "heightPx":this.data.height,
          "size":this.data.size  
      },
        header: {
          "token": app.token
        },
        success(res) {
          if (res.data.code == 200) {
            wx.showToast({
              title: '定制成功',
              duration: 2000,
              mask: true
            })
          
          } else {
            wx.showToast({
              title: '定制失败，请重试',
              duration: 2000,
              icon:"none",
              mask: true
            })
          }
          
        }
      })
    }
  },

  isNull() {
    const {
      width,
      height,
      name
    } = this.data
    const reg = /^\d+$/;
    if (!name || !reg.test(width) || !reg.test(height)) {
      return false
    } else {
      return true
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


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