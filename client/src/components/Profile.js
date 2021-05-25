import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Form, Button } from 'react-bootstrap';
import { initiateUpdateProfile } from '../actions/profile';
import { validateFields } from '../utils/common';
import { resetErrors } from '../actions/errors';
import { Grid, Paper, Avatar, Typography } from '@material-ui/core'
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import EmailIcon from '@material-ui/icons/Email';

class Profile extends React.Component {
  state = {
    first_name: '',
    last_name: '',
    email: '',
    errorMsg: '',
    isSubmitted: false
  };

  componentDidMount() {
    const { profile } = this.props;
    if (!_.isEmpty(profile)) {
      const { first_name, last_name, email } = profile;
      this.setState({
        first_name,
        last_name,
        email
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(prevProps.errors, this.props.errors)) {
      this.setState({
        errorMsg: this.props.errors
      });
    }
    if (!_.isEqual(prevProps.profile, this.props.profile)) {
      const { first_name, last_name, email } = this.props.profile;
      this.setState({ first_name, last_name, email });
    }
  }

  componentWillUnmount() {
    this.props.dispatch(resetErrors());
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { first_name, last_name } = this.state;
    const profileData = {
      first_name,
      last_name
    };

    const fieldsToValidate = [{ first_name }, { last_name }];

    const allFieldsEntered = validateFields(fieldsToValidate);
    if (!allFieldsEntered) {
      this.setState({
        errorMsg: {
          update_error: 'Please enter all the fields.'
        }
      });
    } else {
      this.setState({ isSubmitted: true, errorMsg: '' });
      this.props.dispatch(initiateUpdateProfile(profileData));
    }
  };

  handleOnChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  render() {
    const { errorMsg, first_name, last_name, email, isSubmitted } = this.state;
    const paperStyle = { padding: '60px 150px', width: 700, height:600, margin: "20px auto" }
    const typoStyle = { fontSize: '16px'}
    const formlabelStyle = { fontSize: '18px'}
    const spanStyle = { fontSize: '20px', padding: '20px'}
    const headerStyle = { margin: 0 , color: '#337AFF'}
    const avatarStyle = { backgroundColor: '#1bbd7e' }
    const emailStyle = { backgroundColor: '#337AFF' }
    return (

      <Grid>
            <Paper elevation={20} style={paperStyle}>
                <Grid align='center'>
                    <Avatar style={avatarStyle}>
                        <AccountCircleIcon />
                    </Avatar>
                    <h2 style={headerStyle}>Your Profile</h2>
                    <Typography style={typoStyle} variant='caption' gutterBottom>You can also update your profile here !</Typography>
                </Grid>
                <br></br>
                <br></br>
                <br></br>
                <Form onSubmit={this.handleSubmit} className="profile-form">
                  {errorMsg && errorMsg.update_error ? (
                    <p className="errorMsg centered-message">{errorMsg.update_error}</p>
                  ) : (
                    isSubmitted && (
                      <p className="successMsg centered-message">
                        Profile updated successfully.
                      </p>
                    )
                  )}
                  <Form.Group controlId="email">
                    <Form.Label style={formlabelStyle} >
                      <Avatar style={emailStyle}>
                        <EmailIcon />
                      </Avatar></Form.Label>
                    <span style={spanStyle} className="label-value">{email}</span>
                  </Form.Group>
                  <Form.Group controlId="first_name">
                    <b><Form.Label style={formlabelStyle}>First name:</Form.Label></b>
                    <Form.Control
                      type="text"
                      name="first_name"
                      placeholder="Enter your first name"
                      value={first_name}
                      onChange={this.handleOnChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="last_name">
                    <b><Form.Label style={formlabelStyle}>Last name:</Form.Label></b>
                    <Form.Control
                      type="text"
                      name="last_name"
                      placeholder="Enter your last name"
                      value={last_name}
                      onChange={this.handleOnChange}
                    />
                  </Form.Group>

                  <Button variant="primary" type="submit">
                    Submit
                  </Button>
                </Form>
            </Paper>
    </Grid>
    );
  }
}

const mapStateToProps = (state) => ({
  profile: state.profile,
  errors: state.errors
});

export default connect(mapStateToProps)(Profile);