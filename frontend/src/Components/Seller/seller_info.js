import './seller_info.css';
import { Component } from "react";
import { Link } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import CloseButton from 'react-bootstrap/CloseButton';

class seller_Info extends Component{
  constructor(props) {
    super(props);
    this.state = { name : "", seller_id : "", curr_Sales : '', prev_Sales : '', alert: '', pending_Sales: ''};
    this.deletebutton = this.deletebutton.bind(this);
    this.rejectbutton = this.rejectbutton.bind(this);
    this.acceptbutton = this.acceptbutton.bind(this);
  }

  button(event){
    event.preventDefault();
    window.localStorage.removeItem("ID");
    window.localStorage.removeItem("Status");
    window.location.replace("/user/login");
  }

  increment(itemID, quantity){
    const sellerID = JSON.parse(window.localStorage.getItem("ID"));
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ iID: itemID, quantity: quantity, sID: sellerID})
    };
    fetch(`http://localhost:8080/item/increment`, requestOptions)
    .then(res => res.json())
    .then(res => {
        console.log(res);
    })
    .catch((error) => {
      console.log(error.message);
    });
    window.location.reload();
  }

  decrement(itemID, quantity){
    const sellerID = JSON.parse(window.localStorage.getItem("ID"));
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ iID: itemID, quantity: quantity, sID: sellerID})
    };
    fetch(`http://localhost:8080/item/decrement`, requestOptions)
    .then(res => res.json())
    .then(res => {
      var keys = Object.keys(res);
      if(keys[0] === 'zero'){
        window.localStorage.setItem('Success', JSON.stringify("1"));
      }
    })
    .catch((error) => {
      console.log(error.message);
    });
    window.location.reload();
  }

  deletebutton(event){
    event.preventDefault();
    const itemID = event.target.value;
    var isValid = this.deleteAPI(itemID);
    isValid.then(res => {
      var keys = Object.keys(res);
      if(keys[0] === 'error'){
        this.setState({
          alert: <Alert variant='danger'>
                  <p> {res['error']} </p>
                 </Alert>
        });
      }
      else if(keys[0] === 'message'){
        window.localStorage.setItem('Success', JSON.stringify("1"));
        window.location.reload();
      }
    })
  }

  closebutton(event){
    event.preventDefault();
    window.localStorage.removeItem("Success");
    window.location.reload();
  }

  rejectbutton(event){
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

  acceptbutton(event){
    event.preventDefault();
    window.location.replace('/delivery/' + event.target.value);
    // const transactionID = event.target.value;
    // const requestOptions = {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ tID: transactionID})
    // };
    // fetch(`http://localhost:8080/transaction/accept`, requestOptions)
    // .then(res => res.json())
    // .then(res => {
    //     window.location.reload();
    // })
    // .catch((error) => {
    //   console.log(error.message);
    // });
  }

  async deleteAPI(itemID) {
    const sellerID = JSON.parse(window.localStorage.getItem("ID"));
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ iID: itemID, sID: sellerID})
    };
    return await fetch(`http://localhost:8080/item/delete`, requestOptions)
    .then(res => res.json())
    .then(res => {
        return res;
    })
    .catch((error) => {
      console.log(error.message);
    });
  }

  callAPI() {
    const seller_id = window.localStorage.getItem("ID");
    fetch(`http://localhost:8080/seller/${seller_id}`)
    .then(res => res.json())
    .then(res => {
      console.log(res);
      this.setState({
          name: res.sellerInfo[0].username,
      });
      if(res.CurrentSales.length!==0){
        var body = (
          <tbody>
            <tr>
              <th>Sale Name</th>
              {res.CurrentSales.map((records, i) =>
                  <td className="button" key={i}> <Link to={'/product/' + records.id} >{records.name}</Link></td>
              )}
            </tr>
            <tr>
              <th>Price</th>
              {res.CurrentSales.map((records, i) =>
                <td className="button" key={i}> {records.price} </td>
              )}
            </tr>
            <tr>
              <th>Quantity</th>
              {res.CurrentSales.map((records, i) =>
                <td className="button" key={i}> 
                  <Button variant="outline-dark border-0" onClick={() => { this.increment(records.id, records.quantity)}}>+</Button>
                  <span className='quantity'> {records.quantity} </span>
                  <Button variant="outline-dark border-0" onClick={() => { this.decrement(records.id, records.quantity)}}>-</Button>
                </td>
              )}
            </tr>
            <tr> 
              <th> Delete </th> 
              {res.CurrentSales.map((records, j) => 
                <td className="button" key={j}>
                  <Button variant="danger" value={records.id} onClick={this.deletebutton}> Delete </Button>
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
          curr_Sales: <h4 className='firstexception'> No Current Sales </h4>
        });
      }
      if(res.PendingSales.length!==0){
        var pending_body = (
          <tbody>
            <tr>
              <th>Item Name</th>
              {res.PendingSales.map((records, i) =>
                  <td className="button" key={i}> <Link to={'/product/' + records.id} >{records.itemname}</Link></td>
              )}
            </tr>
            <tr>
              <th>Buyer</th>
              {res.PendingSales.map((records, i) =>
                  <td className="button" key={i}> <Link to={'/contact/' + records.buyerid} >{records.buyername}</Link></td>
              )}
            </tr>
            <tr>
              <th>Quantity</th>
              {res.PendingSales.map((records, i) =>
                <td className="button" key={i}>
                  <span className='quantity'> {records.quantity} </span>
                </td>
              )}
            </tr>
            <tr>
              <th>Price</th>
              {res.PendingSales.map((records, i) =>
                <td className="button" key={i}> {records.price} </td>
              )}
            </tr>
            <tr>
              <th> Accept </th>
              {res.PendingSales.map((records, j) => 
                <td className="button" key={j}>
                    <Button variant="primary" value={records.transactionid} onClick={this.acceptbutton}> Accept </Button>
                </td>
              )}
            </tr>
            <tr>
              <th> Reject </th>
              {res.PendingSales.map((records, j) => 
                <td className="button" key={j}>
                    <Button variant="danger" value={JSON.stringify([records.transactionid, records.itemid])} onClick={this.rejectbutton}> Cancel </Button>
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
          pending_Sales:  <h4 className='middleexception'> You have no pending transactions </h4>
        });
      }
      if(res.PreviousSales.length!==0){
        var prev_body = (
          <tbody>
            <tr>
              <th>Item Name</th>
              {res.PreviousSales.map((records, i) =>
                  <td className="button" key={i}> <Link to={'/product/' + records.itemid} >{records.itemname}</Link></td>
              )}
            </tr>
            <tr>
              <th>Seller</th>
              {res.PreviousSales.map((records, i) =>
                  <td className="button" key={i}> <Link to={'/contact/' + records.buyerid} >{records.buyername}</Link></td>
              )}
            </tr>
            <tr>
              <th>Quantity</th>
              {res.PreviousSales.map((records, i) =>
                <td className="button" key={i}>
                  <span className='quantity'> {records.quantity} </span>
                </td>
              )}
            </tr>
            <tr>
              <th>Price</th>
              {res.PreviousSales.map((records, i) =>
                <td className="button" key={i}> {records.price} </td>
              )}
            </tr>
            <tr>
              <th>Status</th>
              {res.PreviousSales.map((records, i) =>
                <td className="button" key={i}> {records.status} </td>
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
          prev_Sales:  <h4 className='exception'> You haven't purchased any items </h4>
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
    const Success = window.localStorage.getItem("Success");
    const number = JSON.parse(Success);
    if(number > 0){
      this.setState({
        alert: <Alert variant='success'>
                <p className='alertmessage'> You have succesfully deleted this item </p>
                <CloseButton className='CloseButton' onClick={this.closebutton}> </CloseButton>
                </Alert>
      });
      window.localStorage.setItem('Success', JSON.stringify(number-1));
    }
    else if (number === 0){
      window.localStorage.removeItem("Success");
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
                    <Nav.Link href="/seller/home"> Home Page</Nav.Link>
                    <Nav.Link href='/seller/profile'> User Profile </Nav.Link>
                    <Nav.Link href="/buyer/home"> Buyer Interface </Nav.Link>
                    <Nav.Link href="/seller/new"> Add New Item </Nav.Link>
                    <Nav.Link href="/seller/information"> Update Profile </Nav.Link>
                    <Nav.Link href="/user/login" onClick={this.button}> Logout </Nav.Link>
                  </Nav>
                </Offcanvas.Body>
              </Navbar.Offcanvas>
            </Container>
          </Navbar>
          {this.state.alert}
          <h1 className='welcomeseller'> Welcome {this.state.name} </h1>
          <Container>
            <Row>
              <Col xs={4} className='leftcolumn'>
                <h3> Current Items for Sale </h3>
              </Col>
              <Col xs={4}>
                <h3 className='secondseller'> Pending Transactions </h3>
              </Col>
              <Col xs={4} className='rightcolumn'>
                <h3 className='thirdseller'> Previous Items Sold </h3>
              </Col>
            </Row>
            <Row className='mb-3'> </Row>
            <Row>
              <Col xs={4} className='leftcolumn'>
                <div className="prev"> {this.state.curr_Sales} </div>
              </Col>
              <Col xs={4}>
                <div className="prev"> {this.state.pending_Sales} </div>
              </Col>
              <Col xs={4} className='rightcolumn'>
                <div className="prev"> {this.state.prev_Sales} </div>
              </Col>
            </Row>
          </Container>
        </div>
      );
    }
  }
}

export default seller_Info;

