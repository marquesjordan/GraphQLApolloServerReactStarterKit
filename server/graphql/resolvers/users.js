const User = require('../../models/User');
const Message = require('../../models/User');
const { ApolloError } = require('apollo-server-errors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

module.exports = {
  Mutation: {
    async registerUser(_, { registerInput: { username, email, password } }) {
      // See if an old user exists with email attempting to register
      const oldUser = await User.findOne({ email });

      // Throw errot if thatr user exists
      if (oldUser) {
        throw new ApolloError(
          'A user is already registered with the email.',
          'USER_ALREADY_EXISTS',
        );
      }

      // Encript password
      var encryptedPassword = await bcrypt.hash(password, 10);

      // Build out mongoose model
      const newUser = new User({
        username: username,
        email: email.toLowerCase(),
        password: encryptedPassword,
      });

      // Create out JWT and attach to our User model
      //TOKEN_SECRET create a random string replace in ENV
      const token = jwt.sign(
        { user_id: newUser._id, email },
        process.env.TOKEN_SECRET,
        {
          expiresIn: '2h',
        },
      );

      //Save out user in MongoDB
      newUser.token = token;

      const res = await newUser.save();

      return {
        id: res.id,
        ...res._doc,
      };
    },
    async loginUser(_, { loginInput: { email, password } }) {
      // See if an user exists with the email
      const user = await User.findOne({ email });

      // Check if the entered password equals the encrypted password
      if (user && (await bcrypt.compare(password, user.password))) {
        // create a new token
        const token = jwt.sign(
          { user_id: user._id, email },
          process.env.TOKEN_SECRET,
          {
            expiresIn: '2h',
          },
        );

        // Attach token to user model that we found above
        user.token = token;

        return {
          id: user.id,
          ...user._doc,
        };
      }

      // If user doesn't exist, return error

      throw new ApolloError('Something went wrong, try again', 'LOGIN_FAIL');
    },
  },
  Query: {
    user: (_, { ID }) => User.findById(ID),
  },
};
