import { useState } from 'react';
import Calendar from 'react-calendar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Button from 'react-bootstrap/Button';
import './calendar.css';
import 'react-calendar/dist/Calendar.css';
const moment = require('moment') 

function formatDate(date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [year, month, day].join('-');
}

function CalendarClass() {
  const [date, setDate] = useState(new Date());

  function logoutbutton(){
    window.localStorage.removeItem("ID");
    window.localStorage.removeItem("Status");
    window.location.replace("/user/login");
  }

  function confirmbutton(){
    var transactionID = window.location.pathname;
    transactionID = transactionID.substring(10,transactionID.length);
    const new_date = formatDate(date);
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tID: transactionID, date: new_date})
    };
    fetch(`http://localhost:8080/transaction/accept`, requestOptions)
    .then(res => res.json())
    .then(res => {
        window.location.replace('/seller/home');
    })
    .catch((error) => {
      console.log(error.message);
    });
  }

  return (
    <div>
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
                <Nav.Link href="/user/login" onClick={logoutbutton}> Logout </Nav.Link>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
      <h1 className='CalendarHeader'> Set a Delivery Date </h1>
      <div className='calendarclass'>
        <Calendar onChange={setDate} value={date} />
      </div>
      <h3 className='selectedDate'>
        <span className='bold'>Selected Date:</span>{' '}
        {date.toDateString()}
      </h3>
      <Button variant="primary" className='BuyButton' size="lg" onClick={confirmbutton}> Confirm </Button>
    </div>
  );
}

export default CalendarClass;