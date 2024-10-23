const axios = require('axios').default;
const TOKEN = process.env.TOKEN;

const url2 = `https://api.respond.io/v2/contact/create_or_update/phone:+numberPhone`;
const config = { headers: { 'Authorization': `Bearer ${TOKEN}`, 'Content-Type': 'application/json', 'Accept': 'application/json, application/xml, multipart/form-data' }, timeout: 30000 };

const getContact = async (req, res) => {
  const options = {
    method: 'GET',
    url: 'https://api.respond.io/v2/contact/phone:+593962517172',
    headers: {
      Accept: 'application/json',
      Authorization: process.env.TOKEN
    }
  };

  try {
    const { data } = await axios.request(options);
    console.log(data);
    res.json(data);
  } catch (error) {
    console.error(error);
  }
}


async function create_or_update_contact_old(client) {

  let phone = obtCel(client.telefono);

  const body = {
    firstName: client.cliente,
    lastName: client.cliente,
    language: 'es',
    countryCode: 'EC',
    custom_fields: [
      {
        name: "cedula",
        value: client.ruc
      },
      {
        name: "contrato",
        value: client.contrato
      },
      {
        name: "valor_vencido",
        value: client.total_tesoreria_acumulada
      },
      {
        name: "cuotas_vencidas",
        value: client.cantidad_acumulada_por_contrato
      },
      {
        name: "dias_mora",
        value: client.dias_transcurridos
      }
    ]
  };

  try {

    let correo = validarEmailCliente(client.correo)
    if (correo != "default@example.com") {
      body.email = client.correo
    }


    if (phone != undefined) {
      console.log(phone)
      body.phone = phone
      let url = formatResponse(url2, phone);
      const data = await axios.post(url, body, config);
      return data;
    }

    return false;

  } catch (error) {
    console.error('Error creando o actualizando contacto:', error);
    throw error;
  }
}

function obtCel(array) {
  if (array !== "" && array !== null) {
    array = array.split(" ");
    const patron = /\([DE]\)/g;
    for (let cel of array) {
      cel = cel.replace(patron, "");
      if (cel.length === 10 && cel.startsWith("09")) {
        return '593' + cel.slice(1);
      }
      if (cel.length === 9) {
        return '593' + cel;
      }
    }
  } else {
    return "";
  }
}


function esCorreoValido(correo) {
  const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return regex.test(correo);
}

function validarEmailCliente(correo) {
  if (!correo || !esCorreoValido(correo)) {
    correo = "default@example.com";
  }
  return correo;
}

// Función para reemplazar el placeholder ${phone} con el teléfono del contacto
const formatResponse = (messageTemplate, phone) => {
  return messageTemplate.replace('+numberPhone', '+' + phone);
};


async function create_or_update_contact(client, retryCount = 0) {
  try {

    let phone = obtCel(client.telefono);

    const body = {
      firstName: client.cliente,
      lastName: client.cliente,
      language: 'es',
      countryCode: 'EC',
      custom_fields: [
        {
          name: "cedula",
          value: client.ruc
        },
        {
          name: "contrato",
          value: client.contrato
        },
        {
          name: "valor_vencido",
          value: client.total_tesoreria_acumulada
        },
        {
          name: "cuotas_vencidas",
          value: client.cantidad_acumulada_por_contrato
        },
        {
          name: "dias_mora",
          value: client.dias_transcurridos
        }
      ]
    };

    let correo = validarEmailCliente(client.correo)
    if (correo != "default@example.com") {
      body.email = client.correo
    }


    if (phone != undefined) {
      console.log(phone)
      body.phone = phone
      let url = formatResponse(url2, phone);
      const response = await axios.post(url, body, config);
      if (response.data && response.data.code === 449) {
        throw new Error('Request in queue, retry later');
      }
      return response;
    }

  } catch (error) {
    if (error.message === 'Request in queue, retry later' && retryCount < MAX_RETRIES) {
      const waitTime = Math.pow(2, retryCount) * 1000; // Backoff exponencial
      console.log(`Reintentando en ${waitTime / 1000} segundos...`);
      await new Promise(resolve => setTimeout(resolve, waitTime)); // Esperar antes de reintentar
      return create_or_update_contact(clientdata, retryCount + 1); // Reintenta con un contador incrementado
    } else {
      console.error('Error al procesar el contacto:', error.message);
    }
  }
}


module.exports = { getContact, create_or_update_contact }