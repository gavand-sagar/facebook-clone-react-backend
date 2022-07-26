import express from 'express';
import autheticate from '../middlewares/authenticate';
import PostUseCases from '../use-cases/post.use-cases';

const router = express.Router();

router.get('/post', autheticate, PostUseCases.getAllPosts);
router.post('/post', autheticate, PostUseCases.createPost);
router.post('/post/:id/comment', autheticate, PostUseCases.createComment);
router.get('/post/:id/comment', autheticate, PostUseCases.getAllComments);
router.delete('/post/:id/comment/:commentId', autheticate, PostUseCases.deleteComment);

export default router;
