import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
const Admin = () => {
  let [users, setAllUsers] = useState([])
  let [products, setProducts] = useState([])
  useEffect(() => {
    axios.get("http://localhost:8080/adash")
      .then((res) => {
        setAllUsers(res.data.users)
      })
      .catch(() => {
        setAllUsers("Technical error !")
      })

    getProduct()
  }, [])



  let getProduct = (() => {
    axios.get("http://localhost:8080/getProducts")
      .then((res) => {
        alert(res.data.message)
        setProducts(res.data.products)
      })
      .catch((err) => {
        console.log(err)
      })
  })


  let handleDeleteProduct = ((id) => {
    axios.delete(`http://localhost:8080/getProducts/${id}`)
      .then((res) => {
        console.log(res.data.message)
        getProduct()
      })
      .catch((err) => console.log(err))


  })

  let handleEditProduct = ((id,name,price)=>{
      let productName = prompt("Enter Product name - ",name)
      let productPrice = prompt("Enter Product price - ",price)

      axios.put(`http://localhost:8080/getProducts/${id}`,{productName,productPrice})
        .then((res)=>{
          alert(res.data.message)
          getProduct()
        })
        .catch((err)=> console.log(err))
  })
  return (
    <div>
      <h1>Admin Page</h1>
      {
        users.map((e, i) => {
          return (
            <ul key={i}>
              <li>{e.username}</li>
              <li>{e.email}</li>
              <li>{e.role}</li>
            </ul>
          )
        })
      }

      <h1>Products</h1>
      {
        products.map((e, i) => {
          return (
            <div key={i} className='card'>
              <h1>{e.name}</h1>
              <span>{e.price}</span>
              <button onClick={() => handleDeleteProduct(e._id)}>Delete</button>
              <button onClick={() => handleEditProduct(e._id,e.name,e.price)}>Edit</button>
            </div>
          )
        })
      }
    </div>
  )
}

export default Admin
