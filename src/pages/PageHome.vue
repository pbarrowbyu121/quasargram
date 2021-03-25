<template>
  <q-page class="constrain q-pa-md">
    <div class="row q-col-gutter-lg">
      <div class="col-12 col-sm-8">
        <template v-if="!loadingPosts && posts.length">
          <q-card v-for="post in posts" :key="post.id" class="card-post q-mb-md" flat bordered>
          
            <q-item>
              <q-item-section avatar>
                <q-avatar>
                  <img src="profile_square.png">
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-bold">@peter_barrow</q-item-label>
                <q-item-label class="text-grey" location>
                  {{ post.location}}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-separator />
            <q-img 
              :src="post.imageUrl"
            />
            <q-card-section>
              <div>{{ post.caption }}</div>
              <div class="text-caption text-grey">{{ post.date | niceDate }}</div>
            </q-card-section>

          </q-card>
        </template>
        <template v-else-if="!loadingPosts && !posts.length">
          <h5 class="text-encter text-grey">No posts yet</h5>
        </template>
        <template v-else>
          <q-card flat bordered>
            <q-item>
              <q-item-section avatar>
                <q-skeleton size="40px" type="QAvatar" animation="fade" />
              </q-item-section>

              <q-item-section>
                <q-item-label>
                  <q-skeleton type="text" animation="fade" />
                </q-item-label>
                <q-item-label caption>
                  <q-skeleton type="text" animation="fade" />
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-skeleton height="200px" square animation="fade" />

            <q-card-section>
              <q-skeleton type="text" class="text-subtitle2" animation="fade" />
              <q-skeleton type="text" width="50%" class="text-subtitle2" animation="fade" />
            </q-card-section>
          </q-card>
        </template>
      </div>
      <div class="col-4 large-screen-only">
          <q-item class="fixed ">
            <q-item-section avatar>
              <q-avatar size="48px">
                <img src="profile_square.png">
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-bold">@peter_barrow</q-item-label>
              <q-item-label caption>Peter Barrow</q-item-label>
            </q-item-section>
        </q-item>
      </div>
    </div>
    
  </q-page>
</template>

<script>
import { date } from 'quasar'
export default {
  name: 'PageHome',
  data() {
    return {
      posts: [],
      loadingPosts: false
    }
  },
  methods: {
    getPosts() {
      this.loadingPosts = true
      this.$axios.get(`${ process.env.API }/posts`).then(response => {
        // console.log('response: ', response)
        this.posts = response.data
        this.loadingPosts = false
      }).catch(err => {
        console.log('err: ', err)
        this.$q.dialog({
          title: "Error",
          message: "Could not download posts"
        })
        this.loadingPosts = false
      })
      console.log('getPosts')
    }
  },
  created() {
    this.getPosts()
  },
  filters: {
    niceDate(value) {
      return date.formatDate(value, 'MMMM D h:mm A')
    }
  }
}
</script>

<style lang="sass">
  .card-post
    .q-img
      min-height: 200px
</style>
