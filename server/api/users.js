import { Router } from 'express'

const router = Router()

// Mock Users
const USERS = {
  williamchong007: {
    displayName: 'William Chong',
    wallet: '0x98e6269f33d3191b6e6DEdD01e93c51cc14257d3',
    avatar: 'https://firebasestorage.googleapis.com/v0/b/likecoin-foundation.appspot.com/o/18341999_10155300823687920_3191374639800195485_n.jpg?alt=media',
  },
  ckxpress: {
    displayName: 'Kin',
    wallet: '0x83D3F8effbf3924D34F51531ce57C97C9fA2E5CF',
    avatar: 'https://likecoin.foundation/static/img/kin.749505b.png',
  },
}

/* GET user by ID. */
router.get('/users/:id', function (req, res, next) {
  const user = USERS[req.params.id];
  if (user) {
    res.json(user)
  } else {
    res.sendStatus(404)
  }
})

export default router
