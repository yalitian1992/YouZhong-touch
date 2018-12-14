/**
 *
 * baseUrl: 域名地址
 * imgBaseUrl: 图片所在域名地址
 *
 */
const baseUrl = '/api';
let url = 'http://dww.ihaveu.com:20080';
// let url = ['http://i0.ihaveu.com', 'http://i1.ihaveu.com', 'http://i2.ihaveu.com', 'http://i3.ihaveu.com'];
let imgBaseUrl = function () {
  return url;
  // return url[Math.floor(Math.random() * 4)];
}
let money = '￥';
// let money = '$';

export {
  imgBaseUrl,
  baseUrl,
  money
}
