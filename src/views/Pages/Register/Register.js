import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Card, CardBody, CardFooter, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import { withFirebase } from '../../../firebase';
import * as ROUTES from '../../../routes';

class Register extends Component {
  constructor (props) {
    super(props)
  }

  onRegister () {
    var email = document.querySelector('#email').value;
    var password = document.querySelector('#password').value;
    var re_password = document.querySelector('#re_password').value;
    const ref = this;
    if (password == re_password) {
      console.log(this.props);
      this.props.firebase.doCreateUserWithEmailAndPassword(email, password).then(() => {
        ref.setState({ isLoggedIn: true })
        ref.props.history.push(ROUTES.TAGLIST);
      })
      .catch(function (err) {
        console.log(err);
      });
    } else {
      console.log("check password again!");
    }
  }

  render() {
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="9" lg="7" xl="6">
              <Card className="mx-4">
                <CardBody className="p-4">
                  <Form>
                    <h1>Register</h1>
                    <p className="text-muted">Create your account</p>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="text" id="firstname" placeholder="Firstname" autoComplete="firstname" required/>
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="text" id="lastname" placeholder="Lastname" autoComplete="lastname" required/>
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>@</InputGroupText>
                      </InputGroupAddon>
                      <Input type="email" id="email" placeholder="Email" autoComplete="email" required/>
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="password" id="password" placeholder="Password" autoComplete="new-password" required/>
                    </InputGroup>
                    <InputGroup className="mb-4">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="password" id="re_password" placeholder="Repeat password" autoComplete="new-password" required/>
                    </InputGroup>
                    <Button color="success" onClick={() => this.onRegister(this)} block>Create Account</Button>
                  </Form>
                </CardBody>
                <CardFooter className="p-4">
                  <Row>
                    <Col xs="12" sm="6">
                      <Button className="btn-facebook mb-1" block><span>facebook</span></Button>
                    </Col>
                    <Col xs="12" sm="6">
                      <Button className="btn-twitter mb-1" block><span>twitter</span></Button>
                    </Col>
                  </Row>
                </CardFooter>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default withFirebase(Register);
