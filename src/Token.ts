'use strict'

import {
  DocumentType,
  prop,
  getModelForClass
} from '@typegoose/typegoose'

export class Token {
  @prop({
    required: true,
    immutable: true,
    index: true
  })
  public readonly characterId!: number

  @prop({
    required: true
  })
  public accessToken!: string

  @prop({
    required: true
  })
  public refreshToken!: string

  @prop({
    required: true
  })
  public expires!: Date

  @prop({
    type: String,
    default: []
  })
  public scopes: string[]

  public async updateToken (
    this: DocumentType<Token>,
    accessToken: string,
    refreshToken: string,
    expires: Date,
    scopes?: string | string[]
  ) {
    if (this.accessToken !== accessToken) {
      this.accessToken = accessToken
    }

    if (this.refreshToken !== refreshToken) {
      this.refreshToken = refreshToken
    }

    if (this.expires.getTime() !== expires.getTime()) {
      this.expires = expires
    }

    if (scopes) {
      if (typeof scopes === 'string') {
        scopes = scopes.split(' ')
      }

      this.scopes = scopes
    }

    if (this.isModified()) {
      await this.save()
    }

    return this
  }

  public async deleteToken (
    this: DocumentType<Token>
  ) {
    await this.remove()
  }
}

export const TokenModel = getModelForClass(
  Token
)
