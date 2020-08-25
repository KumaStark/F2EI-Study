function xhrAdapter(config) {
    return new Promise((resove, reject) => {
        let xhr = new XMLHttpRequest();

        xhr.onload = function() {
            let data = JSON.parse(xhr.responseText);
            resove(data);
        }

        let fd = new FormData();

        for (let key in config.data) {
            fd.append(key, config.data[key]);
        }

        xhr.open(config.method, config.url, true);
        xhr.send(fd);

        return xhr;
    });
}

function httpAdapter() {

}


function getAdapter(config) {
    // 如果是浏览器环境
    if (typeof XMLHttpRequest !== 'undefined') {
        return xhrAdapter(config);
    } else {

    }
}

export {
    getAdapter
}