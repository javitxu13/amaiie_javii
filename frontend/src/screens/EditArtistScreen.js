import React, { useContext, useReducer, useState } from "react";
import { Helmet } from "react-helmet-async";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Store } from "../Store";
import { toast } from "react-toastify";
import { getError } from "../utils";
import axios from "axios";
import "../App.css";
//PAGINA DE EDICION DEL PERFIL DEL ARTISTA
//Función para manejar las acciones relacioneadas con la actualización del perfil del artista

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
//Componente de edición del perfil de un artista
//HOOK useContext: para acceder al contexto del componente Store
//función dispatch para realizar las acciones
//Extraemos la info de userInfo y utilizamos el HOOK useState para gestionar los estados locales (username, email, imagen, descripción, password)
//HOOK useReducer para gestionar el estado de loadingUpdate e indicar que la actualización del perfil está en progreso
export default function EditArtistScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [username, setUsername] = useState(userInfo.username);
  const [email, setEmail] = useState(userInfo.email);
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState(userInfo.description);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
    loadingUpdate: false,
  });
  // Función controlador eventos que de ejecuta al enviar el formulario de edición de perfil
  //Objeto FormData con todos los campos actualizados que se guarda en MongoDB y mostramos un mensaje de actualización correcta
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("username", username);
      formData.append("email", email);
      formData.append("description", description);
      formData.append("password", password);

      const { data } = await axios.put("https://api.amaiie.javiergonzalez.site/api/users/editprofile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

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
  //Devolvemos el perfil del artista actualizado
  return (
    <div className='container small-container'>
      <Helmet>
        <title>Perfil del artista</title>
      </Helmet>
      <h1 className=' color-verde-edit-artista'>Perfil del artista</h1>
      <form onSubmit={submitHandler} enctype='multipart/form-data'>
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
        <Form.Group className='mb-3' controlId='image'>
          <Form.Label>Imagen</Form.Label>
          <Form.Control
            type='file'
            /* value={username}*/
            onChange={(e) => setImage(e.target.files[0])}
            required
          />
        </Form.Group>
        <Form.Group className='mb-3' controlId='description'>
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            type='description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
          <Form.Label>Confirma el Password</Form.Label>
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
