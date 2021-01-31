# Eve ESI client MongoDB Provider

MongoDB provider for [eve-esi-client](https://github.com/MichielvdVelde/eve-esi).

This provider uses [typegoose](https://github.com/typegoose/typegoose) and
[mongoose](https://github.com/Automattic/mongoose).

> I accept donations in ISK. If you want to donate, send your ISK to
> `Dakara Chart` in Eve Online.

## Install

```
npm i eve-esi-client-mongo-provider [--save]
```

## Usage

```ts
import ESI from 'eve-esi-client'
import MongoProvider from 'eve-esi-client-mongo-provider'

const provider = new MongoProvider('mongodb://localhost/esi', {
  connectionOptions: {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
})

const esi = new ESI({
  provider
  // ...
})
```

## Extending models

The `Account`, `Character`, and `Token` models can de extended.
Below is an example of how to add an `email` field to an account.

```ts
import MongoProvider, {
  MongoAccount
} from 'eve-esi-client-mongo-provider'

import {
  prop
} from '@typegoose/typegoose'

// Our new model must extend the old one
class MyAccount extends MongoAccount {
  @prop({ unique: true })
  public email?: string
}

// Note the type
const provider = new MongoProvider<MyAccount>('mongodb://localhost/esi_test', {
  connectionOptions: {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  models: {
    // Replace MongoAccount with MyAccount
    account: MyAccount
  }
})

// ...

provider.getAccount('owner').then(async account => {
  // Will have correct type checking
  account.email = 'bob@example.com'
  await account.save()
})
```

## License

Copyright 2020-2021 Michiel van der Velde.

This software is licensed under [the MIT License](LICENSE).
