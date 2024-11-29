import tool from '././util';
const app = getApp();




Page({
  data: {
    value: '', 
    photoSizeList: [],
    current: 1,
    size: 10,
    total: 0,
    pages: 0,
    scrollTop: 0,
    loading: false,
    hasMore: true,
    showBackTop: false
  },

  onLoad: function (options) {},

  onChange: tool.debounce(function (e) {
    if (e[0].detail) {
      this.setData({
        value: e[0].detail || '', 
        current: 1,
        photoSizeList: [],
        total: 0,
        pages: 0,
        hasMore: true
      });
      this.searchData();
    } else {
      this.setData({
        value: '', 
        photoSizeList: [],
        total: 0,
        pages: 0,
        hasMore: true
      });
    }
  }, 500),

  searchData: function () {
    if (this.data.loading || !this.data.hasMore) return;
    
    this.setData({ loading: true });
    wx.showLoading({ title: '搜索中...' });

    wx.request({
      url: app.url + 'item/itemList',
      data: {
        pageNum: this.data.current,
        pageSize: this.data.size,
        type: 0,
        name: this.data.value || '', 
      },
      method: "GET",
      success: (res) => {
        wx.hideLoading();
        if (res.data.code == 200) {
          const { records, total, size, current, pages } = res.data.data;
          
          const newList = [...this.data.photoSizeList, ...records];
          const hasMore = current < pages;
          
          this.setData({
            photoSizeList: newList,
            total,
            size,
            pages,
            current: current + 1,
            hasMore
          });

          if (records.length == 0 && this.data.current == 1) {
            wx.showToast({
              title: '没有找到相关尺寸~',
              icon: 'none'
            });
          }
        }
      },
      complete: () => {
        this.setData({ loading: false });
      }
    });
  },

  moredata: function () {
    if (this.data.hasMore) {
      this.searchData();
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
      url: '/pages/preEdit/index?category=1&data=' + JSON.stringify(this.data.photoSizeList[e.currentTarget.dataset.index]),
    });
  },

  scrollToTop: function () {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    });
  },

  onPageScroll: function(e) {
    if (e.scrollTop > 100 && !this.data.showBackTop) {
      this.setData({
        showBackTop: true
      });
    } else if (e.scrollTop <= 100 && this.data.showBackTop) {
      this.setData({
        showBackTop: false
      });
    }
  },



  onPullDownRefresh: function () {
    this.setData({
      photoSizeList: [],
      current: 1,
      total: 0,
      pages: 0,
      scrollTop: 0,
      hasMore: true
    });
    this.searchData();
    wx.stopPullDownRefresh();
  },

  onReachBottom: function () {
    this.moredata();
  }

});
