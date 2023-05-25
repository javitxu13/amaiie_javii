import axios from "axios";
import { useContext, useEffect, useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify"; //para mostrar notificaciones
import { Store } from "../Store";
import { getError } from "../utils";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import Form from "react-bootstrap/Form";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import Button from "react-bootstrap/Button";
import "../App.css";
//Función para  para actualizar el estado del componente en función de las acciones de loading, error y loadingUpdate
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false };
    case "UPLOAD_REQUEST":
      return { ...state, loadingUpload: true, errorUpload: "" };
    case "UPLOAD_SUCCESS":
      return {
        ...state,
        loadingUpload: false,
        errorUpload: "",
      };
    case "UPLOAD_FAIL":
      return { ...state, loadingUpload: false, errorUpload: action.payload };

    default:
      return state;
  }
};
//Componente principal de actualización de producto
//HOOK useNavigate: para las funciones de navegación por la web
//HOOK useParams: para obtener el id del producto
//HOOK useReducer: para el loading
//HOOK useContext: para obtener la información del estado utilizando el contexto Store y userInfo
export default function ProductEditScreen() {
  const navigate = useNavigate();
  const params = useParams(); // /product/:id
  const { id: productId } = params;

  const [productState, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
    loadingUpdate: false,
    loadingUpload: false,
  });

  const { state } = useContext(Store);
  const { userInfo } = state;
  const { loading, error, loadingUpdate } = productState;

  const [nameproduct, setProductName] = useState("");
  const [slug, setSlug] = useState("");
  const [user, setUser] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState("");
  const [description, setDescription] = useState("");

  //useEffect: Realiza una solicitur HTTP al cargar el componente
  //Llamada a la API utilizando axios para obtener los datos del producto con un id específico
  //Si la solicitud es correcta, los datos se usan para establecer el estado de las variables y si no da un mensaje de error
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`https://api.amaiie.javiergonzalez.site/api/products/${productId}`);
        setProductName(data.nameproduct);
        setSlug(data.slug);
        setUser(data.user);
        setPrice(data.price);
        setImage(data.image);
        setCategory(data.category);
        setCountInStock(data.countInStock);
        setDescription(data.description);
        dispatch({ type: "FETCH_SUCCESS" });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [productId]);
  // Función que se llama al enviar el formulario de edición del producto
  //Evitamos que el formulario se envíe por defecto
  //Se crea un objeto FormData con todos los valores introducidos en el formulario (imagen incluida)
  //Solicitud PUT a la API utilizando axios, envia el form y agrega el token del usuario
  //Si la solicitud es correcta, actualiza el estado y muestra notificación de éxito
  //Si da error, envia mensaje de error (notificación toast)
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("nameproduct", nameproduct);
      formData.append("user", user);
      formData.append("slug", slug);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("countInStock", countInStock);
      formData.append("description", description);
      const { data } = await axios.put(`https://api.amaiie.javiergonzalez.site/api/products/${productId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      dispatch({
        type: "UPDATE_SUCCESS",
      });
      dispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("productInfo", JSON.stringify(data));
      toast.success("Product updated successfully");
      navigate("/admin/products");
    } catch (error) {
      dispatch({
        type: "FETCH_FAIL",
      });
      toast.error(getError(error));
    }
  };

 
  //Renderiza el componente con los dampos del formulario para editar los detalles del producto
  //Si loading es true, se muestra el componente LoadingBox
  //Si error no está vacío, muestra el componente MessageBox con el mensaje de error
  //Si no se muestra el formulario de edición de producto y puedes darle al botón de actualizar

  return (
    <Container className='small-container'>
      <Helmet>
        <title>Editar Producto ${productId}</title>
      </Helmet>
      <h1 className='color-verde-edit-product'>Editar {productId}</h1>

      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant='danger'>{error}</MessageBox>
      ) : (
        <Form onSubmit={submitHandler} enctype='multipart/form-data'>
          <Form.Group className='mb-3' controlId='name'>
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              value={nameproduct}
              onChange={(e) => setProductName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className='mb-3' controlId='user'>
            <Form.Label>Usuario</Form.Label>
            <Form.Control
              value={user}
              onChange={(e) => setUser(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className='mb-3' controlId='slug'>
            <Form.Label>Slug</Form.Label>
            <Form.Control
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className='mb-3' controlId='name'>
            <Form.Label>Precio</Form.Label>
            <Form.Control
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className='mb-3' controlId='image'>
            <Form.Label>Imagen</Form.Label>
            <Form.Control
              type='file'
              onChange={(e) => setImage(e.target.files[0])}
            />
          </Form.Group>
          <Form.Group className='mb-3' controlId='category'>
            <Form.Label>Categoría</Form.Label>
            <Form.Control
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className='mb-3' controlId='countInStock'>
            <Form.Label>Unidades</Form.Label>
            <Form.Control
              value={countInStock}
              onChange={(e) => setCountInStock(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className='mb-3' controlId='description'>
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Form.Group>
          <div className='mb-3'>
            <Button
              className='custom-button'
              disabled={loadingUpdate}
              type='submit'
            >
              Actualizar
            </Button>
            {loadingUpdate && <LoadingBox></LoadingBox>}
          </div>
        </Form>
      )}
    </Container>
  );
}
