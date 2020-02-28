import Utils from './utils'

export default class Core {
  inject() {
    Utils.getMethods(this).forEach(method => {
      if (typeof this[method] === 'function' && method != 'inject')
        window[method] = this[method].bind(this)
    })
  }

  find(query) {
    return document.querySelector(query)
  }

  findAll(query) {
    return document.querySelectorAll(query)
  }

  show(query) {
    const el = _element(query)
    if (el) el.setAttribute('style', '')
  }

  hide(query) {
    const el = _element(query)
    if (el) el.setAttribute('style', 'display: none')
  }

  addClass(query, classList) {
    const el = _element(query)
    if (el) el.classList.add(classList)
  }

  removeClass(query, classList) {
    const el = _element(query)
    if (el) el.classList.remove(classList)
  }

  toggleClass(query, classList) {
    const el = _element(query)
    if (el) el.classList.toggle(classList)
  }

  hasClass(query, className) {
    const el = _element(query)
    if (el) el.classList.contains(className)
  }

  visit(url) {
    if (Turbolinks !== 'undefined')
      Turbolinks.visit(url)
    else
      window.location.href = url
  }

  reload() {
    window.location.reload()
  }

  serialize(query) {
    const form = _element(query)
    if (form) return new URLSearchParams(new FormData(form)).toString()
  }

  submit(query) {
    const form = _element(query)
    if (!form) return

    if (App.rails_ujs)
      App.rails_ujs.fire(form, 'submit')
    else
      form.submit()
  }

  currentUrl() {
    return window.location.href
  }

  getParam(param) {
    const urlParams = new URL(currentUrl()).searchParams

    if (urlParams.get(`${param}[]`))
      return urlParams.getAll(`${param}[]`)
    else
      return urlParams.get(param)
  }

  setParam(param, value, { url = currentUrl(), update = false } = {}) {
    const urlParams = new URL(url)
    urlParams.searchParams.set(param, value)

    if (update) setUrl(urlParams.href)
    return urlParams.href
  }

  on(query, type, callback) {
    const el = _element(query)
    if (!el) return

    el.addEventListener(type, callback)
  }

  currentElement() {
    return App.currentElement
  }

  currentEvent() {
    return App.currentEvent
  }

  insertHTML(query, html, position = 'inner') {
    const el = _element(query)
    if (!el) return

    switch (position) {
      case 'inner':
        el.innerHTML = html
        break
      case 'prepend':
        el.insertAdjacentHTML('beforebegin', html)
        break
      case 'begin':
        el.insertAdjacentHTML('afterbegin', html)
        break
      case 'end':
        el.insertAdjacentHTML('beforeend', html)
        break
      case 'append':
        el.insertAdjacentHTML('afterend', html)
        break
    }
  }

  attr(query, attribute, value) {
    const el = _element(query)
    if (!el) return

    if (typeof attribute === 'string')
      if (value === undefined)
        return el.getAttribute(attribute)
      else
        return el.setAttribute(attribute, value)
    else if (typeof attribute  === 'object')
      Object.entries(attribute).forEach(entry => {
        const [key, value] = entry
        el.setAttribute(key, value)
      })
  }

  data(query, attribute, value) {
    const el = _element(query)
    if (!el) return

    if (attribute === undefined && value === undefined) return el.dataset

    if (typeof attribute === 'string')
      if (value === undefined)
        return el.dataset[attribute]
      else
        return el.dataset[attribute] = value
    else if (typeof attribute  === 'object')
      Object.entries(attribute).forEach(entry => {
        const [key, value] = entry
        el.dataset[key] = value
      })
  }

  setUrl(state, method = 'push', data = {}) {
    switch (method) {
      case "push":
        history.pushState(data, undefined, state)
        break
      case "replace":
        history.replaceState(data, undefined, state)
        break
    }
  }

  _element(query) {
    if (typeof query === 'string')
      return find(query)
    else
      return query
  }
}
