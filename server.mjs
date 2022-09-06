import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// declaring schema
const productSchema = new mongoose.Schema({
    productName: String,
    productPrice: Number,
    currencyCode: String,
    numberOfSale: Number,
    rating: Number,
    isFreeShipping: Boolean,
    shopName: String,
    createdOn: {type:Date, default: Date.now},
});

// creating schema
const productModel = mongoose.model('Product', productSchema);






let app = express();
app.use(express.json());
app.use(cors()); // security feature used for google, cross origin request

// getting all products
app.get("/products", async (req, res) =>{
    
    let result = await productModel
                .find({})
                .exec()
                .catch(e => {  // if any error occurred
                    console.log("Error in db: ", e);
                    res.status(500).send({message: "Error in getting all products."});
                    return;
                })
    res.send(
        {
            message:" All Products Loaded.",
            data: result}
        );
});


// creating a new product
app.post("/product",async (req, res)=>{

    let body = req.body;
    console.log(body.p_name);
    console.log(body.p_currency_code);
    console.log(body.p_no_of_sale);
    console.log(body.p_rating);
    console.log(body.p_free_shipping);
    console.log(body.p_shopName);
    if(
        !body.p_name
        || !body.p_price
        || !body.p_currency_code
        || !body.p_no_of_sale
        || !body.p_rating
        || !body.p_free_shipping
        || !body.p_shopName
        ){ // if anyone of these is missing, then do this
            res.status(400).send(
                {
                    message:'All fields are required!',
                }
                
            )
            return;
        }

        let result = await  productModel.create({
            productName: body.p_name,
            productPrice: body.p_price,
            currencyCode: body.p_currency_code,
            numberOfSale: body.p_no_of_sale,
            rating: body.p_rating,
            isFreeShipping:body.p_free_shipping,
            shopName: body.p_shopName
        }).catch(e => {
            console.log("error in db.",e);
            res.status(500).send({message:"Db error in saving product details."});
        })

        console.log("Result", result);
        res.status(200).send({message: "Product has been added successfully."});
});



let PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`app is running on port ${PORT}`);
});


// ======================Db Connection Start=======================================
// connect to database
//let db_name = 'socialMediaBase'
let dbURI = "mongodb+srv://mhamza:hamza.123@cluster0.yy24d35.mongodb.net/ecommDatabase?retryWrites=true&w=majority";
mongoose.connect(dbURI);


////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on('connected', function() {//connected
    console.log("Mongoose is connected");
    // process.exit(1);
});

mongoose.connection.on('disconnected', function() {//disconnected
    console.log("Mongoose is disconnected");
    process.exit(1); // Close the app if database is disconnected in any case.
});

mongoose.connection.on('error', function(err) {//any error
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});

process.on('SIGINT', function() {/////this function will run jst before app is closing
    console.log("app is terminating");
    mongoose.connection.close(function() {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});
// ======================Db Connection End=======================================
