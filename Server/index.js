const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")
const app = express()
const port = 8080
const path = require("path")
const signupModel = require(path.join(__dirname, "Models", "AuthModel"))
const productModel = require(path.join(__dirname, "Models", "Products"))


app.use(express.json())
app.use(cors())

mongoose.connect("mongodb://localhost:27017/User")

function authMiddleweare(req, res, next) {

    let token = req.headers.authorization
    let verifiedToken = jwt.verify(token, "user@9898")

    if (verifiedToken) return res.json({ message: "Token Verified !" })

    try {
        let user = req.user
        console.log(user)
        next()
    } catch (error) {
        console.log(error)
    }
}

app.post("/signup", async (req, res) => {
    const { username, email, password } = req.body

    let existingUser = await signupModel.findOne({ email })
    if (existingUser) return res.json({ message: "user is already exist !" })

    let hashedPass = await bcrypt.hash(password, 10)

    let newUser = await signupModel.create({ username, email, password: hashedPass })
    res.json({ message: "user created !" })


})

app.post("/login", async (req, res) => {
    const { email, password } = req.body

    let adminEmail = "admin@gmail.com"
    let adminPassword = "Admin@123"

    let SadminEmail = "sadmin123@gmail.com"
    let SadminPassword = "sadmin@123"


    let existingUser = await signupModel.findOne({ email })
    if (!existingUser) return res.json({ message: "user not found !" })

    if (email === adminEmail && password === adminPassword) {
        let admin = await signupModel.findByIdAndUpdate(existingUser.id, { role: "admin" })
        console.log(admin)
    }
    if (email === SadminEmail && password === SadminPassword) {
        let Sadmin = await signupModel.findByIdAndUpdate(existingUser.id, { role: "superadmin" })
        console.log(Sadmin)
    }

    let hashedPass = await bcrypt.compare(password, existingUser.password)
    if (!hashedPass) return res.json({ message: "password incorrect !" })

    let userRole = existingUser.role

    let token = await jwt.sign({ id: existingUser._id }, "user@9898", { expiresIn: "1h" })
    res.json({ message: "user logged In !", token, userRole })
})

let forgotOtpV = {}
app.post("/forgot", async (req, res) => {
    const { forgotEmail } = req.body

    let existingUser = await signupModel.findOne({ email: forgotEmail })
    if (!existingUser) return res.json({ message: "user not found !" })

    let otp = await Math.floor(100000 + Math.random() * 900000)

    forgotOtpV[forgotEmail] = otp

    let nodemailerTransport = await nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "rwr1.kunj.gg@gmail.com",
            pass: "xwtctxssifksehzf"
        }
    })

    nodemailerTransport.sendMail({
        from: "rwr1.kunj.gg@gmail.com",
        to: forgotEmail,
        subject: "Otp for reset password.",
        text: `your otp is ${otp}`
    })


    existingUser.otp = otp
    existingUser.otpExpire = Date.now() + 5 * 60 * 1000
    existingUser.save()

    return res.json({ message: "Otp sent !", flag: true })

})

app.post("/resetpass", async (req, res) => {
    const { forgotEmail, userOtp } = req.body

    let existingUser = await signupModel.findOne({ email: forgotEmail })
    if (!existingUser) return res.json({ message: "user not found !" })

    if (existingUser.otpExpire > Date.now()) {
        let verifyOtp = await signupModel.findOne({ otp: userOtp })
        if (verifyOtp) {
            return res.json({ message: "Otp is correct !", forgotEmail })
        }
        else {
            return res.json({ message: "Otp is Incorrect !" })
        }

    }
    else {
        return res.json({ message: "Otp is expried !" })
    }
})


app.post("/confirmpass", async (req, res) => {
    const { userEmail, pass1 } = req.body

    let existingUser = await signupModel.findOne({ email: userEmail })
    if (!existingUser) return res.json({ message: "user not found !" })

    let hashedPass = await bcrypt.hash(pass1, 10)

    existingUser.password = hashedPass
    existingUser.otp = null
    existingUser.otpExpire = null

    console.log(existingUser)
    await existingUser.save()


    return res.json({ message: "Password changed !" })
})

app.get("/home", authMiddleweare, async (req, res) => {
    let token = req.headers.authorization

    let verifiedToken = await jwt.verify(token, "user@9898")

    let user = await signupModel.findById(verifiedToken.id)
    let username = user.username

    let allUser = await signupModel.find()
    console.log(allUser)

    res.json({ message: "user verifed !", username })
})

app.get("/spdash", authMiddleweare, async (req, res) => {
    let users = await signupModel.find()

    if (!users) return res.json({ message: "No data !" })

    res.json({ message: "Data synced !", users })
})

app.get("/adash", authMiddleweare, async (req, res) => {
    let users = await signupModel.find()

    if (!users) return res.json({ message: "No data !" })

    res.json({ message: "Data synced !", users })
})

app.post("/sprole", async (req, res) => {
    let { role, id } = req.body

    let userUpdate = await signupModel.findByIdAndUpdate(id, { role: role }, { new: true })
    if (userUpdate) return res.json({ message: "Role Updated !" })
})

app.post("/productAdd", async (req, res) => {
    let { name, price, imageUrl } = req.body
    let newProduct = await productModel.create({
        name: name,
        price: price,
        image: imageUrl
    })
    newProduct.save()
})

app.get("/getProducts", async (req, res) => {
    let products = await productModel.find()
    res.json({ message: "Data fatched !", products })
})

app.delete("/getProducts/:id", async (req, res) => {
    let id = req.params.id
    let deleteProducts = await productModel.findByIdAndDelete(id)

    res.json({ message: "Product Deleted !" })
})

app.put("/getProducts/:id", async (req, res) => {
    let id = req.params.id
    let { productName, productPrice } = req.body
    let updateProduct = await productModel.findByIdAndUpdate(id, { name: productName, price: productPrice }, { new: true })
    console.log(updateProduct)


    res.json({ message: "Product Update !" })
})
app.listen(port, () => {
    console.log("Server is running...")
})