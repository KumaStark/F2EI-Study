/**
 * 因为一些安全因素
 *  浏览器会对协议资源请求进行一些控制（安全控制） - https://baike.baidu.com/item/%E5%90%8C%E6%BA%90%E7%AD%96%E7%95%A5/3927875?fr=aladdin
 * 
 * ajax 会受到同源策略的影响
 *  数据后端是给前端的，但是浏览器会阻止数据解析
 * 
 * 
 * CORS
 *  Access-Control-Allow-Origin
 * 当我们的浏览器通过ajax发送了一个请求的时候，如果该请求的域和当前域不是同一个，那么浏览器会去看一下请求的头信息里面是否存在一个
 * Access-Control-Allow-Origin 字段，且当前的域是否在这个字段的值里面
 * 如果在，则表示该数据是可信任的，就接受，否则拒绝
 * 
 * 
 * https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS
 */

let uploadBtnElement = document.querySelector('.uploadBtn');
let uploadFileElement = document.querySelector('#uploadFile');
let taskBodyElement = document.querySelector('.task_body');
let photosListElement = document.querySelector('.photos-list');


// 加载所有的图片
function loadPhotos() {
    ajax({
        method: 'get',
        url: 'http://localhost:8081/getPhotos',
        success(data) {
            // data 是一个 JSON 字符串
            // console.log(typeof data);
            data = JSON.parse(data);

            // console.log(data);

            data.forEach(d => {
                // let li = document.createElement('li');
                // let img = new Image();
                // // img.src = '/public/upload/' + d.name;
                // img.src = 'http://localhost:8081/' + d.url;
                // li.appendChild(img);
                // photosListElement.appendChild(li);

                createLi(d);
            });


        }
    });
}

loadPhotos();

// 点击上传
uploadBtnElement.onclick = function() {

    uploadFileElement.click();

}

// 内容发生改变了，已经选择了上传文件
uploadFileElement.onchange = function() {
    // console.log('upload');

    // console.dir(this.files);

    for (let file of this.files) {
        // console.log(file);
        uploadFile({
            file
        });
    }

    
}

function uploadFile(data) {

    let li = document.createElement('li');
    li.innerHTML = `
        <span>${data.file.name}</span>
        <div class="task-progress-status">
            上传中……
        </div>
        <div class="progress"></div>
    `
    let taskProgressStatusElement = li.querySelector('.task-progress-status');
    let progressElement = li.querySelector('.progress');
    taskBodyElement.appendChild(li);

    ajax({
        method: 'post',
        url: 'http://localhost:8081/upload',
        data,
        success(data) {
            
            data = JSON.parse(data);
            createLi(data);
            

            setTimeout(() => {
                // li.remove();
                taskProgressStatusElement.innerHTML = '上传完成';
            }, 1000);
        },
        onprogress(ev) {
            // console.log('ev', ev);
            progressElement.style.width = (ev.loaded / ev.total) * 100 + '%';
        }
    });
}

function createLi(data) {
    let li = document.createElement('li');
    let img = new Image();
    // img.src = '/public/upload/' + d.name;
    img.src = 'http://localhost:8081' + data.url;
    li.appendChild(img);
    photosListElement.appendChild(li);
}