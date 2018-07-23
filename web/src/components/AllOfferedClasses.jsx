import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Popover from './Popover';
import PopUp from './PopUp';
import { getCategories, getServiceList } from '../actions/TrainersActions.js';
import {
  getAllOfferedClasses,
  getInstructorFreeSlots,
  getSession,
  scheduleClass
} from '../actions/ClassActions';
import { showClassDetail } from '../actions/trainerRoutingActions';
import { Modal } from 'react-bootstrap';


const propTypes = {
  dispatch: PropTypes.func.isRequired
};

const difficultyLevels = [
  { key: 1, name: 'Beginner' },
  { key: 2, name: 'Intermediate' },
  { key: 3, name: 'Advanced' }
];

const sessionTypes = [
  { key: 1, name: 'Group' },
  { key: 2, name: 'Personalized' }
];

class OfferedClassesFilters extends Component {
  constructor(props) {
    super(props);

    this.state = {
      category: '',
      service: '',
      typeOfSession: '',
      selectedSlot: '',
      totalSelected: 0
    }
  }

  handleCategoryChange(e) {
    this.setState({
      category: e.currentTarget.value
    });
  }

  handleServiceChange(e) {
    this.setState({
      service: e.currentTarget.value
    });
  }

  handleTypeOfSessionChange(e) {
    this.setState({
      typeOfSession: e.currentTarget.value
    });
  }

  handleFilterSelection() {
    let paramsNumber = 0;
    if (this.state.service) { paramsNumber++ };
    if (this.state.category) { paramsNumber++ };
    if (this.state.typeOfSession !== '') { paramsNumber++ };

    this.setState({
      totalSelected: paramsNumber
    });

    this.props.applyFilters(this.state);
  }

  render() {

    let { categories, services } = this.props;
    let topCategories;
    if (categories && services) {
      topCategories = categories.categories.filter(category => {
        if (category.topCategory) {
          return category;
        }
      });
      services = (services.categories.filter(service => {
        if (service.serviceLabel === 'Goals') {
          return service;
        }
      }))[0];

      return (
        <Popover right>

          <img
            src={
              (this.state.totalSelected === 0
                ? "images/filter_gray.svg"
                : "images/filter_green.svg")} />
          <div className="filter-dropdown float-right">
            <div className="width-100-p">Filters</div>
            <div className="width-100-p conten_title_font margin-top-16px">Class Type</div>
            <div className="width-100-p margin-top-6px">
              <select className="form-control" id=""
                value={this.state.category}
                onChange={this.handleCategoryChange.bind(this)}>
                <option></option>
                {topCategories.map(category =>
                  <option value={category.id}>{category.name}</option>
                )}
              </select>
            </div>
            <div className="width-100-p conten_title_font margin-top-16px">Goals</div>
            <div className="width-100-p margin-top-6px">
              <select className="form-control" id=""
                value={this.state.service}
                onChange={this.handleServiceChange.bind(this)}>
                <option></option>
                {services.includedServices.map(service =>
                  <option value={service}>{service}</option>
                )}
              </select>
            </div>
            <div className="width-100-p conten_title_font margin-top-16px">Type Of Session</div>
            <div className="width-100-p margin-top-6px">
              <select className="form-control" id=""
                value={this.state.typeOfSession}
                onChange={this.handleTypeOfSessionChange.bind(this)}>
                <option></option>
                {sessionTypes.map(sessionType =>
                  <option value={sessionType.key}>{sessionType.name}</option>
                )}
              </select>
            </div>
            <div className="width-100-p">
              <button
                className=" btn btn-default big-green-btn margin-top-16px"
                role="button"
                onClick={this.handleFilterSelection.bind(this)}>
                Apply
          </button>
            </div>
          </div>
        </Popover>
      )
    }
    else {
      return <div>Loading...</div>
    }
  }
}


class AllOfferedClasses extends Component {
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

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(getAllOfferedClasses());
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, offeredClasses, instructorFreeSlots } = this.props;

    this.setState({ offeredClasses: offeredClasses });
    // maintaining a second list that will be used as master copy for filtering purposes
    this.setState({ allOfferedClasses: offeredClasses });
    if (nextProps.instructorFreeSlots) {
      let timeSlots = [];
      for (let i in nextProps.instructorFreeSlots) {
        timeSlots.push(nextProps.instructorFreeSlots[i]);
      }
      this.setState({ instructorFreeSlots: timeSlots });
    } else {
      this.setState({ instructorFreeSlots: [] });
    }

    if (!nextProps.categories && !this.state.isCategoriesFetched) {
      this.setState({ isCategoriesFetched: true });
      dispatch(getCategories());
    }

    if (!nextProps.services && !this.state.isServicesFetched) {
      this.setState({ isServicesFetched: true });
      dispatch(getServiceList());
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

  getTypeOfSession = (sessionType) => {
    const sessionTypeArr = sessionTypes.filter(type => {
      return (type.key === sessionType);
    });

    return sessionTypeArr[0].name;
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



  applyFilters(filterCriteria) {
    const currentListOfClasses = this.state.allOfferedClasses;

    const filteredListOfClassesIndices = Object.keys(currentListOfClasses).filter(key => {

      if (filterCriteria["category"] && filterCriteria["category"] !== "") {
        if (!currentListOfClasses[key].catagory === undefined ||
          currentListOfClasses[key].catagory !== parseInt(filterCriteria["category"])) { return false; }
      }
      if (filterCriteria["typeOfSession"] && filterCriteria["typeOfSession"] !== "") {
        if (!!currentListOfClasses[key].typeOfSession === undefined ||
          currentListOfClasses[key].typeOfSession !== parseInt(filterCriteria["typeOfSession"])) { return false; }
      }

      if (filterCriteria["service"] && filterCriteria["service"] !== "") {
        if (!currentListOfClasses[key].goals === undefined ||
          !currentListOfClasses[key].goals.length > 0 ||
          !currentListOfClasses[key].goals.includes(filterCriteria["service"])) { return false; }
      }
      return true;
    });

    let filteredListOfClasses = {};
    let newIndexCount = 0;
    for (let i in filteredListOfClassesIndices) {
      filteredListOfClasses[newIndexCount] = currentListOfClasses[filteredListOfClassesIndices[parseInt(i)]];
      newIndexCount++;
    }

    this.setState({ offeredClasses: filteredListOfClasses })

  }

  requestClass(e, test) {
    console.log(e);
    console.log(test);
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

  showClassDetail(id) {
    const { dispatch } = this.props;
    dispatch(showClassDetail());
    dispatch(getSession(id));
  }

  renderOfferedClasses(offeredClasses) {

    const offeredClassesList = Object.keys(offeredClasses).map(key => {

      let sessionPrice = 0;
      if (offeredClasses[key].creditsPerMember > 0) {
        sessionPrice = parseFloat((offeredClasses[key].creditsPerMember / 100)).toFixed(2);
      }
      return (

        <div
          className="row margin-top-25px">
          <div className="col-lg-8 offset-md-2">
            <div className="class-card-container">
              <iframe className="class-card-user-pic"
                src={offeredClasses[key].videos && offeredClasses[key].videos[0]
                  ? offeredClasses[key].videos[0].video
                  : ""
                }
                frameborder="0"
                allow="encrypted-media"
                allowFullscreen>
              </iframe>
              <div className="width-100-p margin-top-14px">
                <a href="#" className="float-left font-color-green">
                  {this.getCategoryName(offeredClasses[key].catagory)}
                </a>
                <a href="#" className="float-right btn btn-default tag-green-line" role="button">
                  {this.getTypeOfSession(offeredClasses[key].typeOfSession)}
                </a>
              </div>
              <div className="width-100-p class-card-title-clickable margin-top-14px"
                onClick={this.showClassDetail.bind(this, offeredClasses[key].id)}>
                {offeredClasses[key].title}
              </div>
              <div className="width-100-p">
                <div className="class-card-time float-left ">{offeredClasses[key].durationInMin} Minutes</div>
                <div className="width-100-p margin-top-14px">
                  <a href="#" className="float-left btn btn-default tag-gray-line margin-top-M-5px margin-left-5px">
                    {this.getDifficultyName(offeredClasses[key].difficultyLevel)}
                  </a>
                </div>
                <div className="width-100-p margin-top-8px">
                  {offeredClasses[key].goals.map(goal =>
                    <div className="float-left margin-left-5px btn btn-default tag-gray-line margin-top-M-5px">
                      {goal}
                    </div>
                  )}
                </div>
              </div>
              <div className="width-100-p class-card-description margin-top-14px">
                {offeredClasses[key].description}
              </div>
              <div className="width-100-p margin-top-14px">
                <a href="#">
                  <div className="class-card-user-pic-small float-left"></div>
                  <div className="float-left class-card-user-pic-name">
                    {offeredClasses[key].instructorName}
                  </div>
                </a>
              </div>
              <div className="width-100-p margin-top-14px">
                <button className=" btn btn-default big-green-btn"
                  role="button"
                  onClick={this.toggleReserveClassModal.bind(this, offeredClasses[key])}>{sessionPrice > 0
                    ? `Reserve $${sessionPrice}`
                    : "Reserve"}
                  <div
                    className={sessionPrice <= 0
                      ? "float-right inside-free-tag"
                      : "hidden"}> Free Trial
                      </div>
                </button>
              </div>
            </div>
          </div>
        </div>

      );
    });
    return offeredClassesList;
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
    if (this.props.categories && this.props.services &&
      this.state.offeredClasses) {
      return (
        <div className="trainer__form">
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
          <div className="margin-top-25px border-bottom-title padding-bottom-20px trainer__header">
            <div className="trainerprofile__headerText">Offered Classes</div>
            <div className="filter-icon float-right">
              <OfferedClassesFilters
                dispatch={this.props.dispatch}
                categories={this.props.categories}
                services={this.props.services}
                applyFilters={this.applyFilters.bind(this)} />
            </div>
          </div>
          <div className="trainer__container">
            {Object.keys(this.state.offeredClasses).length > 0
              ? this.renderOfferedClasses(this.state.offeredClasses)
              : <div>No classes available that match the filter criteria currently.</div>
            }
          </div>
        </div>
      );
    }
    else {
      return <div>No classes available currently.</div>
    }
  }
}

AllOfferedClasses.propTypes = propTypes;

export default AllOfferedClasses;
