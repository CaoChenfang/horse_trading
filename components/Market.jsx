"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import EndGame from "./EndGame";
import { signOut } from "next-auth/react";
import NavBarUser from "./NavBarUser";

export default function Market() {

  const [price, setPrice] = useState();
  const [error, setError] = useState("");
  const [acceptError, setAcceptError] = useState("");
  const [gameData, setGameData] = useState();
  const [game, setGame] = useState();
  const { data: session } = useSession();
  const router = useRouter();
  const role = session?.user?.role
  const userEmail = session?.user?.email;
  //The first part is to connect to the server to get data;
   //Collect the game and game data to start with
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
      }, 0.1 * 1000);
        
    
      return () => clearInterval(interval)
        //getGameData();
    
      }, []);

  //Get the game status 
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

  //Get the market data

  const buyOrders = typeof(gameData) !== "undefined"? gameData.filter(x => x.status == "offered"&& x.type == "buyer") : "";
  const sellOrders = typeof(gameData) !== "undefined"? gameData.filter(x => x.status == "offered"&& x.type == "seller") : "";
  const max = typeof(game) !=="undefined" ? (game.length > 0? game[game.length - 1].max["$numberDecimal"]:0): 0;
  const min = typeof(game) !=="undefined" ? (game.length > 0? game[game.length - 1].min["$numberDecimal"]:0): 0;
  const multiplier = typeof(game) !=="undefined" ? (game.length > 0? game[game.length - 1].multiplier["$numberDecimal"]:0): 0;
  //console.log(buyOrders);
  //Get the userdata
  var userData = typeof(gameData) !== "undefined"? gameData.filter(x => x.email == userEmail) : [];
  console.log(userData);


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
   //Get the winner and and price 
   const getAgreedPrice = () => {
    if (typeof game !== 'undefined' && game.length > 0 ) {
      if(typeof (game[game.length - 1].agreedprice) !== 'undefined' && game[game.length - 1].agreedprice.length > 0) {
          const _game = game[game.length - 1].agreedprice;
          return _game.map((item,index)=><span key={JSON.stringify(index)}>{item['$numberDecimal']} </span>);
      } else {
        return <></>;
      }
     
    } else {
      return <></>;
    }
  }

  //handle market accept
  const handleMarketClick = async (_partyEmail) => {
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

    const partyEmail = _partyEmail;
    //Need to change to direct call to get data
    getGameData();    
    const partyData = typeof(gameData) !== "undefined"? gameData.filter(x => x.email == partyEmail) : [];
    var userData = typeof(gameData) !== "undefined"? gameData.filter(x => x.email == userEmail) : [];
    if (typeof(partyData) !== "undefined" && partyData.length> 0) {
        const status =  typeof(userData) !== "undefined"? (userData.length !==0 ?  userData[0].status :""): "";
        const partyStatus = typeof(partyData) !== "undefined"? (partyData.length !==0 ?  partyData[0].status :""): "";
        const agreedPrice = partyData[0].agreedprice['$numberDecimal'].toString();
        const partyType = partyData[0].type;
        const userType = userData[0].type;
        if(partyType==="buyer"&&userType==="buyer") {
            setAcceptError("Only sellers can accept buyer's order");
            return;
        }
        if(partyType==="seller"&&userType==="seller") {
            setAcceptError("Only buyers can accept seller's order");
            return;
        }
        if (status !== "available") {
          setAcceptError("You need to cancel the active order/contract to accept an order");
          return;
      }
        if (partyStatus !== "offered") {
            setAcceptError("Offer order is no longer available");
            return;
        }
    
       
        try {
            const res = await fetch('api/acceptOrder', {
                method: "POST",
                headers: {
                  "Content-type": "application/json"
                },
                body: JSON.stringify({userEmail, partyEmail, agreedPrice})
            });

            if (res.ok) {
              setAcceptError("");
            }
            
        } catch (error) {
            console.log("Error when submission:", error)
        }
    }
    
  }
    
//handle order cancellation
const handleCancelOrder = async() => {
    try {
        const res = await fetch('api/cancelOrder', {
            method: "POST",
            headers: {
              "Content-type": "application/json"
            },
            body: JSON.stringify({userEmail})
        });
        if (res.ok) {
          setAcceptError("");
        }
        
        

        
    } catch (error) {
        console.log("Error when submission:", error)
    }

}

//handle contract cancellation
const handleCancelContract = async() => {
    //need to change to direct call 
    if (typeof(userData) !== "undefined" && userData.length> 0) {
        const partyEmail = userData[0].tradingparty;
        try {
            const res = await fetch('api/cancelContract', {
                method: "POST",
                headers: {
                  "Content-type": "application/json"
                },
                body: JSON.stringify({userEmail, partyEmail})
            });

            if (res.ok) {
              setAcceptError("");
            }
            
            
    
            
        } catch (error) {
            console.log("Error when submission:", error)
        }

    }
   


}


//Rendering the user data
  const userOrder = () => {
    if (typeof(userData)!== "undefined"&& userData.length > 0) {
        if(userData[0].status == "available") {
            return (
            <div>
                <h1 className="text-xl font-bold my-4">Active order</h1>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">You do not have any active order or contract</div>

            </div>)
        }
        if(userData[0].status == "offered") {
            return (
            <div>
                <h1 className="text-xl font-bold my-4">Active order</h1>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="table-auto border-collapse border border-slate-400 w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className=" text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th className="border border-slate-300 px-6 py-3" >Type</th>                
                      <th className="border border-slate-300 px-6 py-3" >Price</th>
                      <th className="border border-slate-300 px-6 py-3" >Potential surplus</th>
                      <th className="border border-slate-300 px-6 py-3" >Status</th>
                      <th className="border border-slate-300 px-6 py-3" ></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                        <td className="border border-slate-300 px-6 py-3">{userData[0].type}</td>
                        <td className="border border-slate-300 px-6 py-3">{userData[0].agreedprice['$numberDecimal'].toString()}</td>
                        <td className="border border-slate-300 px-6 py-3">{renderUserType()==="buyer" ? userData[0].valuation['$numberDecimal'] - userData[0].agreedprice['$numberDecimal']: userData[0].agreedprice['$numberDecimal'] - userData[0].valuation['$numberDecimal'] }</td>
                        <td className="border border-slate-300 px-6 py-3">{userData[0].status}</td>
                        <td className="border border-slate-300 px-6 py-3">
                        <button className="bg-green-600 text-white font-bold cursor-pointer px-6 py-2" onClick={handleCancelOrder}>
                             Cancel 
                          </button>
                          
                        </td>
                    </tr>
                  </tbody>
                </table>
              </div>                 
            </div>)
        }
        if(userData[0].status == "contracted") {
            return (
            <div>
                <h1 className="text-xl font-bold my-4">Active order</h1>
                 <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="table-auto border-collapse border border-slate-400 w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className=" text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th className="border border-slate-300 px-6 py-3" >Type</th>                
                      <th className="border border-slate-300 px-6 py-3" >Price</th>
                      <th className="border border-slate-300 px-6 py-3" >surplus</th>
                      <th className="border border-slate-300 px-6 py-3" >Status</th>
                      <th className="border border-slate-300 px-6 py-3" >Party</th>
                      <th className="border border-slate-300 px-6 py-3" ></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                        <td className="border border-slate-300 px-6 py-3">{userData[0].type}</td>
                        <td className="border border-slate-300 px-6 py-3">{userData[0].agreedprice['$numberDecimal'].toString()}</td>
                        <td className="border border-slate-300 px-6 py-3">{renderUserType()==="buyer" ? userData[0].valuation['$numberDecimal'] - userData[0].agreedprice['$numberDecimal']: userData[0].agreedprice['$numberDecimal'] - userData[0].valuation['$numberDecimal'] }</td>
                        <td className="border border-slate-300 px-6 py-3">{userData[0].status}</td>
                        <td className="border border-slate-300 px-6 py-3">{userData[0].tradingparty.slice(0,7)}</td>
                        <td className="border border-slate-300 px-6 py-3">
                        <button className="bg-green-600 text-white font-bold cursor-pointer px-6 py-2" onClick={handleCancelContract}>
                             Cancel 
                          </button>
                         
                        </td>
                    </tr>
                  </tbody>
                </table>
              </div>       
                
            </div>)
        }
    }
  }
  //Rendering the active orders
  const activeMarket = (orders, _type) => {
    if (typeof(orders) !== "undefined") {
        if (orders.length > 0) {
            return (
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="table-auto border-collapse border border-slate-400 w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className=" text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>                
                      <th className="border border-slate-300 px-6 py-3" colspan="3">{_type} Offers</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                        <td className="border border-slate-300 px-6 py-3">User</td>
                        <td className="border border-slate-300 px-6 py-3">Price</td>
                        <td className="border border-slate-300 px-6 py-3"></td>
                    </tr>

                    {orders.map((item,index)=> {
                      return (
                        <tr  key={JSON.stringify(index)}>                   
                          <td className="border border-slate-300 px-6 py-3">{ item.email.slice(0,4) }***</td>                        
                          <td className="border border-slate-300 px-6 py-3">{ item.agreedprice['$numberDecimal'].toString()}</td>          
                          <td className="border border-slate-300 px-6 py-3">
                          <button className="bg-green-600 text-white font-bold cursor-pointer px-6 py-2" onClick={() => {
                                handleMarketClick(item.email);
                          }}>
                             Accept 
                          </button> 
                                                
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>               
                
                
            )

        } else {
            return (<>No active order</>);
        }
    } else {
        return (<>No active order</>);
    }
  }
  //Handle the submission button
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    //Require all field filled
    if (!price) {
        setError("All fields neccessary");
        return;
    }
    //Check the existing order
    const status =  typeof(userData) !== "undefined"? (userData.length !==0 ?  userData[0].status :""): "";
    if (status !== "available") {
        setError("You have active order/contract");
        return;
    }

    try {
        
    } catch (error) {
        console.log("Error when submission:", error)
    }
    
   try {
        const res = await fetch('api/submitPrice', {
          method: "POST",
          headers: {
            "Content-type": "application/json"
          },
          body: JSON.stringify({userEmail, price})
      });
     
      if (res.ok) {
          const form = e.target;
          form.reset();
          setError("");
          
          //router.push("/");
      } else {
          console.log("Submission failed")
      }
         
      } catch (error) {
        console.log("Error when submission:", error)
      }
  
      
    }   
  ;
   //Render the instruction for each type of game
   const renderInstruction = () => {
    
    return (<div className="mx-24 bg-green-200">
      <h3 className="mb-3 text-xs font-extrabold leading-none tracking-tight text-gray-900 md:text-xl lg:text-6xl dark:text-white">Instructions</h3>
      <p className="p-4 text-left">
      You need to register as an active user. Upon registering, the system will randomly assign <br />
      you a valuation and your role. There are 2 roles: buyer and seller. A seller can submit a sell<br /> 
      order or accept an active buy order while a buyer can submit a buy order or accept an active      
      <br /> 
      sell order.             
      </p>
    </div>);    
}
  //Render usertype and valuation
  const renderUserType = () => {
    if (typeof(userData)==="undefined") {
        return "";
    } 
    if (userData.length === 0) {
        return "";
    }
    return userData[0].type;
  }
  const renderUserValuation = () => {
    if (typeof(userData)==="undefined") {
        return "";
    } 
    if (userData.length === 0) {
        return "";
    }
    var userValuation = Math.round(userData[0].valuation['$numberDecimal']*100)/100
    return userValuation.toString();
  }
  //Render the form and public info

  const renderForm = () => {    
    return (
      <div>
        <NavBarUser />
        <div className="grid place-items-center h-screen">
        <div className="py-8 text-xl">
          Welcome {userEmail}. {isactive() ==="active" ? `You are a ${renderUserType()} and your valuation is ${renderUserValuation()}`:""}
        </div>
        <div>
          {renderInstruction()}          
        </div>
        <h1 className="text-xl font-bold my-4 py-4">MARKET</h1>
          {isactive() ==="active" ? (
        <div className="grid place-items-center h-screen">
        <div className="flex flex-row py-16">
        
        <div className="pr-4">
            {activeMarket(buyOrders, "Buy")}   
        </div>
        <div className="pl-4">
            {activeMarket(sellOrders, "Sell")}   
        </div>  
                
    </div>
    <div className="place-items-center">
        {acceptError && (
                <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
                {acceptError}
                </div>
            )}             
        </div>   
    <div className="grid grid-cols-2 gap-4 py-16">
        <div className="shadow-lg p-5 rounded-lg border-t-4 border-green-200">
        <h1 className="text-xl font-bold my-4">Submit your order</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <fieldset>
                <legend>Choose the price</legend>                
                <input
            onChange={(e) => setPrice(e.target.value)}
            type="number"                
            min={0}
            max={max*multiplier}
            step="any"                
            placeholder="Enter your price"
            
        />   
            </fieldset>          
        <button className="bg-green-600 text-white font-bold cursor-pointer px-6 py-2">
            Submit
        </button>
        {error && (
            <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
            {error}
            </div>
        )}
        </form>
    </div>

    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        {userOrder()}
    </div>

</div>
</div>): 
<div className="text-xl"> There is no active game to play 
<div className="grid place-items-center p-20">The game&apos;winner is {getWinner()}  <br />
    The agreed price bid is {getAgreedPrice()}.</div>
</div>
}
 
    </div>
  </div> );
  }

  return (
    <div> 
      {role ==='admin'? <EndGame /> : renderForm()}
    </div>
  );
}