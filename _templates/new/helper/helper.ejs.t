---
to: "src/renderer/helpers/<%= h.inflection.dasherize(name) %>.js"
---
<%
  const fileName = h.inflection.dasherize(name)
  const importName = h.inflection.camelize(fileName.replace(/-/g, '_'), true)
%>export default function <%= importName %>() {
  return 'hello'
}

