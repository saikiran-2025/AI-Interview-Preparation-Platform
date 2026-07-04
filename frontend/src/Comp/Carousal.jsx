import React, { useEffect,useState } from 'react'
import "./Carousal.css"
import banner1 from "../assets/banner1.png";
import banner2 from "../assets/banner2.png";
import banner3 from "../assets/banner3.png";
import banner4 from "../assets/banner4.png";

let arr=[
    banner1,
    banner2,
    banner3,
    banner4
]
const Carousal=()=>{
    let [i,setI]=useState(0);

    useEffect(()=>{
        let interval=setInterval(()=>{
            setI((prev)=>(prev+1) % arr.length);
        },2000)
        return ()=> clearInterval(interval);
    },[]);

    let fwd=()=>{
        setI((i+1) % arr.length);
    };

    let bkw=()=>{
        if (i == 0){
            setI(arr.length-1)
        }
        else{
            setI(i-1)
        }
    }

    return(
        <div className="bnr">
      <img src={arr[i]} alt="interview" />
      <i className="fa-solid fa-less-than" onClick={bkw}></i>
      <i className="fa-solid fa-greater-than" onClick={fwd}></i>
      <div className="circles">
        {arr.map((img, ind) => (
          <i
            key={ind}
            className={
              i === ind ? "fa-solid fa-circle" : "fa-regular fa-circle"
            }
            onClick={() => setI(ind)}
          ></i>
        ))}
      </div>
    </div>
    )
}
export default Carousal