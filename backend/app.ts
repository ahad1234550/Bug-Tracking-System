import createError, { HttpError } from 'http-errors';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import { db } from './helpers/index';
import routes from './routes/index';

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use('/', routes);

const startServer = async (): Promise<void> => {
    try {
        console.log('Connecting to Database...');
        await db.sequelize.authenticate();
        await db.sequelize.sync({ alter: true });
        console.log('Database connected');

    } catch (error) {
        console.log('Database Connection Error', error);
        process.exit(1);
    }
};

startServer();

app.use(function (req: Request, res: Response, next: NextFunction) {
    next(createError(404));
});

app.use(function (err: HttpError, req: Request, res: Response, next: NextFunction) {

    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

export default app;
