import { Request, Response, NextFunction } from 'express'

const getHome = (req: Request , res: Response, next: NextFunction) => {
    res.render('home/homePage')
}

export { getHome }