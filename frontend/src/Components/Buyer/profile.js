import './profile.css';
import { Component } from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from "react-router-dom";

class BuyerProfile extends Component{
  constructor(props) {
    super(props);
    this.state = {ID: '', name: '', email: '', address: '', header: '', addressHeader : '', emailHeader : ''};
    this.logoutbutton = this.logoutbutton.bind(this);
  }

  logoutbutton(event){
    event.preventDefault();
    window.localStorage.removeItem("ID");
    window.localStorage.removeItem("Status");
    window.location.replace("/user/login");
  }

  async callAPI() {
    const SellerID = window.localStorage.getItem("ID");
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sID: SellerID })
    };
    return await fetch('http://localhost:8080/buyer/profile', requestOptions)
    .then(res => res.json())
    .then(res => {
        this.setState({
            ID: <p className='value'> {res['ID']} </p> ,
            name: <p className='value'> {res['Name']} </p>
        });
        if(res['Address'] === null){
            this.setState({
                header: <div className='buyerprofile'>
                          <Alert variant='danger w-50'>
                            <p className='alertbuyer'> You haven't filled your address and email address. Go to this <Alert.Link href="/seller/information">form</Alert.Link> to fill your details </p>
                          </Alert>
                        </div>
            });
        }
        else{
            this.setState({
                addressHeader: <h3 className='fields'> Address : </h3>,
                address: <p className='value'> {res['Address']} </p>,
                emailHeader: <h3 className='fields'> Email : </h3>,
                email : <p className='value'> {res['Email']} </p>,
                header: ''
            });
        }
    })
    .catch((error) => {
      console.log(error.message);
    });
  }

  componentDidMount() {
    this.callAPI();
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
        <div className="profile">
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
                    <Nav.Link href="/buyer/previous"> Previous Purchases </Nav.Link>
                    <Nav.Link href="/recommend"> Recommendations </Nav.Link>
                    <Nav.Link href="/user/login" onClick={this.logoutbutton}> Logout </Nav.Link>
                  </Nav>
                </Offcanvas.Body>
              </Navbar.Offcanvas>
            </Container>
          </Navbar>
          {this.state.header}
          <h1 className='buyerprofileheaderfile'> User Profile</h1>
          <Row className="mb-4">
              <Col md={{ span: 1, offset: 2 }}></Col>
              <Col md={4}> <h3 className='fields'> ID : </h3> </Col>
              <Col md={4}> {this.state.ID} </Col>
          </Row>
          <Row className="mb-4">
              <Col md={{ span: 1, offset: 2 }}></Col>
              <Col md={4}> <h3 className='fields'> Name : </h3> </Col>
              <Col md={4}> {this.state.name} </Col>
          </Row>
          <Row className="mb-4">
              <Col md={{ span: 1, offset: 2 }}></Col>
              <Col md={4}> {this.state.addressHeader} </Col>
              <Col md={4}> {this.state.address} </Col>
          </Row>
          <Row className="mb-4">
              <Col md={{ span: 1, offset: 2 }}></Col>
              <Col md={4}> {this.state.emailHeader} </Col>
              <Col md={4}> {this.state.email} </Col>
          </Row>
        </div>
      );
    }
  }
}

export default BuyerProfile;
