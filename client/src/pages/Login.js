import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/authContext';
import { useForm } from '../hooks/form';
import { useMutation } from '@apollo/react-hooks';
import { gql } from 'graphql-tag';
import { useNavigate } from 'react-router-dom';

import { TextField, Button, Container, Stack, Alert } from '@mui/material';

const LOGIN_USER = gql`
  mutation LoginUser($loginInput: LoginInput) {
    loginUser(loginInput: $loginInput) {
      email
      username
      token
    }
  }
`;

function Login(props) {
  let navigate = useNavigate();
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState([]);

  function loginUserCallBack() {
    loginUser();
  }

  const { onChange, onSubmit, values } = useForm(loginUserCallBack, {
    email: '',
    password: '',
  });

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(proxy, { data: { loginUser: userData } }) {
      context.login(userData);
      navigate('/');
    },
    onError({ graphQLErrors }) {
      setErrors(graphQLErrors);
    },
    variables: { loginInput: values },
  });

  return (
    <Container spacing={2} maxWidth="sm">
      <h3>Login</h3>
      <p>This is the login page, login below</p>
      <Stack spacing={2} paddingBottom={2}>
        <TextField label="Email" name="email" onChange={onChange} />
        <TextField
          label="Password"
          name="password"
          type="password"
          onChange={onChange}
        />
      </Stack>
      {errors.map(function (error) {
        return <Alert severity="error">{error.message}</Alert>;
      })}
      <Button variant="contained" onClick={onSubmit}>
        Login
      </Button>
    </Container>
  );
}

export default Login;
