import { Request, Response, NextFunction } from 'express'
import client from '../utils/database'
var fs = require('fs')

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

const getAdd = async (req: Request , res: Response, next: NextFunction) => {
    const airports = fs.readFileSync('resources/lists/airports').toString().split("\n");
    const countries = fs.readFileSync('resources/lists/countries').toString().split("\n");

    const avioes = (await client.query('SELECT id, modelo FROM aviao')).rows
    const companhias = (await client.query('SELECT cnpj, nome FROM companhia')).rows
    const passageiros = (await client.query('SELECT cpf, nome FROM passageiro')).rows
    const pilotos = (await client.query('SELECT funccpf FROM piloto')).rows
    const portoes = (await client.query('SELECT id FROM portao')).rows
    const portoes_livres = (await client.query('SELECT id FROM portao WHERE ocupado = false')).rows
    const guiches = (await client.query('SELECT id FROM guiche')).rows
    const voos = (await client.query('SELECT id, localpartida, localchegada FROM voo')).rows

    res.render('forms/formAdd', {
        action: 'add',
        tabela: req.params.tabela,
        airports: airports,
        countries: countries,
        avioes: avioes,
        companhias: companhias,
        passageiros: passageiros,
        pilotos: pilotos,
        portoes: portoes,
        portoes_livres: portoes_livres,
        guiches: guiches,
        voos: voos
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