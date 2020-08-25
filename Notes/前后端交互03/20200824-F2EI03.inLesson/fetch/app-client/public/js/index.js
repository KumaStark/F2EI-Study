
let uploadBtnElement = document.querySelector('.uploadBtn');
let uploadFileElement = document.querySelector('#uploadFile');
let taskBodyElement = document.querySelector('.task_body');
let photosListElement = document.querySelector('.photos-list');


function loadPhotos() {
    // fetch('/getPhotos');
}

loadPhotos();

function createLi(data) {
    let li = document.createElement('li');
    let img = new Image();
    img.src = 'http://localhost:8081' + data.url;
    li.appendChild(img);
    photosListElement.appendChild(li);
}


// 用户登录相关
let usernameElement = document.querySelector('#username');
let passwordElement = document.querySelector('#password');
let loginBtnElement = document.querySelector('#loginBtn');

loginBtnElement.onclick = async function() {

    let username = usernameElement.value;
    let password = passwordElement.value;

    let fd = new FormData();
    fd.append('username', username);
    fd.append('password', password);

    // fetch('/api/login', {
    //     method: 'post',
    //     body: fd
    // }).then( res => {
    //     // res => new Response(从后端返回的数据)
    //     console.log('res', res);
    //     // res.headers => new Header();
    //     console.log('authorization', res.headers.get('authorization'));

    //     // console.log('body', res.body);
    //     return res.json();
    // } ).then( data => {
    //     console.log('data', data);
    // } );

    let res = await fetch('/api/login', {
        method: 'post',
        body: fd
    });
    let data = await res.json();
    console.log('data', data);

}

/**
 * 但是 fetch 当下并不能完全取代XMLHttpRequest对象
 *  1、兼容性
 *  2、没有 upload 对象：progress 进度监控
 * 
 * 
 * 通过 fetchAPI 延伸的一些知识点
 *  Fetch API
 *  Request 对象
 *  Response 对象
 *  Header 对象
 *  FormData 对象
 *  Body 对象
 */

// console.groupCollapsed('a');
// console.log('...');
// console.log('...');
// console.log('...');
// console.groupEnd('...');

// console.table(["apples", "oranges", "bananas"]);
// console.table(window);