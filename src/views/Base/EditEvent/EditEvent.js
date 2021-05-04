import React, { Component } from 'react';
import { Button, Card, Form, CardHeader, Col, FormGroup, Input, Label, Row } from 'reactstrap';
import { compose } from 'recompose';
import { withFirebase } from '../../../firebase';
import withAuthorization from '../../Session/withAuthorization';
import * as ROUTE from '../../../routes';

class EditEvent extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
        is_loaded: true,    
        event_uploaded: true,
        image_selected: undefined
    };
    
    this.event = {
        key: "",
        name: "",
        address: "",
        image: "",
        tag_num: ""
    };
  }

  componentDidMount(){
    this.GetEventByKey(this.props.match.params.key);
  }

  GetEventByKey(key) {
    this.setState({is_loaded: false});
    let ref = this;
    this.props.firebase.db.ref("event").on('value', function (items){
      items.forEach(function(child) {
          if (child.key == key) {
            ref.event.key = child.key;
            ref.event.name = child.val().name;
            ref.event.address = child.val().address;
            ref.event.image = child.val().image;
            ref.event.tag_num = child.val().tag_num;
          }
      })
      this.setState({is_loaded: true});
    }.bind(this));
  }

  onSelectUploadfile(){
    var infile = document.getElementById("input-file");
    infile.click();
  }

  onAvatarChange(){
    var infile = document.getElementById("input-file");
    if (infile.files && infile.files[0]) {
      var reader = new FileReader();
      var image_path = '';
      reader.onload = function(e) {
        document.getElementById("avatar").src = e.target.result;
        image_path = e.target.result;
      }

      this.setState({image_selected: image_path});
  
      reader.readAsDataURL(infile.files[0]);
    }
  }

  onUpdateEvent(key){
    let ref = this;
    var infile = document.getElementById("input-file");
    
    this.setState({data_uploaded: false});
    if (infile.files[0] != undefined) {
        const filename = (+new Date()) + '-' + infile.files[0].name;
        this.props.firebase.storage.ref().child(filename).put(infile.files[0], { contentType: 'image/png' }).then(
            snapshot => snapshot.ref.getDownloadURL()
        ).then( (url) => {
            ref.event.image = url;
            this.props.firebase.db.ref("event/" + key).update(ref.event).then(
                () => {
                  ref.setState({data_uploaded: true});
                  ref.props.history.push(ROUTE.EVENTLIST);
                }
            )
        });
    } else {
        this.props.firebase.db.ref("event/" + key).update(ref.event).then(
            () => {
              ref.setState({data_uploaded: true});
              ref.props.history.push(ROUTE.EVENTLIST);
            }
        )
    }
  }
  handleNameChange (e) {
    this.event.name = e.target.value;
  }

  handleAddressChange (e) {
    this.event.address = e.target.value;
  }

  renderContent() {
    return this.state.is_loaded === false ? (
        <div>
            <img src={'../../../assets/img/loading.gif'} className="loading" alt="loading"/>
        </div>
    ) : (
          <Row className="mt-3 mb-3">
            <Col lg="3" md="3" sm="6" xs="12" align="center">
              <div className="profile-avatar">
                <img id="avatar" src={this.event.image === undefined ? '' : this.event.image} className="" alt=""/>
                <div className="btn_edit" align="center" onClick={this.onSelectUploadfile.bind(this)}>
                  <i className="fa fa-pencil"></i>
                  <input accept="image/*" type="file" className="avatar-file" id="input-file" onChange={this.onAvatarChange.bind(this)}/>
                </div>
              </div>
            </Col>
            <Col lg="8" md="8" sm="6" xs="12">
              <FormGroup>
                <Label htmlFor="title">Name</Label>
                <Input type="text" id="title" ref="title" placeholder="Enter event title" onChange={ this.handleNameChange.bind(this) } defaultValue={this.event.name} required />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="address">Address</Label>
                <Input type="text" id="address" ref="address" placeholder="Enter event address" onChange={ this.handleAddressChange.bind(this) } defaultValue={this.event.address}required />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="taglist">Tag No</Label>
                <Input type="select" name="taglist" id="taglist">
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10</option>
                  <option value="11">11</option>
                  <option value="12">12</option>
                </Input>
            </FormGroup>
            <Button color="success" onClick={() => this.onUpdateEvent(this.event.key)}><i className="fa fa-save"></i> Update </Button>
            </Col>
        </Row>
    );
  }

  render() {
    return this.state.event_uploaded === false ? (
      <div className="animated fadeIn">
      <Row>
        <Col xs="12" sm="12" align="center" >
          <img src={'../../../assets/img/loading.gif'} className="loading" alt="loading"/>
        </Col>
      </Row>
      </div>
      ) : 
     (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" sm="12">
            <Card>
              <CardHeader>
                <strong>Edit Event</strong>
              </CardHeader>
              <Form encType="multipart/form-data" className="form-horizontal edit-profile">
                {this.renderContent()}
              </Form>
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
)(EditEvent);

