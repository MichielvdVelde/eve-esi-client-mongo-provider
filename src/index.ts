'use strict'

import {
    Provider,
    Account,
    Character,
    Token
} from 'eve-esi-client'

import {
    connect,
    ConnectOptions
} from 'mongoose'

import {
    DocumentType,
    ReturnModelType
} from '@typegoose/typegoose'

import {
    MongoAccount,
    MongoAccountModel
} from './MongoAccount'

import {
    MongoCharacter,
    MongoCharacterModel
} from './MongoCharacter'

import {
    MongoToken,
    MongoTokenModel
} from './MongoToken'

export {
    MongoAccount
} from './MongoAccount'

export {
    MongoCharacter
} from './MongoCharacter'

export {
    MongoToken
} from './MongoToken'

export default class MongoProvider implements Provider<
 DocumentType<MongoAccount>,
 DocumentType<MongoCharacter>,
 DocumentType<MongoToken>
> {
    public constructor (
        uris: string,
        options: ConnectOptions
    ) {
        connect(uris, options)
    }

    public async getAccount (
        owner: string,
        onLogin?: boolean
    ): Promise<DocumentType<MongoAccount>> {
        const account = await MongoAccountModel.findOne({
            owner
        }).exec()

        if (account) {
            if (onLogin) {
                account.lastLoggedIn = new Date()
                await account.save()
            }

            return account
        }
    }

    public async getCharacter (
        characterId: number,
        onLogin?: boolean
    ): Promise<DocumentType<MongoCharacter>> {
        const character = await MongoCharacterModel.findOne({
            characterId
        }).exec()

        if (character) {
            if (onLogin) {
                character.lastLoggedIn = new Date()
                await character.save()
            }

            return character
        }
    }

    public async getToken (
        characterId: number,
        scopes?: string | string[]
    ): Promise<DocumentType<MongoToken>> {
        if (typeof scopes === 'string') {
            scopes = scopes.split(' ')
        }

        if (!scopes || !scopes.length) {
            return MongoTokenModel.findOne({
                characterId
            }).exec()
        }

        return MongoTokenModel.findOne({
            characterId,
            scopes: { $all: scopes }
        }).exec()
    }

    public async createAccount (
        owner: string
    ): Promise<DocumentType<MongoAccount>> {
        return MongoAccountModel.create({
            owner,
            lastLoggedIn: new Date()
        })
    }

    public async createCharacter (
        owner: string,
        characterId: number,
        characterName: string
    ): Promise<DocumentType<MongoCharacter>> {
        return MongoCharacterModel.create({
            owner,
            characterId,
            characterName,
            lastLoggedIn: new Date()
        })
    }

    public async createToken (
        characterId: number,
        accessToken: string,
        refreshToken: string,
        expires: Date,
        scopes?: string | string[]
    ): Promise<DocumentType<MongoToken>> {
        return MongoTokenModel.create({
            characterId,
            accessToken,
            refreshToken,
            expires,
            scopes: typeof scopes === 'string' ? scopes.split(' ') : scopes
        })
    }

    public async deleteAccount (
        owner: string
    ): Promise<void> {
        const account = await MongoAccountModel.findOne({
            owner
        }).exec()

        if (account) {
            await account.deleteAccount()
        }
    }

    public async deleteCharacter (
        characterId: number
    ): Promise<void> {
        const character = await MongoCharacterModel.findOne({
            characterId
        }).exec()

        if (character) {
            await character.deleteCharacter()
        }
    }

    public async deleteToken (
        accessToken: string
    ): Promise<void> {
        const token = await MongoTokenModel.findOne({
            accessToken
        }).exec()

        if (token) {
            await token.deleteToken()
        }
    }

    public getAccountModel () {
        return MongoAccountModel
    }

    public getCharacterModel () {
        return MongoCharacterModel
    }

    public getTokenModel () {
        return MongoTokenModel
    }
}