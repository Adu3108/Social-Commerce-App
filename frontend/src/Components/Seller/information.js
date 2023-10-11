import './information.css';
import { Component } from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import CloseButton from 'react-bootstrap/CloseButton';
import { Link } from "react-router-dom";

class Information extends Component{
  constructor(props) {
    super(props);
    this.state = {header: '', email: '', first_line: '', second_line: '', city: '', postal_code: '', state_name: '', country: '', alert: ''};
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangeFirstLine = this.handleChangeFirstLine.bind(this);
    this.handleChangeSecondLine = this.handleChangeSecondLine.bind(this);
    this.handleChangeCity = this.handleChangeCity.bind(this);
    this.handleChangePostalCode = this.handleChangePostalCode.bind(this);
    this.handleChangeState = this.handleChangeState.bind(this);
    this.handleChangeCountry = this.handleChangeCountry.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.logoutbutton = this.logoutbutton.bind(this);
  }

  handleChangeEmail(event) {
    this.setState({email: event.target.value});
  }

  handleChangeFirstLine(event) {
    this.setState({first_line: event.target.value});
  }

  handleChangeSecondLine(event) {
    this.setState({second_line: event.target.value});
  }

  handleChangeCity(event) {
    this.setState({city: event.target.value});
  }

  handleChangePostalCode(event) {
    this.setState({postal_code: event.target.value});
  }

  handleChangeState(event) {
    this.setState({state_name: event.target.value});
  }

  handleChangeCountry(event) {
    this.setState({country: event.target.value});
  }

  logoutbutton(event){
    event.preventDefault();
    window.localStorage.removeItem("ID");
    window.localStorage.removeItem("Status");
    window.location.replace("/user/login");
  }

  errorclosebutton(event){
    event.preventDefault();
    window.location.reload();
  }

  closebutton(event){
    event.preventDefault();
    window.localStorage.removeItem("Info");
    window.location.reload();
  }

  handleSubmit(event) {
    event.preventDefault();
    var address = '';
    address = address.concat(this.state.first_line, ", ", this.state.second_line, ", ", this.state.city, "-", this.state.postal_code, ", ", this.state.state_name, ", ", this.state.country);
    var isValid = this.callAPI(address);
    isValid.then(res => {
      var keys = Object.keys(res);
      if(keys[0] === 'error'){
        this.setState({
          alert:  <div className='parent'> 
                    <Alert variant='danger' className="w-75"> 
                      <p> Database error occurred while adding your information! Please check your input fields. </p>
                      <CloseButton className='CloseButton' onClick={this.errorclosebutton}> </CloseButton> 
                    </Alert>
                  </div>
        });
      }
      else if(keys[0] === 'Status'){
        window.localStorage.setItem('Info', JSON.stringify("1"));
        window.location.reload();
      }
    });
  }

  async callAPI(full_address) {
    const SellerID = window.localStorage.getItem("ID");
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sID: SellerID, email: this.state.email, address : full_address })
    };
    return await fetch('http://localhost:8080/seller/information', requestOptions)
    .then(res => res.json())
    .then(res => {
      return res;
    })
    .catch((error) => {
      console.log(error.message);
    });
  }

  async updateAPI() {
    const SellerId = window.localStorage.getItem("ID");
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sID: SellerId })
    };
    return await fetch('http://localhost:8080/seller/update', requestOptions)
    .then(res => res.json())
    .then(res => {
      return res;
    })
    .catch((error) => {
      console.log(error.message);
    });
  }

  componentDidMount() {
    var UpdatePromise = this.updateAPI();
    UpdatePromise.then(res => {
      console.log(res);
      if(res['message'] === "No"){
        this.setState({ header: <h1 className="Header"> Complete your Profile </h1>});
      }
      else{
        this.setState({ header: <h1 className="Header"> Update your Profile </h1>}); 
      }
    });
    const Success = window.localStorage.getItem("Info");
    const number = JSON.parse(Success);
    if(number > 0){
      this.setState({
        alert: <Alert variant='success'>
                <p className='alertmessage'> You have succesfully updated your information </p>
                <CloseButton className='CloseButton' onClick={this.closebutton}> </CloseButton>
                </Alert>
      });
      window.localStorage.setItem('Info', JSON.stringify(number-1));
    }
    else if (number === 0){
      window.localStorage.removeItem("Info");
    }
    else{
      this.setState({
        alert: ''
      });
    }
  }

  render(){
    const userID = JSON.parse(window.localStorage.getItem("ID"));
    const Status = window.localStorage.getItem("Status");
    if(userID === null || Status !== "\"Yes\""){
      window.localStorage.removeItem("Status");
      return (<div className="Home"> <h1> Please <Link to={'/user/login'}> login </Link> to continue</h1> </div>);
    }
    else{
      return(
        <div className="information">
          <Navbar key={false} bg="light" expand={false} className="mb-3">
            <Container fluid>
              <Navbar.Brand href="#"> SlipFart </Navbar.Brand>
              <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-false`} className="text-left" />
              <Navbar.Offcanvas
                id={`offcanvasNavbar-expand-false`}
                aria-labelledby={`offcanvasNavbarLabel-expand-false`}
                placement="end"
              >
                <Offcanvas.Header closeButton>
                  <Offcanvas.Title id={`offcanvasNavbarLabel-expand-false`}>
                    Navigation Menu
                  </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                  <Nav className="justify-content-end flex-grow-1 pe-3">
                    <Nav.Link href="/buyer/home"> Home Page</Nav.Link>
                    <Nav.Link href="/buyer/profile"> User Profile </Nav.Link>
                    <Nav.Link href="/seller/home"> Seller Interface </Nav.Link>
                    <Nav.Link href="/buyer/information"> Update Profile </Nav.Link>
                    <Nav.Link href="/user/login" onClick={this.logoutbutton}> Logout </Nav.Link>
                  </Nav>
                </Offcanvas.Body>
              </Navbar.Offcanvas>
            </Container>
          </Navbar>
          {this.state.alert}
          {this.state.header}
          <div className="Information" style={{width: "100%", textAlign: "center"}}>
            <Form onSubmit={this.handleSubmit}>
              <Row className="Buffer"> </Row>
              <Row className="mb-3">
                <Col md={4}> </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label> Email Address </Form.Label>
                    <Form.Control type="text" placeholder="Enter Email" value={this.state.email} onChange={this.handleChangeEmail}/>
                  </Form.Group>
                </Col>
                <Col md={4}> </Col>
              </Row>
              <Row className="Buffer"> </Row>
              <Row className="mb-3">
                <Col md={4}> </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label> Address Line 1 </Form.Label>
                    <Form.Control type="text" placeholder="Enter your flat number and building name" value={this.state.first_line} onChange={this.handleChangeFirstLine} />
                  </Form.Group>
                </Col>
                <Col md={4}> </Col>
              </Row>
              <Row className="Buffer"> </Row>
              <Row className="mb-3">
                <Col md={4}> </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label> Address Line 2 </Form.Label>
                    <Form.Control type="text" placeholder="Enter your flat number and building name" value={this.state.second_line} onChange={this.handleChangeSecondLine} />
                  </Form.Group>
                </Col>
                <Col md={4}> </Col>
              </Row>
              <Row className="Buffer"> </Row>
              <Row className="mb-3">
                <Col md={4}> </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label> City </Form.Label>
                    <Form.Control type="text" placeholder="Enter City name" value={this.state.city} onChange={this.handleChangeCity} />
                  </Form.Group>
                </Col>
                <Col md={4}> </Col>
              </Row>
              <Row className="Buffer"> </Row>
              <Row className="mb-3">
                <Col md={4}> </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label> Postal Code </Form.Label>
                    <Form.Control type="text" placeholder="Enter Postal Code" value={this.state.postal_code} onChange={this.handleChangePostalCode} />
                  </Form.Group>
                </Col>
                <Col md={4}> </Col>
              </Row>
              <Row className="Buffer"> </Row>
              <Row className="mb-3">
                <Col md={4}> </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label> State </Form.Label>
                    <Form.Control type="text" placeholder="Enter State name" value={this.state.state_name} onChange={this.handleChangeState} />
                  </Form.Group>
                </Col>
                <Col md={4}> </Col>
              </Row>
              <Row className="Buffer"> </Row>
              <Row className="mb-3">
                <Col md={4}> </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label> Country </Form.Label>
                    <Form.Control type="text" placeholder="Enter Country name" value={this.state.country} onChange={this.handleChangeCountry} />
                  </Form.Group>
                </Col>
                <Col md={4}> </Col>
              </Row>
              <Row className="Buffer"> </Row>
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
        </div>
      );
    }
  }
}

export default Information;
