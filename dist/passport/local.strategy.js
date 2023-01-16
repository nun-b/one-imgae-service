"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const user_model_1 = __importDefault(require("../models/user.model"));
// 루틴이 성공하면, 유저 정보(exUser)를 done() 함수에 넣어서 리턴
exports.default = () => {
    passport_1.default.use(new passport_local_1.Strategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: false, // 밑에 함수에서 req가 필요한 경우, true
    }, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
        // 로그인 할 것인지, 안할 것이지 판단하는 부분
        try {
            const exUser = yield user_model_1.default.findOne({ where: { email } });
            if (exUser) {
                // 비밀번호 비교
                const result = yield bcrypt_1.default.compare(password, exUser.password);
                if (result) {
                    // 비밀번호가 일치하는 경우 (exUser : 사용자 정보)
                    done(null, exUser);
                }
                else {
                    done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
                }
            }
            else {
                done(null, false, { message: '가입되지 않은 회원입니다.' });
            }
        }
        catch (error) {
            console.error(error);
            done(error); // 서버(시스템) 실패
        }
    })));
};
