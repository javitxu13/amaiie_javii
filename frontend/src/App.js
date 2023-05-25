//Importamos principlamente las rutas y las diferentes páginas
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import Axios from "axios";
import ProductScreen from "./screens/ProductScreen";
import Navbar from "react-bootstrap/Navbar";
import Badge from "react-bootstrap/Badge";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Container from "react-bootstrap/Container";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import { useReducer, useContext, useEffect, useState } from "react";
import { Store } from "./Store";
import SigninScreen from "./screens/SigninScreen";
import SignupScreen from "./screens/SignupScreen";
import CartScreen from "./screens/CartScreen";
import SearchBox from "./components/SearchBox";
import SearchScreen from "./screens/SearchScreen";
import AdminRoute from "./components/AdminRoute";
import ProductListScreen from "./screens/ProductListScreen";
import ProductEditScreen from "./screens/ProductEditScreen";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getError } from "./utils";
import ShippingAddressScreen from "./screens/ShippingAddressScreen";
import PaymentMethodScreen from "./screens/PaymentMethodScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderScreen from "./screens/OrderScreen";
import AvisoLegal from "./screens/AvisoLegal";
import Button from "react-bootstrap/esm/Button";
import ContactoScreen from "./screens/ContactoScreen";
import NosotrosScreen from "./screens/NosotrosScreen";
import PrivacidadScreen from "./screens/PrivacidadScreen";
import CookiesScreen from "./screens/CookiesScreen";
import ProfileScreen from "./screens/ProfileScreen";
import OrderHistoryScreen from "./screens/OrderHistoryScreen";
import ArtistScreen from "./screens/ArtistScreen";
import ProtectedRoute from "./components/ProtectedRoute";
import EditArtistScreen from "./screens/EditArtistScreen";
import ProductArtistScreen from "./screens/ProductArtistScreen";
import UserEditScreen from "./screens/UserListScreen";
import UserListScreen from "./screens/UserEditScreen";
import "./App.css";

//Función principal que define la estructura y el comportamiento de la aplicación
//HOOKS: useState(cambios de estado), useContext (obtener datos contexto Store), ambos para gestionar y compartir información entre componentes
function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { fullBox, cart, userInfo } = state;

  const signoutHanlder = () => {
    ctxDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("shippingAddress");
    localStorage.removeItem("paymentMethod");
    window.location.href = "/signin"; //si no estás logeado te lleva al signin
  };
  // Filtro por categorías con HOOK useState para cambios de estado al seleccionar una de lellas
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await Axios.get(`https://api.amaiie.javiergonzalez.site/api/products/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err)); //notificación de error
      }
    };
    fetchCategories();
  }, []);
  //Cnfiguración de las rutas de la aplicación
  return (
    <BrowserRouter>
      {/* <div
        className={
          sidebarIsOpen
            ? fullBox
              ? "site-container active-cont d-flex flex-column full-box"
              : "site-container active-cont d-flex flex-column"
            : fullBox
            ? "site-container d-flex flex-column full-box"
            : "site-container d-flex flex-column"
        }
      > */}
      <div className='d-flex flex-column site-container' /* className='App' */>
        <ToastContainer position='bottom-center' limit={1} />
        <Navbar bg='light' variant='light' className='fixed-top shadow'>
          <Container>
            <LinkContainer to='/'>
              <Navbar.Brand className='color-verde'>Amaiie</Navbar.Brand>
            </LinkContainer>
            {/*  <Navbar.Toggle aria-controls='basic-navbar-nav' />
              <Navbar.Collapse id='basic-navbar-nav'> */}
            <SearchBox />

            <Nav className='ml-auto'>
              <Link to='/cart' className='nav-link custom-link'>
                Carrito
                {cart.cartItems.length > 0 && (
                  <Badge pill bg='danger'>
                    {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                  </Badge>
                )}
              </Link>
              <Link className='nav-link custom-link' to='/contacto'>
                Contacto
              </Link>
              <Link className='nav-link custom-link' to='/nosotros'>
                Nosotros
              </Link>

              {userInfo ? (
                <NavDropdown
                  className='custom-link-menu'
                  title={userInfo.username}
                  id='basic-nav-dropdown'
                >
                  <LinkContainer
                    className='custom-link custom-link-menu'
                    to='/profile'
                  >
                    <NavDropdown.Item className='custom-link custom-link-menu'>
                      Mi perfil
                    </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer className='custom-link' to='/orderhistory'>
                    <NavDropdown.Item className='custom-link'>
                      Mis pedidos
                    </NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Divider />
                  <Link
                    className='dropdown-item'
                    to='/signout'
                    onClick={signoutHanlder}
                  >
                    Salir
                  </Link>
                </NavDropdown>
              ) : (
                <Link className='nav-link custom-link' to='/signin'>
                  Acceder
                </Link>
              )}
              {userInfo && userInfo.isArtist && (
                <NavDropdown
                  className='custom-link'
                  title='Artist'
                  id='artist-nav-dropdown'
                >
                  <LinkContainer className='custom-link' to='/editprofile'>
                    <NavDropdown.Item>Editar perfil</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer className='custom-link' to='/artistproducts'>
                    <NavDropdown.Item>Productos</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
              {userInfo && userInfo.isAdmin && (
                <NavDropdown
                  className='custom-link'
                  title='Admin'
                  id='admin-nav-dropdown'
                >
                  {/* <LinkContainer to='/admin/dashboard'>
                    <NavDropdown.Item>Dashboard</NavDropdown.Item>
                  </LinkContainer> */}
                  <LinkContainer className='custom-link' to='/admin/products'>
                    <NavDropdown.Item title='Admin' id='admin-nav-dropdown'>
                      Productos
                    </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer className='custom-link' to='/admin/users'>
                    <NavDropdown.Item>Usuarios</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
            </Nav>
          </Container>
        </Navbar>

        <header className='App-header'>
          {/*  <Link to='/'> amaiie</Link> */}
        </header>
      </div>
      <div
        className={
          sidebarIsOpen
            ? "active-nav side-navbar d-flex justify-content-between flex-wrap flex-column"
            : "side-navbar d-flex justify-content-between flex-wrap flex-column"
        }
      ></div>
      <main>
        <Container className='mt-3'>
          <Routes>
            <Route path='/' element={<HomeScreen />}></Route>
            <Route path='/contacto' element={<ContactoScreen />} />
            <Route path='/avisolegal' element={<AvisoLegal />} />
            <Route path='/nosotros' element={<NosotrosScreen />} />
            <Route path='/privacidad' element={<PrivacidadScreen />} />
            <Route path='/cookies' element={<CookiesScreen />} />
            <Route path='/product/:slug' element={<ProductScreen />} />
            <Route path='/user/:username' element={<ArtistScreen />} />
            <Route path='/cart' element={<CartScreen />} />
            <Route path='/search' element={<SearchScreen />} />
            <Route path='/signin' element={<SigninScreen />} />
            <Route path='/signup' element={<SignupScreen />} />
            <Route path='/editprofile' element={<EditArtistScreen />} />
            <Route path='/placeorder' element={<PlaceOrderScreen />} />
            <Route path='/artistproducts' element={<ProductArtistScreen />} />

            <Route
              path='/profile'
              element={
                <ProtectedRoute>
                  <ProfileScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path='/order/:id'
              element={
                <ProtectedRoute>
                  <OrderScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path='/orderhistory'
              element={
                <ProtectedRoute>
                  <OrderHistoryScreen />
                </ProtectedRoute>
              }
            />
            <Route path='/shipping' element={<ShippingAddressScreen />} />
            <Route path='/payment' element={<PaymentMethodScreen />} />
            <Route
              path='/admin/products'
              element={
                <AdminRoute>
                  <ProductListScreen />
                </AdminRoute>
              }
            ></Route>
            <Route
              path='/admin/product/:id'
              element={
                <AdminRoute>
                  <ProductEditScreen />
                </AdminRoute>
              }
            ></Route>
            <Route
              path='/admin/user/:id'
              element={
                <AdminRoute>
                  <UserEditScreen />
                </AdminRoute>
              }
            ></Route>

            <Route
              path='/admin/users'
              element={
                <AdminRoute>
                  <UserListScreen />
                </AdminRoute>
              }
            ></Route>
          </Routes>
        </Container>
      </main>

      <footer>
        <div className='text-center'>
          <p>
            Copyright © 2023 ·
            <Routes>
              <Route path='/Avisolegal' component={AvisoLegal} />
            </Routes>
            <Link class='text-decoration-none custom-link' to='/avisolegal'>
              Aviso legal
            </Link>
            ·
            <Link class='text-decoration-none custom-link' to='/privacidad'>
              Política de privacidad
            </Link>
            ·
            <Link class='text-decoration-none custom-link' to='/cookies'>
              Política de cookies
            </Link>
          </p>
        </div>
      </footer>
    </BrowserRouter>
  );
}

export default App;
