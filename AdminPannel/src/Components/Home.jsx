import React, { useEffect, useState } from 'react'
import axios from 'axios'
const Home = () => {
  let [msg, setMsg] = useState("")
  let [products,setProducts] = useState([])
  useEffect(() => {
    axios.get("http://localhost:8080/home", {
      headers: { Authorization: `${localStorage.getItem("token")}` }
    })
      .then((res) => {
        setMsg(res.data.username)
        console.log(res.data.username)
      })
      .catch(() => {
        setMsg("user not verifed !")
      })

      getProduct()
  }, [])

  let getProduct = (()=>{
    axios.get("http://localhost:8080/getProducts")
    .then((res)=>{
      alert(res.data.message)
      setProducts(res.data.products)
    })
    .catch((err)=>{
      console.log(err)
    })
  })
  return (
    <div>
      <h1>Welcome - {msg}</h1>

      <h1>Products</h1>
      {
        products.map((e,i)=>{
          return(
            <div key={i} className='card'>
              <h1>{e.name}</h1>
              <span>{e.price}</span>
              <img src={e.image} alt="" />
            </div>
          )
        })
      }
    </div>
  )
}

export default Home
