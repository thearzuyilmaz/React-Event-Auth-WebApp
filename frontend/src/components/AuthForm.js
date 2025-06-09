import { Form, useSearchParams, Link, useActionData, useNavigation } from "react-router-dom";

import classes from "./AuthForm.module.css";

function AuthForm() {
  const data = useActionData();
  const navigation = useNavigation();
  const [searchParams] = useSearchParams(); // / isareti sonrasini parse ediyor

  console.log(searchParams.get("mode")); // null döner
  const isLogin = searchParams.get("mode") !== "signup"; // if not signup then isLogin is true
  const isSubmitting = navigation.state === 'submitting';

  // setState'e gerek yok çünkü URL değişimi component'i re-render ettiriyor.

  console.log(isLogin);

  return (
    <>
      <Form method="post" className={classes.form}>
        <h1>{isLogin ? "Log in" : "Create a new user"}</h1>
        {data && data.errors && (
          <div className={classes["error-banner"]}>
            <ul>
              {Object.values(data.errors).map((err) => (
                <li key={err}>{err}</li>
              ))}
            </ul>
          </div>
        )}
        {data && data.message && <p>{data.message}</p>}
        <p>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" name="email" required />
        </p>
        <p>
          <label htmlFor="image">Password</label>
          <input id="password" type="password" name="password" required />
        </p>
        <div className={classes.actions}>
          <Link to={`?mode=${isLogin ? "signup" : "login"}`}>
            {isLogin ? "Create new user" : "Login"}
          </Link>
          {/* SUBMIT BUTTON */}
          <button disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Save'}</button>
        </div>
      </Form>
    </>
  );
}

export default AuthForm;
