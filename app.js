// Подключаю все бибилеотеки
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
// Подключаю все бибилеотеки


// Роуты
const authRoutes = require('./routes/auth');
const clientRoutes = require('./routes/client');
const telegramRoutes = require('./routes/telegram');

const orderRoutes = require('./routes/order');

const statisticRoutes = require('./routes/statistic');

const categoryRoutes = require('./routes/categories');
const positionRoutes = require('./routes/positions');
const cityRoutes = require('./routes/cities');
const placeRoutes = require('./routes/places');
// Роуты

const keys = require('./config/keys');
const app = express();


// Подключение к локальной БД
mongoose.connect(
    keys.mongoURI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true, 
        useCreateIndex: true,
        useFindAndModify: false
     }
    )
.then(() => console.log('База данных подключенна!'))
.catch(err => console.log(err));


// Использовать паспорт
app.use(passport.initialize());
require('./middleware/passport')(passport);

// Показывает API запросы
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'))
app.use('/docs', express.static('docs'))
app.use(cors());

// Расшифровка приходящих данных
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//Ссылки отслеживаемых роутов

     //Роут Авторизации Персонала
     app.use('/api/user', authRoutes);

     //Роут Клиентов
     app.use('/api/client', clientRoutes);

     //Роут Телеграмма
     app.use('/api/telegram', telegramRoutes);

     //Роут Заказа
     app.use('/api/order', orderRoutes);
     //Роут Статистики
     app.use('/api/statistic', statisticRoutes);
     

     //Роут Категорий
     app.use('/api/category', categoryRoutes);
     //Роут Позиций
     app.use('/api/position', positionRoutes);
     //Роут Поселений
     app.use('/api/city', cityRoutes);
     //Роут Точек
     app.use('/api/place', placeRoutes);

app.get('/.well-known/pki-validation/0C6BB3D49CC1E8DBB2D2EB54B740BD56.txt', (req, res) => {
    res.sendFile(
        path.resolve(
            __dirname, 'docs', '0C6BB3D49CC1E8DBB2D2EB54B740BD56.txt'
        )
    )
})


if (process.env.NODE_ENV === 'production') {

    app.use(express.static('client/dist/client'));
    app.use(express.static('admin/dist/admin'));
    
    app.get('/enter', (req, res) => {
        res.sendFile(
            path.resolve(
                __dirname, 'admin', 'dist', 'admin', 'index.html'
            )
        )
    })

    app.get('/orders', (req, res) => {
        res.sendFile(
            path.resolve(
                __dirname, 'admin', 'dist', 'admin', 'index.html'
            )
        )
    })
    

    app.get('/*', (req, res) => {
        res.sendFile(
            path.resolve(
                __dirname, 'client', 'dist', 'client', 'index.html'
            )
        )
    })

}

    
    /* 
    app.use(express.static('client/dist/client'));
    app.use(express.static('admin/dist/admin'));
    

    app.get('/enter', (req, res) => {
        res.sendFile(
            path.resolve(
                __dirname, 'admin', 'dist', 'admin', 'index.html'
            )
        )
    })


    app.get('/*', (req, res) => {
        res.sendFile(
            path.resolve(
                __dirname, 'client', 'dist', 'client', 'index.html'
            )
        )
    })   
    */
    
    
module.exports = app;

