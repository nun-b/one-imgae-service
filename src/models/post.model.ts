import User from './user.model';
import Hashtag from './hashtag.model';
import Sequelize, { CreationOptional, InferAttributes, InferCreationAttributes, Model } from 'sequelize';

// Sequelize에 Typescript 적용하기 ( Sequelize < 6.14.0 )
// Model에 들어가는 attributes를 직접 타입을 설정하여 제네릭 방식으로 지정해주어야 한다.
class Post extends Model<InferAttributes<Post>, InferCreationAttributes<Post>> {
    
    // 타입스크립트는 속성 정의만으로 타입추론을 하지 못한다.
    // declare를 사용해서 속성들의 타입추론을 돕는다.
    // declare는 변수 선언시 초기값을 넣지 않고, 단지 타입만 설정하기 위해 사용
    // declare는 자바스크립트로 바뀌지 않고, 타입스크립트의 타입을 위해서만 사용

    // declare 키워드를 사용하면, model의 attribute의 타입 정보를
    // public class field를 추가하지 않고 선언할 수 있다.
    // Typescript가 컴파일 한 파일에서 보면 declare로 선언된 field는
    // class 내에서 public field로 선언되어 있지 않다.
    // 즉, declare는 typescript에서 타입을 지정해주기 위해서 사용된다.

    // CreationOptional
    // 포스트를 만들 때는, contnet, img만 필요하다. 나머지 변수는 사용 안함
    // 사용안하는 변수는 ?을 붙이는 대신에 CreationOptional 타입을 사용한다.
    declare id: CreationOptional<number>;
    declare content: string;
    declare img: string;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    static initiate(sequelize: Sequelize.Sequelize) {
        Post.init({
            id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
            content: { type: Sequelize.STRING(140), allowNull: false },
            img: { type: Sequelize.STRING(200), allowNull: true },
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Post',
            tableName: 'posts',
            paranoid: false,
            charset: 'utf8',
            collate: "utf8mb4_general_ci"
        });
    }

    static associate() {
        // db매개변수 사라짐
        // ECMNAScript 모듈 시스템에서는 CommonJS에서 발생되는 순환참조가 발생하지 않기 때문
        Post.belongsTo(User);
        Post.belongsToMany(Hashtag, { through: 'PostHashtag'});
    }
}

export default Post;