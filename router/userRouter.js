const express = require('express');
const user_route = express();



const auth = require('../middleware/Auth');
const userController = require('../conrollers/user-controller');
const cartController = require('../conrollers/cart-controller')
const addressController = require('../conrollers/address-controller')
const orderController = require('../conrollers/order-controller')

user_route.set('view engine', 'ejs');
user_route.set('views', './views/users');

//user controller

user_route.get('/register', auth.isLogout, userController.loadRegister);
user_route.get('/verification',auth.isLogout, userController.verifyEmail);
user_route.get('/', auth.isLogout, userController.loadHome);
user_route.get('/login', auth.isLogout, userController.loginload);
user_route.get('/home-page', auth.isLogin ,auth.blocked, userController.loadHome);
user_route.get("/logout" , userController.userLogout);
user_route.get('/shop-page',auth.blocked,auth.isLogin,userController.loadShop)
user_route.get('/showProduct',userController.loadSingleProduct)
user_route.get('/user-profile',auth.isLogin,auth.blocked,userController.loaduserprofile)
user_route.get('edit-profile/:id',auth.isLogin,userController.editProfile)

user_route.post('/update-user',auth.isLogin,userController.updateUser)
user_route.post('/login', userController.verifyLogin);
user_route.post('/register', userController.insertUser);
user_route.post('/verification', userController.verifyEmail);

//cart controller

user_route.get('/checkout-page',auth.isLogin,cartController.loadChekout)
user_route.get('/empty-checkout',auth.isLogin,cartController.loademptyCheckout)
user_route.get('/cart-page',auth.isLogin,auth.blocked,cartController.loadCart)
user_route.post('/delete-Cart-product',cartController.deleteCartProduct)
user_route.post('/addtocart',auth.isLogin,auth.blocked,cartController.addToCart)
user_route.post('/change-quantity',auth.isLogin,cartController.changeProductCount)

//address controller

user_route.get('/add-address',auth.isLogin,addressController.loadAddAddress)
user_route.get('/edit-address',auth.isLogin,addressController.loadEditAddress)
user_route.post('/add-address',auth.isLogin,addressController.insertAddress)
user_route.post('/update-address',auth.isLogin,addressController.updateAddress)
user_route.post('/delete-address',addressController.deleteAddress)

//order controller

user_route.get('/my-orders',auth.isLogin,orderController.loadMyOrder)
user_route.post('/checkout-page',orderController.placeOrder)

module.exports = user_route;



