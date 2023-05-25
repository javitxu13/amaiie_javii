import { useContext, useReducer } from "react";
import { Helmet } from "react-helmet-async";
import { Store } from "../Store";
import Axios from "axios";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import MessageBox from "../components/MessageBox";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMinusCircle,
  faPlusCircle,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import "../App.css";
//PAGINA CARRITO: componentes de Bootstrap y fortawesome oara la interfaz
//HOOK useNavigate: para la navegación por la web
//HOOK useContext: para extraer el contexto del Store
//Objeto cart con la propieda cartItems (elementos del carrito)
export default function CartScreen() {
  const navigate = useNavigate();

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;
  //Función para la actualización del carrito
  //Realizamos una solicitud HTTP con Axios para obtener los datos del producto
  //Si la cantidad es mayor al stock se muestra una alerta y no se actualiza
  //Si hay suficiente stock envia una acción para agregar y actualizar el carrito
  const updateCartHandler = async (item, quantity) => {
    const { data } = await Axios.get(`https://api.amaiie.javiergonzalez.site/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert("Sorry. Product is out of stock");
      return;
    }

    ctxDispatch({ type: "CART_ADD_ITEM", payload: { ...item, quantity } });
  };
  //Función para eliminar un elemento del carrito
  const removeItemHandler = (item) => {
    ctxDispatch({ type: "CART_REMOVE_ITEM", payload: item });
  };
  //Función para la finalización de la compra y que te lleva a tener que loguearte
  const checkoutHandler = () => {
    navigate("/signin?redirect=/shipping");
  };
  //Devolvemos la página del carrito de la compra
  return (
    <div>
      <Helmet>
        <title>Carrito de la compra</title>
      </Helmet>
      <h1 className='shoppingcart color-verde'>Carrito de la compra</h1>
      <Row>
        <Col md={8}>
          {cartItems.length === 0 ? (
            <MessageBox>
             Carrito vacío <Link to='/'> Comprar</Link>
            </MessageBox>
          ) : (
            <ListGroup>
              {cartItems.map((item) => (
                <ListGroup.Item key={item._id}>
                  <Row className='align-items-center'>
                    <Col md={4}>
                      <img
                        src={`https://api.amaiie.javiergonzalez.site/fotoproducto/${item.image}`}
                        alt={item.nameproduct}
                        className='img-fluid rounded img-thumbnail'
                      ></img>{" "}
                      <Link to={`/product/${item.slug}`}>
                        {item.nameproduct}
                      </Link>
                    </Col>
                    <Col md={3}>
                      <Button
                        onClick={() =>
                          updateCartHandler(item, item.quantity - 1)
                        }
                        variant='light'
                        disabled={item.quantity === 1}
                      >
                        <FontAwesomeIcon
                          className='color-verde'
                          icon={faMinusCircle}
                        />
                      </Button>{" "}
                      <span>{item.quantity}</span>{" "}
                      <Button
                        variant='light'
                        onClick={
                          () => updateCartHandler(item, item.quantity + 1) //onClick={() => updateCartHandler(item, item.quantity + 1)}}
                        }
                        disabled={item.quantity === item.countInStock} // puedes añadir unidades hasta alcanzar el stock que hay
                      >
                        <FontAwesomeIcon
                          className='color-verde'
                          icon={faPlusCircle}
                        />
                      </Button>
                    </Col>
                    <Col md={3}>{item.price}€</Col>
                    <Col md={2}>
                      <Button
                        variant='light'
                        onClick={() => removeItemHandler(item)}
                      >
                        <FontAwesomeIcon
                          className='color-verde'
                          icon={faTrash}
                        />
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h3 className='color-verde'>
                    Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}{" "}
                    productos):
                    {cartItems.reduce((a, c) => a + c.price * c.quantity, 0)} €
                  </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className='d-grid'>
                    <Button
                      className='custom-button'
                      type='button'
                      variant='primary'
                      onClick={checkoutHandler}
                      disabled={cartItems.length === 0}
                    >
                      Finalizar la compra
                    </Button>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
