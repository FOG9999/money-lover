//db.wallettypes.find({isDelete: false},{name: 1})
//db.users.find()
//db.transactions.aggregate([{
//    $lookup: {
//        from: "categories",
//        localField: "category",
//        foreignField: "_id",
//        as: "categories"
//    }
//}])
//db.wallets.find({
//    _id: ObjectId("640d3ca622957f316c3b3d9c")})
//
//    db.wallettypes.find({
//        _id: ObjectId("63d27b7039b7513170c26324")})


db.wallettypes.insertOne({
    name: "Viettel Money",
    
})