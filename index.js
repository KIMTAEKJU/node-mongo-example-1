// node 시작점
/**
 * mongodb+srv://xorwn:<password>@practice-mongo.tvzfnba.mongodb.net/?retryWrites=true&w=majority
 */
const express = require('express');
const app = express();
const port = 3000;

const mongoose = require('mongoose');
const { User } = require('./models/User');
const bodyParser = require('body-parser');
const config = require('./config/key');
const cookieParser = require('cookie-parser');

mongoose.set("strictQuery", false);

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// application/json
app.use(bodyParser.json());
app.use(cookieParser());

mongoose.connect(config.mongoURI,
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
    res.send('Hello World1');
});

app.post('/register', (req, res) => {
    /**
     * 회원 가입 할때 필요한 정보들을 client에서 가져오면
     * 그것들을 데이터 베이스에 넣어준다
     */

    const user = new User(req.body);
    user.save((err, userInfo) => {
        if (err) return res.json({ success: false, err })
        return res.status(200).json({
            success: true
        })

    });
});

app.post('/login', (req, res) => {

    /**
     * 요청된 이메일을 데이터베이스에서 있는지 찾는다
     */
    User.findOne({ email: req.body.email }, (err, user) => {
      
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: '제공된 이메일에 해당하는 유저가 없습니다.'
            })
        }

        user.comparePassword(req.body.password, (err, isMatch) => {

            if (!isMatch) return res.json({ loginSuccess: false, message: '비밀번호가 틀렸습니다.'});

            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);

                /**
                 * 토큰을 저장한다
                 * 1. 쿠키
                 * 2. 로컬스토리지
                 */
                res.cookie("x_auth", user.token)
                .status(200)
                .json({ loginSuccess: true, userId: user._id });
            })
        })
    })
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})