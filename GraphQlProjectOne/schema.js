// graphq için sema işlemlerini bu dosyada yapıcaz. graphql e özgü querryler mutasyonlar ve nesneler olusmaya baslayacak.
// querry ile sorgulama oluscka mutaion ile de sorgu olusturucaz.


//graphql içerisindeki nesnelerin importu yapılacak o yuzden nesne halinde almamız gerekiyor
// axios json dan veri cekebilmek icin
const axios=require('axios');
const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLID,
    GraphQLUnionType
}=require('graphql');


// Data.json dan alacağımız için bunlara ihtiyacımız kalmadı
/*var personeller=[
    {id:'1',isim:'Ali',yas:45,email:'ali@google.com'},
    {id:'2',isim:'Fatih',yas:23,email:'fatih@google.com'},
    {id:'3',isim:'Mehmet',yas:25,email:'mehmet@google.com'},
    {id:'4',isim:'Mert',yas:15,email:'mert@google.com'}

]*/

// Personel tiplerini olusturucaz nesneler halinde.. Root tiplerine ihtiyacımız var 
const PersonelType= new GraphQLObjectType({
    name:'Personel',
    fields: ()=>({
        id:{type:GraphQLID},
        isim:{type:GraphQLString},
        email:{type:GraphQLString},
        yas:{type:GraphQLInt}
    })


    
});

// arg ı tek bir sey cagirmamiz gerektiginde kullanıyoruz
//Route querry tüm querryleri çalıştıran queerydir Personelleri getirme querry sini olıusturucaz
const RootQuery=new GraphQLObjectType({
    name:'RootQuerry',
    fields:{
        personel:{
            type:PersonelType,
            args:{id:{type:GraphQLString}},
            resolve(parent,args){ //dogru erisim ile verilere resolvedan erisilir.
                //veriye erisim olmalı resolve ile istediğimiz sonucları dondururuz
                // Data .json kullanıcaz bunlara gerek kalmadı 
                /*for(let i=0;i<personeller.length;i++){
                    if(personeller[i].id==args.id){
                        return personeller[i];
                    }

                }*/

                return axios.get('http://localhost:3000/personeller/'+args.id).
                then(res=>res.data);
                // return yaptığımız için graphql ile kullanılabilir.


            }
        },
        // Tum personelleri getirebilir
        personeller:{
            type:GraphQLList(PersonelType),
            resolve(parent,args){ 
                
                return axios.get('http://localhost:3000/personeller').
                then(res=>res.data);


                // Tum personeller getirir
                //return personeller
                }
            }
        }
    });

    // veri eklemek silmek guncellemek icin mutoitonlar olusturulur
    const mutation=new GraphQLObjectType({
        name:"Mutation",
        fields:{
            personelekle:{
                type:PersonelType,
                args:{
                    //arg ile isim email ve yas tiplerini argument ettik
                    id:{type:new GraphQLNonNull(GraphQLString)},
                    isim:{type:new GraphQLNonNull(GraphQLString)},
                    email:{type: new GraphQLNonNull(GraphQLString)},
                    yas:{type:new GraphQLNonNull(GraphQLInt)}
                },
                resolve(parent,args){
                    //post ediyoruz ve ekliyoruz post ettigimiz verilerin degerlerini isim, email ve yas degerlerini argumendan 
                    return axios.post('http://localhost:3000/personeller',{
                        id:args.id,
                        isim:args.isim,
                        email:args.email,
                        yas:args.yas
                    }).then(res=>res.data);
                }
            },
            personelSil:{
                type:PersonelType,
                args:{
                    id:{type:new GraphQLNonNull(GraphQLString)}
                },
                resolve(parent,args){
                    return axios.delete('http://localhost:3000/personeller/'+args.id).
                    then(res=>res.data);
                }
            },
            personelguncelle:{
                type:PersonelType,
                args:{
                    //new etiketi koymazsak zorunlu olur
                    id:{type:new GraphQLNonNull(GraphQLString)},
                    isim:{type: GraphQLString},
                    email:{type:  GraphQLString},
                    yas:{type: GraphQLNonNull(GraphQLInt)}
                },
                resolve(_,args){

                    return axios.patch('http://localhost:3000/personeller/'+args.id,args).
                    then(res=>res.data);
                }
            }
        }

    })

// RootQuerry ile birden fazla querry eerişebiliriz.-
module.exports=new GraphQLSchema({
    query:RootQuery,
    mutation:mutation
})