import React, { useContext, useReducer, useState } from "react";
import { Helmet } from "react-helmet-async";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Store } from "../Store";
import { toast } from "react-toastify";
import { getError } from "../utils";
import axios from "axios";
import "../App.css";
//Función que utiliza el HOOK useReducer para manejar los cambios de estado en la carga de la actulización del perfil de usuario (request, sucess y fail)
const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false };

    default:
      return state;
  }
};
//componente principal perfil del usuario
//HOOK useContext para obtener datos de estado del contexto Store
//HOOK useState para manejar los estados de username, email y contraseña
export default function ProfileScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [username, setUsername] = useState(userInfo.username);
  const [email, setEmail] = useState(userInfo.email);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
    loadingUpdate: false,
  });
  //Función que maneja el envío del form de actulización de perfil de usuario
  // Envía una solicitud HTTP con los datos de actulización de perfil a través de axios
  //Notificaciones de error con toastify
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        "https://api.amaiie.javiergonzalez.site/api/users/profile",
        {
          username,
          email,
          password,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: "UPDATE_SUCCESS",
      });
      ctxDispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      toast.success("User updated successfully");
    } catch (err) {
      dispatch({
        type: "FETCH_FAIL",
      });
      toast.error(getError(err));
    }
  };
  //Renderiza el componente y devuelve un JXS (similar al HTML), estilos con bootstrap, actualiza los campos con onChange y botón de actualizar
  return (
    <div className='container small-container'>
      <Helmet>
        <title>Perfil del usuario</title>
      </Helmet>
      <h1 className='color-verde-user-profile'>Perfil del usuario</h1>
      <form onSubmit={submitHandler}>
        <Form.Group className='mb-3' controlId='name'>
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className='mb-3' controlId='name'>
          <Form.Label>Email</Form.Label>
          <Form.Control
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className='mb-3' controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group className='mb-3' controlId='password'>
          <Form.Label>Confirmar Password</Form.Label>
          <Form.Control
            type='password'
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>
        <div className='mb-3'>
          <Button className='custom-button' type='submit'>
            Actualizar
          </Button>
        </div>
      </form>
    </div>
  );
}
