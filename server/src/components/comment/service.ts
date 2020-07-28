import * as Joi from 'joi';
import CommentModel, { ICommentModel } from './model';
import CommentValidation from './validation';
import SocketService from "../../services/socket.service";
import { Types } from 'mongoose';


const CommentService = {

    async findAll() {
        try {
            return await CommentModel.find({});
        } catch (error) {
            throw new Error(error.message);
        }
    },

    async insert(body: ICommentModel) {
        try {
            const validate: Joi.ValidationResult<ICommentModel> = CommentValidation.createComment(body);

            if (validate.error) {
                throw new Error(validate.error.message);
            }

            const comment: ICommentModel = await CommentModel.create(body);
            // inform other users realtime
            SocketService.emit('comments-updated', {});
            return comment;
        } catch (error) {
            throw new Error(error.message);
        }
    }
};

export default CommentService;
