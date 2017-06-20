import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {login } from '../actions/session_actions';

class LoginForm extends React.Component{
  constructor(props) {
		super(props);
		this.state = { email: '', password: '' };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const user = Object.assign({}, this.state);
    this.props.login(user);
  }

  handleChange(field) {
    return (e) => {
      e.preventDefault();
      const newState = Object.assign({}, this.state);
      newState[field] = e.currentTarget.value;
      this.setState(newState);
    };
  }

  render() {
    const errors = this.props.errors.map((error, idx) => <li key={idx}>{error}</li>);
    const {email, password} = this.state;
    return (
      <section className='session-form'>
        <h2>Sign In</h2>
        <form>
          <label htmlFor='email'>Email:</label>
          <input id='email' onChange={this.handleChange('email')} value={email}/>
          <label htmlFor='password'>Password:</label>
          <input type='password' id='password' onChange={this.handleChange('password')} value={password}/>
          <button onClick={this.handleSubmit}>Sign In</button>
          <ul>{errors}</ul>
        </form>
        <div className='redirect'>
          <span>New user?</span><Link to='/signup'>Sign Up</Link>
        </div>
      </section>
    );
  }
}

const mapStateToProps = state => {
  return ({
    errors: state.session.errors,
  });
};

const mapDispatchToProps = dispatch => ({
  login: user => dispatch(login(user))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps)(LoginForm);
