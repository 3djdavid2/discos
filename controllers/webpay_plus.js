
import io from '../index.js'
import pkg from 'transbank-sdk';
import 'dotenv/config'
import moment from 'moment-timezone'
moment.tz("America/Santiago").format();
const { WebpayPlus } = pkg;
const { Options, IntegrationApiKeys, Environment, IntegrationCommerceCodes } = pkg;

const url_return_s = process.env.URL_RETURN_S // 's://' para prod , '://' para dev


//CREAR transaccion y enviar a webpay**-----------------------------------

export const create = async (request, response) => {

  console.log("controller-webpay: create line 17: comienzo del create de request.query:=> ", request.body)
 
  let fechaActual = Date.now();

  let buyOrder = 'O-' + moment().format('DMMyyyy-HHmmss')
  let sessionId = moment.tz(fechaActual, "America/Santiago").format();
  let amount = +request.body.amount
  let returnUrl = request.protocol + url_return_s + request.get("host") + "/api/webpay_plus/commit";
  


  const tx = new WebpayPlus.Transaction(new Options(IntegrationCommerceCodes.WEBPAY_PLUS, IntegrationApiKeys.WEBPAY, Environment.Integration));
  const createResponse = await tx.create(buyOrder, sessionId, amount, returnUrl);

  let token = createResponse.token;
  let url = createResponse.url;

  console.log("controller-webpay: create line  34: el token webpay creado es: ", token)
 

  let viewData = {
  
    buyOrder,
    sessionId,
    amount,
    returnUrl,
    token,
    url,
  };
  response.status(200).json(viewData)//se reenvia al front y este crea un form automatico que tiene el token creado por tbk

};

export const commit = async (request, response) => {
  console.log("webpay controller, funcion export.commit aqui, inicio, debe renderizar aviso-ok", request)

  //Flujos:
  //1. Flujo normal (OK): solo llega token_ws
  //2. Timeout (más de 10 minutos en el formulario de Transbank): llegan TBK_ID_SESION y TBK_ORDEN_COMPRA
  //3. Pago abortado (con botón anular compra en el formulario de Webpay): llegan TBK_TOKEN, TBK_ID_SESION, TBK_ORDEN_COMPRA
  //4. Caso atipico: llega todos token_ws, TBK_TOKEN, TBK_ID_SESION, TBK_ORDEN_COMPRA

  var sktptelaunic = request.cookies.sktptelaunic

  console.log("request.cookies. sktptelaunic:>", sktptelaunic)

  let params = request.method === 'GET' ? request.query : request.body;
  var token = params.token_ws;
  let tbkToken = params.TBK_TOKEN;
  let tbkOrdenCompra = params.TBK_ORDEN_COMPRA;
  let tbkIdSesion = params.TBK_ID_SESION;

  let viewData = {
    token,
    tbkToken,
    tbkOrdenCompra,
    tbkIdSesion
  };


  if (token && !tbkToken) {//Flujo 1     

    console.log("Fujo 1, se hará la transaccion COMMIT EN MIDDLWARE  WEBPAYPLUS")

    const commitResponse = await (new WebpayPlus.Transaction()).commit(token);

    viewData = {
      token,
      commitResponse,
    };



    if (commitResponse.response_code == 0) {
      console.log("AUTHORIZED ok 0, commitResponse.response_code == 0");
      try {

        io.to(sktptelaunic).emit('pagar', JSON.stringify(viewData));
        //           io.emit('pagar', JSON.stringify(viewData));

      } catch (error) {
        console.log("fallo el emit del midlw")
      }
    }


    response.render("webpay_plus/aviso-ok")

    return;


  } else if (!token && !tbkToken) {//Flujo 2
    io.to(sktptelaunic).emit('anuladotiempoespera', JSON.stringify(viewData));
    // step = "El pago fue anulado por tiempo de espera.";
    // stepDescription = "En este paso luego de anulación por tiempo de espera (+10 minutos) no es necesario realizar la confirmación ";
  } else if (!token && tbkToken) {//Flujo 3

    io.to(sktptelaunic).emit('anuladoporusuario', JSON.stringify(viewData));
    // step = "El pago fue anulado por el usuario.";
    // stepDescription = "En este paso luego de abandonar el formulario no es necesario realizar la confirmación ";
  } else if (token && tbkToken) {//Flujo 4
    io.to(sktptelaunic).emit('pagoinvalido', JSON.stringify(viewData));
    // step = "El pago es inválido.";
    // stepDescription = "En este paso luego de abandonar el formulario no es necesario realizar la confirmación ";
  }

  console.log("NO se hizo el pago, ya que no es respuesta '0', esto no deberia aparecer si la respuesta es 0")
  response.render("webpay_plus/commit-error");

};


//todo solo ADMIN
export const status = async (request, response, next) => {
  let token = request.body.token;

  const statusResponse = await (new WebpayPlus.Transaction()).status(token);

  let viewData = {
    token,
    statusResponse,
  };

  response.render("webpay_plus/status", {
    step: "Estado de Transacción",
    stepDescription:
      "Puedes solicitar el estado de una transacción hasta 7 días despues de que haya sido" +
      " realizada. No hay limite de solicitudes de este tipo, sin embargo, una vez pasados los " +
      "7 días ya no podrás revisar su estado.",
    viewData,
  });

  // response.status(200).json(viewData)

};

export const refund = async (request, response, next) => {
  let { token, amount } = request.body;

  const refundResponse = await (new WebpayPlus.Transaction()).refund(token, amount);

  let viewData = {
    token,
    amount,
    refundResponse,
  };


  // response.status(200).json(viewData)

  response.render("webpay_plus/refund", {
    step: "Reembolso de Transacción",
    stepDescription:
      "Podrás pedir el reembolso del dinero al tarjeta habiente, dependiendo del monto " +
      "y el tiempo transacurrido será una Reversa, Anulación o Anulación parcial.",
    viewData,
  });
};
