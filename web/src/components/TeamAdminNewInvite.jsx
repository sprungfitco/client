import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import PackageContainer from './PackageContainer'
import { createTeam, senNewInvites } from '../actions/TeamAdminActions'

class TeamAdminNewInvite extends Component {
  constructor (props) {
    super(props);
    this.sendInvite = this.sendInvite.bind(this);
    this.addRow = this.addRow.bind(this);
    this.state = {
      rows:[0], 
      emailList: []
    };
  }


  handleChange(key, e) {
    let { emailList } = this.state;
    emailList[key] = e.currentTarget.value;

    this.setState({emailList});
  }

  sendInvite = () => {
    const { dispatch } = this.props;
    dispatch(senNewInvites(this.state.emailList))
  }

  addRow = () => {
    var rows = this.state.rows
    rows.push(rows.length)
    this.setState({rows: rows})
  }

  removeEmailFromList = (key) => {
    if(key !== 0) {
      let { emailList, rows } = this.state;
      this.setState({ 
        emailList: emailList.splice(key),
        rows: rows.splice(key)

      })
    }
  }
  

  render () {
    return (
      <div>
        <table className="table table-borderless">
          <thead>
          <tr>
            <th scope="col" className="row_90"><span className="new_invite_email">Email</span></th>
            <th scope="col" className="row_10"/>
          </tr>
          </thead>
          <tbody>
          { this.state.rows.map( r =>
              <tr>
                <th><input className="new_invite_input" type="email" placeholder="Ex. johnsmith@gmail.com" onChange={this.handleChange.bind(this, r)}/></th>
                <th><i onClick={() => this.removeEmailFromList(r)}className="material-icons md-24">clear</i></th>
              </tr>
            )
          }
              <th className="new_invite_add_row" onClick={this.addRow}><i className="material-icons md-24">add</i><span>Add another member</span></th>
            <tr>
            </tr>
          </tbody>
        </table>
        <div className="purchase_button_wrapper">
          <button className="purchase_button button button--company" onClick={this.sendInvite}>
            Send Invitations
          </button>
        </div>
      </div>
    );
  }
}

export default TeamAdminNewInvite;



