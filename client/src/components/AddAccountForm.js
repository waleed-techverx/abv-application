import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Form, Button } from 'react-bootstrap';
import { validateFields } from '../utils/common';
import { Grid} from '@material-ui/core'

class AddAccountForm extends React.Component {
  state = {
    account_no: '',
    bank_name: '',
    code: '',
    errorMsg: ''
  };

  componentDidUpdate(prevProps, prevState) {
    if (!_.isEqual(prevProps.errors, this.props.errors)) {
      this.setState({ errorMsg: this.props.errors });
    }
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  handleAddAccount = (event) => {
    event.preventDefault();
    const { account_no, bank_name, code } = this.state;
    const fieldsToValidate = [{ account_no }, { bank_name }, { code }];

    const allFieldsEntered = validateFields(fieldsToValidate);
    if (!allFieldsEntered) {
      this.setState({
        errorMsg: {
          add_error: 'Please enter all the fields.'
        }
      });
    } else {
      this.props.handleAddAccount(this.state);
    }
  };

  render() {
    const { account_no, bank_name, code, errorMsg } = this.state;
    const formlabelStyle = { fontSize: '18px'}
  
    return (
      <Grid>
          <Form onSubmit={this.handleAddAccount} className="account-form">
          {errorMsg && errorMsg.add_error && (
            <p className="errorMsg centered-message">{errorMsg.add_error}</p>
          )}
          <br></br>
          <Form.Group controlId="type">
            <b><Form.Label style={formlabelStyle}>Add account</Form.Label></b>
            
          </Form.Group>
          <hr />
          <Form.Group controlId="accnt_no">
            <b> <Form.Label style={formlabelStyle}>Account number: </Form.Label></b>
            <Form.Control
              type="text"
              name="account_no"
              placeholder="Enter your account number"
              value={account_no}
              onChange={this.handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="accnt_no">
            <b><Form.Label style={formlabelStyle}>Bank name: </Form.Label></b>
            <Form.Control
              type="text"
              name="bank_name"
              placeholder="Enter your bank name"
              value={bank_name}
              onChange={this.handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="code">
            <b><Form.Label style={formlabelStyle}>Code:</Form.Label></b>
            <Form.Control
              type="text"
              name="code"
              placeholder="Enter new code"
              value={code}
              onChange={this.handleInputChange}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Grid>
      
    );
  }
}

const mapStateToProps = (state) => ({
  errors: state.errors
});

export default connect(mapStateToProps)(AddAccountForm);