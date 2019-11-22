<template>
  <router-link
    :to="{
          path: '/projectDetail',
          query: {
            id: id
          }
        }"
    class="program-list"
  >
    <div class="list-pic" :style="{backgroundImage: 'url(' + picture +')'}"></div>
    <div class="info">
      <h4 style="-webkit-box-orient: vertical">{{title}}</h4>
      <p class="pool">{{$t('mutual_aid_pool')}}:</p>
      <div class="pool-amount">{{amount?amount:'0 EOS'}}</div>
      <div class="people">{{$t('people')}}: {{people?people:0}}</div>
    </div>
  </router-link>
</template>

<script>
export default {
  props: ["picture", "id", "title", "targetAccount"],
  data() {
    return {
      people: 0,
      amount: "0 EOS"
    };
  },
  created() {
    this.getProjectInfo();
  },
  methods: {
    getProjectInfo() {
      // 从链上查项目详情
      this.$http
        .post(this.table_url, {
          json: true,
          code: this.targetAccount, //项目合约账户
          scope: this.targetAccount, //项目合约账户
          table: "global"
        })
        .then(result => {
          let pool = result.data.rows[0];
          if (pool) {
            this.people = pool.guaranteed_accounts;
            this.amount = pool.guarantee_pool;
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style scoped>
.program-list {
  display: block;
  box-shadow: 0 2px 8px rgba(175, 175, 175, 0.5);
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
}

.list-pic {
  height: 180px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);
}

.info {
  padding: 24px 16px;
  color: var(--blueGrey);
  font-size: 12px;
  line-height: 1;
}

.info h4 {
  color: var(--darkColor);
  font: 400 20px/1.4 Gotham-book;
  height: 56px;
  margin-bottom: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  display: -webkit-box;
  -webkit-line-clamp: 2;
}

.info .pool {
  color: var(--primaryColor);
  margin-top: 32px;
}
.info .pool-amount {
  color: var(--primaryColor);
  font: 500 20px/20px Gotham-Medium;
  margin: 8px 0 12px;
}

@media (max-width: 767px) {
  .info .pool-amount {
    font-size: 16px;
    line-height: 16px;
    margin: 4px 0 8px;
  }
}
</style>
