import React from 'react';
import { connect } from 'react-redux';
import PurchaseCredit from '../components/PurchaseCredit';

const PurchaseCreditContainer = props => <PurchaseCredit {...props} />;

const mapStateToProps = state => {
  const { router } = state;
  return {
    router
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatch
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseCreditContainer);
