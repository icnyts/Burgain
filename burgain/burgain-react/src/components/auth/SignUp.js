import React, { Component } from 'react';
import { Button, Modal, Form, Col, InputGroup } from 'react-bootstrap';
import { signUp } from "../../redux/action/authAction";
import PropTypes from "prop-types";
import { connect } from "react-redux";


class SignUp extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      errors: {}
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const newUser = {
      email: this.state.email + "@bu.edu",
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      password: this.state.password,
    };
    // this.props.signUp(newUser, this.props.history);
    var db = openDatabase("db", '1.0', "My WebSQL Database", 3 * 1024 * 1024);
    db.transaction(function (tx) {
      tx.executeSql('insert into customer (firstname, lastname, email, password) values (?,?,?,?)',[newUser.firstName, newUser.lastName, newUser.email, newUser.password]);
    }); 
    this.props.setShow(false);
  }

  handleChange = (e) => {
    this.setState({ [e.target.id]: e.target.value })
  }

  componentDidMount() {
    if (this.props.auth.validToken) {
      this.props.history.push("/onlineShop");
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  render() {
    const { setShow } = this.props;
    return (
      <div className="signup_outbox">
        <Modal.Body>
          <div className="signuptext">Sign up to get all of these deals now!</div>
          <Form  className="white" onSubmit={this.handleSubmit} >
            <Form.Row>
              <Form.Group as={Col} controlId="lastName">
                <Form.Label className="lastName"> Last Name </Form.Label>
                <Form.Control type="text" placeholder="Last Name" onChange={this.handleChange} />
              </Form.Group>
              <Form.Group as={Col} controlId="firstName">
                <Form.Label className="firstName" >  First Name </Form.Label>{
                <Form.Control type="text" placeholder="First Name" onChange={this.handleChange} />}
              </Form.Group>
            </Form.Row>
            <Form.Group controlId="email">
              <Form.Label className="email"> Email </Form.Label>
                <InputGroup>
                  <Form.Control type="text" placeholder="Email" onChange={this.handleChange} />
                  <InputGroup.Append>
                    <InputGroup.Text id="basic-addon2">@bu.edu</InputGroup.Text>
                  </InputGroup.Append>
                </InputGroup>
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label className="password"> Password </Form.Label>
              <Form.Control type="password" placeholder="Password" onChange={this.handleChange} />
            </Form.Group>
            
            <Form.Group className="input-field">
              <Button className="cl" onClick={() => setShow(false) } >Close</Button>
              <Button className="signin_button" type="submit" onClick={this.handleSubmit}  >Sign Up</Button>
            </Form.Group>
          </Form> 
          <div className="agree">
            By signing up you agree to our
            <br/> <a href='/onlineShop/burgain'>Terms and Conditions</a>
          </div>
        </Modal.Body>     
      </div>
    );
  }
}

const mapStateToProps = state => ({
  errors: state.errors,
  auth: state.auth
});

SignUp.propTypes = {
  signUp: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

export default connect( mapStateToProps, { signUp } )(SignUp);