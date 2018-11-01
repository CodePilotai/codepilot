import AppHighlight from './app-highlight'

describe('@components/app-highlight', () => {
  it('injects a highlighting span over matched text', () => {
    const element = shallowMount(AppHighlight, {
      context: {
        props: {
          body: 'this.$store.state.test',
          matcher: '$store.state',
          className: 'testClass'
        }
      }
    })

    expect(element.text()).toEqual('this.$store.state.test')
    expect(element.contains('span.testClass')).toEqual(true)
    expect(element.html()).toMatchSnapshot()
  })

  it('doesn’t do anything if no match is found', () => {
    const element = shallowMount(AppHighlight, {
      context: {
        props: {
          body: 'this.$store.state.test',
          matcher: 'vue-router',
          className: 'testClass'
        }
      }
    })

    expect(element.text()).toEqual('this.$store.state.test')
    expect(element.contains('span.testClass')).toEqual(false)
    expect(element.html()).toMatchSnapshot()
  })

  const queries = ['this.state', '$store test', 'state-this']

  queries.forEach(matcher => {
    it('highlights all partial matches', () => {
      const element = shallowMount(AppHighlight, {
        context: {
          props: {
            body: 'this.$store.state.test',
            matcher,
            className: 'testClass'
          }
        }
      })

      expect(element.text()).toEqual('this.$store.state.test')
      expect(element.findAll('.testClass').length).toEqual(2)
      expect(element.html()).toMatchSnapshot()
    })
  })
})
