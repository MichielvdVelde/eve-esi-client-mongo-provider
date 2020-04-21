'use strict'

import {
  DocumentType,
  prop,
  getModelForClass
} from '@typegoose/typegoose'

import {
  TokenModel
} from './Token'

export class Character {
  @prop({
    required: true
  })
  public owner!: string

  @prop({
    required: true,
    immutable: true
  })
  public readonly createdOn!: Date

  @prop({
    required: true,
    immutable: true,
    index: true
  })
  public readonly characterId!: number

  @prop({
    required: true
  })
  public characterName!: string

  @prop({
    required: true
  })
  public lastLoggedInOn!: Date

  public async updateCharacter (
    this: DocumentType<Character>,
    owner: string,
    characterName: string
  ) {
    if (this.owner !== owner) {
      this.owner = owner
    }

    if (this.characterName !== characterName) {
      this.characterName = characterName
    }

    if (this.isModified()) {
      await this.save()
    }

    return this
  }

  public async deleteTokens (
    this: DocumentType<Character>
  ) {
    await TokenModel.deleteMany({
      characterId: this.characterId
    })
  }
}

export const CharacterModel = getModelForClass(
  Character
)
