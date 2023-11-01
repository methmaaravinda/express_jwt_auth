const whiteList=["http://localhost:3001", "http://192.168.8.119:3001"];
const corsOpt={
    origin:( origin, callBack )=>{
        if(whiteList.indexOf(origin)!=-1){
            callBack(null, true)
        }else{
            callBack(new Error("not allowed by cors ! "))
        }
    },
    credentials: true,
}

module.exports=corsOpt;