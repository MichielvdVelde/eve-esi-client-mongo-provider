'use strict'

import MongoProvider from './MongoProvider'
import MongoAccount from './MongoAccount'

import {
  prop
} from '@typegoose/typegoose'

class MyAccount extends MongoAccount {
  @prop({ unique: true })
  public email?: string
}

const provider = new MongoProvider<MyAccount>('mongodb://localhost/esi-test', {
  connectionOptions: {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  models: {
    account: MyAccount
  }
})

provider.once('ready', async () => {
  const account = await provider.getAccount('owner1')
  const character = await provider.createCharacter(account.owner, 123, 'Dakara Chart')

  console.log(character)
})
