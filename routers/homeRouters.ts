import { Router } from 'express'
import { getForm, getHome, getTabela } from '../controllers/homeController'

const router = Router()

router.get('/', getHome)
router.get('/tabela', getTabela)
router.get('/form', getForm)

export default router