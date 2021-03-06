/*const beverages = [
	{"type": "water", "name": "FIJI Natural Artesian Water Bottles", "brand": "Fiji", "size": 500, "amount": 20, "price": 0.8}
   	{"type": "coconut water", "name": "Vita Coco Pressed Coconut Water 330ml", "brand": "Vitacoco", "size": 330, "amount": 20, "price": 1.25}
    {"type": "fizzy drinks", "name": "Coca-Cola Original Taste Cans", "brand": "Cocacola", "size": 330, "amount": 20, "price": 0.4}
    {"type": "fizzy drinks", "name": "Sprite No Sugar Cans", "brand": "Cocacola", "size": 330, "amount": 20, "price": 0.4}
    {"type": "fizzy drinks", "name": "Fanta Orange Zero Cans", "brand": "Cocacola", "size": 330, "amount": 20, "price": 0.4}
    {"type": "fizzy drinks", "name": "7UP Free Sparkling Lemon and Lime Drink Cans", "brand": "Pepsi", "size": 330, "amount": 20, "price": 0.25}
    {"type": "fizzy drinks", "name": "Tango Apple", "brand": "Britvic", "size": 330, "amount": 20, "price": 0.54}
    {"type": "fruit juice", "name": "Rio Tropical Fruit Juice Drink", "brand": "Rio", "size": 330, "amount": 20, "price": 0.74}
    {"type": "fruit juice", "name": "Tokushima Yuzusu Yuzu Juice", "brand": "Tokushima", "size": 150, "amount": 10, "price": 12.7}
    {"type": "energy drinks", "name": "Red Bull Energy Drink Sugar Free", "brand": "Redbull", "size": 250, "amount": 20, "price": 0.83}
    {"type": "coffee", "name": "Nescafe Azera Nitro", "brand": "Nescafe", "size": 192, "amount": 20, "price": 2.4}
    {"type": "coffee", "name": "TrueStart Cold Brew Coffee", "brand": "Truestart", "size": 250, "amount": 20, "price": 2.3}
];

module.exports = beverages;
 */
let mongoose = require('mongoose');

let BeverageSchema = new mongoose.Schema({
    type: String,
    name: String,
    brand: String,
    size: Number,
    amount: Number,
    price: Number
},
    {collection:'beverages'});

module.exports = mongoose.model('Beverage', BeverageSchema);
