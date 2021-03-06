import Eos from 'eosjs'

class User {
  constructor() {
    this.network = {
      blockchain: 'eos',
      protocol: 'https',
      host: 'eosmainnet.medishares.net',
      port: 443,
      chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
    };
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