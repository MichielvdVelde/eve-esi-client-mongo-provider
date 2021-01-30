'use strict'

import {
  Token
} from 'eve-esi-client'

import {
  prop,
  DocumentType
} from '@typegoose/typegoose'

export default class MongoToken implements Token {
  @prop({ required: true })
  public readonly characterId!: number

  @prop({ unique: true, required: true })
  public readonly accessToken!: string

  @prop({ unique: true, required: true })
  public readonly refreshToken!: string

  @prop({ required: true })
  public readonly expires!: Date

  @prop({ type: String })
  public readonly scopes?: string[]

  public async updateToken (
    this: DocumentType<MongoToken>,
    accessToken: string,
    refreshToken: string,
    expires: Date,
    scopes?: string | string[]
  ) {
    if (this.accessToken !== accessToken) {
      // @ts-ignore
      this.accessToken = accessToken
    }

    if (this.refreshToken !== refreshToken) {
      // @ts-ignore
      this.refreshToken = refreshToken
    }

    if (this.expires.getTime() !== expires.getTime()) {
      // @ts-ignore
      this.expires = expires
    }

    if (scopes) {
      if (typeof scopes === 'string') {
        scopes = scopes.split(' ')
      }

      // @ts-ignore
      this.scopes = scopes
    }

    if (this.isModified()) {
      await this.save()
    }
  }

  public async deleteToken (
    this: DocumentType<MongoToken>
  ) {
    await this.remove()
  }
}
