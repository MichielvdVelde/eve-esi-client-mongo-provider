'use strict'

import {
  Account
} from 'eve-esi-client'

import {
  prop,
  DocumentType
} from '@typegoose/typegoose'

export default class MongoAccount implements Account {
  @prop({ unique: true, required: true, immutable: true })
  public readonly owner!: string

  @prop({ required: true, immutable: true })
  public readonly createdOn!: Date

  @prop({ required: true })
  public lastLoggedIn!: Date

  public async deleteAccount (
    this: DocumentType<MongoAccount>
  ) {
    await this.deleteCharacters()
    await this.remove()
  }

  public async deleteCharacters (
    this: DocumentType<MongoAccount>
  ) {
    const characters = await this.model('character').find({
      owner: this.owner
    }).exec()

    for (const character of characters) {
      // @ts-ignore
      await character.deleteCharacter()
    }
  }
}
