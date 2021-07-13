let express = require("express")
let bodyParser = require("body-Parser")
var ObjectId = require('mongodb').ObjectID;
const app = express()
const ejs = require('ejs');
const  MongoClient  = require("mongodb").MongoClient;
const url = "mongodb+srv://vehicledetails:vehicledetails@cluster1.oo9ps.mongodb.net/vehicledetails?retryWrites=true&w=majority";
const client = new MongoClient(url, { useNewUrlParser: true });
let database

app.set('view engine','ejs')
app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended:true
}))
app.listen(3002,()=>{
    MongoClient.connect(url, {useNewUrlParser: true} ,(error,result)=>{
        if(error) throw error
        database = result.db('vehicledetails')
        console.log('Connection successful')
    })
})
app.get("/",(req,res)=>{
    database.collection('vehicledetails').find({}).toArray((err,result)=>{
        if(err) throw error
        res.render('ValetParkingDashboard',{
            vehiclelist: result
        })
})
})

app.get("/checkin",(req,res)=>{
    res.render('checkin');
})

app.get("/fetch",(req,res)=>{
    database.collection('vehicledetails').find({}).toArray((err,result)=>{
        if(err) throw error
        res.render('ValetParkingDashboard',{
            vehiclelist: result
        })

    })
})

app.get("/checkout",(req,res)=>{
    database.collection('vehicledetails').find({_id:ObjectId(req.query.id)}).toArray((err,result)=>{
        if(err) throw error
        let tod = new Date();
        let dat = tod.getFullYear()+'-'+(tod.getMonth()+1)+'-'+tod.getDate();
        let tim = tod.getHours() + ":" + tod.getMinutes();
        let dateTim = dat+' '+tim;
        hr1 = parseInt(tim.substring(0,2))
        hr2 = parseInt(result[0].CheckinTime.substring(10,12))
        min1 = parseInt(tim.substring(3,5))
        min2 = parseInt(result[0].CheckinTime.substring(13,15))
        timediff = (hr1-hr2)*60 + Math.abs((60-min1)-(60-min2))
        amount = 2*timediff
        res.render('checkout',{
            vehicle: result[0],
            checkouttime: dateTim,
            timedifference: timediff,
            cost:amount
        })
    })
})

app.get("/success",(req,res)=>{
    database.collection('vehicledetails').remove({_id:ObjectId(req.query.id)})
    res.render('successpage')
})
 
app.post("/details",(req,res)=>{
    let vehiclenumber = req.body.vehiclenumber;
    let vehicletype = req.body.vehicletype;
    let vehiclemodel = req.body. vehiclemodel;
    let number = req.body.phonenumber;
    let name = req.body.customername;
    let today = new Date();
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let time = today.getHours() + ":" + today.getMinutes();
    let dateTime = date+' '+time;
    let data = {
        "VehicleNumber": vehiclenumber,
        "VehicleType": vehicletype,
        "VehicleModel": vehiclemodel,
        "CustomerNumber": number,
        "CustomerName": name,  
        "CheckinTime" : dateTime
        }
    database.collection('vehicledetails').insertOne(data,(err,collection)=>{
    if(err){
        throw err;
    }
    console.log("Record Inserted Successfully");
});
    
    return res.redirect('/')
})

