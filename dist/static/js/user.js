import Eos from 'eosjs'

class User {
  constructor() {
    this.network = {
        blockchain: 'eos',
        protocol: 'https',
        host: 'api-kylin.eosasia.one',
        port: '',
        chainId: '5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191',
      },
      this.account = null
  }

  getAccount() {
    return new Promise((resolve, reject) => {
      if (this.account) {
        return resolve(this.account);
      }

      ScatterJS.scatter.connect('Medishares').then(connected => {
        if (connected) {
          // 登录，获取 EOS 账户
          ScatterJS.scatter.getIdentity({
            accounts: [this.network]
          }).then(result => {
            if (result.accounts[0]) {
              this.account = result.accounts[0];
              return resolve(this.account);
            }
          }).catch(error => {
            reject('error:' + JSON.stringify(error));
          });

        } else {
          reject('connectFail');
        }
      });
    });
  }

  logout() {
    return new Promise((resolve, reject) => {
      if (this.account) {
        ScatterJS.scatter.connect('Medishares').then(connected => {
          if (connected) {
            // 删除之前的登录账户
            ScatterJS.scatter.forgetIdentity()
            if (this.account) {
              this.account = null
              return resolve(this.account)
            }
          } else {
            reject('connectFail')
          }
        });
      } else {
        reject('connectFail');
      }
    })

  }

  getEos() {
    return ScatterJS.scatter.eos(this.network, Eos);
  }

}

/* eslint-disable no-new */
let user = new User
export default user