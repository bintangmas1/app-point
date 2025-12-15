import { Link } from "react-router-dom";


interface DataType {
    id: number;
    img: string;
    title: string;
    link: string;
}

const bands_data: DataType[] = [
    { id: 1, img: "/assets/img/menus/worker.png", title: "Pegawai", link: "worker" },
    { id: 2, img: "/assets/img/menus/team.png", title: "Pelanggan", link: "customer" },
    { id: 3, img: "/assets/img/menus/history.png", title: "Riwayat", link: "logs" },
];

const Menus = () => {
    return (
        <>
            <div className="pt-3"></div>
            <div className="container direction-rtl">
                <div className="card mb-3">
                    <div className="card-body">
                        <div className="row g-3">
                            {bands_data.map((item, i) => (
                                <div key={i} className="col-4">
                                    <Link to={`/${item.link}`}>
                                        <div className="feature-card mx-auto text-center">
                                            <div className="card mx-auto bg-gray">
                                                <img src={item.img} alt="" />
                                            </div>
                                            <p className="mb-0">{item.title}</p>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Menus;
