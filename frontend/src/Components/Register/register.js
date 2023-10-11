import './register.css';
import { Component } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

class Register extends Component{
  constructor(props) {
    super(props);
    this.state = {ID: '', Name: '', Password: ''};
    this.handleChangeID = this.handleChangeID.bind(this);
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChangeID(event) {
    this.setState({ID: event.target.value});
  }
  
  handleChangeName(event) {
    this.setState({Name: event.target.value});
  }

  handleChangePassword(event) {
    this.setState({Password: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    var isValid = this.callAPI();
    isValid.then(res => {
      if(res === 200){
        window.location.replace("/user/login");
      }
    });
  }

  async callAPI() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ID: this.state.ID, name: this.state.Name, password : this.state.Password })
    };
    return await fetch('http://localhost:8080/user/register', requestOptions)
    .then(res => {
      return res.status;
    })
    .catch((error) => {
      console.log(error.message);
    });
  }

  render(){
    return (
      <div className="Register" style={{width: "100%", textAlign: "center"}}>
        <h1 className='registerheader'> Registaration Header </h1>
        <Form onSubmit={this.handleSubmit}>
          <Row className="Buffer"> </Row>
          <Row className="mb-3">
            <Col md={4}> </Col>
            <Col md={4}>
              <Form.Group controlId="formBasicID">
                <Form.Label >User ID</Form.Label>
                <Form.Control type="text" placeholder="Enter User ID of length 5" value={this.state.ID} onChange={this.handleChangeID}/>
              </Form.Group>
            </Col>
            <Col md={4}> </Col>
          </Row>
          <Row className="mb-3">
            <Col md={4}> </Col>
            <Col md={4}>
              <Form.Group controlId="formBasicName">
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" placeholder="Enter your name" value={this.state.Name} onChange={this.handleChangeName} />
              </Form.Group>
            </Col>
            <Col md={4}> </Col>
          </Row>
          <Row className="mb-3">
            <Col md={4}> </Col>
            <Col md={4}>
              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" value={this.state.Password} onChange={this.handleChangePassword} />
              </Form.Group>
            </Col>
            <Col md={4}> </Col>
          </Row>
          <Row className="mb-3">
            <Col md={5}> </Col>
            <Col md={2}> 
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Col>
            <Col md={5}> </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

export default Register;
