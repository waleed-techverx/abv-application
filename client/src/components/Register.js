import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Form } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { registerNewUser } from '../actions/auth';
import { resetErrors } from '../actions/errors';
import { validateFields } from '../utils/common';
import { Link } from 'react-router-dom';
import { Grid, Paper, Avatar, Typography } from '@material-ui/core'
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';


class Register extends React.Component {
  state = {
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    cpassword: '',
    successMsg: '',
    errorMsg: '',
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

  registerUser = (event) => {
    event.preventDefault();
    const { first_name, last_name, email, password, cpassword } = this.state;

    const fieldsToValidate = [
      { first_name },
      { last_name },
      { email },
      { password },
      { cpassword }
    ];

    const allFieldsEntered = validateFields(fieldsToValidate);
    if (!allFieldsEntered) {
      this.setState({
        errorMsg: {
          signup_error: 'Please enter all the fields.'
        }
      });
    } else {
      if (password !== cpassword) {
        this.setState({
          errorMsg: {
            signup_error: 'Password and confirm password does not match.'
          }
        });
      } else {
        this.setState({ isSubmitted: true });
        this.props
          .dispatch(registerNewUser({ first_name, last_name, email, password }))
          .then((response) => {
            if (response.success) {
              this.setState({
                successMsg: 'User registered successfully.',
                errorMsg: ''
              });
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

    const paperStyle = { padding: '60px 150px', width: 700, height:820, margin: "20px auto" }
    const buttonStyle = { width: '100%' }
    const headerStyle = { margin: 0 }
    const avatarStyle = { backgroundColor: '#1bbd7e' }

    const {
      first_name,
      last_name,
      email,
      password,
      cpassword,
      errorMsg,
      successMsg,
      isSubmitted,
    } = this.state;
    return (
      <Grid>
            <Paper elevation={20} style={paperStyle}>
                <Grid align='center'>
                    <Avatar style={avatarStyle}>
                        <AddCircleOutlineOutlinedIcon />
                    </Avatar>
                    <h2 style={headerStyle}>Sign Up</h2>
                    <Typography variant='caption' gutterBottom>Please fill this form to create an account !</Typography>
                </Grid>
                <Form onSubmit={this.registerUser}>
                  {errorMsg && errorMsg.signup_error ? (
                    <p className="errorMsg centered-message">
                      {errorMsg.signup_error}
                    </p>
                  ) : (
                    isSubmitted && (
                      <p className="successMsg centered-message">{successMsg}</p>
                    )
                  )}
                  <Form.Group controlId="first_name">
                    <Form.Label>First name</Form.Label>
                    <Form.Control
                      type="text"
                      name="first_name"
                      value={first_name}
                      placeholder="Enter first name"
                      onChange={this.handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="last_name">
                    <Form.Label>Last name</Form.Label>
                    <Form.Control
                      type="text"
                      name="last_name"
                      value={last_name}
                      placeholder="Enter last name"
                      onChange={this.handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="email">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={email}
                      placeholder="Enter email"
                      onChange={this.handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={password}
                      placeholder="Enter password"
                      onChange={this.handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="cpassword">
                    <Form.Label>Confirm password</Form.Label>
                    <Form.Control
                      type="password"
                      name="cpassword"
                      value={cpassword}
                      placeholder="Enter confirm password"
                      onChange={this.handleInputChange}
                    />
                  </Form.Group>
                  

                    <Button variant="primary" type="submit" style={buttonStyle}>
                      Register
                    </Button>
                    <br></br>
                    <br></br>
                    <Link to="/" style={buttonStyle} className="btn btn-secondary" styles="width:100%">
                      Login
                    </Link>
                  
                </Form>
            </Paper>
    </Grid>
     

      
    );
  }
}

const mapStateToProps = (state) => ({
  errors: state.errors
});

export default connect(mapStateToProps)(Register);