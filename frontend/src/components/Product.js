import { useContext } from "react";
import { Store } from "../Store";
import "../css/ArtistScreen.scss";
//Definimos el componente producto con los props que contienen su info
//HOOK Use Context para acceder al contexto de la aplicación Store y ver el estado del carrito
function Product(props) {
  const { product } = props;
  const { state, dispatch: ctxDispatch } = useContext(Store);

  const {
    cart: { cartItems },
  } = state;
  //Para agregar el producto al carrito, verificamos si el producto existe y actualiza la cantidad
  //Verificamos si hay unidades en stock antes de agregarlo al carrito
  //Si no hay stock, envía un mensaje de producto agotado y si hay stock lo añade al carrito
  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1; //tiene que haber una unidad

    if (item.countInStock < quantity) {
      window.alert("Sorry. Product is out of stock");
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantity },
    });
  };

  return (
    <div>
      <div class='shell'>
        <div class='container'>
          <div class='row'>
            <div class='col-md-12'>
              <div class='wsk-cp-product'>
                <div class='wsk-cp-img'>
                  <span
                    className='custom-link-text'
                    onClick={() => {
                      window.location.href = `/product/${product.slug}`;
                    }}
                  >
                    <img
                      src={`https://api.amaiie.javiergonzalez.site/fotoproducto/${product.image}`}
                      alt={product.nameproduct}
                      class='img-responsive'
                    />
                  </span>
                </div>
                <div class='wsk-cp-text'>
                  <div class='category'>
                    <span
                      className='custom-link-text'
                      onClick={() => {
                        // Handle the click event and navigate programmatically
                        // For example:
                        window.location.href = `/user/${product.user}`;
                      }}
                    >
                      {product.user}
                    </span>
                  </div>
                  <div class='title-product'>
                    <h3>
                      <span
                        className='custom-link-text'
                        onClick={() => {
                          // Handle the click event and navigate programmatically
                          // For example:
                          window.location.href = `/product/${product.slug}`;
                        }}
                      >
                        {product.nameproduct}
                      </span>
                    </h3>
                  </div>
                  <div class='description-prod'>{product.category}</div>
                  <div class='card-footer'>
                    <div class='wcf-left'>
                      <span class='price'>{product.price}€</span>
                    </div>
                    <div class='wcf-right'>
                      {product.countInStock === 0 ? (
                        <span className='out-of-stock'>Agotado</span>
                      ) : (
                        <span
                          className='add-to-cart'
                          onClick={() => addToCartHandler(product)}
                        >
                          Comprar
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product;
