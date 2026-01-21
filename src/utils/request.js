import axios from 'axios'

const instance = axios.create({
    baseURL,
    timeout: 10000
})
instance.interceptors.request.use(
  config => {
    config.headers["sign"] = getUrlParam('sign') || sessionStorage.getItem('sign')
    return config;
  },
  error => {
    console.log(error); // for debug
    return Promise.reject(error);
  }
);
 
function get(url, params) {
   return new Promise((resolve, reject) => {
    instance.get(url, { params: params })
        .then((res) => {
			if(res.data.code !=200){
				return reject(res.data.msg);
			}
            resolve(res.data);
        })
        .catch((err) => {
            reject(err.data);
        });
  });
}
function post(url, data) {
  return new Promise((resolve, reject) => {
    instance.post(url, data,{
            headers:{
               'content-type': 'application/json'
            }
        })
        .then((res) => {
			if(res.data.code !=200){
				return reject(res.data.msg);
			}
            resolve(res.data);
        })
        .catch((err) => {
            reject(err);
        });
    });
}