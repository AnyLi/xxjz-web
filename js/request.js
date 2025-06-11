const instance = axios.create({
    baseURL,
    timeout: 10000
})
// const token = 'Bearer xxx'
// request interceptor
instance.interceptors.request.use(
  config => {
    // config.headers["Authorization"] = token;
    // if (store.getters.token) {
    //   // let each request carry token
    //   // ['X-Token'] is a custom headers key
    //   // please modify it according to the actual situation
    //   // config.headers["token"] = getToken();
    // }
    return config;
  },
  error => {
    // do something with request error
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