const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = 
{
    Query: 
    {
        // thoughts: async (parent, { username }) => 
        // {
        //     const params = username ? { username } : {};
        //     return Thought.find(params).sort({ createdAt: -1 });
        // },
        // // place this inside of the `Query` nested object right after `thoughts` 
        // thought: async (parent, { _id }) => 
        // {
        //     return Thought.findOne({ _id });
        // },

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
        },
        // get all users
        // users: async () => 
        // {
        //     return User.find()
        //     .select('-__v -password')
        //     .populate('friends')
        //     .populate('thoughts');
        // },
        // // get a user by username
        // me: async (parent, params) => 
        // {
        //     return User.findOne({
        //         $or: [{ _id: user ? user._id : params.id }, { username: params.username }],
        //     })
        //     .select('-__v -password')
        //     // .populate('friends')
        //     // .populate('thoughts');
        // },
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

        // addThought: async (parent, args, context) => 
        // {
        //     if (context.user) 
        //     {
        //         const thought = await Thought.create({ ...args, username: context.user.username });
            
        //         await User.findByIdAndUpdate(
        //             { _id: context.user._id },
        //             { $push: { thoughts: thought._id } },
        //             { new: true }
        //         );
            
        //         return thought;
        //     }
          
        //     throw new AuthenticationError('You need to be logged in!');
        // },

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