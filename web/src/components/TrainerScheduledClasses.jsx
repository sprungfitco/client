import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { getMyScheduledClasses , removeClass} from '../actions/ClassActions';
import { sessionCategories } from '../constants/ClassCategories';

const propTypes = {
    dispatch: PropTypes.func.isRequired
};

class TrainerScheduledClasses extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scheduledClasses: []
        };
    }

    componentWillMount() {
        const { dispatch } = this.props;
        dispatch(getMyScheduledClasses());
    }

    componentWillReceiveProps(nextProps) {
        const { dispatch, scheduledClasses } = this.props;
        this.setState({ scheduledClasses: nextProps.scheduledClasses });
    }

    removeClass(classId) {
		const { dispatch } = this.props;
		dispatch(removeClass('', classId));
	}

    getSessionType(type) {
        switch (type) {
          case sessionCategories.Cardio:
          case sessionCategories.Hiit:
            return 'Cardio';
          case sessionCategories.Yoga:
          case sessionCategories.Hatha_Yoga:
          case sessionCategories.Kundalini_Yoga:
          case sessionCategories.Fast_Yoga:
            return 'Yoga';
          case sessionCategories.Meditation:
          case sessionCategories.Tm_Meditation:
            return 'Meditation';
          case sessionCategories.Dance:
          case sessionCategories.Zumba:
          case sessionCategories.Hip_Hop:
            return 'Dance';
          default:
            return 'Yoga';
        }
      }

      getClassTime(startTime) {
        let utcSeconds = startTime;
		let d = new Date(0); // The 0 there is the key, which sets the date to the epoch
	    d.setUTCSeconds(utcSeconds);
        let date = new Date(d).toDateString();
        let time = new Date(d).getHours() + ':' + new Date(d).getMinutes();
        date = (date.split(' ').slice(0,3)).join(' ')
        return(
           <span>{date} - {time}</span>
        );
      }

      renderSubcategories(categories) {
          if(categories) {
              const categoryList = Object.keys(categories).map(key => {
                return(
                    <a href="#" className="float-left margin-left-8px btn btn-default tag-green-line margin-top-M-5px" role="button">{categories[key]}</a>
                );
              });
              return categoryList
          }
      }

    renderScheduledClasses(classes) {
        if(classes) {
            const scheduledClassesList = Object.keys(classes).map(key => {
                return(
                <div className="width-100-p border-bottom-title padding-bottom-20px margin-top-18px">
                    <div className="width-100-p">
                        <div className="width-auto">
                            <div>{classes[key].title}</div>
                            <div className="conten_font"><span>{this.getClassTime(classes[key].startTime)}</span> • <span>{classes[key].durationInMin} Minutes</span></div>

                        </div>
                        <div className="float-right">
                            <a href="#" className=" btn btn-default big-green-btn width-auto" role="button"
                            onClick= {this.removeClass.bind(this, classes[key].id)}>Cancel class</a>
                        </div>
                    </div>
                    <div className="width-100-p margin-top-14px">
                        <a href="#" className="float-left margin-top-M-5px" role="button">{this.getSessionType(classes[key].catagory)}</a>
                        <div>
                        {classes[key].subCategories ?(Object.keys(classes[key].subCategories).length > 0
                        ? this.renderSubcategories(classes[key].subCategories)
                        : <div></div>) : <div></div>
                        }
                        </div>
                    </div>
                    <div className="width-100-p conten_font margin-top-8px ">{classes[key].description}</div>
                </div>
                );
            });
            return scheduledClassesList;
        }
    }

    render() {
        return (
            <div className="container ">
                <div className="row padding-bottom-20px">
                    <div className="col offset-md-3 col-lg-6 border-bottom-title padding-bottom-20px">
                        <div className="float-left ">
                            <div className="trainer_profile_page_profile_stuff_container ">
                                <div className="float-left  trainer_profile_page_trainer_title">My Scheduled Classes</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    {/* <div className="col offset-md-3 col-lg-6 margin-top-18px padding-bottom-20px ">
                        {/* <div className="width-100-p border-bottom-title padding-bottom-20px margin-top-18px">
                            <div className="width-100-p">
                                <div className="width-auto">
                                    <div>Sivananda Yoga</div>
                                    <div className="conten_font">Fri, May 23 - 11:30AM • 30 Minutes</div>

                                </div>
                                <div className="float-right">
                                    <a href="#" className=" btn btn-default big-green-btn width-auto" role="button">Cancel class</a>
                                </div>
                            </div>
                            <div className="width-100-p margin-top-14px">
                                <a href="#" className="float-left margin-top-M-5px" role="button">Yoga</a>
                                <a href="#" className="float-left margin-left-8px btn btn-default tag-green-line margin-top-M-5px" role="button">Personalized</a>
                                <a href="#" className="float-left margin-left-8px btn btn-default tag-gray-line margin-top-M-5px" role="button">Flexibility</a>
                                <a href="#" className="float-left margin-left-8px btn btn-default tag-gray-line margin-top-M-5px" role="button">Beginner</a>
                            </div>
                            <div className="width-100-p conten_font margin-top-8px ">Lorem Ipsum is simply dummy text of the printing and typesetting industry…</div>
                        </div>
                        <div className="width-100-p border-bottom-title padding-bottom-20px margin-top-18px">
                            <div className="width-100-p">
                                <div className="width-auto">
                                    <div>Sivananda Yoga</div>
                                    <div className="conten_font">Fri, May 23 - 11:30AM • 30 Minutes</div>

                                </div>
                                <div className="float-right">
                                    <a href="#" className=" btn btn-default big-green-btn width-auto" role="button">Cancel class</a>
                                </div>
                            </div>
                            <div className="width-100-p margin-top-14px">
                                <a href="#" className="float-left margin-top-M-5px" role="button">Yoga</a>
                                <a href="#" className="float-left margin-left-8px btn btn-default tag-green-line margin-top-M-5px" role="button">Personalized</a>
                                <a href="#" className="float-left margin-left-8px btn btn-default tag-gray-line margin-top-M-5px" role="button">Flexibility</a>
                                <a href="#" className="float-left margin-left-8px btn btn-default tag-gray-line margin-top-M-5px" role="button">Beginner</a>
                            </div>
                            <div className="width-100-p conten_font margin-top-8px ">Lorem Ipsum is simply dummy text of the printing and typesetting industry…</div>
                        </div> }
                </div> */}
                    <div className="col offset-md-3 col-lg-6 margin-top-18px padding-bottom-20px ">
                    {this.state.scheduledClasses ?(Object.keys(this.state.scheduledClasses).length > 0
                        ? this.renderScheduledClasses(this.state.scheduledClasses)
                        : <div>No scheduled classes.</div>) : <div>No scheduled classes.</div>
                    }
                </div>

            </div>
            </div >
        )
    }


}

TrainerScheduledClasses.propTypes = propTypes;

export default TrainerScheduledClasses;