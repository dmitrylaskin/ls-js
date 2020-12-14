import InteractiveMap from './interactiveMap'

export default class GeoReview {
  constructor() {
    this.formTemplate = document.querySelector('#addFormTemplate').innerHTML
    this.map = new InteractiveMap('map', this.onClick.bind(this))
    this.map.init().then(this.onInit.bind(this))
  }

  async onInit() {
    let coords = await this.callApi('coords')

    for (let item of coords) {
      for (let i = 0; i < item.total; i++) {
        this.map.createPlacemark(item.coords)
      }
    }
    document.body.addEventListener('click', this.onDocumentClick.bind(this))
  }

  async callApi(method, body = {}) {
    let res = await fetch(`/geo-review/${method}`, {
      method: 'post',
      body: JSON.stringify(body)
    })
    return await res.json()
  }

  createForm(coords, reviews) {
    let root = document.createElement('div')
    root.innerHTML = this.formTemplate
    let reviewList = root.querySelector('.review-list')
    let reviewForm = root.querySelector(`[data-role=review-form]`)
    reviewForm.dataset.coords = JSON.stringify(coords)

    for (let item of reviews) {
      let div = document.createElement('div')
      div.classList.add('review-item')
      div.innerHTML = `
      <div>
        <b>${item.name}</b> [${item.place}]
      </div>
      <div>${item.text}</div>
      `
      reviewList.appendChild(div)
    }

    return root
  }

  async onClick(coords) {
    this.map.openBalloon(coords, 'downloading...')
    let list = await this.callApi('list', {coords})
    let form = this.createForm(coords, list)
    this.map.setBalloonContent(form.innerHTML)
  }


  async onDocumentClick(e) {
    if (e.target.dataset.role === 'reviews-add') {
      let reviewsForm = document.querySelector('[data-role=review-form]')
      let coords = JSON.parse(reviewsForm.dataset.coords)
      let data = {
        coords,
        review: {
          name:document.querySelector('[data-role=review-name]').value,
          place:document.querySelector('[data-role=review-place]').value,
          text:document.querySelector('[data-role=review-text]').value
        }
      }
      try {
        await this.callApi('add', data)
        this.map.createPlacemark(coords)
        this.map.closeBalloon()

      } catch (e) {
        let formError = document.querySelector('.form-error')
        formError.innerText = e.message

      }
    }
  }
}
