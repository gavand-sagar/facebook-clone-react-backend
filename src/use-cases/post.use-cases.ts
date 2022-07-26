import { Post, Comment } from '../models';
import { UploadedFile } from 'express-fileupload';
import { Request, Response } from 'express';
import { Logger } from '../utils';
import { PUBLIC_DIR } from '../config';
import sendWebSocketMessage from '../websocket-server/client';

const getAllPosts = async (req: Request, res: Response) => {
  const posts = await Post.find({}).populate('user', 'avatar name');
  return res.status(200).json(posts);
};

const createPost = async (req: Request, res: Response) => {
  const user = req.user;
  const body = req.body;
  const files = req.files;

  body.user = user._id; // it comes from the token _id is userId
  let media = files?.media as UploadedFile;
  try {
    //Use the mv() method to place the file in upload directory (i.e. "uploads")
    if (media) {
      const fileName = `${body.user}-${Date.now()}-${media.name}`;
      media.mv(PUBLIC_DIR + '/uploads/posts/' + fileName);
      body.media = '/uploads/posts/' + fileName;
    }

    const post = new Post(body);
    await post.save().then(async (_post) => await _post.populate('user', 'avatar name'));
    sendWebSocketMessage({
      data: {
        type: 'post',
        payload: post
      },
      clients: 'ALL'
    });
    return res.status(200).json({
      message: `Post created by user with email ${user.email}`
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error creating post by user with email ${user.email}`
    });
  }
};

const createComment = async (req: Request, res: Response) => {
  const user = req.user;
  const body = req.body;
  const postId = req.params.id;

  try {
    const comment = new Comment({
      content: body.content,
      user: user._id,
      post: postId,
      replyTo: body.replyTo
    });
    await comment.save().then(async (_comment) => await _comment.populate('user', 'avatar name'));
    console.log('Log from createComment: ', comment);
    sendWebSocketMessage({
      data: {
        type: 'comment',
        payload: comment
      },
      clients: 'ALL'
    });
    return res.status(200).json({
      message: `Comment created by user with email ${user.email}`
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error creating comment by user with email ${user.email}`
    });
  }
};

/**
 * Use in '/post/:id/comment' route
 * @param req
 * @param res
 * @returns
 */
const getAllComments = async (req: Request, res: Response) => {
  const comments = await Comment.find({
    post: req.params.id
  })
    .populate('user', 'avatar name')
    .populate('replyTo');
  return res.status(200).json({ success: true, comments });
};

const deleteComment = async (req: Request, res: Response) => {
  const commentId = req.params.commentId;
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        message: 'Comment not found'
      });
    }
    if (comment.user !== req.user.userId) {
      return res.status(401).json({
        message: 'You are not authorized to delete this comment'
      });
    }
    Comment.remove(commentId);
    Logger.log(`Comment with id ${commentId} deleted`);
    return res.status(200).json({
      message: `Comment with id ${commentId} deleted`
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error deleting comment with id ${commentId}`
    });
  }
};

export default {
  getAllPosts,
  createPost,
  createComment,
  getAllComments,
  deleteComment
};
