import './review.css';
import { Component } from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ReactStars from "react-rating-stars-component";
import { Link } from "react-router-dom";

let stars = 0;
class Review extends Component{
  constructor(props) {
    super(props);
    this.state = {buyer: '', seller: '', itemid: '', description: '', transactionid: ''};
    this.handleChangeDescription = this.handleChangeDescription.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  button(event){
    event.preventDefault();
    window.localStorage.removeItem("ID");
    window.localStorage.removeItem("Status");
    window.location.replace("/user/login");
  }

  handleChangeDescription(event) {
    this.setState({description: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    var isValid = this.callAPI();
    isValid.then(res => {
      window.location.replace("/buyer/home");
    });
  }

  ratingChanged(newRating){
    stars= newRating;
    console.log(stars);
  };

  async callAPI() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sID: this.state.seller, bID: this.state.buyer, iID: this.state.itemid, tID: this.state.transactionid, desc: this.state.description, stars: stars })
    };
    return await fetch(`http://localhost:8080/review/new`, requestOptions)
    .then(res => res.json())
    .then(res => {
      return res;
    })
    .catch((error) => {
      console.log(error.message);
    });
  }

  async infoAPI(transactionID) {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tID: transactionID})
    };
    fetch(`http://localhost:8080/review/info`, requestOptions)
    .then(res => res.json())
    .then(res => {
      this.setState({
        buyer : res['buyer'],
        seller : res['seller'],
        itemid : res['itemid'],
        transactionid : transactionID
      })
    })
    .catch((error) => {
      console.log(error.message);
    });
  }

  componentDidMount() {
    var tID = window.location.pathname;
    tID = tID.substring(8,tID.length);
    this.infoAPI(tID);
  }

  render(){
    const userID = JSON.parse(window.localStorage.getItem("ID"));
    const Status = window.localStorage.getItem("Status");
    if(userID === null || Status !== "\"Yes\""){
      window.localStorage.removeItem("Status");
      return (<div className="Home"> <h1> Please <Link to={'/user/login'}> login </Link> to continue</h1> </div>);
    }
    else{
      return (
        <div className="new_item">
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
          <h1 className="ReviewHeader"> Add a Review </h1>
          <div className="Login" style={{width: "100%", textAlign: "center"}}>
            <Form onSubmit={this.handleSubmit}>
              <Row className="Buffer"> </Row>
              <Row className="mb-3">
                <Col md={5}> </Col>
                <Col md={3} className='stars'>
                  <ReactStars
                    count={5}
                    onChange={this.ratingChanged}
                    size={48}
                    activeColor="#ffd700"
                  />
                </Col>
                <Col md={5}> </Col>
              </Row>
              <Row className="mb-3">
                <Col md={4}> </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Control as="textarea" rows={3} type="text" placeholder="Write your review in less than 100 words" value={this.state.description} onChange={this.handleChangeDescription}/>
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
        </div>
      );
    }
  }
}

export default Review;
