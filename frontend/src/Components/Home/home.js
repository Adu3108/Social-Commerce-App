import "./home.css"
import { Component } from "react";
import { Link } from "react-router-dom";

class UserHome extends Component{
  constructor(props) {
    super(props);
    this.state = {ID: "", role: ""};
  }
  
  render(){
    const userID = JSON.parse(window.localStorage.getItem("ID"));
    const Status = window.localStorage.getItem("Status");
    if(userID === null || Status !== "\"Yes\""){
      window.localStorage.removeItem("Status");
      return (<div className="Login"> <h1> Please <Link to={'/user/login'}> login </Link> to continue</h1> </div>);
    }
    else{
        const buyer_logo = require('../../static/buyer_small.png');
        const seller_logo = require('../../static/seller_small.png');
        return (
            <div className="Home">
                <div class="container">
                    <h1 className="homeheader"> Are you a </h1>
                    <div class="row">
                      <div className="col" role="button">
                        <Link to='/buyer/home' > 
                          <h2> Buyer </h2>
                          <img src={buyer_logo} />
                        </Link>
                      </div>
                      <div className="col" role="button">
                        <Link to='/seller/home' > 
                          <h2> Seller </h2>
                          <img src={seller_logo} />
                        </Link>
                      </div>
                    </div>
                </div>
            </div>
        );
    }
  }
}

export default UserHome;
