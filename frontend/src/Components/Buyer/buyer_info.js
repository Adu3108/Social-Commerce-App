import './buyer_info.css';
import { Component } from "react";
import { Link } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import ListGroup from 'react-bootstrap/ListGroup';
import { ReactSearchAutocomplete } from 'react-search-autocomplete'

class Buyer extends Component{
  constructor(props) {
    super(props);
    this.state = { name : "", buyer_id : "", search: '', curr_Sales: '', pending_Sales: '', categories: ''};
    this.buybutton = this.buybutton.bind(this);
    this.cancelbutton = this.cancelbutton.bind(this);
    this.handleOnSearch = this.handleOnSearch.bind(this);
    this.handleOnHover = this.handleOnHover.bind(this);
    this.handleOnSelect = this.handleOnSelect.bind(this);
    this.handleOnFocus = this.handleOnFocus.bind(this);
    this.formatResult = this.formatResult.bind(this);
    this.categorybutton = this.categorybutton.bind(this);
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

  categorybutton(event){
    event.preventDefault();
    const category = event.target.value;
    window.location.replace("/category/"+category);
  }

  cancelbutton(event){
    event.preventDefault();
    const l = JSON.parse(event.target.value);
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tID: l[0], iID: l[1]})
    };
    fetch(`http://localhost:8080/transaction/cancel`, requestOptions)
    .then(res => res.json())
    .then(res => {
        window.location.reload();
    })
    .catch((error) => {
      console.log(error.message);
    });
  }

  handleOnSearch(string, results) {
  }

  handleOnHover(result){
  }

  handleOnSelect(item){
    window.location.replace('/product/' + item.itemid)
  }

  handleOnFocus(){
  }

  formatResult(item){
    return (
      <>
        <span style={{ display: 'block', textAlign: 'left' }}>Name: {item.name}</span>
        <span style={{ display: 'block', textAlign: 'left' }}>Type: {item.id}</span>
      </>
    )
  }

  callAPI() {
    const buyer_id = window.localStorage.getItem("ID");
    fetch(`http://localhost:8080/buyer/${buyer_id}`)
    .then(res => res.json())
    .then(res => {
      this.setState({
          name: res.buyerInfo[0].username,
      });
      this.setState({
        search: res.Search,
      })
      console.log(res);
      if(res.SaleItems.length!==0){
        var body = (
          <tbody>
            <tr>
              <th> Item Name</th>
              {res.SaleItems.map((records, i) =>
                  <td className="button" key={i}> <Link to={'/product/' + records.item_id} >{records.item_name}</Link></td>
              )}
            </tr>
            <tr>
              <th> Seller </th>
              {res.SaleItems.map((records, i) =>
                  <td className="button" key={i}> <Link to={'/contact/' + records.seller_id} >{records.seller_name}</Link></td>
              )}
            </tr>
            <tr>
              <th>Price</th>
              {res.SaleItems.map((records, i) =>
                <td className="button" key={i}> {records.price} </td>
              )}
            </tr>
            <tr>
              <th>Quantity</th>
              {res.SaleItems.map((records, i) =>
                <td className="button" key={i}>
                  <span className='quantity'> {records.quantity} </span>
                </td>
              )}
            </tr>
            <tr> 
              <th> Purchase </th> 
              {res.SaleItems.map((records, j) => 
                <td className="button" key={j}>
                    <Button variant="primary" value={JSON.stringify([buyer_id, records.item_id, records.seller_id])} onClick={this.buybutton}> Buy </Button>
                </td>
              )}
            </tr>
          </tbody>
        );
        this.setState({
          curr_Sales: <table className="table table-lg table-striped-columns table-bordered w-auto">
                        {body}
                      </table>
        });
      }
      else{
        this.setState({
          curr_Sales: <h4 className="exception"> No items currently for Sale </h4>
        });
      }
      if(res.PendingItems.length!==0){
        var pending_body = (
          <tbody>
            <tr>
              <th>Item Name</th>
              {res.PendingItems.map((records, i) =>
                  <td className="button" key={i}> <Link to={'/product/' + records.itemid} >{records.itemname}</Link></td>
              )}
            </tr>
            <tr>
              <th>Seller</th>
              {res.PendingItems.map((records, i) =>
                  <td className="button" key={i}> <Link to={'/contact/' + records.sellerid} >{records.sellername}</Link></td>
              )}
            </tr>
            <tr>
              <th>Quantity</th>
              {res.PendingItems.map((records, i) =>
                <td className="button" key={i}>
                  <span className='quantity'> {records.quantity} </span>
                </td>
              )}
            </tr>
            <tr>
              <th>Price</th>
              {res.PendingItems.map((records, i) =>
                <td className="button" key={i}> {records.price} </td>
              )}
            </tr>
            <tr>
              <th> Cancel </th>
              {res.PendingItems.map((records, j) => 
                <td className="button" key={j}>
                    <Button variant="danger" value={JSON.stringify([records.transactionid, records.itemid])} onClick={this.cancelbutton}> Cancel </Button>
                </td>
              )}
            </tr>
          </tbody>
        );
        this.setState({
          pending_Sales: <table className="table table-lg table-striped-columns table-bordered w-auto">
                          {pending_body}
                        </table>
        });
      }
      else{
        this.setState({
          pending_Sales:  <h4 className='exception'> You have no pending transactions </h4>
        });
      }
      if(res.Categories.length!==0){
          var category_body = (
              res.Categories.map((records, i) =>
                <ListGroup.Item as="li" className="d-flex justify-content-between align-items-start" key={i}>
                  <Button className="btn-link" value={records.type} onClick={this.categorybutton}>
                    {records.type} 
                  </Button>
                  <Badge bg="primary" pill>
                    {records.c}
                  </Badge>
                </ListGroup.Item>
          )
        );
        this.setState({
          categories: <ListGroup as="ol" numbered className='categorylist'>
                          {category_body}
                         </ListGroup>
                       
        });
      }
      else{
        this.setState({
          categories:  <h4 className='categoryexception'> No Categories Available </h4>
        });
      }
      return res;
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
                  <Nav.Link href="/buyer/home"> Home Page</Nav.Link>
                    <Nav.Link href="/buyer/profile"> User Profile </Nav.Link>
                    <Nav.Link href="/seller/home"> Seller Interface </Nav.Link>
                    <Nav.Link href="/buyer/information"> Update Profile </Nav.Link>
                    <Nav.Link href="/buyer/previous"> Previous Purchases </Nav.Link>
                    <Nav.Link href="/recommend"> Recommendations </Nav.Link>
                    <Nav.Link href="/user/login" onClick={this.button}> Logout </Nav.Link>
                  </Nav>
                </Offcanvas.Body>
              </Navbar.Offcanvas>
            </Container>
          </Navbar>
          <h1 className='welcomeheader'> Welcome {this.state.name} </h1>
          <div className='search'>
            <ReactSearchAutocomplete
              items={this.state.search}
              onSearch={this.handleOnSearch}
              onHover={this.handleOnHover}
              onSelect={this.handleOnSelect}
              onFocus={this.handleOnFocus}
              autoFocus
              formatResult={this.formatResult}
              placeholder='Search a product'
            />
          </div>
          <Container>
            <Row>
              <Col xs={4}> 
                <h3> Available Categories </h3>
              </Col>
              <Col xs={4}>
                <h3> Current Items for Sale </h3>
              </Col>
              <Col xs={4}>
                <h3 className='second'> Pending Transactions </h3>
              </Col>
            </Row>
            <Row className='mb-3'> </Row>
            <Row>
              <Col xs={4}> 
                {this.state.categories}
              </Col>
              <Col xs={4}>
                <div className="prevsales"> {this.state.curr_Sales} </div>
              </Col>
              <Col xs={4}>
                <div className="prev"> {this.state.pending_Sales} </div>
              </Col>
            </Row>
          </Container>
        </div>
      );
    }
  }
}

export default Buyer;

