import './previous_purchase.css';
import 'react-calendar/dist/Calendar.css';
import { Component, useState } from "react";
import { Link } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Button from 'react-bootstrap/Button';
import Calendar from 'react-calendar';
const moment= require('moment');

var mark = [];

class PreviousPurchase extends Component{
  constructor(props) {
    super(props);
    this.state = { name : "", buyer_id : "", prev_Sales: '', later_Sales: '', deliverydate: '', date: ''};
    this.setDate = this.setDate.bind(this);
    this.clean = this.clean.bind(this);
  }

  button(event){
    event.preventDefault();
    window.localStorage.removeItem("ID");
    window.localStorage.removeItem("Status");
    window.location.replace("/user/login");
  }

  setDate(event) {
    this.setState({
      date : new Date(event.target.value)
    })
  }

  clean(string){
   return string['delivery_date'].split('T')[0];
  }

  callAPI() {
    const buyer_id = window.localStorage.getItem("ID");
    fetch(`http://localhost:8080/buyer/previous/${buyer_id}`)
    .then(res => res.json())
    .then(res => {
      console.log(res);
      this.setState({
          name: res.buyerInfo[0].username
      });
      if(res.PrevDelivery.length!==0){
        var prev_body = (
          <tbody>
            <tr>
              <th>Item Name</th>
              {res.PrevDelivery.map((records, i) =>
                  <td className="button" key={i}> <Link to={'/product/' + records.itemid} >{records.itemname}</Link></td>
              )}
            </tr>
            <tr>
              <th>Seller</th>
              {res.PrevDelivery.map((records, i) =>
                  <td className="button" key={i}> <Link to={'/contact/' + records.sellerid} >{records.sellername}</Link></td>
              )}
            </tr>
            <tr>
              <th>Quantity</th>
              {res.PrevDelivery.map((records, i) =>
                <td className="button" key={i}>
                  <span className='quantity'> {records.quantity} </span>
                </td>
              )}
            </tr>
            <tr>
              <th>Price</th>
              {res.PrevDelivery.map((records, i) =>
                <td className="button" key={i}> {records.price} </td>
              )}
            </tr>
            <tr>
              <th> Review </th>
              {res.PrevDelivery.map((records, j) => 
                <td className="button" key={j}>
                    <Link to={"/review/" + records.transactionid}> <Button variant="info">  Write  </Button> </Link>
                </td>
              )}
            </tr>
          </tbody>
        );
        this.setState({
          prev_Sales: <table className="table table-lg table-striped-columns table-bordered w-auto">
                          {prev_body}
                        </table>
        });
      }
      else{
        this.setState({
          prev_Sales:  <h4 className='prevexception'> You have no previous purchases </h4>
        });
      }
      if(res.LaterDelivery.length!==0){
        var later_body = (
          <tbody>
            <tr>
              <th>Item Name</th>
              {res.LaterDelivery.map((records, i) =>
                  <td className="button" key={i}> <Link to={'/product/' + records.itemid} >{records.itemname}</Link></td>
              )}
            </tr>
            <tr>
              <th>Seller</th>
              {res.LaterDelivery.map((records, i) =>
                  <td className="button" key={i}> <Link to={'/contact/' + records.sellerid} >{records.sellername}</Link></td>
              )}
            </tr>
            <tr>
              <th>Quantity</th>
              {res.LaterDelivery.map((records, i) =>
                <td className="button" key={i}>
                  <span className='quantity'> {records.quantity} </span>
                </td>
              )}
            </tr>
            <tr>
              <th>Price</th>
              {res.LaterDelivery.map((records, i) =>
                <td className="button" key={i}> {records.price} </td>
              )}
            </tr>
            <tr>
              <th> Delivery Date </th>
              {res.LaterDelivery.map((records, i) =>
                <td className="button" key={i}> {moment(records.date.split('T')[0], 'YYYY-MM-DD').format("DD/MM/YYYY")} </td>
              )}
            </tr>
          </tbody>
        );
        this.setState({
          later_Sales: <table className="table table-lg table-striped-columns table-bordered w-auto">
                          {later_body}
                        </table>
        });
      }
      else{
        this.setState({
          later_Sales:  <h4 className='exception'> You have no item for dispatch </h4>
        });
      }
      if(res.deliverydates.length!=0){
        for(let i=0; i<res.deliverydates.length; i++){
          mark.push(this.clean(res.deliverydates[i]));
        }
      }
      else{
        mark = [];
      }
      console.log(mark);
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
      console.log(mark);
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
          <h1 className='previousheader'> Previous Purchases of {this.state.name} </h1>
          <div className='calendarclass'>
            <Calendar onChange={this.setDate} value={this.state.date} defaultView='year'
              tileClassName={({ date, view }) => {
                if(mark.find(x=>x===moment(date).format("YYYY-MM-DD"))){
                  return 'highlight';
                }
                else if(view=='year' && mark.find(x=>moment(x).month()===date.getMonth())){
                  return 'highlight';
                }
              }}
            />
          </div>
          <h3 className='note'> The green highlight indicates that one of the items that you have ordered will be delivered in that period</h3>
          <Container className='end'>
            <Row className='mb-3'> 
              <Col xs={6}> 
                <h3 className='PreviousItemsPurchased'> Previous Items Purchased </h3> 
              </Col>
              <Col xs={6}> 
                <h3 className='dispatch'> Items on Dispatch </h3>
              </Col>
            </Row>
            <Row>
              <Col xs={6}> 
                {this.state.prev_Sales}
              </Col>
              <Col xs={6}> 
                {this.state.later_Sales}
              </Col>
            </Row>
          </Container>
        </div>
      );
    }
  }
}

export default PreviousPurchase;

