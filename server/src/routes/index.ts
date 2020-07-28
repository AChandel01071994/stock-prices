import * as express from 'express';
import * as http from 'http';
import CommentRouter from './CommentRouter';



/**
 * @export
 * @param {express.Application} app
 */
export function init(app: express.Application): void {
    const router: express.Router = express.Router();
    const version = 'v1';

    /**
     * @description
     *  Forwards any requests to the /v1/users URI to our UserRouter
     * @constructs
     */
    app.use(`/${version}/comment`, CommentRouter);
    /** 
     * @description No results returned mean the object is not found
     * @constructs
     */
    app.use((req, res, next) => {
        res.status(404).send(http.STATUS_CODES[404]);
    });

    /**
     * @constructs all routes
     */
    app.use(router);
}
