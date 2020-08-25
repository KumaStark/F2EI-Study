function noop() {}

function ajax(options) {

    options = {
        ...{
            method: 'get',
            url: '',
            success: noop,
            onprogress: noop,
        },
        ...options
    }

    // 处理queyrString的数据
    
    if (options.query) {
        let queryString = queryParse(options.query);
        options.url += '?' + queryString;
    }

    // 创建一个ajax对象
    let xhr = new XMLHttpRequest();

    // 请求的回调函数
    xhr.onload = function() {
        options.success.call(xhr, xhr.responseText );
    }

    xhr.upload.onprogress = options.onprogress;
    xhr.upload.onload = options.onload;

    // 设置ajax请求参数
    xhr.open( options.method, options.url, true );

    xhr.setRequestHeader('authorization', localStorage.getItem('authorization'));

    // 通过body发送的数据是有N多种格式的
    // 我们可以直接使用js内置的一个对象来完成
    let bodyData = null;
    if (options.data) {
        bodyData = bodyParse(options.data);
    }
    

    // 发送请求
    xhr.send( bodyData );

}

// console.log('queryParse', queryParse({a: 1, b: 2}));

function queryParse(obj) {
    // {a: 1, b: 2} => a=1&b=2
    let arr = [];
    for (let key in obj) {
        arr.push(`${key}=${obj[key]}`);
    }
    return arr.join('&');
}

function bodyParse(obj) {
    let fd = new FormData();
    for (let key in obj) {
        fd.append(key, obj[key]);
    }
    return fd;
}