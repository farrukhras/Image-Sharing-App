// const router = require('express').Router();

// // create an image post
// // get a single image post
// // get all posts of a user
// // get timeline posts

// module.exports = router;

const router = require('express').Router();
const Post = require('../models/Post');
const User = require('../models/User');
const fs = require('fs');

// create an image post
router.post('/', async (req, res) => {
  // check if the image is a url or a file
  let checkUrl = req.body.img.split("https");
  let isUrl = false;

  // if the image is a url, set isUrl to true
  if (checkUrl[0].length < 1) {
    isUrl = true;
  }
  
  // encode image to base64
  function base64_encode(file) {
    return "data:image/jpeg;base64,"+fs.readFileSync(file, 'base64');
  }
  
  // get the base64 string
  var base64str = req.body.img;

  // if the image is a file, encode it to base64
  // FOR PLATFORM
  // if (!isUrl) {
  //   base64str = base64_encode(`/usercode/image_sharing_app/api/public/images/${req.body.img}`);
  // }

  // FOR LOCAL
  if (!isUrl) {
    base64str = base64_encode(`/Users/Farrukh/Desktop/Educative/Projects/Mern-Image-Sharing-App/api/public/images/${req.body.img}`);
  }

  // create a new post
  const newPost = new Post({
    userId: req.body.userId,
    desc: req.body.desc,
    img: base64str,
  });
  
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get a single image post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get all posts of a user
router.get('/profile/:username', async (req, res) => {
  try {
    const user = await User.findOne({username: req.params.username});
    const posts = await Post.find({userId: user._id});
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get timeline posts
router.get('/timeline/:userId', async (req, res) => {
  try {
    // get current user
    const currentUser = await User.findById(req.params.userId);

    // get all posts from current user
    const userPosts = await Post.find({userId: currentUser._id});

    // get all posts from current user's followed users
    const followedUserPosts = await Promise.all(
      currentUser.followings.map((followingId) => {
        return Post.find({userId: followingId});
      })
    );
      
    res.status(200).json(userPosts.concat(...followedUserPosts));
  } catch (err) {
    res.status(500).json(err);
  }
});

// update an image post
router.put('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({$set: req.body});
      res.status(200).json('The post has been updated');
    } else {
      res.status(403).json('You can only update your post');
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// delete an image post
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).json('The post has been deleted');
    } else {
      res.status(403).json('You can only delete your post');
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;


