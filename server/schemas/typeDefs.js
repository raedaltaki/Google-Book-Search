// import the gql tagged template function
const { gql } = require('apollo-server-express');

// create our typeDefs
const typeDefs = gql`
    input bookInput 
    {
        bookId: ID
        authors: [String]
        description: String
        title: String
        image: String
        link: String
    }

    type User 
    {
        _id: ID
        username: String
        email: String
        bookCount: Int
        savedBooks: [Book]
    }

    type Book 
    {
        bookId: ID
        authors: [String]
        description: String
        title: String
        image: String
        link: String
    }

    type Auth 
    {
        token: ID!
        user: User
    }

    type Query 
    {
        me(username: String , _id: ID ): User
    }

    type Mutation 
    {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook(input: bookInput): User
        removeBook(bookId: ID!): User
    }
`;

// export the typeDefs
module.exports = typeDefs;