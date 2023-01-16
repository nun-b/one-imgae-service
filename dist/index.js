"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
const index_model_1 = require("./models/index.model");
const index_passport_1 = __importDefault(require("./passport/index.passport"));
const options = {
    origin: ['http://localhost:3000', 'http://localhost:8090'],
    credentials: true,
};
const index_router_1 = __importDefault(require("./routers/index.router"));
(() => {
    const result = dotenv_1.default.config({ path: path_1.default.join(__dirname, "config", ".env") });
    if (result.parsed == undefined)
        throw new Error("Cannot loaded environment variables file.");
})();
(0, index_passport_1.default)();
const server = (0, express_1.default)();
server.use((0, morgan_1.default)('dev'));
server.use((0, cors_1.default)(options));
server.use('/', express_1.default.static(path_1.default.join(__dirname, 'public')));
server.use('/img', express_1.default.static(path_1.default.join(__dirname, 'upload')));
server.use(express_1.default.json());
server.use(express_1.default.urlencoded({ extended: false }));
server.use((0, cookie_parser_1.default)(process.env.COOKIE_SECRET));
server.use((0, express_session_1.default)({
    resave: false,
    saveUninitialized: false,
    // 실행 전이기 때문에 COOKIE_SECRET이 string | undefined 타입으로 설정되어
    // 에러가 발생, '!'를 붙여서 문자열이라는 것을 보증한다(undefined가 아니라는 걸 보증)
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    }
}));
server.use(passport_1.default.initialize());
server.use(passport_1.default.session());
index_model_1.sequelize.sync({ force: false })
    .then(() => { console.log('데이터베이스 연결'); })
    .catch((err) => { console.error(err); });
server.use('/', index_router_1.default);
server.use((req, res, next) => {
    console.log(`${req.method} ${req.url} 라우터가 없습니다.`);
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    // status 속성이 없다고 에러 발생
    // lib.es5.d.ts 파일에 interface Error {}에 status 속성이 없다.
    // 해결 types른 정의 : src/types/index.d.ts
    // interface Error()에 status 속성 추가
    error.status = 404;
    next(error);
});
const errorHandler = (err, req, res, next) => {
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
