export default {
  // 时间戳转换日期 （秒）
  timestampToDate(timestamp) {
    if ((timestamp + '').length <= 10) {
      timestamp = timestamp * 1000 //时间戳为10位需*1000
    }
    var date = new Date(timestamp);
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return Y + M + D + h + m + s;
  },

  // 获取get参数
  getParams() {
    var url = window.document.location.href.toString();
    var u = url.split("?");
    if (typeof(u[1]) == "string") {
      u = u[1].split("&");
      var get = {};
      for (var i in u) {
        var j = u[i].split("=");
        get[j[0]] = j[1];
      }
      return get;
    } else {
      return {};
    }
  },

  // 获取路径参数
  getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.href.split('?')[1].match(reg);
    if (r != null) return decodeURIComponent(r[2]);
    return null;
  },


  /**
   * cookie操作
   */
  setCookie(name, value, options) {
    options = options || {};
    if (value === null) {
      value = '';
      options.expires = -1;
    }
    var expires = '';
    if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
      var date;
      if (typeof options.expires == 'number') {
        date = new Date();
        date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
      } else {
        date = options.expires;
      }
      expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
    }
    var path = options.path ? '; path=' + options.path : '';
    var domain = options.domain ? '; domain=' + options.domain : '';
    var s = [cookie, expires, path, domain, secure].join('');
    var secure = options.secure ? '; secure' : '';
    var c = [name, '=', encodeURIComponent(value)].join('');
    var cookie = [c, expires, path, domain, secure].join('')
    document.cookie = cookie;
  },

  getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) == (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  },

  // 判断终端
  browserVersions() {
    var u = navigator.userAgent.toLowerCase();
    return {
      mobile: !!navigator.userAgent.match(/applewebkit.*mobile.*/), //是否为移动终端
      android: u.indexOf('android') > -1 || u.indexOf('adr') > -1, //android终端
      iPhone: u.indexOf('iphone') > -1, //是否为iPhone或者QQHD浏览器
      Safari: !!u.match(/version\/([\d.]+).*safari/), //是否为Safari浏览器
      weixin: u.indexOf('micromessenger') > -1, //是否微信
      mdsApp: u.indexOf('mdsapp') > -1, //是否MdsApp
      mdsVer: u.indexOf('mdsapp') > -1 ? u.match(/mdsapp\/[^\s]+\s?/)[0].trim().split('/')[1] : '0' //MdsApp版本
    };
  }

}