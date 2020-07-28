import { Router } from 'express';
import { CommentComponent } from '../components';

/**
 * @constant {express.Router}
 */
const router: Router = Router();

router.get('/', CommentComponent.getAllComments);

router.post('/', CommentComponent.createComment);

/**
 * @export {express.Router}
 */
export default router;
