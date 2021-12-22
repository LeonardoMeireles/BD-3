import { Request, Response, NextFunction } from 'express'

const getHome = (req: Request , res: Response, next: NextFunction) => {
    res.render('homePage')
}

const getTabela = (req: Request , res: Response, next: NextFunction) => {
    res.render('tabela', {
        tableColumns: ['Test1', 'Test2', 'Test3', 'Test4', 'Test5'],
        tableContent: [{'test1': 'content1', 'test2': 'content2', 'test3': 'content3', 'test4': 'content4', 'test5': 'content5',}]
    })
}

const getForm = (req: Request , res: Response, next: NextFunction) => {
    res.render('form')
}

export { getHome, getTabela, getForm }