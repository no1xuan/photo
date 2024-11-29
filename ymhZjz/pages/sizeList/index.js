const app = getApp();
Page({
  data: {
    active: 1,
    category: "1",
    photoSizeList: [],
    pageNum: 1,
    pageSize: 10,
    hasMoreData: true,
    scrollTop: 0,
    total: 0,
    pages: 0,
    showBackTop: false
  },

  clickTab: function (e) {
    this.setData({
      photoSizeList: [],
      category: e.detail.name,
      pageNum: 1,
      hasMoreData: true,
      total: 0,
      pages: 0
    });
    if (this.data.category == 5) {
      wx.navigateTo({
        url: '/pages/searchs/index',
      });
    } else if (this.data.category == 4 && wx.getStorageSync("token") == "") {
      wx.navigateTo({
        url: '/pages/login/index',
      });
    } else {
      this.getSizeList();
    }
  },

  getSizeList: function () {
    if (!this.data.hasMoreData) return;
    wx.showLoading({ title: '加载中...' });
    const that = this;
    wx.request({
      url: app.url + 'item/itemList',
      data: {
        pageNum: this.data.pageNum,
        pageSize: this.data.pageSize,
        type: this.data.category,
      },
      header: { token: wx.getStorageSync("token") },
      method: "GET",
      success(res) {
        wx.hideLoading();
        if (res.data.code == 200) {
          const newData = res.data.data.records || [];
          const total = res.data.data.total;
          const pages = res.data.data.pages;
          that.setData({
            photoSizeList: that.data.photoSizeList.concat(newData),
            pageNum: that.data.pageNum + 1,
            hasMoreData: that.data.pageNum < pages,
            total: total,
            pages: pages
          });
        } else if (res.data.code == 404) {
          if(that.data.category==4){
            wx.showToast({
              title: "您还没有定制过尺寸哦~",
              icon: 'none',
              duration: 2000
            });
          }else{
            wx.showToast({
              title: "没有更多尺寸啦~",
              icon: 'none',
              duration: 1500
            });
          }
        }
      }
    });
  },

  moredata: function () {
    if (this.data.hasMoreData) {
      this.getSizeList();
    } else {
      wx.showToast({
        title: '没有更多尺寸啦~',
        icon: 'none',
        duration: 2000
      });
    }
  },

  goNextPage: function (e) {
    wx.navigateTo({
      url: '/pages/preEdit/index?category=' + this.data.category + '&data=' + JSON.stringify(this.data.photoSizeList[e.currentTarget.dataset.index]),
    });
  },

  scrollToTop: function () {
    this.setData({
      scrollTop: 0
    });
  },

  onPageScroll: function(e) {
    if (e.detail.scrollTop > 100 && !this.data.showBackTop) {
      this.setData({
        showBackTop: true
      });
    } else if (e.detail.scrollTop <= 100 && this.data.showBackTop) {
      this.setData({
        showBackTop: false
      });
    }
  },




  onLoad: function () {
    this.getSizeList();
  },

  onPullDownRefresh: function () {
    this.setData({
      photoSizeList: [],
      pageNum: 1,
      hasMoreData: true,
      total: 0,
      pages: 0
    });
    this.getSizeList();
  },

  onReachBottom: function () {
    this.moredata();
  },
});