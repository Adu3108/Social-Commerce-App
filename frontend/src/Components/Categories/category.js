import './category.css';
import { Component } from "react";
import { Link } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Button from 'react-bootstrap/Button';

class Category extends Component{
  constructor(props) {
    super(props);
    this.state = { name : "", buyer_id : "", category_Sales: '',};
    this.buybutton = this.buybutton.bind(this);
  }

  button(event){
    event.preventDefault();
    window.localStorage.removeItem("ID");
    window.localStorage.removeItem("Status");
    window.location.replace("/user/login");
  }

  buybutton(event){
    event.preventDefault();
    const l = JSON.parse(event.target.value);
    window.localStorage.setItem("buyer_id", JSON.stringify(l[0]));
    window.localStorage.setItem("sale_id", JSON.stringify(l[1]));
    window.localStorage.setItem("seller_id", JSON.stringify(l[2]));
    window.location.replace("/payment");
  }
  
  callAPI(CategoryName) {
    const buyer_id = window.localStorage.getItem("ID");
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bID:  buyer_id})
    };
    fetch(`http://localhost:8080/category/${CategoryName}`, requestOptions)
    .then(res => res.json())
    .then(res => {
      this.setState({
        name: CategoryName,
      });
      console.log(res);
      if(res.Products.length!==0){
        var body = (
          <tbody>
            <tr>
              <th> Item Name</th>
              {res.Products.map((records, i) =>
                  <td className="button" key={i}> <Link to={'/product/' + records.item_id} >{records.item_name}</Link></td>
              )}
            </tr>
            <tr>
              <th> Seller </th>
              {res.Products.map((records, i) =>
                  <td className="button" key={i}> <Link to={'/contact/' + records.seller_id} >{records.seller_name}</Link></td>
              )}
            </tr>
            <tr>
              <th>Price</th>
              {res.Products.map((records, i) =>
                <td className="button" key={i}> {records.price} </td>
              )}
            </tr>
            <tr>
              <th>Quantity</th>
              {res.Products.map((records, i) =>
                <td className="button" key={i}>
                  <span className='quantity'> {records.quantity} </span>
                </td>
              )}
            </tr>
            <tr> 
              <th> Purchase </th> 
              {res.Products.map((records, j) => 
                <td className="button" key={j}>
                    <Button variant="primary" value={JSON.stringify([buyer_id, records.item_id, records.seller_id])} onClick={this.buybutton}> Buy </Button>
                </td>
              )}
            </tr>
          </tbody>
        );
        this.setState({
          category_Sales: <table className="table table-lg table-striped-columns table-bordered w-auto">
                        {body}
                      </table>
        });
      }
      else{
        this.setState({
          category_Sales: <h4 className="exception"> No items of this category are currently available </h4>
        });
      }
      return res;
    })
    .catch((error) => {
      console.log(error.message);
    });
  }

  componentDidMount() {
    var CategoryName = window.location.pathname;
    CategoryName = CategoryName.substring(10,CategoryName.length);
    this.callAPI(CategoryName);
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
        <div className="seller_Info">
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
                    <Nav.Link href="/user/login" onClick={this.button}> Logout </Nav.Link>
                  </Nav>
                </Offcanvas.Body>
              </Navbar.Offcanvas>
            </Container>
          </Navbar>
          <h1 className='categoryheader'> Products of {this.state.name} Category </h1>
          <Container>
            <Row className='mb-3'> </Row>
            <Row>
              <Col xs={4}> </Col>
              <Col xs={4}>
                <div className="prev"> {this.state.category_Sales} </div>
              </Col>
              <Col xs={4}> </Col>
            </Row>
          </Container>
        </div>
      );
    }
  }
}

export default Category;

