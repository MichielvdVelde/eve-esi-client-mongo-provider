# Eve ESI client MongoDB Provider

MongoDB provider for [eve-esi-client](https://github.com/MichielvdVelde/eve-esi).

This provider uses [typegoose](https://github.com/typegoose/typegoose) and
[mongoose](https://github.com/Automattic/mongoose).

## Install

```
npm i eve-esi-client-mongo-provider [--save]
```

## Usage

See [eve-esi-client](https://github.com/MichielvdVelde/eve-esi)
for a more in-depth example.

```ts
import ESI from 'eve-esi-client'
import MongoProvider from 'eve-esi-client-mongo-provider'

const provider = new MongoProvider('mongodb://localhost', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'esi'
})

const esi = new ESI({
    provider,
    // ...
})
```

### Extending the Provider

```ts
import {
    prop
} from '@typegoose/typegoose'

import {
    MongoAccount
} from 'eve-esi-client-mongo-provider'

export default class MyAccount extends MongoAccount {
    @prop({
        unique: true
    })
    public email!: string
}

// ...

import MongoProvider from 'eve-esi-client-mongo-provider'

const provider = new MongoProvider<MyAccount>('mongodb://localhost')
// ...
```

## License

Copyright 2020-2021 Michiel van der Velde.

This software is licensed under [the MIT License](LICENSE).
