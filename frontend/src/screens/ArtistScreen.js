import axios from "axios"; //Para hacer solicitudes HTTP y obtener datos de una API
import { useParams, useNavigate } from "react-router-dom"; //para gestionar la nevegación en la web
import { useEffect, useReducer, useState, useContext } from "react";
import { getError } from "../utils";
import { Store } from "../Store";
import Product from "../components/Product";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import "../css/ArtistScreen.scss";
import "../App.css";

// PAGINA DEL ARTISTA: Función reductor que especifica como debe cambiar el estado de la aplicación
//El reductor toma el estado actual y una acción y devuelve el estado actualizado (loading, error y user)
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, user: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
//HOOK useParams: para acceder al parámetro userbame
//HOOK useState: para almacenar y actualizar el estado de los productos
//useReducer: para gestionar el estado de la carga de la web y los errores de solicitud
function ArtistScreen() {
  //const navigate = useNavigate();
  const params = useParams();
  const { username } = params;
  const [products, setProducts] = useState([]);

  const [{ loading, error, user }, dispatch] = useReducer(reducer, {
    user: [],
    loading: true,
    error: "",
  });
  //Realizamos una solicitud de datos al servidor cuando el valor de username cambia
  //Función fetchData para enviar solicitudes HTTP utilizando Axios para obtener los datos del usuario y realcionarlos con el producto
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const response = await axios.get(`https://api.amaiie.javiergonzalez.site/api/users/username/${username}`);
        const userData = response.data;

        const products = await axios.get(`https://api.amaiie.javiergonzalez.site/api/users/${username}/products`);
        const productsData = products.data;
        setProducts(productsData);

        dispatch({ type: "FETCH_SUCCESS", payload: userData });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, [username]);
  //Nos devuelve la página del artista
  return (
    <div>
      <div>
        <div className='infoartist'>
          <div>
            <h3 className='color-verde'>{user.username}</h3>
          </div>
          <div>
            <p>{user.description}</p>
          </div>
        </div>
        <div className='infoimagen'>
          <div className='decorative-line'></div>
          <div className='decorative-lineh'></div>
          <div className='decorative-lineV'></div>
          <div className='item2'>
            <div className='item'>
              <img
                src={`https://api.amaiie.javiergonzalez.site/uploads/${user.image}`}
                alt={user.username}
                className='image-artist'
              />
            </div>
          </div>
        </div>
      </div>

      <Row>
        {products.map((product) => (
          <Col key={product.slug} sm={6} md={4} lg={3} className='mb-3'>
            <Product product={product}></Product>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default ArtistScreen;
