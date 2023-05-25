import Axios from "axios";
import { useContext, useEffect, useReducer } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import { toast } from "react-toastify";
import { Store } from "../Store";
import { getError } from "../utils";
import CheckoutSteps from "../components/CheckoutSteps";
import LoadingBox from "../components/LoadingBox";
import "../App.css";
//PANTALLA DE VISTA PREVIA DEL PEDIDO
//HOOK useReducer para actulizar el estado del loading
const reducer = (state, action) => {
  switch (action.type) {
    case "CREATE_REQUEST":
      return { ...state, loading: true };
    case "CREATE_SUCCESS":
      return { ...state, loading: false };

    case "CREATE_FAIL":
      return { ...state, loading: false };
    default:
      return state;
  }
};
//Componente que contiene la lógica y la estructura de la pantalla de vista previa del pedido
//HOOK useNavigate para la navegación por las páginas de la web
//HOOK useReducer para el loading o carga de la web
//HOOK use Context para obtener los datos de la vista previa del pedido
function PlaceOrderScreen() {
  const navigate = useNavigate();

  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
  });

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  //Cálculo de precios
  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; // 123.2345 => 123.23
  cart.itemsPrice = round2(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );

  cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10);
  cart.taxPrice = round2(0.21 * cart.itemsPrice);
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;
  // Función que se ejecuta cunado el usuario hace clik en el pedido
  //Realiza una solicitud HTTP utilizando Axios para enviar los detalles del pedido al servidor
  //Si la solicitud es correcta, se puede borrar el carrito, muestra un mensaje de éxito y te redirige a la página del pedido
  //Si la solicitud no es correcta, muestra una notificación de error
  const placeOrderHandler = async () => {
    try {
      dispatch({ type: "CREATE_REQUEST" });
      const { data } = await Axios.post(
        "https://api.amaiie.javiergonzalez.site/api/orders",
        {
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      ctxDispatch({ type: "CART_CLEAR" });
      dispatch({ type: "CREATE_SUCCESS" });
      localStorage.removeItem("cartItems");
      navigate(`/order/${data.order._id}`);
    } catch (err) {
      dispatch({ type: "CREATE_FAIL" });
      toast.error(getError(err));
    }
  };
  //HOOK useEffect  para verificar si se ha seleccionado el método de pago
  //Si no se ha seleccionado, te redirige a la página de pago
  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate("/payment");
    }
  }, [cart, navigate]);
  //Devolvemos una estructura JSX(similar a HTML) con la vista previa del pedido y mensaje de carga
  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
      <Helmet>
        <title>Vista previa del pedido</title>
      </Helmet>
      <h1 className='my-3 color-verde'>Vista previa del pedido</h1>
      <Row>
        <Col md={8}>
          <Card className='mb-3'>
            <Card.Body>
              <Card.Title className='color-verde'> Envío </Card.Title>
              <Card.Text>
                <strong>Nombre:</strong> {cart.shippingAddress.fullName} <br />
                <strong>Dirección:</strong> {cart.shippingAddress.address}{" "}
                <br />
                {cart.shippingAddress.city}, {cart.shippingAddress.postalCode},
                {cart.shippingAddress.country}
              </Card.Text>
              <Link to='/shipping'>Editar</Link>
            </Card.Body>
          </Card>
          <Card className='mb-3'>
            <Card.Body>
              <Card.Title className='color-verde'> Pago </Card.Title>
              <Card.Text>
                <strong>Método de pago:</strong> {cart.paymentMethod}
              </Card.Text>
              <Link to='/payment'>Editar</Link>
            </Card.Body>
          </Card>
          <Card className='mb-3'>
            <Card.Body>
              <Card.Title className='color-verde'> Productos </Card.Title>
              <ListGroup variant='flush'>
                {cart.cartItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className='align-items-center'>
                      <Col md={6}>
                        <img
                          src={`https://api.amaiie.javiergonzalez.site/fotoproducto/${item.image}`}
                          alt={item.nameproduct}
                          className='img-fluid rounded img-thumbnail'
                        ></img>
                        <Link to={`/product/${item.slug}`}>
                          {item.nameproduct}
                        </Link>
                      </Col>
                      <Col md={3}>
                        <span>{item.quantity}</span>
                      </Col>
                      <Col md={3}>
                        <span>{item.price}€</span>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Link to='/cart'>Editar</Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title className='color-verde'>
                {" "}
                Resumen del pedido
              </Card.Title>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <Row>
                    <Col>Productos</Col>
                    <Col>{cart.itemsPrice.toFixed(2)}€</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Envío</Col>
                    <Col>{cart.shippingPrice.toFixed(2)}€</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Impuestos</Col>
                    <Col>{cart.taxPrice.toFixed(2)}€</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong className='color-verde'>Total pedido</strong>
                    </Col>
                    <Col>{cart.totalPrice.toFixed(2)}€</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <div className='d-grid'>
                    <Button
                      className='custom-button'
                      type='button'
                      onClick={placeOrderHandler}
                      disabled={cart.cartItems.length === 0}
                    >
                      Pedido
                    </Button>
                  </div>
                  {loading && <LoadingBox></LoadingBox>}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default PlaceOrderScreen;
