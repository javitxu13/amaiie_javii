import express from "express"; //para crear y configurar el servidos
import mongoose from "mongoose"; //para conectarse a la base de datos MongoDB
import seedRouter from "./routers/seedRouters.js";
import data from "./data.js";
import dotenv from "dotenv"; //para cargar las variables del entorno
import orderRouter from "./routers/orderRouters.js";
import userRouter from "./routers/userRouters.js";
import productRouter from "./routers/productRouters.js";
import path from "path"; //para manejar rutas de archivos y directorios
import cors from "cors"; //para permitir peticiones desde otros dominios
// Mongoose server: conectamos a MongoDB desde la variable de entorno MONGODB_URI definida en .env
dotenv.config();
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Conectado a MongoDB");
  })
  .catch((error) => {
    console.log(error.message);
  });

// Servidor express: creamos una instancia de la aplicación Exoress
const app = express();
app.use(cors({origin:'*'})); // middleware que permite peticiones desde otros dominios
app.use(express.json()); // middleware que permite recibir json en el body de las peticiones
app.use(express.urlencoded({ extended: true })); // middleware que permite recibir datos de formularios en el body de las peticiones
app.use(express.static("publicback")); //sirve archivos estáticos desde la carpeta publicback
//Configuración de las rutas
app.use("/api/seed", seedRouter);
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
//Ruta pasarela pago PAYPAL
app.use("/api/keys/paypal", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || "sb");
});
//Definimos un middleware para manejar errores del servidor
app.use((error, req, res, next) => {
  res.status(500).send({ message: error.message });
});
//Inicializamos el servidor en el puerto 5000
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server at https://api.amaiie.javiergonzalez.site`);
});
