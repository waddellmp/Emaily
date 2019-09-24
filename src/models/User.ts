import mongoose, { Model } from 'mongoose';
import { queryableLogger } from './common/logger';
import {
    prop,
    Typegoose,
    staticMethod,
    InstanceType
} from '@hasezoey/typegoose';

export class User extends Typegoose {
    @staticMethod
    static findByGoogleId(this: Model<InstanceType<User>>, id: string) {
        return this.findOne({ googleId: id }, queryableLogger);
    }

    @prop({ required: true })
    googleId!: string;
}
