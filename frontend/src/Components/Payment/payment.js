import './payment.css';
import { Component } from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import CloseButton from 'react-bootstrap/CloseButton';
import { Link } from "react-router-dom";

let buyer_id;
let seller_id;
let sale_id;
let quantity;

class Payment extends Component{
  constructor(props) {
    super(props);
    this.state = {item_ID: '', seller_id: '', buyer_id: '', quantity: '', alert: ''};
    this.logoutbutton = this.logoutbutton.bind(this);
    this.handleChangeQuantity = this.handleChangeQuantity.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  logoutbutton(event){
    event.preventDefault();
    window.localStorage.removeItem("ID");
    window.localStorage.removeItem("Status");
    window.location.replace("/user/login");
  }

  closebutton(event){
    event.preventDefault();
    window.localStorage.removeItem("Payment");
    window.location.reload();
  }

  handleChangeQuantity(event) {
    quantity = event.target.value;
    this.setState({quantity: event.target.value});
  }

  async callAPI(bID, sID, saleID, Q) {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ buyer_id: bID, seller_id: sID, sale_id: saleID, quantity: Q })
    };
    return await fetch('http://localhost:8080/payment', requestOptions)
    .then(res => res.json())
    .then(res => {
      return res;
    })
    .catch((error) => {
      console.log(error.message);
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    var isValid = this.callAPI(buyer_id, seller_id, sale_id, quantity);
    isValid.then(res => {
      console.log(res);
      var keys = Object.keys(res);
      window.localStorage.setItem('Payment', JSON.stringify("1"));
      if(keys[0] === 'error'){
        this.setState({
          alert:  <Alert variant='danger' className='alertpayment'>
                    <p className='warning'> Database error occurred while purchasing this item! Please check your input fields.  </p>
                    <CloseButton className='CloseButton' onClick={this.closebutton}> </CloseButton>
                  </Alert>
        });
      }
      else if(keys[0] === 'status'){
        this.setState({
          alert:  <Alert variant='success' className='paymentsuccess'>
                    <p> You have successfully completed the payment  </p>
                    <CloseButton className='CloseButton' onClick={this.closebutton}> </CloseButton>
                  </Alert>
        });
        window.location.replace('buyer/home')
      }
    });
  }

  componentDidMount() {
    buyer_id = window.localStorage.getItem("buyer_id");
    seller_id = window.localStorage.getItem("seller_id");
    sale_id = window.localStorage.getItem("sale_id");
    // window.localStorage.removeItem("buyer_id");
    // window.localStorage.removeItem("seller_id");
    // window.localStorage.removeItem("sale_id");
    buyer_id = buyer_id.substring(3, buyer_id.length-3);
    seller_id = seller_id.substring(1, seller_id.length-1);
    sale_id = sale_id.substring(1, sale_id.length-1);
    const Success = window.localStorage.getItem("Payment");
    const number = JSON.parse(Success);
    if(number > 0){
      window.localStorage.setItem('Payment', JSON.stringify(number-1));
    }
    else if (number === 0){
      window.localStorage.removeItem("Payment");
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
          {this.state.alert}
          <h1 className='paymentheader'> Complete Your Payment </h1>
          <Form onSubmit={this.handleSubmit}>
              <Form.Group as={Row} className="mb-3">
                <Col sm={4}> </Col>
                <Col sm={2}>
                  <Form.Label className='formlabel'> Please Enter Quantity </Form.Label>
                </Col>
                <Col sm={2}>
                  <Form.Control type="text" placeholder="Enter Quantity" value={this.state.quantity} onChange={this.handleChangeQuantity} className='formvalue'/>
                </Col>
              </Form.Group>
              <Row className="mb-3"> </Row>
              <Row className="mb-3">
                <Col md={5}> </Col>
                <Col md={1} className='buttons'> 
                  <Button variant="primary" type="submit" >
                    Submit
                  </Button>
                </Col>
                <Col md={4}> </Col>
              </Row>
            </Form>
        </div>
      );
    }
  }
}

export default Payment;
