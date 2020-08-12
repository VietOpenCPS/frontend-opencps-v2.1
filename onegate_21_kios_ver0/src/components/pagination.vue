<template>
  <div>
    <!-- <div style="text-align: left;position: absolute;line-height: 46px;">Tổng số <span class="text-bold primary--text">{{total}}</span> bản ghi. </div> -->
    <div v-if="total > currentLimit" class="vue-tiny-pagination pagination layout" style="justify-content: center; -webkit-justify-content: center;">
      <ul class="tiny-pagination" :class="customClass">
        <li class="page-item" :class="classFirstPage" style="border: none !important;">
          <button @click.prevent="lastPage" :class="classFirstPage" class="pagination__navigation primary">
            <i aria-hidden="true" class="material-icons icon">arrow_left</i>
          </button>
        </li>
        <li class="page-item ml-4" :class="classLastPage" style="margin-right: 0;border: none !important;">
          <button @click.prevent="nextPage" :class="classLastPage" class="pagination__navigation primary">
            <i aria-hidden="true" class="material-icons icon">arrow_right</i>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
const COMPONENT_NAME = 'TinyPagination'

export default {
  name: COMPONENT_NAME,
  props: {
    total: {
      type: Number,
      required: true
    },
    page: {
      type: Number,
      default: 1
    },
    lang: {
      type: String,
      default: 'en'
    },
    customClass: {
      type: String
    },
    limits: {
      type: Array,
      default () {
        return [10, 15, 20, 50, 100]
      }
    },
    showLimit: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      version: '0.2.1',
      currentPage: 1,
      currentLimit: 10,
      translations: {
        en: {
          prev: 'Previous',
          title: 'Page',
          next: 'Next'
        }
      },
      availableLanguages: ['en']
    }
  },
  created () {
    this.currentPage = this.page
  },
  watch: {
    page (val) {
      this.currentPage = parseInt(val)
    }
  },
  computed: {
    translation () {
      return this.availableLanguages.includes(this.lang)
        ? this.translations[this.lang]
        : this.translations['en']
    },
    totalPages () {
      return Math.ceil(this.total / this.currentLimit)
    },
    totalPagesData () {
      var totalDatas = []
      var data = {}
      for (var index = 1; index <= this.totalPages; ++index) {
        data = {
          value: index,
          text: 'Trang ' + index
        }
        totalDatas.push(data)
      }
      return totalDatas
    },
    titlePage () {
      return `${this.currentPage}`
    },
    classFirstPage () {
      return {
        'c-not-allowed pagination__navigation--disabled': this.currentPage === 1
      }
    },
    classLastPage () {
      return {
        'c-not-allowed pagination__navigation--disabled': this.currentPage === this.totalPages
      }
    }
  },
  methods: {
    nextPage () {
      if (this.currentPage !== this.totalPages) {
        this.currentPage += 1
        this.$emit('tiny:change-page', {
          page: this.currentPage
        })
      }
    },
    lastPage () {
      if (this.currentPage > 1) {
        this.currentPage -= 1
        this.$emit('tiny:change-page', {
          page: this.currentPage
        })
      }
    },
    nextPageLast () {
      this.currentPage = this.totalPages
      this.$emit('tiny:change-page', {
        page: this.totalPages
      })
    },
    lastPageLast () {
      this.currentPage = 1
      this.$emit('tiny:change-page', {
        page: 1
      })
    },
    goToPage () {
      this.$emit('tiny:change-page', {
        page: this.currentPage
      })
    },
    onLimitChange () {
      this.currentPage = 1
    }
  }
}
</script>
