import {getAdapter} from './adapters.js';
import InterceptorManager from './InterceptorManager.js'

class Kxios {

    constructor() {
        this.interceptors = {
            request: new InterceptorManager(),
            response: new InterceptorManager()
        };
    }

    request(config) {

        let chain = [function(config) {
            let adapter = getAdapter( config );
            return adapter;
        }, undefined];
        

        // console.log('adapter', adapter)

        // 立即返回一个成功状态的promise
        let promise = Promise.resolve(config);
        // 然后把chain挂载到promise后面
        // [ s1, e1, s2, e2, adapter, undefined, res1, res2... ]
        this.interceptors.request.handlers.forEach(function(interceptor) {
            chain.unshift(interceptor.fulfilled, interceptor.rejected);
        });

        /**
         * promise.then(s1, e1).then(s2, e2).then(function() {
            let adapter = getAdapter( config );
        }, undefined)
         * 
         */
        while (chain.length) {
            promise = promise.then(chain.shift(), chain.shift());
        }

        return promise;

    }

    get(url, query={}) {

        let xhr = new XMLHttpRequest();

    }

    post(url, data={}, config={}) {

        config.method = 'post';
        config.url = url;
        config.data = data;
        
        return this.request(config);

    }

}

let instance = new Kxios()

let kxios = Kxios.prototype.request;
kxios


export default instance;