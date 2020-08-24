function noop() { }
const defaultOptions = {
  method: "get",
  url: "",
  success: noop,
  onprogress: noop,
  onload: noop,
};

function ajax(options) {
  options = Object.assign(defaultOptions, options);
  if (options.query) {
    let queryString = queryParse(options.query);
    options.url += "?" + queryString;
  }

  let xhr = new XMLHttpRequest();

  xhr.onload = function () {
    options.success.call(xhr, xhr.responseText);
  };
  xhr.upload.onprogress = options.onprogress;
  xhr.upload.onload = options.onload;

  xhr.open(options.method, options.url, true);
  xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('authorization'));
  let bodyData = null;
  if (options.data) {
    bodyData = bodyParse(options.data);
  }
  xhr.send(bodyData);
}

function queryParse(obj) {
  let arr = [];
  for (let key in obj) {
    arr.push(`${key}=${obj[key]}`);
  }
  return arr.join("&");
}

function bodyParse(obj) {
  let fd = new FormData();
  for (let key in obj) {
    fd.append(key, obj[key]);
  }
  return fd;
}
