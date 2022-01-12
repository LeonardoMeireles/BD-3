import { log, table } from 'console'
import { Request, Response, NextFunction } from 'express'
import client from '../utils/database'
var fs = require('fs')

const getHome = (req: Request , res: Response, next: NextFunction) => {
    res.render('homePage')
}

const getTable = async (req: Request , res: Response, next: NextFunction) => {
    const entities = ['funcionario', 'atendente', 'piloto', 'comissariodebordo', 'passageiro', 'bagagem', 'bagagemextraviada', 'voo', 'aviao', 'companhia']

    let dictList = []

    for (let entity of entities) {
        const dbres = await client.query(`SELECT * FROM ${entity}`)
        let keys = (() => {
            const fields = dbres.fields
            let list = []

            for(let field of fields) {
                list.push(field['name'])
            }

            return list
        })()

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
    const tabela = req.params.tabela;
    const key = null;
    const key_value = null;
    const type = null;

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

    res.render('forms/form', {
        action: 'add',
        key: key,
        key_value,
        tabela: tabela,
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

const getUpdate = async (req: Request , res: Response, next: NextFunction) => {
    const tabela = req.params.tabela;
    const key = req.params.key;
    const key_value = req.params.key_value
    const type = req.params.type;

    console.log(`UPDATE ${tabela} ----------`)

    let queryText
    if (type == 'string') {
        queryText = `SELECT * FROM ${tabela} WHERE ${key}='${key_value}'`
    } else {
        queryText = `SELECT * FROM ${tabela} WHERE ${key}=${key_value}`
    }
    
    console.log(`Query: ${queryText}`);  
    const row = ((await client.query(queryText)).rows)[0]
    console.log(row)


    const airports = fs.readFileSync('resources/lists/airports').toString().split("\n");
    const countries = fs.readFileSync('resources/lists/countries').toString().split("\n");

    const avioes = (await client.query(`SELECT id, modelo FROM aviao`)).rows
    const bagagens = (await client.query('SELECT b.id,b.cpf FROM bagagem b LEFT JOIN bagagemextraviada e ON e.bagid = b.id WHERE e.bagid IS NULL')).rows
    const companhias = (await client.query('SELECT cnpj, nome FROM companhia')).rows
    const passageiros = (await client.query('SELECT cpf, nome FROM passageiro')).rows
    const pilotos = (await client.query('SELECT funccpf FROM piloto')).rows
    const portoes = (await client.query('SELECT id FROM portao')).rows
    const portoes_livres = (await client.query('SELECT id FROM portao WHERE ocupado = false')).rows
    const guiches = (await client.query('SELECT id FROM guiche')).rows
    const voos = (await client.query('SELECT id, localpartida, localchegada FROM voo')).rows
    

    res.render('forms/form', {
        action: 'edit',
        key: key,
        key_value,
        row: row,
        tabela: tabela,
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

const postDelete = async (req: Request , res: Response, next: NextFunction) => {
    const tabela = req.params.tabela;
    const key = req.params.key;
    const key_value = decodeURIComponent(req.params.key_value)
    const type = req.params.type;
    
    console.log(`DELETE ${tabela} ----------`)

    let queryText
    if (type == 'string') {     
        queryText = `DELETE FROM ${tabela} WHERE ${key}='${key_value}'`
    } else {
        queryText = `DELETE FROM ${tabela} WHERE ${key}=${key_value}`
    }
    
    console.log(`Query: ${queryText}`);  
    let result = await client.query(queryText, (err: any, resIntern: Response) => {
        if (err) {
            res.status(400).render("error", {message: `Houve um erro com a sua requisição:\n\n${err}`});
        } else {
            console.log(`Query response: ${resIntern}`)
            res.status(200).redirect("/table");
        }
    })

    return
}

const insertItem = async (req: Request , res: Response, next: NextFunction) => {
    const dict = req.body
    const entity = dict['entity']
    delete dict["entity"]
    const types = (() => {
        let dict_final : any = {}
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

    let queryText = `INSERT INTO ${entity}(${buildInsert(dict, types, true)}) VALUES (${buildInsert(dict, types, false)});`
    console.log(`Query: ${queryText}`)
    let firstReqError = false;
    let result = await client.query(queryText, (err: any, resIntern: Response) => {
        if (err) {
            res.status(400).render("error", {message: `Houve um erro com a sua requisição:\n\n${err}`})
            firstReqError = true
        } else {
            console.log(`Query response: ${resIntern}`)
            res.status(200).redirect("/table")
        }
    })

    if (!firstReqError && entity === "funcionario") {
        const cargo = dict['cargo']

        if (cargo === "atendente") {
            const turno = dict['turno']
            queryText = `INSERT INTO atendente(turno,funccpf) VALUES ('${turno}','${dict['cpf']}');`
        } else {
            queryText = `INSERT INTO ${cargo}(funccpf) VALUES ('${dict['cpf']}');`
        }

        console.log(`Query: ${queryText}`)
        let result = await client.query(queryText, (err: any, resIntern: Response) => {
            if (err) {
                res.status(400).render("error", {message: `Houve um erro com a sua requisição:\n\n${err}`})
            } else {
                console.log(`Query response: ${resIntern}`)
                res.status(200).redirect("/table")
            }
        })
    }

    return;
}

const editItem = async (req: Request , res: Response, next: NextFunction) => {
    const dict = req.body
    const key = dict['key']
    delete dict['key']
    const key_value = decodeURIComponent(dict['key_value'])
    delete dict['key_value']
    const entity = dict['entity']
    delete dict["entity"]

    const types = (() => {
        let dict_final : any = {}
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

    let type = types[key]
    let queryText = ''
    if (type == 'string') {
        queryText = `UPDATE ${entity} SET ${buildEdit(dict, types)} WHERE ${key}='${key_value}'`
    } else {
        queryText = `UPDATE ${entity} SET ${buildEdit(dict, types)} WHERE ${key}=${key_value}`
    }
    
    console.log(`Query: ${queryText}`)
    
    let result = await client.query(queryText, (err: any, resIntern: Response) => {
        if (err) {
            res.status(400).render("error", {message: `Houve um erro com a sua requisição:\n\n${err}`})
        } else {
            console.log(`Query response: ${resIntern}`)
            res.status(200).redirect("/table")
        }
    })

    return
}


function buildInsert(dict: any, types: any, isKey: boolean) {
    let list
    if (isKey) {
        list = Object.keys(dict)
        console.log("KEYS -------------")
        console.log(list)
    } else {
        list = dict
        console.log("DICT -------------")
        console.log(list)
    }

    let text = ""
    if (isKey) {
        for (let i of list) {
            let type = types[i]

            if (type === "int" || type === "string" || type === "timestamp") {
                text += `${i},`
            }
        }
    } else {
        for (let i in list) {
            let type = types[i]

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



function buildEdit(dict: any, types: any) {
    let text = ""

    for(let item in dict){
        let type = types[item]

        switch(type) {
            case "int":
                text += `${item} = ${dict[item]},`
                break;
            case "string":
                text += `${item} = '${dict[item]}',`
                break;
            case "timestamp":
                text += `${item} = '${dict[item]}',`
                break;
        }
    }

    return text.slice(0, -1)
}

export { getHome, getTable, getFormOptions, getAdd, getUpdate, insertItem, editItem, postDelete }