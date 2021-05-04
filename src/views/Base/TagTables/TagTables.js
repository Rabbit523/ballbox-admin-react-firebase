import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Table, Button } from 'reactstrap';
import { compose } from 'recompose';
import { withFirebase } from '../../../firebase';
import withAuthorization from '../../Session/withAuthorization';
class TagTables extends Component {

  constructor(props){
    super(props)

    this.state = {
      list_loaded: true
    }

    this.list = [];
  }

  componentDidMount() {
    this.loadData();
  }

  addList(tag){
		this.list.unshift(tag);
  }
  
  loadData() {
    this.setState({list_loaded: false});

    this.props.firebase.db.ref("location").on('value', function (tags){
      this.list = [];
      tags.forEach(item => {
          var tag = {};
          tag.key = item.key;
          tag.name = item.val().name;
          tag.address = item.val().address;
          tag.image = item.val().image
          this.addList(tag);
      })
      this.setState({list_loaded: true});
    }.bind(this));
  }

  onEditTag = (key) => {
    this.props.history.push('/edittag/'+key);
  }

  onDeleteTag = (key) => {
    let ref = this.props.firebase.db.ref("location/" + key);
    ref.remove();
  }

  renderContent(){
    return this.state.list_loaded === false ? (
      <tr>
        <td colSpan="4" ><img src={'../../../assets/img/loading.gif'} className="loading" alt="loading"/></td>
      </tr>
      ) : this.list.map((tag, index) => {
        return (
          <tr key={index} className="table-blue">
            <td>{tag.name}</td>
            <td>{tag.address}</td>
            <td><img src={tag.image} className="loading" alt="loading"/></td>
            <td>
              <Button color="success" onClick={() => this.onEditTag(tag.key)}><i className="fa fa-edit"></i> Edit</Button>
              <Button color="danger" onClick={() => this.onDeleteTag(tag.key)}><i className="fa fa-trash"></i> Delete</Button>
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
                 Rental Location
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
)(TagTables);
 