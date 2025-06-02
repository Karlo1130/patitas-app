import React, { useEffect, useState } from "react";
import MainPage from "../MainPage";
import foto from "../../assets/portada1.jpg";
import { Link } from "react-router-dom";
import { getCardsRequest } from "../../api/home.api";
import Card from "../Card";

function Home() {
  const [cards, setCards] = useState([]);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  useEffect(() => {
    async function loadCards() {
      const response = await getCardsRequest();
      setCards(response.data);
      console.log(response);
    }
    loadCards();
  }, []);

  return (
    <div>
      <MainPage>
        <div
          style={{
            height: "100vh",
          }}
        >
        <div >
            <div className="row">
                <div className="col-12 col-md-6">
                    <div className="">
                        <img
                        src={foto}
                        alt="Patitas"
                        className="img-fluid"
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            position: "absolute",
                            top: 0,
                            left: 0,
                            zIndex: -1,
                        }}

                        />
                    </div>
                </div>
               
                
                <div className="col-12">

                    <div className=" " style={{ padding: "10vw 10vw" }}>
                        <h1
                        className="display-6 fw-bold lh-1 mb-3"
                        style={{ color: "white" }}
                        >
                        {" "}
                            Dale hogar a unas patitas. <br /> Haz la diferencia.
                        </h1>

                        <h4 style={{ color: "white" }}>
                            Míralos... ¿Cómo podrías decirles que no?
                        </h4>

                        <div className="d-grid gap-2 d-md-flex justify-content-md-start justify-content-center">
                            <Link to="/adoption">
                                <button
                                type="button"
                                className="btn btn-success px-4 my-4 me-md-2"
                                >
                                    Adopta unas patitas
                                </button>
                            </Link>
                        </div>
                    </div>
                    
                        
                </div>
                    
                <div className="col-12 justify-content-center align-items-center d-flex">
                    <div className="col-8 ">
                
                
                        <div className="px-5 py-2 my-5">
                            
                            <div className="d-flex flex-wrap justify-content-center">
                            {cards.map((card) => (
                                <Card
                                key={card.id_animal}
                                id_animal={card.id_animal}
                                id_usuario={user.id_usuario}
                                nombre={card.nombre}
                                descripcion={card.descripcion}
                                boton={"Adoptar"}
                                animal={card.animal}
                                imagenes={card.foto_animal}
                                />
                            ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">

            </div>
          </div>
        </div>
    
      </MainPage>
    </div>
  );
}

export default Home;
