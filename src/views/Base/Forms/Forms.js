import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, Col, FormGroup, Input, Label, Row } from 'reactstrap';
import { compose } from 'recompose';
import { withFirebase } from '../../../firebase';
import withAuthorization from '../../Session/withAuthorization';
import * as ROUTE from '../../../routes';

class Forms extends Component {
  constructor(props) {
    super(props);

    this.state = {
      event_uploaded: true,
      image_selected: undefined
    };
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

  onSaveEvent(){
    let imageurl = '';
    var infile = document.getElementById("input-file");

    let title = document.getElementById("title").value;
    let address = document.getElementById("address").value;
    let tag = document.getElementById("taglist").value;
    
    if(this.state.image_selected !== undefined){
      this.setState({event_uploaded: false});
      var metadata = {
        contentType: 'image/png',
      };
      const filename = (+new Date()) + '-' + infile.files[0].name;
      var uploadTask = this.props.firebase.storage.ref().child(filename).put(infile.files[0], metadata);
      uploadTask
        .then( snapshot => snapshot.ref.getDownloadURL())
        .then( (url) => {
          imageurl = url;
          this.props.firebase.db.ref('event')
          .push({
            name: title,
            address: address,
            tag_num: tag,
            image: imageurl
          }, function(error) {
            this.setState({event_uploaded: true});
            this.props.history.push(ROUTE.EVENTLIST);
          }.bind(this));
        }).catch(error => console.log(error));
    }
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
                <strong>Add Event</strong>
              </CardHeader>
              <CardBody className="edit-profile">
                <Row className="mt-3 mb-3">
                  <Col lg="3" md="3" sm="6" xs="12" align="center">
                    <div className="profile-avatar">
                      <img id="avatar" src={this.state.image_selected === undefined ? '' : this.state.image_selected} className="" alt="Upload Image"/>
                      <div className="btn_edit" align="center" onClick={this.onSelectUploadfile.bind(this)}>
                        <i className="fa fa-pencil"></i>
                        <input accept="image/*" type="file" className="avatar-file" id="input-file" onChange={this.onAvatarChange.bind(this)}/>
                      </div>
                    </div>
                  </Col>
                  <Col lg="8" md="8" sm="6" xs="12">
                    <FormGroup>
                      <Label htmlFor="title">Name</Label>
                      <Input type="text" id="title" ref="title" placeholder="Enter event title" required />
                    </FormGroup>
                    <FormGroup>
                      <Label htmlFor="address">Address</Label>
                      <Input type="text" id="address" ref="address" placeholder="Enter event address" required />
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
                    <Button color="success" onClick={this.onSaveEvent.bind(this)}><i className="fa fa-save"></i> Save</Button>
                  </Col>
                </Row>
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
)(Forms);
