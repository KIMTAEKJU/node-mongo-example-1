// node 시작점
/**
 * mongodb+srv://xorwn:<password>@practice-mongo.tvzfnba.mongodb.net/?retryWrites=true&w=majority
 */
const express = require('express');
const app = express();
const port = 3000;

const mongoose = require('mongoose');
// mongoose.set("strictQuery", false);

mongoose.connect('mongodb+srv://xorwn:xorwn@practice-mongo.tvzfnba.mongodb.net/?retryWrites=true&w=majority',
{
    /**
     * 안쓰면 에러남
     */
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
    // useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
.catch((e) => console.error('error: ', e));

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})