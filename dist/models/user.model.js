"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const post_model_1 = __importDefault(require("./post.model"));
const sequelize_1 = __importStar(require("sequelize"));
// Sequelize에 Typescript 적용하기 ( Sequelize < 6.14.0 )
// Model에 들어가는 attributes를 직접 타입을 설정하여 제네릭 방식으로 지정해주어야 한다.
class User extends sequelize_1.Model {
    static initiate(sequelize) {
        User.init({
            id: { type: sequelize_1.default.INTEGER, primaryKey: true, autoIncrement: true },
            email: { type: sequelize_1.default.STRING(40), allowNull: true, unique: true },
            nick: { type: sequelize_1.default.STRING(15) },
            password: { type: sequelize_1.default.STRING(100), allowNull: true },
            provider: { type: sequelize_1.default.ENUM('local', 'naver', 'kakao', 'google'), allowNull: false, defaultValue: 'local' },
            snsId: { type: sequelize_1.default.STRING(30) },
            createdAt: sequelize_1.default.DATE,
            updatedAt: sequelize_1.default.DATE,
            deletedAt: sequelize_1.default.DATE,
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'User',
            tableName: 'users',
            paranoid: true,
            charset: 'utf8',
            collate: "utf8_general_ci"
        });
    }
    static associate() {
        // db매개변수 사라짐
        // ECMNAScript 모듈 시스템에서는 CommonJS에서 발생되는 순환참조가 발생하지 않기 때문
        User.hasMany(post_model_1.default);
        User.belongsToMany(User, {
            foreignKey: 'followingId',
            as: 'Fellowers',
            through: 'Follow'
        });
        User.belongsToMany(User, {
            foreignKey: 'followerId',
            as: 'Followings',
            through: 'Follow'
        });
    }
}
;
exports.default = User;
