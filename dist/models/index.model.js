"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hashtag = exports.Post = exports.User = exports.sequelize = void 0;
const sequelize_1 = __importDefault(require("sequelize"));
const dbConfig_1 = __importDefault(require("../config/dbConfig"));
const user_model_1 = __importDefault(require("./user.model"));
exports.User = user_model_1.default;
const post_model_1 = __importDefault(require("./post.model"));
exports.Post = post_model_1.default;
const hashtag_model_1 = __importDefault(require("./hashtag.model"));
exports.Hashtag = hashtag_model_1.default;
// as :: 타입 추론을 못할 경우, 앞의 코드에 강제로 타입 지정
const env = process.env.NODE_ENV;
const config = dbConfig_1.default[env];
// const db = {};
// javascript에서 하듯이 db 객체를 생성해서 넣지 않음
// ECMNAScript 모듈 시스템에서는 CommonJS에서 발생되는 순환참조가 발생하지 않기 때문
exports.sequelize = new sequelize_1.default.Sequelize(config.database, config.username, config.password, config);
console.log('database', config.database);
// models 폴더의 모든 모델을 자동으로 읽어 initiate(), associate()를
// 하지 않고, 하나씩 import하는 방식을 사용하는 이유는
// 타입스크립트가 폴더 내 파일들의 타입을 추론할 수 없기 때문이다.
user_model_1.default.initiate(exports.sequelize);
post_model_1.default.initiate(exports.sequelize);
hashtag_model_1.default.initiate(exports.sequelize);
user_model_1.default.associate();
post_model_1.default.associate();
hashtag_model_1.default.associate();
