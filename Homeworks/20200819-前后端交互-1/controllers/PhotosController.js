const KoaBody = require("koa-body");
const fs = require("fs");
const PhotosMdl = require("../models/PhotosModel");
const validSuffix = ["jpeg", "jpg", "bmp", "tif", "tiff", "png", "gif"]

function checkSuffix(path) {
  let lastPos = path.lastIndexOf("."); p
  let suffix = (path.substring(lastPos + 1)).toLowerCase();
  console.log("suffix",suffix);
  if (prefix in validSuffix) {
    return true;
  } else {
    return false;
  }
}

module.exports = {
  saveToFileSystem: (dir = "upload") => {
    // console.log(__dirname + "/../static/" + dir);
    return KoaBody({
      multipart: true,
      formidable: {
        uploadDir: __dirname + "/../static/" + dir,
        keepExtensions: true,
      },
    });
  },
  proceedFiles: async (ctx) => {
    function deleteError(error) {
      if (error) {
        console.log("删除非法文件时出错：", error);
        return false;
      }
    }
    let files = ctx.request.files;
    let uploadedFileInfo = [];
    for (let file in files) {
      current = files[file];
      if (checkSuffix(current.path) && current.size > 0) {
        let lastPos = current.path.lastIndexOf("/");
        if (lastPos == -1) {
          lastPos = current.path.lastIndexOf("\\");
        }
        newName = current.path.substring(lastPos + 1);
        uploadedFileInfo.push({
          oldName: current.name,
          newName,
          path: current.path,
          fileSize: current.size,
        });
        // 数据库操作
        await PhotosMdl.saveToDatabase(newName);
      } else {
        fs.unlink(current.path, deleteError);
      }
    }
    ctx.body = uploadedFileInfo;
  },
  getPhotos: async (ctx) => {
    ctx.body = await PhotosMdl.getAllPhotos();
  },
  clearPhotos: async (ctx) => {
    ctx.body = await PhotosMdl.clearAllPhotos();
  },
};
