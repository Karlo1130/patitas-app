import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function CardFollowUp({estado, color, fecha, titulo, descripcion, datos}) {
    return (
        <div>
            <div className="card" style={{ width: '18rem' }}>
                <div className="card-body">
                    <h5 className="card-title">{titulo}</h5>
                    <p className="card-text">
                       {descripcion}
                    </p>
                    <p>
                        {datos}
                    </p>
                </div>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                        <span>Estado: </span> 
                        <span 
                            className="badge" 
                            style={{
                                backgroundColor: '#F8D7DA', 
                                color: color,
                                color: '#58151C', 
                                padding: '0.5em 1em', 
                                borderRadius: '0.25rem', 
                                fontSize: '0.75em', 
                                fontWeight: 'bold'
                            }}>
                            {estado}
                        </span>
                    </li>
                    <li className="list-group-item">Fecha: {fecha}</li>
                </ul>
                
            </div>
        </div>
    );
}

export default CardFollowUp;
