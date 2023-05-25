import Axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Helmet } from "react-helmet-async";
import { useState, useContext, useEffect } from "react";
import { Store } from "../Store";
import { toast } from "react-toastify";
import { getError } from "../utils";
import "../App.css";
//PANTALLA DEL LOGIN
//Función para el registro de usuario
//HOOK useNavigate: para las funciones de navegación por la web
//HOOK useLocation: para saber la ubicación de navegación del usuario
export default function SigninScreen() {
  const navigate = useNavigate();

  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";
  //HOOK useState: para los cambios de estado de username y password
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  //HOOK useContext: para obtener los datos del contexto Store y se extrae la propiedad userInfo del estado
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  //Se ejecuta cuando se envía el formulario de login
  //Solicitud POST para enviar con axios los datos de inicio de sesión proporcionados por el usuario
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await Axios.post("https://api.amaiie.javiergonzalez.site/api/users/signin", {
        username,
        password,
      });
      ctxDispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate(redirect || "/");
    } catch (err) {
      toast.error(getError(err)); //Si ocurre un error durante la solicitud, se muestra un mensaje de error utilizando la función toast de react-toastify
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
    //Se utiliza la función navigate para redirigir al usuario a la página especificada en la variable "redirect"
  }, [navigate, redirect, userInfo]);
  //Renderiza el componente login una estructura JSX que es el inicio de sesión
  //Helmet para estableces el título de la página
  //onChange para cambiar el estado de usuario y password mediante las funciones set
  return (
    <Container className='small-container'>
      <Helmet>
        <title>Acceder</title>
      </Helmet>
      <h1 className='color-verde-edit-product'>Acceder</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className='mb-3' controlId='username'>
          <Form.Label>Usuario</Form.Label>
          <Form.Control
            type='username'
            required
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>
        <Form.Group className='mb-3' controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <div className='mb-3'>
          <Button className='custom-button' type='submit'>
            Acceder
          </Button>
        </div>
        <div className='mb-3'>
          Nuevo usuario?{" "}
          <Link to={`/signup?redirect=${redirect}`}>Crea tu cuenta</Link>
        </div>
      </Form>
    </Container>
  );
}
