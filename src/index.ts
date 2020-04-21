'use strict'

import {
  Provider
} from 'eve-esi-client'

import {
  DocumentType
} from '@typegoose/typegoose'

import {
  AccountModel,
  Account
} from './Account'

import {
  CharacterModel,
  Character
} from './Character'

import {
  TokenModel,
  Token
} from './Token'

export default class MongoProvider implements Provider<
  DocumentType<Account>,
  DocumentType<Character>,
  DocumentType<Token>
  > {
  public async getAccount (
    owner: string,
    onLogin?: boolean
  ) {
    const account = await AccountModel.findOne({
      owner
    })

    if (!account) {
      return
    }

    if (onLogin) {
      account.lastLoggedInOn = new Date()
      await account.save()
    }

    return account
  }

  public async getCharacter (
    characterId: number,
    onLogin?: boolean
  ) {
    const character = await CharacterModel.findOne({
      characterId
    })

    if (!character) {
      return
    }

    if (onLogin) {
      character.lastLoggedInOn = new Date()
      await character.save()
    }

    return character
  }

  public async getToken (
    characterId: number,
    scopes?: string | string[]
  ) {
    if (typeof scopes === 'string') {
      scopes = scopes.split(' ')
    }

    let token: DocumentType<Token>

    if (!scopes || !scopes.length) {
      token = await TokenModel.findOne({
        characterId
      })
    } else {
      token = await TokenModel.findOne({
        characterId,
        scopes: { $all: scopes }
      })
    }

    if (token) {
      return token
    }
  }

  public async createAccount (
    owner: string
  ) {
    return AccountModel.create({
      owner,
      createdOn: new Date(),
      lastLoggedInOn: new Date()
    })
  }

  public async createCharacter (
    owner: string,
    characterId: number,
    characterName: string
  ) {
    return CharacterModel.create({
      owner,
      createdOn: new Date(),
      characterId,
      characterName,
      lastLoggedInOn: new Date()
    })
  }

  public async createToken (
    characterId: number,
    accessToken: string,
    refreshToken: string,
    expires: Date,
    scopes?: string | string[]
  ) {
    if (!scopes) {
      scopes = []
    }

    if (typeof scopes === 'string') {
      scopes = scopes.split(' ')
    }

    return TokenModel.create({
      characterId,
      accessToken,
      refreshToken,
      expires,
      scopes
    })
  }
}
