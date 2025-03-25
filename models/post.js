
// const mongoose = require('mongoose');
// const { ObjectId } = mongoose.Schema.Types;

// const postSchema = new mongoose.Schema({
//     body: {
//         type: String,
//         required: true
//     },
//     photo: {
//         type: String,
//         required: true
//     },
//     likes:[{
//         type: ObjectId,
//         ref: "userdemo"
//     }],
//     comments: [
//         {
//           comment: String,
//           postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "userdemo" }
//         }
//       ],
//     postedBy: {
//         type: ObjectId,
//         ref: "userdemo"
//     }
// },{timestamps:true});

// const Post = mongoose.model('Postdemo', postSchema);
// module.exports = Post;


const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const postSchema = new mongoose.Schema({
  body: {
    type: String,
    required: true
  },
  photo: {
    type: String,
    required: true
  },
  likes: [
    {
      type: ObjectId,
      ref: "userdemo" 
    }
  ],
  comments: [
    {
      comment: String,
      postedBy: {
        type: ObjectId,
        ref: "userdemo" 
      }
    }
  ],
  postedBy: {
    type: ObjectId,
    ref: "userdemo" 
  }
}, { timestamps: true });

const Post = mongoose.model('Postdemo', postSchema); 
module.exports = Post;

