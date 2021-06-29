const { buildSchema } = require("graphql");

module.exports = buildSchema(`
    type Location {
        name:String!, 
          status: String,
          address: String,
          lat: String!,
          long: String!,
          rating: String,
          totalreview: String,
          type1: String!,
          type2: String,
          type3: String,
          phone: String,
          ggmapurl: String,
          website: String,
          open0: String,
          close0: String,
          timetext0: String,
          open1: String,
          close1: String,
          timetext1: String,
          open2: String,
          close2: String,
          timetext2: String,
          open3: String,
          close3: String,
          timetext3: String,
          open4: String,
          close4: String,
          timetext4: String,
          open5: String,
          close5: String,
          timetext5: String,
          open6: String,
          close6: String,
          timetext6: String,
          pricelevel: String,
          finaltype: String!,
    }
    type Top {
        top:[Location]
    }
    type Distance{
        from:String
        to:String
        duration:String
        distance:String
    }
    type AuthData {
        token: String!
        userId: String!
    }
    type RootQuery {
        getsim(name:String,len:Int):[Location]
        getinfo(selected:[String]):[Location ]
        getallinfo:[Location]
        getduration(selected:[String]):[Distance]
        login(email: String!, password: String!): AuthData!
       
    }
    type Rootmutation{
        createuser(email:String password:String):Int

    }

 
    schema {
        query: RootQuery
        mutation:Rootmutation 
    }
`);

// {
//     "query": "{ getsim(id:1){top{name finaltype}}}"
// }
// type RootMutation {
//     createUser(userInput: UserInputData): User!
//     createPost(postInput: PostInputData): Post!
//     updatePost(id: ID!, postInput: PostInputData): Post!
//     deletePost(id: ID!): Boolean
//     updateStatus(status: String!): User!
// }

// type AuthData {
//     token: String!
//     userId: String!
// }

// type PostData {
//     posts: [Post!]!
//     totalPosts: Int!
// }
// type Hello {
//     text:String!
// }

// input UserInputData {
//     email: String!
//     name: String!
//     password: String!
// }

// input PostInputData {
//     title: String!
//     content: String!
//     imageUrl: String!
// }
