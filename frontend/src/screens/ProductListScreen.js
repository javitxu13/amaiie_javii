import React, { useContext, useEffect, useReducer } from "react";
import Axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
import { Store } from "../Store";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { getError } from "../utils";
import "../App.css";
//PAGINA DE LISTA DE PRODUCTOS
//HOOK useReducer: para actualizar el estado del loading, error, products, pages, loadingCreate, loadingDelete y sucessDelete

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "CREATE_REQUEST":
      return { ...state, loadingCreate: true };
    case "CREATE_SUCCESS":
      return {
        ...state,
        loadingCreate: false,
      };
    case "CREATE_FAIL":
      return { ...state, loadingCreate: false };

    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true, successDelete: false };
    case "DELETE_SUCCESS":
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case "DELETE_FAIL":
      return { ...state, loadingDelete: false, successDelete: false };

    case "DELETE_RESET":
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};

//Componente Lista de Productos (crear, listar y borrar producto)
//HOOK useReducer: para inicializar el estado del componente y obtener una función dispatch para enviar acciones al reductor
//HOOK useNavigate: para las funciones de navegación por la web
//HOOK useLocation: para obtener la información sobre la ubicación y la navegación en la aplicación
//HOOK useContext: para obtener la información del estado utilizando el contexto Store
export default function ProductListScreen() {
  const [
    {
      loading,
      error,
      products,
      pages,
      loadingCreate,
      loadingDelete,
      successDelete,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const page = sp.get("page") || 1;

  const { state } = useContext(Store);
  const { userInfo } = state;
  //Realizamos una solicitud HTTP para obtener la lista de productos desde el servidor

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await Axios.get(`https://api.amaiie.javiergonzalez.site/api/products/admin?page=${page} `, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });

        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {}
    };

    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      fetchData();
    }
  }, [page, userInfo, successDelete]);
  //Función para añadir productos a la lista
  //Si la solicitud es correcta, se actualiza el estado con la lista de productos
  //Si hay error, sale el mensaje de error correspondiente
  const createHandler = async () => {
    if (window.confirm("Are you sure to create?")) {
      try {
        dispatch({ type: "CREATE_REQUEST" });
        const { data } = await Axios.post(
          "https://api.amaiie.javiergonzalez.site/api/products",
          {},
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        // toast.success("product created successfully");
        dispatch({ type: "CREATE_SUCCESS" });
        navigate(`/admin/product/${data.product._id}`);
      } catch (err) {
        toast.error(getError(err));
        dispatch({
          type: "CREATE_FAIL",
        });
      }
    }
  };
  //Función para borrar productos de la lista
  //Si la solicitud es correcta, se actualiza el estado con la lista de productos
  //Si hay error, sale el mensaje de error correspondiente
  const deleteHandler = async (product) => {
    if (window.confirm("Are you sure to delete?")) {
      try {
        await Axios.delete(`https://api.amaiie.javiergonzalez.site/api/products/${product._id}`, {
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
  //Renderiza el componente para actualizar productos de la lista
  return (
    <div className='container-create'>
      <Row>
        <Col>
          <h1 className='color-verde'>Productos</h1>
        </Col>
        <Col className='col text-end'>
          <div>
            <Button
              className='custom-button custom-button-create'
              type='button'
              onClick={createHandler}
            >
              Subir producto
            </Button>
          </div>
        </Col>
      </Row>

      {loadingCreate && <LoadingBox></LoadingBox>}
      {loadingDelete && <LoadingBox></LoadingBox>}
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant='danger'>{error}</MessageBox>
      ) : (
        <>
          <table className='table'>
            <thead className='color-verde'>
              <tr>
                <th>ID</th>
                <th>NOMBRE</th>
                <th>PRECIO</th>
                <th>CATEGORIA</th>
                <th>ARTISTA</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.nameproduct}</td>
                  <td>{product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.user}</td>
                  <td>
                    <Button
                      className='custom-button'
                      type='button'
                      variant='light'
                      onClick={() => navigate(`/admin/product/${product._id}`)}
                    >
                      Editar
                    </Button>
                    &nbsp;
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
          <div>
            {[...Array(pages).keys()].map((x) => (
              <Link
                className={x + 1 === Number(page) ? "btn text-bold" : "btn"}
                key={x + 1}
                to={`/admin/products?page=${x + 1}`}
              >
                {x + 1}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
