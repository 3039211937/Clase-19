
function randomMiddleware (request, response, next){

    //Determina la suerte del cliente
    const numero = Math.random()

    if(numero >= 0.5){
        request.suerte = true
    }
    else {
        request.suerte = false
    }

    next()
}

export default randomMiddleware