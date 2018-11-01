import Vue from 'vue'
// https://github.com/Akryum/v-tooltip#usage
import VTooltip from 'v-tooltip'
// Add global styles for our tooltip
import style from './v-tooltip.scss'

Vue.use(VTooltip, {
  // Default tooltip placement relative to target element
  defaultPlacement: 'right',
  // Default HTML template of the tooltip element
  // It must include `tooltip` & `tooltip-inner` CSS classes
  defaultTemplate: `
    <div class="tooltip ${style.tooltip}" role="tooltip">
      <div class="tooltip-inner ${style.tooltipInner}"></div>
    </div>
  `,
  defaultArrowSelector: `${style.tooltipInner}::before`,
  // Delay in milliseconds.
  defaultDelay: 700,
  // Default events that trigger the tooltip.
  defaultTrigger: 'hover focus',
  // Default container where the tooltip will be appended.
  defaultContainer: '#app',
  // Options we can pass directly to popper.js if we need to
  // https://popper.js.org/popper-documentation.html
  defaultPopperOptions: {},
  // When showing a tooltip on hover, automatically hide the tooltip again
  // when no longer hovering over the target element.
  autoHide: true,
  // Destroy hidden tooltip DOM nodes after this many milliseconds
  disposeTimeout: 5000,
  popover: {
    defaultPlacement: 'right',
    // Base class (change if conflicts with other libraries)
    defaultBaseClass: `${style.tooltip} ${style.popover}`,
    // Wrapper class (contains arrow and inner)
    defaultWrapperClass: style.popoverWrapper,
    // Inner content class
    defaultInnerClass: `${style.tooltipInner} ${style.popoverInner}`,
    defaultTrigger: 'click',
    defaultContainer: '#app',
    // Hides if clicked outside of popover
    defaultAutoHide: true,
    // Update popper on content resize
    defaultHandleResize: true
  }
})
