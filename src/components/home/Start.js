export default function Start(props){
      return (
          <div>
              <GoogleLogin
                  clientId={cid}
                  buttonText="login with google"
                  cookiePolicy={"single_host_origin"}
                  onSuccess={loginsuccess}
                  onFailure={loginfailure}
                ></GoogleLogin>
          </div>
      )
}