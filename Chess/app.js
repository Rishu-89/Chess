let express=require('express');
const socket=require('socket.io');
let http=require('http');
let {Chess}=require('chess.js')
let path=require("path");



let app=express();

let server=http.createServer(app);

let io=socket(server);




let chess=new Chess();

let players={};

let currentPlayer="w";





app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,'public')));




app.get('/',(req,res)=>{
  res.render("start",{title:"chess Game"});
})



app.post('/start',(req,res)=>{
  res.redirect('/game');
})



app.get('/game',(req,res)=>{
  res.render("index",{title:"chess Game"});
})




io.on("connection", function(uniquesocket){



  if(!players.white){
    players.white=uniquesocket.id;
    uniquesocket.emit("playerRole","w");
  }
  else if(!players.black){
    players.black=uniquesocket.id;
    uniquesocket.emit("playerRole","b");
  }
else{
  uniquesocket.emit("spectatorRole");
}


uniquesocket.on("disconnect",()=>{
  if(uniquesocket.id===players.white){
    delete players.white;
  }
  else if(uniquesocket.id===players.black){
    delete players.black;
  }
});




uniquesocket.on("move",(move)=>{
  try{
    if(chess.turn()==="w" && uniquesocket.id!= players.white)return;
    if(chess.turn()==="b" && uniquesocket.id!= players.black)return;

    const result=chess.move(move);
    if(result){
      currentPlayer=chess.turn();
      io.emit("move",move);
      io.emit("boardState",chess.fen());
    }
    else{
      console.log("Invalid move",move);
      uniquesocket.emit("invalidMove",move);
    }
  }
  catch(err){
    console.log(err);
    uniquesocket.emit("invalid move :",move);
  }
})


});







server.listen(3000);