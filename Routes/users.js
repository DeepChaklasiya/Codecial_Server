const router = require('express').Router();
const User = require('../Models/User');
const bcrypt = require('bcrypt');

router.get('/', async (req, res) => {
  const username = req.query.username;
  const userId = req.query.userId;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    if (!user) {
      return res.status(200).json(null);
    }
    const { password, updatedAt, ...temp } = user._doc;
    res.status(200).json(temp);
  } catch (err) {
    return res.status(505).json(err);
  }
});

router.get('/email', async (req, res) => {
  const email = req.query.email;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(200).json(null);
    }
    const { password, updatedAt, ...temp } = user._doc;

    res.status(200).json(temp);
  } catch (err) {
    return res.status(505).json(err);
  }
});

router.get('/editProfile', async (req, res) => {
  const username = req.query.username;
  const userId = req.query.userId;

  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    if (user === null) {
      return res.status(200).json('User not Found');
    }
    // const { password, updatedAt, ...temp } = user._doc;
    res.status(200).json(user);
  } catch (err) {
    return res.status(505).json(err);
  }
});

router.put('/:id', async (req, res) => {
  console.log('coming user', req.body);
  if (req.body._id === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).json(err);
      }
    }

    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json('Account has been updated');
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json('You can update only your account');
  }
});

router.delete('/:id', async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).json('Account has been deleted');
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json('You can delete only your account');
  }
});

router.put('/:id/follow', async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);

      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({
          $push: {
            followers: req.body.userId,
          },
        });

        await currentUser.updateOne({
          $push: {
            following: req.params.id,
          },
        });

        res.status(200).json('User has been followed');
      } else {
        res.status(403).json('You are already following this user');
      }
    } catch (err) {
      res.status(400).json(err);
    }
  } else {
    res.status(403).json('You cant follow yourself');
  }
});

router.put('/:id/unfollow', async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);

      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({
          $pull: {
            followers: req.body.userId,
          },
        });

        await currentUser.updateOne({
          $pull: {
            following: req.params.id,
          },
        });

        res.status(200).json('User has been unfollowed');
      } else {
        res.status(403).json('You are not following this user');
      }
    } catch (err) {
      res.status(400).json(err);
    }
  } else {
    res.status(403).json('You cant unfollow yourself');
  }
});

// Get User Friends
router.get('/friends/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId);
    const Friends = await Promise.all(
      user.following.map((friendId) => {
        return User.findById(friendId);
      })
    );
    let friendList = [];
    console.log('Friends', Friends);
    Friends.map((Friend) => {
      const { _id, username, profilePicture } = Friend;
      friendList.push({ _id, username, profilePicture });
    });
    res.status(200).json(friendList);
  } catch (err) {
    return res.status(505).json(err);
  }
});

router.get('/allUsers', async (req, res) => {
  try {
    const pattern = req.query.pattern;
    const allUsers = await User.find();
    const users = allUsers.filter((user) => {
      return user.username.includes(pattern);
    });
    res.status(200).json(users);
  } catch (err) {
    return res.status(505).json(err);
  }
});

module.exports = router;
