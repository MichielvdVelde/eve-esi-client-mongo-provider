'use strict'

import {
    Token
} from 'eve-esi-client'

import {
    prop,
    DocumentType,
    getModelForClass
} from '@typegoose/typegoose'

export class MongoToken implements Token {
    @prop({
        index: true,
        required: true
    })
    public readonly characterId!: number

    @prop({
        index: true,
        required: true
    })
    public readonly accessToken!: string

    @prop({
        required: true
    })
    public readonly refreshToken!: string

    @prop({
        required: true
    })
    public readonly expires!: Date

    @prop({
        items: String
    })
    public readonly scopes?: string[]

    public async updateToken (
        this: DocumentType<MongoToken>,
        accessToken: string,
        refreshToken: string,
        expires: Date,
        scopes?: string | string[]
    ) {
        if (this.accessToken !== accessToken) {
            (<any>this).accessToken = accessToken
        }

        if (this.refreshToken !== refreshToken) {
            (<any>this).refreshToken = refreshToken
        }

        if (this.expires.getTime() !== expires.getTime()) {
            (<any>this).expires = expires
        }

        // TODO: check and update scopes

        if (this.isModified) {
            await this.save()
        }
    }

    public async deleteToken (
        this: DocumentType<MongoToken>
    ) {
        await this.delete()
    }
}

export const MongoTokenModel = getModelForClass(
    MongoToken
)