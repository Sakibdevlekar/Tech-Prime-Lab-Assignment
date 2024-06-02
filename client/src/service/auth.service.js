import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { server } from "../constant/config";
import { userExists, userNotExists } from "../redux/reducers/auth.reducer";

const useLoginUserService = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState(null);

  const loginUserService = (data) => {
    setError("")
    setLoader(true);
    axios
      .post(`${server}/user/login`, data, { withCredentials: true })
      .then(({ data }) => {
        dispatch(userExists(data.data));
        navigate("/dashboard");
        setLoader(false);
      })
      .catch(({ response }) => {
        setError(response.data.message);
        dispatch(userNotExists());
        setLoader(false);
      });
  };

  return { loginUserService, loader, error };
};

export { useLoginUserService};
