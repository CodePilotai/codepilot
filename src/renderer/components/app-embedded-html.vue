<script>
export default {
  props: {
    tag: {
      type: String,
      default: 'div'
    },
    html: {
      type: String,
      required: true
    },
    // url prop needed in cases where anchor tag links to relative path
    url: {
      type: String,
      default: ''
    }
  },
  mounted() {
    this.addClassesToEmbeddedHtml()
  },
  updated() {
    this.addClassesToEmbeddedHtml()
  },
  methods: {
    async addClassesToEmbeddedHtml() {
      await this.$nextTick()
      this.addClassesToSelector(
        'pre',
        'py-3 px-4 mb-2 overflow-auto bg-grey-darker text-primary-light'
      )
      this.addClassesToSelector('code', 'text-primary-light')
    },
    addClassesToSelector(selector, classes) {
      const els = this.$el.querySelectorAll(selector)
      const classNames =
        typeof classes === 'string' ? classes.split(/\s+/) : classes
      for (const el of els) {
        for (const className of classNames) {
          el.classList.add(className)
        }
      }
    }
  },
  render(h) {
    const self = this
    return h(self.tag, {
      domProps: {
        innerHTML: self.html
      },
      staticClass: self.$style.embeddedHtml + ' select-text cursor-text',
      on: {
        click(event) {
          const anchorElement = getPotentialAnchor()
          if (anchorElement) {
            event.preventDefault()
            const url = anchorElement.href.includes('localhost')
              ? self.url
              : anchorElement.href
            self.$electron.shell.openExternal(url)
          }
          function getPotentialAnchor() {
            if (event.target.tagName === 'A') {
              return event.target
            }
            const anchorEls = Array.from(self.$el.querySelectorAll('a'))
            for (const anchorEl of anchorEls) {
              if (anchorEl.contains(event.target)) {
                return anchorEl
              }
            }
          }
        }
      }
    })
  }
}
</script>

<style lang="scss" module>
.embedded-html {
  overflow: overlay;

  ul {
    padding-left: 20px;
    list-style: circle;
  }
}
</style>
