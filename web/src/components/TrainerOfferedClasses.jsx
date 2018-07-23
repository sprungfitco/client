import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { getMyOfferedClasses, getSession, removeClass } from '../actions/ClassActions';
import { getCategories } from '../actions/TrainersActions.js';
import { showClassDetail, showCreateClass } from '../actions/trainerRoutingActions';


const propTypes = {
	dispatch: PropTypes.func.isRequired
};

const difficultyLevels = [
	{ key: 1, name :'Beginner' },
	{ key: 2, name : 'Intermediate' },
	{ key: 3, name: 'Advanced' }
];


class TrainerOfferedClasses extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isCategoriesFetched: false
		};

		this.createClass = this.createClass.bind(this);
	}
	
	componentWillMount() {
		const { dispatch, userProfileInfo } = this.props;
		if(userProfileInfo) {
			dispatch(getMyOfferedClasses(userProfileInfo.id));
		}
	}

	componentWillReceiveProps(nextProps) {
		const { dispatch } = this.props;
		if(!nextProps.categories && !this.state.isCategoriesFetched) {
			this.setState({isCategoriesFetched: true});
			dispatch(getCategories());
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
		
	createClass() {
		const { dispatch } = this.props;
		dispatch(showCreateClass());
	}

	removeClass(classId) {
		const { dispatch, userProfileInfo } = this.props;
		dispatch(removeClass(userProfileInfo.id, classId));
	}

	showClassDetail(id) {
    const { dispatch } = this.props;
    dispatch(showClassDetail());
    dispatch(getSession(id));
  }

	renderOfferedClasses(offeredClasses) { 
		 
		const offeredClassesList = Object.keys(offeredClasses).map(key => {
			
			return (
				<div className="row margin-top-25px">
					<div className="col-lg-8 offset-md-2">
						<div className="class-card-container">
								<iframe className="class-card-user-pic" 
									src= {offeredClasses[key].videos && offeredClasses[key].videos[0] 
										? offeredClasses[key].videos[0].video
										: ""
									}
									frameborder="0" 
									allow="encrypted-media" 
									allowFullscreen>
								</iframe>
								<div className="width-100-p margin-top-14px">
										<a href="#" className="float-left font-color-green">
											{ this.getCategoryName(offeredClasses[key].catagory) }
										</a> 
										<a href="#" className="float-right btn btn-default tag-green-line" role="button">Personalized</a>
								</div>
								<div className="width-100-p class-card-title-clickable margin-top-14px"
                  onClick={this.showClassDetail.bind(this,offeredClasses[key].id)}>
                    {offeredClasses[key].title}
                </div>
								<div className="width-100-p">
										<div className="class-card-time float-left ">{offeredClasses[key].durationInMin} Minutes</div>
										<div className="width-100-p margin-top-14px">
											<a href="#"  className="float-left btn btn-default tag-gray-line margin-top-M-5px margin-left-5px">
												{ this.getDifficultyName(offeredClasses[key].difficultyLevel) }
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
										<button className=" btn btn-default big-green-btn" role="button"
											onClick= {this.removeClass.bind(this, offeredClasses[key].id)}>
											Remove
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
		if(this.props.categories && this.props.myOfferedClasses) {
			return ( 
				<div className="trainer__form">
					<div className="margin-top-25px border-bottom-title padding-bottom-20px trainer__header">
						<div className="trainerprofile__headerText">
							My Offered Classes
						</div>
						<button className=" btn btn-default small-green-btn float-right" role="button"
							onClick={this.createClass}>
							Create Class
						</button>
					</div>
					<div className="trainer__container">
						{Object.keys(this.props.myOfferedClasses).length > 0 ?
						 this.renderOfferedClasses(this.props.myOfferedClasses)
						: <div>No classes available currently.</div>}
					</div>	
				</div>
			);
		}
		else {
			return <div>Loading...</div>
		}
	}
}

TrainerOfferedClasses.propTypes = propTypes;

export default TrainerOfferedClasses;
