import {appVersion, dateToTime14} from './commonLib';

export const configFileName = 'faceRexConfig.json';

export default class FileControl {

  static loadConfig(resolve, reject) {
    var fileName = configFileName;
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs) {
      fs.root.getFile(fileName, {
        create: true,
        exclusive: false
      }, function(fileEntry) {
        FileControl.readFile(resolve, reject, fileEntry, fileName, function(resolve, reject, json) {
          var obj = (!json || json.length == 0) ? {} : JSON.parse(json),
            cfg = FileControl.updateConfigBase(obj);
          FileControl.saveConfig(resolve, reject, obj);
        });
      }, function() {
        return reject("設定ファイルの取得に失敗しました");
      });
    }, function() {
      return reject("ファイルシステムを読み込むことができませんでした");
    });
  }

  static updateConfigBase(cfg) {
    var nowStr = dateToTime14(new Date());
    cfg.uuid = device.uuid;
    cfg.cordova = device.cordova;
    cfg.deviceModel = device.model;
    cfg.deviceVersion = device.version;
    cfg.devicePlatform = device.platform;
    cfg.isVirtual = device.isVirtual ? "1" : "0";
    cfg.versionCode = appVersion;
    cfg.versionNum = appVersion;

    if(!cfg.createdAt) cfg.createdAt = nowStr;
    cfg.updateAt = nowStr;
    return cfg;
  }

  static saveConfig(resolve, reject, cfg) {
    var json = JSON.stringify(cfg, null, 4),
      fileName = configFileName;
    console.log(json);
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs) {
      fs.root.getFile(fileName, {
        create: true,
        exclusive: false
      }, function(fileEntry) {
        FileControl.writeFile(resolve, reject, fileEntry, json, fileName, function() {
          return resolve(cfg);
        });
      }, function() {
        return reject("ファイルの作成に失敗しました");
      });
    }, function() {
      return reject("ファイルシステムを読み込むことができませんでした");
    });
  }

  static saveTempImage(resolve, reject, dataURL, fileName) {
    window.requestFileSystem(window.TEMPORARY, 20 * 1024 * 1024, function(fs) {
      fs.root.getFile(fileName, {
        create: true,
        exclusive: false
      }, function(fileEntry) {
        FileControl.writeFile(resolve, reject, fileEntry, FileControl.dataURLToBlob(dataURL), fileName);
      }, function() {
        return reject("ファイルの作成に失敗しました");
      });
    }, function() {
      return reject("ファイルシステムを読み込むことができませんでした");
    });
  }

  static readFile(resolve, reject, fileEntry, fileName, onSuccess, onFailed) {
    fileEntry.file(function(file) {
      var reader = new FileReader();
      reader.onloadend = function() {
        if(onSuccess) {
          return onSuccess(resolve, reject, this.result);
        } else {
          return resolve(this.result);
        }
      };

      reader.readAsText(file);
    }, function(e) {
      if(onFailed) {
        return onFailed(resolve, reject, e);
      } else {
        return reject("ファイルの読み込みに失敗しました");
      }
    });
  }

  static writeFile(resolve, reject, fileEntry, data, fileName, onSuccess, onFailed) {
    fileEntry.createWriter(function(fileWriter) {
      fileWriter.onwriteend = function() {
        if(onSuccess) {
          return onSuccess(resolve, reject, data);
        } else {
          return resolve(data);
        }
      };

      fileWriter.onerror = function(e) {
        if(onFailed) {
          return onFailed(resolve, reject, e);
        } else {
          return reject("ファイルの書き込みに失敗しました");
        }
      };

      fileWriter.write(data);
    });
  }

  static dataURLToBlob(dataURL) {
    var byteString;
    if(dataURL.split(',')[0].indexOf('base64') >= 0) {
      byteString = atob(dataURL.split(',')[1]);
    } else {
      byteString = unescape(dataURL.split(',')[1]);
    }

    var mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];

    var array = [];
    for(var i = 0; i < byteString.length; i++) {
      array.push(byteString.charCodeAt(i));
    }

    return new Blob([new Uint8Array(array)], { type: mimeString });
  }
}
