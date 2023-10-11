import './recommend.css';
import { Component } from "react";
import { Link } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Button from 'react-bootstrap/Button';

class Recommendation extends Component{
  constructor(props) {
    super(props);
    this.state = { name : "", buyer_id : "", category_Sales: [], html: '', buyer_id: []};
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
  
  async productAPI(itemID){
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ iID: itemID })
    };
    return await fetch(`http://localhost:8080/product/recommend`, requestOptions)
    .then(res => res.json())
    .then(res => {
      return res;
    })
    .catch((error) => {
      console.log(error.message);
    });
  }

  async latestAPI(){
    const buyer_id = window.localStorage.getItem("ID");
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bID : buyer_id})
    };
    fetch(`http://localhost:8080/recommend`, requestOptions)
  }
  callAPI() {
    const buyer_id = window.localStorage.getItem("ID");
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data:  "0321719816"})
    };
    fetch(`http://localhost:8080/recommend`, requestOptions)
    .then(res => res.json())
    .then(res => {
      var array = res['Status'].split(", ");
      array[0] = array[0].substring(2,array[0].length-1);
      for(let index=1; index<array.length-1; index++)
      {
         array[index] = array[index].substring(1,array[index].length-1);
      }
      array[array.length-1] = array[array.length-1].substring(1,array[array.length-1].length-3);
      var isValid;
      for(let index=0; index<array.length; index++)
      {
        // console.log(array[index]);
        this.setState({
          buyer_id: this.state.buyer_id.concat([array[index]])
        });
        isValid = this.productAPI(array[index]);
        isValid.then(res => {
          this.setState({
            category_Sales: this.state.category_Sales.concat([res])
          });
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
      var html_body = (
        <table className="table table-lg table-striped-columns table-bordered w-auto">
        <tbody>
        <tr>
          <th> Product Name </th>
          {this.state.category_Sales.map((records, i) =>
              <td className="button" key={i}> <Link to={'/product/' + this.state.buyer_id[i]} > {records.name} </Link> </td>
          )}
        </tr>
        <tr>
          <th> Seller </th>
          {this.state.category_Sales.map((records, i) =>
              <td className="button" key={i}> <Link to={'/contact/' + records.sellerid} >{records.sellername}</Link></td>
          )}
        </tr>
        </tbody>
        </table>
      );
      console.log(this.state.category_Sales);
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
          {html_body}

        </div>
      );
    }
  }
}

export default Recommendation;

