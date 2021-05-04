import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import AuthUserContext from '../../Session/context';
import SignOutButton from '../../Pages/SignOut';
import * as ROUTES from '../../../routes';
import { withFirebase } from '../../../firebase';
import { compose } from 'recompose';

import {
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  Navbar,
  NavbarBrand,
  NavItem,
  NavLink,
  UncontrolledDropdown,
} from 'reactstrap';

const Navigation = (props) => (
  <AuthUserContext.Consumer>
    {authUser =>
      authUser ? (
        <NavigationAuth authUser={authUser} firebase={props.firebase} history={props.history}/>
      ) : (
        <NavigationNonAuth />
      )
    }
  </AuthUserContext.Consumer>
);

class NavigationAuth extends Component {
  
  constructor(props) 
  {
    super(props);
  }

  signOut = () => {
    let ref = this;
    this.props.firebase.doSignOut().then(() => {
      ref.props.history.push(ROUTES.HOME);
    });
  }

  render () {
    const { authUser } = this.props;
    return (
        <div className="animated fadeIn auth-nav">   
        <Navbar light expand="md">
          <NavbarBrand href="#">Ballbox Admin Panel</NavbarBrand>
          <Collapse navbar>
            <Nav className="ml-auto" navbar>
              <NavLink href="/dashboard"> Dashboard </NavLink>
              <UncontrolledDropdown nav inNavbar>
                {/*Warning: React does not recognize the `inNavbar` prop on a DOM element.*/}
                {/*waiting for reactstrap@5.0.0-alpha.5*/}
                <DropdownToggle nav caret>
                  Locations
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem>
                  <Link to={ROUTES.TAGLIST}>Location List</Link>
                  </DropdownItem>
                  <DropdownItem>
                    <Link to={ROUTES.TAG_ADD}>Add Location</Link>
                  </DropdownItem>               
                </DropdownMenu>
              </UncontrolledDropdown>
              <UncontrolledDropdown nav inNavbar>
                {/*Warning: React does not recognize the `inNavbar` prop on a DOM element.*/}
                {/*waiting for reactstrap@5.0.0-alpha.5*/}
                <DropdownToggle nav caret>
                  Events
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem>
                  <Link to={ROUTES.EVENTLIST}>Event List</Link>
                  </DropdownItem>
                  <DropdownItem>
                    <Link to={ROUTES.EVENT_ADD}>Add Event</Link>
                  </DropdownItem>               
                </DropdownMenu>
              </UncontrolledDropdown>
              <NavItem>
                <NavLink onClick={this.signOut}>Log out</NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

const NavigationNonAuth = () => (
  <div className="animated fadeIn auth-nav">   
    <Navbar light expand="md">
      <NavbarBrand href="#">Ballbox Admin Panel</NavbarBrand>
      <Collapse navbar>
        <Nav className="ml-auto" navbar>
          <NavItem>
            <NavLink href='login'>Sign In</NavLink>
          </NavItem>          
        </Nav>
      </Collapse>
    </Navbar>  
  </div>
);

export default compose(
  withFirebase,
  withRouter
)(Navigation);
