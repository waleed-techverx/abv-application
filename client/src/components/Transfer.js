import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Form } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { resetErrors } from '../actions/errors';
import { validateFields } from '../utils/common';
import { maskNumber } from '../utils/mask';
import { Grid } from '@material-ui/core'

import {
    initiateTransferAmount
  } from '../actions/transactions';


class Transfer extends React.Component {
  state = {
    account: this.props.account,
    successMsg: '',
    errorMsg: '',
    otaccount_no: '',
    amount: '',
    isSubmitted: false
  };

  componentDidUpdate(prevProps) {
    if (!_.isEqual(prevProps.errors, this.props.errors)) {
      this.setState({ errorMsg: this.props.errors });
    }
  }

  componentWillUnmount() {
    this.props.dispatch(resetErrors());
  }

  handleAmountChange = (event) => {
    this.setState({ amount: event.target.value });
  };

  handleUpdateAccount = (account_id, amount, otaccount_no) => {
    const fieldsToValidate = [{ account_id, amount , otaccount_no}];
    let { account } = this.state;
    const allFieldsEntered = validateFields(fieldsToValidate);
    if (!allFieldsEntered || amount === "" || otaccount_no === "") {
      this.setState({
        errorMsg: {
            update_error: 'Please enter all the fields.'
          }
      });
    } else {
      let { total_balance } = account;
      amount = +amount;
      total_balance = +total_balance;
      if (amount <= total_balance) {
        this.setState({ isSubmitted: true });
        this.props.dispatch(initiateTransferAmount(account_id, amount, otaccount_no))
        .then((response) => {
            if (response.success) {
            this.setState({
                successMsg: 'Transferred Successfully',
                errorMsg: ''
            });
            }
        });
      }else{
        this.setState({
            errorMsg: {
                update_error: 'You do not have sufficient Balance to transfer'
              }
          }); 
      }
      
    }
  };

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  render() {
    const { account } = this.props
    const formlabelStyle = { fontSize: '18px'}

    const account_no = account.account_no ? maskNumber(account.account_no) : '';
    const account_id = account._id
    const span2Style = { fontSize: '18px', padding: '5px'}

    const {
      otaccount_no,
      amount,
      errorMsg,
      successMsg,
      isSubmitted
    } = this.state;
    return (
      <Grid>
          <br></br>
            <b><p style={formlabelStyle}>Transfer Amount</p></b>
            
          <hr />
          <Form>
                {errorMsg && errorMsg.update_error ? (
                    <p className="errorMsg centered-message">
                      {errorMsg.update_error}
                    </p>
                  ) : (
                    isSubmitted && (
                      <p className="successMsg centered-message">{successMsg}</p>
                    )
                  )}
              <Form.Group controlId="acc_no">

                <b><Form.Label style={formlabelStyle}>Account number:</Form.Label></b>
                <span style={span2Style} className="label-value">{account && account_no}</span>
              </Form.Group>
              <Form.Group controlId="bank_name">
                <b><Form.Label style={formlabelStyle}>Bank name:</Form.Label></b>
                <span style={span2Style} className="label-value">
                  {account && account.bank_name}
                </span>
              </Form.Group>
              <Form.Group controlId="otaccount_no">
                  <b><Form.Label style={formlabelStyle}>Account No</Form.Label></b>
                    <Form.Control
                      type="text"
                      name="otaccount_no"
                      value={otaccount_no}
                      placeholder="Enter Account No"
                      onChange={this.handleInputChange}
                    />
              </Form.Group>
              <Form.Group controlId="amount">
              <b><Form.Label style={formlabelStyle}>Amount:</Form.Label></b>
              <Form.Control
                type="number"
                placeholder={`Enter amount to Transfer`}
                value={this.state.amount}
                onChange={this.handleAmountChange}
              />
            </Form.Group>
            
              <Button
                variant="primary"
                onClick={() => this.handleUpdateAccount(account_id, amount, otaccount_no)}
              >
                Transfer Amount
              </Button>
            </Form>
            
      </Grid>
     

      
    );
  }
}

const mapStateToProps = (state) => ({
  errors: state.errors,
  account: state.account,
});

export default connect(mapStateToProps)(Transfer);