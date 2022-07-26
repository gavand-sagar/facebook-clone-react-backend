import { Schema, model } from 'mongoose';

const CommentSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    post: { type: Schema.Types.ObjectId, ref: 'Post' },
    content: {
      type: String,
      required: true
    },
    replyTo: {
      type: Schema.Types.ObjectId,
      ref: 'Comment'
    }
  },
  {
    timestamps: true
  }
);

export const Comment = model('Comment', CommentSchema);
