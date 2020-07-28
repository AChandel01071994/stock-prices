import * as connections from '../../config/connection/connection'; 
import { Document, Schema } from 'mongoose';
import { NextFunction } from 'express';

 
export interface ICommentModel extends Document {
    startDate: Date;
    endDate: Date;
    comment: string;
}


const CommentSchema: Schema = new Schema({
    startDate: {
        type: String,
        trim: true
    },
    endDate: {
        type: String,
        trim: true
    },
    comment: {
        type: String,
        trim: true
    }
}, {
    collection: 'comment',
    versionKey: false
}).pre('save', async function (next: NextFunction): Promise < void > {
   
});

export default connections.db.model < ICommentModel > ('CommentModel', CommentSchema);
