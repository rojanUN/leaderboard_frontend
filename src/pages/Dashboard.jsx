import { useNavigate } from "react-router-dom";

const DashboardPage = () => {

    const token = localStorage.getItem("token")

    return (
        <div>
            <p>{token}</p>
        </div>
    );
}

export default DashboardPage