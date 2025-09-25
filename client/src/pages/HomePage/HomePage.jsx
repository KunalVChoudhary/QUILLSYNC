import Navbar from "../../components/Navbar/Navbar";
import About from "../../components/About/About";
import Footer from "../../components/Footer/Footer";

function HomePage(){
    return(
        <>
            <div>
                <div className={`d-block `}>
                    <Navbar />
                    <About />
                    <Footer />
                </div>
            </div>
        </>
    )
};

export default HomePage;