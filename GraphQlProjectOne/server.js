const express= require('express');
// graphql i middleware olarak kurduk.
const {graphqlHTTP}=require('express-graphql');
const app=express();
const myGraphqlSchema=require('./schema');

// MiddleWare Olusturduk istege gönderi atıcak graphqlHttp ile nesne olusturduk ve icerisine elemanlar ekledik
// graphqlschemanın tanınmasını için export yapılması gerekiyr.

app.use('/graphql',graphqlHTTP({

    schema: myGraphqlSchema,
    graphiql:true

}))


app.listen(4000,()=>{
    console.log('server 4000.portta calisiyor');
});