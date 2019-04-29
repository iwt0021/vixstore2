import {appBaseURI} from './commonLib';
import FileControl from './FileControl';

const userActivateURI = appBaseURI + '/user/activate.php';

export default class UserControl {

  static activate(resolve, reject, cfg) {
    $.ajax({
      url: userActivateURI,
      type: "POST",
      dataType: "json",
      data: cfg
    }).done(function(res) {
      if(res.status == "OK") {
        cfg.userId = res.data.userId;
        FileControl.saveConfig(resolve, reject, cfg);
      } else {
        console.log("ユーザーの認証に失敗しました: " + JSON.stringify(res.messages));
        return reject("ユーザーの認証に失敗しました");
      }
    }).fail(function(xhr, statusText) {
      console.log("AIサーバーとの通信に失敗しました: " + statusText);
      return reject("AIサーバーとの通信に失敗しました");
    });
  }

}
