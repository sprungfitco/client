import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';

class PackageContainer extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <form>
        <div className="package">
          <div className="package_description">
            3,000 Credits
            <div className="package_subdescription">
              Book 100-500 Classes per Month for 1 Year. <br />
              For 25 users.
            </div>
          </div>
          <div className="package_value">$4,000</div>
          <label className="radio_button_container">
            <input type="radio" name="package1" value="3000" />
            <span className="selected"/>
          </label>
        </div>
        <div className="package">
          <div className="package_description">
            16,000 Credits
            <div className="package_subdescription">
              Book 400-2,000 Classes per Month for 1 Year. <br />
              For 25-250 users.
            </div>
          </div>
          <div className="package_value">$20,000</div>
          <label className="radio_button_container">
            <input type="radio" name="package1" value="2,000" />
            <span className="selected"/>
          </label>
        </div>
      </form>
    );
  }
}

export default PackageContainer;

