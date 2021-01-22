'use strict'

import {
    Account
} from 'eve-esi-client'

import {
    prop,
    DocumentType,
    getModelForClass
} from '@typegoose/typegoose'

import {
    MongoCharacterModel
} from './MongoCharacter'

export class MongoAccount implements Account {
    @prop({
        unique: true,
        required: true,
        immutable: true
    })
    public readonly owner!: string

    public async deleteAccount (
        this: DocumentType<MongoAccount>
    ) {
        // delete characters
        await this.deleteCharacters()
        
        // delete account
        await this.delete()
    }

    public async deleteCharacters () {
        const characters = await MongoCharacterModel.find({
            owner: this.owner
        }).exec()

        for (const character of characters) {
            await character.deleteCharacter()
        }
    }
}

export const MongoAccountModel = getModelForClass(
    MongoAccount
)