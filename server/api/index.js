import { Router } from 'express'

import users from './users'
import payment from './payment'

const router = Router()

// Add USERS Routes
router.use(users)
router.use(payment)

export default router
