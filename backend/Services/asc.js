var express = require('express');
var app = express();
app.use(express.json())
app.use(express.static('public'));
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const {spawn} = require('child_process');

var cors = require("cors");
app.use(cors());

var session = require('express-session');
app.use(session({secret: 'mySecret', resave: false, saveUninitialized: false}));

const multer  = require('multer');
const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, 'images/')
   },
   filename: (req, file, cb) => {
      cb(null, file.originalname)
   },
})
const upload = multer({ storage: storage })

// Database Connection
const client = require("../config");

client.connect((err) => { 
   if (err) {
      console.log(err); 
   }
   else {
      console.log("Data logging initiated!");
   }
});

// Users
const  user  =  require("./routes/user");

app.use("/user",  user); 

const seller = require('./Seller/seller_info');
const increment = require('./controllers/increment');
const decrement = require('./controllers/decrement');
const new_item = require('./Seller/new_item');
const delete_item = require('./controllers/delete');
const buyer = require('./Buyer/buyer_info');
const update = require('./Seller/update');
const info = require('./Seller/information');
const profile = require('./Seller/profile');
const contact = require('./controllers/contact');
const transactions = require('./Transactions/transactions');
const cancel = require('./Transactions/cancel');
const accept = require('./Transactions/accept');
const product = require('./Products/product');
const review_info = require('./Review/info');
const new_review = require('./Review/new');
const buyer_profile = require('./Buyer/profile');
const buyer_info = require('./Buyer/information');
const buyer_update = require('./Buyer/update');
const previous = require('./Buyer/previous');
const category = require('./Categories/category');
const image = require('./Seller/image');
const recommend = require('./Recommendation/recommend');

// Endpoint for Login
app.get('/user/login/', function (req, res) {
   res.sendFile( __dirname + "/templates/" + "login_form.html" );
})

// Endpoint for Registration
app.get('/user/register/', function (req, res) {
   res.sendFile( __dirname + "/templates/" + "register_form.html" );
})

app.get('/seller/:seller_id', function(req, res) {
   seller.seller_info(req, res);
})

app.get('/buyer/:buyer_id', function(req, res) {
   buyer.buyer_info(req, res);
})

app.post('/item/increment', function(req, res) {
   increment.increment(req, res);
})

app.post('/item/decrement', function(req, res) {
   decrement.decrement(req, res);
})

app.post('/item/new', function(req, res) {
   new_item.new_item(req, res);
})

app.post('/item/delete', function(req, res) {
   delete_item.delete_item(req, res);
})

app.post('/seller/update', function(req, res) {
   update.update_info(req, res);
})

app.post('/seller/information', function(req, res) {
   info.user_info(req, res);
})

app.post('/seller/profile', function(req, res) {
   profile.profile_info(req, res);
})

app.post('/contact', function(req, res) {
   contact.contact_info(req, res);
})

app.post('/payment', function(req, res) {
   transactions.transactions(req, res);
})

app.post('/transaction/cancel', function(req, res) {
   cancel.cancel(req, res);
})

app.post('/transaction/accept', function(req, res) {
   accept.accept(req, res);
})

app.get('/product/:product_id', function(req, res) {
   product.product_info(req, res);
})

app.post('/review/info', function(req, res) {
   review_info.review_info(req, res);
})

app.post('/review/new', function(req, res) {
   new_review.new_review(req, res);
})

app.post('/buyer/information', function(req, res) {
   buyer_info.buyer_info(req, res);
})

app.post('/buyer/profile', function(req, res) {
   buyer_profile.buyer_profile(req, res);
})

app.post('/buyer/update', function(req, res) {
   buyer_update.update_info(req, res);
})

app.get('/buyer/previous/:buyer_id', function(req, res) {
   previous.previous(req, res);
})

app.post('/category/:category_name', function(req, res) {
   category.category(req, res);
})

app.post('/image/:item_id', upload.single('file'), function(req, res) {
   image.image(req, res);
})

app.post('/recommend', function(req, res) {
   const {data} = req.body;
   
   const pythonProcess = spawn('python3', ['./Services/my_model.py', data]);
   // let i = [];
   pythonProcess.stdout.on('data', function (data) {
      // res.status(200).json({"status" : data.toString()});
      var array = data.toString().split(", ");
      array[0] = array[0].substring(2,array[0].length-1);
      for(let index=1; index<array.length-1; index++)
      {
         array[index] = array[index].substring(1,array[index].length-1);
      }
      array[array.length-1] = array[array.length-1].substring(1,array[array.length-1].length-3);
      return  res.status(200).json({
                  "Status" : data.toString()
               }); 
   });
})

app.post('/product/recommend', function(req, res) {
   recommend.recommend(req,res);
})

var server = app.listen(8080, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})