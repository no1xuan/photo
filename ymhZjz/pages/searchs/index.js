import tool from '././util';
const app = getApp();

Page({
  data: {
    value: '',
    photoSizeList: [],
    pageNum: 1,
    pageSize: 10,
    hasMoreData: true,
    scrollTop: 0,
  },

  onChange: tool.debounce(function (e) {
    if (e[0].detail) {
      this.setData({
        value: e[0].detail,
        pageNum: 1,
        photoSizeList: [],
        hasMoreData: true,
      });
      this.searchData();
    } else {
      this.setData({
        value: '',
        photoSizeList: [],
        hasMoreData: false,
      });
    }
  }, 500),

  searchData: function () {
    if (!this.data.hasMoreData) return;

    wx.showLoading({ title: '搜索中...' });
    const that = this;
    wx.request({
      url: app.url + 'item/itemList',
      data: {
        pageNum: this.data.pageNum,
        pageSize: this.data.pageSize,
        type: 0,
        name: this.data.value,
      },
      method: "GET",
      success(res) {
        wx.hideLoading();
        if (res.data.code == 200) {
          let newData = res.data.data || [];
          that.setData({
            photoSizeList: that.data.photoSizeList.concat(newData),
            pageNum: that.data.pageNum + 1,
            hasMoreData: newData.length >= that.data.pageSize,
          });
        }else{
          wx.showToast({
            title: '没有找到相关尺寸~',
            icon: 'none'
          });
        }
      }
    });
  },

  moredata: function () {
    if (this.data.hasMoreData) {
      this.searchData();
    }
  },

  goNextPage: function (e) {
    wx.navigateTo({
      url: '/pages/preEdit/index?index=' + e.currentTarget.dataset.index + '&data=' + JSON.stringify(this.data.photoSizeList[e.currentTarget.dataset.index]),
    });
  },

  //有问题，没有回到顶部，待修复
  scrollToTop: function () {
    const that = this;
    this.setData({
      scrollTop: 1
    }, () => {
      that.setData({
        scrollTop: 0
      });
    });
  },
  

  onLoad: function (options) {},

  onPullDownRefresh: function () {
    this.setData({
      photoSizeList: [],
      pageNum: 1,
      hasMoreData: true,
    });
    this.searchData();
    wx.stopPullDownRefresh();  // 停止下拉刷新动作
  },

  onReachBottom: function () {
    this.moredata();
  },
});
