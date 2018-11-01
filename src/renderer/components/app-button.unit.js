import AppButton from './app-button'

describe('@components/app-button', () => {
  it('renders a button with the default slot as its content', () => {
    const slotTemplate = '<p>Hello!</p>'
    const { element } = shallowMount(AppButton, {
      slots: {
        default: slotTemplate
      }
    })

    expect(element.tagName).toEqual('BUTTON')
    expect(element.innerHTML).toContain(slotTemplate)
  })
})
