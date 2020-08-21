let uploadBtnElement = document.querySelector("#uploadBtn");
let uploadFileElement = document.querySelector("#uploadFile");
let taskPanelElement = document.querySelector(".task_panel");
let taskBodyElement = document.querySelector(".task_body");
let contentListElement = document.querySelector(".content-list");
let taskCount = document.querySelector("#task_count");

let taskInprogress = 0;
let taskFinished = 0;

uploadBtnElement.onclick = function () {
  uploadFileElement.click();
};
uploadFileElement.onchange = function () {
  for (let file of this.files) {
    uploadFile({
      file,
    });
  }
};

function setTaskCount() {
  taskCount.innerHTML = taskFinished + "/" + taskInprogress;
}

function uploadFile(data) {
  taskInprogress++;
  setTaskCount();
  taskPanelElement.style.display = "block";

  let li = document.createElement("li");
  li.innerHTML = `
        <span>${data.file.name}</span>
        <div class="task-progress-status">
            上传中……
        </div>
        <div class="progress"></div>
    `;
  let taskProgressStatusElement = li.querySelector(".task-progress-status");
  let progressElement = li.querySelector(".progress");
  taskBodyElement.appendChild(li);

  ajax({
    method: "post",
    url: "/upload",
    data,
    success(data) {
    //   data = JSON.parse(data);
    //   for (let key in data) {
    //     let img = new Image();
    //     img.src = ["/static/upload", data[key].newName].join("/");
    //     img.className = "content_item";
    //     contentListElement.appendChild(img);
    //   }
      refresh()
      setTimeout(() => {
        li.remove();
        taskFinished--;
        taskInprogress--;
        setTaskCount();
        if (taskInprogress == 0) {
          taskPanelElement.style.display = "none";
        }
      }, 3000);
    },
    onprogress(ev) {
      // console.log('ev', ev);
      progressElement.style.width = (ev.loaded / ev.total) * 100 + "%";
    },
    onload() {
      taskProgressStatusElement.innerHTML =
        '<span class="icon task-progress-status-success"></span>';
      taskFinished++;
      setTaskCount();
    },
  });
}

function refresh() {
  ajax({
    method: "get",
    url: "/getPhotos",
    success(data) {
      contentListElement.innerHTML = "";
      data = JSON.parse(data);
      console.log("data", data);
      for (let key in data) {
        let img = new Image();
        img.className = "content_item";
        img.src = ["/static/upload", data[key].fileName].join("/");
        contentListElement.appendChild(img);
      }
    },
  });
}

window.onload(refresh());