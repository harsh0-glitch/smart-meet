import { useState } from "react";
import {useNavigate} from "react-router-dom";


function Home() {
  const [code, setCode] = useState("");
  const navigate = useNavigate();


  function handleMeetCode(event) {
    event.preventDefault();
    console.log(code);
    navigate(`/meetRoom/${code}`);
  }

  function handleNewMeet() {
    console.log("Start a new meet");
    const code= crypto.randomUUID();
    navigate(`/meetRoom/${code}`);
  }

  return (
    <div className="min-h-screen">
      <div className="p-3 bg-blue-300">
        <h1 className="font-bold text-xl m-4">SMART MEET</h1>
      </div>
       <div className="p-4 items-center flex justify-center items-center"><h1 className="font-bold text-2xl">Welcome Back!</h1></div>
      <div className=" bg-slate-50 flex justify-center items-center">
        <div className=" border rounded-lg p-8 w-96 shadow-lg  items-center bg-white">
         <div className="flex flex-col  items-center">
            <h2 className="m-2">Join meeting with code</h2>
<div>
            <form onSubmit={handleMeetCode}>
              <input
                className="border rounded-lg p-2 "
                placeholder="Enter code"
                type="text"
                onChange={(event) => setCode(event.target.value)}
              /> 
              <div>
              <button
                className="bg-sky-500 hover:bg-sky-700 m-2 p-2 text-white rounded-lg w-20"
                type="submit"
              >
                Enter
              </button>
              </div>
            </form>
            </div>
            <h1 className="font-bold">OR</h1>
          
          <button
            className="bg-sky-500 hover:bg-sky-700 m-2 p-2 text-white rounded-lg w-40"
            onClick={handleNewMeet}
          >
            Start new meeting
          </button>
          </div>
          </div>
        </div>
      </div>
    );
}

export default Home;
