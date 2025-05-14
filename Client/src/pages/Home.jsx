import React from "react";

const Home = () => {
  return (
    <div className="text-3xl font-bold text-white flex flex-row justify-between px-[100px] p-2 bg-[#707070] py-4 w-[70%] mx-auto rounded-lg mt-4 ">
      <div className=" hover:text-purple-400 flex justify-center items-center">Rohit</div>
      <div>
        <ul className="flex gap-3 text-black ">
          <button className="hover:text-blue-600 bg-white hover:bg-slate-900 rounded-lg p-2">Item1</button>
          <button className="hover:text-blue-600 bg-white  hover:bg-slate-900 rounded-lg p-2">Item2</button>
          <button className="hover:text-blue-600 bg-white hover:bg-slate-900 rounded-lg p-2">Item3</button>
          <button className="hover:text-blue-600 bg-white  hover:bg-slate-900 rounded-lg p-2">Item4</button>
        </ul>
      </div>
    </div> 
  );
};

export default Home;
