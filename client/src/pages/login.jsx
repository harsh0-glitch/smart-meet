import { useState } from "react";
import {useNavigate} from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();

  function handleLogin(event) {
    event.preventDefault();
    console.log(pass);
    console.log(email);
    navigate('/home');
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="border rounded-lg p-8 w-96 bg-gray-100 shadow-lg">
        <h1 className="text-lg font-bold text-center ">Authentication</h1>
        <form onSubmit={handleLogin}>
          <h2 className=" justify-left">Email</h2>
          <input
            className="border-2 border-solid w-80 rounded-lg p-2"
            placeholder="Enter Email"
            type="text"
            onChange={(event) => setEmail(event.target.value)}
          />
          <h2 className=" justify-left">Password</h2>
          <input
            className="border-2 border-solid w-80 rounded-lg p-2"
            placeholder="Enter Password"
            type="password"
            onChange={(event) => setPass(event.target.value)}
          />
          <div className="p-5">
            <button
              type="submit"
              className="bg-sky-500 hover:bg-sky-700 w-40 p-2 text-white"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default Login;
