import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import PackageContainer from './PackageContainer'
import { purchaseCredits } from '../actions/purchaseCreditActions'
import TeamAdminNewInvite from './TeamAdminNewInvite'
import TeamAdminViewMembers from './TeamAdminViewMembers'
import TeamAdminViewInvites from './TeamAdminViewInvites'
import { createTeam, getTeam, setAutoRenew, addCreditsToTeam, saveAdminCard, deleteCard, addEditTeamAdress, getTeamAdress } from '../actions/TeamAdminActions'
import { fetchCreditCard, getTeamAdminCreditInfo } from '../actions/LessonsActions';
import { Modal } from 'react-bootstrap';
import StripeCheckout from '../lib/StripeCheckout';
import PropTypes from 'prop-types';
import U from 'underscore';

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  team: PropTypes.object.isRequired,
  teamMembers: PropTypes.object.isRequired,
};

class TeamAdmin extends Component {
  constructor (props) {
    super(props);
    this.handleEnter = this.handleEnter.bind(this);
    this.state = {
      showInvite: false, 
      showMembers: false, 
      showPending: false, 
      hasTeam: false, 
      teamName: "",
      shouldEnableAutoRenew: false,
      thresholdBalance: 0,
      rechargeAmount: 0,
      creditsAmount: 0,
      showAddFundsModal: false,
      showAutoConfigureModal: false,
      ccDetails: {},
      currentVisibleLink: 'dashboard',
      changeCardDetails: false,
      showAddresModal: false,
      teamAdress: {}
    };
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(getTeam());
  }
 
  componentWillReceiveProps(nextProps) {
    const { team } = nextProps;
    const { error } = team;

    getTeamAdress(team.id).catch(res => {
      const data = JSON.parse(res.response.error);
      if(data.data.getTeamAddress) {
        this.setState({ teamAdress: data.data.getTeamAddress });
      } else {
        this.setState({ teamAdress: {} });
      }
    })

    if (error != null) {
      this.setState ({ hasTeam: false})
    } else {
      this.setState ({ hasTeam: true })
      if (!this.state.showInvite && !this.state.showPending && !this.state.showMembers) {
        this.setState ({ showInvite: true})
      }
    }

  }

  receiveTeamAdminCCInfo() {
    getTeamAdminCreditInfo().catch(res => {
      if (res.response.status === 200) {
        const data = JSON.parse(res.response.error);
        if (data.data && data.data.getCard) {
          console.log("addind new card")
          this.setState({ ccDetails: data.data.getCard})
        } else {
          this.setState({ ccDetails: {} });
        }
      }
    });
  }

  componentDidMount() {
    if (!this.state.hasTeam) {
      document.addEventListener('keypress', this.handleEnter, false);
    }

    this.receiveTeamAdminCCInfo();
  }

  handleChange(e) {
    this.setState({
      teamName: e.currentTarget.value,
    });
  }

  handleEnter(e) {
    if (e.keyCode === 13) {
      e.preventDefault();
      const { dispatch } = this.props;
      dispatch(createTeam(this.state.teamName, 0));
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keypress', this.handleEnter, false);
  }

  switchSelection(selection) {
    if (this.state.hasTeam) {
      if (selection === 1) {
        this.setState({
          showInvite: true,
          showMembers: false,
          showPending: false
        })
      }
      else if (selection === 2) {
        this.setState({
          showInvite: false,
          showMembers: true,
          showPending: false
        })
      }
      else if (selection === 3) {
        this.setState({
          showInvite: false,
          showMembers: false,
          showPending: true
        })
      }
    }
  }

  setAutoRenewCheck = (e) => {
    if(e.target.value === 'true') {
      this.setState({ shouldEnableAutoRenew: true });
    } else {
      this.setState({ shouldEnableAutoRenew: false });
    }
  }

  setThresholdBalance = (e) => {
    this.setState({ thresholdBalance: e.target.value });
  }

  setRechargeAmount = (e) => {
    this.setState({ rechargeAmount: e.target.value });
  }

  submitAutoRenewDetails = (e) => {
    e.preventDefault();
    const { shouldEnableAutoRenew, thresholdBalance,  rechargeAmount } = this.state;
    this.props.dispatch(setAutoRenew({ shouldEnableAutoRenew, thresholdBalance, rechargeAmount}));
    this.closeAutoRechargeModal();
  }

  setCreditsAmount = (e) => {
    this.setState({ creditsAmount: e.target.value });
  }

  addCreditsToTeam = () => {
    const { team: { id }, dispatch } = this.props;
    const { creditsAmount } = this.state;
    dispatch(addCreditsToTeam({id, creditsAmount}));
    this.closeAddFundsModal();
  }

  toggleAddFundsModal = (e) => {
    this.setState({ showAddFundsModal: !this.state.showAddFundsModal });
  }

  closeAddFundsModal = (e) => {
    this.setState({ showAddFundsModal: false });
  }

  closeAddressModal = (e) => {
    this.setState({ showAddresModal: false });
  }

  closeAutoRechargeModal = (e) => {
    this.setState({ showAutoConfigureModal: false });
  }

  toggleAutoRechargeModal = (e) => {
    this.setState({ showAutoConfigureModal: !this.state.showAutoConfigureModal });
  }

  toggleAdrressModal = (e) => {
    this.setState({ showAddresModal: !this.state.showAddresModal });
  }
  
  onToken = () => token => {
    this.props.dispatch(deleteCard());
    this.props.dispatch(saveAdminCard(token.id));
    this.receiveTeamAdminCCInfo();
  };

  addNewCard = () => token => {
    this.props.dispatch(saveAdminCard(token.id));
    this.receiveTeamAdminCCInfo();
  }

  changeLink = (value) => {
    this.setState({ currentVisibleLink: value });
  }

  changeCreditCard = () => token => {
    const { team: { id }} = this.props;
    const { creditsAmount } = this.state;
    this.props.dispatch(deleteCard(token.id, id, creditsAmount));
    this.closeAddFundsModal();
  }

  addressInputHandler = (event) => {
    const inputValue = event.target.value;
    switch(event.target.name) {
      case 'country':
        this.setState({ country: inputValue });
      break;
      case 'streetNo':
        this.setState({ streetNo: inputValue });
      break;
      case 'streetName':
        this.setState({ streetName: inputValue });
      break;
      case 'apartmentNo':
        this.setState({ apartmentNo: inputValue });
      break;
      case 'city':
        this.setState({ city: inputValue });
      break;
      case 'zipcode':
        this.setState({ zipcode: inputValue });
      break;
      case 'state':
        this.setState({ state: inputValue });
      break;
    }
  }

  addEditAdrress = (event) => {
    event.preventDefault();
    const { country, streetNo, streetName, apartmentNo, city, zipcode, state } = this.state;
    const values = { country, streetNo, streetName, apartmentNo, city, zipcode, state };
    this.props.dispatch(addEditTeamAdress(values));
    this.closeAddressModal(event);
  }

  render() {
    const { currentVisibleLink, ccDetails, shouldEnableAutoRenew, thresholdBalance, teamAdress,
      creditsAmount, showAddFundsModal, showAutoConfigureModal, changeCardDetails, showAddresModal } = this.state;
    const { team } = this.props;
    const { error } = team;
    const STRIPE_PUBLISHABLE = process.env.NODE_ENV === 'production'
   ? 'pk_live_6gQlAo5usMUINliNwfGhoMp7'
   : 'pk_test_rVLBWa4bGoVM3f0RRFAyyWDG';

    return(
    <div className="team-admin-container">
        <Modal show={showAutoConfigureModal} onHide={this.closeAutoRechargeModal}>
          <Modal.Header closeButton>
             <Modal.Title>Configure Auto-Recharge</Modal.Title> 
          </Modal.Header>
           <Modal.Body>
            <p> <small>We’ll only charge your payment method when your balance falls bellow the amount you set.</small></p>
            <div className="width100P">
            
              <form>
                
                <fieldset className="form-group">
                  <p>Auto Recharge</p>
                  <div className="form-check">
                    <label className="form-check-label">
                      <input className="form-check-input" id="optionsRadios1" type="radio" name="optionsRadios"  value={false} onChange = {this.setAutoRenewCheck} checked={!shouldEnableAutoRenew} />Disabled
                    </label>
                  </div>
                  <div className="form-check">
                    <label className="form-check-label">
                      <input className="form-check-input" id="optionsRadios2" type="radio" name="optionsRadios"  value={true} onChange = {this.setAutoRenewCheck} checked={shouldEnableAutoRenew} />Enabled
                    </label>
                  </div>                
                </fieldset>
                
                
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">If The Balance Falls Below  </label>
                  <input className="form-control" id="" defaultValue={team.autoRenewThreshold} type="number" aria-describedby="emailHelp" onChange={this.setThresholdBalance} placeholder="$" />
                </div>
                
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Recharge The Balance to  </label>
                  <input className="form-control" id="" type="number" defaultValue={team.autoRenewAmount} aria-describedby="emailHelp" placeholder="$" onChange={this.setRechargeAmount}/>
                </div>
                
                {
                  ccDetails ?  
                  <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Payment Method  </label>
                    <input className="form-control" id="" type="text" disabled="true" aria-describedby="emailHelp" value={`Visa **** **** **** ${ccDetails.lastFour}`} />
                  </div> : null
                }         
              </form>
            
            
            </div>
           </Modal.Body>
           <Modal.Footer>
             <button type="button" className="btn btn-primary width100P" onClick={this.submitAutoRenewDetails}>Save</button>
           </Modal.Footer>
        </Modal>
        <Modal show={showAddFundsModal} onHide={this.closeAddFundsModal}>
          <Modal.Header closeButton>
            <Modal.Title>Add Funds</Modal.Title>
          </Modal.Header>  
         <Modal.Body>
            <p> <small>Specify how much to add your balance.</small></p>
            <div className="width100P">
      
              <form>
                <div className="form-group">
                  <label for="exampleInputEmail1">Amount to Add  </label>
                  <input className="form-control" value={creditsAmount} id="" type="number" aria-describedby="emailHelp" placeholder="$" onChange={this.setCreditsAmount} />
                </div>
                
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Payment Method  </label>
                  <input className="form-control" id="" type="text" disabled="true" aria-describedby="emailHelp" value={`Visa **** **** **** ${ccDetails.lastFour}`} />
                </div>           
              </form>   
            </div>
         </Modal.Body>
         <Modal.Footer> 
           <div className="width100P">
            <StripeCheckout
              amount={creditsAmount*100}
              token={this.changeCreditCard()}
              buttonLabel='Change Card and Add Funds'
              currency="USD"
              stripeKey={STRIPE_PUBLISHABLE} />   
           </div>    
           <span>OR</span>
            <button type="button" className="btn btn-primary width100P" onClick={this.addCreditsToTeam}>Add Funds</button> 
            </Modal.Footer>
        </Modal>

         <Modal show={showAddresModal} onHide={this.closeAddressModal}>
          <Modal.Header closeButton>
            <Modal.Title>Service Address</Modal.Title>
          </Modal.Header>  
         <Modal.Body>
            <p> <small>Your service address is the location from where you consume Sprung services</small></p>
            <div className="width100P">
      
             <form onSubmit={this.addEditAdrress}>
          
                <div className="form-group">
                   <label for="exampleSelect1">Country</label>
                   <input className="form-control" defaultValue={teamAdress.country} name="country" type="text" onChange={this.addressInputHandler}  placeholder="Country" required required />
                </div>        
                <div className="form-group">
                          <label for="exampleInputEmail1">State / Province / Region  </label>
                          <input className="form-control" defaultValue={teamAdress.state} type="text" name="state" onChange={this.addressInputHandler} required />
                        </div>        
                <div className="form-group">
                  <label for="exampleInputEmail1">Street No</label>
                  <input className="form-control" type="text" defaultValue={teamAdress.streetNo} name="streetNo" onChange={this.addressInputHandler} required />
                </div>
                <div className="form-group">
                          <label for="exampleInputEmail1">Street Name</label>
                          <input className="form-control" type="text" defaultValue={teamAdress.streetName} name="streetName" onChange={this.addressInputHandler} required />
                        </div>
                <div className="form-group">
                          <label for="exampleInputEmail1">Apartment No</label>
                          <input className="form-control" type="text" defaultValue={teamAdress.apartmentNo} name="apartmentNo" onChange={this.addressInputHandler} required />
                        </div>
                <div className="form-group">
                          <label for="exampleInputEmail1">City</label>
                          <input className="form-control" type="text" defaultValue={teamAdress.city} name="city"  onChange={this.addressInputHandler} required />
                        </div>
                <div className="form-group">
                          <label for="exampleInputEmail1">Zipcode  </label>
                          <input className="form-control" type="number" defaultValue={teamAdress.zipcode} name="zipcode"  onChange={this.addressInputHandler} required />
                        </div>          
                </form>
            </div>
         </Modal.Body>
         <Modal.Footer> 
           <button type="submit" className="btn btn-primary width100P" onClick={this.addEditAdrress}>Confirm</button>
          </Modal.Footer>
        </Modal>



      <div className="app sidebar-mini rtl">
        <aside className="app-sidebar">
       
          <ul className="app-menu">
             <li>
              <a className="app-menu__item active" href="javascript:void(0)" onClick={(e) => this.changeLink('dashboard')}>
              <i className="app-menu__icon fa fa-dashboard"></i><span className="app-menu__label">Dashboard</span></a>
            </li>
            <li>
              <a className="app-menu__item" href="javascript:void(0)">
              <i className="app-menu__icon fa fa-money"></i><span className="app-menu__label">Billing</span></a>
            </li>
            <li>
              <a className="app-menu__item" href="javascript:void(0)">
              <i className="app-menu__icon fa fa-pie-chart"></i><span className="app-menu__label">Usage</span></a>
            </li>
            <li>
              <a className="app-menu__item" href="javascript:void(0)" onClick={(e) => this.changeLink('members')}>
              <i className="app-menu__icon fa fa-user "></i><span className="app-menu__label">Members</span></a>
            </li>
          </ul>
        </aside>
        <div className="app-content">
          
          {
            currentVisibleLink === 'dashboard' ?
            <div className="row">
              <div className="col-md-4">
                <div className="tile">
                  <div className="tile-body">
                    <div className="width100P"><p>Current Balance</p></div>
                    <div className="width100P"><h4>${team.credits/100}</h4></div>
                    <div className="width100P"><p><small>remaining in your account</small></p></div>
                    <div className="width100P"><p>We’ll disable your account at $0.00</p></div>
                    {
                      U.isEmpty(ccDetails) ? 
                      <StripeCheckout
                        amount={creditsAmount}
                        token={this.addNewCard()}
                        buttonLabel='Add Card'
                        currency="USD"
                        stripeKey={STRIPE_PUBLISHABLE} /> 
                        :
                    <div className="width100P"><button className="btn btn-primary width100P" type="button" onClick={this.toggleAddFundsModal}>Add Funds</button></div>
                    }
                    </div>
                </div>
              </div>  
              <div className="col-md-4">
                <div className="tile">
                  <div className="tile-body">
                    <div className="width100P"><p>Auto Recharge</p></div>
                    <div className="width100P"><h4>Enabled</h4></div>
                    <div className="width100P"><p><small>If the balance falls below ${team.autoRenewThreshold}, recharge the balance to ${team.autoRenewAmount}</small></p></div>
                    <div className="width100P"><p>Visa **** **** **** 4739</p></div>
                    <div className="width100P"><p><a href="#">Download Invoice</a></p></div>
                    <div className="width100P"><button className="btn  btn-outline-primary width100P" onClick={this.toggleAutoRechargeModal}>Configure Auto-Recharge</button></div>
                  </div>
                </div>
              </div>
              
              <div className="col-md-4">
                <div className="tile">
                  <div className="tile-body">
                    <div className="width100P"><p>Service Address</p></div>
                    <div className="width100P">
                      <p>
                      <small>{teamAdress.streetNo}  {teamAdress.streetName} {teamAdress.state} {teamAdress.zipcode} {teamAdress.city} {teamAdress.country}</small>
                      </p>
                    </div>       
                    <div className="width100P"><button className="btn  btn-outline-primary width100P" onClick={this.toggleAdrressModal}>Edit/Confirm Service Address</button></div>
                  </div>
                </div>
              </div>      
            </div> : null
          }
          {
            currentVisibleLink === 'members' ?
         
            <div className="team__admin__container">
              <div className="team__admin__form">
                <input placeholder="Team name" className="team__admin__title" onChange={this.handleChange.bind(this)} value={team != null ? team.name : ""}/>
                <div className="team__admin__options__wrapper">
                  <nav className="nav team__admin__nav">
                    <div className={this.state.showInvite ? "nav-link" +
                      " team__admin__nav__option__active" : "nav-link" +
                      " team__admin__nav__option"}
                       onClick={this.switchSelection.bind(this, 1)}> Invite members
                    </div>
                    <div className={this.state.showMembers ? "nav-link" +
                      " team__admin__nav__option__active" : "nav-link" +
                      " team__admin__nav__option"}
                       onClick={this.switchSelection.bind(this, 2)}>View Members
                    </div>
                    <div className={this.state.showPending ? "nav-link" +
                      " team__admin__nav__option__active" : "nav-link" +
                      " team__admin__nav__option"}
                       onClick={this.switchSelection.bind(this, 3)}>Pending Invitations
                    </div>
                  </nav>
                </div>
                {error}
                { this.state.showInvite && <TeamAdminNewInvite {...this.props}/> }
                { this.state.showMembers && <TeamAdminViewMembers {...this.props}/> }
                { this.state.showPending && <TeamAdminViewInvites {...this.props}/> }
              </div>
            </div> : null }
        </div>  
      </div>
    </div>
    );
  }
}

TeamAdmin.propTypes = propTypes;

export default TeamAdmin;

