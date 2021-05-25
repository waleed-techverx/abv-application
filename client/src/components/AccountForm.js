import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  initiateGetAccntDetails,
  initiateAddAccntDetails,
  initiateUpdateAccntDetails
} from '../actions/account';
import {
  initiateWithdrawAmount,
  initiateDepositAmount,
} from '../actions/transactions';
import { resetErrors } from '../actions/errors';
import { validateFields } from '../utils/common';
import { maskNumber } from '../utils/mask';
import AddAccountForm from './AddAccountForm';
import { Grid } from '@material-ui/core'


class AccountForm extends React.Component {
  state = {
    amount: '',
    account: this.props.account,
    account_no: '',
    editAccount: false,
    code: '',
    errorMsg: '',
    successMsg: '',
    isSubmitted: false

  };

  componentDidMount() {
    const { email } = this.props;
    if (email) {
      this.props.dispatch(initiateGetAccntDetails());
    }
  }

  componentWillUnmount() {
    this.props.dispatch(resetErrors());
  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(prevProps.account, this.props.account)) {
      this.setState({ account: this.props.account });
    }
    if (!_.isEqual(prevProps.errors, this.props.errors)) {
      this.setState({ errorMsg: this.props.errors });
    }
  }

  handleUpdateAccount = (code) => {
    const fieldsToValidate = [{ code }];

    const allFieldsEntered = validateFields(fieldsToValidate);
    if (!allFieldsEntered) {
      this.setState({
        errorMsg: {
          update_error: 'Please enter code.'
        }
      });
    } else {
      this.setState({ isSubmitted: true });
      this.props.dispatch(initiateUpdateAccntDetails(code))
      .then((response) => {
        if (response.success) {
        this.setState({
            successMsg: 'Account Updated Successfully',
            errorMsg: ''
        });
        }
    });
    }
  };

  handleAmountChange = (event) => {
    this.setState({ amount: event.target.value });
  };

  handleEditAccount = (event) => {
    event.preventDefault();
    this.setState((prevState) => ({ editAccount: !prevState.editAccount }));
  };

  handleInputChange = (event) => {
    this.setState({
      code: event.target.value
    });
  };

  handleOnSubmit = (event) => {
    event.preventDefault();
    let { amount, account } = this.state;

    const { selectedType } = this.props;
    const fieldsToValidate = [{ amount }];

    const allFieldsEntered = validateFields(fieldsToValidate);
    if (!allFieldsEntered) {
      this.setState({
        errorMsg: {
          [selectedType === 'withdraw'
            ? 'withdraw_error'
            : 'add_error']: 'Please enter an amount.'
        }
      });
    } else {
      let { total_balance } = account;
      amount = +amount;
      total_balance = +total_balance;
      if (selectedType === 'withdraw' && amount <= total_balance) {
        this.props.dispatch(initiateWithdrawAmount(account._id, amount));
        this.setState({
          errorMsg: ''
        });
      } else if (selectedType === 'deposit') {
        this.props.dispatch(initiateDepositAmount(account._id, amount));
        this.setState({
          errorMsg: ''
        });
      } else {
        this.setState({
          errorMsg: {
            [selectedType === 'withdraw'
              ? 'withdraw_error'
              : 'add_error']: "You don't have enough balance in your account"
          }
        });
      }
    }
  };

  handleAddAccount = (account) => {
    const { account_no, bank_name, code } = account;
    this.props
      .dispatch(initiateAddAccntDetails(account_no, bank_name, code))
      .then(() => this.props.dispatch(initiateGetAccntDetails()));
  };

  render() {
    const { selectedType } = this.props;
    const { editAccount, code, errorMsg, account , successMsg, isSubmitted} = this.state;
    const account_no = account.account_no ? maskNumber(account.account_no) : '';
    const type = selectedType.charAt(0).toUpperCase() + selectedType.slice(1);

  
    const formlabelStyle = { fontSize: '18px'}
    const h3Style = { fontSize: '18px', margin: '10px'}
    const spanStyle = { fontSize: '18px', padding: '30px'}
    const span2Style = { fontSize: '18px', padding: '5px'}



    return account_no ? (
      editAccount ? (

        <Grid>
            <Grid align='center'>
                <br></br>
                <h3 style={h3Style}>
                  Account details
                  <span style={spanStyle} className="label-value"><a 
                    
                    href="/#"
                    className="edit-account"
                    onClick={this.handleEditAccount}
                  >
                    Go Back
                  </a></span>
                  
                </h3>
                
               
                  <hr />
            </Grid>
            
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
              <Form.Group controlId="code">
                <b> <Form.Label style={formlabelStyle}>code:</Form.Label></b>
                <span style={span2Style} className="label-value">{account && account.code}</span>
                <Form.Control
                  type="text"
                  placeholder="Enter new code"
                  value={code}
                  onChange={this.handleInputChange}
                />
              </Form.Group>
              <Button
                variant="primary"
                onClick={() => this.handleUpdateAccount(code)}
              >
                Update details
              </Button>
            </Form>
        </Grid>
      ) : (

        <Grid>
          {errorMsg && errorMsg.withdraw_error && (
            <p className="errorMsg">{errorMsg.withdraw_error}</p>
          )}
          {errorMsg && errorMsg.add_error && (
            <p className="errorMsg">{errorMsg.add_error}</p>
          )}
          
          <Form onSubmit={this.handleOnSubmit} className="account-form">
            <Grid align='center'>
              <br></br>
              <Form.Group controlId="type">
                <b><Form.Label style={formlabelStyle}>{type}</Form.Label></b>
                <span style={spanStyle} className="label-value"><a 
                    
                    href="/#"
                    className="edit-account"
                    onClick={this.handleEditAccount}
                  >
                    Edit Account Details
                  </a></span>
              </Form.Group>
            </Grid>
            
            <hr />
            <Form.Group controlId="accnt_no">
              <b><Form.Label style={formlabelStyle}>Account number: </Form.Label></b>
              <span style={span2Style} className="label-value">{account && account_no}</span>
            </Form.Group>
            <Form.Group controlId="accnt_no">
              <b><Form.Label style={formlabelStyle}>Available balance: </Form.Label></b> 
              <span style={span2Style} className="label-value">
                {account && account.total_balance}
              </span>
            </Form.Group>
            <Form.Group controlId="amount">
              <b><Form.Label style={formlabelStyle}>Amount:</Form.Label></b>
              <Form.Control
                type="number"
                placeholder={`Enter amount to ${selectedType}`}
                value={this.state.amount}
                onChange={this.handleAmountChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Grid>
        
      )
    ) : (
      <AddAccountForm handleAddAccount={this.handleAddAccount} />
    );
  }
}

const mapStateToProps = (state) => ({
  email: state.auth && state.auth.email,
  account: state.account,
  errors: state.errors
});

export default connect(mapStateToProps)(AccountForm); 