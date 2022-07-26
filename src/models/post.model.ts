import { Schema, model } from 'mongoose';

const PostSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    media: {
      type: String
    },
    content: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export const Post = model('Post', PostSchema);
