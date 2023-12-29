"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import  NavBar  from "@/components/NavBar";
import { useSession } from "next-auth/react";

export default function LoginForm() {
  const [gameForm, setGameForm] = useState({
    maxnumbid: 0,
    gamelength: 0,
    gametype:"",
  });
  
  const [error, setError] = useState("");
  const router = useRouter();
  const { data: session } = useSession();
  const role = session?.user?.role; 

  const handleChange = (event) => {
    const {name, value, type, checked} = event.target;
    setGameForm( preGameForm => {
     return {
         ...preGameForm, [name]: type === "checkbox" ? checked : value
     }
    }) };
    console.log( gameForm.maxnumbid);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const maxNumBid = gameForm.maxnumbid;
    const gameLength = gameForm.gamelength;
    const gameType = gameForm.gametype;
    console.log(maxNumBid);
    try {
      
      if (!maxNumBid || !gameLength || !gameType) {
        setError("all fields required");
        return;
      }
      const res = await fetch('api/createGame', {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({maxNumBid, gameLength, gameType})
    });
   
    if (res.ok) {
        const form = e.target;
        form.reset();
        router.push("/");
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
            onChange={handleChange}
            type="number"
            placeholder="Max number of bids"
            name="maxnumbid"
            min={1}
            max={100}
            step={1}
            value={gameForm.maxnumbid}
          />
           <input
            onChange={handleChange}
            type="number"
            placeholder="The game length in minutes"
            name="gamelength"
            min={1}
            max={100}
            step={1}
            value={gameForm.gamelength}
          />
        
          <fieldset>
              <legend>The game type</legend>
              <input
              type="radio"
              id="private"
              name="gametype"
              onChange={handleChange}
              value="private"  
              checked={gameForm.gametype==="private"}           
              />
              <label htmlFor="private"> Private</label>
              <br />
              <input
              type="radio"
              id="public"
              name="gametype"
              value="public"
              onChange={handleChange}
              checked={gameForm.gametype==="public"}                 
              />
              <label htmlFor="public"> Public</label>
            </fieldset>
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