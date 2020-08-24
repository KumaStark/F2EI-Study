// ajax({
//     method: 'post',
//     url: '/getData',
//     query: {
//         a: 1,
//         b: 2
//     },
//     data: {
//         x: 1,
//         y: 2
//     },
//     success(data) {
//         console.log('data', data);
//     }
// });

let uploadBtnElement = document.querySelector('.uploadBtn');
let uploadFileElement = document.querySelector('#uploadFile');
let taskBodyElement = document.querySelector('.task_body');
let photosListElement = document.querySelector('.photos-list');


// 加载所有的图片
function loadPhotos() {
    ajax({
        method: 'get',
        url: '/getPhotos',
        success(data) {
            // data 是一个 JSON 字符串
            // console.log(typeof data);
            data = JSON.parse(data);

            // console.log(data);

            data.forEach(d => {
                let li = document.createElement('li');
                let img = new Image();
                // img.src = '/public/upload/' + d.name;
                img.src = d.url;
                li.appendChild(img);
                photosListElement.appendChild(li);
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
        url: '/upload',
        data,
        success(data) {
            
            data = JSON.parse(data);
            // console.log('data', data);

            // let img = new Image();
            // img.src = data.url;
            // document.body.appendChild(img);

            let li = document.createElement('li');
            let img = new Image();
            // img.src = '/public/upload/' + d.name;
            img.src = data.url;
            li.appendChild(img);
            photosListElement.appendChild(li);

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