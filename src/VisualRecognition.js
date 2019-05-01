import {appBaseURI} from './commonLib';

const recognizeFacesURI = appBaseURI + '/recognize/faces.php';

export default class VisualRecognition {

  static recognizeFaces(resolve, reject, cfg, imageUri) {
    var options = new FileUploadOptions();
    options.fileKey = 'images_file';
    options.fileName = imageUri.substr(imageUri.lastIndexOf('/') + 1);
    options.chunkedMode = false;
    var params = {
      userId: cfg.userId
    };
    options.params = params;
    var fileTransfer = new FileTransfer();
    fileTransfer.upload(imageUri, recognizeFacesURI, function(r) {
      if(r.responseCode == 200) {
        var res = JSON.parse(r.response);
        if(res.status == "LIMIT OVER") {
          console.log("API呼び出し回数オーバーです。");
          return reject("API呼び出し回数オーバーです。しばらく経ってからアクセスしてください。");
        } else if(res.status == "OK") {
          return resolve(JSON.stringify(res.data));
        } else {
          console.log("AIサーバーとの通信に失敗しました: " + JSON.stringify(res.messages));
          return reject("AIサーバーとの通信に失敗しました");
        }
      } else {
        return reject("AIサーバーとの通信に失敗しました: " + r.responseCode);
      }
    }, function(error) {
      return reject("AIサーバーとの通信に失敗しました: " + error.code
        + "," + error.source + "," + error.target);
    }, options);
  }

  static resultFaceToTextList(face) {
    var textList = [],
        text = '見た目年齢: ';
    if ('max' in face.age && 'min' in face.age) {
      //年齢の上限と下限が認識された場合
      text += face.age.min + ' - ' + face.age.max + '歳 ' + ' ( ' + face.age.score + ')';
      textList.push(text);
    } else if ('max' in face.age){
      //年齢の上限のみ認識された場合
      text += face.age.max + '歳 ' + ' ( ' + face.age.score + ')';
      textList.push(text);
    } else if ('min' in face.age){
      //年齢の下限のみ認識された場合
      text += face.age.min + '歳 ' +  ' ( ' + face.age.score + ')';
      textList.push(text);
    }
    //性別
    text = '性別: ' + face.gender.gender + ' ( ' + face.gender.score + ')';
    textList.push(text);

    return textList;
  }

}
