import { useState } from "react";
import { BottomWarning } from "../components/BottomWarning";
import Button from "../components/Button";
import Heading from "../components/Heading";
import InputBox from "../components/InputBox";
import SubHeading from "../components/SubHeading";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";

const Signin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate()

    const handleClick = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/v1/auth/signin`, { userName: email, password })
            localStorage.setItem("token", data.token);
            navigate("/", { replace: true })
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="bg-slate-300 h-screen flex justify-center">
            <div className="flex flex-col justify-center">
                <div className="rounded-lg bg-white w-96 text-center p-2 h-max px-4">
                    <Heading label={"Sign in"} />
                    <SubHeading
                        label={"Enter your credentials to access your account"}
                    />
                    <InputBox
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="jayant@gmail.com"
                        label={"Email"}
                    />
                    <InputBox
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="123456"
                        label={"Password"}
                    />
                    <div className="pt-4">
                        <Button onClick={handleClick} label={"Sign in"} />
                    </div>
                    <BottomWarning
                        label={"Don't have an account?"}
                        buttonText={"Sign up"}
                        to={"/signup"}
                    />
                </div>
            </div>
        </div>
    );
};

export default Signin;
