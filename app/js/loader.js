import NewwwnessApi from './newwwness-api'
import Articles from './articles'
import Event from './event'

class Loader {
  constructor() {
    Articles.destroy()
    this.el = document.getElementById('loader')
    this.images = []
    this.hasBeenFilled = false
    this.load('new')
    this.el.addEventListener('click', this.refreshHandler.bind(this))
  }

  start() {
    this.el.classList.add('is-loading')
  }

  stop() {
    Articles.isLoaded()
    this.hasBeenFilled = true

    Event.animationIteration(this.el, () => {
      this.el.classList.remove('is-loading')
    }, 1000)
  }

  refreshHandler() {
    this.load('random')
  }

  errorHandler(error) {
    console.log(error)
  }

  loadData(data) {
    return NewwwnessApi.load(data).then(data => {
      let length = data.articles.length
      for (let i = 0; i < 4 && i < length; i++) {
        let rand = Math.floor(Math.random() * data.articles.length)
        this.loadPost(data.articles[rand], i)
        data.articles.splice(rand, 1)
      }
      return data
    }, this.errorHandler)
  }

  loadPost(post, i) {
    this.images.push(new Promise((resolve, reject) => {
      Articles.renderPost(post, this.hasBeenFilled ? Articles.get(i) : null)
        .then(src => {
          let image = new Image()
          image.addEventListener('load', () => resolve())
          image.src = src
        }, this.errorHandler)
    }))

    return post
  }

  waitForImages() {
    return Promise.all(this.images).then(() => this.stop())
  }

  load(collection) {
    Articles.isNotLoaded()
    this.start()
    this.loadData(collection).then(() => this.waitForImages())
  }
}

export default Loader
