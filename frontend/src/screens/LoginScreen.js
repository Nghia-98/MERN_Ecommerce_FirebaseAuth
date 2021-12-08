import jwt from 'jsonwebtoken';
import { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { login } from '../actions/userActions';
import FormContainer from '../components/FormContainer';
import { verifyEmail } from '../actions/verifyEmailActions';
import { signInWithGoogle, signInWithFacebook, auth } from '../firebaseConfig';

const LoginScreen = (props) => {
  const { history, location } = props;
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isFirebaseStateChange, setFirebaseStateChange] = useState(false);

  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;


  const searchString = location.search; // the string part of URL, after character '?'
  const searchParams = new URLSearchParams(searchString);

  const redirect = searchParams.has('redirect')
    ? searchParams.get('redirect')
    : '/';

  const verifyEmailToken = searchParams.has('verifyEmailToken')
    ? searchParams.get('verifyEmailToken')
    : '';

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user && isFirebaseStateChange) {
        console.log('firebase', user)
        handleLoginSocial(user.providerData[0]);
      }
    })

    return () => {
      unsubscribe();
      console.log('unsubcribe')
    };
    // eslint-disable-next-line
  }, [isFirebaseStateChange])

  useEffect(() => {
    //login successfully
    if (userInfo) {
      if (verifyEmailToken) {
        history.push('/profile');
        dispatch(verifyEmail(verifyEmailToken));
        return;
      } else {
        history.push(redirect);
        return;
      }
    }
    return () => {
      //
    };
  }, [dispatch, history, userInfo, redirect, verifyEmailToken]);

  const handleLoginSocial = async (data) => {
    console.log('Body token login', data);
    try {
      const token = await jwt.sign(
        {
          username: data.displayName,
          email: data.email,
          socialAccountType: data.providerId === "google.com" ? "google" : "facebook"
        },
        process.env.REACT_APP_JWT_SECRET || process.env.JWT_SECRET,
        {
          expiresIn: '30d',
        }
      );
      console.log('Social Login token', token);

      dispatch(login({ token }));
    } catch (error) {
      // dispatch action USER_LOGIN_FAIL with error
      console.log(error);
    }
  };

  const handleSignInWithFacebook = async () => {
    await signInWithFacebook();
    setFirebaseStateChange(true);
  }

  const handleSignInWithGoogle = async () => {
    await signInWithGoogle();
    setFirebaseStateChange(true);
  }

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(login({ email, password }));
  };

  return (
    <FormContainer>
      {verifyEmailToken ? (
        <h1>Sing In To Active Your Account</h1>
      ) : (
        <h1>Sign In</h1>
      )}
      {error && <Message variant='danger'>{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='email'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Enter password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type='submit' variant='primary' block>
          Continue
        </Button>
      </Form>

      <Row>
        <Col>
          <p className='text-center my-3'>or Connect With Social Media</p>
        </Col>
      </Row>

      <Row>
        <Col>
          <Button style={{ width: "100%", background: "#DB4437", outline: "none" }} onClick={handleSignInWithGoogle}>Login With Google</Button>
        </Col>
      </Row>

      <Row>
        <Col>
          <Button style={{ marginTop: "1rem", width: "100%", background: "#4582f4", outline: "none" }} onClick={handleSignInWithFacebook}>Login With Facebook</Button>
        </Col>
      </Row>

      <Row className='mt-3 py-2'>
        <Col>
          New Customer ?{' '}
          <Link to={redirect ? `/register?redirect=${redirect}` : `/register`}>
            Register
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default LoginScreen;
