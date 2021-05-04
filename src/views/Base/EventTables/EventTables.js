import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Table, Button } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import { compose } from 'recompose';
import { withFirebase } from '../../../firebase';
import withAuthorization from '../../Session/withAuthorization';
class EventTables extends Component {

  constructor(props){
    super(props)

    this.state = {
      list_loaded: false
    }

    this.list = [];
  }

  componentDidMount() {
    this.loadData();
  }

  addList(event){
		this.list.unshift(event);
	}

  loadData() {

    this.setState({list_loaded: false});

    this.props.firebase.db.ref("event").on('value', function (events){
      this.list = [];
      events.forEach(item => {
          var event = {};
          event.key = item.key;
          event.name = item.val().name;
          event.address = item.val().address;          
          event.image = item.val().image;
          this.addList(event);
      })
      this.setState({list_loaded: true});
    }.bind(this));
  }

  onEditEvent(key) {
    this.props.history.push('/editevent/'+key);
  }

  onDeleteEvent(key) {
    let ref = this.props.firebase.db.ref("event/" + key);
    ref.remove();
  }

  renderContent(){
    return this.state.list_loaded === false ? (
      <tr>
        <td colSpan="4" ><img src={'../../../assets/img/loading.gif'} className="loading" alt="loading"/></td>
      </tr>
      ) : this.list.map((event, index) => {
        return (
          <tr key={index}>
            <td>{event.name}</td>
            <td>{event.address}</td>
            <td><img src={event.image} className="loading" /></td>
            <td>
              <Button color="success" onClick={() => this.onEditEvent(event.key)}><i className="fa fa-edit"></i> Edit</Button>
              <Button color="danger" onClick={() => this.onDeleteEvent(event.key)}><i className="fa fa-trash"></i> Delete</Button>
            </td>
          </tr>
        )
      })
  }
  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" lg="12">
            <Card>
              <CardHeader>
                 Events
              </CardHeader>
              <CardBody>
                <Table responsive>
                  <thead>
                  <tr>
                    <th>Name</th>
                    <th>Address</th>
                    <th>Image</th>
                    <th>Action</th>
                  </tr>
                  </thead>
                  <tbody>
                  {this.renderContent()}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

const condition = authUser => !!authUser;

export default compose(
  withFirebase,
  withAuthorization(condition)
)(EventTables);
