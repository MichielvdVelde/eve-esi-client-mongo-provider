'use strict'

import {
  Character
} from 'eve-esi-client'

import {
  modelOptions,
  prop,
  DocumentType
} from '@typegoose/typegoose'

@modelOptions({ options: { customName: 'Character' } })
export default class MongoCharacter implements Character {
  @prop({ index: true, required: true })
  public readonly owner!: string

  @prop({ unique: true, required: true, immutable: true })
  public readonly characterId!: number

  @prop({ required: true })
  public readonly characterName!: string

  @prop({ required: true, immutable: true })
  public readonly createdOn!: Date

  @prop({ required: true })
  public lastLoggedIn!: Date

  public async updateCharacter (
    this: DocumentType<MongoCharacter>,
    owner: string,
    characterName: string
  ): Promise<void> {
    if (this.owner !== owner) {
      await this.deleteTokens()
      // @ts-ignore
      this.owner = owner
    }

    if (this.characterName !== characterName) {
      // @ts-ignore
      this.characterName = characterName
    }

    if (this.isModified()) {
      await this.save()
    }
  }

  public async deleteCharacter (
    this: DocumentType<MongoCharacter>
  ): Promise<void> {
    await this.deleteTokens()
    await this.remove()
  }

  public async deleteTokens (
    this: DocumentType<MongoCharacter>
  ): Promise<void> {
    await this.model('Token').deleteMany({
      characterId: this.characterId
    })
  }
}
