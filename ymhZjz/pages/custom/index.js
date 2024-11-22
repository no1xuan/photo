import tool from '././util'
import Dialog from '@vant/weapp/dialog/dialog';
const app = getApp();


Page({
  data: {
    width: '',
    height: '',
    dpi:'',
    name: '',
    px: '0*0 px',
    size: '0*0 mm'
  },

  onLoad: function () {
    if (!wx.getStorageSync('token')) {
      wx.navigateTo({
        url: '/pages/login/index'
      });
    }
  },

  changeName(e) {
    const value = e.detail || '';
    this.setData({
      name: value
    });
  },
  
  // DPI输入框
  changeDpi(e) {
    let value = e.detail || '';
    // 移除非数字字符和移除前导0
    value = value.replace(/\D/g, '');
    value = value.replace(/^0+(\d)/, '$1');
    this.setData({
      dpi: value
    });
  },

  // 宽度输入框
  changeWidth: tool.debounce(function (e) {
    let value = e.detail || '';
    // 移除非数字字符和移除前导0
    value = value.replace(/\D/g, '');
    value = value.replace(/^0+(\d)/, '$1');
    this.setData({
      width: value
    });
    this.updateSize();
  }, 300),

  // 高度输入框
  changeHeight: tool.debounce(function (e) {
    let value = e.detail || '';
    // 移除非数字字符和移除前导0
    value = value.replace(/\D/g, '');
    value = value.replace(/^0+(\d)/, '$1');
    this.setData({
      height: value
    });
    this.updateSize();
  }, 300),

  updateSize() {
    let width = parseInt(this.data.width, 10);
    let height = parseInt(this.data.height, 10);
    let width_px = isNaN(width) ? 0 : width;
    let height_px = isNaN(height) ? 0 : height;
    let width_mm = Math.floor(width_px / 11.8);
    let height_mm = Math.floor(height_px / 11.8);
    this.setData({
      px: `${width_px}*${height_px} px`,
      size: `${width_mm}*${height_mm} mm`
    });
  },

  addSize() {
    const name = this.data.name.trim();
    const width = parseInt(this.data.width, 10);
    const height = parseInt(this.data.height, 10);
    const dpi = parseInt(this.data.dpi, 10);
    
    if (!name) {
      wx.showToast({
        title: '名称为必填',
        icon: 'none',
        duration: 2000,
        mask: true
      });
      return;
    }

    if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
      wx.showToast({
        title: '宽或高必须大于0',
        icon: 'none',
        duration: 2000,
        mask: true
      });
      return;
    }

    if (isNaN(dpi) || dpi < 72) {
      wx.showToast({
        title: '分辨率最低72',
        icon: 'none',
        duration: 2000,
        mask: true
      });
      return;
    }

    if (dpi > 1000) {
      wx.showToast({
        title: '分辨率最高只能1000',
        icon: 'none',
        duration: 2000,
        mask: true
      });
      return;
    }

    if (!this.isValidName(name)) {
      wx.showToast({
        title: '名称不能包含特殊符号',
        icon: 'none',
        duration: 2000,
        mask: true
      });
      return;
    }

    wx.request({
      url: app.url + 'item/saveCustom',
      method: 'POST',
      data: {
        name: name,
        widthPx: width,
        heightPx: height,
        size: this.data.size,
        dpi: dpi
      },
      header: {
        token: wx.getStorageSync('token')
      },
      success: (res) => {
        if (res.data.code == 200) {
        
          this.setData({
            name: '',
            width: '',
            height: '',
            dpi:'',
            px: '0*0 px',
            size: '0*0 mm'
          });

          Dialog.confirm({
            title: '定制成功',
            message: '尺寸定制成功，是否立即去制作？',
          })
            .then(() => {
              wx.navigateTo({
                url: '/pages/preEdit/index?category=4&data='+JSON.stringify(res.data.data),
              });
            })
            .catch(() => {
              wx.showToast({
                title: '后续可在快速制作里面的我的定制进行查看',
                icon: 'none'
              });
            });
            
        } else if(res.data.code == 404){
          wx.showToast({
            title: res.data.data,
            duration: 2000,
            icon: 'none',
            mask: true
          });
        }else{
          wx.navigateTo({
            url: "/pages/login/index",
          });
        }
      },
    });
  },

  isValidName(name) {
    const reg = /^[a-zA-Z0-9\u4e00-\u9fa5]+$/;
    return reg.test(name);
  }
});
