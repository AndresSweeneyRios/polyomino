import game from './views/game'

export default [
  {
    regex: /^$/,
    component: game,
  },
  {
    regex: /.*/,
    component: '404',
  },
]
