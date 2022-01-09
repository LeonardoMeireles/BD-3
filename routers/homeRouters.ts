import { Router } from 'express'
import { getAdd, getFormOptions, getHome, getTable, insertItem} from '../controllers/homeController'

const router = Router()

router.get('/', getHome)
router.get('/table', getTable)
router.get('/form', getFormOptions)
router.post('/insert', insertItem)

// Forms
router.get('/adicionar/:tabela', getAdd)
router.get('/update/:tabela/:id')
router.get('/delete/:tabela')


export default router