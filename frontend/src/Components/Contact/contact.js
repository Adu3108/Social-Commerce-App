import './contact.css';
import { Component } from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from "react-router-dom";

class Contact extends Component{
  constructor(props) {
    super(props);
    this.state = {ID: '', name: '', buyeremail: '', selleremail: '', header: '', emailHeader : ''};
    this.logoutbutton = this.logoutbutton.bind(this);
  }

  logoutbutton(event){
    event.preventDefault();
    window.localStorage.removeItem("ID");
    window.localStorage.removeItem("Status");
    window.location.replace("/user/login");
  }

  async callAPI() {
    var ID = window.location.pathname;
    const UserID = ID.substring(9,ID.length);
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uID: UserID })
    };
    return await fetch('http://localhost:8080/contact', requestOptions)
    .then(res => res.json())
    .then(res => {
        this.setState({
            ID: <p className='value'> {res['ID']} </p> ,
            name: <p className='value'> {res['Name']} </p>
        });
        if(res['Buyer Email'] === null && res['Seller Email'] === null){
            this.setState({
                header: <Alert variant='danger' className='alertprofile'>
                            <p className='warning'> This user hasn't provided us their contact details. </p>
                        </Alert>
            });
        }
        else{
            this.setState({
                emailHeader: <h3 className='fields'> Email : </h3>,
                buyeremail : <p className='value'> {res['Buyer Email']} </p>,
                selleremail : <p className='value'> {res['Seller Email']} </p>,
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
                    <Nav.Link href="/seller/home"> Seller Home Page</Nav.Link>
                    <Nav.Link href="/buyer/home"> Buyer Home Page</Nav.Link>
                    <Nav.Link href="/user/login" onClick={this.logoutbutton}> Logout </Nav.Link>
                  </Nav>
                </Offcanvas.Body>
              </Navbar.Offcanvas>
            </Container>
          </Navbar>
          {this.state.header}
          <h1 className='contactheader'> User Profile</h1>
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
              <Col md={4}> {this.state.emailHeader} </Col>
              <Col md={4}> {this.state.buyeremail} </Col>
          </Row>
          <Row className="mb-4">
              <Col md={{ span: 1, offset: 2 }}></Col>
              <Col md={4}> </Col>
              <Col md={4}> {this.state.selleremail} </Col>
          </Row>
        </div>
      );
    }
  }
}

export default Contact;
