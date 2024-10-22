const axios = require('axios').default;
const TOKEN = process.env.TOKEN;

const url = `https://api.respond.io/v2/contact/phone:+593962517172`;
const config = { headers: { 'Authorization': `Bearer ${TOKEN}`, 'Content-Type': 'application/json','Accept': 'application/json, application/xml, multipart/form-data' }, timeout: 30000 };

const getContact = async (req, res) => {
  // https://api.respond.io/v2/contact/phone:+593962517172
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

const createContact = async (req, res) => {

  const { firstName, lastName, phone, email, language, countryCode } = req.body;
  try {
      const body = {
          firstName,
          lastName,
          phone,
          email,
          language,
          countryCode
      }
    const data = await axios.post(url,body,config);
    console.log(data);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.json(error);
  }
}

async function create_or_update_contact(client) {

  let phone = obtCel(client.telefono);

  // console.log(phone);
  // return false;

  const body = {
    firstName: client.cliente,
    lastName: client.cliente,
    phone: client.telefono,
    email:client.correo,
    custom_fields: [
      {
        name: "cedula",
        value: client.ruc
      },
      {
        name:"contrato",
        value:client.contrato
      },
      {
        name: "valor_vencido",
        value: client.total_tesoreria_acumulada
      },
      {
        name:"cuotas_vencidas",
        value:client.cantidad_acumulada_por_contrato
      },
      {
        name:"dias_mora",
        value:client.dias_transcurridos
      }
    ]
  };

  try {
    const url2 = `https://api.respond.io/v2/contact/create_or_update/phone:+${phone}`;
    const data = await axios.post(url2,body,config); 
    return data;
  } catch (error) {
    console.error('Error creating or updating contact:', error);
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






module.exports = { getContact, createContact,create_or_update_contact }