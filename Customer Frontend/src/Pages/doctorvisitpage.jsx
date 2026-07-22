import { usePostMethod } from "../components/postMethod";
import '../App.css'
import Header from "../components/header";
import Footer from "../components/footer";
import { Link } from "react-router-dom";

function DoctorVisit() {

    const data = usePostMethod();

    return (
        <>
            <Header />
            <div className="cards bg-body-tertiary">
                <div className="container d-flex gap-4 pt-5 pb-5">
                    {
                        data.map((item) => (
                            <div className="card rounded-4 h-100" style={{ width: '18rem' }} key={item._id}>
                                <img src={item.media.image.path} className="card-img-top rounded-top-4" />
                                <div className="card-body align-items-center justify-content-center mt-3">
                                    <h5 className="card-title text-center">{item.name.en}</h5>
                                    <p className="card-text text-center">AED</p>
                                    <div className="t1">
                                        <Link to='#' className="text-decoration-none d-flex align-items-center justify-content-center">
                                            <button className="button-1 d-flex align-items-center justify-content-center mt-3">
                                                Book Now
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                                {console.log("Item" , item)}
                            </div>
                        ))
                    }
                </div>
            </div >
            <Footer />
        </>
    )
}

export default DoctorVisit;
