import { useState, useEffect } from "react";
import { TbLiveView } from "react-icons/tb";
import { TbCalendarClock } from "react-icons/tb";
import { MdTrain } from "react-icons/md";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import HomePage from "./pages/HomePage";
import ArrivalInfoPage from "./pages/ArrivalInfoPage";
import StationTablePage from "./pages/StationTablePage";
import TrainTablePage from "./pages/TrainTablePage";

const App: React.FC = () => {
    const [showFullMenu, setShowFullMenu] = useState<boolean>(window.innerWidth > 768);
    const [selectedMenu, setSelectedMenu] = useState<string>(window.location.pathname);

    const handleResize = () => {
        setShowFullMenu(window.innerWidth > 768);
    };

    useEffect(() => {
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const Menus = [
        { title: "실시간 도착정보", link: "/arrival", icon: TbLiveView },
        { title: "역 시간표", link: "/station", icon: TbCalendarClock },
        { title: "열차 시간표", link: "/train", icon: MdTrain },
    ];

    return (
        <Router basename="/subway-live">
            <div className="flex flex-col min-h-screen w-screen dark:text-white">
                <div id="topPanel" className="h-[52px] bg-gray-800 dark:bg-gray-800 px-4 py-2 flex items-center justify-between">
                    <Link to="/" className="text-white px-2 py-1 hover:text-white text-xl font-semibold tracking-wide" onClick={() => setSelectedMenu("")}>
                        부산 도시철도 정보
                    </Link>
                    <ul id="menu" className="flex space-x-2">
                        {Menus.map((Menu, index) => (
                            <li key={index} className="cursor-pointer">
                                <Link
                                    to={Menu.link}
                                    className={`flex items-center space-x-2 px-2 py-1 rounded-md text-lg ${
                                        selectedMenu === Menu.link ? "bg-gray-700 dark:bg-gray-700 text-white" : "hover:bg-gray-700 dark:hover:bg-gray-700 text-gray-300 dark:text-gray-400"
                                    }`}
                                    onClick={() => setSelectedMenu(Menu.link)}
                                >
                                    <Menu.icon size={24} className="text-white b-1" />
                                    {showFullMenu && <span className="text-white font-medium">{Menu.title}</span>}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div id="main" className="mt-[max(2vh,calc(15vh-100px))] grow p-1 text-center bg-gray-100 dark:bg-gray-900">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/arrival" element={<ArrivalInfoPage />} />
                        <Route path="/station" element={<StationTablePage />} />
                        <Route path="/train" element={<TrainTablePage />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;
