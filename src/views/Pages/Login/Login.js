import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { compose } from 'recompose';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import { withFirebase } from '../../../firebase';
import * as ROUTES from '../../../routes';

const SignInPage = () => (
  <div>
    <SignInForm />  
  </div>
);

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

class Login extends Component {
  constructor (props) {
    super(props)

    this.state = { ...INITIAL_STATE };
  }
  
  componentDidMount () {
    
  }

  onForgotPassword () {

  }

  onSubmit = event => {
    const { email, password } = this.state;

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.DASHBOARD);
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, password, error } = this.state;

    const isInvalid = password === '' || email === '';
    
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <form onSubmit={this.onSubmit}>
                      <h1>Login</h1>
                      <p className="text-muted">Sign In to your account</p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <input
                          name="email"
                          value={email}
                          onChange={this.onChange}
                          type="text"
                          placeholder="Email Address"
                        />
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <input
                          name="password"
                          value={password}
                          onChange={this.onChange}
                          type="password"
                          placeholder="Password"
                        />
                      </InputGroup>
                      <Row>
                        <Col xs="6">
                          <button disabled={isInvalid} type="submit">Login</button>
                        </Col>
                        <Col xs="6" className="text-right">
                          <Button color="link" className="px-0" onClick={() => this.onForgotPassword(this)}>Forgot password?</Button>
                        </Col>
                      </Row>
                    </form>
                  </CardBody>
                </Card>
                <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: '44%' }}>
                  <CardBody className="text-center">
                    <div>
                      <h2>Sign up</h2>
                      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua.</p>
                      <Link to="/register">
                        <Button color="primary" className="mt-3" active tabIndex={-1}>Register Now!</Button>
                      </Link>
                    </div>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

const SignInForm = compose(
  withRouter,
  withFirebase,
)(Login);

export default SignInPage;

export { Login };
