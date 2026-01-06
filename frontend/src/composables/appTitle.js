import {reactive} from 'vue'

let currentTitle = "OpenNumismat"
let oldTitles = []

export const appTitle = reactive({
  title: currentTitle,
  pushTitle(title) {
    oldTitles.push(currentTitle)
    this.title = title
    currentTitle = this.title
  },
  popTitle() {
    if (oldTitles) {
      this.title = oldTitles.pop()
      currentTitle = this.title
    }
  }
})
