import React, { Component } from 'react';
import { Row, Col, Card, CardHeader, CardBody, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { compose } from 'recompose';
import { withFirebase } from '../../../firebase';
import withAuthorization from '../../Session/withAuthorization';
import * as ROUTE from '../../../routes';

class Addcategory extends Component {

  constructor(props){
    super(props)

    this.state = {
      user: this.props.authUser,
      image_selected: undefined,
      data_uploaded: true
    }

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

  onSaveTag(){
    
    let imageurl = '';
    let name = document.getElementById("name").value;
    let address = document.getElementById("address").value;
    var infile = document.getElementById("input-file");
    let ref = this;

    if(this.state.image_selected !== undefined){
      this.setState({data_uploaded: false});
      var metadata = {
        contentType: 'image/png',
      };
      const filename = (+new Date()) + '-' + infile.files[0].name;      
      var uploadTask = this.props.firebase.storage.ref().child(filename).put(infile.files[0], metadata);
      uploadTask
        .then( snapshot => snapshot.ref.getDownloadURL())
        .then( (url) => {
          imageurl = url;
          this.props.firebase.db.ref('location').push({
            name: name,
            address: address,
            image: imageurl,
          }).then(() => {
            ref.setState({data_uploaded: true});
            ref.props.history.push(ROUTE.TAGLIST);
          })
        }).catch(error => console.log(error));
    }
  
  }
  
  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  render() {
    return this.state.data_uploaded === false ? (
      <div className="animated fadeIn">
      <Row>
        <Col xs="12" sm="12" align="center" >
          <img src={'../../../assets/img/loading.gif'} className="loading" alt="loading"/>
        </Col>
      </Row>
      </div>
        
      ) :  (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <strong>Add Rental Location</strong>
              </CardHeader>
              <CardBody>
                <Form encType="multipart/form-data" className="form-horizontal edit-profile">
                  <Row>
                    <Col lg="3" md="3" sm="6" xs="12" align="center">
                      <div className="profile-avatar">
                        <img id="avatar" src={this.state.image_selected === undefined ? '' : this.state.image_selected} className="" alt=""/>
                        <div className="btn_edit" align="center" onClick={this.onSelectUploadfile.bind(this)}>
                          <i className="fa fa-pencil"></i>
                          <input accept="image/*" type="file" className="avatar-file" id="input-file" onChange={this.onAvatarChange.bind(this)}/>
                        </div>
                      </div>
                    </Col>
                    <Col lg="8" md="8" sm="6" xs="12">
                      <FormGroup>
                        <Label htmlFor="name">Name</Label>
                        <Input type="text" id="name" ref="name" placeholder="Enter Location Name." defaultValue={''} required />
                      </FormGroup>

                      <FormGroup>
                        <Label htmlFor="address">Address</Label>
                        <Input type="text" id="address" ref="address" placeholder="Enter correct address." required />
                      </FormGroup>

                      <Button color="success" onClick={this.onSaveTag.bind(this)}><i className="fa fa-save"></i> Save</Button>
                    </Col>
                  </Row>
                </Form>
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
)(Addcategory);