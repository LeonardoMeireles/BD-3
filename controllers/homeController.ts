import { Request, Response, NextFunction } from 'express'
import client from '../utils/database'

const getHome = (req: Request , res: Response, next: NextFunction) => {
    res.render('homePage')
}

const getTable = async (req: Request , res: Response, next: NextFunction) => {
    const entities = ['funcionario', 'passageiro', 'bagagem', 'bagagemExtraviada', 'voo', 'aviao', 'companhia']

    var dictList = []

    for (let entity of entities) {
        const dbres = await client.query(`SELECT * FROM ${entity}`)
        var keys = Object.keys(dbres.rows[0])
        console.log(`KEYS\n${keys}`)

        dictList.push({
            tableColumns: keys,
            tableContent: (() => {
                const list = []
    
                for (let row of dbres.rows) {
                    list.push(row)
                }
                return list
            })()
        })
        
    }
 
    res.render('table', {
    dictList,
    entities
    })
}

const getFormOptions = (req: Request , res: Response, next: NextFunction) => {
    res.render('formOptions')
}

const getAdd = (req: Request , res: Response, next: NextFunction) => {
    res.render('forms/formAdd', {
        action: 'add',
        tabela: req.params.tabela,
    })
}

const getUpdate = (req: Request , res: Response, next: NextFunction) => {
    res.render('forms/formUpdate', {
        tabela: req.params.tabela,
    })
}

const getDelete = (req: Request , res: Response, next: NextFunction) => {
    res.render('forms/formDelete', {
        tabela: req.params.tabela,
    })
}

const insertItem = (req: Request , res: Response, next: NextFunction) => {
    console.log(req.body)
    return
}

export { getHome, getTable, getFormOptions, getAdd, insertItem }