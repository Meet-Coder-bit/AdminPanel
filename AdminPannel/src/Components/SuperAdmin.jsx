import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'

const SuperAdmin = () => {
  let [users, setAllUsers] = useState([])

  let [productName, setProductName] = useState("")
  let [productPrice, setProductPrice] = useState("")
  let [productImage, setProductImage] = useState(null)


  const CLOUD_NAME = "dqdoy3xiq";
  const UPLOAD_PRESET = "my-unsigned-preset";


  useEffect(() => {
    axios.get("http://localhost:8080/spdash")
      .then((res) => {
        setAllUsers(res.data.users)
      })
      .catch(() => {
        setAllUsers("Technical error !")
      })
  }, [])

  let handleRoles = ((r, id) => {

    let role = r.target.value

    axios.post("http://localhost:8080/sprole", { role, id })
      .then((res) => {
        alert(res.data.message)
      })
      .catch((err) => {
        console.log(err)
      })
  })

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProductImage(file);

  };

  let handleProductAdd = async () => {
    try {
      const formData = new FormData();
      formData.append("file", productImage);
      formData.append("upload_preset", UPLOAD_PRESET);


      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        formData
      );

      const imageUrl = res.data.secure_url;


      await axios.post("http://localhost:8080/productAdd", {
        name: productName,
        price: productPrice,
        imageUrl: imageUrl,
      });

      alert("Product added successfully");
    } catch (err) {
      console.error("UPLOAD FAILED:", err);
      alert("Error while adding product ");
    }
  };
  return (
    <div>
      <h1>SuperAdmin</h1>
      <h2>Users</h2>
      {
        users.map((e, i) => {
          return (
            <ul key={i}>
              <li>{e.username}</li>
              <li>{e.email}</li>
              <li>{e.role}</li>
              <select defaultValue={e.role} onChange={(r) => handleRoles(r, e._id)}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="superadmin">Super Admin</option>
              </select>
            </ul>
          )
        })
      }


      <h1>Add Products</h1>
      <input type="text" placeholder='Product name' onChange={(e) => setProductName(e.target.value)} value={productName} />
      <input type="number" placeholder='Price' onChange={(e) => setProductPrice(e.target.value)} value={productPrice} />
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleProductAdd}>Add</button>
    </div>
  )
}

export default SuperAdmin
