import React, { useContext, useEffect, useReducer } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Button } from "react-bootstrap";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { Store } from "../Store";
import { getError } from "../utils";
import { toast } from "react-toastify";
import "../App.css";

//Función reducer para gestionar el estado del componente
//HOOK useReducer: maneja las acciones son "FETCH_REQUEST" para indicar la solicitud de datos, "FETCH_SUCCESS" para actualizar el estado con los datos obtenidos y "FETCH_FAIL" para los errores de la solicitud.
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, products: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "DELETE_SUCCESS":
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };

    case "DELETE_RESET":
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};
//Componente principal que Contiene la lógica y la estructura de la pantalla de productos del artista
//HOOK useContext: se obtienen los datos de userInfo del contexto Store
//HOOK useReducer: adminsitra las propiedades de loading, error y user
export default function ProductArtistScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loading, error, products, successDelete }, dispatch] = useReducer(
    reducer,
    {
      loading: true,
      error: "",
    }
  );

  //HOOK useEffect: para realizar una solicitud HTTP para obtener los productos asociados al usuario
  //Cuando se monta el componente o cuando userInfo cambia, se ejecuta la función fetchData
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const products = await axios.get(
          `https://api.amaiie.javiergonzalez.site/api/users/${userInfo.username}/products`
        );
        const productsData = products.data;
        console.log(productsData);

        dispatch({ type: "FETCH_SUCCESS", payload: productsData });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: getError(error) });
      }
    };
    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      fetchData();
    }
  }, [userInfo, successDelete]);

  const deleteHandler = async (product) => {
    if (window.confirm("Are you sure to delete?")) {
      try {
        await axios.delete(`https://api.amaiie.javiergonzalez.site/api/products/${product._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success("product deleted successfully");
        dispatch({ type: "DELETE_SUCCESS" });
      } catch (err) {
        toast.error(getError(err));
        dispatch({
          type: "DELETE_FAIL",
        });
      }
    }
  };

  //Devolvemos un JSX (similar a HTML) con la estructura y contenido de la pantalla del artista
  //Se muestra un componente LoadingBox, si loading es true
  //Se muestra un componente MessageBox de error, si error tiene un valor o una lista de productos, si el usuario existe y tiene productos

  return (
    <div>
      <Helmet>
        <title>Productos</title>
      </Helmet>

      <h1 className='color-verde-edit-product'>Productos</h1>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant='danger'>{error}</MessageBox>
      ) : (
        <table className='table'>
          <thead className='color-verde'>
            <tr>
              <th>IMAGEN</th>
              <th>NOMBRE</th>
              <th>USUARIO</th>
              <th>DESCRIPCIÓN</th>
              <th>FECHA CREACIÓN</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>
                  {" "}
                  <img
                    src={`https://api.amaiie.javiergonzalez.site/fotoproducto/${product.image}`}
                    alt={product.nameproduct}
                    className='small'
                  ></img>
                </td>
                <td>{product.nameproduct}</td>
                <td>{product.user}</td>
                <td>{product.description}</td>
                <td>{product.createdAt.substring(0, 10)}</td>
                <td>
                  <Button
                    className='custom-button'
                    type='button'
                    variant='light'
                    onClick={() => deleteHandler(product)}
                  >
                    Borrar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
