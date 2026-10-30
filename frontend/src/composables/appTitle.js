import {reactive} from 'vue'

let currentTitle = "OpenNumismat"
let oldTitles = []

export const appTitle = reactive({
  title: currentTitle,
  pushTitle(title, append = false) {
    oldTitles.push(currentTitle)
    this.title = append ? `${title} - ${this.title}` : title
    currentTitle = this.title
  },
  popTitle() {
    if (oldTitles) {
      this.title = oldTitles.pop()
      currentTitle = this.title
    }
  }
})
