import React, { Component } from 'react';
import PropTypes from 'prop-types'
import 'bootstrap/dist/css/bootstrap.css';
import { classCategories } from '../constants/ClassCategories'

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  users: PropTypes.object.isRequired
};

class Trainers extends Component {

  render() {
    console.log(this.props);
    return (
      <div>
        <table className="table">
          <thead className="thead-light">
          <tr>
            <th scope="col">ID</th>
            <th scope="col">First</th>
            <th scope="col">Last</th>
            <th scope="col">Mobile</th>
          </tr>
          </thead>
          <tbody>
          {this.props.users.trainers.map( trainer =>
            (<tr>
              <th scope="row">{trainer.id}</th>
              <td>{trainer.firstName}</td>
              <td>{trainer.lastName}</td>
              <td>{trainer.mobileNo}</td>
            </tr>
            )
          )
          }
          </tbody>
        </table>
      </div>
    )
  }
}

export default Trainers;