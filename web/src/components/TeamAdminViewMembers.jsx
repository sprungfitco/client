import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import PackageContainer from './PackageContainer'
import { deactivateTeamMember, getTeamMembers } from '../actions/TeamAdminActions'

class TeamAdminViewMembers extends Component {
  constructor (props) {
    super(props);
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(getTeamMembers());
  }

  deactivateUser(id){
    const { dispatch } = this.props;
    dispatch(deactivateTeamMember(id));
  }

  render () {
    const { teamMembers } = this.props.team
    return (
      <div>
        <table className="table table-borderless">
          <thead>
          <tr>
            <th scope="col"><span className="new_invite_email">Full Name</span></th>
            <th scope="col"><span className="new_invite_name">Email</span></th>
            <th scope="col"/>
          </tr>
          </thead>
          <tbody>
          {teamMembers != null &&
            this.props.team.teamMembers.map( member =>
              (<tr>
                  <th><span className="team_member_name"></span></th>
                  <th><span className="team_member_email">{member.email}</span></th>
                  <th><span className="team_member_action" onClick={this.deactivateUser.bind(this, member.userId)}>Deactivate member</span></th>
                </tr>
              )
            )
          }

          </tbody>
        </table>
        <div className="purchase_button_wrapper">
        </div>
      </div>
    );
  }
}

export default TeamAdminViewMembers;



