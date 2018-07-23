import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Popover from './Popover';
import { getAllTrainersList, getCategories, getServiceList } from '../actions/TrainersActions';
import {
  getTrainerProfile,
  getTrainerProfileDetail
} from '../actions/trainerProfileAction';

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  trainers: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  services: PropTypes.array.isRequired
};

class TrainerListFilters extends Component {

  constructor(props){
      super(props);

      this.state = {
        rangeTo: 0,
        rangeFrom: 0,
        range: '',
        category: '',
        service: '',
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

  handleExperienceChange(e) {
    let from, to, val = e.currentTarget.value;

    this.setState({
			range: val
    });
    
    if(val === "5 years") {
      from= 0;
      to=5;
     } else if(val === "5+ years") {
       from=5;
       to=100;
     }

    this.setState({
      rangeTo: to,
      rangeFrom: from
      
    });
    
  }
  
  handleFilterSelection() {
    let paramsNumber = 0;
    if(this.state.service) {paramsNumber++};
    if(this.state.category) {paramsNumber++};
    if(this.state.range !== '') {paramsNumber++};
    
    this.setState({
			totalSelected: paramsNumber
		});

    this.props.applyFilters(this.state);
  }
  
  render() {
      
    let { categories, services } = this.props; 
    let topCategories;
    if(categories && services) {
      topCategories = categories.categories.filter(category => {
        if(category.topCategory) {
          return category;
        }
      });
      services = (services.categories.filter(service => {
        if(service.serviceLabel === 'Goals') {
          return service;
        }
      }))[0];
      
      return (
      <Popover right>
      
      <img 
        src={ 
        (this.state.totalSelected === 0
          ? "images/filter_gray.svg"
          : "images/filter_green.svg")}/>
      <div className="filter-dropdown float-right">
      <div className="width-100-p">Filters</div>
      <div className="width-100-p conten_title_font margin-top-16px">Total Years of Experience</div>
      <div className="width-100-p margin-top-6px">
          <select className="form-control" 
          id=""
          value={this.state.range}
          onChange={this.handleExperienceChange.bind(this)} >
              <option></option>
              <option value="5 years">0-5 years</option>
              <option value="5+ years">5+ years</option>
          </select>
      </div>
      <div className="width-100-p conten_title_font margin-top-16px">Category</div>
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
  };

class TrainerList extends Component {
  constructor(props) {
    super(props);

  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(getAllTrainersList());
    dispatch(getCategories());
    dispatch(getServiceList());
  }

  componentWillReceiveProps(nextProps) {}


  trainerProfile(instructorId) {
    const { dispatch, router } = this.props;
    dispatch(getTrainerProfile());
    dispatch(getTrainerProfileDetail(instructorId));
  }

  getCategoryName(categoryId) {
    const categories = this.props.categories;
    
    const categoryName = categories.categories.filter(category => {
      return (category.id === categoryId);
    });

    return categoryName[0].name;
  }

  applyFilters(filterCriteria) {
    const { dispatch } = this.props;
    dispatch(getAllTrainersList(filterCriteria));
  }

  renderTrainers(arr) {
    const trainersDetails = arr.map(trainer => {
      
      return (
        <div className="row justify-content-md-center margin-top-25px">
          <div className="col col-lg-6">
              <div className="float-left">
                <img className="trainers-pic" 
                  src={
                    trainer.profilePic ||
                    "images/default-user-image.png"
                  }/>
              </div>
              <div className="trainers-content-width">
                  <div className="width-100-p trainers-list-title"
                  onClick={this.trainerProfile.bind(this, trainer.id)}>
                    {trainer.firstName} {trainer.lastName}
                  </div>
                  <div className="float-left conten_font">{
                    trainer.totalExperience ? trainer.totalExperience : 0} Years Experience
                  </div>
                  <div className="width-100-p margin-top-6px">
                    <div className="star">
                        <img src={
                            Math.max(1,trainer.instructorRating) === trainer.instructorRating
                            ? "images/star-green.svg"
                            : "images/star-gray.svg"} />
                      </div>
                      <div className="star">
                        <img src={
                            Math.max(2,trainer.instructorRating) === trainer.instructorRating
                            ? "images/star-green.svg"
                            : "images/star-gray.svg"} />
                      </div>
                      <div className="star">
                        <img src={
                            Math.max(3,trainer.instructorRating) === trainer.instructorRating
                            ? "images/star-green.svg"
                            : "images/star-gray.svg"} />
                      </div>
                      <div className="star">
                        <img src={
                            Math.max(4,trainer.instructorRating) === trainer.instructorRating
                            ? "images/star-green.svg"
                            : "images/star-gray.svg"} />
                      </div>
                      <div className="star">
                        <img src={
                          Math.max(5,trainer.instructorRating) === trainer.instructorRating
                          ? "images/star-green.svg"
                          : "images/star-gray.svg"} />
                      </div>
                      <a href="#" className="trainers-tag-plus">{trainer.instructorRating}/5</a>
                  </div>
                  <div className="width-100-p margin-top-14px">
                    {trainer.areasOfExpertise.map(category =>
                      <div className="trainers-tags-green">
                      { this.getCategoryName(category) }
                      </div>
                    )}   
                  </div>
                  <div className="width-100-p margin-top-14px hidden"> 
                    <div className="trainers-a-tag"
                      onClick={this.trainerProfile.bind(this, trainer.id)}>
                      Upcoming Classes
                    </div>
                  </div>
              </div>
          </div>
        </div>
      );
    });
    return trainersDetails;
  }

  render() {
    const { trainers } = this.props;
    return (
      <div className="trainer__form">
        <div className="margin-top-25px border-bottom-title padding-bottom-20px trainer__header">
          <div className="trainerprofile__headerText">Trainers</div>
          <div className="filter-icon float-right">
            <TrainerListFilters 
              dispatch={this.props.dispatch}
              categories={this.props.categories}
              services={this.props.services}
              applyFilters= {this.applyFilters.bind(this)}/>
          </div>
        </div>
        <div className="trainer__container">
          {trainers && trainers.traineeList
            ? this.renderTrainers(trainers.traineeList)
            : 'Error loading trainers'}
        </div>
      </div>
    );
  }
}

export default TrainerList;
