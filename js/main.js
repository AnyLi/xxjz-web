
const baseURL = 'https://api.xxjz.store/'
const baseURL2 = 'https://api2.xxjz.store/'
// const baseURL = 'http://192.168.1.17:8080/'
const staticURL = 'https://anii-1303089700.cos.ap-chengdu.myqcloud.com/xxjz/'
const xxjz2Path = ['setFsQuantity.html']
let dot = location.href.includes('/html/')?'..':'.'
// 配置需要加载的JS资源列表
const resources = [
    { url: 'https://unpkg.com/vue@2.6/dist/vue.min.js', globalVar: 'Vue' },
    { url: 'https://unpkg.com/axios/dist/axios.min.js', globalVar: 'axios' },
	{ url: dot+'/js/dict.js', globalVar: 'baseURL' },
	{ url: dot+'/js/util.js', globalVar: 'baseURL' },
    { url: dot+'/js/request.js', globalVar: 'request' },
    { url: 'https://unpkg.com/element-ui/lib/index.js', globalVar: 'ELEMENT' },
    { url: 'https://unpkg.com/vant@2.12/lib/vant.min.js', globalVar: 'vant' }
];

// 加载CSS资源
const loadCSS = (url) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
	console.log(`${url} 加载完成`);
    document.head.appendChild(link);
};

// 加载JS资源
const loadJS = (url, callback) => {
    const script = document.createElement('script');
    script.src = url;
    script.onload = callback;
    document.body.appendChild(script);
};

// 批量加载资源
const loadResources = () => {
    // 加载CSS
    loadCSS('https://unpkg.com/element-ui/lib/theme-chalk/index.css');
    loadCSS('https://unpkg.com/vant@2.12/lib/index.css');
    loadCSS(dot+'/css/base.css');
    
    // 链式加载JS
    let chain = Promise.resolve();
    resources.forEach(resource => {
        chain = chain.then(() => new Promise(resolve => {
            loadJS(resource.url, () => {
                console.log(`${resource.url} 加载完成`);
                resolve();
            });
        }));
    });
    
    return chain;
};

// 初始化Vue插件
const initPlugins = () => {
	console.log('加载完了-真完了---')
    if (window.Vue) {
        if (window.vant) Vue.use(window.vant);
        if (window.ELEMENT) Vue.use(window.ELEMENT);
        Vue.prototype.$http = window.axios;
    }
};

// 使用示例
// 执行加载
loadResources().then(initPlugins);
console.log('加载完了----')
// 引入Vue核心库（需确保已通过script标签引入）
// const Vue = window.Vue;

// // 引入第三方库（示例）
// const axios = window.axios || require('axios');
// const lodash = window._ || require('lodash');

// // 引入自定义模块
// const utils = require('./utils.js');
// const api = require('./api.js');

// // 全局方法挂载
// Vue.prototype.$utils = utils;
// Vue.prototype.$api = api;

// // 导出公共对象
// module.exports = {
//   Vue,
//   axios,
//   lodash,
//   utils,
//   api
// };
