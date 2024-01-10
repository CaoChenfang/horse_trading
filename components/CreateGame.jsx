"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import  NavBar  from "@/components/NavBar";
import { useSession } from "next-auth/react";

export default function LoginForm() {
  const [game, setGame] = useState();
  const [gameData, setGameData] = useState();
  const [max, setMax] = useState();
  const [min, setMin] = useState(); 
  const [buyerMultiplier, setBuyerMultiplier] = useState(); 
  const [error, setError] = useState("");
  const router = useRouter();
  const { data: session } = useSession();
  const role = session?.user?.role; 

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
  
  const isactive = () => {
      if (typeof game !== 'undefined' && game.length > 0 ) {
        return game[game.length - 1].isactive;
      } else {
        return 'ended';
      }
    }
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    //Persist to get the last game

    try {
      
      if (!max || !min) {
        setError("all fields required");
        return;
      }

      if (min>max) {
        setError("The min value is greater than the max value");
        return;
      }

      if (isactive()==="active") {
        setError("You need to end the current active game to create a new game");
        return;
      }
      if (isactive()==="ended" && gameData.length > 0) {
        var numberofgame = gameData.length;
        try {
          const resGame = await fetch('api/archiveGame', {
            method: "POST",
            headers: {
              "Content-type": "application/json"
            },
            body: JSON.stringify({ numberofgame })
        });
          
        } catch (error) {
          console.log("Archived failed", error);
        } 
      }
      const maxVal = max;
      const minVal = min;
      const res = await fetch('api/createGame', {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({maxVal, minVal, buyerMultiplier})
    });
   
    if (res.ok) {
        const form = e.target;
        form.reset();
        setError("")
        //router.push("/");
    } else {
        console.log("Game creation failed")
    }
      
    } catch (error) {
      console.log("Error when submission:", error)
    }  
  };

  const renderForm = () => {
    return (
      <div className="grid place-items-center h-screen">
      <div className="shadow-lg p-5 rounded-lg border-t-4 border-green-400">
        <h1 className="text-xl font-bold my-4">Create a new game</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          
          <input
            onChange={(e) => setMax(e.target.value)}
            type="number"
            placeholder="The maximum value of the valuation"
            name="max"
            min="0"            
            step="any"
            //value={gameForm.maxnumbid}
          />
           <input
            onChange={(e)=>setMin(e.target.value)}
            type="number"
            placeholder="The min value of the valuation"
            name="min"
            min="0"            
            step="any"
            //value={gameForm.gamelength}
          />
           <input
            onChange={(e) => setBuyerMultiplier(e.target.value)}
            type="number"
            placeholder="The buyer's multiplier"
            name="multiplier"
            min="0"            
            step="any"
            //value={gameForm.maxnumbid}
          />        
          <button className="bg-green-600 text-white font-bold cursor-pointer px-6 py-2">
            Create a new game
          </button>
         
          {error && (
            <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
              {error}
            </div>
          )}

        </form>
        
      </div>
    </div>
    )
  }

  return (
    <div>
    <NavBar />
    {role === "admin" ? renderForm(): (<div className="grid place-items-center h-screen"> You do not have right to access this page</div>)}
    </div>    
  
  );
}