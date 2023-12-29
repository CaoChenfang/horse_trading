
"use client";

import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

export default function UserInfo() {
  const { data: session } = useSession();
  const email = session?.user.role;
  console.log(email);
  //const data = [2, 4, 6, 3, 3];
  //function histogram(data, size) {
   // let min = 0;
   // let max = 99;

   // for (const item of data) {
  //      if (item < min) min = item;
  //      else if (item > max) max = item;
   // }

  //  const bins = Math.ceil((max - min + 1) / size);

  //  const histogram = new Array(bins).fill(0);

  //  for (const item of data) {
  //      histogram[Math.floor((item - min) / size)]++;
   // }
  //  const _histogram = histogram.map((item,index) => {return({"name": JSON.stringify(index), "frequency": item})})

 //   return _histogram;
//}
//function print(x) {
//  console.log(JSON.stringify(x));
//}
//console.log(histogram(data,1));


  return (
    <div className="grid place-items-center h-screen">
      <div className="shadow-lg p-8 bg-zince-300/10 flex flex-col gap-2 my-6">
        <div>
          Name: <span className="font-bold">{session?.user?.name}</span>
        </div>
        <div>
          Email: <span className="font-bold">{session?.user?.email}</span>
        </div>
        <div>
          Is an admin: <span className="font-bold">{session?.user?.role}</span>
        </div>
        <button
          onClick={() => signOut()}
          className="bg-red-500 text-white font-bold px-6 py-2 mt-3"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}