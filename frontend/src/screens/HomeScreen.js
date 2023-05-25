//import data from "../data";
//import { Link } from "react-router-dom";
import { useEffect, useReducer } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";
import logger from "use-reducer-logger";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Product from "../components/Product";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import "../css/GalleryScreen.css";
import "../App.css";
import SearchScreen from "./SearchScreen";
//PANTALLA DE INICIO
//Definimos un reductor para gestionar el estado del componente HOME con FETCH REQUESTE (solicitud de datos) FETCH SUCESS (éxito en obtención de datos) y FETCH FAIL (error al botener datos)

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, products: action.payload, loading: false };

    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

//HOOK useReducer para incializar el estado (inicial com matriz vacía y un indicador de carga con un true o mensaje de error)
function HomeScreen() {
  const [{ loading, error, products }, dispatch] = useReducer(logger(reducer), {
    products: [],
    loading: true,
    error: "",
  });
  //const [products, setProducts] = useState([]);

  //HOOK useEffect para solicitar a la API la obtención de datos
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await Axios.get("https://api.amaiie.javiergonzalez.site/api/products/");
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: err.message });
      }

      // setProducts(result.data);
    };
    fetchData();
  }, []);
  //Devolvemos una estructura de elementos JSX(similar a HTML) para mostrar la página de inicio
  //cada elemento de la galería es un Link que dirige a la página en función de la categoría
  return (
    <div>
      <div>
        {/* Agrega los elementos de texto decorativo aquí */}
        <div className='decorative-text'>
          <div className='decorative-text-line'></div>
          <div className='decorative-text-content'>
            <div className='artista'>
              Artistas con Mucho <strong className='color-verde'>Arte</strong>
              <br></br>que transmiten Inspiración I
              <strong className='color-verde'> Emociones</strong>
            </div>
            <div className='arte'>
              01 <strong className='color-verde'>Artistas</strong> ...
            </div>
            <div className='inspiracion'>
              <strong className='color-verde'>Esencia </strong>
              capturada
            </div>
          </div>
        </div>

        <div className='container'>
          <Row className='gallery-grid'>
            <Col md={11} className='gallery-item1'>
              <div className='gallery-item'>
                <Link to='/search?category=ceramicas'>
                  <img
                    src='./images/handmade2.png'
                    alt='Imagen 1'
                    className='gallery-image'
                  />
                  <div className='gallery-item-text'>Cerámicas</div>
                </Link>
              </div>
            </Col>

            <Col md={5} className='gallery-item2'>
              <div className='gallery-item'>
                <Link to='/search?category=joyeria'>
                  <img
                    src='./images/joyeria.png'
                    alt='Imagen 2'
                    className='gallery-image'
                  />
                  <div className='gallery-item-text'>Joyería</div>
                </Link>
              </div>
            </Col>

            <Col md={5} className='gallery-item3'>
              <div className='gallery-item'>
                <Link to='/search?category=artesania'>
                  <img
                    src='./images/bolasanta.png'
                    alt='Imagen 3'
                    className='gallery-image'
                  />
                  <div className='gallery-item-text'>Artesania</div>
                </Link>
              </div>
            </Col>

            <Col md={5} className='gallery-item4'>
              <div className='gallery-item'>
                <Link to='/search?category=textil'>
                  <img
                    src='./images/textil.jpg'
                    alt='Imagen 4'
                    className='gallery-image-5'
                  />
                  <div className='gallery-item-text'>Textil</div>
                </Link>
              </div>
            </Col>

            <Col md={10} className='gallery-item5'>
              <div className='gallery-item'>
                <Link to='/search?category=decoracion'>
                  <img
                    src='./images/decor.png'
                    alt='Imagen 5'
                    className='gallery-image-5'
                  />
                  <div className='gallery-item-text'>Decoración</div>
                </Link>
              </div>
            </Col>
          </Row>
        </div>
      </div>
      <Helmet>
        <title>Amaiie</title>
      </Helmet>

      <h1 className='color-verde'>Productos</h1>
      {/*  <SearchScreen /> */}
      <div className='products'>
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant='danger'> {error}</MessageBox>
        ) : (
          <Row>
            {products.map((product) => (
              <Col key={product.slug} sm={6} md={4} lg={3} className='mb-3'>
                <Product product={product}></Product>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}
export default HomeScreen;
