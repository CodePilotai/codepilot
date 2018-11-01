<template>
  <div class="flex w-full h-full overflow-hidden">
    <TheSideBar/>
    <TheViewPane/>
  </div>
</template>

<script>
import TheSideBar from './the-sidebar'
import TheViewPane from './the-view-pane'

export default {
  components: {
    TheSideBar,
    TheViewPane
  }
}
</script>
