'use strict'

import {
    Character
} from 'eve-esi-client'

import {
    prop,
    DocumentType,
    getModelForClass
} from '@typegoose/typegoose'

import {
    MongoTokenModel
} from './MongoToken'

export class MongoCharacter implements Character {
    @prop({
        unique: true,
        required: true,
        immutable: true
    })
    public readonly characterId!: number
    
    @prop({
        required: true
    })
    public readonly owner!: string

    @prop({
        required: true
    })
    public readonly characterName!: string

    @prop({
        required: true
    })
    public readonly lastLoggedIn!: Date

    public async updateCharacter (
        this: DocumentType<MongoCharacter>,
        owner: string,
        characterName: string
    ) {
        if (this.owner !== owner) {
            (<any>this).owner = owner
        }

        if (this.characterName !== characterName) {
            (<any>this).characterName = characterName
        }

        if (this.isModified()) {
            await this.save()
        }
    }

    public async deleteCharacter (
        this: DocumentType<MongoCharacter>
    ) {
        // delete tokens
        await this.deleteTokens()

        // delete character
        await this.delete()
    }

    public async deleteTokens (
        this: DocumentType<MongoCharacter>
    ) {
        await MongoTokenModel.deleteMany({
            characterId: this.characterId
        })
    }
    
}

export const MongoCharacterModel = getModelForClass(
    MongoCharacter,
    {
        options: {
            automaticName: false,
            customName: 'characters'
        }
    }
)