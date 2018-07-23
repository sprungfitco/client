import PropTypes from 'prop-types';
import React, { Component } from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import '../../styles/react-big-calender.css';
import { getInstructorCalender , reserveSlot, deleteInstructorFreeSlot} from '../actions/TrainersActions';
import { Modal } from 'react-bootstrap';
import { getInstructorFreeSlots , getSession } from '../actions/ClassActions';
import { showClassDetail } from '../actions/trainerRoutingActions';

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
BigCalendar.momentLocalizer(moment); // or globalizeLocalizer

const propTypes = {
  dispatch: PropTypes.func.isRequired
};

class TrainerCalender extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      showAddFreeSlotsModal: false,
      showRemoveFreeSlotsModal : false,
      selectedSlot : {}
    }
  }

  toggleAddFreeSlotModal = (event, e) => {
    let data = (new Date(event.start).toLocaleString()).split(',');
    event.day = data[0];
    event.time = data[1];
    event.startTime = event.start.getTime() / 1000;
    event.duration = Math.round((((event.end - event.start) % 86400000) % 3600000) / 60000);
    this.setState({ showAddFreeSlotsModal: !this.state.showAddFreeSlotsModal , selectedSlot : event});
  }

  toggleRemoveFreeSlotModal = (event) => {
    this.setState({ showRemoveFreeSlotsModal: !this.state.showRemoveFreeSlotsModal , selectedSlot : event});
  }

  componentWillMount() {
    const { dispatch , userProfileInfo} = this.props;
    dispatch(getInstructorCalender(userProfileInfo.id));
    dispatch(getInstructorFreeSlots(userProfileInfo.id));
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch } = this.props;
    this.setState({ data: nextProps.trainerCalender });
    let calendar = [];
    let currentCalender = nextProps.trainerCalender;
    if (currentCalender) {
      for (let i in currentCalender) {
        let d = new Date(0);
        currentCalender[i].startDate = new Date(d.setUTCSeconds(currentCalender[i].startTime));
        d = new Date(0);
        currentCalender[i].endDate = new Date(d.setUTCSeconds(currentCalender[i].endTime));
        currentCalender[i].isFreeSlot = false;
        calendar.push(currentCalender[i]);
      }
    }
        //modify instructor free slots
        let instructorSlots = nextProps.instructorFreeSlots;
        if(instructorSlots) {
          for(let i in instructorSlots) {
            let slot = instructorSlots[i];
            let d = new Date(0);
            slot.startDate = new Date(d.setUTCSeconds(instructorSlots[i].startTime));
            d = new Date(0);
            slot.endDate = new Date(d.setUTCSeconds(instructorSlots[i].startTime) + (slot.durationInMin * 60000));
            slot.title = 'Free slot';
            slot.isFreeSlot = true;
            calendar.push(slot);
          }
        }

    this.setState({ trainerCalender: calendar });
    this.setState({showAddFreeSlotsModal : false});
    this.setState({ showRemoveFreeSlotsModal : false});
  }

  closeAddFreeSlotModal = (e) => {
		this.setState({ showAddFreeSlotsModal : false });
  }

  closeRemoveFreeSlotModal = (e) => {
    this.setState({ showRemoveFreeSlotsModal : false});
  }
  
  reserveSlot() {
    const { dispatch , userProfileInfo} = this.props;
		dispatch(reserveSlot(this.state.selectedSlot, userProfileInfo.id));
  }

  removeSlot() {
    const { dispatch , userProfileInfo} = this.props;
		dispatch(deleteInstructorFreeSlot(this.state.selectedSlot.slotId,userProfileInfo.id));
  }

  goToClassDescription = (e,event) =>  {
    event.preventDefault(); 
    const { dispatch } = this.props;
    if(!e.isFreeSlot) {
      dispatch(showClassDetail());
      dispatch(getSession(e.id));
    } else {
      this.toggleRemoveFreeSlotModal(e);
    }
  }
  handleDurationChange = (e) => {
    var slot = this.state.selectedSlot;
    slot.duration = e.currentTarget.value;
    this.setState({
      selectedSlot : slot
    });
  }

  eventStyleGetter(e, start, end, isSelected) {
    let backgroundColor = '#265985';
    let border =  '1px solid #265985';
    if(!e.isFreeSlot) {
      backgroundColor = '#31CF9E';
      border =  '1px solid #31CF9E';
     
    }
    let style = {
        backgroundColor: backgroundColor,
        border : border,
        zIndex : 999
    };
    return {
        style: style
    };
  }

  render() {
    const {showAddFreeSlotsModal, showRemoveFreeSlotsModal } = this.state;
    if (this.state.trainerCalender) {
      return (
        <div>
          <BigCalendar
            selectable
            events={this.state.trainerCalender}
            startAccessor='startDate'
            endAccessor='endDate'
            view='week'
            views={['week']}
            defaultDate={new Date()}
            formats={{ eventTimeRangeFormat: () => null }}
            onSelectSlot={
              this.toggleAddFreeSlotModal
            }
            eventPropGetter={(this.eventStyleGetter)}
            onSelectEvent={(this.goToClassDescription)}
          />
          <div className="trainer__form">
          <Modal id="reserve-modal" className="offered-classes-modal" show={showRemoveFreeSlotsModal} onHide={this.closeRemoveFreeSlotModal}>
              <Modal.Body>
                <div className="width-100-p conten_title_font">Remove slot</div>
                <div className="width-100-p conten_title_font margin-top-16px"></div>
                <div className="width-100-p conten_title_font ">Are you sure you want to remove this free slot?</div>
                <div className="width-100-p">
                  <a href="#" className=" btn btn-default big-green-btn margin-top-16px" role="button"
                 onClick={this.removeSlot.bind(this)} >Remove Slot</a>
                </div>
              </Modal.Body>
              {/* <Modal.Footer>
            			<button type="button" className="btn btn-primary width100P" onClick={this.addCreditsToTeam}>Add Funds</button>
          			</Modal.Footer> */}
            </Modal>
            <Modal id="reserve-modal" className="offered-classes-modal" show={showAddFreeSlotsModal} onHide={this.closeAddFreeSlotModal}>
              <Modal.Body>
                <div className="width-100-p conten_title_font">Reserve a slot</div>
                <div className="width-100-p conten_title_font margin-top-16px">Date :</div>
                <div className="width-100-p conten_title_font ">{this.state.selectedSlot.day}</div>
                <div className="width-100-p conten_title_font margin-top-16px">Time : </div>
                <div className="width-100-p conten_title_font ">{this.state.selectedSlot.time}</div>
                <div className="width-100-p conten_title_font margin-top-16px bottom-margin">Duration(Mins) : </div>
                <input type="number" className="form-control" id="slotDuration" name="duration" min="0"
                max="60"
                onChange={(e) => this.handleDurationChange(e)}
                value={this.state.selectedSlot.duration}/>
                <div className="width-100-p">
                  <a href="#" className=" btn btn-default big-green-btn margin-top-16px" role="button"
                 onClick={this.reserveSlot.bind(this)} >Reserve Slot</a>
                </div>
              </Modal.Body>
              {/* <Modal.Footer>
            			<button type="button" className="btn btn-primary width100P" onClick={this.addCreditsToTeam}>Add Funds</button>
          			</Modal.Footer> */}
            </Modal>
          </div>
        </div>

      )
    } else {
      return <div>No data</div>
    }

  }
}

TrainerCalender.propTypes = propTypes;

export default TrainerCalender;