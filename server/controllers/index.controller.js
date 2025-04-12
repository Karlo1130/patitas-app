import { pool } from '../db.js'

export const getIndex = (req, res) => {
    res.send('Obteniendo index');
}

export const getCards = async (req, res) => {
    
    console.log('inicio getCards')

    try {
        
        let lastId;
        try {
            //obtene el ultimo id registrado en Animal
            [lastId] = await pool.query(
                `SELECT id_animal FROM animal
                 ORDER BY id_animal DESC
                 LIMIT ?`, [1]
            );

            console.log('last id: ', lastId)
            
        } catch (error) {
            console.error('Error al obtener animales: ',error)
            res.status(500).send('Ha ocurrido un error interno')
        }

        //verifica que se obtuvo un resultado y lo guarda
        let ultimoRegistro = 0;
        if (lastId && lastId.length > 0) {
            ultimoRegistro = lastId[0]['id_animal'];
        } else {
            res.status(404).send('No se encontraron registros')            
        };

        //verifica si hay menos de 3 registros para deplegralos correctamente en caso positivo
        const listaAnimales = await getListaAnimales(3);

        console.log(listaAnimales)

        res.json(listaAnimales)

    } catch (error) {
        console.error('Error al procesar la solicitud: ', error);
        res.status(500).send('Ha ocurrido un error');
    }
}

//regresa la lista de animales para adoptar
async function getListaAnimales (cartasADesplegar){
    
    let result;
    try {
        //obtiene el de Animal conforme al numero obtenido
        [result] = await pool.query(
            `SELECT a.*, e.especie
             FROM
             animal a
             JOIN 
             especie e ON a.id_especie = e.id_especie
             WHERE disponible_para_adopcion = TRUE`
        );

    } catch (error) {
        console.error('Error al obtener animales: ', error)
        throw new Error('Ha ocurrido un error interno')
    }
    
    //verifica que se obtuvieron resultados
    if (result && result.length > 0) {
        
        let maximo = result.length;
        let listaAnimales = [];
        let excluidos = new Set();

        //añade animales aleatorios diferentes
        while (listaAnimales.length < cartasADesplegar) {
            let numero = Math.floor(Math.random() * maximo);

            if (!excluidos.has(numero)) {
                
                excluidos.add(numero)
                listaAnimales.push(result[numero])

            }
        }
        
        return listaAnimales;

    } else {
        return [];
    };

};
