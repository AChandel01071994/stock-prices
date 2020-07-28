import * as Joi from 'joi';
import Validation from '../validation';
import { ICommentModel } from './model';

/**
 * @export
 * @class UserValidation
 * @extends Validation
 */
class StockValidation extends Validation {

    constructor() {
        super();
    }

    createComment(
        params: ICommentModel
    ): Joi.ValidationResult < ICommentModel > {
        const schema: Joi.Schema = Joi.object().keys({
            startDate: Joi.string().required(),
            endDate: Joi.string().required(),
            comment: Joi.string().required()
             
        });

        return Joi.validate(params, schema);
    }
}

export default new StockValidation();
