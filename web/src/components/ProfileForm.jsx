import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import $ from 'jquery';
import { updateUserProfileInfo, updateUserProfileImg } from '../actions/profileActions';
import PopUp from './PopUp';
// const ImgUploader = require('../lib/ImgUploader');

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    width                 : '25%'
  }
};

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  userProfileInfo: PropTypes.object.isRequired,
}

class ProfileForm extends Component {
  constructor(props) {
    super(props);
    console.log('userProfileInfo:- ', this.props.userProfileInfo);
    const { firstName, lastName, age, sex, email, mobileNo, profilePic } = this.props.userProfileInfo;
    this.state = {
      firstName: firstName || '',
      lastName: lastName || '',
      age: age || 36,
      sex: (sex && sex == 1) ? 1 : 2,
      email: email || 'john@gamil.com',
      profilePic: profilePic || 'https://lh3.googleusercontent.com/yZuQ9Fwz8PcHGMn1yKivsy3wf3x3AzUJzrwQ2XumqHN-DeJV31CFuBjDRlvv_YuRuHmcLhdRRHgjg71vja6Jw6sWrmn43aD_',
      mobileNo: mobileNo || null,
      modalIsOpen: false,
      selectedFile: null,
      isImageUploadInProgress: false,
      changeColor: false,
      disableSubmitBtn: true
    }
    this.handeChange = this.handeChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
    this.openImgUpload = this.openImgUpload.bind(this);
    this.handleProfileUpload = this.handleProfileUpload.bind(this);
    this.uploadHandler = this.uploadHandler.bind(this);
    this.showImage = this.showImage.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.validateForm = this.validateForm.bind(this);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    // addEventListener on enter button
    document.addEventListener('keypress', this.handleEnter, false);
  }

  componentWillUnmount() {
    // removeEventListener on enter button
    document.removeEventListener('keypress', this.handleEnter, false);
  }

  // on press of any button it will validate that key pressed should be a number type only else it block that character
  handleKeyPress(e) {
        var a = [];
        var k = e.which;
				var regex = new RegExp("^[0-9a-zA-Z \b]+$");
        for (var i = 48; i < 58; i++){
					if(/[a-z0-9]/i.test(String.fromCharCode(e.charCode || e.keyCode))
                    || !!(!e.charCode && ~[8,37,39,46].indexOf(e.keyCode))){
											a.push(i);
										}
				}
        if (!(a.indexOf(k)>=0))
            e.preventDefault();
  }

  handleClose() {
    this.setState({ modalIsOpen: false });
  }

  handleShow() {
    this.setState({ modalIsOpen: true });
  }

  handeChange(e){
    this.setState({
      [e.target.name]: e.target.value,
      disableSubmitBtn: false
    })
  }

  handleEnter(e){
    if (e.keyCode === 13) {
      this.handleSubmit(e);
    }
  }

  handleSubmit(e){
    e.preventDefault();
    const { dispatch } = this.props;
    console.log('submit form ', this.state);
    const userObj = this.state;
    this.validateForm()
    .then((res) => {
      dispatch(updateUserProfileInfo(userObj))
    })
    .catch((err) => {
      console.dir('You can\'t leave any box');
    })
  }

  validateForm(){
    const { firstName, lastName, age, sex, profilePic, mobileNo } = this.state;
    return new Promise((resolve, reject) => {
      if(firstName && lastName && age && sex && mobileNo && profilePic){
        return resolve(true);
      } else {
        reject(false);
      }
    })
  }

  openImgUpload(e){
    $('#imgupload').trigger('click');
  }

  handleProfileUpload(event){
    let file =  event && event.target && event.target.files[0];
    if(file){
      this.showImage(file)
      .then((res) => {
        this.handleShow()
      })
      .catch((err) => {
        console.log('err ', err);
      })
    }
  }

  uploadHandler = () => {
    let that = this;
    var imageUrl = 'http://localhost:8080/image-upload'
    var blobBin = atob(that.state.profilePic.split(',')[1]);
    var array = [];

    const { dispatch } = this.props; 
    for(var i = 0; i < blobBin.length; i++) {
        array.push(blobBin.charCodeAt(i));
    }
    var file=new Blob([new Uint8Array(array)], {type: 'image/png'});
    file.name = that.state.selectedFile.name;
    file.lastModified = that.state.selectedFile.lastModified;
      var form = new FormData();
      form.append("image", file, (file.name.substr(0, file.name.lastIndexOf('.')) || file.name) +'-'+ Date.now()+'.png');
      $.ajax({
           url: imageUrl,
           type: 'POST',
           data: form,
           dataType: 'json',
           xhr: function() {
             var xhr = new window.XMLHttpRequest();
             xhr.upload.addEventListener("progress", function(evt) {
               if (evt.lengthComputable) {
                 // For Progress bar
               }
             }, false);
             return xhr;
           },
           processData: false,
           contentType: false,
           success: function(data){
            let uploadImageUrl = data.imageUrl;
            var obj = {
              profilePic: uploadImageUrl
            }
            dispatch(updateUserProfileImg(obj))
              that.setState({
                profilePic: uploadImageUrl,
                isImageUploadInProgress: false,
                disableSubmitBtn: false
              }, function(){
                that.handleClose();
              })
           },
           error: function(err){
             that.setState({
               isImageUploadInProgress: false
             })
             console.log('error while image upload:- ',err);
           }
         });
  }

  showImage = (file) => {
    return new Promise((resolve, reject) => {
      if(file){

        var reader = new FileReader();
        var url = reader.readAsDataURL(file);
        reader.onloadend = function (e) {
          this.setState({
              profilePic: reader.result,
              selectedFile: file
          }, function(){
              return resolve(true);
          })
        }.bind(this);
      } else {
        return reject('No file selected')
      }
    })
  }

  updateCroppedImage(dataUrl){
    let that = this;
    this.setState({
      isImageUploadInProgress: true,
      profilePic: dataUrl
    }, function(){
      this.uploadHandler()
    })
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps){
      const color = this.state.changeColor;
      this.setState({
        changeColor: !color
      })
    }
  }

  render() {
    console.log('profile form');
  const imageUrl = 'http://www.skywardimaging.com/wp-content/uploads/2015/11/default-user-image.png';
  return (
    <div className="profile_form">
        <PopUp
          {...this.state}
          handleShow={this.handleShow.bind(this)}
          handleClose={this.handleClose.bind(this)}
          updateCroppedImage={this.updateCroppedImage.bind(this)}
        />
      <div className="profile_title">Profile</div>
      <div className="profile_image">
        <img name="image" onClick={(e) => this.openImgUpload(e)} src={this.state.profilePic || imageUrl} width="80" height="80" />
         <input type="file" name="image" id="imgupload" onChange={(e) => this.handleProfileUpload(e)} style={{ display: 'none'}}/>
      </div>
      <div className="profile_subdescription">
        <div>Adding a profile pic helps class participants and  </div>
        <div>other members get an idea of who you are.</div>
      </div>
      <div className="">
        <p className="label_text">First Name</p>
        <input
          className={this.state.firstName ? "label_input" : "label_input_error"}
          type="text"
          name="firstName"
          onChange={(e) => this.handeChange(e)}
          value={this.state.firstName}
          placeholder="John"
          id="inputFirstname"
        />
      </div>

      <div className="">
        <p className="label_text">Last Name</p>
        <input
          className={this.state.lastName ? "label_input" : "label_input_error"}
          type="text"
          placeholder="Smith"
          id="inputLastname"
          name="lastName"
          value={this.state.lastName}
          onChange={(e) => this.handeChange(e)}
        />
      </div>

      <div className="">
        <p className="label_text">Age</p>
        <input
          className={this.state.age ? "label_input" : "label_input_error"}
          type="tel"
          placeholder="36"
          maxLength={3}
          id="age"
          name="age"
          value={this.state.age}
          onChange={(e) => this.handeChange(e)}
        />
      </div>

      <div className="">
        <p className="label_text">Sex</p>
        <select
          className={this.state.sex ? "label_input" : "label_input_error"}
          id="sex"
          name="sex"
          value={this.state.sex}
          onChange={(e) => this.handeChange(e)}
        >
          <option value="1">Male</option>
          <option value="2">Female</option>
        </select>
      </div>

      <div className="">
        <p className="label_text">Email</p>
        <input
          className={this.state.email ? "label_input" : "label_input_error"}
          type="email"
          readOnly
          placeholder="john@gmail.com"
          id="email"
          name="email"
          value={this.state.email}
          onChange={(e) => this.handeChange(e)}
        />
      </div>

      <div className="">
        <p className="label_text">Mobile</p>
           <input
             className={this.state.mobileNo ? "label_input" : "label_input_error"}
             type="tel"
             id="mobileNo"
             name="mobileNo"
             maxLength={15}
             value={this.state.mobileNo}
             onKeyPress={this.handleKeyPress}
             onChange={(e) => this.handeChange(e)}
           />
      </div>

      <div>
        <button disabled={this.state.disableSubmitBtn} className={this.state.changeColor ? "profile_btn_grey" : "profile_btn"} onClick={(e) => this.handleSubmit(e)}>Save Changes</button>
      </div>
    </div>
  );
  }
}

ProfileForm.propTypes = propTypes;

export default ProfileForm;
