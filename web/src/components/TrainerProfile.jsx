import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TrainerDateItem from './TrainerDateItem';
import moment from 'moment';
import PopUp from './PopUp';
import $ from 'jquery';
import { updateUserProfileImg } from '../actions/profileActions';
import { getCategories, getServiceList, getSubCategories } from '../actions/TrainersActions';
import { fetchInstructorCalendar, 
         getInstructorReviews,
         updateTrainerBio,
         addExpertise, 
         addSkill, 
         deleteSkill, 
         deleteExpertise,
         addInstructorServices,
         deleteInstructorServices } from '../actions/trainerProfileAction';


const propTypes = {
  dispatch: PropTypes.func.isRequired,
  userProfileInfo: PropTypes.object.isRequired,
  trainerProfile: PropTypes.object.isRequired,
  trainerReviews: PropTypes.object.isRequired,
  instructorCal: PropTypes.object.isRequired,
  categories: PropTypes.array.isRequired,
  services: PropTypes.array.isRequired
};


class TrainerProfile extends Component {
  constructor(props) { 
    super(props);
    this.state = {
      isLoaded: false,
      isCalendarLoaded: false,
      isReviewsFetched: false,
      isCategoriesFetched: false,
      isServicesFetched: false,
      isEditMode: false,
      isImageUploadInProgress: false,
      description: '',
      favoriteThings: '',
      profilePic: '',
      description:'',
      firstName:'',
      lastName:'',
      instructorRating:0,
      areasOfExpertise:[],
      totalExperience:0,
      instructorServices:[],
      instructorId: 0,
      subCategories:[],
      selectedServicesList: [],
      currentMeetingUrl:''
    };

  }

  componentWillReceiveProps(nextProps) {
    let that = this;
    const { trainerProfile, userProfileInfo, dispatch } = nextProps;
    const isLoaded = this.state.isLoaded;

    if(trainerProfile){
      const { 
        description, 
        favoriteThings,
        firstName,
        lastName,
        instructorRating,
        areasOfExpertise,
        totalExperience,
        instructorServices,
        instructorId
      } = trainerProfile; 
     
      this.setState({
        description,
        favoriteThings,
        firstName,
        lastName,
        instructorRating,
        areasOfExpertise,
        totalExperience,
        instructorServices,
        instructorId
      });
    }

    if(userProfileInfo) {
      const { profilePic } = userProfileInfo;
      this.setState({ profilePic });
    }

    if(!nextProps.categories && !this.state.isCategoriesFetched) {
      this.setState({isCategoriesFetched: true});
      dispatch(getCategories());
    }

    if(!nextProps.services && !this.state.isServicesFetched) {
      this.setState({isServicesFetched: true});
      dispatch(getServiceList());
    }

    if(nextProps.subCategories) {
      let subCategoriesList = nextProps.subCategories.categories;
      const filteredArr = subCategoriesList.filter(subCategory => {
        return subCategory === 'Other';
      });

      if(filteredArr.length === 0) {
        subCategoriesList.push('Other');
      }
      this.setState ( {subCategories: subCategoriesList} )
    }

    if (nextProps && nextProps.trainerProfile.instructorId) {
      if(!that.state.isCalendarLoaded) {
        this.setState({
          isCalendarLoaded: true
        }, function () {
          that.fetchCalendar(nextProps)
        });
      }

      if(!this.state.isReviewsFetched) {
        this.setState({
          isReviewsFetched: true
        }, function () {
          that.isReviewsFetched(nextProps.trainerProfile.instructorId)
        });
      }
      
    }

    this.baseState = this.state;

  }

  fetchCalendar(nextProps) {
    const { dispatch } = this.props;
    dispatch(fetchInstructorCalendar(
      nextProps.trainerProfile.instructorId,
      moment().format('YYYY-MM-DD'),
      new Date().getTimezoneOffset()
    ))
  }

  isReviewsFetched(instructorId) {
    const { dispatch } = this.props;
    dispatch(getInstructorReviews(instructorId))
  }

  getCategoryName(categoryId) {
    const categories = this.props.categories;
    
    const categoryName = categories.categories.filter(category => {
      return (category.id === categoryId);
    });

    return categoryName[0].name;
  }

  getServiceTypeName(serviceType) {
    const services = this.props.services;
    
    const serviceTypeName = services.categories.filter(service => {
      return (service.serviceType === serviceType);
    });

    return serviceTypeName[0].serviceLabel;
  }

  handleChange(e){
    const name = e.target.name;
    let value = (e.target.value);

    if(name === 'totalExperience') {
      value = parseInt(value);
      if(!value || isNaN(value)) {
        value = 0;
      }
    }
    this.setState({
      [name]: value === "null" ? "" : value
    });
  }


  editProfile = (isEditMode) => {
    this.setState ( {isEditMode} )
  }

  bookClass(state) {
    let query = {
      topic: `First Meeting for ${state.firstName + ' ' + state.lastName}`
    }
    fetch('http://localhost:8080/createMeeting',{
          method: 'POST',
          body: JSON.stringify(query),
        }).then(res=>res.json()).then(res=>{
          console.log('this is create Meeting response ' + res);
          this.setState({currentMeetingUrl: res.join_url})
        }).catch(console.log);
        console.log('from trainer profile');
  };

  saveChanges() {
    const trainerInfo = {
      description: document.getElementById("description").value,
      favoriteThings: document.getElementById("favoriteThings").value,
      totalExperience: document.getElementById("totalExperience").value
    }

    trainerInfo.description = !trainerInfo.description || 
      trainerInfo.description !== "null"  ?
      trainerInfo.description : "";

    trainerInfo.favoriteThings = !trainerInfo.defavoriteThingsscription || 
      trainerInfo.favoriteThings !== "null"  ?
      trainerInfo.favoriteThings : "";


    trainerInfo.totalExperience = !parseInt(trainerInfo.totalExperience) || 
      !isNaN(parseInt(trainerInfo.totalExperience))  ?
       parseInt(trainerInfo.totalExperience) : 0;
    

    const { dispatch } = this.props; 
    dispatch(updateTrainerBio(trainerInfo, this.state.instructorId)); 
    this.editProfile(false);
  }

  cancelChanges() {
    // Discard un-saved changes
    this.setState ({ description : this.baseState.description });
    this.setState ({ favoriteThings : this.baseState.favoriteThings});
    this.setState ({ totalExperience : this.baseState.totalExperience});
    this.editProfile(false);
  }

  removeExpertise(areaOfExpertise) {
    const { dispatch } = this.props;
    const { id } = this.props.userProfileInfo;

    dispatch(deleteExpertise(areaOfExpertise, id));
  }

  addExpertise() {
    const { dispatch } = this.props;
    const { id } = this.props.userProfileInfo;
    const trainerExpertise = this.state.areasOfExpertise;
    let selectedExpertise = document.getElementById("addExpertise").value;

    if(selectedExpertise !== "") {
      selectedExpertise = parseInt(selectedExpertise);
     
      let experience= parseInt(document.getElementById("expertiseExperience").value);
      experience = (!experience || isNaN(experience)) ? 1 : experience;

      let addedExpertises = trainerExpertise.filter(expertise =>
        expertise.areaOfExpertise === selectedExpertise
      );

      // Add area of expertise first if not previously added
      if(addedExpertises.length === 0) {
        dispatch(addExpertise(selectedExpertise, experience, id));
      }
      else {
        alert('Expertise is already added to your profile');
      }
      
    }
    else {
      alert ("No expertise category name was given !")
    }
    
  }

  removeSubSkill(areaOfExpertise, skill) {
    const { dispatch } = this.props;
    const { id } = this.props.userProfileInfo;

    dispatch(deleteSkill(areaOfExpertise, skill, id));
  }

  addSkill() {
    const { dispatch } = this.props;
    const { id } = this.props.userProfileInfo;
    const trainerExpertise = this.state.areasOfExpertise;

    const selectedExpertise = parseInt(document.getElementById("addExpertise").value);
    let selectedSkill = document.getElementById("addSkill").value;

    if(selectedSkill === 'Other') {
      selectedSkill =  document.getElementById('customSkill').value;
    }

    if(selectedSkill !== "") {

      let addedExpertises = trainerExpertise.filter(expertise =>
        expertise.areaOfExpertise === selectedExpertise
      );

      // Add area of expertise first if not previously added
      if(addedExpertises.length === 0 || selectedExpertise === '') {
        alert('Please add expertise first');
      }
      else {
        const addedSkills = addedExpertises[0].skills.filter(skill => 
           skill.skill === selectedSkill
        );

        if(addedSkills.length > 0) {
          alert("Skill has already been added.")
        }
        else {
          dispatch(addSkill(selectedExpertise, selectedSkill, id));
          document.getElementById("addSkill").value = "";
          document.getElementById("customSkill").value = "";
          document.getElementById("customSkill").classList.add("hidden");
        }
      }
    }
    else {
      alert('No expertise given !')
    }

  }

  addService() {
    const { dispatch } = this.props;
    const{ id } = this.props.userProfileInfo;
    let isServiceAdded = false;

    const selectedServiceType = parseInt(document.getElementById("serviceLabel").value);
    let selectedService = document.getElementById("serviceName").value;

    
    const addedServices = this.state.instructorServices.filter (service => {
      return service.serviceType === selectedServiceType;
    });

    if(addedServices.length > 0) {
      const arr = addedServices[0].services.filter(service => {
        return service === selectedService;
      }); 

      if(arr.length > 0) {
        isServiceAdded = true;
      }

    }
    
    if(!isServiceAdded) {

      if(selectedService === 'Other') {
        selectedService =  document.getElementById('customServiceName').value;
      }

      if(selectedServiceType !== "" && selectedService !== "") {
        dispatch(addInstructorServices(selectedServiceType, selectedService, id));
        document.getElementById("serviceName").value = "";
        document.getElementById("customServiceName").value = "";
        document.getElementById("customServiceName").classList.add("hidden");
      }
      else {
        alert("No service name given !")
      }
    }
    else {
      alert('Service name is already added');
    }

  }

  removeService(serviceName) {
    const { dispatch } = this.props;
    const{ id } = this.props.userProfileInfo;

    dispatch(deleteInstructorServices(serviceName, id));
  }

  handleCategorySelection() {
    const { dispatch } = this.props;
    const selectedExpertise = document.getElementById("addExpertise").value;

    if(selectedExpertise !== "") {
      dispatch(getSubCategories(parseInt(selectedExpertise)));
    }
    else {
      this.setState ( {subCategories: []} )
    }

    document.getElementById("addSkill").value = "";
    document.getElementById("customSkill").value = "";
    document.getElementById("customSkill").classList.add("hidden");
  }

  handleSkillSelection() {
    const selectedSkill = document.getElementById("addSkill").value;
    const inputElm = document.getElementById("customSkill");
    inputElm.classList.remove("hidden");

    if(selectedSkill === "Other") {
      inputElm.classList.remove("hidden");
    } else {
      inputElm.classList.add("hidden");
    }
  }

  handleServiceSelection() {
    const selectedService = document.getElementById("serviceLabel").value;

    if(selectedService !== "") {
      const serviceList = (this.props.services.categories.filter(service => {
        if(service.serviceType === parseInt(selectedService)) {
          return service;
        }
      }))[0];

      const includedServices = serviceList.includedServices;

      const filteredArr = includedServices.filter(service => {
        return service === 'Other';
      });

      if(filteredArr.length === 0) {
        includedServices.push('Other');
      }

      this.setState ( { selectedServicesList : serviceList.includedServices } );
    }
    else {
      this.setState ( { selectedServicesList : [] } );
    }

    document.getElementById("serviceName").value = "";
    document.getElementById("customServiceName").value = "";
    document.getElementById("customServiceName").classList.add("hidden");
  }

  handleIncludedServiceSelection() {
    const selectedServiceName = document.getElementById("serviceName").value;
    const inputElm = document.getElementById("customServiceName");
    inputElm.classList.remove("hidden");

    if(selectedServiceName === "Other") {
      inputElm.classList.remove("hidden");
    } else {
      inputElm.classList.add("hidden");
    }
  }


  uploadPhoto() {
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
        console.log('error occured when trying to open the image ', err);
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

  handleClose() {
    this.setState({ modalIsOpen: false });
  }

  handleShow() {
    this.setState({ modalIsOpen: true });
  }

  render() {
    
    if (this.props.userProfileInfo && this.props.trainerReviews &&
      this.props.categories && this.props.services) {
      const { 
        userProfileInfo,
        trainerReviews,
        instructorCal,
        dispatch
      } = this.props;
      
      const {
        id
      } = userProfileInfo;

      let { categories, services } = this.props; 
      let topCategories, subCategories;
      if(categories) {
        topCategories = categories.categories.filter(category => {
          if(category.topCategory) {
            return category;
          }
        });

        subCategories = categories.categories.filter(category => {
          if(!category.topCategory) {
            return category;
          }
        });
      }
      
      return (
        <div>
          <PopUp
            {...this.state}
            handleShow={this.handleShow.bind(this)}
            handleClose={this.handleClose.bind(this)}
            updateCroppedImage={this.updateCroppedImage.bind(this)}
          />
          <div className={ 
            (this.state.isEditMode
              ? " row margin-top-25px"
              : " hidden ")}>
            <div className="col offset-md-3 col-lg-6 padding-bottom-20px">
                <div className="width-100-p green_border_container">
                  <div className="width-auto margin-top-8px">
                      Edit your profile
                  </div>
                    <button className=" btn btn-default small-green-btn float-right" role="button"
                      onClick={this.saveChanges.bind(this)}>
                      Save
                    </button>
                    <button className=" btn btn-default sub_tag float-right " role="button"
                      onClick={this.cancelChanges.bind(this)}>
                      Cancel
                    </button>
                  </div>
                </div>
            </div>
            <div className={ 
                    (this.state.isEditMode
                      ? " row "
                      : " hidden ")}>>
              <div className="col offset-md-3 col-lg-6 border-bottom-title padding-bottom-20px">
              <div className="float-left ">
                  <img className="trainer_profile_page_profile_pic" 
                    src={
                      this.state.profilePic ||
                      "images/default-user-image.png"
                  }/>
                  <div className="trainer_profile_page_profile_stuff_container conten_font margin-top-6px margin-left-25px">
                      Adding a photo helps others get an idea of who you are before participating in your classes.
                  </div>
              </div>
              <div className="float-right">
                <input type="file" accept="image/*" name="image" id="imgupload" onChange={(e) => this.handleProfileUpload(e)} style={{ display: 'none'}}/>
                <button className=" btn btn-default sub_tag margin-top-8px" role="button"
                  onClick={this.uploadPhoto.bind(this)}>
                  Upload Photo
                </button>   
              </div>
              </div>
            
            </div>
          <div className={ 
                    (this.state.isEditMode
                      ? " hidden "
                      : " row margin-top-25px")}>
            <div className="col offset-md-3 col-lg-6 border-bottom-title padding-bottom-20px">
              <div className="float-left ">
                <img className="trainer_profile_page_profile_pic" 
                src={
                  this.state.profilePic ||
                  "images/default-user-image.png"
                }/>
                <div className="trainer_profile_page_profile_stuff_container margin-left-25px">
                  <div className="float-left  trainer_profile_page_trainer_title">
                    {this.state.firstName} {this.state.lastName}
                  </div>
                  <div className="clearfix"></div>
                  <div className="float-left conten_font">{
                    this.state.totalExperience ? this.state.totalExperience : 0} Years Experience</div>
                  <div className="clearfix"></div>
                  <div className={ 
                    ( Object.keys(trainerReviews).length > 3
                      ? " float-left "
                      : " hidden ")}>
                    <div className="star">
                      <img src={
                          Math.max(1,this.state.instructorRating) === this.state.instructorRating
                          ? "images/star-green.svg"
                          : "images/star-gray.svg"} />
                    </div>
                    <div className="star">
                      <img src={
                          Math.max(2,this.state.instructorRating) === this.state.instructorRating
                          ? "images/star-green.svg"
                          : "images/star-gray.svg"} />
                    </div>
                    <div className="star">
                      <img src={
                          Math.max(3,this.state.instructorRating) === this.state.instructorRating
                          ? "images/star-green.svg"
                          : "images/star-gray.svg"} />
                    </div>
                    <div className="star">
                      <img src={
                          Math.max(4,this.state.instructorRating) === this.state.instructorRating
                          ? "images/star-green.svg"
                          : "images/star-gray.svg"} />
                    </div>
                    <div className="star">
                      <img src={
                        Math.max(5,this.state.instructorRating) === this.state.instructorRating
                        ? "images/star-green.svg"
                        : "images/star-gray.svg"} />
                    </div>
                    <a href="#" className="trainers-tag-plus">{this.state.instructorRating}/5</a>
                  </div>
                </div>
              </div>
              <div className="float-right">
                <button 
                  className= { 
                    (this.state.instructorId !== id
                      ? " btn btn-default big-green-btn margin-top-25px "
                      : " hidden ")} 
                  role="button"
                  onClick={this.bookClass.bind(this, this.state)}>
                  Book a Class
                </button>
                <button 
                  className={ 
                    (this.state.instructorId === id
                      ? " btn btn-default big-green-btn margin-top-25px "
                      : " hidden ")}
                  role="button"
                  onClick={this.editProfile.bind(this, true)}>
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
          <div className="row margin-top-25px">
            <div className="col offset-md-3 col-lg-2 conten_title_font">
              About {this.state.currentMeetingUrl.length > 0 ? <a target="_blank" href={this.state.currentMeetingUrl}>Click to Join Meeting</a>:""}
            </div>
            <div className={ 
                    (this.state.isEditMode
                      ? " hidden "
                      : " col col-lg-4 conten_font ")}>
              {this.state.description}
            </div>
            <div className={ 
                    (this.state.isEditMode
                      ? " col col-lg-4 conten_font "
                      : " hidden ")}>
              <textarea className="form-control" id="description" rows="3" maxLength="2000"
                name="description"
                onChange={(e) => this.handleChange(e)}
                value={this.state.description}>
              </textarea>
            </div>
          </div>

          <div className={ 
                    (this.state.isEditMode
                      ? " row margin-top-25px "
                      : " hidden ")}>
            <div className="col offset-md-3 col-lg-2 conten_title_font">
                Total Years of Experience
            </div>
            <div className={ 
                    (this.state.isEditMode
                      ? " col col-lg-4 conten_font "
                      : " hidden ")}>
              <input type="number" className="form-control" id="totalExperience"
                name="totalExperience"
                min="0"
                max="50"
                onChange={(e) => this.handleChange(e)}
                value={this.state.totalExperience}/>
            </div>
          </div>
          <div className="row margin-top-45px ">
            <div className="col offset-md-3 col-lg-2 conten_title_font">
              Favorite Things
            </div>
            <div className={ 
                    (this.state.isEditMode
                      ? " hidden "
                      : " col col-lg-4 conten_font ")}>
              {this.state.favoriteThings}
            </div>
            <div className={ 
                    (this.state.isEditMode
                      ? " col col-lg-4 conten_font "
                      : " hidden ")}>
              <textarea className="form-control" id="favoriteThings" 
                rows="3" maxLength="2000"
                onChange={(e) => this.handleChange(e)}
                name="favoriteThings"
                value={this.state.favoriteThings}>
              </textarea>
            </div>
          </div>
          <div className="row margin-top-45px">
            <div className="col offset-md-3 col-lg-6">
              <div className="width-100-p conten_title_font">Specializations</div>
              {this.state.areasOfExpertise.map(expertise =>
                <div className="width-100-p margin-top-18px">
                  <div className="trainer_profile_page_specializes_tag">
                     <div className="width-auto">
                      <div className="trainer_profile_page_specializes_tag_title_font">
                        { this.getCategoryName(expertise.areaOfExpertise) }
                      </div>
                      <div className="clearfix"></div>
                      <div className="trainer_profile_page_specializes_tag_sub_title_font">
                        {expertise.experience} Years Experience
                      </div>
                      </div>
                      <div 
                        onClick={this.removeExpertise.bind(
                          this, 
                          expertise.areaOfExpertise)}
                          className={ 
                          (this.state.isEditMode
                            ? " width-auto margin-left-5px "
                            : " hidden ")}>
                          <img src="images/white_close.svg"/>
                      </div> 
                  </div>
                  <div className="clearfix"></div>
                  <div className="margin-top-18px">
                    <div className={ 
                      (expertise.skills.length > 0
                        ? " trainer_profile_page_specializes_tag_angle "
                        : " hidden ")}> 
                      <img src="images/angle.svg" /> 
                    </div>
                    
                    {expertise.skills.map(skill =>
                      <div className="sub_tag margin-top-8px float-left">
                        <div className="width-auto">{skill.skill}</div>
                        <div  
                          onClick={this.removeSubSkill.bind(
                            this, 
                            expertise.areaOfExpertise,
                            skill.skill)}
                          className={(this.state.isEditMode
                            ? " width-auto margin-left-5px "
                            : " hidden ")}>
                          <img src="images/gray_close.svg"/>
                        </div>
                      </div>
                    )}
                    
                  </div>
              </div>
              )}
              <div className={ 
                    ( this.state.isEditMode && this.state.areasOfExpertise.length > 0
                      ? " row width-100-p margin-top-45px"
                      : " hidden ")} >
                <div className="col border-bottom-title padding-bottom-20px">
                </div>
              </div>
              <div className={ 
                  (this.state.isEditMode
                    ? " width-100-p margin-top-45px "
                    : " hidden ")}>
                <select className="form-control" 
                id="addExpertise"
                onChange={this.handleCategorySelection.bind(this)}
                defaultValue="">
                  <option value = "">Select a expertise category</option>
                  {topCategories.map(category =>
                    <option value={category.id}>{category.name}</option>
                  )}
                </select>
                <input type="number" className="form-control margin-top-6px" 
                  id="expertiseExperience"
                  placeholder="Please add number of years of experience with the expertise"  
                  min="1"
                  max="50"
                  />
                <button className=" btn btn-default sub_tag float-right margin-top-25px" role="button"
                  onClick={this.addExpertise.bind(this)}>
                  + Add Expertise Category
                </button>
              </div>
              <div className={ 
                  (this.state.isEditMode
                    ? " width-100-p margin-top-25px "
                    : " hidden ")}>
                <select className="form-control" 
                  id="addSkill"
                  onChange={this.handleSkillSelection.bind(this)}
                  >
                  <option value = "" selected>Select a expertise skill</option>
                  {this.state.subCategories.map(subCategory =>
                    <option value={subCategory}>{subCategory}</option>
                  )}
                </select>
                <input type="text" className="form-control margin-top-6px hidden" 
                  id="customSkill"
                  placeholder="Add any other expertise skill"  
                  />
                <button className=" btn btn-default sub_tag float-right margin-top-25px" role="button"
                  onClick={this.addSkill.bind(this)}>
                  + Add Skill
                </button>
              </div>
            </div>
          </div>
          <div className={ 
                ( this.state.isEditMode && this.state.areasOfExpertise.length > 0
                  ? " row margin-top-45px"
                  : " hidden ")} >
            <div className="col offset-md-3 col-lg-6 border-bottom-title padding-bottom-20px">
            </div>
          </div>
          <div className="row margin-top-45px">
            <div className="col offset-md-3 col-lg-6">
              <div className="width-100-p conten_title_font">Services provided</div>
              {this.state.instructorServices.map(service =>
              <div className="width-100-p margin-top-18px">
                <div className="trainer_profile_page_specializes_tag">
                  <div className="width-auto">
                    <div className="trainer_profile_page_specializes_tag_title_font">
                      { this.getServiceTypeName(service.serviceType) }
                    </div>
                  </div>
                </div>
                <div className="clearfix"></div>
                <div className="margin-top-18px">
                  <div className={ 
                      (service.services.length > 0
                        ? " trainer_profile_page_specializes_tag_angle "
                        : " hidden ")}> 
                    <img src="images/angle.svg" /> 
                  </div>
                  {service.services.map(serviceName =>
                    <div className="sub_tag margin-top-8px float-left">
                    <div className="width-auto">{serviceName}</div>
                    <div className={ 
                      (this.state.isEditMode
                        ? " width-auto margin-left-5px "
                        : " hidden ")}
                        onClick={this.removeService.bind(this, serviceName)}>
                      <img src="images/gray_close.svg"/>
                    </div>
                  </div>
                  )}
                </div>
              </div>
              )}
              <div className={ 
                    ( this.state.isEditMode && this.state.instructorServices.length > 0
                      ? " row width-100-p margin-top-45px"
                      : " hidden ")} >
                <div className="col border-bottom-title padding-bottom-20px">
                </div>
              </div>
              <div className={ 
                  (this.state.isEditMode
                    ? " width-100-p margin-top-45px "
                    : " hidden ")}>
                <select className="form-control" 
                  id="serviceLabel"
                  onChange={this.handleServiceSelection.bind(this)}
                  defaultValue="">
                  <option value = "">Select a service type</option>
                  {services.categories.map(service =>
                    <option value={service.serviceType}>{ this.getServiceTypeName(service.serviceType) }</option>
                  )}
                </select>
                <select className="form-control margin-top-6px" 
                  id="serviceName"
                  onChange={this.handleIncludedServiceSelection.bind(this)}
                  defaultValue="">
                  <option value = "">Select a service</option>
                  {this.state.selectedServicesList.map(serviceName =>
                    <option value={ serviceName }>{ serviceName }</option>
                  )}
                </select>
                <input type="text" className="form-control margin-top-6px hidden" 
                  id="customServiceName"
                  placeholder="Add any other service"  
                  />
                <button className=" btn btn-default sub_tag float-right margin-top-25px" role="button"
                  onClick={this.addService.bind(this)}>
                  + Add Service
                </button>
              </div>
            </div>
          </div>
          <div className={ 
                    ( Object.keys(trainerReviews).length > 3
                      ? " row "
                      : " hidden ")} >
            <div className="col offset-md-3 col-lg-6 border-bottom-title padding-bottom-20px">
            </div>
          </div>
          <div className={ 
                    ( Object.keys(trainerReviews).length > 3
                      ? " row margin-top-45px "
                      : " hidden ")}>
            <div className="col offset-md-3 col-lg-6">
              <div className=" float-left conten_title_font">Top Reviews</div>
              <div className=" float-right"><a href="#" >View All ({Object.keys(trainerReviews).length}) <img src="images/right_arrow.svg" /> </a></div>
            </div>
            <div style={{'width': '100%'}}>
            {Object.keys(trainerReviews).map(key =>
  
              (
                <div className="col offset-md-3 col-lg-6 margin-top-25px">
                  <div className="width-100-p">
                    <img className="reviews_profile_pic" src="images/default-user-image.png"/>
                    <div className="float-left width-auto margin-left-25px margin-top-14px">
                      <a href="#">{trainerReviews[key].firstName} {trainerReviews[key].lastName}</a>
                    </div>
                    <div className="float-right">
                      <div className="width-auto margin-top-6px"> 
                      <div className="star">
                        <img src={
                          Math.max(1,trainerReviews[key].trainerQuality) === trainerReviews[key].trainerQuality
                          ? "images/star-green.svg"
                          : "images/star-gray.svg"} />
                      </div>
                      <div className="star">
                        <img src={
                            Math.max(2,trainerReviews[key].trainerQuality) === trainerReviews[key].trainerQuality
                            ? "images/star-green.svg"
                            : "images/star-gray.svg"} />
                      </div>
                      <div className="star">
                        <img src={
                            Math.max(3,trainerReviews[key].trainerQuality) === trainerReviews[key].trainerQuality
                            ? "images/star-green.svg"
                            : "images/star-gray.svg"} />
                      </div>
                      <div className="star">
                        <img src={
                            Math.max(4,trainerReviews[key].trainerQuality) === trainerReviews[key].trainerQuality
                            ? "images/star-green.svg"
                            : "images/star-gray.svg"} />
                      </div>
                      <div className="star">
                        <img src={
                          Math.max(5,trainerReviews[key].trainerQuality) === trainerReviews[key].trainerQuality
                          ? "images/star-green.svg"
                          : "images/star-gray.svg"} />
                      </div>
                        <a href="#" className="trainers-tag-plus">{trainerReviews[key].trainerQuality}/5</a>
                      </div>
                    </div>
                  </div>
                <div className="width-100-p margin-top-16px conten_font">
                  {trainerReviews[key].comments ? trainerReviews[key].comments : '' }
                </div>
                </div>
              ))
            }
            </div>
            
          </div>
          <div className={ 
                    ( Object.keys(trainerReviews).length > 3
                      ? " row "
                      : " hidden ")}>
            <div className="col offset-md-3 col-lg-6 border-bottom-title padding-bottom-20px">
            </div>
          </div>
          <div className="row margin-top-45px">
            <div className="col offset-md-3 col-lg-6">
              <div className="width-100-p conten_title_font">Upcoming Classes</div>
            </div>
            <div className="col offset-md-3 col-lg-6 margin-top-18px">
              <div className="width-100-p">No classes availabe.</div>
            </div>
          </div>
        </div >
      );
    } else {
      return <div>Loading...</div>
    }
  }
}

export default TrainerProfile;
