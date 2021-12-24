import { Router } from 'express'
import { getAdd, getFormOptions, getHome, getTabela } from '../controllers/homeController'

const router = Router()

router.get('/', getHome)
router.get('/tabela', getTabela)
router.get('/form', getFormOptions)

// Forms
router.get('/adicionar/:tabela', getAdd)
router.get('/update/:tabela')
router.get('/delete/:tabela')


export default router