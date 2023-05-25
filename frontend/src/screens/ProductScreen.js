import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useReducer, useContext } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import { Helmet } from "react-helmet-async";
import Card from "react-bootstrap/Card";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { getError } from "../utils";
import { Store } from "../Store";
import "../App.css";
//PAGINA DE PRODUCTO ESPECIFICO
//Función reducer  para actualizar el estado del componente en respuesta al loading, error y product
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, product: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
//Componente principal de cada uno de los productos
//HOOK useNavigate: para la función de navegación por las diferentes webs
//HOOK useParams: para obtener la información de la URL
function ProductScreen() {
  const navigate = useNavigate();
  const params = useParams();
  const { slug } = params;

  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    product: [],
    loading: true,
    error: "",
  });
  //Solicitud HTTP para obtener los datos del producto desde el servidor
  //Si la solicitud es correcta, se actualiza con los datos del producto
  //Si hay error, envía mensaje de error
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const response = await axios.get(`https://api.amaiie.javiergonzalez.site/api/products/slug/${slug}`);
        const productData = response.data;
        dispatch({ type: "FETCH_SUCCESS", payload: productData });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, [slug]);
  //HOOK useContext: para acceder los datos del contexto Store y actualizar el estado del carrito
  //Función de añadir al carrito, verifica si el producto está en el carrito y lo actuliza
  //Verifica si hay stock y muestra una alerta si no hay unidades
  //Agrega al acarrito y redirige al usuario a la página del carrito
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart } = state;
  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;

    /*  const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) { */
    if (product.countInStock < quantity) {
      window.alert("Sorry. Product is out of stock");
      return;
    }

    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity: 1 },
    });

    navigate("/cart");
  };
  //El componente renderiza contenido condicional en función del estado actual
  //Si loading es verdadero, muestra un componente de carga (LoadingBox)
  //Si hay un error, muestra un mensaje de error (MessageBox)
  //Y si no muestra los detalles del producto
  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant='danger'> {error}</MessageBox>
  ) : (
    <div>
      <Row>
        <Col md={6}>
          <img
            src={`https://api.amaiie.javiergonzalez.site/fotoproducto/${product.image}`}
            className='img-large'
            alt={product.nameproduct}
          ></img>
        </Col>
        <Col md={3}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <Helmet>
                <title>{product.nameproduct}</title>
              </Helmet>
              <h1 className='color-verde'>{product.nameproduct}</h1>
            </ListGroup.Item>
            <ListGroup.Item>Precio : {product.price}€</ListGroup.Item>
            <ListGroup.Item>
              Descripción : <p>{product.description}</p>
            </ListGroup.Item>
            <ListGroup.Item>
              Artista : 
              <span
               onClick={() => { window.location.href = `/user/${product.user}`;
              }}><p>{product.user}</p></span> 
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card className='cardposition'>
            <Card.Body>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <Row>
                    <Col>Precio:</Col>
                    <Col>{product.price}€</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Estado:</Col>
                    <Col>
                      {product.countInStock > 0 ? (
                        <Badge bg='success'>En Stock</Badge>
                      ) : (
                        <Badge bg='danger'>Agotado</Badge>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>

                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <div className='d-grid'>
                      <Button
                        className='custom-button'
                        onClick={addToCartHandler}
                        variant='primary'
                      >
                        Añadir al carrito
                      </Button>
                    </div>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
export default ProductScreen;
