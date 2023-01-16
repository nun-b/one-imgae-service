import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import passport from 'passport';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import express, { Application, Request, Response, NextFunction, ErrorRequestHandler } from 'express';

import { sequelize } from './models/index.model';
import passportConfig from './passport/index.passport';
const options: cors.CorsOptions = {
	origin: ['http://localhost:3000', 'http://localhost:8090'],
	credentials: true,
};

import indexRouter from './routers/index.router';

(() => {
    const result = dotenv.config({ path: path.join(__dirname, "config", ".env") });
    if (result.parsed == undefined) throw new Error("Cannot loaded environment variables file.");
})();
passportConfig();

const server: Application = express();
server.use(morgan('dev'));
server.use(cors(options));
server.use('/', express.static(path.join(__dirname, 'public')));
server.use('/img', express.static(path.join(__dirname, 'upload')));
server.use(express.json());
server.use(express.urlencoded({extended: false}));
server.use(cookieParser(process.env.COOKIE_SECRET));
server.use(session({
    resave: false,
    saveUninitialized: false,
    // 실행 전이기 때문에 COOKIE_SECRET이 string | undefined 타입으로 설정되어
    // 에러가 발생, '!'를 붙여서 문자열이라는 것을 보증한다(undefined가 아니라는 걸 보증)
    secret: process.env.COOKIE_SECRET!,
    cookie: {
        httpOnly: true,
        secure: false,
    }
}));
server.use(passport.initialize());
server.use(passport.session());

sequelize.sync({ force: false })
    .then(() => { console.log('데이터베이스 연결'); })
    .catch((err) => { console.error(err); });

server.use('/', indexRouter);

server.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`${req.method} ${req.url} 라우터가 없습니다.`);
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    // status 속성이 없다고 에러 발생
    // lib.es5.d.ts 파일에 interface Error {}에 status 속성이 없다.

    // 해결 types른 정의 : src/types/index.d.ts
    // interface Error()에 status 속성 추가
    error.status = 404;
    next(error);
});

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    // console.error(err);
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    // res.render('error');
};

server.use(errorHandler);

server.listen(process.env.PORT, () => {
    console.log(`SERVER :: http://localhost:${process.env.PORT}`);
});