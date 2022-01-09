import { Request, Response, NextFunction } from 'express'
import client from '../utils/database'
var fs = require('fs')

const getHome = (req: Request , res: Response, next: NextFunction) => {
    res.render('homePage')
}

const getTable = async (req: Request , res: Response, next: NextFunction) => {
    const entities = ['funcionario', 'atendente', 'piloto', 'comissariodebordo', 'passageiro', 'bagagem', 'bagagemextraviada', 'voo', 'aviao', 'companhia']

    var dictList = []

    for (let entity of entities) {
        const dbres = await client.query(`SELECT * FROM ${entity}`)
        var keys = (() => {
            const fields = dbres.fields
            var list = []

            for(let field of fields) {
                list.push(field['name'])
            }

            return list
        })()
        console.log(`KEYS\n${keys}`)

        dictList.push({
            tableColumns: keys,
            tableContent: (() => {
                const list = []
    
                if(dbres.rows) {
                    for (let row of dbres.rows) {
                        list.push(row)
                    }
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
    const bagagens = (await client.query('SELECT b.id,b.cpf FROM bagagem b LEFT JOIN bagagemextraviada e ON e.bagid = b.id WHERE e.bagid IS NULL')).rows
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
        bagagens: bagagens,
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

const insertItem = async (req: Request , res: Response, next: NextFunction) => {
    const dict = req.body
    const entity = dict['entity']
    delete dict["entity"]
    const types = (() => {
        var dict_final : any = {}
        for (let key in dict) {
            if (key.startsWith("type")) {
                dict_final[key.substring(5)] = dict[key]
                delete dict[key]
            }
        }
        return dict_final
    })()
    console.log("TYPES ------------")
    console.log(types)

    var result

    var queryText = `INSERT INTO ${entity}(${buildInsert(dict, types, true)}) VALUES (${buildInsert(dict, types, false)});`
    console.log(`Query: ${queryText}`)
    result = await client.query(queryText, (err: any, resIntern: Response) => {
        if (err) {
            return res.status(400).render("error", {message: `Houve um erro com a sua requisição:\n\n${err}`})
        } else {
            console.log(`Query response: ${resIntern}`)
        }
    })
    

    if (entity === "funcionario") {
        const cargo = dict['cargo']

        if (cargo === "atendente") {
            const turno = dict['turno']
            queryText = `INSERT INTO atendente(turno,funccpf) VALUES ('${turno}','${dict['cpf']}');`
        } else {
            queryText = `INSERT INTO ${cargo}(funccpf) VALUES ('${dict['cpf']}');`
        }

        console.log(`Query: ${queryText}`)
        result = await client.query(queryText, (err: any, resIntern: Response) => {
            if (err) {
                return res.status(400).render("error", {message: `Houve um erro com a sua requisição:\n\n${err}`})
            } else {
                console.log(`Query response: ${resIntern}`)
            }
        })
    }

    res.redirect("/table")
}

function buildInsert(dict: any, types: any, isKey: boolean) {
    var list
    if (isKey) {
        list = Object.keys(dict)
        console.log("KEYS -------------")
        console.log(list)
    } else {
        list = dict
        console.log("DICT -------------")
        console.log(list)
    }

    var text = ""
    if (isKey) {
        for (let i of list) {
            var type = types[i]

            if (type === "int" || type === "string" || type === "timestamp") {
                text += `${i},`
            }
        }
    } else {
        for (let i in list) {
            var type = types[i]

            switch(type) {
                case "int":
                    text += `${list[i]},`
                    break;
                case "string":
                    text += `'${list[i]}',`
                    break;
                case "timestamp":
                    text += `'${list[i]}',`
                    break;
            }
        }  
    }

    return text.slice(0, -1)
}

export { getHome, getTable, getFormOptions, getAdd, insertItem }