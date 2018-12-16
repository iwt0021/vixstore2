import React from 'react';
import ReactDOM from 'react-dom';
import {Toolbar, Page, Button, AlertDialog, Modal, ProgressCircular} from 'react-onsenui';

import MapFacesPage, {PHOTO_MAX_W, PHOTO_MAX_H} from './MapFacesPage'
import CameraControl from './CameraControl'
import VisualRecognition from './VisualRecognition'
import ImageResize from './ImageResize'

export default class SelectPhotoPage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isAlertOpen: false,
      alertMessage: "",
      isLoading: false
    };
  }

  openAlert(message) {
    this.closeLoding();
    this.setState({
      isAlertOpen: true,
      alertMessage: message
    });
  }

  closeAlert() {
    this.setState({
      isAlertOpen: false
    });
  }

  openLoding() {
    this.setState({
      isLoading: true
    });
  }

  closeLoding() {
    this.setState({
      isLoading: false
    });
  }

  handleTakePhoto(e) {
    e.preventDefault();
    var cameraControl = new CameraControl(Camera.PictureSourceType.CAMERA,
      this.onSuccessSelectPhoto.bind(this), this.onFailedSelectPhoto.bind(this));
    cameraControl.openCamera();
  }

  onSuccessSelectPhoto(imageUri) {
    this.openLoding();
    var imageResize = new ImageResize(this.openAlert.bind(this));
    imageResize.resize(imageUri, PHOTO_MAX_W, PHOTO_MAX_H,
      this.onSuccessResizePhoto.bind(this));
  }

  onFailedSelectPhoto(error) {
    this.openAlert("写真の選択に失敗しました: " + error);
  }

  onSuccessResizePhoto(imageUri, orgWidth, orgHeight) {
    this.props.imageUri = imageUri;
    this.props.imageOrgWidth = orgWidth;
    this.props.imageOrgHeight = orgHeight;

    var visualRecognition = new VisualRecognition(this.openAlert.bind(this));
    visualRecognition.recognizeFaces(imageUri, this.onSuccessRecognizeFaces.bind(this))
  }

  onSuccessRecognizeFaces(res) {
    // console.log(res);
    this.closeLoding();
    this.props.facesRes = res.response;
    // console.log("facesRes: " + this.props.facesRes)

    this.props.navigator.pushPage({component: MapFacesPage, props: this.props});
  }

  handleSelectLibrary(e) {
    e.preventDefault();
    var cameraControl = new CameraControl(Camera.PictureSourceType.PHOTOLIBRARY,
      this.onSuccessSelectPhoto.bind(this), this.onFailedSelectPhoto.bind(this));
    cameraControl.openCamera();
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

     
        <ul style={{padding: '10px 5px', border: '1px solid black', borderRadius: '10px'}}>
          <center>
          <li>
            撮影した顔写真と判定結果を
          </li>
          <li>
          連絡先に保存できます。
          </li>
          <li>
            あらかじめ連絡先に
          </li>
          <li>
          氏名等を登録しておいてください。
          </li>
          <li>
            FaceRex結果写真を保存するには、
          </li>
           <li>
           スマホのスクリーンショットを使ってください。
          </li>

         <p>
          <a href="#!" onClick={this.openAuthorLink}>顔認識アプリFaceRexの仕組み</a>
        </p>
        
          <li>
            株式会社エンセファロン
          </li>
      </center>
        </ul>

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
