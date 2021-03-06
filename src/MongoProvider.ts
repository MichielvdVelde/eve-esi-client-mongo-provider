'use strict'

import {
  EventEmitter
} from 'events'

import {
  Provider
} from 'eve-esi-client'

import MongoAccount from './MongoAccount'
import MongoCharacter from './MongoCharacter'
import MongoToken from './MongoToken'

import {
  DocumentType,
  ReturnModelType,
  getModelForClass
} from '@typegoose/typegoose'

import {
  AnyParamConstructor
} from '@typegoose/typegoose/lib/types'

import {
  Connection,
  ConnectionOptions,
  createConnection
} from 'mongoose'

export default class MongoProvider<
  A extends MongoAccount = MongoAccount,
  C extends MongoCharacter = MongoCharacter,
  T extends MongoToken = MongoToken
> extends EventEmitter implements Provider<
  DocumentType<A>,
  DocumentType<C>,
  DocumentType<T>
> {
  #connection: Connection
  #ready = false

  #accountModel: ReturnModelType<AnyParamConstructor<A>>
  #characterModel: ReturnModelType<AnyParamConstructor<C>>
  #tokenModel: ReturnModelType<AnyParamConstructor<T>>

  public constructor (
    uris: string,
    options: {
      connectionOptions?: ConnectionOptions,
      models?: {
        account?: AnyParamConstructor<any>,
        character?: AnyParamConstructor<any>,
        token?: AnyParamConstructor<any>
      }
    } = {}
  ) {
    super()

    createConnection(uris, options.connectionOptions).then(connection => {
      this.#connection = connection

      this.#accountModel = this.getModelForClass(
        options.models?.account ?? MongoAccount
      )

      this.#characterModel = this.getModelForClass(
        options.models?.character ?? MongoCharacter
      )

      this.#tokenModel = this.getModelForClass(
        options.models?.token ?? MongoToken
      )

      this.#ready = true
      this.#connection.on('close', () => this.#ready = false)
      this.emit('ready')
    }).catch(err => {
      this.#ready = false
      this.emit('error', err)
    })
  }

  public get connection () {
    return this.#connection
  }

  public get ready () {
    return this.#ready
  }

  public async getAccount (
    owner: string,
    onLogin?: boolean
  ): Promise<DocumentType<A>> {
    // @ts-ignore
    const account = await this.#accountModel.findOne({
      owner
    })

    if (account && onLogin) {
      account.lastLoggedIn = new Date()
      await account.save()
    }

    return account
  }

  public async getCharacter (
    characterId: number,
    onLogin?: boolean
  ): Promise<DocumentType<C>> {
    // @ts-ignore
    const character = await this.#characterModel.findOne({
      characterId
    }).exec()

    if (character && onLogin) {
      character.lastLoggedIn = new Date()
      await character.save()
    }

    return character
  }

  public async getToken (
    characterId: number,
    scopes?: string | string[]
  ): Promise<DocumentType<T>> {
    if (scopes) {
      if (typeof scopes === 'string') {
        scopes = scopes.split(' ')
      }

      // @ts-ignore
      return this.#tokenModel.findOne({
        characterId,
        scopes: { $all: scopes }
      }).exec()
    }

    // @ts-ignore
    return this.#tokenModel.findOne({
      characterId
    }).exec()
  }

  public async createAccount (
    owner: string
  ): Promise<DocumentType<A>> {
    // @ts-ignore
    return this.#accountModel.create({
      owner,
      createdOn: new Date(),
      lastLoggedIn: new Date()
    })
  }

  public async createCharacter (
    owner: string,
    characterId: number,
    characterName: string
  ): Promise<DocumentType<C>> {
    // @ts-ignore
    return this.#characterModel.create({
      owner,
      characterId,
      characterName,
      createdOn: new Date(),
      lastLoggedIn: new Date()
    })
  }

  public async createToken (
    characterId: number,
    accessToken: string,
    refreshToken: string,
    expires: Date,
    scopes?: string | string[]
  ): Promise<DocumentType<T>> {
    if (scopes) {
      if (typeof scopes === 'string') {
        scopes = scopes.split(' ')
      }

      // @ts-ignore
      return this.#tokenModel.create({
        characterId,
        accessToken,
        refreshToken,
        expires,
        scopes
      })
    }

    // @ts-ignore
    return this.#tokenModel.create({
      characterId,
      accessToken,
      refreshToken,
      expires
    })
  }

  public async deleteAccount (
    owner: string
  ): Promise<void> {
    const account = await this.getAccount(owner)

    if (account) {
      await account.deleteAccount()
    }
  }

  public async deleteCharacter (
    characterId: number
  ): Promise<void> {
    const character = await this.getCharacter(characterId)

    if (character) {
      await character.deleteCharacter()
    }
  }

  public async deleteToken (
    accessToken: string
  ): Promise<void> {
    // @ts-ignore
    await this.#tokenModel.deleteOne({
      accessToken
    })
  }

  public async hasToken (
    characterId: number,
    scopes?: string | string[]
  ): Promise<boolean> {
    if (scopes) {
      if (typeof scopes === 'string') {
        scopes = scopes.split(' ')
      }

      // @ts-ignore
      return this.#tokenModel.exists({
        characterId,
        scopes: { $all: scopes }
      })
    }

    // @ts-ignore
    return this.#tokenModel.exists({
      characterId
    })
  }

  private getModelForClass<T> (cl: T) {
    // @ts-ignore
    return getModelForClass(cl, {
      existingConnection: this.#connection
    })
  }
}
