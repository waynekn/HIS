import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router";
import { EyeOff, Eye } from "lucide-react";
import classNames from "classnames";

import { StoreDispatch } from "../store/store";
import { logInUser } from "../store/user/user.slice";
import { selectCurrentUser } from "../store/user/user.selector";

import { LogInCredentials, LogInFormErrors } from "../types/auth";

function LogInForm() {
  const [formValues, setFormValues] = useState<LogInCredentials>({
    username: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState<LogInFormErrors>({
    password: [],
    nonFieldErrors: [],
  });

  const [searchParams] = useSearchParams();

  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch<StoreDispatch>();
  const currentUser = useSelector(selectCurrentUser);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (currentUser.isLoading) {
      return;
    }

    setFormErrors({ password: [], nonFieldErrors: [] });
    try {
      const user = await dispatch(logInUser(formValues)).unwrap();

      const next = searchParams.get("next");
      if (next) {
        await navigate(next);
      } else {
        await navigate(`../user/${user.username}/`);
      }
    } catch (error) {
      const formErrors = error as LogInFormErrors;
      setFormErrors((prevState) => {
        return {
          ...prevState,
          ...formErrors,
        };
      });
    }
  };

  return (
    <section className="absolute h-auto w-80 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 bg-white rounded shadow-lg z-50">
      <div>
        {/* 'X' symbol */}
        <Link to="/" className="w-full flex justify-end font-bold">
          &#x2715;
        </Link>
        <header className="text-xl font-bold text-center">Login</header>
        <form method="post" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/**
             * Username field.
             */}
            <div>
              <label
                htmlFor="login"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                id="login"
                type="text"
                name="username"
                value={formValues.username}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                     focus:outline-none focus:ring-indigo-base focus:border-indigo-base sm:text-sm"
                placeholder="Enter username"
                onChange={handleChange}
                required
              />
            </div>
            {/**
             * Password field.
             */}
            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm
                 focus:outline-none focus:ring-indigo-base focus:border-indigo-base sm:text-sm"
                  value={formValues.password}
                  placeholder="Password"
                  onChange={handleChange}
                  required
                />
                {showPassword ? (
                  <EyeOff
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-sm text-gray-500 hover:text-gray-700"
                  />
                ) : (
                  <Eye
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-sm text-gray-500 hover:text-gray-700"
                  />
                )}
              </div>
            </div>

            {/**
             * Password errors errors if any.
             */}
            {formErrors.password && formErrors.password.length > 0 && (
              <ul>
                {formErrors.password.map((error) => (
                  <li key={error} className="text-red-600 text-sm">
                    {error}
                  </li>
                ))}
              </ul>
            )}

            <button
              type="submit"
              className={classNames(
                "w-full bg-indigo-base  text-white p-2 rounded-md mt-4 ",
                currentUser.isLoading
                  ? "cursor-not-allowed"
                  : "cursor-pointer hover:bg-indigo-secondary"
              )}
              disabled={currentUser.isLoading}
            >
              Login
            </button>
          </div>
          {/**
           * Non field errors.
           */}
          {formErrors.nonFieldErrors &&
            formErrors.nonFieldErrors.length > 0 && (
              <ul>
                {formErrors.nonFieldErrors.map((error) => (
                  <li key={error} className="text-red-600 text-sm">
                    {error}
                  </li>
                ))}
              </ul>
            )}

          <p className="mt-2">
            Don’t have an account?
            <Link to="../signup" className="text-blue-500 underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}
export default LogInForm;
