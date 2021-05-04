import React, { Component } from 'react';
import { Row, Col, Card, CardHeader, CardBody, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { compose } from 'recompose';
import { withFirebase } from '../../../firebase';
import withAuthorization from '../../Session/withAuthorization';
import * as ROUTE from '../../../routes';

class EditCategory extends Component {

  constructor(props) 
  {
    super(props);

    this.state = {
        is_loaded: true,
        data_uploaded: true
    }

    this.tag = {
      key: "",
      name: "",
      address: "",
      image: ""
    }
  }

  componentDidMount(){
    this.onTagByKey(this.props.match.params.key);
  }

  onTagByKey(key) {
    this.setState({is_loaded: false});

    let ref = this;
    this.props.firebase.db.ref("location").on('value', function (items){
      items.forEach(function(child) {
        if (child.key == key) {
          ref.tag.key = child.key;
          ref.tag.name = child.val().name;
          ref.tag.address = child.val().address;
          ref.tag.image = child.val().image;
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

  handleNameChange (e) {
    this.tag.name = e.target.value;
  }

  handleAddressChange (e) {
    this.tag.address = e.target.value;
  }

  onUpdateTag(key){
    let ref = this;
    var infile = document.getElementById("input-file");
    
    this.setState({data_uploaded: false});
    if (infile.files[0] != undefined) {
        const filename = (+new Date()) + '-' + infile.files[0].name;
        this.props.firebase.storage.ref().child(filename).put(infile.files[0], { contentType: 'image/png' }).then(
            snapshot => snapshot.ref.getDownloadURL()
        ).then( (url) => {
            ref.tag.image = url;
            this.props.firebase.db.ref("location/" + key).update(ref.tag).then(
                () => {
                  ref.setState({data_uploaded: true});
                  ref.props.history.push(ROUTE.TAGLIST);
                }
            )
        });
    } else {
      this.props.firebase.db.ref("location/" + key).update(ref.tag).then(
          () => {
            ref.setState({data_uploaded: true});
            ref.props.history.push(ROUTE.TAGLIST);
          }
        )
    }
  }
  
  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>
  
  renderContent() {
    return this.state.is_loaded === false ? (
      <div>
        <img src={'../../../assets/img/loading.gif'} className="loading" alt="loading"/>
      </div>
    ) : (
      <Row>
        <Col lg="3" md="3" sm="6" xs="12" align="center">
          <div className="profile-avatar">
            <img id="avatar" src={this.tag.image === undefined ? '' : this.tag.image} className="" alt=""/>
            <div className="btn_edit" align="center" onClick={this.onSelectUploadfile.bind(this)}>
              <i className="fa fa-pencil"></i>
              <input accept="image/*" type="file" className="avatar-file" id="input-file" onChange={this.onAvatarChange.bind(this)}/>
            </div>
          </div>
        </Col>
        <Col lg="8" md="8" sm="6" xs="12">
          <FormGroup>
              <Label htmlFor="name">Name</Label>
              <Input type="text" id="name" ref="name" placeholder="Enter Location Name." onChange={ this.handleNameChange.bind(this) } defaultValue={this.tag.name} required />
          </FormGroup>
          <FormGroup>
              <Label htmlFor="address">Address</Label>
              <Input type="text" id="address" ref="address" placeholder="Enter correct address." onChange={ this.handleAddressChange.bind(this) } defaultValue={this.tag.address} required />
          </FormGroup>
          <Button color="success" onClick={() => this.onUpdateTag(this.tag.key)}><i className="fa fa-save"></i> Update</Button>
        </Col>
      </Row>
    );
  }

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
                <strong>Edit Rental Location</strong>
              </CardHeader>
              <CardBody>
                <Form encType="multipart/form-data" className="form-horizontal edit-profile">
                  {this.renderContent()}
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
)(EditCategory);
