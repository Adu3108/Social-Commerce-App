import './product.css';
import { Component } from "react";
import { Link } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const starArray = [...Array(5).keys()].map(i => i + 1);

class Product extends Component{
  constructor(props) {
    super(props);
    this.state = {name: '', price: '', dimensions: '', category: '', sellername: '', quantity : '', sellerid: '', desc: '', reviews: '', button: '', image: ''};
    this.logoutbutton = this.logoutbutton.bind(this);
    this.buybutton = this.buybutton.bind(this);
  }

  logoutbutton(event){
    event.preventDefault();
    window.localStorage.removeItem("ID");
    window.localStorage.removeItem("Status");
    window.location.replace("/user/login");
  }

  buybutton(event){
    event.preventDefault();
    const l = JSON.parse(event.target.value);
    window.localStorage.setItem("buyer_id", JSON.stringify("\"" + l[0] + "\""));
    window.localStorage.setItem("sale_id", JSON.stringify(l[1]));
    window.localStorage.setItem("seller_id", JSON.stringify(l[2]));
    window.location.replace("/payment");
  }

  async callAPI(itemID) {
    var userID = window.localStorage.getItem("ID");
    userID = userID.substring(1,userID.length-1);
    return await fetch(`http://localhost:8080/product/${itemID}`)
    .then(res => res.json())
    .then(res => {
        console.log(res);
        const product_image = require('../../../../backend/images/' + res['image']);
        this.setState({
            name: <p className='value'> {res['name']} </p>,
            price: <p className='value'> {res['price']} </p>,
            dimensions: <p className='value'> {res['dimensions']} </p>,
            category: <p className='value'> {res['category']} </p>,
            quantity: <p className='value'> {res['quantity']} </p>,
            sellername: <p className='value'> {res['sellername']} </p>,
            sellerid: res['sellerid'],
            desc: res['desc'],
            image: <img src={product_image} className='productImage'/>
        });
        if(res['quantity']>0 && userID != res['sellerid']){
          this.setState({
            button: <Button variant="primary" className='BuyButton' size="lg" value={JSON.stringify([userID, itemID, res['sellerid']])} onClick={this.buybutton}> Buy </Button>
          });
        }
        if(res.review.length!==0){
          var body = (
                res.review.map((records, i) =>
                    <Row className="card_review" key={i}>
                      <Col md={2}> 
                      <Row className="mb-4">
                        <h3> <Link to={'/contact/' + records.buyerid}> {records.buyername} </Link> : </h3> 
                      </Row>
                      <Row className="mb-4">
                        {starArray.map(j => (
                          <Col md={2} className='totalstars'> 
                          <FontAwesomeIcon
                            key={j}
                            icon={faStar}
                            className='stardisplay'
                            color={records.stars >= j ? "orange" : "lightgrey"}
                          />
                          </Col>
                        ))}
                      </Row>
                      </Col>
                      <Col md={10}> 
                        <Card>
                          <Card.Body> <h5 className='itemdesc'> {records.comment} </h5> </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                )
          );
          this.setState({
            reviews: <div> {body} </div>
          });
        }
        else{
          this.setState({
            reviews: <h4 className="reviewexception"> No Reviews for this product </h4>
          });
        }
    })
    .catch((error) => {
      console.log(error.message);
    });
  }

  componentDidMount() {
    var itemID = window.location.pathname;
    itemID = itemID.substring(9,itemID.length);
    this.callAPI(itemID);
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
          <h1 className='productmainheader'> Product Page</h1>
          {this.state.image}
          {this.state.button}
          <Row className="mb-4">
              <Col md={4}> <h3 className='fields'> Product Name : </h3> </Col>
              <Col md={2}> {this.state.name} </Col>
              <Col md={3}> <h3 className='fields'> Seller Name : </h3> </Col>
              <Col md={2}> <Link to={'/contact/' + this.state.sellerid}> {this.state.sellername} </Link> </Col>
          </Row>
          <Row className="mb-4"> </Row>
          <Row className="mb-4">
              <Col md={4}> <h3 className='fields'> Available Quantity : </h3> </Col>
              <Col md={2}> {this.state.quantity} </Col>
              <Col md={3}> <h3 className='fields'> Product Price : </h3> </Col>
              <Col md={2}> {this.state.price} </Col>
          </Row>
          <Row className="mb-4"> </Row>
          <Row className="mb-4">
              <Col md={4}> <h3 className='fields'> Product Dimensions : </h3> </Col>
              <Col md={2}> {this.state.dimensions} </Col>
              <Col md={3}> <h3 className='fields'> Product Category : </h3> </Col>
              <Col md={2}> {this.state.category} </Col>
          </Row>
          <Row className="mb-4"> </Row>
          <h1 className='itemheader'> Item Description </h1>
          <Card>
            <Card.Body> <h5 className='itemdesc'> {this.state.desc} </h5> </Card.Body>
          </Card>
          <h1 className='itemheader'> Reviews by other customers</h1>
          {this.state.reviews}
        </div>
      );
    }
  }
}

export default Product;
