const app = getApp()

Page({
    data: {
        name: "",
        authorized: false,
        activeNames: [], // 一级折叠项的状态
        activeChildrenNames: [] // 二级折叠项的状态
    },

    // 点击登录
    getUserProfile: function(e) {
      wx.navigateTo({
        url: '/pages/login/index',
      });
    },

    // 处理一级折叠面板的展开和收起事件
    onCollapseChange: function(event) {
        this.setData({
            activeNames: event.detail
        });
    },

    // 处理二级折叠面板的展开和收起事件
    onChildrenChange: function(event) {
        this.setData({
            activeChildrenNames: event.detail
        });
    },

    onLoad: function(options) {
 
    },

    onShow: function() {
      if(wx.getStorageSync("token") != ""){
               // const token = wx.getStorageSync('token');
        // if (token) {
        //     wx.request({
        //         url: app.url + 'user/info',
        //         method: "GET",
        //         header: { Authorization: `Bearer ${token}` },
        //         success: (res) => {
        //             this.setData({
        //                 authorized: true,
        //                 name: "欢饮您，123"
        //             });
        //         }
        //     });
        // }
      }

    }
})
