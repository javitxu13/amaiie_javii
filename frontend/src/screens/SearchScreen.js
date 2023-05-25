import React, { useEffect, useReducer, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { getError } from "../utils";
import { Helmet } from "react-helmet-async";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import Button from "react-bootstrap/Button";
import Product from "../components/Product";
import LinkContainer from "react-router-bootstrap/LinkContainer";
//Componente principal de actualización de producto
//HOOK useReducer: para cambios de estado del loading, según las acciones rquest, sucess o fail
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
        countProducts: action.payload.countProducts,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

//HOOK useNavigate: para las funciones de navegación por la web
//HOOK useLocation: para obtener la ubicación en la navegación de la web
//URL SerachParams: para extraer los parámetros de consulta de la URL (category, query, price, order y page)
//HOOK useReducer: para los cambios de estado del loading, error, producto, page y stock
export default function SearchScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search); // search?category=Shirts
  const category = sp.get("category") || "all";
  const query = sp.get("query") || "all";
  const price = sp.get("price") || "all";
  const order = sp.get("order") || "newest";
  const page = sp.get("page") || 1;

  const [{ loading, error, products, pages, countProducts }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });
  //HOOK UseEffect:  para realizar una solicitud HTTP al servidor cuando el componente se monta
  //Se realiza una solicitud GET utilizando axios a una API del servidor, pasando los parámetros de búsqueda
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `https://api.amaiie.javiergonzalez.site/api/products/search?page=${page}&query=${query}&category=${category}&price=${price}&order=${order}`
        );
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [category, error, order, page, price, query]);
  //HOOK useState: para manejrar los cambios de estado de las categorías
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`https://api.amaiie.javiergonzalez.site/api/products/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, [dispatch]);

  //FILTROS para ordenar los productos por precios
  const getFilterUrl = (filter, skipPathname) => {
    const filterPage = filter.page || page;
    const filterCategory = filter.category || category;
    const filterQuery = filter.query || query;
    const filterPrice = filter.price || price;
    const sortOrder = filter.order || order;
    return `${
      skipPathname ? "" : "/search?"
    }category=${filterCategory}&query=${filterQuery}&price=${filterPrice}&order=${sortOrder}&page=${filterPage}`;
  };

  //Renderiza una estructura JSX (similar a HTML) el componente principal de buscador de productos
  return (
    <div>
      <Helmet>
        <title>Buscar producto</title>
      </Helmet>

      <Row>
        <Col md={12}>
          {loading ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <MessageBox variant='danger'>{error}</MessageBox>
          ) : (
            <>
              <Row className='justify-content-between mb-3'>
                <Col md={6}>
                  <div className='resultados'>
                    {countProducts === 0 ? "No" : countProducts} Resultados
                    {query !== "all" && " : " + query}
                    {category !== "all" && " : " + category}
                    {price !== "all" && " : Price " + price}
                    {query !== "all" || category !== "all" || price !== "all"}
                  </div>
                </Col>

                <Col className='text-end'>
                  Ordenar
                  <select
                    value={order}
                    onChange={(e) => {
                      navigate(getFilterUrl({ order: e.target.value }));
                    }}
                  >
                    <option value='lowest'>Precio: de menor a mayor</option>
                    <option value='highest'>Precio: de mayor a menor</option>
                  </select>
                </Col>
              </Row>
              {products.length === 0 && (
                <MessageBox>Producto no encontrado</MessageBox>
              )}
              <Row md={3}>
                {products.map((product) => (
                  <Col sx={2} className='mb-3' key={product._id}>
                    <Product product={product}></Product>
                  </Col>
                ))}
              </Row>

              <div>
                {[...Array(pages).keys()].map((x) => (
                  <LinkContainer
                    key={x + 1}
                    className='mx-1'
                    to={{
                      pathname: "/search",
                      search: getFilterUrl({ page: x + 1 }, true),
                    }}
                  >
                    <Button
                      className={Number(page) === x + 1 ? "text-bold" : ""}
                      variant='light'
                    >
                      {x + 1}
                    </Button>
                  </LinkContainer>
                ))}
              </div>
            </>
          )}
        </Col>
      </Row>
    </div>
  );
}
