// d.ts
// 타입스크립트이지만, 런타임 코드는 없고
// 타입정의, 선언들만 있다. 자바스크립트로 변환되지 않는다.

import IUser from '../models/user.model';
// d.ts 선언하고 외부 적용을 위해서, 모듈로 만들어 주어야 한다.
// 타입스크립트는 파일 안에 import 또는 export가 있어야 모듈이라고 인식하기 때문
// 모듈이 아닌 것은 자동으로 불러오지 않기 때문이다.

declare global {
    // declare global
    // interface 에 속성을 추가하려면, 전역으로 설정해야 된다.

    // index.passport.ts -->  user.id :: 속성 추가
    namespace Express {
        // interface User {
        //     id: number;
        //     nick: string;
        //     password?: string;
        // }

        // 속성을 적어주는 대신
        // model에 정의된 속성들을 불러야 사용한다.
        interface User extends IUser {}
    }
    // Error 객체에 status 속성 추가.
    // interface는 같은 이름으로 여러번 설정되면, 합쳐진다.
    interface Error {
        status: number;
    }
}