import React, { useState } from "react";
import { GoogleLogin } from "react-google-login";
import { useHistory } from "react-router-dom";
import Icon from "./icon";
import {
  Avatar,
  Button,
  Paper,
  Grid,
  Typography,
  Container,
} from "@material-ui/core";

import { LockOutlined } from "@material-ui/icons";

import useStyles from "./styles";

// components
import Input from "./Input";

// redux
import { useDispatch } from "react-redux";
import { signin, signup } from "../../actions/auth";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const Auth = () => {
  const classes = useStyles();

  const [isSignedup, setIsSignedup] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const history = useHistory();

  const [formData, setFormData] = useState(initialState);

  // redux
  const dispatch = useDispatch();

  // submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSignedup) {
      dispatch(signup(formData, history));
    } else {
      dispatch(signin(formData, history));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleShowPassword = () =>
    setShowPassword((prevShowPassword) => !prevShowPassword);

  const switchMode = () => {
    setIsSignedup((prevIsSignedup) => !prevIsSignedup);
    setShowPassword(false);
  };

  const googleSuccess = async (res) => {
    const result = res?.profileObj;
    const token = res?.tokenId;

    try {
      dispatch({ type: "AUTH", data: { result, token } });
      history.push("/");
    } catch (error) {
      console.log(error);
    }
  };
  const googleFailure = (error) => {
    console.log(error);
    console.log("Google Sign In was unsuccessful. Try again later");
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper className={classes.paper} elevation={3}>
        <Avatar className={classes.avatar}>
          <LockOutlined />
        </Avatar>

        <Typography variant="h5">
          {isSignedup ? "Sign Up" : "Sign In"}
        </Typography>

        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {isSignedup && (
              <>
                <Input
                  name="firstName"
                  label="First Name"
                  handleChange={handleChange}
                  autoFocus
                  half
                />
                <Input
                  name="lastName"
                  label="Last Name"
                  handleChange={handleChange}
                  half
                />
              </>
            )}

            <Input
              name="email"
              label="Email Address"
              handleChange={handleChange}
              type="email"
            />

            <Input
              name="password"
              label="password"
              handleChange={handleChange}
              type={showPassword ? "text" : "password"}
              handleShowPassword={handleShowPassword}
            />

            {isSignedup && (
              <Input
                name="confirmPassword"
                label="Repeat password"
                handleChange={handleChange}
                type="password"
              />
            )}
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            {isSignedup ? "Sign Up" : "Sign In"}
          </Button>
          <GoogleLogin
            clientId="103945977077-85pjtibrsc9p513qhpduot7k8vr31n3u.apps.googleusercontent.com"
            render={(renderProps) => (
              <Button
                className={classes.googleButton}
                color="primary"
                fullWidth
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
                startIcon={<Icon />}
                variant="contained"
              >
                Google SignIn
              </Button>
            )}
            onSuccess={googleSuccess}
            onFailure={googleFailure}
            cookiePolicy="single_host_origin"
          />
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Button onClick={switchMode}>
                {isSignedup
                  ? "already have an account? Sign In"
                  : "Dont have an account? sign up"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default Auth;
