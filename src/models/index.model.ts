import Sequelize from 'sequelize';
import dbConfig from '../config/dbConfig';

import User from './user.model';
import Post from './post.model';
import Hashtag from './hashtag.model';

// as :: 타입 추론을 못할 경우, 앞의 코드에 강제로 타입 지정
const env = process.env.NODE_ENV as 'production' | 'test' | 'development';
const config = dbConfig[env];

// const db = {};
// javascript에서 하듯이 db 객체를 생성해서 넣지 않음
// ECMNAScript 모듈 시스템에서는 CommonJS에서 발생되는 순환참조가 발생하지 않기 때문

export const sequelize = new Sequelize.Sequelize (
    config.database, config.username, config.password, config,
);

console.log('database', config.database);

// models 폴더의 모든 모델을 자동으로 읽어 initiate(), associate()를
// 하지 않고, 하나씩 import하는 방식을 사용하는 이유는
// 타입스크립트가 폴더 내 파일들의 타입을 추론할 수 없기 때문이다.

User.initiate(sequelize);
Post.initiate(sequelize);
Hashtag.initiate(sequelize);

User.associate();
Post.associate();
Hashtag.associate();

export { User, Post, Hashtag };