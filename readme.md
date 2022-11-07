## use axios for fetch all api {npm install axios} it will not generate cross origin error
 ## In your react file
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const emailHandler = (e) => {
    setEmail(e.target.value);
  };
  const passwordHandler = (e) => {
    setPassword(e.target.value);
  };

 const login = async (email, password) => {
    try {
      const res = await axios({
        method: "POST",
        url: "http://localhost:3000/api/v1/login",
        data: {
          email,
          password,
        },
        xhrFields: {
          withCredentials: true,
        },
      });
      console.log(res);
      //console.log(res.data.data.user.email);
    } catch (err) {
      alert("error", "Invalid Credential");
    }
  };

 const formHandler = async (e) => {
    e.preventDefault();
    console.log(email, password);
    login(email, password);
     // console.log(data);
    setEmail("");
    setPassword("");
  };
## USER API

https://127.0.0.1:3000/api/v1/signup //SIGNUP ROUTE (http verb = post)

https://127.0.0.1:3000/api/v1/login //LOGIN ROUTE (http verb = post)

https://127.0.0.1:3000/api/v1/updateme //UPDATE NAME AND EMAIL ROUTE (http verb = patch)

https://127.0.0.1:3000/api/v1/updatepassword //UPDATE PASSWORD ROUTE (http verb = patch)

https://127.0.0.1:3000/api/v1/getablog/6360ae8cdf83b95e9b4940fd //GET BLOG DATA
https://127.0.0.1:3000/api/v1/getablog/ID (http verb = get)

/ID OF EACH BLOG PROVIDED BY ADMIN

## GET BLOG FOR GOOGLE/FACEBOOK USER

GOOGLE LOGIN
<a href="https://localhost:3000/auth/google">google login</a>
<a href="https://localhost:3000/auth/facebook/callback">facebook login</a>
<a href="https://localhost:3000/auth/logout">logout</a>

https://127.0.0.1:3000/api/v1/getblog/6360ae8cdf83b95e9b4940fd

## ADMIN API only admin can access below route

https://127.0.0.1:3000/api/v1/getallblog //ACCESS BY ADMIN GET ALL BLOG(http verb = get)

https://127.0.0.1:3000/api/v1/postablog //POST A BLOG (http verb = post)

https://127.0.0.1:3000/api/v1/updateblog/ID (http verb = patch)
ex=>https://127.0.0.1:3000/api/v1/updateblog/6360ae8cdf83b95e9b4940fd //UPDATE ANY BLOG

https://127.0.0.1:3000/api/v1/deleteblog/ID (http verb = delete)
ex=>https://127.0.0.1:3000/api/v1/deleteblog/636207d10155a55856315d2d //DLELETE BLOG

/CHANGE ID OF EVERY BLOG YOU WANT TO UPDATE

https://127.0.0.1:3000/api/v1/getalluser //get all user information (http verb = get)

## DATA MODEL

LOGIN: ex: {email,password}
SIGNUP ex: {name,email,password,passwordConfirm,phone,}

## BLOG DATA MODEL (ADMIN PANEL LOOK LIKE THIS)

BLOG: {name,photo,mainHeading,shortDescription,inPhotoTitle,paragraphDescription}

## update password need data

{passwordCurrent,password,passwordConfirm}

## SECRET KEY IN ENVIRONMENTAL VARIABLE

PORT=3000
DB_URI=8O96KCPbnoYyHtMl
JWT_SECRET="THISISAUTRINGBLOG"
JWT_EXPIRE=30d
COOKIE_EXPIRE=30
GOOGLE_SECRET=
GOOGLE_ID=
FACEBOOK_SECRET=
FACEBOOK_ID=
SOCIAL_COOKIE_SECRET_GOOGLE=my-name-is-khan-pppppppppppiiiiii
SOCIAL_COOKIE_SECRET_FACEBOOK=my-name-is-kIRAM-ppppppiiiiii
