'use strict'

import {
  DocumentType,
  prop,
  getModelForClass
} from '@typegoose/typegoose'

export class Account {
  @prop({
    required: true,
    index: true
  })
  public owner!: string

  @prop({
    required: true,
    immutable: true
  })
  public readonly createdOn!: Date

  @prop({
    required: true,
    default: Date.now()
  })
  public lastLoggedInOn!: Date

  public async deleteAccount (
    this: DocumentType<Account>
  ) {
    await this.remove()
  }
}

export const AccountModel = getModelForClass(
  Account
)
