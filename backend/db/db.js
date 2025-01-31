import mongoose from "mongoose";
import "dotenv/config.js"
// to connect mongodb
function connect(){
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log('Connected to mongoDb')
    })
    .catch(err => {
        console.log(err)
    })
}
export default connect