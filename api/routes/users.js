// const router = require('express').Router();

// // get a user
// // get the user's followed by a particular user
// // follow a user
// // un-follow a user

// module.exports = router;

const router = require('express').Router();
const User = require('../models/User');

// update user
router.put('/:id', async (req, res) => {
  if (req.body.userId === req.params.id || req.user.isAdmin) {
    if (req.body.password) {
      try {
        req.body.password = req.body.password;
      } catch (err) {
        return res.status(500).json(err);
      }
    }

    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json('Account updated');
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json('You can update only your account!');
  }
});

// delete user
router.delete('/:id', async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).json('Account deleted');
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json('You can delete only your account!');
  }
});

// get a user
router.get('/', async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;

  try {
    const user = userId 
      ? await User.findById(userId) 
      : await User.findOne({ username: username });
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});

// follow a user
router.put('/:id/follow', async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      // find the user with the id passed in the params of the request
      const user = await User.findById(req.params.id);
      // find the current user
      const currentUser = await User.findById(req.body.userId);
      // check if the current user is NOT already following the user
      if (!user.followers.includes(req.body.userId)) {
        // add the user to the current user's following list
        await user.updateOne({ $push: { followers: req.body.userId } });
        // add the current user to the user's followers list
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        // return a success message
        res.status(200).json('user has been followed and added to your following list');
      } else {
        // if the current user is already following the user, return an error
        res.status(403).json('you already follow this user');
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json('You cant follow yourself');
  }
});

// unfollow a user
router.put('/:id/unfollow', async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      // find the user with the id passed in the params of the request
      const user = await User.findById(req.params.id);
      // find the current user
      const currentUser = await User.findById(req.body.userId);
      // check if the current user is already following the user
      if (user.followers.includes(req.body.userId)) {
        // remove the user from the current user's following list
        await user.updateOne({ $pull: { followers: req.body.userId } });
        // remove the current user from the user's followers list
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        // return a success message
        res.status(200).json('user has been un followed and removed from your following list');
      } else {
        // if the current user is NOT already following the user, return an error
        res.status(403).json('You do not follow this user');
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json('You cant un follow yourself');
  }
});

// get the user's followed by a particular user
router.get('/followers/:userId', async (req, res) => {
  try {
    // find the user with the id passed in the params of the request
    const user = await User.findById(req.params.userId);

    // find the users that are in the user's followers list
    const followingUsers = await Promise.all(
      user.followings.map((following) => {
        return User.findById(following);
      })
    );

    // create a new array of users with only the id, username and profile picture
    let followingsList = [];
    // loop through the users and push the id, username and profile picture to the new array
    followingUsers.map((following) => {
      const { _id, username, profilePicture } = following;
      followingsList.push({ _id, username, profilePicture });
    });

    // return the new array
    res.status(200).json(followingsList);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;