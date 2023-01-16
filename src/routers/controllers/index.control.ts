import { Request, Response, NextFunction } from 'express';

export const MainPage = async(req: Request, res: Response, next: NextFunction) => {
    try {
        res.send('HOHO Main page');
    } catch(error) {
        console.log(error);
        next(error);
    }
}