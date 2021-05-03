const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = 
{
    Query: 
    {
        me: async (parent, args, context) => 
        {
            if (context.user) 
            {
                const userData = await User.findOne({ _id: context.user._id })
                    .select('-__v -password')
                    // .populate('books')
            
                return userData;
            }
            
            throw new AuthenticationError('Not logged in');
        }
    },
    Mutation: 
    {
        addUser: async (parent, args) => 
        {
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user };
        },

        login: async (parent, { email, password }) => 
        {
            const user = await User.findOne({ email});
          
            if (!user) 
            {
                throw new AuthenticationError("Can't find this user");
            }
          
            const correctPw = await user.isCorrectPassword(password);
          
            if (!correctPw) 
            {
                throw new AuthenticationError('Wrong password!');
            }
          
            const token = signToken(user);
            return { token, user };
        },

        saveBook: async (parent , body, context) => 
        {
            if (context.user) 
            {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: body.input } },
                    { new: true, runValidators: true }
                );
            
                return updatedUser;
            }
          
            throw new AuthenticationError('You need to be logged in!');
        },
        removeBook: async (parent , body , context) => 
        {
            if (context.user) 
            {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: body } },
                    { new: true, runValidators: true }
                );
            
                return updatedUser;
            }
          
            throw new AuthenticationError('You need to be logged in!');
        },
        
    }
};
  
module.exports = resolvers;