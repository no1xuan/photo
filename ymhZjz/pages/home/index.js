Page({

    /**
     * 页面的初始数据
     */
    data: {
        //轮播图配置
        autoplay: true,
        interval: 3000,
        duration: 1200,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const that = this;
        const data = {
            "swiperDatas": [{
                    "id": 1,
                    "imgurl": "../../images/home/1.png"
                },
                {
                    "id": 2,
                    "imgurl": "../../images/home/2.png"
                }
            ]
        };
        that.setData({
            swiperDatas: data.swiperDatas
        })
    },

    // 路由跳转
    navigateTo(e) {
        wx.navigateTo({
            url: e.currentTarget.dataset.url,
        })
    },

   //即将上线项目弹出
   toBeLaunched(){
    wx.showToast({
      title: "该功能正在内测中，即将开放",
      icon: 'none',
      duration: 1500
    });
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