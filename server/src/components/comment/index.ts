import CommentService from './service';
import { HttpError } from '../../config/error';
import { ICommentModel } from './model';
import { NextFunction, Request, Response } from 'express';

export async function getAllComments(req: Request, res: Response, next: NextFunction): Promise < void > {
    try {
        const comments = await CommentService.findAll();

        res.status(200).json(comments);
    } catch (error) {
        next(new HttpError(error.message.status, error.message));
    }
}

export async function createComment(req: Request, res: Response, next: NextFunction): Promise < void > {
    try {
        const comment = await CommentService.insert(req.body);
        res.status(201).json(comment);
    } catch (error) {
        next(new HttpError(error.message.status, error.message));
    }
}