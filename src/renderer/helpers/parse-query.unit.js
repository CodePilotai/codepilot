import parseQuery from './parse-query'

describe('Search Query Parser', () => {
  it("parses search query 'vue AND (vuex OR v-resource)' and confirms correct expression tree", () => {
    /*
      Example expression tree
          root
        /     \
      vue    / \
          vuex vue-resource
    */
    const parsedResults = parseQuery('vue AND (vuex OR vue-resource)')
    const leftNode = parsedResults.left
    const rightNode = parsedResults.right
    expect(leftNode.term).toEqual('vue')
    expect(rightNode.left.term).toEqual('vuex')
    expect(rightNode.right.term).toEqual('vue-resource')
  })

  it('parses more complex search query and confirms correct expression tree', () => {
    const parsedResults = parseQuery(
      'scss AND vue AND vue-loader AND (vuex OR vue-resource)'
    )
    const leftNode = parsedResults.left
    const rightNode = parsedResults.right
    expect(leftNode.term).toEqual('scss')
    expect(rightNode.left.term).toEqual('vue')
    expect(rightNode.right.left.term).toEqual('vue-loader')
    expect(rightNode.right.right.left.term).toEqual('vuex')
    expect(rightNode.right.right.right.term).toEqual('vue-resource')
  })

  it('parses search query containing OR and confirms correct expression tree', () => {
    const parsedResults = parseQuery('static OR dynamic')
    const leftNode = parsedResults.left
    const rightNode = parsedResults.right
    const operator = parsedResults.operator
    expect(leftNode.term).toEqual('static')
    expect(operator).toEqual('OR')
    expect(rightNode.term).toEqual('dynamic')
  })

  it('parses search query containing NOT and confirms correct expression tree', () => {
    const parsedResults = parseQuery('React AND (mobx NOT redux)')
    const leftNode = parsedResults.left
    const rightNode = parsedResults.right
    const operator = parsedResults.right.operator
    expect(leftNode.term).toEqual('React')
    expect(operator).toEqual('NOT')
    expect(rightNode.left.term).toEqual('mobx')
    expect(rightNode.right.term).toEqual('redux')
  })
})
