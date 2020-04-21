'use strict'

import {
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
}

export const AccountModel = getModelForClass(
  Account
)
