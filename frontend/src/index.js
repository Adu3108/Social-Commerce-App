import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes ,Route } from 'react-router-dom';
import './index.css';
import Login from './Components/Login/login';
import Register from './Components/Register/register';
import reportWebVitals from './Components/reportWebVitals';
import UserHome from './Components/Home/home';
import Seller from './Components/Seller/seller_info';
import NewItem from './Components/Seller/new_item';
import Buyer from './Components/Buyer/buyer_info';
import Information from './Components/Seller/information';
import Profile from './Components/Seller/profile';
import Contact from './Components/Contact/contact';
import Payment from './Components/Payment/payment';
import Product from './Components/Product/product';
import Review from './Components/Review/review';
import BuyerProfile from './Components/Buyer/profile';
import BuyerInfo from './Components/Buyer/information';
import PreviousPurchase from './Components/Buyer/previous_purchase';
import Category from './Components/Categories/category';
import Landing from './Components/Landing/landing';
import Calendar from './Components/Calendar/calendar';
import Recommendation from './Components/Recommendation/recommend';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Routes>
      <Route path="/user/login" element={<Login/>} />
      <Route path="/user/register" element={<Register/>} />
      <Route path="/user/home" element={<UserHome/>} />
      <Route path="/seller/home" element={<Seller/>} />
      <Route path="/seller/new" element={<NewItem/>} />
      <Route path="/buyer/home" element={<Buyer/>} />
      <Route path="/seller/information" element={<Information/>} />
      <Route path="/seller/profile" element={<Profile/>} />
      <Route path="/contact/:ID" element={<Contact/>} />
      <Route path="/payment" element={<Payment/>} />
      <Route path="/product/:product_id" element={<Product/>} />
      <Route path="/review/:transaction_id" element={<Review/>} />
      <Route path="/buyer/profile" element={<BuyerProfile/>} />
      <Route path="/buyer/information" element={<BuyerInfo/>} />
      <Route path="/buyer/previous" element={<PreviousPurchase/>} />
      <Route path="/category/:category_name" element={<Category/>} />
      <Route path="/" element={<Landing/>} />
      <Route path="/delivery/:transaction_id" element={<Calendar/>} />
      <Route path="/recommend" element={<Recommendation/>} />
    </Routes>
  </Router>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
