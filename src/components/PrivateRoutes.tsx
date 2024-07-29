import { useAuth } from "../features/Login/AuthContext"

interface Props {
    component: React.ComponentType<any>;
    path: string;
    exact?: boolean;
}

export const PrivateRoutes = () => {
    const { isAuthenticated } = useAuth();
    if(!isAuthenticated){
        return("nejsi přihlášen")
    }
    return(
        "test"
    )
}