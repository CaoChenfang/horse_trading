"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import EndGame from "./EndGame";
import { signOut } from "next-auth/react";

export default function SubmitBid() {

  const [userbid, setBid] = useState();
  const [error, setError] = useState("");
  const [game, setGame] = useState([{ winner: [],
  maxnumbid: 0,
  gamelength: 0,
  gametype: 'public',
  isactive:'ended'}]);
  const [gameData, setGameData] = useState([]);
  const { data: session } = useSession();
  const router = useRouter();
  const [submissionTime, setSubmissionTime] = useState(Date.now());
  const role = session?.user?.role
  const useremail = session?.user?.email;
  //The first part is to connect to the server to find out the active game.
  //Get the last game and check the game status
 
  
  //Collect the game and game data to start with
  useEffect( () => {
    async function getGame() {
      try {
        const res = await fetch('api/getGame', {
          method: "POST",
          headers: {
            "Content-type": "application/json"
          },
        });
        
        if (res.ok) {
          const resData = await res.json();
          setGame(resData)
        }    
        
      } catch (err) {
        console.error(err);
      }     
    
    }
    async function getGameData() {
      try {
        const res = await fetch('api/getGameData', {
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
    getGameData();
    getGame();

    //async function getGameData() {
     // const res = await fetch('api/getGameData');
     // const resgameData = await res.json();
     // setGameData(resgameData);
   // }
   const interval = setInterval(async () => {
    await getGame();
    await getGameData();
  }, 5 * 1000);
    

  return () => clearInterval(interval)
    //getGameData();

  }, []);
  

 
  //Get the status of the game
  const isactive = () => {
    if (typeof game !== 'undefined' && game.length > 0 ) {
      return game[game.length - 1].isactive;
    } else {
      return 'ended';
    }
  }
  console.log(isactive());
  //Get the max number of bid
  const maxnumbid = () => {
    if (typeof game !== 'undefined' && game.length > 0 ) {
      return game[game.length - 1].maxnumbid;
    } else {
      return 0;
    }
  }

  //Get the type of the game
  const gametype = () => {
    if (typeof game !== 'undefined' && game.length > 0 ) {
      return game[game.length - 1].gametype;
    } else {
      return "";
    }
  }
  //Get the average winning bid 
  const gameAverageBid = () => {
    if (typeof game !== 'undefined' && game.length > 0 ) { 
      if (typeof ( game[game.length - 1].useraveragebid)!== 'undefined') {
        return game[game.length - 1].useraveragebid['$numberDecimal'].toString();     
      }
    
         
     
    }   return ""; }
  //Get the winner 
  const getWinner = () => {
    if (typeof game !== 'undefined' && game.length > 0 ) {
      if(typeof (game[game.length - 1].winner) !== 'undefined' && game[game.length - 1].winner.length > 0) {
          const _game = game[game.length - 1].winner;
          return _game.map((item,index)=><span key={JSON.stringify(index)}>{item}, </span>);
      } else {
        return <></>;
      }
     
    } else {
      return <></>;
    }
  }
  //Get the game data of the current player
  const userGameData = () => {
    if (typeof gameData !== 'undefined' && gameData.length > 0 ) {
     const data = gameData.filter((item)=>item.email===useremail);
    if (typeof data!== 'undefined'&&data.length > 0) {
      return data[0];
    } else {
      return {
        email: useremail,
        bid: [],
      } ;
    }
    } else {
      return {
        email: useremail,
        bid: [],
      } ;
    }
  }
  console.log(userGameData());
  //Render the public information 
  const renderPublicInfo = (_gameData) => {
    if (_gameData.length > 0) {
      if(_gameData[0].bid.length > 0) {
        return ( <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="table-auto border-collapse border border-slate-400 w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className=" text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>                
              <th className="border border-slate-300 px-6 py-3">Student ID</th>
              <th className="border border-slate-300 px-6 py-3">5 Latest Bids</th> 
              <th className="border border-slate-300 px-6 py-3">Latest Bid</th>      
              <th className="border border-slate-300 px-6 py-3">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {_gameData.map((item,index)=> {
              return (
                <tr  key={JSON.stringify(index)}>                   
                  <td className="border border-slate-300 px-6 py-3">{ item.email.slice(0,3) }***</td>
                  <th className="border border-slate-300 px-6 py-3">{item.bid.length === 1? <span></span>: item.bid.slice(Math.max(item.bid.length-6,0), -1).map((usernumber,index)=>{
                        return (
                          <span key={JSON.stringify(index)} className="line-through lowercase font-light">{usernumber['$numberDecimal'].toLocaleString()}, </span>
                          
                        )
                      }) 
                    
                  }</th> 
                  <td className="border border-slate-300 px-6 py-3">{ item.bid[item.bid.length - 1]['$numberDecimal'].toLocaleString()}</td>          
                  <td className="border border-slate-300 px-6 py-3">{ item.updated.slice(11,23) }</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
        
      )

      }
       
    }
  }
  //Handle the submission button
  const handleSubmit = async (e) => {
    e.preventDefault();
   
    if (userbid < 0 || userbid> 100) {
      setError("Error bid");
      return;
    }
    if (!useremail || !userbid) {
      setError("You need all fields to submit");
      return;
    }

    const userNumBid = (typeof userGameData().bid === 'undefined')? 0: userGameData().bid.length;
    if (userNumBid>=maxnumbid()) {
      
      setError("You have exceeded the number of bids");
      return;
    }

    if( (Date.now()-submissionTime)/1000 < 10) {
      setSubmissionTime(Date.now());  
      setError("Only allow to submit one number in 10 seconds. Try again in 10 seconds");
      
    } else {
      try {
        const res = await fetch('api/submitBid', {
          method: "POST",
          headers: {
            "Content-type": "application/json"
          },
          body: JSON.stringify({useremail, userbid})
      });
      setSubmissionTime(Date.now());   
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

   
  };
  //Render the instruction for each type of game
  const renderInstruction = () => {
    if (gametype()==="private") {
      return (<div class="mx-24 bg-green-200">
        <h3 class="mb-3 text-xs font-extrabold leading-none tracking-tight text-gray-900 md:text-xl lg:text-6xl dark:text-white">Instructions</h3>
        <p class="p-4 text-left">
        Currently, the private game is active. The students can choose to submit any number between 0 and 100 . <br />
        The maximum number of submission is {maxnumbid()}. Only 1 submission is allowed in 10 seconds. <br />
        The winners are those with their numbers closest to 0.75 of the average submitted number.
        <br />
        In case of multiple winners, a reward is shared among winners.
        </p>
      </div>)
    }
    if (gametype()==="public") {
      return (<div class="mx-24 bg-green-200">
        <h3 class="mb-3 text-xs font-extrabold leading-none tracking-tight text-gray-900 md:text-xl lg:text-6xl dark:text-white">Instructions</h3>
        <p class="p-4 text-left">
        Currently, the public game is active. The students can choose to submit any number between 0 and 100 . <br />
        The students can see other students numbers and change their numbers
        <br />
        The maximum number of submission is {maxnumbid()}. Only 1 submission is allowed in 10 seconds. <br />
        The winners are those with their numbers closest to 0.75 of the average submitted number.
        <br />
        In case of multiple winners, a reward is shared among winners.
        </p>
      </div>)
    }
  }
  //Render the form and public info

  const renderForm = () => {
    const userNumBid = (typeof userGameData().bid === 'undefined')? 0: userGameData().bid.length;
    return (
      isactive() === 'active'? <div>
        <nav className="bg-white border-gray-200 dark:bg-gray-900 border-t dark:border-gray-600 border-b-2" >
  <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-10">
    <a href="./" className="flex items-center space-x-3 rtl:space-x-reverse">
        <img src="/beauty-contest.svg" width="100" height="600" className="h-8" alt="Econ Logo" />
        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"></span>
    </a>
    <button data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
        <span className="sr-only">Open main menu</span>
        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
        </svg>
    </button>
    <div className="hidden w-full md:block md:w-auto" id="navbar-default">
      <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
       
        <li>
        <div>
        <button
          onClick={() => {
            signOut({ redirect: false }).then(() => {
                router.push("/"); // Redirect to the dashboard page after signing out
            });
        }}
          className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
        >
          Log Out
        </button>
      </div>
        </li>
      </ul>
    </div>
  </div>
</nav>

        <div className="grid place-items-center h-screen">
        <div>
          Welcome {useremail}. You have submitted {userNumBid} times.
        </div>
        <div>
          {renderInstruction()}
        </div>
      <div className="shadow-lg p-5 rounded-lg border-t-4 border-green-400">
        <h1 className="text-xl font-bold my-4">Bid Submission</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            onChange={(e) => setBid(e.target.value)}
            type="number"
            step="any"
            min="0" 
            max="100"
            placeholder="Enter your bid"
            
          />
          
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
      {gametype()==="public"? renderPublicInfo(gameData): (<div></div>)}
    </div>
      </div> : <div>      <nav className="bg-white border-gray-200 dark:bg-gray-900 border-t dark:border-gray-600 border-b-2" >
  <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-10">
    <a href="./" className="flex items-center space-x-3 rtl:space-x-reverse">
        <img src="/beauty-contest.svg" width="100" height="600" className="h-8" alt="Econ Logo" />
        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"></span>
    </a>
    <button data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
        <span className="sr-only">Open main menu</span>
        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
        </svg>
    </button>
    <div className="hidden w-full md:block md:w-auto" id="navbar-default">
      <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
       
        <li>
        <div>
        <button
          onClick={() => {
            signOut({ redirect: false }).then(() => {
                router.push("/"); // Redirect to the dashboard page after signing out
            });
        }}
          className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
        >
          Log Out
        </button>
      </div>
        </li>
      </ul>
    </div>
  </div>
</nav> <div className="grid place-items-center p-20">The game&apos;winner is {getWinner()}. <br/> 
 The average bid is { gameAverageBid()}</div></div>
    );
  }

  return (
    <div> 
      {role ==='admin'? <EndGame /> : renderForm()}
    </div>
  );
}