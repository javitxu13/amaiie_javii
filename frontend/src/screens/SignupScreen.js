import { Link, useLocation, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { Helmet } from "react-helmet-async";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { useState, useContext, useEffect } from "react";
import { Store } from "../Store";
import { toast } from "react-toastify";
import { getError } from "../utils";
import "../App.css";
//PANTALLA DEL LOGOUT
//Función para que el usuario pueda registrase por primera vez
//HOOK useNavigate: para las funciones de navegación por la web
//HOOK useLocation: para saber la ubicación de navegación del usuario
export default function SignupScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";
  //HOOK useState: para los cambios de estado de username, email y password
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isArtist, setIsArtist] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  //HOOK useContext: para obtener los datos del contexto Store y se extrae la propiedad userInfo del estado
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  //Se ejecuta cuando se envía el formulario de registro
  //Solicitud POST para enviar con axios los datos de registro proporcionados por el usuario
  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Pasword don not match"); //notificación de fallo de contraseña
      return;
    }
    try {
      const { data } = await axios.post("https://api.amaiie.javiergonzalez.site/api/users/signup", {
        username,
        email,
        isArtist,
        password,
      });
      ctxDispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate(redirect || "/");
    } catch (error) {
      toast.error(getError(error));
    }
  };
  useEffect(() => {
    if (userInfo) {
      //Se utiliza la función navigate para redirigir al usuario a la página especificada en la variable "redirect"
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);
  //Renderiza el componente de registro en una estructura JSX
  //Helmet para estableces el título de la página
  //onChange para cambiar el estado de usuario, mail y password mediante las funciones set
  return (
    <Container className='small-container'>
      <Helmet>
        <title>Registro</title>
      </Helmet>
      <h1 className='color-verde-edit-product'>Registro</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className='mb-3' controlId='username'>
          <Form.Label>Username</Form.Label>
          <Form.Control
            type='username'
            required
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>
        <Form.Group className='mb-3' controlId='email'>
          <Form.Label>Email</Form.Label>
          <Form.Control
            type='email'
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group className='mb-3' controlId='isArtist'>
          <Form.Label>¿Deseas inscribirte como artista?</Form.Label>
          <Form.Select
            required
            onChange={(e) => setIsArtist(e.target.value === "true")}
          >
            <option value=''>Selecciona una opción</option>
            <option value='true'>Sí</option>
            <option value='false'>No</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className='mb-3' controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <Form.Group>
            <Form.Label>Confirma tu Password</Form.Label>
            <Form.Control
              type='password'
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Group>
        </Form.Group>
        <div className='mb-3'>
          <Button className='custom-button' type='submit'>
            Acceder
          </Button>
        </div>
        <div className='mb-3'>
          Todavía no tienes una cuenta?
          <Link to={`/signin?redirect=${redirect}`}>Regístrate</Link>
        </div>
      </Form>
    </Container>
  );
}
