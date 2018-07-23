import React from 'react';

const Purchasing = props => (
  <div className="purchasing_container">
    <div className="purchasing_form">
      <div className="purchasing_title">Purchase Credits</div>
      <div className="current_credits_wrapper">
        <div className="current_credits_label">Current Number of Credits</div>
        <div className="current_credits_value">2,872 Credits</div>
      </div>
      <div>
          <div className="package_options_label">Select package</div>
            
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
      </div>
      <div className="purchase_button_wrapper">
        <button className="purchase_button button button--company">Purchase Credits</button>
      </div>
    </div>
  </div>

);

export default Purchasing;
