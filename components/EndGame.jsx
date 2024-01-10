"use client";
import  NavBar  from "@/components/NavBar";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import ScatterChart from "./ScatterChart";

import { signOut } from "next-auth/react";
import HistogramChart from "./HistogramChart";

export default function EndGame() {

  const [error, setError] = useState("");
  const [game, setGame] = useState();
  const [gameData, setGameData] = useState();
  const { data: session } = useSession();
  const router = useRouter();

  const useremail = session?.user?.email;
  //The first part is to connect to the server to find out the active game.
  //Get the last game and check the game status
 
  
  //Collect the game and game data to start with
  useEffect( () => {
    async function getGameData() {
      try {
        const res = await fetch('api/getHorseGameData', {
          method: "POST",
          headers: {
            "Content-type": "application/json"
          },
        });
        
        if (res.ok) {
          const resData = await res.json();
          if (typeof resData !== 'undefined' && resData.length > 0 ) {
            setGameData(resData);
          }
          
        }    
      } catch (err) {
        console.error(err);
      }
    
    }

    async function getGame() {
      try {
        const res = await fetch('api/getHorseGame', {
          method: "POST",
          headers: {
            "Content-type": "application/json"
          },
        });
        
        if (res.ok) {
          const resData = await res.json();
          if (typeof resData !== 'undefined' && resData.length > 0 ) {
            setGame(resData);
          }
          
        }    
      } catch (err) {
        console.error(err);
      }
    
    }
    getGameData();  
    getGame();

    //async function getGameData() {
     // const res = await fetch('api/getGameData');
     // const resgameData = await res.json();
     // setGameData(resgameData);
   // }
   const interval = setInterval(async () => {
   
    await getGameData();
    await getGame();
  }, 5 * 1000);
    

  return () => clearInterval(interval)
    //getGameData();

  }, []);

  //Check game status 
  const isactive = () => {
    if (typeof(game) !=="undefined") {
      if (game.length > 0) {
        return game[game.length - 1].isactive;
      } else {
        return "ended";
      }
    } else {
        return "ended";
    }
  }  
  //print the game data
  const marketData = (_gameData, _type) => {
    if (typeof(_gameData) !== "undefined") {
      if (_gameData.length > 0) {
        const _sellerList = _gameData.filter(x => x.type == _type);
        const sellerList = _sellerList.map(item => item.valuation['$numberDecimal']);
        if (_type ==="seller") {
          sellerList.sort((a,b) => a-b);
          
        } else {
          sellerList.sort((a,b) => a-b).reverse();
        }
        const cumSellerList = sellerList.map((item,index) => { return {"x": parseFloat(item), "y": index + 1,};})
        
        return cumSellerList;
      } else {
        return [];
      }

    } else {
      return [];
    }
  }
  //Get unique contracted agreements
  const getUniqueContract = (_gameData) => {
    var simplifiedGameData = typeof(_gameData) !== "undefined"? _gameData.filter(x => x.status == "contracted") : [];
    var arr = simplifiedGameData.map(item => {return {
      partyA: item.email >= item.tradingparty ? item.email: item.tradingparty,
      partyB: item.email <= item.tradingparty ? item.email: item.tradingparty,
      agreedprice: item.agreedprice["$numberDecimal"],
    }});
    var uniqueContract =  arr.filter((arr, index, self) =>
    index === self.findIndex((t) => (t.partyA === arr.partyA && t.partyB === arr.partyB)))
;
    return uniqueContract;
  }
  console.log(getUniqueContract(gameData));
  const agreedPriceList = getUniqueContract(gameData).map(item => item.agreedprice);
  //Get winners
  const calculateWinner = (_gameData) => {
    var simplifiedGameData = typeof(_gameData) !== "undefined"? _gameData.filter(x => x.status == "contracted") : [];
    var surplusList = simplifiedGameData.map(item => item.type ==="buyer" ? item.valuation['$numberDecimal'] - item.agreedprice['$numberDecimal']: item.agreedprice['$numberDecimal'] - item.valuation['$numberDecimal'] );
    const maxSurplus = Math.max(...surplusList);
    const index = surplusList.map( (x,index) => { if(x === maxSurplus) return index}).filter(item => item !== undefined);
    const _winnerList = simplifiedGameData.filter((el,i) => index.some(j => i === j));
    const _winnerEmail = _winnerList.map(item => item.email);
    const _winnerPrice = _winnerList.map(item => item.agreedprice);
    if (maxSurplus > 0) {
      return {
        userwinner: _winnerEmail, 
        winnerprice: _winnerPrice,
        usersurplus: maxSurplus,
      }    
    } else {
      return {
        userwinner: "", 
        winnerprice: [],
        usersurplus: 0,
      }
    }    
  }
  //Get the winner list
  const {userwinner, winnerprice,usersurplus} = calculateWinner(gameData);
  //console.log(userwinner)
  //get max. min
  const maxVal = typeof(game) !=="undefined" ? (game.length > 0? game[game.length - 1].max["$numberDecimal"]:0): 0;
  const minVal = typeof(game) !=="undefined" ? (game.length > 0? game[game.length - 1].min["$numberDecimal"]:0): 0;
  const multiplier = typeof(game) !=="undefined" ? (game.length > 0? game[game.length - 1].multiplier["$numberDecimal"]:0): 0;
  //Get the winner and and price 
  const getWinner = () => {
    if (typeof game !== 'undefined' && game.length > 0 ) {
      if(typeof (game[game.length - 1].winner) !== 'undefined' && game[game.length - 1].winner.length > 0) {
          const _game = game[game.length - 1].winner;
          return _game.map((item,index)=><span key={JSON.stringify(index)}>{item} </span>);
      } else {
        return <></>;
      }
     
    } else {
      return <></>;
    }
  }
  //Get the agreed price
  const getAgreedPrice = () => {
    if (typeof game !== 'undefined' && game.length > 0 ) {
      if(typeof (game[game.length - 1].agreedprice) !== 'undefined' && game[game.length - 1].agreedprice.length > 0) {
          const _game = game[game.length - 1].agreedprice;    
          return _game.map((item,index)=><span key={JSON.stringify(index)}>{item['$numberDecimal']} </span>);;
      } else {
        return <></>;
      }
     
    } else {
      return <></>;
    }
  }
  //Handle the submission button
  const handleSubmit = async () => {
      try {
      const res = await fetch('api/endGame', {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({userwinner, winnerprice, usersurplus})
    });   
    if (res.ok) {
       
        setError("");
        
        //router.push("/");
    } else {
        console.log("Submission failed")
    }
      
    } catch (error) {
      console.log("Error when submission:", error) 
    }
   
  };
  //Render the form 

  const renderForm = () => {
    
    return (
      isactive() === 'active'? <div className="grid place-items-center h-screen">
       
      <div >                   
          <button onClick={handleSubmit} className="bg-green-600 text-white font-bold cursor-pointer px-2 py-2">
            End the game
          </button>
          {error && (
            <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
              {error}
            </div>
          )}     
      </div>
     
    </div> : <div className="grid place-items-center p-20 text-xl">The game&apos;winner is  {getWinner()} <br />
    The agreed price is {getAgreedPrice()}
    </div>
    );
  }
  return (
    <div> 
     
         <NavBar />
         <div className="grid place-items-center p-10">
          <h1 className="font-semibold text-xl"> Welcome {useremail} to game management portal !</h1>
         
        
        </div>
        <div className="grid place-items-center">
          <p className="py-6 text-xl">The valuation based demand and supply chart </p>
          
            <ScatterChart data01={marketData(gameData, "buyer")} data02={marketData(gameData, "seller")}/>
          
            <p className="py-6 text-xl"> Traded price histogram chart </p>
          <HistogramChart props = {agreedPriceList} max = {maxVal*multiplier + 1} min = {minVal}/>
          <div className="py-6 text-xl">
        {isactive()==="active" ? "The game is active":"There is no active game to play"}
        </div>
          {renderForm()}
        </div> 
        
    
      
    </div>
    
  );
}