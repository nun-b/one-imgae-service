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
const passport_1 = __importDefault(require("passport"));
const passport_kakao_1 = require("passport-kakao");
const user_model_1 = __importDefault(require("../models/user.model"));
exports.default = () => {
    passport_1.default.use(new passport_kakao_1.Strategy({
        clientID: process.env.COOKIE_KID,
        callbackURL: '/auth/kakao/callback',
    }, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        console.log('kakao profile', profile);
        try {
            const exUser = yield user_model_1.default.findOne({
                // 기존 유저 찾기
                where: { snsId: profile.id, provider: 'kakao' },
            });
            if (exUser) {
                // 로그인
                done(null, exUser);
            }
            else {
                // 회원가입
                console.log('email', (_b = (_a = profile._json) === null || _a === void 0 ? void 0 : _a.kakao_account) === null || _b === void 0 ? void 0 : _b.email); // 이메일 확인(변경 가능)
                const newUser = yield user_model_1.default.create({
                    email: (_d = (_c = profile._json) === null || _c === void 0 ? void 0 : _c.kakao_account) === null || _d === void 0 ? void 0 : _d.email,
                    nick: profile.displayName,
                    snsId: profile.id,
                    provider: 'kakao',
                });
                done(null, newUser);
            }
        }
        catch (error) {
            console.log(error);
            done(error);
        }
    })));
};
