import './login.css';
import { Component } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

class Login extends Component{
  constructor(props) {
    super(props);
    this.state = {ID: '', Password: ''};
    this.handleChangeID = this.handleChangeID.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.logoutbutton = this.logoutbutton.bind(this);
    this.homebutton = this.homebutton.bind(this);
  }

  handleChangeID(event) {
    this.setState({ID: event.target.value});
  }

  handleChangePassword(event) {
    this.setState({Password: event.target.value});
  }

  logoutbutton(event){
    event.preventDefault();
    window.localStorage.removeItem("ID");
    window.localStorage.removeItem("Status");
    window.location.reload();
  }

  homebutton(event){
    event.preventDefault();
    window.location.replace("/buyer/home");
  }

  handleSubmit(event) {
    event.preventDefault();
    window.localStorage.removeItem("Success");
    window.localStorage.setItem('ID', JSON.stringify(this.state.ID));
    var isValid = this.callAPI();
    isValid.then(res => {
      var keys = Object.keys(res);
      if(keys[0] === 'error'){
        window.localStorage.setItem('Status', JSON.stringify("No"));
        window.location.reload();
      }
      else if(keys[0] === 'status'){
        window.localStorage.setItem('Status', JSON.stringify("Yes"));
        window.location.replace("/user/home");
      }
    });
  }

  async callAPI() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ID: this.state.ID, password : this.state.Password })
    };
    return await fetch('http://localhost:8080/user/login', requestOptions)
    .then(res => res.json())
    .then(res => {
      return res;
    })
    .catch((error) => {
      console.log(error.message);
    });
  }

  render(){
    const Status = window.localStorage.getItem("Status");
    if (Status == null){
      return (
        <div className="Login" style={{width: "100%", textAlign: "center"}}>
          <h1 className='loginheaderfile'> Login Page </h1>
          <Form onSubmit={this.handleSubmit}>
            <Row className="Buffer"> </Row>
            <Row className="mb-3">
              <Col md={4}> </Col>
              <Col md={4}>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label >User ID</Form.Label>
                  <Form.Control type="text" placeholder="Enter User ID" value={this.state.ID} onChange={this.handleChangeID}/>
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
    else if (Status === "\"No\""){
      return (
        <div className="Login">
          <h1> Please enter the correct ID or password </h1>
          <Form onSubmit={this.handleSubmit}>
            <Form.Group className="w-25" controlId="formBasicEmail">
              <Form.Label>User ID</Form.Label>
              <Form.Control type="text" placeholder="Enter User ID" value={this.state.ID} onChange={this.handleChangeID} />
            </Form.Group>
            <Form.Group className="w-25" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" value={this.state.Password} onChange={this.handleChangePassword} />
            </Form.Group>
            <Button variant="primary" type="submit" >
              Submit
            </Button>
          </Form>
        </div>
      );
    }
    else{
      const userID = JSON.parse(window.localStorage.getItem("ID"));
      return (
        <div className="Login">
          <h1 className='AlreadyLogged'> You are already logged in with ID {userID}, you need to log out before logging in as different user. </h1>
          <div className='buttonlist'> <Button variant='primary btn-lg' onClick={this.logoutbutton} className='leftbutton'> Logout </Button> <Button variant='primary btn-lg' onClick={this.homebutton}> Home Page </Button> </div>
        </div>
      )
    }
  }
}

export default Login;
