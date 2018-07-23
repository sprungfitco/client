import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import PackageContainer from './PackageContainer'
import { purchaseCredits } from '../actions/purchaseCreditActions'

class PurchaseCredit extends Component {
  constructor (props) {
    super(props);
  }

  purchaseCredit = () => {
    // ToDo: Implement API call
  }
  render () {
    return (
      <div className="purchasing_container">
        <div className="purchasing_form">
          <div className="purchasing_title">Purchase Credits</div>
          <div className="current_credits_wrapper">
            <div className="current_credits_label">
              Current Number of Credits
            </div>
            <div className="current_credits_value">2,872 Credits</div>
          </div>
          <div>
            <div className="package_options_label">Select package</div>
            <PackageContainer/>
          </div>
          <div className="purchase_button_wrapper">
            <button className="purchase_button button button--company"
                    onClick={this.purchaseCredit}>
              Purchase Credits
            </button>
          </div>
        </div>
      </div>

    );
  }
}

export default PurchaseCredit;

