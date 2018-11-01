<template>
  <SearchResultsItem
    v-bind="boundSublistData"
    v-on="$listeners"
  >
    <AppIcon
      slot="icon"
      :class="$style.videoIcon"
      class="w-6 m-0"
      icon="youtube-play"
    />
    <template slot="title">
      {{ result.title }}
    </template>
    <template slot="content">
      <div class="flex px-3">
        <img
          :class="$style.videoThumbnail"
          :src="result.thumbnails.medium.url"
        >
        <div class="pl-3">
          <div slot="meta">
            <div>
              <div
                v-tooltip.bottom="'Channel ' + result.channelTitle"
                class="flex flex-no-shrink items-center h-6 mt-1 mr-3 mb-0 ml-0 font-semibold leading-normal"
              >
                <AppIcon
                  icon="user"
                  class="mr-1 text-base"
                />
                {{ result.channelTitle }}
              </div>
              <div
                v-tooltip.left="'Published on  ' + formatDate(result.publishedAt)"
                v-if="result.publishedAt"
                class="flex flex-no-shrink items-center h-6 mt-1 mr-3 mb-0 ml-0 font-semibold leading-normal"
              >
                <AppIcon
                  icon="clock-o"
                  class="mr-1 text-base"
                />
                {{ formatDate(result.publishedAt) }}
              </div>
            </div>
          </div>
          <p v-if="result.description">
            {{ result.description }}
          </p>
          <p v-else>
            No description given...
          </p>
        </div>
      </div>
    </template>
  </SearchResultsItem>
</template>

<script>
import SearchResultsItem from './search-results-item'
import formatDate from '@helpers/format-date'

export default {
  components: {
    SearchResultsItem
  },
  props: {
    result: {
      type: Object,
      required: true
    }
  },
  computed: {
    boundSublistData() {
      return { ...this.$props, ...this.$attrs }
    }
  },
  methods: {
    formatDate
  }
}
</script>

<style lang="scss" module>
@import '~@branding';

.video-icon {
  &::before {
    font-size: config('textSizes.2xl');
    color: config('colors.red');
  }
}

.video-thumbnail {
  max-width: 10rem;
  max-height: 8rem;
}
</style>
