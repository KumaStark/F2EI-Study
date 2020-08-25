import kxios from './kxios/Kxios.js';


// let kxios = new Kxios();

(async function() {

    

    // let rs = await kxios.request({
    //     method: 'post',
    //     url: '/api/login',
    //     data: {
    //         username: 'zmouse',
    //         password: '123'
    //     }
    // });

    kxios.interceptors.request.use(function s1 (config) {
        console.log('s1');
        // config.setHeader();
        // 请求拦截器：在请求之前去对一些请求工作进行统一的配置
        return config;
    }, function e1 (error) {
        return Promise.reject(error);
    });
    kxios.interceptors.request.use(function s2 (config) {
        console.log('s2');
        return config;
    }, function e2 (error) {
        return Promise.reject(error);
    });

    // kxios.interceptors.response.use(function s2 (res) {
    //     // 请求成功做一些统一事情
    //     return config;
    // }, function (error) {
    //     if (error) {
    //         // alert(error);
    //     }
    //     return Promise.reject(error);
    // });

    // kxios();

    let rs = await kxios.post('/api/login', {
        username: 'zmouse',
        password: '123'
    });

    console.log('kxios', kxios);

    console.log('rs', rs);
    console.log('data', rs.data);

    // if (rs.error) {
    //     alert(rs.error)
    // }
})();