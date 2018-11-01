import AppIcon from './app-icon'

describe('@components/app-icon', () => {
  it('renders a span element with search icon', () => {
    const { element } = mount(AppIcon, {
      propsData: {
        icon: 'search'
      }
    })

    expect(element.tagName).toEqual('SPAN')
    expect(element.className).toContain('fa fa-search')
  })
})
