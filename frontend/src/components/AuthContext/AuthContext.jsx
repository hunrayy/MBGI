import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import localforage from "localforage";


// 1. create context
const AuthContext = createContext();



// 2. Create provider
export const AuthProvider = ({children}) => {

    const navigate = useNavigate();
    const [user, setUser] = useState({
        is_user_logged: false,
        user: null
    })


//     const loginUser = (backendUser) => {
//     // 1️⃣ Update state immediately
//     setUser({ ...backendUser, is_user_logged: true });

//     // 2️⃣ Set cookie immediately
//     Cookies.set("authToken", backendUser.token, { expires: 365 });

//     // 3️⃣ Navigate immediately based on admin flag
//     if (backendUser.is_an_admin === 1) {
//         navigate(`/admin/dashboard/${import.meta.env.VITE_ADMIN_DYNAMIC_ROUTE}`, {
//             replace: true,
//         });
//     } else {
//         navigate('/', {
//             replace: true,
//             state: { justLoggedIn: true },
//         });
//     }

//     // 4️⃣ Save user in localforage in the background
//     localforage
//         .setItem("current_user", JSON.stringify(backendUser))
//         .then(() => console.log("User saved to localforage"))
//         .catch((err) => console.error("Failed to save user:", err));
// };


    const loginUser = async (backendUser) => {
        console.log("Logs in from useAuth: ", backendUser);

        // Flatten state to avoid nesting confusion
        setUser({
            ...backendUser,
            is_user_logged: true
        });

        // Set cookie
        Cookies.set("authToken", backendUser.token, { expires: 365 });

        // Save to localforage
        await localforage.setItem("current_user", JSON.stringify(backendUser));

        console.log("User logged in successfully!");

        // Navigate based on admin flag
        if (backendUser.is_an_admin === 1) {
            navigate(`/admin/dashboard/${import.meta.env.VITE_ADMIN_DYNAMIC_ROUTE}`, {
                replace: true
            });
        } else {
            navigate('/', {
                replace: true,
                state: { justLoggedIn: true }
            });
        }
    };


    // const loginUser = async (user) => {

    //     console.log("Logs in from useAuth: ", user);

    //     setUser({
    //         is_user_logged: true,
    //         user: user
    //     });

    //     //set cookie
    //     Cookies.set("authToken", user.token, { expires: 365})

    //     // const save_user = await localforage.setItem("current_user", JSON.stringify(user_to_save))
    //     const save_user = await localforage.setItem("current_user", JSON.stringify(user))

    //     if(save_user){
    //         console.log("User logged in successfully!")

    //         // navigate to the user page
    //         console.log(user)
    //         if(user.user == "admin" && user.is_an_admin == 1){
    //             navigate(`/admin/dashboard/${import.meta.env.VITE_ADMIN_DYNAMIC_ROUTE}`, {
    //                 replace: true
    //             })
    //         }
    //         else{
    //             navigate('/', {
    //                 replace: true,
    //                 state: {justLoggedIn: true}
    //             });
    //         }
    //     }
    // }


    const getUserData = async() => {

        let user_data = await localforage.getItem("current_user");
 
        if(typeof user_data !== "undefined" && user_data !== null){
             console.log(user_data);
             return JSON.parse(user_data)
        }else{
 
            return null;
        }
    }

    const [loggingOutModal, setLoggingOutModal] = useState(false)
    const logoutUser = async () => {
        setLoggingOutModal(true)

        setTimeout(()=> {
            // delete the Cookies
            Cookies.remove("authToken");
                    
            // delete from localforage
            localforage.removeItem("current_user").then(() => {
                setUser({
                    is_user_logged: false,
                    user: null
                })

                // redirect the user back to home page 
                navigate("/", {
                    replace: true
                })
                setLoggingOutModal(false)
                window.location.reload()
            })
        }, 4000)
    }

    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
  const user_token = Cookies.get("authToken");

  if (user_token) {
    localforage.getItem("current_user").then((stored_user) => {
      if (typeof stored_user !== "undefined" && stored_user !== null) {
        stored_user = JSON.parse(stored_user);
        setUser({
          user: stored_user,
          is_user_logged: true
        });

        // 🚀 Instant redirect if admin
        if (stored_user.user === "admin" && stored_user.is_an_admin === 1) {
          navigate(`/admin/dashboard/${import.meta.env.VITE_ADMIN_DYNAMIC_ROUTE}`, { replace: true });
        }

      } else {
        setUser({
          user: null,
          is_user_logged: false
        });
      }
      setLoading(false);
    });
  } else {
    setUser({ user: null, is_user_logged: false });
    setLoading(false);
  }
}, [navigate]);

    // useEffect(() => {

    //     // get the user from the storage
    //     const user_token = Cookies.get("authToken");

    //     if(user_token){
    //         // the user may still be logged in
    //         localforage.getItem("current_user").then((stored_user) => {

    //             if(typeof stored_user !== "undefined"){
    //                 // the user is logged in 
    //                 stored_user = JSON.parse(stored_user);
    //                 setUser({
    //                     user: stored_user,
    //                     is_user_logged: true
    //                 })
                  
    //             }else{
    //                 // the user is def not logged in
    //                 setUser({
    //                     user: null,
    //                     is_user_logged: false
    //                 })
    //             }
    //             setLoading(false);
    //         })

    //     }else{
    //         // the user is not logged in
    //         setUser({
    //             user: null,
    //             is_user_logged: false
    //         })
    //         setLoading(false);
         
    //     }
    // }, [])


    


    return(<>
        <AuthContext.Provider value={{ loading, user, setUser, loginUser,  logoutUser }}>{children}</AuthContext.Provider>
        {loggingOutModal && <div style={{
                        width: "100%",
                        height: "100vh",
                        background: "rgba(0, 0, 0, 0.5)", // Semi-transparent black background
                        position: "fixed",
                        zIndex: 4,
                        top: "0",
                        left: "0",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "white",
                        fontSize: "24px",
                    }}>
            <div className="card" style={{textAlign: "center"}}>
                <h3 style={{padding: "30px 0px 5px 0px"}}>Logging Out &nbsp;<div className="spinner-border" role="status" style={{borderWidth: "1px", height: "20px", width: "20px"}}>
                    <span className="visually-hidden">Loading...</span>
                    </div>
                </h3>
                <hr />
                <p style={{padding: "0 100px 10px 100px"}}>You'll need to log back in</p>
            </div>
                        
        </div>}
    </>)


}


// // 3. Use the provider 
export const useAuth = () => {

    return useContext(AuthContext)

}