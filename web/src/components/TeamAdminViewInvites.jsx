import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { removeInvitation, getPendingInvitations } from '../actions/TeamAdminActions'
import PropTypes from 'prop-types'
import { classCategories } from '../constants/ClassCategories'

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  invites: PropTypes.array.isRequired
};

class TeamAdminViewInvites extends Component {
  constructor (props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps)
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(getPendingInvitations());
  }

  deactivateUser = (id) => {
    const { dispatch } = this.props;
    dispatch(removeInvitation(id));
  }

  render () {
    const { invites } = this.props.team;
    
    return (
      <div>
        <table className="table table-borderless">
          <thead>
          <tr>
            <th scope="col"><span className="new_invite_name">Email</span></th>
          </tr>
          </thead>
          <tbody>
          {invites != null &&
            invites.map( invite =>
              <tr>
                <th><span className="team_member_email">{invite.email}</span></th>
                <th><span className="delete_invitation" onClick={() => this.deactivateUser(invite.userId)}>Delete Invitation</span></th>
              </tr>
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

export default TeamAdminViewInvites;



