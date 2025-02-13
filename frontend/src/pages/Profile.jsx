import { useEffect, useState } from "react";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userState } from "../state/authState";
import axios from "axios";
import { API_URL, TOKEN } from "../config";
import dateFormat from 'dateformat'
import AddMoneyModal from "../components/AddMoneyModal";

const ProfilePage = () => {
 
    const user = useRecoilValue(userState);
    const [transactions, setTransactions] = useState([])
    const [paymentRequests, setPaymentRequests] = useState([])

    const userData = useRecoilValue(userState)

    useEffect(() => {
        fetchTransactionHistory();
        fetchPaymentRequests();
    }, [])

    const fetchTransactionHistory = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/api/v1/account/history`, {
                headers: {
                    'Authorization': 'Bearer ' + TOKEN
                }
            });
            setTransactions(data);
        } catch (error) {
            console.log(error);
        }
    }

    const fetchPaymentRequests = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/api/v1/account/payment-request`, {
                headers: {
                    'Authorization': 'Bearer ' + TOKEN
                }
            });
            setPaymentRequests(data);
        } catch (error) {
            console.log(error);
        }
    }

    const navigate = useNavigate();

    const [showTransactions, setShowTransactions] = useState(false);
    const [showRequests, setShowRequests] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);

    const toggleTransactions = () => setShowTransactions(!showTransactions);
    const toggleRequests = () => setShowRequests(!showRequests);

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem("token");
        navigate("/signin")
    }

    return (
        <div className="container mx-auto p-4">

            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h2 className="text-3xl font-bold mb-4 text-gray-700">
                    Profile
                </h2>
                <p className="text-lg">
                    <strong className="font-semibold text-gray-600">
                        Name:
                    </strong>{" "}
                    {userData?.firstName + " " + userData?.lastName}
                </p>
                <p className="text-lg">
                    <strong className="font-semibold text-gray-600">
                        Email:
                    </strong>{" "}
                    {userData?.userName}
                </p>
                <p className="text-lg">
                    <strong className="font-semibold text-gray-600">
                        Phone:
                    </strong>{" "}
                    {user.phone}
                </p>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6 mb-6 flex justify-between">
                <h2 className="text-3xl font-bold mb-4 text-gray-700">
                    Balance{" "}
                    <span className="text-4xl font-bold text-green-500">
                        {" "}
                        &#8377;{user.balance.toFixed(2)}{" "}
                    </span>
                </h2>
                <button onClick={() => setShowAddModal(true)} className="flex items-center h-fit bg-green-500 text-white gap-1 px-4 py-2 cursor-pointer font-semibold tracking-widest rounded-md hover:bg-blue-400 duration-300 hover:gap-2 hover:translate-x-3">
                    Add money
                    <svg
                        className="w-5 h-5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                            strokeLinejoin="round"
                            strokeLinecap="round"
                        ></path>
                    </svg>
                </button>
                {showAddModal && < AddMoneyModal onClose={() => setShowAddModal(false)} />}
            </div>

            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h2
                    className="text-2xl font-bold mb-4 text-gray-700 cursor-pointer hover:text-blue-500"
                    onClick={toggleTransactions}
                >
                    Transaction History {showTransactions ? "▲" : "▼"}
                </h2>
                {showTransactions && (
                    <table className="min-w-full bg-white border-collapse">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b text-left text-gray-600">
                                    Name
                                </th>
                                <th className="py-2 px-4 border-b text-left text-gray-600">
                                    Amount
                                </th>
                                <th className="py-2 px-4 border-b text-left text-gray-600">
                                    Type
                                </th>
                                <th className="py-2 px-4 border-b text-left text-gray-600">
                                    Date
                                </th>
                                <th className="py-2 px-4 border-b text-left text-gray-600">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((transaction) => (
                                <tr
                                    key={transaction._id}
                                    className="hover:bg-gray-100"
                                >
                                    <td className="py-2 px-4 border-b">
                                        {transaction.toId._id == user.id ? transaction.fromId.firstName : transaction.toId.firstName}
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        &#8377;{transaction.amount}
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        {transaction.toId._id == user._id ? "Receive" : "Send"}
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        {dateFormat(transaction.updatedAt, "mmmm dS, yy, h:MM TT")}
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        Success
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="bg-white shadow-md rounded-lg p-6">
                <h2
                    className="text-2xl font-bold mb-4 text-gray-700 cursor-pointer hover:text-blue-500"
                    onClick={toggleRequests}
                >
                    Payment Requests {showRequests ? "▲" : "▼"}
                </h2>
                {showRequests && (
                    <table className="min-w-full bg-white border-collapse">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b text-left text-gray-600">
                                    Name
                                </th>
                                <th className="py-2 px-4 border-b text-left text-gray-600">
                                    Amount
                                </th>
                                <th className="py-2 px-4 border-b text-left text-gray-600">
                                    Date
                                </th>
                                <th className="py-2 px-4 border-b text-left text-gray-600">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {paymentRequests.map((request) => (

                                <tr
                                    key={request._id}
                                    className="hover:bg-gray-100"
                                >
                                    <td className="py-2 px-4 border-b">
                                        {request.fromId.firstName}
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        {request.amount}
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        {dateFormat(request.updatedAt, "mmmm dS, yy, h:MM TT")}
                                    </td>
                                    <td className="capitalize py-2 px-4 border-b">
                                        {request.status}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            <Button label={"Logout"} onClick={handleLogout} />
        </div>
    );
};

export default ProfilePage;
