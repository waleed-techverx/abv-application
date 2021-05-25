import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import AccountForm from './AccountForm';
import Summary from './Summary';
import Transfer from './Transfer';
import { Grid, Paper, Avatar } from '@material-ui/core'
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';

class Account extends React.Component {
  state = {
    selectedType: 'withdraw'
  };

  setSelectedType = (selectedType) => {
    this.setState({ selectedType });
  };

  render() {
    const { selectedType } = this.state;
    const paperStyle = { padding: '60px 150px', width: 700, height:1500, margin: "20px auto" }
    const headerStyle = { margin: 0 , color: '#337AFF'}
    const avatarStyle = { backgroundColor: '#1bbd7e' }
    const buttonStyle = { margin: '5px' }

    return (

      <Grid>
            <Paper elevation={20} style={paperStyle}>
                <Grid align='center'>
                    <Avatar style={avatarStyle}>
                        <AccountBalanceIcon />
                    </Avatar>
                    <h2 style={headerStyle}>Your Account</h2>
                </Grid>
                
                <br></br>
                <Grid align='center'>
                  <Button
                    style={buttonStyle}
                    variant="primary"
                    className={`${
                      selectedType === 'withdraw' ? 'active account-btn' : 'account-btn'
                    }`}
                    onClick={() => this.setSelectedType('withdraw')}
                  >
                    Withdraw
                  </Button>
                  <Button
                    style={buttonStyle}
                    variant="secondary"
                    className={`${
                      selectedType === 'deposit' ? 'active account-btn' : 'account-btn'
                    }`}
                    onClick={() => this.setSelectedType('deposit')}
                  >
                    Deposit
                  </Button>
                  <Button
                    style={buttonStyle}
                    variant="info"
                    className={`${
                      selectedType === 'transfer' ? 'active account-btn' : 'account-btn'
                    }`}
                    onClick={() => this.setSelectedType('transfer')}
                  >
                    Transfer
                  </Button>
                  <Button
                    style={buttonStyle}
                    variant="info"
                    className={`${
                      selectedType === 'summary' ? 'active account-btn' : 'account-btn'
                    }`}
                    onClick={() => this.setSelectedType('summary')}
                  >
                    Summary
                  </Button>
                  <div>
                    {selectedType === 'withdraw' || selectedType === 'deposit'? (
                      <AccountForm selectedType={selectedType} />
                    ) : selectedType === 'summary'? (
                      <Summary />
                    ):(
                      <Transfer />
                    )}
                  </div>
                </Grid>
                
            </Paper>
    </Grid>
    );
  }
}

export default connect()(Account);