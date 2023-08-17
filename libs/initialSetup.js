
const createEstado = async (Estado) => {

    try {
        const estado = await Estado.findAndCountAll({
            where: {}
        });
     
        const counta = estado.count
        if (counta > 0) return;

        await Promise.all([
            Estado.create({
                name: 'ACTIVO',
            }),
          
            Estado.create({
                name: 'INACTIVO'
            }),
         
        ])



    } catch (error) {
        console.error(error)
    }
}

export default createEstado;
