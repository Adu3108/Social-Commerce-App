import "./landing.css"
import { Component } from "react";
import { Link } from "react-router-dom";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class UserHome extends Component{
  constructor(props) {
    super(props);
    this.state = {ID: "", role: ""};
  }
  
  render(){
    return (
        <div className="Home">
            <div class="container">
            <Row className="mb-4">
                <Col md={7}> 
                  <h1 className="registerationheader"> Don't have an Account? </h1>
                  <h2 className="firstlink"> Click on this <Link to='/user/register'> link </Link></h2>
                </Col>
                <Col md={5}> 
                  <h1 className="loginheader"> Already an user? </h1>
                  <h2 className="secondlink"> Click on this <Link to='/user/login'> link </Link></h2>
                </Col>
                {/* <Col md={4}> 
                  <h1> Are you a Moderator? </h1>
                  <h2 className="thirdlink"> Click on this <Link to='/user/register'> link </Link></h2>
                </Col> */}
            </Row>
            </div>
        </div>
    );
  }
}

export default UserHome;
