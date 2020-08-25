
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

    // console.log('axios', axios);

    let rs = await axios.post('/api/login', {
        username,
        password
    });

    console.log('rs', rs);

    console.log('data', rs.data);

}

