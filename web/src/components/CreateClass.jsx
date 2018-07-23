import PropTypes from 'prop-types';
import React, { Component } from 'react';
import $ from 'jquery';
import Slider from 'rc-slider';
import PopUp from './PopUp';
import 'rc-slider/assets/index.css';
import { createClass } from '../actions/ClassActions';
import { showMyOfferedClasses } from '../actions/trainerRoutingActions';
import { getCategories, getServiceList, getSubCategories } from '../actions/TrainersActions';

const VID_REGEX = /(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

const propTypes = {
	dispatch: PropTypes.func.isRequired,
	userProfileInfo: PropTypes.object.isRequired,
	categories: PropTypes.array.isRequired,
	services: PropTypes.array.isRequired
};

const difficultyLevels = [
	{ key: 1, name :'Beginner' },
	{ key: 2, name : 'Intermediate' },
	{ key: 3, name: 'Advanced' }
];

const sessionTypes = [
	{ key: 1, name :'Group' },
	{ key: 2, name : 'Personalized' }
];

class CreateClass extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			isCategoriesFetched: false,
			isServicesFetched: false,
			subCategories:[],
			classScreenShots: [],
			trainerImages: [],
			currentImageUploadType: '',
			goals: [],
			injuries: [],
			minPrice: 0,
			maxPrice: 20
		};

		this.showUploadScreenShot = this.showUploadScreenShot.bind(this);
		this.showUploadTrainerImage = this.showUploadTrainerImage.bind(this);
		this.handleImageUpload = this.handleImageUpload.bind(this);
		this.handleClassScreenUpload = this.handleClassScreenUpload.bind(this);
		this.handleTrainerImageUpload = this.handleTrainerImageUpload.bind(this);
		this.handlePriceChange = this.handlePriceChange.bind(this);
		this.createClass = this.createClass.bind(this);
		this.cancel = this.cancel.bind(this);
	}

	componentWillMount() {
		const { dispatch } = this.props;
		dispatch(getCategories());
		dispatch(getServiceList());
	}
	
	componentWillReceiveProps(nextProps) {

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

		if(nextProps.services && (!this.state.goals || this.state.goals.length === 0)) {
			const goals = (nextProps.services.categories.filter(service => {
				if(service.serviceType === 1) {
					return service.includedServices;
				}
			}))[0].includedServices;

			const filteredArr = goals.filter(service => {
        return service === 'Other';
      });

      if(filteredArr.length === 0) {
        goals.push('Other');
      }

			this.setState({ goals });
		}

		if(nextProps.services && (!this.state.injuries || this.state.injuries.length ===0)) {
			const injuries = (nextProps.services.categories.filter(service => {
				if(service.serviceType === 2) {
					return service.includedServices;
				}
			}))[0].includedServices;

			const filteredArr = injuries.filter(service => {
        return service === 'Other';
      });

      if(filteredArr.length === 0) {
        injuries.push('Other');
      }

			this.setState({ injuries });
		}
	}

	handleCategorySelection() {
		const { dispatch } = this.props;
		const selectedExpertise = document.getElementById("categories").value;

		if(selectedExpertise !== "") {
			dispatch(getSubCategories(parseInt(selectedExpertise)));
		}
		else {
			this.setState ( {subCategories: []} )
		}
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
	
	handleGoalSelection(event) {
		let goal = event.target.value;
		const inputElm = document.getElementById("customGoal");
		if(goal !== "notApplicable" && goal !== "") {
			
			inputElm.classList.remove("hidden");

			if(goal === "Other") {
				inputElm.classList.remove("hidden");
			} else {
				inputElm.classList.add("hidden");
			}
		}
		else {
			inputElm.classList.add("hidden");
		}
	}

	handleInjurySelection(event) {
		let goal = event.target.value;
		const inputElm = document.getElementById("customInjury");
		if(goal !== "notApplicable" && goal !== "") {
			inputElm.classList.remove("hidden");
			if(goal === "Other") {
				inputElm.classList.remove("hidden");
			} else {
				inputElm.classList.add("hidden");
			}
		}
		else {
			inputElm.classList.add("hidden");
		}
	}

	handlePriceChange(value) {
		const rangeVals= [...value];
		document.getElementById("priceRangeOutput").value = 
		"$" +	rangeVals[0] + " - " + rangeVals[1];

		this.setState ( {
			minPrice : parseInt(rangeVals[0]),
			maxPrice: parseInt(rangeVals[1])
		});
	}

	createClass() {
		try {
			const { dispatch, userProfileInfo } = this.props;
			const { id } = this.props.userProfileInfo;

			const classDetails = {};

			classDetails.title = document.getElementById('title').value;
			classDetails.description = document.getElementById('description').value;
			classDetails.category = document.getElementById('categories').value;
		
			let selectedSkill = document.getElementById("addSkill").value;
			if(selectedSkill === "Other") {
				selectedSkill = document.getElementById("customSkill").value;
			}
			classDetails.subCategories = [selectedSkill];


			const goals = [];
			let selectedGoal = document.getElementById("addGoal").value;
			if(selectedGoal !== "" && selectedGoal !== "notApplicable") {
				if(selectedGoal === "Other") {
					goals.push(document.getElementById("customGoal").value);
				}
				else {
					goals.push(selectedGoal);
				}
			}

			let selectedInjury = document.getElementById("addInjury").value;
			if(selectedInjury !== "" && selectedInjury !== "notApplicable") {
				if(selectedInjury === "Other") {
					goals.push(document.getElementById("customInjury").value);
				}
				else {
					goals.push(selectedInjury);
				}
			}
			classDetails.goals = goals;

			classDetails.instructorId = id;
			classDetails.difficultyLevel = document.getElementById('difficultyLevel').value;
			classDetails.typeOfSession = document.getElementById('sessionType').value;
			classDetails.maxMembers = document.getElementById('numOfMembers').value;
			classDetails.durationInMin = document.getElementById('duration').value;
			classDetails.instructorPics = this.state.trainerImages;
			classDetails.sessionPics = this.state.classScreenShots;

			// This hard coding will be removed as part of next checkin for youtube integration
			const videoURL = document.getElementById("videoUrl").value;
			const videoID = videoURL.match(VID_REGEX)[1];
			const embedableURL = `https://www.youtube.com/embed/${videoID}?rel=0`;

			classDetails.sessionVideos = {
				video: embedableURL,
				title:"Session Video",
				videoId: videoID,
				description: "Session Video"
			};

			const sessionPrice = {};
			sessionPrice.pricingType = document.getElementById("fixedPrice").checked ? 1 : 2;
			sessionPrice.minFlatFee= 0;
			sessionPrice.maxFlatFee=0;
			sessionPrice.minMemberPrice = 0;
			sessionPrice.maxMemberPrice=0;

			if(sessionPrice.pricingType === 1) {
				sessionPrice.minFlatFee= this.state.minPrice;
				sessionPrice.maxFlatFee=this.state.maxPrice;
			}
			else {
				sessionPrice.minMemberPrice = this.state.minPrice;
				sessionPrice.maxMemberPrice=this.state.maxPrice;
			}
			classDetails.sessionPrice = sessionPrice;

			dispatch(createClass(classDetails));
		}
		catch(error) {
			alert("Error while creating class : " + error.message);
		}
		
	}

	cancel() {
		const { dispatch } = this.props;
		dispatch(showMyOfferedClasses());
	}

	showUploadScreenShot() {
		$('#uploadPhoto').trigger('click');
	}

	showUploadTrainerImage() {
		$('#trainerImageUpload').trigger('click');
	}

	handleClassScreenUpload(event) {
		const file =  event && event.target && event.target.files[0];
		this.setState ( {currentImageUploadType: 'ClassScreenShots' });
		this.handleImageUpload(file);
	}

	handleTrainerImageUpload(event) {
		const file =  event && event.target && event.target.files[0];
		this.setState ( {currentImageUploadType: 'TrainerImages' });
		this.handleImageUpload(file);
	}
	
	handleImageUpload(file) {
		if(file){
			const reader = new FileReader();
			const url = reader.readAsDataURL(file);
			reader.onloadend = function (res) {
				// This is done because popup component reads this proprty to get filename
				// Needs to be renamed to picture, so that can be used generically
				this.setState({
					profilePic: reader.result,
					selectedFile: file,
				}, function(){
					this.handleShow();
				})
			}.bind(this);
		} else {
			alert('No image was selected');
		}
	}

	updateCroppedImage(dataUrl){
		let that = this;
		this.setState({
			isImageUploadInProgress: true
		}, function(){
			this.uploadHandler()
		})
	}
	
	uploadHandler = () => {
		
			let that = this;
			let uploadedImage;
			const { dispatch } = this.props;
			var imageUrl = 'http://localhost:8080/image-upload'
			var blobBin = atob(that.state.profilePic.split(',')[1]);
			var array = [];
			for(var i = 0; i < blobBin.length; i++) {
					array.push(blobBin.charCodeAt(i));
			}
			var file=new Blob([new Uint8Array(array)], {type: 'image/*'});
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
					const currentUploadedImg = {
						pic: data.imageUrl,
						title: file.name,
						description: file.name
					}

					if(that.state.currentImageUploadType === 'ClassScreenShots') {
						const classScreenShots = that.state.classScreenShots;
						classScreenShots.push(currentUploadedImg);
						that.setState ( { classScreenShots }); 
					}
					else if(that.state.currentImageUploadType === 'TrainerImages') {
						const trainerImages = that.state.trainerImages;
						trainerImages.push(currentUploadedImg);
						that.setState ( { trainerImages }); 
					}

					that.setState({
						isImageUploadInProgress: false
					}, function(){
						that.handleClose();
					})
				},
				error: function(err){
					that.setState({
						isImageUploadInProgress: false
					})
					alert("error while image upload");
					
				}
			});
	
	
	}

	removeImage (type, image) {
					
		if(type === "classScreenShots") {
		let filteredclassScreenShots = this.state.classScreenShots.filter(picture => {
			if(picture.pic !== image) {
				return picture;
			}
		})
				
		this.setState ( { classScreenShots: filteredclassScreenShots }); 
		}
		else if (type === "trainerImages") {
			let filteredTrainerImages = this.state.trainerImages.filter(picture => {
			if(picture.pic !== image) {
				return picture;
			}
		})
		
		this.setState ( { trainerImages:  filteredTrainerImages}); 
		}
		
	}

	handleClose() {
		this.setState({ modalIsOpen: false });
	}

	handleShow() {
		this.setState({ modalIsOpen: true });
	}

	showUploadVideo() {
		$('#uploadVideo').trigger('click');
	}

	handleVideoUpload(event) {
		
		/* const file =  event && event.target && event.target.files[0];
		
	

	var metadata = {
    'title': file.name,
    'mimeType': file.type || 'application/octet-stream'
  };
  var xhr = new XMLHttpRequest();

  xhr.open("POST", "https://www.googleapis.com/upload/youtube/v3/videos?part=snippet&key=AIzaSyDKc9uOY-5730RPt7-0ptylj2Ew-oDok4g", true);
  xhr.setRequestHeader('Authorization', 'Bearer ' + 'AIzaSyDKc9uOY-5730RPt7-0ptylj2Ew-oDok4g');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.setRequestHeader('X-Upload-Content-Length', file.size);
  xhr.setRequestHeader('X-Upload-Content-Type', file.type || 'application/octet-stream');

  xhr.onload = function(e) {
    if (e.target.status < 400) {
      var location = e.target.getResponseHeader('Location');
      this.url = location;
     // this.sendFile_();
    } else {
		 // this.onUploadError_(e);
		 console.log(e);
    }
  }.bind(this);
  //xhr.onerror = this.onUploadError_.bind(this);
  xhr.send(JSON.stringify(metadata)); */


	}
 
	render() {
		if (this.props.userProfileInfo &&
			this.props.categories && this.props.services) {
			const { userProfileInfo } = this.props;
			
			const { id } = userProfileInfo;

			const { categories, services } = this.props; 
			let topCategories;
			if(categories) {
				topCategories = categories.categories.filter(category => {
					if(category.topCategory) {
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
					<div className="container margin-top-25px">
						<div className="row line_item padding-bottom-20px">
							<div className="col offset-md-3 col-lg-6 border-bottom-title padding-bottom-20px">
							<div className="float-left ">
								<div className="trainer_profile_page_profile_stuff_container ">
									<div className="float-left  trainer_profile_page_trainer_title">Create a Class</div>
								</div>
								</div>
							<div className="float-right">
								<button className=" btn btn-default small-green-btn" role="button"
									onClick={this.createClass}>
									Create
								</button>
								<button className=" btn btn-default sub_tag margin-left-15px" role="button"
									onClick={this.cancel}>
									Cancel
								</button>
							</div>
							</div>
						</div>
						<div className="row line_item">
							<div className="col offset-md-3 col-lg-2 conten_title_font">
							</div>
							<div className="col col-lg-4 conten_font float-right">All the fields are required *</div> 
 						</div>
						<div className="row line_item margin-top-25px">
							<div className="col offset-md-3 col-lg-2 conten_title_font">
									Class Name
							</div>
							<div className="col col-lg-4 conten_font">
								<textarea className="form-control" id="title" rows="1" maxLength="2000"
										name="classNameText">
									</textarea>
							</div>
						</div>
						<div className="row line_item margin-top-45px ">
							<div className="col offset-md-3 col-lg-2 conten_title_font">
								Class Type
							</div>
							<div className="col col-lg-4 conten_font ">
								<select className="form-control" 
									id="categories"
									onChange={this.handleCategorySelection.bind(this)}
									defaultValue="">
									<option value = "">Select a class category</option>
									{topCategories.map(category =>
										<option value={category.id}>{category.name}</option>
									)}
								</select>
								<select className="form-control margin-top-6px" 
									id="addSkill"
									onChange={this.handleSkillSelection.bind(this)}>
									<option value = "" selected>Select a class expertise</option>
									{this.state.subCategories.map(subCategory =>
										<option value={subCategory}>{subCategory}</option>
									)}
								</select>
								<input type="text" className="form-control margin-top-6px hidden" 
                  id="customSkill"
                  placeholder="Add any other class expertise"  
                  />
							</div>
						</div>
						<div className="row line_item margin-top-45px ">
							<div className="col offset-md-3 col-lg-2 conten_title_font">
								Goals
							</div>
							<div className="col col-lg-4 conten_font">
								<select className="form-control margin-top-6px" 
									id="addGoal"
									onChange={this.handleGoalSelection.bind(this)}
									defaultValue="">
									<option value = "">Select a goal</option>
									{this.state.goals.map(serviceName =>
										<option value={ serviceName }>{ serviceName }</option>
									)}
								</select>
								<input type="text" className="form-control margin-top-6px hidden" 
                  id="customGoal"
                  placeholder="Add any other goal"  
                  />
							</div>
						</div>
							<div className="row line_item margin-top-45px ">
							<div className="col offset-md-3 col-lg-2 conten_title_font">
								Injuries and Medical conditions this class can help with
							</div>
							<div className="col col-lg-4 conten_font">
								<select className="form-control margin-top-6px" 
									id="addInjury"
									onChange={this.handleInjurySelection.bind(this)}
									defaultValue="">
									<option value = "">Select an injury or medical condition</option>
									{this.state.injuries.map(serviceName =>
										<option value={ serviceName }>{ serviceName }</option>
									)}
									<option value = "notApplicable">Not applicable</option>
								</select>
								<input type="text" className="form-control margin-top-6px hidden" 
                  id="customInjury"
                  placeholder="Add any other injury or medical condition"  
                  />
							</div>
						</div>
						<div className="row line_item margin-top-25px">
							<div className="col offset-md-3 col-lg-2 conten_title_font">
								About
							</div>
							<div className="col col-lg-4 conten_font">
								<textarea className="form-control" id="description" rows="3" maxLength="2000"
									name="description">
								</textarea>
							</div>
						</div>
						<div className="row line_item margin-top-45px ">
							<div className="col offset-md-3 col-lg-2 conten_title_font">
								Difficulty Level
							</div>
							<div className="col col-lg-4 conten_font ">
								<select className="form-control margin-top-6px" 
									id="difficultyLevel"
									defaultValue="">
									<option value = "">Select difficulty Level</option>
									{difficultyLevels.map(level =>
										<option value={ level.key }>{ level.name }</option>
									)}
								</select>
							</div>
						</div>
						<div className="row line_item margin-top-45px ">
							<div className="col offset-md-3 col-lg-2 conten_title_font">
								Class Type
							</div>
							<div className="col col-lg-4 conten_font ">
								<select className="form-control margin-top-6px" 
									id="sessionType"
									defaultValue="">
									<option value = "">Select class type</option>
									{sessionTypes.map(type =>
										<option value={ type.key }>{ type.name }</option>
									)}
								</select>
							</div>
						</div>

						<div className="row line_item margin-top-45px ">
							<div className="col offset-md-3 col-lg-2 conten_title_font">
								Number of Members
							</div>
							<div className="col col-lg-4 conten_font ">
								<input type="number" className="form-control" id="numOfMembers"
									min="0"
									max="50"/>
							</div>
						</div>
						<div className="row line_item margin-top-25px">
							<div className="col offset-md-3 col-lg-2 conten_title_font">
								Duration (In Mins)
							</div>
							<div className="col col-lg-4 conten_font">
								<input type="number" className="form-control" id="duration"
									min="0"
									max="50"/>
							</div>
						</div>

						<div className="row line_item margin-top-25px">
							<div className="col offset-md-3 col-lg-2 conten_title_font">
								Pricing
								<div className="conten_font font_normal conten_font_small">Minimum price you desire for class. Class won't be scheduled until this criteria is met.
									<br></br>
									 Setting a price range, helps us do smart pricing and get more revenue for your class
								</div>
							</div>
							<div className="col col-lg-6 conten_font">
								<div className="col col-lg-10 conten_font">
									<div className="form-check">
										<input className="form-check-input" type="radio" name="priceRadios" id="fixedPrice" value="fixed" checked />
										<label className="form-check-label" for="priceRadios">
											Fixed Price (please add the total fixed price for the class)
										</label>
									</div>
								</div>
								<div className="col col-lg-10 conten_font">
									<div className="form-check">
										<input className="form-check-input" type="radio" name="priceRadios" id="variablePrice" value="variable" />
										<label className="form-check-label" for="priceRadios">
											Variable Price (please choose price per member for the class)
										</label>
									</div>
								</div>
								<div className="row line_item margin-top-20px">
									<Range 
										className="col col-lg-6 align-middle margin-left-25px" 
										id="priceRangeInput" 
										allowCross={false} 
										defaultValue={[0, 20]} 
										onChange={this.handlePriceChange} />
									<output 
										className="font-color-dark pull-right align-middle margin-left-25px" 
										id="priceRangeOutput">
										$0-20
									</output>
								</div>
							</div>
						</div>

						<div className="row line_item margin-top-45px">
							<div className="col offset-md-3 col-lg-2 conten_title_font">
								Upload Video
							</div>
							<div className="col col-lg-4 conten_font">
								<input type="text" className="form-control" id="videoUrl" placeholder="Enter a Youtube URL "/>
							</div>
						</div>
						<input 
							type="file" 
							id="uploadVideo" 
							className="hidden" 
							onChange={this.handleVideoUpload} 
							accept="video/*"/>
						<div className="row line_item margin-top-25px">
							<div className="col offset-md-3 col-lg-2 conten_title_font">
							</div>
							{/* <div className="col col-lg-4 conten_font">
								or  <button 
									className="sub_tag"
									id="youtubeVideoUpload"
									onClick={this.showUploadVideo}>
									Choose File to Upload
								</button>
							</div> */}
						</div>
						<div className="row line_item margin-top-45px">
							<div className="col offset-md-3 col-lg-6 ">
								<div className="width-100-p conten_title_font">Upload Class Screenshot</div>
								<div className="conten_font font_normal conten_font_small">
									<br></br>
									 Add upto 5 images
								</div>
							</div>
							<button 
									className={this.state.classScreenShots.length < 5 
										? "sub_tag float-right"
										: "hidden" }
									onClick={this.showUploadScreenShot}>
									Choose image to Upload
							</button>
							<input type="file" 
								accept="image/*" 
								name="image" 
								id="uploadPhoto" 
								onChange={this.handleClassScreenUpload} 
								className="hidden"/>
							<div className="col offset-md-3 col-lg-6 margin-top-25px">
								{this.state.classScreenShots.map(image =>
									<div className="galleryContainer">
										<div 
											className="delete_img_placeHolder"
											onClick={this.removeImage.bind(this, "classScreenShots", image.pic)}>
											<img className="delete_img" src="images/img_delete.svg"/>
										</div>
										<div className="gallery_photo">
											<img className="gallery_photo" src={image.pic}></img>
										</div>
								 </div>
								)}
							</div>
						</div>
						<div className="row line_item line_item margin-top-45px">
							<div className="col offset-md-3 col-lg-6 ">
								<div className="width-100-p conten_title_font">Upload Trainer photo</div>
								<div className="conten_font font_normal conten_font_small">
									<br></br>
									 Add upto 5 images
								</div>
							</div>
							<button 
									className= {this.state.trainerImages.length < 5 
										? "sub_tag float-right"
										: "hidden"}
									onClick={this.showUploadTrainerImage}>
									Choose image to Upload
							</button>
							<input type="file" 
								accept="image/*" 
								name="image" 
								id="trainerImageUpload" 
								onChange={this.handleTrainerImageUpload} 
								style={{ display: 'none'}}/>
							<div className="col offset-md-3 col-lg-6 margin-top-25px">
								{this.state.trainerImages.map(image =>
									<div className="galleryContainer">
										<div 
											className="delete_img_placeHolder"
											onClick={this.removeImage.bind(this, "trainerImages", image.pic)}>
											<img className="delete_img" src="images/img_delete.svg"/>
										</div>
										<div className="gallery_photo">
											<img className="gallery_photo" src={image.pic}></img>
										</div>
							 		</div>
								)}
							</div>
						</div>
					</div>
				</div>
			);
		}
		else {
			return <div>Loading...</div>
		}
	}
}

export default CreateClass;
