import React, { Component } from 'react';
import request from 'graphql-request';
import moment from 'moment';
import PropTypes from 'prop-types';
import DatePicker from 'react-date-picker';
import Datetime from 'react-datetime';
import '../../styles/react-datetime.css';
import { postClass } from '../actions/ClassActions';
import { classCategories } from '../constants/ClassCategories';

const textFields = [
  { key: 'title', id: 'postclass.title', label: 'Title', type: 'text', autoFocus: true, placeholder: 'Ex. Yoga time with John'},
	{ key: 'description', id: 'postclass.description', label: 'Description', type: 'text', placeholder: 'Ex. Slow and relaxing streches'},
	//{ key: 'instructorId', id: 'postclass.instructorId', label: 'Instructor', type: 'number', placeholder: 'Ex. Slow and relaxing streches'},
	{ key: 'maxMembers', id: 'postclass.maxMembers', label: 'Maximum members', type: 'number'},
	{ key: 'creditsPerMember', id: 'postclass.creditsPerMember', label: 'Credits per member', type: 'number'}
];

const dateTimeFields = [
  { key: 'startTime', id: 'postclass.startTime', label: 'Starts', type: 'datetime'},
  { key: 'endTime', id: 'postclass.endTime', label: 'Ends', type: 'datetime'},
];

const difficultyLevelOptions = [
{ key: 'Beginner', value: 1 },
{ key: 'Intermediate', value: 2 },
{ key: 'Advanced', value: 3 }
];

const propTypes = {
  dispatch: PropTypes.func.isRequired
};

class PostClass extends Component {

	constructor(props) {
		super(props);
	//	this.resetDefaults = this.resetDefaults.bind(this);

    this.state = {
			category: classCategories[0].key,
			startTime: new Date(),
			startTimeEpoch: moment(this.startTime).unix(),
			endTime: new Date(),
			endTimeEpoch: moment(this.endTime).unix(),
			durationInMin: 60,
			instructorId: 0,
			maxMembers: '',
      typeOfSession: 1,
			creditsPerMember: '',
			title: '',
			description: '',
			difficulty: difficultyLevelOptions[0]

			/* ToDo :
			1. remove the hard code duration once datetime picker issues are resolved
			and user is able to choose start and end time.
			2. Remove hard coded instructor name one list of trainers is available.
			*/
    };
	}

	handleChange(key, e) {
    this.setState({
      [key]: e.currentTarget.value
		});
	}

	handleCategoryChange (e) {
    this.setState({
			category: e.currentTarget.value
		});
	}

  handleTrainerChange (e) {
    this.setState({
			instructorId: e.currentTarget.value
		});
	}

	handleTimeChange(key, date) {
		this.setState({
      [key]: date
		}, this.updateDuration);
	}

	updateDuration() {
		this.setState({
			startTimeEpoch: moment(this.state.startTime).unix(),
			endTimeEpoch: moment(this.state.endTime).unix()
		});
		let durationInMin = moment
		.duration(moment(this.state.endTime, 'YYYY/MM/DD HH:mm')
		.diff(moment(this.state.startTime, 'YYYY/MM/DD HH:mm'))
		).asMinutes();

		//this.setState({durationInMin});
	}

	handleClick() {
		event.preventDefault();
		const { dispatch } = this.props;
		dispatch(postClass(this.state));
		this.resetDefaults();
	}

	handleDifficulty = (e) => {
		const difficultyValue =  difficultyLevelOptions.find((difficulty) => {
										return difficulty.value == e.currentTarget.value
									});
		this.setState({ difficulty: difficultyValue });
	}

	resetDefaults() {
		this.setState({
			category: classCategories[0].key,
			startTime: new Date(),
			startTimeEpoch: moment(this.startTime).unix(),
			endTime: new Date(),
			endTimeEpoch: moment(this.endTime).unix(),
			durationInMin: 60,
			instructorId: 0,
			maxMembers: '',
			creditsPerMember: '',
      typeOfSession: 1,
			title: '',
			description: '',
			difficulty: difficultyLevelOptions[0]

			/* ToDo :
			1. remove the hard code duration once datetime picker issues are resolved
			and user is able to choose start and end time.
			2. Remove hard coded instructor name one list of trainers is available.
			*/
    });
	}

  render() {
    return (
      <div className="post_class_custom">
				<div className="post_class_header">Post a class</div>
				<div className="post_class_fields">
					<div className="post_class_item">
            <span>Trainer</span>
            <select onChange={this.handleTrainerChange.bind(this)} value ={this.state.instructorId} className="post_class_input">
              <option value={0}>Select trainer</option>
              {
                this.props.users.trainers.map(trainer =>
                (<option value={trainer.id}>{trainer.firstName} {trainer.lastName}</option>))
              }
            </select>
            <span>Session Type</span>
            <select onChange={this.handleCategoryChange.bind(this)} value ={this.state.typeOfSession} className="post_class_input">
              <option value="1">Group Session</option>
              <option value="2">Personalized Session</option>
            </select>
			<span>Category</span>
			<select onChange={this.handleCategoryChange.bind(this)} value ={this.state.category} className="post_class_input">
			{classCategories.map(category =>
				(<option key={category.key} value={category.key}>{category.name}</option>))
			}
			</select>
			<span>Difficulty</span>
			<select 
				onChange={this.handleDifficulty} 
				className="post_class_input">
				{difficultyLevelOptions.map(difficulty =>
					(<option value={difficulty.value}>{difficulty.key}</option>))
				}
			</select>
					</div>
					{textFields.map(field =>
						(<div className="post_class_item" key={field.key}>
							<span>{field.label}</span>
							<input
								placeholder={field.placeholder}
								autoFocus={field.autoFocus}
								className="post_class_input"
								onChange={this.handleChange.bind(this, field.key)}
								type={field.type}
								value={this.state[field.key]}
								id={field.id}
								min={0}
							/>
						</div>))
					}
					{
            // dateTimeFields.map(field =>
						// (<div className="post_class_item" key={field.key}>
						// 	<span>{field.label}</span>
						// 	<DatePicker className="post_class_input" value={this.state[field.key]} onChange={this.handleTimeChange.bind(this, field.key)} />
						// </div>))
            dateTimeFields.map(field =>
						(<div className="post_class_item" key={field.key}>
							<span>{field.label}</span>
							<Datetime locale="de" className="post_class_input" value={this.state[field.key]} onChange={this.handleTimeChange.bind(this, field.key)} />
						</div>))
					}
						<button type="submit" className="postclass_button" onClick={this.handleClick.bind(this)}>Submit</button>
				</div>

      </div>
    );
  }
}

PostClass.propTypes = propTypes;

export default PostClass;
