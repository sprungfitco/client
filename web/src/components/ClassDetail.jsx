import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { getCategories, getServiceList } from '../actions/TrainersActions.js';
import { getSession, scheduleClass, getInstructorFreeSlots } from '../actions/ClassActions';
import { Modal } from 'react-bootstrap';

const propTypes = {
  dispatch: PropTypes.func.isRequired
};

const difficultyLevels = [
  { key: 1, name: 'Beginner' },
  { key: 2, name: 'Intermediate' },
  { key: 3, name: 'Advanced' }
];


class ClassDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCategoriesFetched: false,
      isServicesFetched: false,
      showReserveClassModal: false,
      selectedClass: null,
      selectedDay: null,
      days: []
    };

  }

  toggleReserveClassModal = (classDetails, e) => {
    if (!this.state.showReserveClassModal) {
      const { dispatch } = this.props;
      dispatch(getInstructorFreeSlots(classDetails.instructorId));
    }
    this.setState({ showReserveClassModal: !this.state.showReserveClassModal, selectedClass: classDetails });
  }

  closeReserveClassModal = (e) => {
    this.setState({ showReserveClassModal: false });
  }

  calculateTimeSlots() {
    for (let i in this.state.instructorFreeSlots) {
      let utcSeconds = this.state.instructorFreeSlots[i].startTime;
      let d = new Date(0); // The 0 there is the key, which sets the date to the epoch
      d.setUTCSeconds(utcSeconds);
      this.state.instructorFreeSlots[i].slot = (new Date(d).toTimeString()).split(' ')[0];
      this.state.days[i] = new Date(d).toDateString();
    }
  }

  reserveClass(e) {
    const { dispatch } = this.props;
    dispatch(scheduleClass(this.state.selectedClass.id, this.state.selectedClass.instructorId, this.state.selectedSlot));
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(getCategories());
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, classDetail } = nextProps;
    this.setState({ classDetail });

    if (!nextProps.categories && !this.state.isCategoriesFetched) {
      this.setState({ isCategoriesFetched: true });
      dispatch(getCategories());
    }

    if (!nextProps.services && !this.state.isServicesFetched) {
      this.setState({ isServicesFetched: true });
      dispatch(getServiceList());
    }

    if (nextProps.instructorFreeSlots) {
      let timeSlots = [];
      for (let i in nextProps.instructorFreeSlots) {
        timeSlots.push(nextProps.instructorFreeSlots[i]);
      }
      this.setState({ instructorFreeSlots: timeSlots });
    } else {
      this.setState({ instructorFreeSlots: [] });
    }
  }


  getCategoryName = (categoryId) => {
    const categories = this.props.categories;

    const categoryName = categories.categories.filter(category => {
      return category.id === categoryId;
    });

    return categoryName[0].name;
  }

  getDifficultyName = (difficultyLevel) => {
    const difficultyName = difficultyLevels.filter(level => {
      return (level.key === difficultyLevel);
    });

    return difficultyName[0].name;
  }

  handleSlotSelection(e) {
    this.setState({
      selectedSlot: e.currentTarget.value
    });
  }

  handleDaySelection(e) {
    this.setState({
      selectedDay: e.currentTarget.value
    });
  }

  render() {
    const { showReserveClassModal } = this.state;
    let sessionPrice = 0;
    if (this.state.instructorFreeSlots) {
      this.calculateTimeSlots();
      if (this.state.selectedClass && this.state.selectedClass.creditsPerMember > 0) {
        sessionPrice = parseFloat((this.state.selectedClass.creditsPerMember / 100)).toFixed(2);
      }
    }
    if (this.props.categories && this.state.classDetail) {
      const classDetail = this.state.classDetail;

      let sessionPrice = 0;
      if (classDetail.creditsPerMember > 0) {
        sessionPrice = parseFloat((classDetail.creditsPerMember / 100)).toFixed(2);
      }
      return (
        <div className="container">
          <Modal id="reserve-modal" className="offered-classes-modal" show={showReserveClassModal} onHide={this.closeReserveClassModal}>
            <Modal.Body>
              <div className="width-100-p conten_title_font">Reserve this class</div>
              <div className="width-100-p">Choose from available trainers slots</div>
              <div className="width-100-p conten_title_font margin-top-16px">Pick a Day</div>
              <div className="width-100-p margin-top-6px">
                <select className="form-control" id=""
                  value={this.state.selectedDay}
                  onChange={this.handleDaySelection.bind(this)}>
                  <option></option>
                  {this.state.instructorFreeSlots ? this.state.days.map(slot =>
                    <option value={slot}>{slot}</option>
                  ) : <option></option>}
                </select>
              </div>
              <div className="width-100-p conten_title_font margin-top-16px">Choose time</div>
              <div className="width-100-p margin-top-6px">
                <select className="form-control" id=""
                  value={this.state.selectedSlot}
                  onChange={this.handleSlotSelection.bind(this)}>
                  <option></option>
                  {this.state.instructorFreeSlots ? this.state.instructorFreeSlots.map(slot =>
                    <option value={slot.slotId}>{slot.slot}</option>
                  ) : <option></option>}
                </select>
              </div>
              <div className="width-100-p conten_title_font margin-top-16px">Class Price</div>
              <div className="width-100-p conten_title_font ">${sessionPrice}</div>
              <div className="width-100-p">
                <a href="#" className=" btn btn-default big-green-btn margin-top-16px" role="button"
                  onClick={this.reserveClass.bind(this)}>Pay and Reserve</a>
              </div>
            </Modal.Body>
            {/* <Modal.Footer>
                  <button type="button" className="btn btn-primary width100P" onClick={this.addCreditsToTeam}>Add Funds</button>
                </Modal.Footer> */}
          </Modal>
          <div className="row margin-top-18px">
            <div className="col offset-md-3 col-lg-6 border-bottom-title padding-bottom-20px">
              <div className="float-left ">
                <div className="trainer_profile_page_profile_stuff_container ">
                  <div className="float-left font-color-green">
                    <div>{this.getCategoryName(classDetail.catagory)}</div>
                  </div>
                  <div className="clearfix"></div>
                  <div className="float-left  trainer_profile_page_trainer_title">{classDetail.title}</div>
                  <div className="clearfix"></div>
                  <div className="float-left conten_font">
                    <div className="width-100-p">
                      <a href="#">
                        <img className="class-card-user-pic-small float-left"
                          src={
                            classDetail.instructorProfilePic ||
                            "images/default-user-image.png"
                          } />
                        <div className="float-left class-card-user-pic-name">{classDetail.instructorName}</div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="float-right">
                <div className="width-100-p margin-top-14px">
                  <button className=" btn btn-default big-green-btn "
                    role="button"
                    onClick={this.toggleReserveClassModal.bind(this, classDetail)}
                    style={{ width: "240px" }}
                  >{sessionPrice > 0
                    ? `Reserve $${sessionPrice}`
                    : "Reserve"}
                    <div className={sessionPrice <= 0
                      ? "float-right inside-free-tag"
                      : "hidden"}> Free Trial</div>
                  </button>
                </div>
              </div>
            </div></div>


          <div className="row margin-top-18px">
            <div className="col offset-md-3 col-lg-6 padding-bottom-20px">
              <iframe className="class-card-user-pic"
                src={classDetail.videos && classDetail.videos[0]
                  ? classDetail.videos[0].video
                  : ""
                }
                frameborder="0"
                allow="encrypted-media"
                allowFullscreen>
              </iframe>
            </div>
          </div>
          <div className="row margin-top-25px">
            <div className="col offset-md-3 col-lg-2 conten_title_font">
              About Class
            </div>
            <div className="col col-lg-4 conten_font">
              {classDetail.description}
            </div>
          </div>
          <div className="row margin-top-25px">
            <div className="col offset-md-3 col-lg-2 conten_title_font">
              Duration
            </div>
            <div className="col col-lg-4 conten_font">
              {classDetail.durationInMin} Minutes
            </div>
          </div>
          <div className="row margin-top-25px">
            <div className="col offset-md-3 col-lg-2 conten_title_font">
              Difficulty Level
              </div>
            <div className="col col-lg-4 conten_font">
              <div className="sub_tag float-left">
                {this.getDifficultyName(classDetail.difficultyLevel)}
              </div>
            </div>

          </div>
          <div className="row margin-top-25px">
            <div className="col offset-md-3 col-lg-2 conten_title_font">
              Goals
            </div>
            <div className="col col-lg-4 conten_font">
              {classDetail.goals.map(goal =>
                <div className="sub_tag float-left">{goal}</div>
              )}
            </div>
          </div>


          <div className="row margin-top-45px">
            <div className="col offset-md-3 col-lg-6 ">
              <div className="width-100-p conten_title_font">Class Screenshots</div>
            </div>
            <div className="col offset-md-3 col-lg-6 margin-top-25px">
              {classDetail.pics.map(image =>
                <div className="galleryContainer">
                  <div className="gallery_photo float-left">
                    <img className="gallery_photo" src={image.pic}></img>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="row margin-top-45px">
            <div className="col offset-md-3 col-lg-6 ">
              <div className="width-100-p conten_title_font">Trainer photos</div>
            </div>
            <div className="col offset-md-3 col-lg-6 margin-top-25px">
              {classDetail.instructorPics.map(image =>
                <div className="galleryContainer">
                  <div className="gallery_photo">
                    <img className="gallery_photo" src={image.pic}></img>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="row  ">
            <div className="col offset-md-3 col-lg-6 border-bottom-title padding-bottom-20px">
            </div>
          </div>

          {/* <div className="row margin-top-45px">
                <div className="col offset-md-3 col-lg-6">
                    <div className=" float-left conten_title_font">Top Reviews</div>
                    <div className=" float-right"><a href="#" >View All (37) <img src="images/right_arrow.svg"/> </a></div>
                </div>
                <div className="col offset-md-3 col-lg-6 margin-top-25px">
                    <div className="width-100-p">
                        <div className="reviews_profile_pic"></div>
                        <div className="float-left width-auto margin-left-25px margin-top-14px">
                            <a href="#">Benjamin Morrison</a>
                        </div>
                        <div className="float-right">
                        <div className="width-auto margin-top-6px">
                            <div className="star">
                                <img src="images/star-green.svg"/>
                            </div>
                            <div className="star">
                                <img src="images/star-green.svg"/>
                            </div>
                            <div className="star">
                                <img src="images/star-green.svg"/>
                            </div>
                            <div className="star">
                                <img src="images/star-green.svg"/>
                            </div>
                              <div className="star">
                                <img src="images/star-gray.svg"/>
                            </div>
                        <a href="#" className="trainers-tag-plus">4 /5</a>
                        </div>
                        </div>
                    </div>
                    <div className="width-100-p margin-top-16px conten_font" >Vestibulum rutrum quam vitae fringilla tincidunt. Suspendisse nec tortor urna. Ut laoreet sodales nisi, quis iaculis nulla iaculis vitae. Donec sagittis faucibus lacus eget blandit. Mauris vitae ultricies metus, at condimentum nulla. Donec quis ornare lacus. Etiam gravida mollis tortor quis porttitor.</div>
                </div>
                
                <div className="col offset-md-3 col-lg-6 margin-top-25px">
                    <div className="width-100-p">
                        <div className="reviews_profile_pic"></div>
                        <div className="float-left width-auto margin-left-25px margin-top-14px">
                            <a href="#">Benjamin Morrison</a>
                        </div>
                        <div className="float-right">
                        <div className="width-auto margin-top-6px">
                            <div className="star">
                                <img src="images/star-green.svg"/>
                            </div>
                            <div className="star">
                                <img src="images/star-green.svg"/>
                            </div>
                            <div className="star">
                                <img src="images/star-green.svg"/>
                            </div>
                            <div className="star">
                                <img src="images/star-green.svg"/>
                            </div>
                              <div className="star">
                                <img src="images/star-gray.svg"/>
                            </div>
                        <a href="#" className="trainers-tag-plus">4 /5</a>
                        </div>
                        </div>
                    </div>
                    <div className="width-100-p margin-top-16px conten_font" >Vestibulum rutrum quam vitae fringilla tincidunt. Suspendisse nec tortor urna. Ut laoreet sodales nisi, quis iaculis nulla iaculis vitae. Donec sagittis faucibus lacus eget blandit. Mauris vitae ultricies metus, at condimentum nulla. Donec quis ornare lacus. Etiam gravida mollis tortor quis porttitor.</div>
                </div>
                
                <div className="col offset-md-3 col-lg-6 margin-top-25px">
                    <div className="width-100-p">
                        <div className="reviews_profile_pic"></div>
                        <div className="float-left width-auto margin-left-25px margin-top-14px">
                            <a href="#">Benjamin Morrison</a>
                        </div>
                        <div className="float-right">
                        <div className="width-auto margin-top-6px">
                            <div className="star">
                                <img src="images/star-green.svg"/>
                            </div>
                            <div className="star">
                                <img src="images/star-green.svg"/>
                            </div>
                            <div className="star">
                                <img src="images/star-green.svg"/>
                            </div>
                            <div className="star">
                                <img src="images/star-green.svg"/>
                            </div>
                              <div className="star">
                                <img src="images/star-gray.svg"/>
                            </div>
                        <a href="#" className="trainers-tag-plus">4 /5</a>
                        </div>
                        </div>
                    </div>
                    <div className="width-100-p margin-top-16px conten_font" >Vestibulum rutrum quam vitae fringilla tincidunt. Suspendisse nec tortor urna. Ut laoreet sodales nisi, quis iaculis nulla iaculis vitae. Donec sagittis faucibus lacus eget blandit. Mauris vitae ultricies metus, at condimentum nulla. Donec quis ornare lacus. Etiam gravida mollis tortor quis porttitor.</div>
                </div>  
            </div> *
          <div className="row  ">
            <div className="col offset-md-3 col-lg-6 border-bottom-title padding-bottom-20px">
            </div>
            </div>  */}
        </div>
      )
    }
    else {
      return <div>Loading...</div>
    }
  }
}

ClassDetail.propTypes = propTypes;

export default ClassDetail;
