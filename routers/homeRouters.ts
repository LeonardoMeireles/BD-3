import { Router } from 'express'
import { getAdd, getUpdate, postDelete, getFormOptions, getHome, getTable, insertItem, editItem} from '../controllers/homeController'

const router = Router()

router.get('/', getHome)
router.get('/table', getTable)
router.get('/form', getFormOptions)
router.post('/add', insertItem)
router.post('/edit', editItem)

// Forms
router.get('/add/:tabela', getAdd)
router.get('/update/:tabela/:key_value/:key/:type', getUpdate)
router.get('/delete/:tabela/:key_value/:key/:type', postDelete)

export default router