import React, { Component } from 'react';
import {
  Modal,
  Button,
  Popover,
  Tooltip,
  OverlayTrigger
} from 'react-bootstrap';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

class PopUp extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleClose = this.handleClose.bind(this);
  }

  handleClose() {
    this.props.handleClose()
  }

  _crop(e){
    let that = this;
    const dataUrl = that.refs.cropper.getCroppedCanvas().toDataURL();
    that.props.updateCroppedImage(dataUrl);
  }


  render() {
    return (
      <div>
        <Modal id="modal_id" className="profile_modal" show={this.props.modalIsOpen} onHide={this.handleClose}>
          <Modal.Header closeButton>
          </Modal.Header>
          <Modal.Body>
                <Cropper
                  background={false}
                  center={true}
                  viewMode={3}
                  ref='cropper'
                  src={this.props.profilePic}
                  style={{height: 150, width: 150, marginLeft: '25%', padding: '2px'}}
                  guides={false}
                />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this._crop.bind(this)}>{ this.props.isImageUploadInProgress ? 'Please wait...' : 'Crop and Save'}</Button>
            <Button onClick={this.handleClose} disabled={this.props.isImageUploadInProgress}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}


export default PopUp;
