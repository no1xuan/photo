// 引入Dialog
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
const app = getApp();

Page({
  data: {
    workList: [],
    pageNum: 1,
    pageSize: 5,
    hasMore: true
  },

  // 页面加载时请求第一页数据
  onLoad() {
    if (app.token === "") {
      wx.navigateTo({
        url: '/pages/login/index',
      });
      return;
    }
    this.getSizeList();
  },

  // 获取数据
  getSizeList() {
    const that = this;
    if (!this.data.hasMore) {
      return; // 如果没有更多数据，直接返回
    }
    wx.showLoading({
      title: '加载中...',
    });
    wx.request({
      url: app.url + 'item/photoList',
      data: {
        pageNum: this.data.pageNum,
        pageSize: this.data.pageSize,
      },
      header: {
        "token": app.token
      },
      method: "GET",
      success(res) {
        wx.hideLoading();
        if (res.data.code === 200) {
          const newData = res.data.data;
          that.setData({
            workList: that.data.pageNum === 1 ? newData : that.data.workList.concat(newData),  // 拼接新数据
            hasMore: newData.length === that.data.pageSize  // 如果返回的数据少于 pageSize，表示没有更多数据了
          });
        } else if (res.data.code === 500) {
          that.setData({
            hasMore: false  // 状态码500时，设置为没有更多数据
          });
          wx.showToast({
            title: '没有更多数据',
            icon: 'none',
            duration: 2000
          });
        }
      },
      fail() {
        wx.hideLoading();
        wx.showToast({
          title: '加载失败，请重试',
          icon: 'none',
          duration: 2000
        });
      }
    });
  },

  // 删除操作
  remove(e) {
    let that = this;
    Dialog.confirm({
      message: '确定要删除这张吗？',
    }).then(() => {
      wx.request({
        url: app.url + 'item/deletePhotoId',
        data: {
          id: e.target.dataset.id,
        },
        header: {
          "token": app.token
        },
        method: "GET",
        success(res) {
          wx.hideLoading();
          if (res.data.code === 200) {
            that.getSizeList();  // 刷新列表
          }
        }
      });
    }).catch(() => {
      // 取消删除操作时，不执行任何操作
    });
  },

  // 页面上拉触底事件（下滑加载下一页）
  onReachBottom() {
    if (this.data.hasMore) {
      this.setData({
        pageNum: this.data.pageNum + 1
      });
      this.getSizeList();  // 加载下一页数据
    }
  },

  // 根据图片url下载保存
  savePicUrlAndImg(picUrl) {
    console.log(picUrl);
    wx.downloadFile({
      url: picUrl,
      success: function (res) {
        // 下载成功后将图片保存到本地
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function () {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            });
          },
          fail: function () {
            wx.showToast({
              title: '保存失败，请开启相册权限',
              icon: 'none',
              duration: 2000
            });
          }
        });
      },
      fail: function () {
        wx.showToast({
          title: '下载图片失败，请重试',
          icon: 'none',
          duration: 2000
        });
      }
    });
  },
});
