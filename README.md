# Eve ESI client MongoDB Provider

MongoDB provider for [eve-esi-client](https://github.com/MichielvdVelde/eve-esi).

See that module for (some) documentation.

## Install

```
npm i eve-esi-client-mongo-provider [--save]
```

## Usage

```ts
import ESI from 'eve-esi-client'
import MongoProvider from 'eve-esi-client-mongo-provider'

const provider = new MongoProvider()

const esi = new ESI({
    provider,
    // ...
})
```

## License

Copyright 2020 Michiel van der Velde.

This software is licensed under [the MIT License](LICENSE).
