const mongoose = require("mongoose");

const MenuItem = require("./models/MenuItem");
const Order = require("./models/Order");
const Worker = require("./models/Worker");

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

// Load MongoDB URI from .env file
const mongoUri = process.env.USE_LOCAL_DB === 'true'
  ? process.env.LOCAL_MONGO_URI
  : process.env.CLOUD_MONGO_URI;

if (!mongoUri) {
    console.error('FATAL ERROR: No MongoDB URI provided in your .env file.');
    process.exit(1);
}

mongoose.connect(mongoUri)
.then(()=>console.log("Connected to MongoDB"))
.catch(err=>console.log(err));

const foodNames = [
"Margherita Pizza","Veg Burger","Cold Coffee","French Fries",
"Paneer Roll","Pasta Alfredo","Mojito","Veg Noodles",
"Cheese Sandwich","Chocolate Shake","Spring Roll",
"Masala Dosa","Paneer Tikka","Veg Momos","Farmhouse Pizza",
"Chowmein","Garlic Bread","Brownie","Cappuccino",
"Cheese Pizza","White Sauce Pasta","Club Sandwich",
"Veg Wrap","Iced Tea","Lemon Soda","Tandoori Paneer",
"Chicken Burger","Chicken Pizza","Fried Rice",
"Paneer Butter Masala","Butter Naan","Manchurian",
"Veg Thali","Chicken Biryani","Coffee","Tea",
"Oreo Shake","Kitkat Shake","Pav Bhaji","Chole Bhature"
];

const categories = [
"Pizza","Burger","Drink","Chinese",
"Snacks","Combo","Main Course"
];

function rand(min,max){
    return Math.floor(Math.random()*(max-min+1))+min;
}

function randomDate(){

    const start = new Date();
    start.setMonth(start.getMonth()-8);

    const end = new Date();

    const d = new Date(
        start.getTime() +
        Math.random()*(end.getTime()-start.getTime())
    );

    // realistic rush timing
    let hour;

    if(Math.random()<0.7){
        hour = Math.random()<0.5
        ? rand(12,15)   // lunch
        : rand(19,22);  // dinner
    }
    else{
        hour=rand(9,23);
    }

    d.setHours(hour);
    d.setMinutes(rand(0,59));

    return d;
}

async function seed(){

try{

await MenuItem.deleteMany({});
await Worker.deleteMany({});
await Order.deleteMany({});

console.log("Old data removed");


// -------- MENU --------

const menu=[];

foodNames.forEach((item,index)=>{

menu.push({

id:`M${String(index+1).padStart(3,"0")}`,
name:item,
category:categories[rand(0,categories.length-1)],
price:rand(80,550),
available:true

});

});

await MenuItem.insertMany(menu);

console.log("Menu inserted");


// -------- WORKERS (ONLY 5) --------

const workers=[

{
id:"W001",
name:"Rahul Sharma",
role:"Chef",
salary:35000,
paidSalary:35000,
contact:"9876543210"
},

{
id:"W002",
name:"Amit Singh",
role:"Cashier",
salary:25000,
paidSalary:25000,
contact:"9876543211"
},

{
id:"W003",
name:"Rohan Gupta",
role:"Waiter",
salary:18000,
paidSalary:18000,
contact:"9876543212"
},

{
id:"W004",
name:"Deepak Verma",
role:"Manager",
salary:45000,
paidSalary:45000,
contact:"9876543213"
},

{
id:"W005",
name:"Saurabh Kumar",
role:"Kitchen Staff",
salary:20000,
paidSalary:20000,
contact:"9876543214"
}

];

await Worker.insertMany(workers);

console.log("Workers inserted");


// -------- 10000 ORDERS --------

let orders=[];

for(let i=1;i<=10000;i++){

    let itemCount=rand(1,5);

    let selected=[...menu]
    .sort(()=>0.5-Math.random())
    .slice(0,itemCount);

    let items=[];
    let subtotal=0;

    selected.forEach(item=>{

        let quantity=rand(1,3);

        items.push({
            name:item.name,
            quantity,
            price:item.price
        });

        subtotal += quantity*item.price;

    });

    let discount=
    Math.random()<0.25
    ? rand(20,120)
    :0;

    let sgst=Math.round(subtotal*0.025);
    let cgst=Math.round(subtotal*0.025);

    let grandTotal=
    subtotal+
    sgst+
    cgst-
    discount;

    orders.push({

        date:randomDate(),

        grandTotal,

        paymentMode:
        Math.random()<0.55
        ? "UPI"
        : Math.random()<0.8
        ? "Cash"
        : "Card",

        tableNo:rand(1,15),

        items,

        subtotal,

        sgst,

        cgst,

        discount

    });

}

console.log("Generated orders");

orders.sort((a,b)=>b.date-a.date);

// Generate bill numbers
orders.forEach((order,index)=>{

    order.billNo=`BILL${110000-index}`;

});

// Insert in chunks
for(let i=0;i<orders.length;i+=1000){

    await Order.insertMany(
        orders.slice(i,i+1000)
    );

    console.log(
        `${Math.min(i+1000,orders.length)} inserted`
    );
}

console.log("Finished seeding");

await mongoose.disconnect();

process.exit();
}
catch(err){
console.log(err);
}

}

seed();