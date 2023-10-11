import './new_item.css';
import { Component } from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import CloseButton from 'react-bootstrap/CloseButton';
import { Link } from "react-router-dom";

let itemID;

class NewItem extends Component{
  constructor(props) {
    super(props);
    this.state = {Name: '', Quantity: '', Price: '', Dimensions: '', alert: '', description: '', type: '', image: '', picture: '', itemid: ''};
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeQuantity = this.handleChangeQuantity.bind(this);
    this.handleChangePrice = this.handleChangePrice.bind(this);
    this.handleChangeDimensions = this.handleChangeDimensions.bind(this);
    this.handleChangeDescription = this.handleChangeDescription.bind(this);
    this.handleChangeImage = this.handleChangeImage.bind(this);
    this.handleChangeType = this.handleChangeType.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  button(event){
    event.preventDefault();
    window.localStorage.removeItem("ID");
    window.localStorage.removeItem("Status");
    window.location.replace("/user/login");
  }

  handleChangeName(event) {
    this.setState({Name: event.target.value});
  }

  handleChangeQuantity(event) {
    this.setState({Quantity: event.target.value});
  }

  handleChangePrice(event) {
    this.setState({Price: event.target.value});
  }

  handleChangeDimensions(event) {
    this.setState({Dimensions: event.target.value});
  }

  handleChangeType(event) {
    this.setState({type: event.target.value});
  }

  handleChangeDescription(event) {
    this.setState({description: event.target.value});
  }

  handleChangeImage(event) {
    this.setState({image: event.target.files[0]});
  }

  handleSubmit(event) {
    event.preventDefault();
    var isValid = this.callAPI();
    isValid.then(res => {
      console.log(res);
      var keys = Object.keys(res);
      if(keys[0] === 'error'){
        this.setState({
          alert:  <div className='parent'> 
                    <Alert variant='danger' className="w-75"> 
                      <p> Database error occurred while adding the new item! Please check your input fields. </p>
                      <CloseButton className='CloseButton' onClick={this.errorclosebutton}> </CloseButton> 
                    </Alert>
                  </div>
        });
      }
      else if(keys[0] === 'status'){
        window.localStorage.setItem('New', JSON.stringify("1"));
        itemID = res['ID'];
      }
    })
    .then(outer_res => {
      isValid = this.imageAPI(itemID);
      isValid.then(res => {
        console.log(res);
        var keys = Object.keys(res);
        if(keys[0] === 'error'){
          this.setState({
            alert:  <div className='parent'> 
                      <Alert variant='danger' className="w-75"> 
                        <p> Database error occurred while adding the new item! Please check your input fields. </p>
                        <CloseButton className='CloseButton' onClick={this.errorclosebutton}> </CloseButton> 
                      </Alert>
                    </div>
          });
        }
        else if(keys[0] === 'status'){
          window.location.reload();
        }
      });
    });
  }

  closebutton(event){
    event.preventDefault();
    window.localStorage.removeItem("New");
    window.location.reload();
  }

  errorclosebutton(event){
    event.preventDefault();
    window.location.reload();
  }

  async imageAPI(iID) {
    const formData = new FormData();
    formData.append("file", this.state.image);
    const requestOptions = {
      method: 'POST',
      body: formData
    };
    return await fetch(`http://localhost:8080/image/${iID}`, requestOptions)
    .then(res => res.json())
    .then(res => {
      return res;
    })
    .catch((error) => {
      console.log(error.message);
    });
  }

  async callAPI() {
    const sellerID = JSON.parse(window.localStorage.getItem("ID"));
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sID: sellerID, name: this.state.Name, quantity: this.state.Quantity, price: this.state.Price, dimensions: this.state.Dimensions, description: this.state.description, type: this.state.type})
    };
    return await fetch(`http://localhost:8080/item/new`, requestOptions)
    .then(res => res.json())
    .then(res => {
      return res;
    })
    .catch((error) => {
      console.log(error.message);
    });
  }

  componentDidMount() {
    const Success = window.localStorage.getItem("New");
    const number = JSON.parse(Success);
    if(number > 0){
      this.setState({
        alert: <Alert variant='success'>
                <p className='alertmessage'> You have succesfully added this item </p>
                <CloseButton className='CloseButton' onClick={this.closebutton}> </CloseButton>
                </Alert>
      });
      window.localStorage.setItem('New', JSON.stringify(number-1));
    }
    else if (number === 0){
      window.localStorage.removeItem("New");
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
                    <Nav.Link href="/seller/home"> Home Page</Nav.Link>
                    <Nav.Link href="/seller/profile"> User Profile </Nav.Link>
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
          <h1 className="Header"> Add a New Item to your Inventory </h1>
          <div className="Login" style={{width: "100%", textAlign: "center"}}>
            <Form onSubmit={this.handleSubmit}>
              <Row className="Buffer"> </Row>
              <Row className="mb-3">
                <Col md={4}> </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label> Item Name </Form.Label>
                    <Form.Control type="text" placeholder="Enter Item Name" value={this.state.Name} onChange={this.handleChangeName}/>
                  </Form.Group>
                </Col>
                <Col md={4}> </Col>
              </Row>
              <Row className="Buffer"> </Row>
              <Row className="mb-3">
                <Col md={4}> </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label> Quantity </Form.Label>
                    <Form.Control type="text" placeholder="Enter Quantity" value={this.state.Quantity} onChange={this.handleChangeQuantity} />
                  </Form.Group>
                </Col>
                <Col md={4}> </Col>
              </Row>
              <Row className="Buffer"> </Row>
              <Row className="mb-3">
                <Col md={4}> </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label> Price </Form.Label>
                    <Form.Control type="text" placeholder="Enter Price of the item" value={this.state.Price} onChange={this.handleChangePrice} />
                  </Form.Group>
                </Col>
                <Col md={4}> </Col>
              </Row>
              <Row className="Buffer"> </Row>
              <Row className="mb-3">
                <Col md={4}> </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label> Dimensions </Form.Label>
                    <Form.Control type="text" placeholder="Enter Dimensions of the item (Eg. 100,200)" value={this.state.Dimensions} onChange={this.handleChangeDimensions}/>
                  </Form.Group>
                </Col>
                <Col md={4}> </Col>
              </Row>
              <Row className="Buffer"> </Row>
              <Row className="mb-3">
                <Col md={4}> </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label> Category </Form.Label>
                    <Form.Control type="text" placeholder="Enter the Category of the item (Eg. Fruits)" value={this.state.type} onChange={this.handleChangeType}/>
                  </Form.Group>
                </Col>
                <Col md={4}> </Col>
              </Row>
              <Row className="Buffer"> </Row>
              <Row className="mb-3">
                <Col md={4}> </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label> Item Description </Form.Label>
                    <Form.Control as="textarea" rows={3} type="text" placeholder="Describe your product in less than 100 words" value={this.state.description} onChange={this.handleChangeDescription}/>
                  </Form.Group>
                </Col>
                <Col md={4}> </Col>
              </Row>
              <Row className="Buffer"> </Row>
              <Row className="mb-3">
                <Col md={4}> </Col>
                <Col md={4}>
                  <input type="file" name="file" className='imageupload' onChange={this.handleChangeImage} />
                </Col>
                <Col md={4}> </Col>
              </Row>
              <Row className="Buffer"> </Row>
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

export default NewItem;
