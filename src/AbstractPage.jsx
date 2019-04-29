import React from 'react';
import ReactDOM from 'react-dom';
import {Toolbar, Page, Button, AlertDialog, Modal, ProgressCircular} from 'react-onsenui';

export default class AbstractPage extends React.Component {

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

}
