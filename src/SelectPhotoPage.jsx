import React from 'react';
import ReactDOM from 'react-dom';
import {Toolbar, Page, Button, AlertDialog, Modal, ProgressCircular} from 'react-onsenui';

import AbstractPage from './AbstractPage';
import MapFacesPage, {PHOTO_MAX_W, PHOTO_MAX_H} from './MapFacesPage';
import CameraControl from './CameraControl';
import UserControl from './UserControl';
import VisualRecognition from './VisualRecognition';
import ImageControl from './ImageControl';
import FileControl from './FileControl';

export default class SelectPhotoPage extends AbstractPage {

  constructor(props) {
    super(props);
  }

  handleTakePhoto(e) {
    e.preventDefault();
    var cameraControl = new CameraControl(Camera.PictureSourceType.CAMERA,
      this.onSuccessSelectPhoto.bind(this), this.onFailedSelectPhoto.bind(this));
    cameraControl.openCamera();
  }

  handleSelectLibrary(e) {
    e.preventDefault();
    var cameraControl = new CameraControl(Camera.PictureSourceType.PHOTOLIBRARY,
      this.onSuccessSelectPhoto.bind(this), this.onFailedSelectPhoto.bind(this));
    cameraControl.openCamera();
  }

  onSuccessSelectPhoto(imageUri) {
    this.openLoding();
    var promise = new Promise(FileControl.loadConfig),
        self = this;
    promise.then(function(cfg) {
      self.props.cfg = cfg;
	    return new Promise(function(resolve, reject) {
        UserControl.activate(resolve, reject, cfg);
      });
    }).then(function(cfg) {
      self.props.cfg = cfg;
	    return new Promise(function(resolve, reject) {
        ImageControl.resize(resolve, reject, imageUri, PHOTO_MAX_W, PHOTO_MAX_H);
      });
    }).then(function(res) {
      self.props.imageUri = res.dataURL;
      self.props.imageOrgWidth = res.orgWidth;
      self.props.imageOrgHeight = res.orgHeight;
	    return new Promise(function(resolve, reject) {
        VisualRecognition.recognizeFaces(resolve, reject, self.props.cfg, res.dataURL);
      });
    }).then(function(res) {
      self.closeLoding();
      self.props.facesRes = res;
      self.props.navigator.pushPage({component: MapFacesPage, props: self.props});
    }).catch(function(reason) {
      self.openAlert(reason);
      console.log(reason);
    });
  }

  onFailedSelectPhoto(error) {
    this.openAlert("写真の選択に失敗しました: " + error);
  }

  openAuthorLink(e) {
    e.preventDefault();
    cordova.InAppBrowser.open("http://www.enc.jp/facerex/", "_blank", "location=yes");
  }

  renderToolbar() {
    return (
      <Toolbar>
        <div className="center">写真を選択</div>
      </Toolbar>
    );
  }

  render() {
    return (
      <Page renderToolbar={this.renderToolbar}>
        <p style={{textAlign: 'center'}}>
          <Button onClick={this.handleTakePhoto.bind(this)}>カメラで撮影</Button>
        </p>
        <p style={{textAlign: 'center'}}>
          <Button onClick={this.handleSelectLibrary.bind(this)}>ライブラリから選択</Button>
        </p>

        <div style={{padding: '10px 5px', textAlign: 'center', border: '1px solid black', borderRadius: '10px'}}>
          <p>
            撮影した顔写真と判定結果を<br />
            連絡先に保存できます。<br />
            あらかじめ連絡先に<br />
            氏名等を登録しておいてください。<br />
            FaceRex結果写真を保存するには、<br />
            スマホのスクリーンショットを使ってください。
          </p>

          <p>
            <a href="#!" onClick={this.openAuthorLink}>顔認識アプリFaceRexの仕組み</a>
          </p>
        
          <p>
            株式会社エンセファロン
          </p>
        </div>

        <AlertDialog isOpen={this.state.isAlertOpen} cancelable>
          <div className="alert-dialog-content">
            {this.state.alertMessage}
          </div>
          <div className="alert-dialog-footer">
            <Button onClick={this.closeAlert.bind(this)} className="alert-dialog-button">
              Ok
            </Button>
          </div>
        </AlertDialog>
        <Modal isOpen={this.state.isLoading}>
          <ProgressCircular indeterminate />
          <p>顔を認識しています...</p>
        </Modal>
      </Page>
    );
  }
}
