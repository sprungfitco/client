import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Notifications, {notify} from 'react-notify-toast';
import { getTrainerInfo, updateTrainerBio, addExpertise, addSkill, deleteSkill, deleteExpertise } from '../actions/editTrainer';
import { updateUserProfileImg } from '../actions/profileActions';
import $ from 'jquery';
import PopUp from './PopUp';
// import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';
import { classCategories } from '../constants/ClassCategories';

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  userProfileInfo: PropTypes.object.isRequired,
  trainerBio: PropTypes.object.isRequired
}

const categories = [
  { key: 1, name : 'Yoga' },
  { key: 101, name : 'Meditation' },
  { key: 201, name : 'Dance' }
  //{ key: 301, name : 'Exercise' }
]

const skillLevels = [
  { key: 1, name :'Beginner' },
  { key: 2, name : 'Intermediate' },
  { key: 3, name: 'Advanced' }
]

const yogaExpertise = [
  { key: 11, name: 'Hatha Yoga' },
  { key: 12, name: 'Kundalini Yoga' },
  { key: 13, name: 'Fast Yoga' }];

const meditationExpertise = [
  { key: 102, name: 'Tm Meditation' }
];

const danceExpertise = [
  { key: 201, name: 'Dance' },
  { key: 202, name: 'Hip Hop' },
  { key: 203, name: 'Zumba' }
];

const exerciseExpertise = [
  { key: 301, name: 'Cardio' },
  { key: 302, name: 'Hiit' }
];



class ExpertiseSkillLevel extends Component {
  constructor(props){
    super(props);
    this.state = { selectedSkillLevel: '' }

  }

  handleSkillLevelClick = (selectedSkillLevel) => {
    this.setState ({ selectedSkillLevel });
  }

  handleAddSkillLevelClick() {
    this.props.handleSkillLevelSelection(this.state.selectedSkillLevel);
  }

  render() {
    return (
      <div className="edittrainer__details_item">
        <div className="edittrainer__details_item_label">Your skill level</div>
          <div className="edittrainer__skillLevel_pill_container"> 
            {/* {skillLevels.map(field =>
              (<div 
                className={ "edittrainer__pill edittrainer__pill_skillLevel" +
                (this.state.selectedSkillLevel.key === field.key
                  ? " edittrainer__pill_skillLevel_selected "
                  : "") }
                onClick={this.handleSkillLevelClick.bind(this, field)}>
                {field.name}
              </div>))
            } */}
            <div 
                className={ 
                (this.state.selectedSkillLevel !== ''
                  ? "edittrainer__pill edittrainer__pill_add_remove_skills"
                  : "hidden") }
                onClick={this.handleAddSkillLevelClick.bind(this)}>
                Add to my skills
            </div>
          </div>
      </div>
    )}
};

class EditTrainer extends Component {
  constructor(props){
    super(props);
    this.state = {
      description: '',
      favoriteThings: '',
      profilePic: '',
      areasOfExpertise: [],
      selectedCategory: '',
      expertise: [],
      selectedExpertise: {},
      showSkillLevels: false,
      isImageUploadInProgress: false
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.uploadHandler = this.uploadHandler.bind(this);
    this.updateCroppedImage = this.updateCroppedImage.bind(this);
    this.openImgUpload = this.openImgUpload.bind(this);
    this.showImage = this.showImage.bind(this);
  }

  componentWillMount() {
    const { dispatch } = this.props;
    const { id } = this.props.userProfileInfo;
    dispatch(getTrainerInfo(id));
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.trainerBio){
      const { description, favoriteThings, profilePic, areasOfExpertise } = nextProps.trainerBio; 
     
      this.setState({
        description,
        favoriteThings,
        profilePic,
        areasOfExpertise
      })
    }
  }

  openImgUpload(e){
    $('#imgupload').trigger('click');
  }

  handleChange(e){
    const name = e.target.name;
    const value = (e.target.value);
    this.setState({
      [name]: value === "null" ? "" : value
    });
  }

  handleSubmit(e){
    e.preventDefault();
    const { dispatch } = this.props;
    const { id } = this.props.userProfileInfo;
    const trainerInfo = this.state;
    dispatch(updateTrainerBio(trainerInfo, id));
  }

  handleCategoryClick(selectedCategory) {
    this.setState ({ selectedCategory :  selectedCategory.key});
   
    this.setState ( {
      expertise : this.getExpertise(selectedCategory.name)
    });

    // Toggle display of expertise skill levels window
    this.setState ( {
      showSkillLevels : false
    });
  }

  handleExpertiseClick = (selectedExpertise) => {
    this.setState ({ selectedExpertise });

    // Toggle display of expertise skill levels window
    this.setState ( {
      showSkillLevels : true
    });
    
  }

  handleSkillLevelSelection(selectedSkillLevel) {
    
    const newElement = {
      areaOfExpertise : this.state.selectedCategory,
      skill: this.state.selectedExpertise.name,
      skillLevel : selectedSkillLevel
    };

    // Toggle display of expertise skill levels window
    this.setState ( {
      showSkillLevels : false,
      selectedExpertise: {}
    });

    const { dispatch } = this.props;
    const { id } = this.props.userProfileInfo;
    const trainerExpertise = this.state.areasOfExpertise;
    
    let addedExpertises = trainerExpertise.filter(expertise =>
      expertise.areaOfExpertise === newElement.areaOfExpertise
    );

    // Add area of expertise first if not previously added
    if(addedExpertises.length === 0) {
      dispatch(addExpertise(newElement.areaOfExpertise, id)).then(() => {
        dispatch(addSkill(newElement, id));
      })
    }
    else { // check if the skill is already added
      let addedSkills = trainerExpertise.filter(expertise =>
        expertise.skills.some(skill =>
        skill === newElement.skill)
      );
  
      if(addedSkills.length === 0) {
        dispatch(addSkill(newElement, id));
      }
    }
    
  }

  handleRemoveExpertise(areaOfExpertise, skill) {
    const { dispatch } = this.props;
    const { id } = this.props.userProfileInfo;

    dispatch(deleteSkill(areaOfExpertise, skill, id));
  }


  getExpertise(category) {
    switch (category) {
      case 'Yoga':
        return yogaExpertise;
      case 'Meditation':
        return meditationExpertise;
      case 'Dance':
        return danceExpertise;
      case 'Exercise':
        return exerciseExpertise;
      default:
        return yogaExpertise;
    }

    this.setState ( {
      expertise : expertiseAvailable
    });
  }

  getSkillLevel(skillLevel) {
    switch (skillLevel) {
      case 1:
        return 'Beginner';
      case 2:
        return 'Intermediate';
      case 3:
        return 'Advanced';
      }
  }
  

  uploadHandler = () => {
    let that = this;
    const { dispatch } = this.props;
    var imageUrl = 'http://localhost:8080/image-upload'
    var blobBin = atob(that.state.profilePic.split(',')[1]);
    var array = [];
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
             console.log('sucees iamg upload:- ',data.imageUrl);
             let uploadImageUrl = data.imageUrl;
             var obj = {
               profilePic: uploadImageUrl
             }
             dispatch(updateUserProfileImg(obj))
              that.setState({
                profilePic: uploadImageUrl,
                isImageUploadInProgress: false,
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

  handleClose() {
    this.setState({ modalIsOpen: false });
  }

  handleShow() {
    this.setState({ modalIsOpen: true });
  }
  
  render() {
    const { userProfileInfo } = this.props;
    const { firstName, lastName } = userProfileInfo;
    
    return (
      <div className="edittrainer__form">
        <Notifications />
          <PopUp
            {...this.state}
            handleShow={this.handleShow.bind(this)}
            handleClose={this.handleClose.bind(this)}
            updateCroppedImage={this.updateCroppedImage.bind(this)}
          />
        <div className="edittrainer__container">
          <div className="edittrainer__pic">
            <div className="edittrainer__photo">
              <img
                src={this.state.profilePic || "https://www.iconsdb.com/icons/preview/color/00D69D/screenshot-xxl.png"}
                width="250"
                height="250"
              />
            </div>
            <input type="file" name="image" id="imgupload" onChange={(e) => this.handleProfileUpload(e)} style={{ display: 'none'}}/>
            <button onClick={(e) => this.openImgUpload(e)}  className="edittrainer__uploadBtn">Upload a picture</button>
          </div>
          <div className="edittrainer__details">
            <div className="edittrainer__subtext edittrainer__submargin">
              This page is seen by users to know more about you when they book a
              class with you.
            </div>
            <div className="edittrainer__username">
              {firstName} {lastName}
            </div>
            <div className="edittrainer__text">About me</div>
            <textarea
              className="edittrainer__textarea"
              rows="3"
              name="description"
              value={this.state.description || ''}
              onChange={(e) => this.handleChange(e)}
              placeholder="Write a bit about yourself"
            />
            <div className="edittrainer_cmtwrapper">
              <button className="edittrainer__saveBtn" onClick={(e) => this.handleSubmit(e)}>Save</button>
            </div>

            <div className="edittrainer__text edittrainer__topmargin">
              Favorite things
            </div>
            <textarea
              className="edittrainer__textarea"
              rows="2"
              name="favoriteThings"
              value={this.state.favoriteThings || ''}
              onChange={(e) => this.handleChange(e)}
              placeholder="Things you love"
            />
            <div className="edittrainer_cmtwrapper">
              <button className="edittrainer__saveBtn" onClick={(e) => this.handleSubmit(e)}>Save</button>
            </div>
            <div className="edittrainer_expertise edittrainer__topmargin">
              <span className="edittrainer__text">Your Expertise</span>
              <span className="edittrainer__subtext edittrainer__submargin">
                Tell us a bit about the categories you specialize in.
              </span>
              <div> 
                  <div className="edittrainer__details_item">
                    <div></div>
                    <div className="edittrainer__pill_container">
                      {categories.map(field =>
                        (
                        <div 
                        className={ "edittrainer__pill edittrainer__pill_category" +
                        (this.state.selectedCategory === field.key
                          ? " edittrainer__pill_category_selected "
                          : "") }
                        onClick={this.handleCategoryClick.bind(this, field)}>
                        {field.name}
                        </div>))
                      }
                    </div>
                  </div>
                  <hr></hr>
                  <div className="edittrainer__details_item">
                    <div className="edittrainer__details_item_label">Pick your specialization</div>
                      <div className="edittrainer__pill_container"> 
                        {this.state.expertise.map(field =>
                          (<div 
                            className={ "edittrainer__pill edittrainer__pill_subCategory" +
                            (this.state.selectedExpertise.key === field.key
                              ? " edittrainer__pill_subCategory_selected "
                              : "") }
                            onClick={this.handleExpertiseClick.bind(this, field)}>
                            {field.name}
                          </div>))
                        }
                      </div>
                  </div>
                  { this.state.showSkillLevels 
                    ? <ExpertiseSkillLevel handleSkillLevelSelection = {this.handleSkillLevelSelection.bind(this)}/> 
                    : null }
                  <hr></hr>
                  <div className="edittrainer__details_item">
                    <div className="edittrainer__details_item_label">Your saved skills</div>
                    <div className="edittrainer__pill_container">
                      
                      {this.state.areasOfExpertise.map((expertise) =>
                      <div className="edittrainer__pill_container">
                        {expertise.skills.map((field) =>
                          <div>
                            <div 
                              className="edittrainer__pill 
                              edittrainer__pill_subCategory 
                              edittrainer__pill_subCategory_selected">
                              {field.skill}
                            </div>
                            <div 
                              className="edittrainer__pill 
                              edittrainer__pill_skillLevel
                              edittrainer__pill_skillLevel_selected">
                              {this.getSkillLevel(field.skillLevel)}
                            </div>
                            <div 
                              className="edittrainer__pill 
                              edittrainer__pill_add_remove_skills"
                              onClick={this.handleRemoveExpertise.bind(
                                  this, 
                                  expertise.areaOfExpertise, 
                                  field.skill)}>
                              Remove
                            </div>
                          </div>
                        )}
                      </div>
                      )}
                    </div>
                  </div>
              </div>
              </div>
              <hr></hr>
            </div>
          </div>
        </div>
    );
  }
}

export default EditTrainer;
