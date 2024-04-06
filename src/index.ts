import express from 'express';
import bodyParser from 'body-parser';
import userRoute from "../src/routers/userRoute"
import adminRoute from "../src/routers/adminRoute"
import './db/conn'



const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use('/user',userRoute)
app.use('/admin',adminRoute)
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
