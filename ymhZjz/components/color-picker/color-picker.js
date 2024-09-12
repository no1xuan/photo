Component({
  properties: {
    initColor: {
      type: String,
      value:'rgb(255,0,0)'
    },
    maskClosable: {
      type: Boolean,
      value: true
    },
    mask: {
      type: Boolean,
      value: true
    },
    show: {
      type: Boolean,
      value: false
    },
  },
  data: {

  },
  lifetimes: {
    attached() {
      let { initColor} = this.data;
      this.setData({
        hueColor: this.hsv2rgb((this.rgb2hsv(initColor)).h,100,100)
      })
    },
    ready() {
      
      const $ = this.createSelectorQuery()
      const target = $.select('.target')
      target.boundingClientRect()
      $.exec((res) => {
        const rect = res[0]
        if (rect) {
          this.SV = {
            W: rect.width - 28, //block-size=28
            H: rect.height - 28,
            Step: (rect.width - 28) / 100
          }
          let { h, s, v } = this.rgb2hsv(this.data.initColor)
          // 初始化定位
          this.setData({
            hsv:{
              h,s,v
            },
            x: Math.round(s * this.SV.Step),
            y: Math.round((100-v )* this.SV.Step)
          })
        }
      })
    }
  },
  methods: {
    onEnd() {
      this.triggerEvent('changeColor', {
        color: this.data.colorRes
      })
    },
    changeHue: function (e) {
      let hue = e.detail.value;
      this.setData({
        "hsv.h":hue,
        hueColor: this.hsv2rgb(hue, 100, 100),
        colorRes: this.hsv2rgb(hue, this.data.hsv.s, this.data.hsv.v)
      })
    },
    changeSV: function (e) {
      let {
        x,
        y
      } = e.detail;
      x = Math.round(x / this.SV.Step);
      y = 100 - Math.round(y / this.SV.Step);
      this.setData({
        "hsv.s":x,
        "hsv.v": y,
        colorRes: this.hsv2rgb(this.data.hsv.h, x, y)
      })
    },
    close: function close(e) {
      if (this.data.maskClosable) {
        this.setData({
          show: false
        });
        this.triggerEvent('close');
      }
    },
    preventdefault:function() {
      
    },
    hsv2rgb: function (h, s, v) {
      let hsv_h = (h / 360).toFixed(2);
      let hsv_s = (s / 100).toFixed(2);
      let hsv_v = (v / 100).toFixed(2);

      var i = Math.floor(hsv_h * 6);
      var f = hsv_h * 6 - i;
      var p = hsv_v * (1 - hsv_s);
      var q = hsv_v * (1 - f * hsv_s);
      var t = hsv_v * (1 - (1 - f) * hsv_s);

      var rgb_r = 0,
        rgb_g = 0,
        rgb_b = 0;
      switch (i % 6) {
        case 0:
          rgb_r = hsv_v;
          rgb_g = t;
          rgb_b = p;
          break;
        case 1:
          rgb_r = q;
          rgb_g = hsv_v;
          rgb_b = p;
          break;
        case 2:
          rgb_r = p;
          rgb_g = hsv_v;
          rgb_b = t;
          break;
        case 3:
          rgb_r = p;
          rgb_g = q;
          rgb_b = hsv_v;
          break;
        case 4:
          rgb_r = t;
          rgb_g = p;
          rgb_b = hsv_v;
          break;
        case 5:
          rgb_r = hsv_v, rgb_g = p, rgb_b = q;
          break;
      }

      return 'rgb(' + (Math.floor(rgb_r * 255) + "," + Math.floor(rgb_g * 255) + "," + Math.floor(rgb_b * 255)) + ')';
    },
    rgb2hsv: function (color) {
      let rgb = color.split(',');
      let R = parseInt(rgb[0].split('(')[1]);
      let G = parseInt(rgb[1]);
      let B = parseInt(rgb[2].split(')')[0]);

      let hsv_red = R / 255, hsv_green = G / 255, hsv_blue = B / 255;
      let hsv_max = Math.max(hsv_red, hsv_green, hsv_blue),
        hsv_min = Math.min(hsv_red, hsv_green, hsv_blue);
      let hsv_h, hsv_s, hsv_v = hsv_max;

      let hsv_d = hsv_max - hsv_min;
      hsv_s = hsv_max == 0 ? 0 : hsv_d / hsv_max;

      if (hsv_max == hsv_min) hsv_h = 0;
      else {
        switch (hsv_max) {
          case hsv_red:
            hsv_h = (hsv_green - hsv_blue) / hsv_d + (hsv_green < hsv_blue ? 6 : 0);
            break;
          case hsv_green:
            hsv_h = (hsv_blue - hsv_red) / hsv_d + 2;
            break;
          case hsv_blue:
            hsv_h = (hsv_red - hsv_green) / hsv_d + 4;
            break;
        }
        hsv_h /= 6;
      }
      return {
        h: (hsv_h * 360).toFixed(),
        s: (hsv_s * 100).toFixed(),
        v: (hsv_v * 100).toFixed()
      }
    },
  }
})
